# Source site inspection

Inspected on 25 October 2026: homepage, summary for new readers, Maitreya, priorities, teachings, Ageless Wisdom, Masters of Wisdom, Transmission Meditation, about, contact and article library. Inspection used the delivered HTML, form attributes, asset declarations and script references; live browser interactions were not yet verified.

## Findings

The source is WordPress, not a purely static site. Most informational copy is server-rendered and can be served statically in the rebuild.

| Feature                       | Source evidence                                                             | Rebuild                                                                                    |
| ----------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Navigation and mobile menu    | Responsive Menu Pro scripts, nested links                                   | Responsive navigation with native expandable topic menu                                    |
| Whole-site search             | Google CSE script and google.com search form                                | Local search across the Slovene informational pages                                        |
| Article filtering             | Toolset form: subject, contributor, keyword, AJAX-enabled result attributes | Out of selected archive scope; link to working English source                              |
| Contact submissions           | WPForms POST, required fields, consent and reCAPTCHA                        | Explicit handoff to official English form; no fake submission                              |
| Video                         | Vimeo player iframe                                                         | Removed from the homepage at the user’s request; resource links still open the source site |
| Privacy settings              | Cookie Law Info preference controls                                         | No video consent prompt; no external player is loaded                                      |
| Contents / collapsible blocks | Collapse-O-Matic and table-of-contents plugins                              | Native details element and section anchors                                                 |
| Scroll to top                 | WPFront plugin                                                              | Accessible back-to-top link with reduced-motion support                                    |
| Language switcher             | WPML language routes                                                        | Slovene interface and link to English source                                               |
| Current magazine              | Issue-specific rendered content                                             | October 2026 snapshot, linked to official current issue                                    |
| Media and image overlays      | Fancybox and MediaElement scripts                                           | Outbound resource links; no general media archive cloned                                   |

No authentication requirement was encountered on the inspected pages. Global loading of a WordPress plugin is not proof that its feature is active on every page. Search, contact delivery, reCAPTCHA validation, AJAX results and media playback were not submitted or exercised on the original site.

## Content boundaries

Included: homepage; introduction for new readers; Maitreya; priorities; teachings; Ageless Wisdom; Masters of Wisdom; Transmission Meditation; about/Benjamin Creme; local resources, contact handoff, privacy and search pages.

The longer informational texts have been editorially condensed in Slovene. This must not be represented as a full, line-by-line translation. Every article includes its English source link. Historical and spiritual assertions remain attributed to the source organisation or its teachings. Original statistics with old reference dates are not presented as current facts.

Excluded: full article archive, every nested Maitreya/signs subpage, publications, news-media collection, event records, account/backend systems, translated video/audio, original contact endpoint integration and automatic WordPress synchronisation. Neither published services nor source data have been altered.

The rebuild is static. Updating the magazine snapshot and translated content requires editing and redeploying; it does not automatically follow the original WordPress database.

## Current link policy

Only the top-bar English language link points to the original website. Article source notes and footer references are removed. The homepage magazine links to the local magazine placeholder. Contact is a local placeholder and collects no submissions. The source paths and external contact/privacy instructions have been removed from the rendered informational content; historical research and spiritual claims retain their attribution. Earlier source inspection notes above describe the original implementation, not current integrations.

## Complete In depth restoration

Following explicit permission confirmation, all 27 captured In depth pages have complete Slovene text, headings, lists, quotations, tables and captions. The general Q&A contains all 286 questions and answers. Source extraction was checked against every non-form paragraph in the original main content, with zero missing paragraphs. Translation structure was independently checked: 28 JSON assets represent 27 logical pages, with 1,671 top-level blocks and 1,798 translated fields. All 114 distinct source images are downloaded locally and retain their 131 content placements.

Only forms and associated filter instructions, scripts, video/audio players and hidden duplicate expand/collapse labels are excluded from content. Topic cards and internal cross-links map to local pages; resource categories remain the user's own placeholders. Only the top language-bar English link points to the original site. Global header search remains local. Historical answers retain the dates and assertions of Benjamin Creme. NLP is used consistently in visible content and in the canonical topic route.

Earlier Content boundaries notes describe the initial limited implementation and are superseded by this restoration for Poglobljeno. Introduction/about pages are not part of this expansion.

## Current image hosting

At the user’s request, every image now loads directly from its original hosted URL. Local image copies are removed from the source and deployment; fonts remain local. All 114 distinct In depth images and all shared homepage/article images retain their original URLs, captions, positions and alt text. Previous notes about locally downloaded or optimized images describe the earlier implementation and are superseded by this setting. Completeness validation maps hosted URLs back to the captured image identifiers before comparing structure.

## Messages page update

The supplied Slovene page, https://www.share-international.net/slo/publikacije/sporocila.htm, replaces content from message1 onward with verbatim messages10,11,13,52,81,82,104. All54 message paragraphs preserve wording and stanza breaks; only HTML whitespace is normalized. The first four introductory paragraphs are retained. Separate content hashes and title/date checks validate these supplied translations. The earlier general In depth structure manifest was intentionally updated for this explicitly replaced page.

All seven legacy recordings were recovered from the public Internet Archive after the original host timed out. They are converted to local MP3 files and include native players, duration displays and downloads. The exact source/archive URLs and output checksums are recorded separately in message-audio-provenance.json. None of those provenance links are displayed as outbound site navigation. Images remain remote.
