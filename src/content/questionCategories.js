import categories from "./question-categories.json" with { type: "json" };
import { inDepthPages } from "./inDepth.js";

const source = inDepthPages.find(
  (page) => page.slug === "vprasanja-in-odgovori",
);
const groups = new Map();
let current;
for (const block of source.blocks) {
  if (block.type === "h3") {
    current = [];
    groups.set(block.id, current);
  }
  if (current) current.push(block);
}
export const questionCategories = categories.map((category) => ({
  ...category,
  intro: `Vprašanja in odgovori: ${category.title}`,
  questionCategory: true,
  blocks: category.questionIds.flatMap((id) => groups.get(id)),
}));
export const questionIntroduction = source.blocks.slice(
  0,
  source.blocks.findIndex((block) => block.type === "h3"),
);
