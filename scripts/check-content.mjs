import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pages } from "../src/content/pages.js";
import { inDepthPages } from "../src/content/inDepth.js";
import { resourceCategories } from "../src/content/resources.js";
import { imageUrl } from "../src/content/images.js";
const routes = new Set([
  "",
  "poglobljeno",
  "viri",
  "kontakt",
  "zasebnost",
  "iskanje",
  ...pages.map((p) => p.slug),
  ...resourceCategories.map((c) => "viri/" + c.slug),
]);
assert.equal(
  new Set(pages.map((p) => p.slug)).size,
  pages.length,
  "Duplicate routes",
);
let images = 0,
  blocks = 0;
function inspect(node) {
  if (Array.isArray(node)) {
    node.forEach(inspect);
    return;
  }
  if (!node || typeof node !== "object") return;
  if (node.type) blocks++;
  assert(
    !["form", "script", "iframe", "input", "textarea", "select"].includes(
      node.type,
    ),
    "Forbidden embedded content",
  );
  if (Object.hasOwn(node, "text"))
    assert(node.text.trim(), "Empty translated text");
  if (node.type === "image") {
    assert.equal(
      new URL(node.src).origin,
      "https://rsrc.share-international.org",
    );
    assert(new URL(node.src).pathname.startsWith("/images/"));
    images++;
  }
  if (node.href) {
    assert(node.href.startsWith("#/"), node.href);
    assert(routes.has(node.href.slice(2).split("?")[0]), node.href);
  }
  if (node.children) inspect(node.children);
  if (node.items) inspect(node.items);
}
for (const page of pages) {
  assert(page.title && page.intro && !page.slug.includes(" "));
  if (page.blocks) inspect(page.blocks);
  else {
    assert(page.sections?.length);
    for (const [title, ...paragraphs] of page.sections) {
      assert(title && paragraphs.length);
      assert(paragraphs.every((p) => typeof p === "string" && p.length > 20));
    }
  }
  if (page.image)
    assert.equal(
      new URL(imageUrl(page.image)).origin,
      "https://rsrc.share-international.org",
    );
}
const manifest = JSON.parse(readFileSync(".openai/hosting.json", "utf8"));
assert.equal(manifest.static.directory, "dist");
console.log(
  `Checked ${pages.length} pages (${inDepthPages.length} full In depth pages), ${blocks} content blocks, ${images} image placements, local links and hosting manifest.`,
);

const { questionCategories } = await import("../src/content/questionCategories.js");
const sourceQuestions = inDepthPages.find(page => page.slug === "vprasanja-in-odgovori").blocks.filter(block => block.type === "h3");
const categoryIds = new Set(questionCategories.flatMap(category => category.questionIds));
assert.equal(questionCategories.length, 19);
assert.equal(categoryIds.size, sourceQuestions.length, "Every question must have a category");
for (const question of sourceQuestions) assert(categoryIds.has(question.id), question.id);
for (const category of questionCategories) {
  assert.equal(new Set(category.questionIds).size, category.questionIds.length);
  assert.equal(category.blocks.filter(block => block.type === "h3").length, category.questionIds.length);
}
console.log(`Verified ${sourceQuestions.length} questions across 18 source categories and the uncategorized-question page.`);
