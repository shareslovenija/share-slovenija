import React from "react";
import { useState } from "react";
const key = "share-si-preferences";
function read() {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}
export default function CookieConsent({ children }) {
  const [preference, setPreference] = useState(read);
  const [visible, setVisible] = useState(!preference);
  function save(external) {
    const value = { external };
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
    setPreference(value);
    setVisible(false);
  }
  return (
    <>
      {children({
        external: preference?.external === true,
        openPreferences: () => setVisible(true),
      })}
      {visible && (
        <aside className="cookie-panel" aria-label="Nastavitve zasebnosti">
          <div>
            <strong>Vaša zasebnost</strong>
            <p>
              Za delovanje strani ne uporabljamo sledilnikov. Z vašo
              privolitvijo lahko naložimo videoposnetke Vimeo. Izbiro shranimo v
              vaš brskalnik.
            </p>
            <a href="#/zasebnost">Več o zasebnosti</a>
          </div>
          <div className="cookie-actions">
            <button className="button secondary" onClick={() => save(false)}>
              Zavrni zunanje vsebine
            </button>
            <button className="button" onClick={() => save(true)}>
              Dovoli videoposnetke
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
