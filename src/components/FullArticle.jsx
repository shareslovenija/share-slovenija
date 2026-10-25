import React, { useMemo } from "react";
import TopicNavigation from "./TopicNavigation";
import MessageSection from "./MessageSection";
import {
  questionCategories,
  questionIntroduction,
} from "../content/questionCategories";
import presentation from "../content/in-depth-presentation.json";

function collect(blocks, output = []) {
  for (const block of blocks) {
    output.push(block);
    if (block.children) collect(block.children, output);
    if (block.items) for (const item of block.items) collect(item, output);
  }
  return output;
}

function ContentBlock({ block, context, suppressLinks = false }) {
  const { ids, slug, links, aliases } = context;
  if (block.type === "message") return <MessageSection number={block.number} />;
  const key = ids.get(block);
  const id = block.id || key;
  const children = block.children?.map((child, index) => (
    <ContentBlock
      key={index}
      block={child}
      context={context}
      suppressLinks={suppressLinks}
    />
  ));
  const href =
    !suppressLinks && block.type !== "h3" && (block.href || links[key]);
  const glossarySeparator =
    slug === "slovar" && block.type === "p"
      ? (block.text?.indexOf(" — ") ?? -1)
      : -1;
  const formattedText =
    glossarySeparator > 0 ? (
      <>
        <strong>{block.text.slice(0, glossarySeparator)}</strong>
        {block.text.slice(glossarySeparator)}
      </>
    ) : (
      block.text
    );
  const text = href ? <a href={href}>{formattedText}</a> : formattedText;
  let element;
  if (block.type === "image") {
    element = (
      <img
        id={id}
        referrerPolicy="no-referrer"
        className="depth-image"
        src={block.src}
        alt={block.alt || ""}
        loading="lazy"
      />
    );
  } else if (block.type === "list") {
    const List = block.ordered ? "ol" : "ul";
    element = (
      <List id={id}>
        {block.items.map((item, index) => (
          <li key={index}>
            {item.map((child, childIndex) => (
              <ContentBlock
                key={childIndex}
                block={child}
                context={context}
                suppressLinks={suppressLinks}
              />
            ))}
          </li>
        ))}
      </List>
    );
  } else if (block.type === "quote") {
    element = <blockquote id={id}>{text}</blockquote>;
  } else if (block.type === "caption") {
    element = (
      <p className="depth-caption" id={id}>
        {text}
      </p>
    );
  } else if (
    slug === "slovar" &&
    block.type === "p" &&
    /^[A-Z]$/.test(block.text)
  ) {
    element = block.id ? (
      <h2 id={id}>{block.text}</h2>
    ) : (
      <a className="glossary-letter" href={`#/slovar?ancla=${block.text}`}>
        {block.text}
      </a>
    );
  } else {
    const Tag = [
      "p",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "figure",
      "figcaption",
      "blockquote",
      "dl",
      "dt",
      "dd",
      "table",
      "thead",
      "tbody",
      "tr",
      "td",
      "th",
    ].includes(block.type)
      ? block.type
      : "p";
    element = (
      <Tag
        id={id}
        colSpan={block.colspan}
        className={
          block === context.openingParagraph ? "article-opening" : undefined
        }
      >
        {block.text ? text : children}
      </Tag>
    );
  }
  return (
    <>
      {(aliases[key] || [])
        .filter((alias) => alias !== id)
        .map((alias) => (
          <span key={alias} id={alias} />
        ))}
      {element}
    </>
  );
}

function MaitreyaFaq({ page, context }) {
  const output = [];
  let question = null;
  let answers = [];
  const flush = () => {
    if (!question) return;
    const id = question.id || context.ids.get(question);
    output.push(
      <section className="faq-box" key={id} aria-labelledby={id}>
        <h3 id={id}>{question.text}</h3>
        {answers.map((block, index) => (
          <ContentBlock key={index} block={block} context={context} />
        ))}
      </section>,
    );
    question = null;
    answers = [];
  };
  page.blocks.forEach((block, index) => {
    // The source marks this follow-up question as an ordinary paragraph.
    const isFollowUp = page.slug === "vprasanja-o-maitreji" && index === 22;
    if (block.type === "h3" || isFollowUp) {
      flush();
      question = block;
    } else if (block.text === "Glejte tudi") {
      flush();
      output.push(<ContentBlock key={index} block={block} context={context} />);
    } else if (question) answers.push(block);
    else
      output.push(<ContentBlock key={index} block={block} context={context} />);
  });
  flush();
  return <>{output}</>;
}

export default function FullArticle({ page }) {
  const isQuestionIndex = page.slug === "vprasanja-in-odgovori";
  const isMaitreyaFaq = page.slug === "vprasanja-o-maitreji";
  const { context, headings, cards, omitted } = useMemo(() => {
    const meta = presentation[page.slug] || {};
    const all = collect(page.blocks);
    const ids = new Map(
      all.map((block, index) => [block, `besedilo-${index}`]),
    );
    const headings = all.filter((block) => /^h[2-6]$/.test(block.type));
    const aliases = {};
    for (const [alias, target] of Object.entries(meta.anchors || {})) {
      (aliases[target] ||= []).push(alias);
    }
    return {
      context: {
        ids,
        slug: page.slug,
        links: meta.links || {},
        aliases,
        openingParagraph: page.questionCategory
          ? undefined
          : page.blocks.find(
              (block) => block.type === "p" && block.text?.trim().length > 1,
            ),
      },
      headings,
      cards: new Map((meta.cards || []).map((card) => [card.start, card])),
      omitted: new Set(meta.omitBlocks || []),
    };
  }, [page]);
  const content = [];
  let cardGroup = [];
  const flushCards = () => {
    if (!cardGroup.length) return;
    content.push(
      <div className="depth-topic-grid" key={`topics-${content.length}`}>
        {cardGroup}
      </div>,
    );
    cardGroup = [];
  };
  for (let index = 0; index < page.blocks.length; index++) {
    if (omitted.has(index)) continue;
    const card = cards.get(index);
    if (card) {
      const [image, heading, description] = page.blocks.slice(
        card.start,
        card.end + 1,
      );
      cardGroup.push(
        <a className="depth-topic-card" href={card.href} key={index}>
          <ContentBlock block={image} context={context} suppressLinks />
          <div>
            <ContentBlock block={heading} context={context} suppressLinks />
            <ContentBlock block={description} context={context} suppressLinks />
          </div>
        </a>,
      );
      index = card.end;
    } else {
      flushCards();
      content.push(
        <ContentBlock
          key={index}
          block={page.blocks[index]}
          context={context}
        />,
      );
    }
  }
  flushCards();
  return (
    <div className="container article-layout depth-layout">
      <TopicNavigation current={page.slug} />
      <article className="full-article">
        <nav className="breadcrumb" aria-label="Pot do strani">
          <a href="#/">Domov</a>
          <span>/</span>
          <a href="#/poglobljeno-pregled">Poglobljeno</a>
          <span>/</span>
          <span aria-current="page">{page.title}</span>
        </nav>
        <h1>{page.title}</h1>
        {page.questionCategory && (
          <p>
            <a href="#/vprasanja-in-odgovori">
              ← Vse kategorije vprašanj in odgovorov
            </a>
          </p>
        )}
        {!isMaitreyaFaq &&
          !isQuestionIndex &&
          !page.questionCategory &&
          headings.length > 1 &&
          !cards.size && (
            <details className="toc" open={headings.length <= 30}>
              <summary>Na tej strani</summary>
              <ol>
                {headings.map((heading, index) => (
                  <li key={index}>
                    <a
                      href={`#/${page.slug}?ancla=${encodeURIComponent(heading.id || context.ids.get(heading))}`}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          )}
        <div className="depth-content">
          {isQuestionIndex ? (
            <>
              {questionIntroduction.map((block, index) => (
                <ContentBlock key={index} block={block} context={context} />
              ))}
              <div className="question-category-grid">
                {questionCategories.map((category) => (
                  <a key={category.slug} href={`#/${category.slug}`}>
                    <span>{category.title}</span>
                    <small>{category.questionIds.length} vprašanj</small>
                  </a>
                ))}
              </div>
            </>
          ) : isMaitreyaFaq || page.questionCategory ? (
            <MaitreyaFaq page={page} context={context} />
          ) : (
            content
          )}
        </div>
      </article>
    </div>
  );
}
