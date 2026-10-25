import React from "react";
import { findMessage } from "../content/messages";

export default function MessageSection({ number }) {
  const message = findMessage(number);
  const label = `sporocilo-${message.number}`;
  const duration =
    message.audio &&
    `${Math.floor(message.audio.duration / 60)}:${String(Math.floor(message.audio.duration % 60)).padStart(2, "0")}`;
  const audioSrc =
    message.audio &&
    `${import.meta.env.BASE_URL}${message.audio.src.replace(/^\/+/, "")}`;
  return (
    <section
      className="message-section"
      id={label}
      aria-labelledby={`${label}-title`}
    >
      <header className="message-heading">
        <h2 id={`${label}-title`}>{message.title}</h2>
        <p className="message-date">{message.date}</p>
      </header>
      {message.audio ? (
        <div className="message-recording">
          <p id={`${label}-audio-label`}>
            Izvirni zvočni posnetek <span>· {duration}</span>
          </p>
          <audio
            className="message-audio"
            controls
            preload="none"
            aria-labelledby={`${label}-audio-label ${label}-title`}
            onPlay={(event) =>
              document.querySelectorAll(".message-audio").forEach((player) => {
                if (player !== event.currentTarget) player.pause();
              })
            }
          >
            <source src={audioSrc} type="audio/mpeg" />
            Vaš brskalnik ne podpira predvajanja zvoka.
          </audio>
          <a className="message-download" href={audioSrc} download>
            Prenesite posnetek (MP3)
          </a>
        </div>
      ) : (
        <p className="message-audio-unavailable">
          Zvočni posnetek trenutno ni na voljo.
        </p>
      )}
      <div className="message-text">
        <p>{message.paragraphs.join("\n\n")}</p>
      </div>
      <a
        className="message-back"
        href="#/maitrejeva-sporocila"
        onClick={(event) => {
          event.preventDefault();
          window.scrollTo(0, 0);
        }}
      >
        ↑ Na vrh strani
      </a>
    </section>
  );
}
