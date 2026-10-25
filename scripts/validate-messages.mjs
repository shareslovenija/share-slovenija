import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { messages } from "../src/content/messages.js";
const manifest = JSON.parse(
  readFileSync("docs/messages-source-manifest.json", "utf8"),
);
assert.deepEqual(
  messages.map((message) => message.number),
  [10, 11, 13, 52, 81, 82, 104],
);
let paragraphs = 0;
for (const message of messages) {
  const expected = manifest[message.number];
  assert.equal(message.paragraphs.length, expected.paragraphs);
  assert.equal(
    createHash("sha256").update(message.paragraphs.join("\n\n")).digest("hex"),
    expected.textHash,
    `Verbatim message changed: ${message.number}`,
  );
  assert.equal(message.title, expected.title);
  assert.equal(message.date, expected.date);
  assert.equal(message.audio.type, "audio/mpeg");
  assert(
    message.audio.src.startsWith("/audio/") &&
      message.audio.src.endsWith(".mp3"),
  );
  assert(statSync("public" + message.audio.src).size > 100000);
  assert(message.audio.duration > 400);
  paragraphs += message.paragraphs.length;
}
console.log(
  `Verified ${messages.length} verbatim Slovene messages (${paragraphs} paragraphs) and ${messages.length} converted MP3 recordings.`,
);
