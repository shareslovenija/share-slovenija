import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
const manifest = JSON.parse(
  readFileSync("docs/in-depth-source-manifest.json", "utf8"),
);
const imageOrigins = JSON.parse(
  readFileSync("src/content/image-origins.json", "utf8"),
);
const capturedImagePaths = Object.fromEntries(
  Object.entries(imageOrigins).map(([local, url]) => [url, local]),
);
function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [
          key,
          ["title", "text", "alt"].includes(key)
            ? "TRANSLATED"
            : shape(value[key]),
        ]),
    );
  // The requested Slovene abbreviation also updates local routes.
  if (typeof value === "string")
    return (
      capturedImagePaths[value] ||
      value.replaceAll("znamenja/nlp", "znamenja/nlo")
    );
  return value;
}
let textFields = 0,
  topLevelBlocks = 0;
function checkText(value) {
  if (Array.isArray(value)) return value.forEach(checkText);
  if (!value || typeof value !== "object") return;
  for (const [key, field] of Object.entries(value)) {
    if (["title", "text", "alt"].includes(key)) {
      assert.equal(typeof field, "string");
      if (key !== "alt") assert(field.trim());
      textFields++;
    } else checkText(field);
  }
}
for (const record of manifest.records) {
  const page = JSON.parse(
    readFileSync("src/content/in-depth/" + record.file, "utf8"),
  );
  const hash = createHash("sha256")
    .update(JSON.stringify(shape(page)))
    .digest("hex");
  assert.equal(
    hash,
    record.shapeHash,
    `Source structure mismatch: ${record.file}`,
  );
  checkText(page);
  topLevelBlocks += page.blocks.length;
}
assert.equal(Object.keys(imageOrigins).length, manifest.images);
console.log(
  `Source completeness verified: ${manifest.pages} pages, ${topLevelBlocks} top-level blocks, ${textFields} translated fields, ${manifest.images} original-host images. No source blocks or images missing.`,
);
