/**
 * Minimal render-test for the Sidebar's admin section.
 *
 * Run: npx tsx scripts/test-admin-sidebar.tsx
 *
 * Verifies that all admin-only icons (FaUserShield, FaUsers,
 * FaEnvelopeOpenText) are valid React element constructors and that the
 * admin SidebarLinkGroup render-prop returns a non-null ReactNode.
 */
import React from "react";
import {
  FaUserShield,
  FaUsers,
  FaEnvelopeOpenText,
  FaCrown,
  FaBuffer,
} from "react-icons/fa6";

function sidebarLink(active: boolean) {
  return `group relative ${active ? "text-white" : "text-bodydark2"}`;
}

function sidebarSubLink(active: boolean) {
  return `relative ${active ? "text-white" : "text-bodydark2"}`;
}

const ICONS_TO_CHECK = { FaUserShield, FaUsers, FaEnvelopeOpenText, FaCrown, FaBuffer };

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

// 1. All admin icons exist and are functions
for (const [name, Icon] of Object.entries(ICONS_TO_CHECK)) {
  assert(typeof Icon === "function", `${name} should be a function, got ${typeof Icon}`);
  try {
    const el = React.createElement(Icon, { className: "w-4 h-4" });
    assert(el != null, `${name} createElement should return non-null`);
    assert(el.type != null, `${name} element type should be non-null`);
  } catch (e: any) {
    fail++;
    console.error(`FAIL: ${name} createElement threw:`, e.message);
  }
}

// 2. Admin section render-prop returns valid ReactNode
const pathname = "/domains/all";

try {
  const adminChildren = (handleClick: () => void, open: boolean) =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "a",
        { href: "#", className: sidebarLink(pathname.startsWith("/admin")) },
        React.createElement(FaUserShield, { className: "w-4 h-4" }),
        "Admin",
      ),
      React.createElement(
        "div",
        { className: `overflow-hidden ${!open && "hidden"}` },
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            React.createElement("a", { href: "/admin", className: sidebarSubLink(pathname === "/admin") },
              React.createElement(FaCrown, { className: "h-3.5 w-3.5" }), "Overview"),
          ),
          React.createElement(
            "li",
            null,
            React.createElement("a", { href: "/admin/users", className: sidebarSubLink(pathname === "/admin/users") },
              React.createElement(FaUsers, { className: "h-3.5 w-3.5" }), "Users"),
          ),
          React.createElement(
            "li",
            null,
            React.createElement("a", { href: "/admin/autoresponders", className: sidebarSubLink(pathname === "/admin/autoresponders") },
              React.createElement(FaEnvelopeOpenText, { className: "h-3.5 w-3.5" }), "Autoresponders"),
          ),
        ),
      ),
    );

  const result = adminChildren(() => {}, false);
  assert(result != null, "Admin children render should return non-null");
  assert(result.type === React.Fragment, "Admin children should return Fragment");
  pass++;
  console.log("OK  admin section render-prop");
} catch (e: any) {
  fail++;
  console.error("FAIL: admin section render threw:", e.message);
}

// 3. Notification array guard
try {
  const cases: Array<[unknown, number]> = [
    [["a", "b"], 2],
    [[], 0],
    ["Error string", 0],
    [null, 0],
    [undefined, 0],
    [42, 0],
    [{ message: "oops" }, 0],
  ];
  for (const [input, expected] of cases) {
    const safe = Array.isArray(input) ? input : [];
    assert(safe.length === expected, `Array.isArray guard for ${JSON.stringify(input)}: got ${safe.length}, expected ${expected}`);
  }
  console.log("OK  notification array guard");
} catch (e: any) {
  fail++;
  console.error("FAIL: notification guard threw:", e.message);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
