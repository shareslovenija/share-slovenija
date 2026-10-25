import { readdirSync, readFileSync, writeFileSync } from "node:fs";
const directory = new URL("../src/content/in-depth/", import.meta.url);
const files = readdirSync(directory).filter(
  (name) => name.endsWith(".json") && name !== "catalog.json",
);
const pages = files
  .filter((name) => name.startsWith("in-depth"))
  .map((name) => JSON.parse(readFileSync(new URL(name, directory), "utf8")));
const parts = files
  .filter((name) => name.startsWith("questions-"))
  .sort()
  .map((name) => JSON.parse(readFileSync(new URL(name, directory), "utf8")));
if (parts.length)
  pages.push({ ...parts[0], blocks: parts.flatMap((part) => part.blocks) });
writeFileSync(new URL("catalog.json", directory), JSON.stringify(pages));
console.log(`Prepared ${pages.length} complete-content page assets.`);
