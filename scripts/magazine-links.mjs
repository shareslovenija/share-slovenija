// Link areas in the PDF do not line up exactly with the words, so links come
// out with stray spaces, punctuation or the end of the previous word. This
// moves each link's edges to whole words and collapses repeated spaces.
const isWord = (char) => /[\p{L}\p{N}]/u.test(char ?? "");

export function tidyLinks(segments) {
  // One entry per character with its formatting.
  const chars = segments.flatMap(({ text, ...format }) =>
    [...text].map((char) => ({ char: /\s/.test(char) ? " " : char, ...format })),
  );
  for (let start = 0; start < chars.length; ) {
    const href = chars[start].href;
    if (!href) {
      start++;
      continue;
    }
    let end = start;
    while (end < chars.length && chars[end].href === href) end++;
    const runEnd = end;
    let from = start;
    let to = end;
    // A link that begins inside the previous word gives that part back.
    if (isWord(chars[from - 1]?.char) && isWord(chars[from].char))
      while (from < to && isWord(chars[from].char)) from++;
    while (from < to && !isWord(chars[from].char)) from++;
    while (to > from && !isWord(chars[to - 1].char)) to--;
    // A link that ends inside a word takes the rest of that word.
    if (to === runEnd && to > from)
      while (isWord(chars[to]?.char) && !chars[to].href) to++;
    for (let index = start; index < Math.max(runEnd, to); index++) {
      if (index >= from && index < to) chars[index].href = href;
      else if (chars[index].href === href) delete chars[index].href;
    }
    start = Math.max(runEnd, to);
  }
  // Rebuild the segments, dropping repeated spaces.
  const result = [];
  for (const [index, { char, ...format }] of chars.entries()) {
    if (char === " " && chars[index - 1]?.char === " ") continue;
    const last = result.at(-1);
    if (last && ["strong", "em", "href"].every((key) => last[key] === format[key]))
      last.text += char;
    else result.push({ text: char, ...format });
  }
  if (result.length) {
    result[0].text = result[0].text.trimStart();
    result.at(-1).text = result.at(-1).text.trimEnd();
  }
  return result.filter((segment) => segment.text);
}
