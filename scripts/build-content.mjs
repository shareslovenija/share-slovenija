import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
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

// Plain-text index of the Master's articles, loaded by the search page on demand.
const masterDirectory = new URL("../src/content/master-articles/", import.meta.url);
const masterIndex = new URL("index.json", masterDirectory);
const masterArticles = existsSync(masterIndex)
  ? JSON.parse(readFileSync(masterIndex, "utf8")).map((article) => ({
      ...article,
      text: JSON.parse(
        readFileSync(new URL(`${article.slug}.json`, masterDirectory), "utf8"),
      )
        .blocks.map((block) => block.text)
        .join("\n"),
    }))
  : [];
writeFileSync(
  new URL("../src/content/master-articles-search.json", import.meta.url),
  JSON.stringify(masterArticles),
);
console.log(`Prepared search text for ${masterArticles.length} Master's articles.`);
