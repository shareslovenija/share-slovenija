// Imports the Master's articles from the old share-international.net/slo archive
// into src/content/master-articles/. Run with --dry-run to report what would be
// imported without writing any files.
import { mkdirSync, writeFileSync } from "node:fs";

const base = "https://www.share-international.net/slo/publikacije/arhiv/mojster/";
const output = new URL("../src/content/master-articles/", import.meta.url);
const dryRun = process.argv.includes("--dry-run");

const entities = {
  nbsp: " ", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">",
  scaron: "š", Scaron: "Š", ccaron: "č", Ccaron: "Č", zcaron: "ž", Zcaron: "Ž",
  hellip: "…", ndash: "–", mdash: "—", laquo: "«", raquo: "»",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", bdquo: "„", sbquo: "‚",
  eacute: "é", egrave: "è", uuml: "ü", ouml: "ö", auml: "ä", shy: "",
};
const warnings = new Set();
const decodeEntities = (text) =>
  text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, name) => {
    if (name[0] === "#")
      return String.fromCodePoint(
        name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : +name.slice(1),
      );
    if (name in entities) return entities[name];
    warnings.add(`unknown entity ${match}`);
    return match;
  });

async function fetchPage(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const head = new TextDecoder("latin1").decode(bytes.slice(0, 2000));
  const charset = /charset=["']?([\w-]+)/i.exec(head)?.[1] || "iso-8859-2";
  return new TextDecoder(charset.toLowerCase()).decode(bytes);
}

// Splits HTML into text lines made of plain, italic and bold segments.
function lines(html) {
  const result = [];
  let current = [];
  let italic = 0;
  let bold = 0;
  const flush = () => {
    const segments = current
      .map((s) => ({ ...s, text: s.text.replace(/\s+/g, " ") }))
      .filter((s) => s.text);
    if (segments.length) {
      segments[0].text = segments[0].text.trimStart();
      segments.at(-1).text = segments.at(-1).text.trimEnd();
    }
    const merged = [];
    for (const s of segments.filter((s) => s.text)) {
      const last = merged.at(-1);
      if (last && !!last.em === !!s.em && !!last.strong === !!s.strong)
        last.text += s.text;
      else merged.push(s);
    }
    if (merged.some((s) => s.text.trim())) result.push(merged);
    current = [];
  };
  for (const token of html.split(/(<[^>]+>)/)) {
    if (!token.startsWith("<")) {
      const text = decodeEntities(token);
      if (text) current.push({ text, ...(italic && { em: true }), ...(bold && { strong: true }) });
      continue;
    }
    const tag = /^<\s*(\/?)\s*([a-z0-9]+)/i.exec(token);
    if (!tag) continue;
    const closing = tag[1] === "/";
    const name = tag[2].toLowerCase();
    if (["br", "p", "div", "tr", "li", "h1", "h2", "h3", "h4", "table"].includes(name)) flush();
    else if (name === "em" || name === "i") italic += closing ? -1 : 1;
    else if (name === "strong" || name === "b") bold += closing ? -1 : 1;
    else if (name === "img") warnings.add("image skipped");
    italic = Math.max(italic, 0);
    bold = Math.max(bold, 0);
  }
  flush();
  return result;
}

function toBlock(segments) {
  const text = segments.map((s) => s.text).join("");
  if (segments.every((s) => s.strong)) return { type: "h2", text };
  if (segments.length === 1 && !segments[0].em) return { type: "p", text };
  return {
    type: "p",
    text,
    segments: segments.map(({ text, em, strong }) => ({ text, ...(em && { em }), ...(strong && { strong }) })),
  };
}

function articleBlocks(html, title) {
  const start = html.indexOf("znakmali");
  // Most pages end with a "back to top" link; a few only close the layout table.
  const top = html.lastIndexOf('href="#vrh"');
  const end = top > start ? html.lastIndexOf("<", top) : html.indexOf("</table>", start);
  if (start < 0 || end < start) throw new Error("content area not found");
  const content = html
    .slice(html.indexOf("</p>", start) + 4, end)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const blocks = lines(content).map(toBlock);
  // The title is shown as the page heading.
  const normalise = (text) => text.toLowerCase().replace(/\W+/g, "");
  if (blocks.length && normalise(blocks[0].text) === normalise(title)) blocks.shift();
  return blocks;
}

const index = await fetchPage(base + "mojster.htm");
const rows = [...index.matchAll(
  /<a href="([\w-]+\.htm)">([\s\S]*?)<\/a>\s*(?:<[^>]+>\s*)*\(([^)]*?(\d{4}))\)/g,
)].map(([, file, title, date, year]) => ({
  file,
  slug: file.replace(/\.htm$/, "").toLowerCase().replace(/_/g, "-"),
  title: decodeEntities(title.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim(),
  date: date.replace(/\s+/g, " ").trim(),
  year: +year,
}));
const articles = [...new Map(rows.map((row) => [row.slug, row])).values()];

if (!dryRun) mkdirSync(output, { recursive: true });
const list = [];
for (const article of articles) {
  warnings.clear();
  try {
    const blocks = articleBlocks(await fetchPage(base + article.file), article.title);
    const { file, ...meta } = article;
    list.push(meta);
    if (!dryRun)
      writeFileSync(
        new URL(`${article.slug}.json`, output),
        JSON.stringify({ ...meta, source: base + file, blocks }, null, 2) + "\n",
      );
    const notes = [...warnings].join(", ");
    console.log(`${article.year}  ${article.slug}  ${blocks.length} blocks${notes ? "  (" + notes + ")" : ""}`);
  } catch (error) {
    console.error(`FAILED ${article.file}: ${error.message}`);
  }
}
if (!dryRun)
  writeFileSync(new URL("index.json", output), JSON.stringify(list, null, 2) + "\n");
console.log(`${dryRun ? "Would import" : "Imported"} ${list.length} of ${articles.length} articles.`);
