import assert from "node:assert/strict";
import { getTemplate } from "../lib/templates";
import { buildPrdMarkdown, missingRequiredSections } from "../lib/markdown";

const template = getTemplate("bug-fix")!;

// Required section khaali ho to missing list mein aana chahiye.
const missing = missingRequiredSections(template, { problem: "crash on login" });
assert.ok(missing.includes("impact"), "impact required section detect nahi hua");
assert.ok(!missing.includes("problem"), "filled section galti se missing dikh raha hai");

// Sab required bhara ho to missing empty honi chahiye.
const allFilled = Object.fromEntries(
  template.sections.filter((s) => s.required).map((s) => [s.id, "x"]),
);
assert.equal(missingRequiredSections(template, allFilled).length, 0);

// Markdown mein filled section ka title aana chahiye, empty optional section skip ho.
const md = buildPrdMarkdown(template, { ...allFilled, problem: "Login crashes" }, { title: "T" });
assert.ok(md.includes("## Problem Statement"));
assert.ok(md.includes("Login crashes"));
assert.ok(!md.includes("## Risk of Fix"), "empty optional section skip nahi hua");

console.log("selfcheck ok");
