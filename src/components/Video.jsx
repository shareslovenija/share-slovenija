import React from "react";
export default function Video({ allowed, openPreferences }) {
  return (
    <section className="video-box">
      {allowed ? (
        <iframe
          title="Benjamin Creme: načrt evolucije, duhovna hierarhija, Maitreja in Jezus (v angleščini)"
          src="https://player.vimeo.com/video/7759003?dnt=1"
          allow="fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <div className="video-placeholder">
          <span className="play" aria-hidden="true">
            ▷
          </span>
          <strong>Benjamin Creme: svetovni učitelj</strong>
          <span>Predavanje v New Yorku, 2001 · v angleščini</span>
          <button onClick={openPreferences}>Dovolite Vimeo za ogled</button>
        </div>
      )}
      <p className="caption">
        Načrt evolucije, duhovna hierarhija, Maitreja in Jezus
      </p>
    </section>
  );
}
