/*
`bun run stop` — signal THIS project's dev server, and nothing else (board #2506).

`currentHolder` (tosijs-ui/site) reads the build lock and checks the pid with
`process.kill(pid, 0)`: liveness, not identity. Locks survive SIGKILL, OOM and power loss
in the system tmpdir, and pids wrap — the 0.8.0 review found two locks on this machine
naming dead pids, one nine days old, and watched the pid counter wrap within an hour. A
stale lock whose pid has been reused would have had us SIGTERM a stranger.

So before signalling we require what upstream's own port-reclaim path requires
(`killStrayServer` in dev-server.js): the process is a JS runtime, and its cwd is this
project. We also refuse a lock held by a BUILD rather than a dev server, since killing a
build mid-`rm -rf docs/` leaves a half-written site. If identity can't be read, we don't
guess: a refusal costs ten seconds, the wrong kill costs an afternoon.
*/

import { $ } from "bun";
import { realpathSync } from "fs";
import * as path from "path";
import { currentHolder, type LockHolder } from "tosijs-ui/site";

export interface ProcessIdentity {
  /** `ps -o comm=`; empty when unreadable. */
  comm: string;
  /** The process's working directory, realpath'd; empty when unreadable. */
  cwd: string;
}

export type StopDecision =
  | { action: "none"; message: string }
  | { action: "refuse"; message: string }
  | { action: "signal"; pid: number; message: string };

const canon = (p: string) => {
  try {
    return realpathSync(p);
  } catch {
    return path.resolve(p);
  }
};

/** The whole policy, with no I/O, so every branch is testable. */
export function stopDecision(
  holder: LockHolder | null,
  identity: ProcessIdentity,
  root: string,
): StopDecision {
  if (!holder) {
    return {
      action: "none",
      message: "No dev server is running for this project.",
    };
  }
  const { pid } = holder;
  if (holder.role !== "dev-server") {
    return {
      action: "refuse",
      message:
        `pid ${pid} holds this project's lock as a build, not a dev server — not stopping it ` +
        `(a build killed mid-write leaves docs/ half-populated). Let it finish.`,
    };
  }
  if (!identity.comm || !identity.cwd) {
    return {
      action: "refuse",
      message:
        `Can't confirm pid ${pid} is our dev server (its command or cwd is unreadable), ` +
        `so not signalling it. If it is, stop it by hand; if not, the lock is stale.`,
    };
  }
  if (!/\b(bun|node|deno)$/.test(identity.comm)) {
    return {
      action: "refuse",
      message:
        `The lock names pid ${pid}, but that is now \`${identity.comm}\`, not a dev server — ` +
        `the lock is stale and the pid has been reused. Not signalling it.`,
    };
  }
  if (canon(identity.cwd) !== canon(root)) {
    return {
      action: "refuse",
      message:
        `The lock names pid ${pid}, but that process is working in ${identity.cwd}, not ` +
        `${canon(root)} — the lock is stale and the pid has been reused. Not signalling it.`,
    };
  }
  return {
    action: "signal",
    pid,
    message: `Sent SIGTERM to the dev server (pid ${pid}${
      holder.port ? `, port ${holder.port}` : ""
    }) in ${canon(root)}.`,
  };
}

async function identify(pid: number): Promise<ProcessIdentity> {
  const comm = await $`ps -p ${pid} -o comm=`
    .quiet()
    .text()
    .then((s) => s.trim())
    .catch(() => "");
  const cwd = await $`lsof -a -d cwd -p ${pid} -Fn`
    .quiet()
    .text()
    .then(
      (out) =>
        out
          .split("\n")
          .find((l) => l.startsWith("n"))
          ?.slice(1)
          .trim() ?? "",
    )
    .catch(() => "");
  return { comm, cwd };
}

/** Exit code: 0 stopped or nothing to stop, 1 refused or failed. */
export async function stopDevServer(root = "."): Promise<number> {
  const holder = currentHolder(root);
  const identity = holder ? await identify(holder.pid) : { comm: "", cwd: "" };
  const decision = stopDecision(holder, identity, root);
  if (decision.action !== "signal") {
    console.error(decision.message);
    return decision.action === "none" ? 0 : 1;
  }
  try {
    process.kill(decision.pid, "SIGTERM");
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code;
    if (code === "ESRCH") {
      console.error(`pid ${decision.pid} exited before it could be signalled.`);
      return 0;
    }
    console.error(
      code === "EPERM"
        ? `pid ${decision.pid} belongs to another user — not permitted to signal it.`
        : `Could not signal pid ${decision.pid}: ${(e as Error).message}`,
    );
    return 1;
  }
  // The receipt: what was signalled, on stderr, so it lands in whatever log captured this.
  console.error(decision.message);
  return 0;
}
