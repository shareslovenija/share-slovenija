// Converts a Share International issue (PDF exported from Word) into its own
// folder public/revija/<year>-<month>/: vsebina.json (the text), slike/ (the
// pictures) and naslovnica.jpg (the cover), and adds the issue to
// public/revija/stevilke.json. Needs pdftohtml (poppler-utils). Usage:
//   node scripts/import-magazine.mjs [magazine/issue.pdf] [--stevilka=2026-09] [--dry-run]
// Without a path it takes the newest PDF in the magazine/ folder. The issue is
// read from the file name (e.g. ..._september_2026_SL.pdf) unless --stevilka is
// given. With --dry-run it only reports what it found and writes nothing.
import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, isAbsolute, join } from "node:path";
import { tidyLinks } from "./magazine-links.mjs";

const dryRun = process.argv.includes("--dry-run");
const pdf =
  process.argv.slice(2).find((arg) => !arg.startsWith("--")) ||
  readdirSync("magazine")
    .filter((name) => name.toLowerCase().endsWith(".pdf"))
    .map((name) => join("magazine", name))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
if (!pdf) throw new Error("No PDF found in magazine/.");

// The issue month comes from the file name; double issues such as
// "julij-avgust" are filed under their first month.
const months = ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"];
const named = new RegExp(`(${months.join("|")})(?:[-_ ]?(${months.join("|")}))?[^a-z0-9]*(\\d{4})`, "i").exec(
  basename(pdf).toLowerCase(),
);
const given = /^--stevilka=(\d{4})-(\d{2})$/.exec(process.argv.find((arg) => arg.startsWith("--stevilka=")) ?? "");
if (!named && !given)
  throw new Error("Cannot tell the issue from the file name; add --stevilka=YYYY-MM.");
const id = given
  ? `${given[1]}-${given[2]}`
  : `${named[3]}-${String(months.indexOf(named[1]) + 1).padStart(2, "0")}`;
const capital = (word) => word[0].toUpperCase() + word.slice(1);
const issue = named
  ? `${capital(named[1])}${named[2] ? "-" + named[2] : ""} ${named[3]}`
  : `${capital(months[+given[2] - 1])} ${given[1]}`;
const issueDir = new URL(`../public/revija/${id}/`, import.meta.url);
const imageDir = new URL("slike/", issueDir);
const indexFile = new URL("../public/revija/stevilke.json", import.meta.url);

// pdftohtml writes the text with positions as XML, and the pictures as files.
const work = mkdtempSync(join(tmpdir(), "revija-"));
execFileSync("pdftohtml", ["-xml", "-q", "-nodrm", "-fmt", "jpg", pdf, join(work, "issue")]);
const xml = readFileSync(join(work, "issue.xml"), "utf8");

const decode = (text) =>
  text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(+code))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const fonts = new Map(
  [...xml.matchAll(/<fontspec id="(\d+)" size="(-?\d+)" family="([^"]*)"/g)].map(
    ([, id, size, family]) => [id, { size: +size, family: family.replace(/^[A-Z]{6}\+/, "") }],
  ),
);

// Text segments of one text element, with bold, italic and links.
function segments(html) {
  const result = [];
  let bold = 0;
  let italic = 0;
  let href = null;
  for (const token of html.split(/(<[^>]+>)/)) {
    if (!token) continue;
    const tag = /^<(\/?)(b|i|a)\b([^>]*)>$/i.exec(token);
    if (tag) {
      const delta = tag[1] ? -1 : 1;
      if (tag[2].toLowerCase() === "b") bold = Math.max(bold + delta, 0);
      else if (tag[2].toLowerCase() === "i") italic = Math.max(italic + delta, 0);
      else {
        const link = tag[1] ? null : /href="([^"]*)"/.exec(tag[3])?.[1];
        // Links to the old site share-international.net are left as plain text.
        href =
          link && /^(https?:|mailto:)/i.test(decode(link)) && !/share-international\.net/i.test(decode(link))
            ? decode(link)
            : null;
      }
      continue;
    }
    if (token.startsWith("<")) continue;
    result.push({
      text: decode(token),
      ...(bold && { strong: true }),
      ...(italic && { em: true }),
      ...(href && { href }),
    });
  }
  return result;
}

// One entry per text element, in reading order.
const pages = [...xml.matchAll(/<page number="(\d+)"[^>]*height="(\d+)"[^>]*>([\s\S]*?)<\/page>/g)];
let dropped = 0;
const elements = [];
const images = [];
for (const [, number, height, body] of pages) {
  for (const [, top, left, width, imageHeight, src] of body.matchAll(
    /<image top="(\d+)" left="(\d+)" width="(\d+)" height="(\d+)" src="([^"]+)"/g,
  ))
    images.push({
      page: +number,
      top: +top,
      left: +left,
      width: +width,
      height: +imageHeight,
      file: isAbsolute(src) ? src : join(work, basename(src)),
    });
  const rows = [
    ...body.matchAll(
      /<text top="(\d+)" left="(\d+)" width="(\d+)" height="(\d+)" font="(\d+)">([\s\S]*?)<\/text>/g,
    ),
  ].map(([, top, left, width, lineHeight, font, html]) => ({
    page: +number,
    top: +top,
    left: +left,
    width: +width,
    height: +lineHeight,
    font: fonts.get(font),
    segments: segments(html),
  }));
  for (const row of rows) {
    const text = row.segments.map((s) => s.text).join("").trim();
    // Running headers, footers and page numbers sit in the page margins.
    const margin = row.top < height * 0.04 || row.top > height * 0.94;
    if (!text || (margin && (row.font.size <= 12 || /^\d+$/.test(text)))) {
      if (text) dropped++;
      continue;
    }
    row.text = text;
    elements.push(row);
  }
}

// Body text is the most common font; larger or display fonts are headings.
const usage = new Map();
for (const element of elements) {
  const key = `${element.font.family}/${element.font.size}`;
  usage.set(key, (usage.get(key) || 0) + element.text.length);
}
const bodySize = +[...usage.entries()].sort((a, b) => b[1] - a[1])[0][0].split("/").pop();
function kind(element) {
  const { size, family } = element.font;
  if (element.text === "•") return "bullet";
  if (size >= bodySize + 10 || (/Black/i.test(family) && size >= bodySize + 6)) return "h2";
  if (/Black/i.test(family) || (size >= bodySize + 3 && element.text.length <= 60)) return "h3";
  return "p";
}

// Elements on the same row form one line.
const lines = [];
for (const element of elements) {
  const last = lines.at(-1);
  if (last && last.page === element.page && Math.abs(last.top - element.top) <= 3) {
    last.parts.push(element);
    continue;
  }
  lines.push({ page: element.page, top: element.top, parts: [element] });
}
for (const line of lines) {
  line.parts.sort((a, b) => a.left - b.left);
  line.left = line.parts[0].left;
  line.height = Math.max(...line.parts.map((part) => part.height));
  const kinds = line.parts.map(kind).filter((k) => k !== "bullet");
  line.bullet = line.parts[0].text === "•";
  line.kind = kinds.includes("h2") ? "h2" : kinds.includes("h3") ? "h3" : "p";
  if (line.bullet) line.parts = line.parts.slice(1);
  line.segments = line.parts.flatMap((part, index) =>
    index && !/\s$/.test(line.parts[index - 1].text) ? [{ text: " " }, ...part.segments] : part.segments,
  );
  line.text = line.segments.map((s) => s.text).join("").trim();
}

// Lines form paragraphs: a larger gap, an indented first line, a bullet or a
// change between heading and text starts a new block.
const textLeft = (() => {
  const counts = new Map();
  for (const line of lines.filter((l) => l.kind === "p"))
    counts.set(line.left, (counts.get(line.left) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0;
})();
// Pictures take their place among the lines by page and height on the page.
for (const image of images) {
  const at = lines.findIndex(
    (line) => line.page > image.page || (line.page === image.page && line.top > image.top),
  );
  lines.splice(at < 0 ? lines.length : at, 0, { page: image.page, top: image.top, image });
}
// The cover thumbnail is the whole first page, title and headlines included.
const cover = join(work, "naslovnica");
execFileSync("pdftoppm", ["-f", "1", "-l", "1", "-jpeg", "-jpegopt", "quality=85", "-scale-to-x", "600", "-scale-to-y", "-1", "-singlefile", pdf, cover]);
// Widths are kept relative to the text column.
const textWidth = (() => {
  const widths = elements.filter((e) => kind(e) === "p").map((e) => e.width).sort((a, b) => a - b);
  return widths[Math.floor(widths.length * 0.9)] || 1;
})();

const sentenceEnd = /[.!?:…"”«»)]$/;
// Running page lines such as "september 2026 | 4" repeat the issue and page.
const runningLine = (text) =>
  /^\p{L}+ \d{4}\s*\|\s*\d+$/u.test(text) || /^\d+\s*\|\s*\p{L}+ \d{4}$/u.test(text);
const blocks = [];
let previous = null;
for (const line of lines.filter((l) => l.image || (l.text && !(runningLine(l.text) && ++dropped)))) {
  if (line.image) {
    blocks.push({ type: "image", image: line.image });
    continue;
  }
  const block = blocks.at(-1);
  const type = line.bullet ? "li" : line.kind;
  const samePage = previous && previous.page === line.page;
  const gap = samePage ? line.top - previous.top : Infinity;
  const continues =
    block &&
    previous &&
    !line.bullet &&
    (block.type === type || (block.type === "li" && type === "p")) &&
    (samePage
      ? gap <= line.height * 1.35 && !(type === "p" && line.left > textLeft + 20 && previous.left <= textLeft + 5)
      : type === "p" && !sentenceEnd.test(previous.text));
  if (continues) {
    const end = block.segments.at(-1);
    const hyphen = /\S-$/.test(end.text) && /^\p{Ll}/u.test(line.text);
    if (hyphen) end.text = end.text.slice(0, -1);
    else block.segments.push({ text: " " });
    block.segments.push(...line.segments);
  } else blocks.push({ type, segments: [...line.segments] });
  previous = line;
}

// Tidy the segments: collapse spaces and merge neighbours with the same format.
const same = (a, b) => ["strong", "em", "href"].every((key) => a[key] === b[key]);
for (const block of blocks.filter((b) => b.segments)) {
  const merged = [];
  for (const segment of block.segments) {
    const text = segment.text.replace(/\s+/g, " ");
    const last = merged.at(-1);
    if (last && (same(last, segment) || !text.trim())) last.text += text;
    else merged.push({ ...segment, text });
  }
  block.segments = tidyLinks(merged);
  if (block.segments.every((segment) => !segment.strong && !segment.em && !segment.href)) {
    block.text = block.segments.map((segment) => segment.text).join("");
    delete block.segments;
  }
}

// The cover and the issue's own table of contents list the titles and authors
// that the Revija page already shows in its contents box. The issue's text
// starts with the first long paragraph, or the heading right above it.
const blockText = (block) => block.text ?? block.segments?.map((s) => s.text).join("") ?? "";
const firstText = blocks.findIndex((block) => block.type === "p" && blockText(block).length >= 200);
const frontMatter =
  firstText > 0 && blocks[firstText - 1].type !== "p" ? firstText - 1 : Math.max(firstText, 0);
blocks.splice(0, frontMatter);

// A short label in capitals names a column. Right above a title it is that
// article's section label ("kicker"); followed by text it is a title itself.
for (const [index, block] of blocks.entries()) {
  const text = blockText(block);
  const label = block.type === "h3" && text.length <= 30 && text === text.toLocaleUpperCase("sl");
  if (label) block.type = blocks[index + 1]?.type === "h2" ? "kicker" : "h2";
}

// Text that flows around a narrow picture is split by it: join the two parts
// and put the picture after the paragraph.
const segmentsOf = (block) => block.segments ?? [{ text: block.text }];
const setSegments = (block, list) => {
  const plain = list.every((s) => !s.strong && !s.em && !s.href);
  delete block.text;
  delete block.segments;
  if (plain) block.text = list.map((s) => s.text).join("");
  else block.segments = list;
};
for (let index = 1; index < blocks.length - 1; index++) {
  const [before, image, after] = blocks.slice(index - 1, index + 2);
  if (
    image.type === "image" &&
    before.type === "p" &&
    after.type === "p" &&
    !sentenceEnd.test(blockText(before).trim()) &&
    /^\p{Ll}/u.test(blockText(after).trim())
  ) {
    setSegments(before, tidyLinks([...segmentsOf(before), { text: " " }, ...segmentsOf(after)]));
    blocks.splice(index + 1, 1);
  }
}

// A photo credit in brackets right above or below a picture is its caption,
// shown below it.
const isCredit = (block) => {
  const text = blockText(block ?? {}).trim();
  return block?.type === "p" && text.length <= 300 && /^\(/.test(text) && /\)\.?$/.test(text);
};
for (let index = 0; index < blocks.length; index++) {
  if (blocks[index].type !== "image") continue;
  if (isCredit(blocks[index + 1])) blocks[index + 1].type = "caption";
  else if (isCredit(blocks[index - 1])) {
    const [credit] = blocks.splice(index - 1, 1, blocks[index]);
    blocks[index] = { ...credit, type: "caption" };
  }
}

// Pictures are numbered in reading order and stored next to vsebina.json.
const pictures = blocks.filter((block) => block.type === "image");
pictures.forEach((block, index) => {
  const { image } = block;
  block.src = `slike/slika-${String(index + 1).padStart(2, "0")}.jpg`;
  block.sirina = Math.round(Math.min(100, Math.max(25, (image.width / textWidth) * 100)));
  block.file = image.file;
  delete block.image;
});

const count = (type) => blocks.filter((block) => block.type === type).length;
console.log(`${basename(pdf)}: ${pages.length} pages`);
console.log(
  `${count("h2")} headings, ${count("h3")} subheadings, ${count("p")} paragraphs, ${count("li")} list items, ${count("image")} pictures (${count("caption")} with a caption); ${dropped} header/footer lines and ${frontMatter} front-matter blocks left out.`,
);
if (!dryRun) {
  mkdirSync(issueDir, { recursive: true });
  rmSync(imageDir, { recursive: true, force: true });
  mkdirSync(imageDir, { recursive: true });
  for (const block of pictures) copyFileSync(block.file, new URL(basename(block.src), imageDir));
  copyFileSync(cover + ".jpg", new URL("naslovnica.jpg", issueDir));
}
for (const block of pictures) delete block.file;
rmSync(work, { recursive: true, force: true });
console.log(`Issue ${issue} (${id}).`);
if (!dryRun) {
  writeFileSync(
    new URL("vsebina.json", issueDir),
    JSON.stringify({ vir: basename(pdf), izdaja: issue, blocks }, null, 2) + "\n",
  );
  // Add the issue to the list, keeping highlights entered by hand.
  const list = existsSync(indexFile) ? JSON.parse(readFileSync(indexFile, "utf8")) : [];
  // An imported issue is published, so it is no longer marked as in progress.
  const { vDelu, ...previous } = list.find((item) => item.id === id) ?? {};
  const entry = { ...previous, id, izdaja: issue };
  const updated = [...list.filter((item) => item.id !== id), entry].sort((a, b) =>
    b.id.localeCompare(a.id),
  );
  writeFileSync(indexFile, JSON.stringify(updated, null, 2) + "\n");
  console.log(`Written to public/revija/${id}/ and listed in public/revija/stevilke.json.`);
}
