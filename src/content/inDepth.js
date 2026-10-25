import catalog from "./in-depth/catalog.json" with { type: "json" };
// Generated from the individual translated JSON files by scripts/build-content.mjs.
const sourceOrder = [
  "poglobljeno-pregled",
  "maitreja",
  "prednostne-naloge",
  "maitrejev-prihod",
  "nauki",
  "maitreja-in-jezus",
  "maitreja-in-drugi-ucitelji",
  "maitrejeva-sporocila",
  "vprasanja-o-maitreji",
  "znamenja",
  "znamenja/svetlobni-krizi",
  "znamenja/svetlobni-vzorci",
  "znamenja/svetlobni-blagoslovi",
  "znamenja/kipi-in-ikone",
  "znamenja/prikazovanja-in-videnja",
  "znamenja/zdravilne-vode",
  "znamenja/maitreja-v-nairobiju",
  "znamenja/maitrejeva-roka",
  "znamenja/maitrejeva-zvezda",
  "znamenja/nlp",
  "znamenja/zitni-krogi",
  "vecna-modrost",
  "mojstri-modrosti",
  "clanki-mojstra",
  "transmisijska-meditacija",
  "vprasanja-in-odgovori",
  "slovar",
];

export const inDepthPages = [...catalog].sort(
  (a, b) => sourceOrder.indexOf(a.slug) - sourceOrder.indexOf(b.slug),
);

export const isInDepth = (slug) =>
  inDepthPages.some((page) => page.slug === slug);
export const topicLevel = (slug) =>
  slug.startsWith("znamenja/") ||
  [
    "prednostne-naloge",
    "maitrejev-prihod",
    "nauki",
    "maitreja-in-jezus",
    "maitreja-in-drugi-ucitelji",
    "maitrejeva-sporocila",
    "vprasanja-o-maitreji",
  ].includes(slug)
    ? 1
    : 0;
