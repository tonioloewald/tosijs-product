import { describe, expect, test } from "bun:test";
import { scrubNeedsBlob } from "./tosi-product";

// A `currentTime` scrub silently freezes on hosts that ignore Range requests
// (Cloudflare Pages, hence cdn.tosijs.net): the browser reports the video as
// unseekable and drops every currentTime write. scrubNeedsBlob decides when the
// section should fetch the video into a (always seekable) blob URL instead.

const video = (
  ranges: Array<[number, number]>,
  {
    readyState = 4,
    duration = 8,
    currentSrc = "https://cdn.example/v.mp4",
  } = {},
) => ({
  readyState,
  duration,
  currentSrc,
  seekable: { length: ranges.length, end: (i: number) => ranges[i][1] },
});

describe("scrubNeedsBlob", () => {
  test("a host without Range support ([0, 0]) needs a blob", () => {
    expect(scrubNeedsBlob(video([[0, 0]]))).toBe(true);
  });

  test("no seekable ranges at all needs a blob", () => {
    expect(scrubNeedsBlob(video([]))).toBe(true);
  });

  test("a fully seekable video is left alone", () => {
    expect(scrubNeedsBlob(video([[0, 8]]))).toBe(false);
  });

  test("before metadata we can't tell, so wait", () => {
    expect(scrubNeedsBlob(video([[0, 0]], { readyState: 0 }))).toBe(false);
    expect(scrubNeedsBlob(video([[0, 0]], { duration: NaN }))).toBe(false);
  });

  test("a blob: or data: source is never refetched", () => {
    expect(
      scrubNeedsBlob(video([[0, 0]], { currentSrc: "blob:https://x/1" })),
    ).toBe(false);
    expect(
      scrubNeedsBlob(video([[0, 0]], { currentSrc: "data:video/mp4;base64," })),
    ).toBe(false);
  });
});
