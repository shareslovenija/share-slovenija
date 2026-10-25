# Share International — Slovenija

A modular React + Vite recreation of the main informational experience at https://share-international.org/. All interface labels are Slovene. Images load directly from the original Share International image host; fonts are stored locally. The homepage has no embedded video.

## Run

Node.js 22 or later:

```sh
npm install
npm run dev
npm run check
npm run build
npm run preview
```

In this workspace, a portable Node runtime is available at `/tmp/node-v22.22.0-linux-x64/bin`; add it to PATH if Node is not installed system-wide.

## Structure

- `src/content/pages.js`: page registry, introduction/about content, and homepage previews.
- `src/content/in-depth/`: complete Slovene translations for all 27 In depth pages; Q&A is split into two files.
- `src/content/inDepth.js`: full-content registry and topic hierarchy.
- `src/content/in-depth-presentation.json`: local topic-card links and section anchors.
- `src/components/FullArticle.jsx`: safe structured rendering of full text, lists, quotations, tables, images and captions.
- `scripts/build-content.mjs`: generates the ignored content catalog before development, checks and builds.
- `scripts/validate-depth.mjs`: verifies source structure and completeness against the saved manifest.
- `src/components/`: navigation, article layout, homepage, and footer.
- `src/main.jsx`: routing, local search, resources, contact placeholder and privacy.
- `src/styles.css`: responsive layout and branding.
- `src/fonts.css`: local Noto Sans, Roboto, Open Sans and Noto Serif font faces.
- `public/assets/fonts/`: font files and their SIL Open Font Licenses.
- `src/content/images.js`: original URLs for shared homepage/article images.
- `src/content/image-origins.json`: original image URLs used for source completeness validation.
- `docs/site-audit.md`: inspected functionality and implementation boundaries.

Hash routes allow deployment on static hosting without server rewrite rules. Search runs locally over the translated informational pages and does not submit queries to Google. Article contents use accessible native disclosure controls. No backend, analytics or tracking cookies are required. No video consent prompt is displayed because no external video player is loaded.

The theme follows the original site's computed styles: burgundy `#8C0E3E` header/footer, dark blue `#004F78` utility bar, `#333333` text, `#0D72C7` links, and `#EEEEEE` alternate sections. Body copy uses Noto Sans, headings/navigation Roboto, the site title Open Sans, and the opening drop cap Noto Serif. Fonts are served locally and include Slovene characters.

The 27 pages in Poglobljeno contain complete Slovene translations of their captured source content, including 286 general questions and answers, quotations, lists, tables, and 114 distinct images (131 placements). Forms, form instructions, scripts, embedded media players and duplicate hidden expand/collapse labels are omitted. The introduction and organisation pages retain their earlier Slovene adaptations. The user confirmed permission to reproduce and translate the texts and images. Resource categories and contact details are local placeholders for future content. The only visitor-facing link to the original website is the English language link in the top bar.

## Local resource categories

The six categories under `#/viri` link to local placeholder pages: `#/viri/revija`, `#/viri/clanki`, `#/viri/knjige`, `#/viri/videoposnetki`, `#/viri/zvocni-posnetki`, and `#/viri/dogodki`. Category labels, descriptions and placeholder copy live in `src/content/resources.js`; their presentation is in `src/components/Resources.jsx`. Replace the empty-state section with your own resource content when ready. These categories have no external archive or media service dependency.

## Full In depth content

Edit the individual JSON translation files, not the generated `catalog.json` or `dist/` output. Restart the dev server after content edits, or run `node scripts/build-content.mjs` to regenerate the catalog. Each block retains its source order and structural type; image URLs point directly to `https://rsrc.share-international.org/images/`. `npm run check` verifies all 27 pages, 1,671 top-level source blocks and 1,798 translated text fields. The captured structure is documented in `docs/in-depth-source-manifest.json`.

The general Q&A source contains historical answers from Benjamin Creme. Dates, numerical claims and statements have been retained as part of the complete translation, rather than rewritten as current advice or updated figures. The Slovene abbreviation is NLP; the topic URL is `#/znamenja/nlp`, with the earlier URL retained as an alias. All source links in the content are replaced with local topic, contact or resource routes.

Image files are not included in `public/` or the deployment. The browser requests the original hosted images directly with `referrerPolicy="no-referrer"`. This applies to all homepage, article, and In depth images. The original-language link in the top bar remains the only outbound navigation link.

## Verbatim Slovene messages and audio

`src/content/messages/` holds the seven supplied Slovene translations (messages10,11,13,52,81,82,104), preserving their wording, dates, paragraphs and line breaks. The previous message1 translation and everything following it were removed from the messages page; its four introductory paragraphs remain. `MessageSection.jsx` renders a separated section, native audio player and MP3 download per message. Only one recording plays at a time; `preload="none"` avoids downloading seven files on page load.

The linked RealAudio host was unavailable, so original public recordings were recovered from the Internet Archive and converted with FFmpeg to MP3 (64kbps,22.05kHz,mono). The RealMedia files contain multiple codec streams; the active audio stream was selected before conversion. All seven MP3s pass full decode verification. Recordings are hosted locally in `public/audio/`, as requested, while images still use their original hosted URLs. Exact text hashes are checked by `scripts/validate-messages.mjs`; recording provenance and checksums are in `docs/message-audio-provenance.json`.
