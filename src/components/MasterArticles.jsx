import React, { useEffect, useState } from "react";
import TopicNavigation from "./TopicNavigation";

// Imported by scripts/import-master-articles.mjs; each article loads on demand.
const [articleIndex = []] = Object.values(
  import.meta.glob("../content/master-articles/index.json", {
    eager: true,
    import: "default",
  }),
);
const articleFiles = import.meta.glob("../content/master-articles/*.json", {
  import: "default",
});

export const masterArticlePrefix = "clanki-mojstra/";
export const findMasterArticle = (slug) =>
  articleIndex.find((article) => masterArticlePrefix + article.slug === slug);

export function MasterArticleIndex() {
  const years = [...new Set(articleIndex.map((article) => article.year))].sort(
    (a, b) => b - a,
  );
  return (
    <div className="master-article-index">
      <nav className="master-years" aria-label="Leta">
        {years.map((year) => (
          <a key={year} href={`#/clanki-mojstra?ancla=leto-${year}`}>
            {year}
          </a>
        ))}
      </nav>
      {years.map((year) => (
        <section key={year} aria-labelledby={`leto-${year}`}>
          <h2 id={`leto-${year}`}>{year}</h2>
          <ul>
            {articleIndex
              .filter((article) => article.year === year)
              .map((article) => (
                <li key={article.slug}>
                  <a href={"#/" + masterArticlePrefix + article.slug}>
                    {article.title}
                  </a>{" "}
                  <span className="master-date">({article.date})</span>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Text({ block }) {
  if (!block.segments) return block.text;
  return block.segments.map((segment, index) => {
    let text = segment.text;
    if (segment.em) text = <em>{text}</em>;
    if (segment.strong) text = <strong>{text}</strong>;
    return <React.Fragment key={index}>{text}</React.Fragment>;
  });
}

export function MasterArticle({ meta }) {
  const [article, setArticle] = useState(null);
  useEffect(() => {
    setArticle(null);
    articleFiles[`../content/master-articles/${meta.slug}.json`]?.().then(
      setArticle,
    );
  }, [meta.slug]);
  return (
    <div className="container article-layout depth-layout">
      <TopicNavigation current="clanki-mojstra" />
      <article className="full-article">
        <nav className="breadcrumb" aria-label="Pot do strani">
          <a href="#/">Domov</a>
          <span>/</span>
          <a href="#/poglobljeno-pregled">Poglobljeno</a>
          <span>/</span>
          <a href="#/clanki-mojstra">Mojstrova sporočila</a>
          <span>/</span>
          <span aria-current="page">{meta.title}</span>
        </nav>
        <h1>{meta.title}</h1>
        <p className="issue-label">Share International, {meta.date}</p>
        <div className="depth-content">
          {article?.blocks.map((block, index) => {
            const Tag = block.type === "h2" ? "h2" : "p";
            return (
              <Tag key={index}>
                <Text block={block} />
              </Tag>
            );
          })}
        </div>
        <p>
          <a href="#/clanki-mojstra">← Vsa Mojstrova sporočila</a>
        </p>
      </article>
    </div>
  );
}
