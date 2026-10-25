import { imageUrl } from "../content/images";
import React from "react";
import { pages } from "../content/pages";
export default function Article({ page }) {
  const isIntroduction = page.slug === "uvod";
  return (
    <div
      className={`container article-layout${isIntroduction ? " depth-layout" : ""}`}
    >
      {isIntroduction ? (
        <aside className="article-nav">
          <h2>Na tej strani</h2>
          <nav aria-label="Vsebina uvoda za nove bralce">
            {page.sections.map(([title], index) => (
              <a key={title} href={`#/${page.slug}?odsek=${index}`}>
                {title}
              </a>
            ))}
          </nav>
        </aside>
      ) : (
        <aside className="article-nav">
          <h2>Poglobljeno</h2>
          <nav aria-label="Informativne strani">
            {pages
              .filter((p) => p.slug !== "uvod")
              .map((p) => (
                <a
                  key={p.slug}
                  aria-current={p.slug === page.slug ? "page" : undefined}
                  href={"#/" + p.slug}
                >
                  {p.title}
                </a>
              ))}
          </nav>
        </aside>
      )}
      <article>
        <div className="breadcrumb">
          <a href="#/">Domov</a>
          <span>/</span>
          <span>{page.title}</span>
        </div>
        <h1>{page.title}</h1>
        <p className="intro article-opening">{page.intro}</p>
        {page.image && (
          <img
            referrerPolicy="no-referrer"
            className="article-image"
            src={imageUrl(page.image)}
            alt={page.title}
          />
        )}
        {!isIntroduction && (
          <details className="toc" open>
            <summary>Na tej strani</summary>
            <ol>
              {page.sections.map(([title], i) => (
                <li key={title}>
                  <a href={"#/" + page.slug + "?odsek=" + i}>{title}</a>
                </li>
              ))}
            </ol>
          </details>
        )}
        {page.sections.map(([title, ...paragraphs], i) => (
          <section id={"odsek-" + i} key={title}>
            <h2>{title}</h2>
            {paragraphs.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </section>
        ))}
        <div className="article-next">
          <span>Raziščite tudi</span>
          {pages
            .filter((p) => p.slug !== page.slug)
            .slice(0, 3)
            .map((p) => (
              <a href={"#/" + p.slug} key={p.slug}>
                {p.title} →
              </a>
            ))}
        </div>
      </article>
    </div>
  );
}
