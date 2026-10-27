import React, { useEffect, useState } from "react";

// Imported by scripts/import-books.mjs; each book page loads on demand.
const [bookIndex = { blocks: [] }] = Object.values(
  import.meta.glob("../content/books/index.json", {
    eager: true,
    import: "default",
  }),
);
const bookFiles = import.meta.glob("../content/books/*.json", {
  import: "default",
});
const assetUrl = (name) => `${import.meta.env.BASE_URL}knjige/${name}`;
const orderAddress = "info.slo@share-international.net";

export const books = bookIndex.blocks.filter((block) => block.type === "book");
export const bookPrefix = "knjige/";
// A book with its own href (set by the importer) has no book page of its own.
const bookHref = (book) => book.href || "#/" + bookPrefix + book.slug;
export const findBook = (slug) =>
  books.find((book) => bookPrefix + book.slug === slug);

function Segment({ segment }) {
  let text = segment.text;
  if (segment.em) text = <em>{text}</em>;
  if (segment.strong) text = <strong>{text}</strong>;
  if (segment.asset)
    return (
      <a className="book-pdf" href={assetUrl(segment.asset)} download>
        {text}
      </a>
    );
  if (segment.href)
    return (
      <a
        href={segment.href}
        {...(/^https?:/.test(segment.href) && { rel: "noreferrer" })}
      >
        {text}
      </a>
    );
  return text;
}

// On book pages a line set entirely in bold is a subtitle, and so is a short
// standalone line that is not a sentence (no closing punctuation).
const isSubtitle = (line) =>
  line.some((segment) => segment.text.trim()) && line.every((segment) => segment.strong);
const looksLikeTitle = (lines, index) => {
  const text = lineText(lines[index]);
  if (text.length < 2 || text.length > 80) return false;
  // A short label such as "Iz uvoda:" introduces an excerpt and is a title too.
  const label = text.endsWith(":") && text.length <= 30;
  if (!label && /[.!?:;,…)\]]["”«»]*$/.test(text)) return false;
  if (/^[([]/.test(text)) return false;
  if (/^(Obseg|Cena|ISBN|Format|Založba)\b/.test(text)) return false;
  // Alone in its paragraph, or directly above running text.
  return lines.length === 1 || (index === 0 && lineText(lines[1]).length > 80);
};

function Block({ block, subtitles = false }) {
  if (block.type === "hr") return <hr />;
  if (block.type === "heading") return <h2>{block.text}</h2>;
  if (block.type === "image") {
    const image = <img className="book-image" src={assetUrl(block.src)} alt="" />;
    return block.href ? <a href={block.href}>{image}</a> : image;
  }
  return (
    <p id={block.id}>
      {block.lines.map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {subtitles && (isSubtitle(line) || looksLikeTitle(block.lines, lineIndex)) ? (
            <span className="book-subtitle">
              {line.map((segment, index) => (
                <Segment key={index} segment={segment} />
              ))}
            </span>
          ) : (
            line.map((segment, index) => <Segment key={index} segment={segment} />)
          )}
        </React.Fragment>
      ))}
    </p>
  );
}

const lineText = (line) => line.map((segment) => segment.text).join("").trim();
const isFacts = (block) =>
  block.lines.every((line) => /^(Obseg|Cena|ISBN|Format|Založba)\b/.test(lineText(line)));

function Line({ line }) {
  // A leading chapter number ("3.") is set apart so the titles line up.
  const number = /^(\d+\.)\s*/.exec(line[0]?.text ?? "");
  const segments = number
    ? [{ ...line[0], text: line[0].text.slice(number[0].length) }, ...line.slice(1)]
    : line;
  return (
    <>
      {number && <span className="toc-number">{number[1]}</span>}
      <span>
        {segments.map((segment, index) => (
          <Segment key={index} segment={segment} />
        ))}
      </span>
    </>
  );
}

// The information above the cover on each book page: mostly the table of
// contents, sometimes with a short description and the book's details.
function BookContents({ blocks }) {
  const [first, ...rest] = blocks;
  const label =
    first?.type === "p" &&
    first.lines.length === 1 &&
    lineText(first.lines[0]).length <= 20;
  // Consecutive one-line paragraphs are entries of the same list.
  const groups = [];
  for (const block of label ? rest : blocks) {
    const single = block.type === "p" && block.lines.length === 1 && !isFacts(block);
    const previous = groups.at(-1);
    if (single && previous?.single) {
      previous.lines.push(block.lines[0]);
      previous.lineIds.push(block.id);
    } else
      groups.push(single ? { ...block, single, lines: [...block.lines], lineIds: [block.id] } : block);
  }
  return (
    <div className="book-contents">
      {label && <p className="eyebrow">{lineText(first.lines[0])}</p>}
      {groups.map((block, index) => {
        if (block.type !== "p") return <Block key={index} block={block} />;
        if (isFacts(block))
          return (
            <p className="book-facts" key={index}>
              {block.lines.map((line, lineIndex) => (
                <span key={lineIndex}>
                  {line.map((segment, segmentIndex) => (
                    <Segment key={segmentIndex} segment={segment} />
                  ))}
                </span>
              ))}
            </p>
          );
        const [head, ...entries] = block.lines;
        const grouped = entries.length > 0 && lineText(head) === lineText(head).toUpperCase();
        const lineId = (lineIndex) => block.lineIds?.[lineIndex];
        return (
          <div className="toc-group" id={block.lineIds ? undefined : block.id} key={index}>
            {grouped && (
              <p className="toc-heading" id={lineId(0)}>
                <Line line={head} />
              </p>
            )}
            <ul>
              {(grouped ? entries : block.lines).map((line, lineIndex) => (
                <li key={lineIndex} id={lineId(grouped ? lineIndex + 1 : lineIndex)}>
                  <Line line={line} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function Breadcrumb({ children }) {
  return (
    <nav className="breadcrumb" aria-label="Pot do strani">
      <a href="#/">Domov</a>
      <span>/</span>
      {children}
    </nav>
  );
}

// A small box with a book's cover and title, linking to the book's page.
export function BookTeaser({ slug }) {
  const book = books.find((item) => item.slug === slug);
  if (!book) return null;
  return (
    <a className="book-teaser" href={bookHref(book)}>
      <img src={assetUrl(book.cover)} alt="" loading="lazy" />
      <span>
        <span className="eyebrow">Priporočamo v branje</span>
        <strong>{book.title}</strong>
        <span className="book-teaser-more">Več o knjigi →</span>
      </span>
    </a>
  );
}

export function Books() {
  return (
    <div className="container simple-page">
      <Breadcrumb>
        <span aria-current="page">Knjige</span>
      </Breadcrumb>
      <h1>Knjige</h1>
      <div className="book-list">
        {bookIndex.blocks.map((block, index) =>
          block.type === "book" ? (
            <section className="book-entry" key={block.slug}>
              <a href={bookHref(block)}>
                <img src={assetUrl(block.cover)} alt="" loading="lazy" />
              </a>
              <div>
                <h3>{block.title}</h3>
                {block.paragraphs.map((paragraph, paragraphIndex) => (
                  <Block key={paragraphIndex} block={paragraph} />
                ))}
              </div>
            </section>
          ) : (
            <Block key={index} block={block} />
          ),
        )}
      </div>
    </div>
  );
}

// Books whose table of contents continues below the cover: the contents end
// with the paragraph that contains this text.
const contentsEnd = {
  "umetnost-zivljenja": "Duhovna napetost",
  mp1: "vloga služenja pri",
};
// Books whose table of contents starts further down: the text before the
// paragraph that starts with this text is shown above the panel.
const contentsStart = {
  mp1: "Iz vsebine:",
  mp2: "Iz vsebine:",
  nenavadni: "Iz vsebine:",
};
// Books whose page has no table of contents, so no contents panel is shown.
const withoutContents = new Set(["zakoni-zivljenja"]);

function BookPageContent({ slug, blocks }) {
  // On the old site the contents and the cover sat side by side above the rest.
  const coverIndex = blocks.findIndex((block) => block.type === "image");
  const notCover = (block) => block !== blocks[coverIndex];
  const found = (test) => blocks.findIndex(test);
  const startIndex = contentsStart[slug]
    ? Math.max(
        found((block) =>
          lineText(block.lines?.[0] ?? [])
            .toLocaleLowerCase("sl")
            .startsWith(contentsStart[slug].toLocaleLowerCase("sl")),
        ),
        0,
      )
    : 0;
  // The panel ends at the given text, else just before the next divider line
  // when it has a start of its own, else at the cover.
  const nextDivider = found(
    (block, index) => index > startIndex && block.type === "hr",
  );
  const endIndex = contentsEnd[slug]
    ? found(
        (block, index) =>
          index > Math.max(startIndex, coverIndex) &&
          block.lines?.some((line) => lineText(line).includes(contentsEnd[slug])),
      )
    : contentsStart[slug]
      ? (nextDivider < 0 ? blocks.length : nextDivider) - 1
      : coverIndex - 1;
  const before = blocks.slice(0, startIndex).filter(notCover);
  const top = blocks.slice(startIndex, endIndex + 1).filter(notCover);
  // Text before the panel keeps its place, including extent and price;
  // extent and price inside the panel are shown below it.
  const facts = top.filter((block) => block.type === "p" && isFacts(block));
  const contents = top.filter((block) => !facts.includes(block));
  const restIndex = Math.max(coverIndex, endIndex) + 1;
  if (coverIndex < 1 || withoutContents.has(slug))
    return (
      <div className="book-page">
        {blocks.map((block, index) => (
          <Block key={index} block={block} subtitles />
        ))}
      </div>
    );
  return (
    <div className="book-page">
      {before.map((block, index) => (
        <Block key={index} block={block} subtitles />
      ))}
      <div className="book-header">
        <Block block={blocks[coverIndex]} />
        <BookContents blocks={contents} />
      </div>
      {[...facts, ...blocks.slice(restIndex)].map((block, index) => (
        <Block key={index} block={block} subtitles />
      ))}
    </div>
  );
}

export function BookPage({ book, anchor }) {
  const [page, setPage] = useState(null);
  useEffect(() => {
    setPage(null);
    bookFiles[`../content/books/${book.slug}.json`]?.().then(setPage);
  }, [book.slug]);
  useEffect(() => {
    if (page && anchor) document.getElementById(anchor)?.scrollIntoView();
  }, [page, anchor]);
  return (
    <div className="container simple-page">
      <Breadcrumb>
        <a href="#/knjige">Knjige</a>
        <span>/</span>
        <span aria-current="page">{book.title}</span>
      </Breadcrumb>
      <h1>{book.title}</h1>
      {page && <BookPageContent slug={book.slug} blocks={page.blocks} />}
      <p>
        <a className="button" href={`#/knjige/narocilo?knjiga=${book.slug}`}>
          Naročite knjigo <span>→</span>
        </a>
      </p>
      <a className="text-link" href="#/knjige">
        ← Vse knjige
      </a>
    </div>
  );
}

export function BookOrder({ selected }) {
  const [quantities, setQuantities] = useState(() =>
    selected ? { [selected]: 1 } : {},
  );
  const [status, setStatus] = useState("idle");
  const ordered = books.filter((book) => quantities[book.slug] > 0);
  async function submit(event) {
    event.preventDefault();
    if (!ordered.length) {
      setStatus("empty");
      return;
    }
    const form = new FormData(event.target);
    setStatus("sending");
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${orderAddress}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "Naročilo knjig s spletne strani",
          _template: "table",
          _captcha: "false",
          _honey: form.get("_honey"),
          "Ime in priimek": form.get("ime"),
          email: form.get("email"),
          Telefon: form.get("telefon"),
          Naslov: form.get("naslov"),
          "Poštna številka in kraj": form.get("posta"),
          "Naročene knjige": ordered
            .map((book) => `${quantities[book.slug]} × ${book.title}`)
            .join("\n"),
          Opombe: form.get("opombe"),
        }),
      });
      const result = await response.json();
      if (!response.ok || String(result.success) !== "true") throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }
  return (
    <div className="container simple-page narrow">
      <Breadcrumb>
        <a href="#/knjige">Knjige</a>
        <span>/</span>
        <span aria-current="page">Naročilo</span>
      </Breadcrumb>
      <h1>Naročilo knjig</h1>
      {status === "sent" ? (
        <div role="status">
          <p className="intro">Hvala! Vaše naročilo smo prejeli.</p>
          <p>Kmalu vas bomo kontaktirali s podatki o plačilu in dostavi.</p>
          <a className="text-link" href="#/knjige">
            ← Nazaj na knjige
          </a>
        </div>
      ) : (
        <form className="order-form" onSubmit={submit}>
          <fieldset>
            <legend>Knjige</legend>
            {books.map((book) => (
              <label className="order-book" key={book.slug}>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={quantities[book.slug] || 0}
                  onChange={(event) =>
                    setQuantities({
                      ...quantities,
                      [book.slug]: Math.max(0, +event.target.value || 0),
                    })
                  }
                />
                <span>{book.title}</span>
              </label>
            ))}
          </fieldset>
          <label>
            Ime in priimek
            <input name="ime" required autoComplete="name" />
          </label>
          <label>
            E-pošta
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            Telefon (neobvezno)
            <input name="telefon" type="tel" autoComplete="tel" />
          </label>
          <label>
            Naslov (ulica in hišna številka)
            <input name="naslov" required autoComplete="street-address" />
          </label>
          <label>
            Poštna številka in kraj
            <input name="posta" required autoComplete="postal-code" />
          </label>
          <label>
            Opombe (neobvezno)
            <textarea name="opombe" rows="4" />
          </label>
          <input
            className="order-honey"
            name="_honey"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
          />
          {status === "empty" && (
            <p role="alert">Izberite vsaj eno knjigo.</p>
          )}
          {status === "error" && (
            <p role="alert">
              Naročila ni bilo mogoče poslati. Poskusite znova ali pišite na{" "}
              <a href={`mailto:${orderAddress}`}>{orderAddress}</a>.
            </p>
          )}
          <p className="order-note">
            Podatke iz obrazca uporabimo samo za izvedbo naročila. Posredujejo
            se prek storitve FormSubmit na naslov {orderAddress}.
          </p>
          <button className="button" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Pošiljanje …" : "Pošlji naročilo"}
          </button>
        </form>
      )}
    </div>
  );
}
