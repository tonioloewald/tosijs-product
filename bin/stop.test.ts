import { describe, expect, test } from "bun:test";
import type { LockHolder } from "tosijs-ui/site";
import { stopDecision } from "./stop";

const root = process.cwd();
const server: LockHolder = {
  pid: 4242,
  role: "dev-server",
  startedAt: 0,
  root,
  port: 8788,
};
const ours = { comm: "/opt/homebrew/bin/bun", cwd: root };

describe("stopDecision", () => {
  test("no lock holder: nothing to do", () => {
    expect(stopDecision(null, { comm: "", cwd: "" }, root).action).toBe("none");
  });

  test("our dev server: signal it", () => {
    const d = stopDecision(server, ours, root);
    expect(d).toMatchObject({ action: "signal", pid: 4242 });
    expect(d.message).toContain("port 8788");
  });

  test("a build holds the lock: refuse", () => {
    const d = stopDecision({ ...server, role: "build" }, ours, root);
    expect(d.action).toBe("refuse");
  });

  test("pid reused by a non-runtime: refuse", () => {
    const d = stopDecision(
      server,
      { comm: "/usr/sbin/cupsd", cwd: root },
      root,
    );
    expect(d.action).toBe("refuse");
    expect(d.message).toContain("stale");
  });

  test("a runtime-looking name is not enough: `bundle` is not `bun`", () => {
    expect(
      stopDecision(server, { comm: "/usr/bin/bundle", cwd: root }, root).action,
    ).toBe("refuse");
  });

  test("pid reused by a bun process in another project: refuse", () => {
    const d = stopDecision(server, { comm: "bun", cwd: "/tmp" }, root);
    expect(d.action).toBe("refuse");
  });

  test("identity unreadable: refuse rather than guess", () => {
    expect(stopDecision(server, { comm: "bun", cwd: "" }, root).action).toBe(
      "refuse",
    );
    expect(stopDecision(server, { comm: "", cwd: root }, root).action).toBe(
      "refuse",
    );
  });
});
