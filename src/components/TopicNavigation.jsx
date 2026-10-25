import React from "react";
import { inDepthPages, topicLevel } from "../content/inDepth";

export default function TopicNavigation({ current }) {
  return (
    <aside className="article-nav">
      <h2>Poglobljeno</h2>
      <nav aria-label="Teme v razdelku Poglobljeno">
        {inDepthPages.map((page) => (
          <a
            key={page.slug}
            className={topicLevel(page.slug) ? "topic-child" : undefined}
            aria-current={
              page.slug === current ||
              (page.slug === "vprasanja-in-odgovori" &&
                current.startsWith(page.slug + "/"))
                ? "page"
                : undefined
            }
            href={"#/" + page.slug}
          >
            {page.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
