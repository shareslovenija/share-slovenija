// Imports the book list and book pages from the old share-international.net/slo
// site into src/content/books/, and their covers and PDFs into public/knjige/.
// Run with --dry-run to report what would be imported without writing any files.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const base = "https://www.share-international.net/slo/publikacije/";
const output = new URL("../src/content/books/", import.meta.url);
const assets = new URL("../public/knjige/", import.meta.url);
const dryRun = process.argv.includes("--dry-run");
const masterIndex = new URL("../src/content/master-articles/index.json", import.meta.url);
const masterArticles = new Set(
  existsSync(masterIndex)
    ? JSON.parse(readFileSync(masterIndex, "utf8")).map((article) => article.slug)
    : [],
);

const entities = {
  nbsp: " ", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">",
  scaron: "š", Scaron: "Š", ccaron: "č", Ccaron: "Č", zcaron: "ž", Zcaron: "Ž",
  hellip: "…", ndash: "–", mdash: "—", laquo: "«", raquo: "»",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", bdquo: "„", sbquo: "‚",
  eacute: "é", egrave: "è", uuml: "ü", ouml: "ö", auml: "ä", shy: "", euro: "€",
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

const slugOf = (file) => file.replace(/\.htm$/i, "").toLowerCase().replace(/_/g, "-");
const attribute = (tag, name) =>
  new RegExp(`\\s${name}\\s*=\\s*["']?([^"'\\s>]+)`, "i").exec(tag)?.[1];

// Files downloaded to public/knjige/, keyed by their original URL.
const downloads = new Map();
const asset = (url) => {
  const name = decodeURIComponent(url.pathname.split("/").pop());
  downloads.set(url.href, name);
  return name;
};

// Maps a link on the old site to its place on the new one.
function mapLink(href, pageUrl, bookFiles, currentSlug) {
  const url = new URL(href, pageUrl);
  if (href.startsWith("#"))
    return { href: `#/knjige/${currentSlug}?ancla=${encodeURIComponent(href.slice(1))}` };
  if (url.pathname.endsWith("narocilnica.php"))
    return { href: "#/knjige/narocilo" + (currentSlug ? `?knjiga=${currentSlug}` : "") };
  if (/\.pdf$/i.test(url.pathname)) return { asset: asset(url) };
  const file = url.pathname.split("/").pop();
  if (url.href.startsWith(base) && bookFiles.has(file.toLowerCase()))
    return { href: `#/knjige/${slugOf(file)}` };
  const moved = {
    "/slo/maitreja/sporocila.htm": "#/maitrejeva-sporocila",
  }[url.pathname];
  if (url.hostname.endsWith("share-international.net") && moved) return { href: moved };
  if (url.pathname.includes("/arhiv/mojster/") && masterArticles.has(slugOf(file)))
    return { href: `#/clanki-mojstra/${slugOf(file)}` };
  // Other links lead away from the new site and are left as plain text.
  warnings.add(`link removed: ${url.href}`);
  return null;
}

// Turns the content area of a page into paragraphs (lists of lines made of
// text segments), images, dividers and section headings.
function parse(html, pageUrl, bookFiles, currentSlug) {
  const items = [];
  let lines = [];
  let line = [];
  let italic = 0;
  let bold = 0;
  let link = null;
  let section = false;
  let anchor = null;
  const endLine = () => {
    const segments = [];
    for (const segment of line) {
      const text = segment.text.replace(/\s+/g, " ");
      const last = segments.at(-1);
      if (last && ["em", "strong", "href", "asset"].every((k) => last[k] === segment[k]))
        last.text += text;
      else segments.push({ ...segment, text });
    }
    if (segments.length) {
      segments[0].text = segments[0].text.trimStart();
      segments.at(-1).text = segments.at(-1).text.trimEnd();
    }
    const kept = segments.filter((s) => s.text);
    line = [];
    // An empty line (two line breaks) separates paragraphs.
    if (kept.some((s) => s.text.trim())) lines.push(kept);
    else if (lines.length) endParagraph();
  };
  const endParagraph = () => {
    if (line.length) endLine();
    if (lines.length) {
      items.push(
        section
          ? { type: "heading", text: lines.flat().map((s) => s.text).join("").replace(/^[\s.]+/, "").trim() }
          : { type: "p", lines, ...(anchor && { id: anchor }) },
      );
      anchor = null;
    }
    lines = [];
  };
  for (const token of html.split(/(<[^>]+>)/)) {
    if (!token.startsWith("<")) {
      const text = decodeEntities(token);
      if (text)
        line.push({
          text,
          ...(italic && { em: true }),
          ...(bold && { strong: true }),
          ...(link && link),
        });
      continue;
    }
    const tag = /^<\s*(\/?)\s*([a-z0-9]+)/i.exec(token);
    if (!tag) continue;
    const closing = tag[1] === "/";
    const name = tag[2].toLowerCase();
    if (name === "br") endLine();
    else if (["p", "div", "table", "tr", "td", "li", "h1", "h2", "h3", "h4"].includes(name)) {
      endParagraph();
      if (name === "td") section = !closing && /bgcolor="?#222771/i.test(token);
    } else if (name === "em" || name === "i") italic = Math.max(italic + (closing ? -1 : 1), 0);
    else if (name === "strong" || name === "b") bold = Math.max(bold + (closing ? -1 : 1), 0);
    else if (name === "a") {
      const href = !closing && attribute(token, "href");
      const anchorName = !closing && attribute(token, "name");
      if (anchorName) anchor = anchorName;
      link = href && !href.endsWith("#vrh") ? mapLink(href, pageUrl, bookFiles, currentSlug) : null;
    } else if (name === "img") {
      const src = new URL(attribute(token, "src"), pageUrl);
      if (/linija\.gif$/i.test(src.pathname)) {
        endParagraph();
        items.push({ type: "hr" });
      } else if (!/\/vrh(_neg)?\.jpg$/i.test(src.pathname)) {
        endParagraph();
        items.push({ type: "image", src: asset(src), ...(link?.href && { href: link.href }) });
      }
    }
  }
  endParagraph();
  return items;
}

function contentArea(html) {
  const start = html.indexOf("znakmali");
  const top = html.lastIndexOf('href="#vrh"');
  const end = top > start ? html.lastIndexOf("<", top) : html.lastIndexOf("</table>");
  if (start < 0 || end < start) throw new Error("content area not found");
  return html
    .slice(html.indexOf("</p>", start) + 4, end)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

const textOf = (paragraph) =>
  paragraph.lines.map((line) => line.map((s) => s.text).join("")).join(" ");
const normalise = (text) => text.toLocaleLowerCase("sl").replace(/[^\p{L}\p{N}]+/gu, "");
// Number of single-character edits between two strings.
function distance(a, b) {
  let row = [...Array(b.length + 1).keys()];
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++)
      next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] !== b[j - 1]));
    row = next;
  }
  return row[b.length];
}
// The book list and the book page sometimes word the title slightly differently.
const sameTitle = (a, b) =>
  a.includes(b) || b.includes(a) || distance(a, b) <= 3;
const hasLink = (paragraph, test) =>
  paragraph.lines.some((line) => line.some(test));

// Book list: every book starts with its cover image, which links to the book page.
const listUrl = base + "publikacije.htm";
const listHtml = contentArea(await fetchPage(listUrl));
const bookFiles = new Map(
  [...listHtml.matchAll(/<a href="([\w-]+\.htm)"[^>]*>\s*(?:<[^a][^>]*>\s*)*<img/gi)].map(
    ([, file]) => [file.toLowerCase(), file],
  ),
);
const blocks = [];
let book = null;
let ordered = false;
for (const item of parse(listHtml, listUrl, bookFiles)) {
  const cover = item.type === "image" && item.href?.startsWith("#/knjige/");
  if (cover) {
    const slug = item.href.slice("#/knjige/".length);
    book = { type: "book", slug, cover: item.src, title: "", paragraphs: [] };
    ordered = false;
    blocks.push(book);
    continue;
  }
  if (book && item.type === "p") {
    const isPdf = hasLink(item, (s) => s.asset);
    if (!ordered || isPdf) {
      if (!book.title) {
        book.title = item.lines[0].map((s) => s.text).join("").trim();
        item.lines = item.lines.slice(1);
      }
      if (item.lines.length) book.paragraphs.push(item);
      ordered ||= hasLink(item, (s) => s.href?.startsWith("#/knjige/narocilo"));
      continue;
    }
  }
  if (item.type !== "p" || ordered) book = null;
  blocks.push(item);
}
// Order links point to the order form with the book already selected.
for (const block of blocks.filter((b) => b.type === "book"))
  for (const paragraph of block.paragraphs)
    for (const segment of paragraph.lines.flat())
      if (segment.href === "#/knjige/narocilo")
        segment.href += `?knjiga=${block.slug}`;
// The page's own "Knjige" heading repeats the page title.
if (blocks[0]?.type === "p" && normalise(textOf(blocks[0])) === "knjige") blocks.shift();
const books = blocks.filter((b) => b.type === "book");
console.log(`Book list: ${books.length} books, ${blocks.length - books.length} other blocks${warnings.size ? "  (" + [...warnings].join(", ") + ")" : ""}`);

const pages = [];
for (const { slug, title } of books) {
  warnings.clear();
  const file = bookFiles.get([...bookFiles.keys()].find((key) => slugOf(key) === slug));
  try {
    const pageUrl = base + file;
    const items = parse(contentArea(await fetchPage(pageUrl)), pageUrl, bookFiles, slug);
    // The title is shown as the page heading.
    const first = items.find((item) => item.type === "p");
    if (first?.lines.length === 1 && sameTitle(normalise(textOf(first)), normalise(title)))
      items.splice(items.indexOf(first), 1);
    pages.push({ slug, title, source: pageUrl, blocks: items });
    console.log(`${slug}  ${items.length} blocks${warnings.size ? "  (" + [...warnings].join(", ") + ")" : ""}`);
  } catch (error) {
    console.error(`FAILED ${file}: ${error.message}`);
  }
}

if (!dryRun) mkdirSync(assets, { recursive: true });
let total = 0;
const missing = new Set();
for (const [url, name] of downloads) {
  const response = await fetch(url, dryRun ? { method: "HEAD" } : {});
  if (!response.ok) {
    console.error(`FAILED ${url}: ${response.status} (left out)`);
    missing.add(name);
    continue;
  }
  const size = dryRun
    ? +response.headers.get("content-length")
    : (await response.arrayBuffer().then((data) => {
        writeFileSync(new URL(name, assets), new Uint8Array(data));
        return data.byteLength;
      }));
  total += size;
}
console.log(`${dryRun ? "Would download" : "Downloaded"} ${downloads.size} files to public/knjige/ (${(total / 1e6).toFixed(1)} MB).`);

// The list shows the larger cover from each book's own page where there is one.
for (const book of books) {
  const cover = pages
    .find((page) => page.slug === book.slug)
    ?.blocks.find((block) => block.type === "image" && !missing.has(block.src));
  if (cover) book.cover = cover.src;
}
// Books whose content already has its own page on the new site link there instead.
const redirectedBooks = { sporocila: "#/maitrejeva-sporocila" };
const redirect = (node) => {
  if (Array.isArray(node)) node.forEach(redirect);
  else if (node && typeof node === "object") {
    const target = /^#\/knjige\/([\w-]+)(?:\?ancla=.*)?$/.exec(node.href ?? "");
    if (target && redirectedBooks[target[1]]) node.href = redirectedBooks[target[1]];
    Object.values(node).forEach(redirect);
  }
};
for (const book of books)
  if (redirectedBooks[book.slug]) book.href = redirectedBooks[book.slug];
redirect(blocks);
redirect(pages);
if (!dryRun) {
  mkdirSync(output, { recursive: true });
  const present = (block) => block.type !== "image" || !missing.has(block.src);
  for (const page of pages.filter((page) => !redirectedBooks[page.slug]))
    writeFileSync(
      new URL(`${page.slug}.json`, output),
      JSON.stringify({ ...page, blocks: page.blocks.filter(present) }, null, 2) + "\n",
    );
  writeFileSync(
    new URL("index.json", output),
    JSON.stringify({ blocks: blocks.filter(present) }, null, 2) + "\n",
  );
  console.log(`Imported ${pages.length} of ${books.length} books.`);
}
