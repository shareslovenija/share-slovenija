import React, { useEffect, useState } from "react";

// Magazine content lives in public/revija/ so it can be replaced without a
// rebuild: stevilke.json lists the issues (newest first), and each issue has a
// folder named after it (e.g. 2026-09/) with naslovnica.jpg and vsebina.json.
const magazineDir = `${import.meta.env.BASE_URL}revija/`;
const coverUrl = (issue) =>
  `${magazineDir}${issue.id}/naslovnica.jpg?v=${encodeURIComponent(issue.izdaja ?? "")}`;

function useJson(path) {
  const [data, setData] = useState(null);
  useEffect(() => {
    setData(null);
    if (!path) return;
    fetch(magazineDir + path, { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : false))
      .then(setData)
      .catch(() => setData(false));
  }, [path]);
  return data;
}
const useIssues = () => useJson("stevilke.json") || [];

function Cover({ issue }) {
  const [missing, setMissing] = useState(false);
  return missing ? (
    <span className="magazine-cover-missing">{issue.izdaja}</span>
  ) : (
    <img
      src={coverUrl(issue)}
      alt={issue.opisNaslovnice ?? `Naslovnica revije Share International, ${issue.izdaja}`}
      loading="lazy"
      onError={() => setMissing(true)}
    />
  );
}

// The issue's highlights from stevilke.json, or else the titles of its articles.
function Highlights({ issue, text }) {
  const items =
    issue.poudarki?.length > 0
      ? issue.poudarki
      : (text?.blocks ?? []).filter((block) => block.type === "h2").map(blockText);
  return (
    <>
      <span className="issue-label">{issue.izdaja}</span>
      {items.length > 0 && (
        <ul>
          {items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </>
  );
}

// Cover and contents of the newest published issue, for the home page. Issues
// marked "vDelu" in stevilke.json are still being prepared and are skipped.
export function CurrentIssue() {
  const issue = useIssues().find((item) => !item.vDelu);
  const text = useJson(issue && !issue.poudarki?.length ? `${issue.id}/vsebina.json` : null);
  if (!issue) return <div className="magazine-content" />;
  return (
    <div className="magazine-content">
      <a href={`#/revija/${issue.id}`}>
        <Cover issue={issue} />
      </a>
      <div>
        <Highlights issue={issue} text={text} />
      </div>
    </div>
  );
}

function Segment({ segment }) {
  let text = segment.text;
  if (segment.em) text = <em>{text}</em>;
  if (segment.strong) text = <strong>{text}</strong>;
  return segment.href ? (
    <a href={segment.href} rel="noreferrer">
      {text}
    </a>
  ) : (
    text
  );
}

function IssueBlock({ block, id, className, folder, version }) {
  if (block.type === "image")
    return (
      <img
        className={"issue-image" + (block.sirina < 70 ? " issue-image-narrow" : "")}
        style={{ width: `${block.sirina}%` }}
        src={`${magazineDir}${folder}/${block.src}?v=${encodeURIComponent(version ?? "")}`}
        alt=""
        loading="lazy"
      />
    );
  const content = block.segments
    ? block.segments.map((segment, index) => <Segment key={index} segment={segment} />)
    : block.text;
  if (block.type === "h2") return <h2 id={id}>{content}</h2>;
  if (block.type === "h3") return <h3 className={className}>{content}</h3>;
  if (block.type === "kicker") return <p className="eyebrow issue-kicker">{content}</p>;
  if (block.type === "caption") return <p className="depth-caption issue-caption">{content}</p>;
  return <p className={className}>{content}</p>;
}

const blockText = (block) => block.text ?? block.segments?.map((s) => s.text).join("") ?? "";

// The issue's text, converted from the PDF by scripts/import-magazine.mjs.
function IssueText({ id, issue, anchor }) {
  useEffect(() => {
    if (issue && anchor) document.getElementById(anchor)?.scrollIntoView();
  }, [issue, anchor]);
  const titles = issue.blocks.filter((block) => block.type === "h2");
  const content = [];
  for (let index = 0; index < issue.blocks.length; index++) {
    const block = issue.blocks[index];
    if (block.type !== "li") {
      const number = titles.indexOf(block) + 1;
      // Each article after the first is set apart by a line, above its
      // section label when it has one.
      const starts =
        block.type === "kicker" || (number && issue.blocks[index - 1]?.type !== "kicker");
      if (starts && index > 0)
        content.push(<hr className="article-divider" key={`hr-${index}`} />);
      // A short line right below a title names the author.
      const byline =
        issue.blocks[index - 1]?.type === "h2" &&
        block.type !== "h2" &&
        blockText(block).length < 100;
      content.push(
        <IssueBlock
          key={index}
          block={block}
          id={number ? `clanek-${number}` : undefined}
          className={byline ? "issue-byline" : undefined}
          folder={id}
          version={issue.izdaja}
        />,
      );
      continue;
    }
    const items = [];
    for (; issue.blocks[index]?.type === "li"; index++)
      items.push(<li key={index}><IssueBlock block={{ ...issue.blocks[index], type: "span" }} /></li>);
    index--;
    content.push(<ul key={`list-${index}`}>{items}</ul>);
  }
  return (
    <>
      {titles.length > 1 && (
        <details className="toc" open>
          <summary>V tej številki</summary>
          <ol>
            {titles.map((title, index) => (
              <li key={index}>
                <a href={`#/revija/${id}?ancla=clanek-${index + 1}`}>
                  {blockText(title)}
                </a>
              </li>
            ))}
          </ol>
        </details>
      )}
      <div className="depth-content issue-text">{content}</div>
    </>
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

// All issues as clickable covers, newest first.
export default function Magazine() {
  const issues = useIssues();
  return (
    <div className="container simple-page">
      <Breadcrumb>
        <span aria-current="page">Revija</span>
      </Breadcrumb>
      <h1>Revija Share International</h1>
      <p className="intro">
        Revija povezuje politične, družbene, gospodarske in duhovne spremembe
        ter spodbuja praktično delovanje za pravičnejši in sočutnejši svet.
      </p>
      <div className="magazine-grid">
        {issues.map((issue) =>
          issue.vDelu ? (
            <div className="magazine-card" key={issue.id}>
              <span className="magazine-cover-missing">Trenutno v delu</span>
              <span>{issue.izdaja}</span>
            </div>
          ) : (
            <a className="magazine-card" href={`#/revija/${issue.id}`} key={issue.id}>
              <Cover issue={issue} />
              <span>{issue.izdaja}</span>
            </a>
          ),
        )}
      </div>
    </div>
  );
}

// One issue: its text, or, until the text is added, its cover and highlights.
export function MagazineIssue({ id, anchor }) {
  const issues = useIssues();
  const entry = issues.find((issue) => issue.id === id);
  const text = useJson(`${id}/vsebina.json`);
  const izdaja = text?.izdaja ?? entry?.izdaja;
  return (
    <div className="container simple-page narrow">
      <Breadcrumb>
        <a href="#/revija">Revija</a>
        <span>/</span>
        <span aria-current="page">{izdaja ?? id}</span>
      </Breadcrumb>
      <h1>Revija Share International</h1>
      {izdaja && <p className="issue-subtitle">{izdaja}</p>}
      {text ? (
        <IssueText id={id} issue={text} anchor={anchor} />
      ) : (
        text === false &&
        entry && (
          <div className="magazine-content">
            <Cover issue={entry} />
            <div>
              <Highlights issue={entry} />
            </div>
          </div>
        )
      )}
      <p>
        <a className="text-link" href="#/revija">
          ← Vse številke
        </a>
      </p>
    </div>
  );
}
