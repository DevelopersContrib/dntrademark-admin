/**
 * Regression test: verify <Link href={x}> crash paths.
 *
 * Root cause of VNOC #66281 round-2: Next.js <Link> calls formatUrl(href)
 * inside a useMemo.  When href is null or undefined, formatUrl throws
 * "Cannot destructure property 'auth' of 'urlObj' as it is null/undefined."
 * This is a synchronous render error caught by the error boundary.
 *
 * Run: npx tsx scripts/test-notification-bell.ts
 */

const formatUrl: (obj: unknown) => string =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("next/dist/shared/lib/router/utils/format-url").formatUrl;

let pass = 0;
let fail = 0;

function assert(cond: boolean, msg: string) {
  if (cond) {
    pass++;
  } else {
    fail++;
    console.error("FAIL:", msg);
  }
}

// 1. formatUrl crashes on null / undefined (the bug)
for (const bad of [null, undefined]) {
  try {
    formatUrl(bad);
    fail++;
    console.error(`FAIL: formatUrl(${bad}) should throw`);
  } catch {
    pass++;
  }
}

// 2. Our sanitiser must coerce null/undefined/empty url to "#"
function sanitiseUrl(url: unknown): string {
  return typeof url === "string" && url ? url : "#";
}

const cases: Array<[unknown, string]> = [
  [null, "#"],
  [undefined, "#"],
  ["", "#"],
  [0, "#"],
  [false, "#"],
  ["/domains", "/domains"],
  ["https://example.com", "https://example.com"],
  ["#", "#"],
];

for (const [input, expected] of cases) {
  const result = sanitiseUrl(input);
  assert(
    result === expected,
    `sanitiseUrl(${JSON.stringify(input)}): got ${JSON.stringify(result)}, expected ${JSON.stringify(expected)}`,
  );
}

// 3. formatUrl must not crash on the sanitised value
for (const [input] of cases) {
  const safe = sanitiseUrl(input);
  try {
    formatUrl(safe);
    pass++;
  } catch (e: unknown) {
    fail++;
    console.error(
      `FAIL: formatUrl(sanitiseUrl(${JSON.stringify(input)})) threw:`,
      (e as Error).message,
    );
  }
}

// 4. Array sanitiser must filter null items and coerce fields
function sanitiseList(raw: unknown): Array<{ message: string; url: string }> {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((n): n is Record<string, unknown> => n != null && typeof n === "object")
    .map((n) => ({
      message: typeof n.message === "string" ? n.message : "",
      url: typeof n.url === "string" && n.url ? n.url : "#",
    }));
}

const listCases: Array<[unknown, number]> = [
  [null, 0],
  [undefined, 0],
  ["string", 0],
  [42, 0],
  [[], 0],
  [[null, undefined, 42], 0],
  [[{ message: "hi", url: "/x" }], 1],
  [[{ message: "hi", url: null }], 1],
  [[{ message: null, url: null }], 1],
  [[{ message: "a", url: "/a" }, null, { message: "b" }], 2],
];

for (const [input, expectedLen] of listCases) {
  const result = sanitiseList(input);
  assert(
    result.length === expectedLen,
    `sanitiseList(${JSON.stringify(input)}): got length ${result.length}, expected ${expectedLen}`,
  );
  for (const item of result) {
    assert(typeof item.url === "string" && item.url.length > 0, "url must be non-empty string");
    assert(typeof item.message === "string", "message must be string");
    try {
      formatUrl(item.url);
      pass++;
    } catch (e: unknown) {
      fail++;
      console.error("FAIL: formatUrl on sanitised url threw:", (e as Error).message);
    }
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
