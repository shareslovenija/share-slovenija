import React, { useCallback, useEffect, useState } from "react";
import { pages } from "../content/pages";
export default function Header({ current }) {
  const [open, setOpen] = useState(false);
  const closeMenus = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    closeMenus();
  }, [current, closeMenus]);
  return (
    <>
      <a
        className="skip"
        href="#vsebina"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("vsebina")?.focus();
        }}
      >
        Preskoči na vsebino
      </a>
      <div className="utility">
        <div className="container">
          <span>Slovenska spletna stran društva Share International</span>
          <div>
            <a href="#/o-nas">O nas</a>
            <a href="#/kontakt">Kontakt</a>
            <a href="https://share-international.org/" lang="en">
              English ↗
            </a>
            <span className="language">SL</span>
          </div>
        </div>
      </div>
      <header className="container masthead">
        <a
          className="wordmark"
          href="#/"
          aria-label="Share International – domov"
        >
          <img
            className="header-logo"
            src={`${import.meta.env.BASE_URL}assets/branding/share-slovenija.svg`}
            alt="SHARE Slovenija"
            width="240"
            height="89"
          />
          <span>Medsebojna delitev · Pravičnost · Mir</span>
        </a>
        <form
          className="search"
          action="#/iskanje"
          onSubmit={(e) => {
            e.preventDefault();
            location.hash =
              "/iskanje?q=" +
              encodeURIComponent(new FormData(e.currentTarget).get("q"));
            closeMenus();
          }}
        >
          <label className="sr-only" htmlFor="search">
            Iskanje po slovenskih straneh
          </label>
          <input
            id="search"
            name="q"
            type="search"
            placeholder="Poiščite vsebino …"
            required
          />
          <button aria-label="Išči">⌕</button>
        </form>
        <button
          className="menu-button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="navigation"
        >
          {open ? "Zapri ✕" : "Meni ☰"}
        </button>
      </header>
      <nav
        id="navigation"
        aria-label="Glavna navigacija"
        className={"navigation " + (open ? "is-open" : "")}
      >
        <div
          className="container"
          onClick={(e) => {
            if (e.target.closest("a")) closeMenus();
          }}
        >
          <a aria-current={current === "" ? "page" : undefined} href="#/">
            Domov
          </a>
          <a
            aria-current={current === "uvod" ? "page" : undefined}
            href="#/uvod"
          >
            Za nove bralce
          </a>
          <a
            href="#/maitreja"
            aria-current={
              current === "poglobljeno" ||
              pages.some(
                (page) =>
                  page.slug === current &&
                  !["uvod", "o-nas"].includes(page.slug),
              )
                ? "page"
                : undefined
            }
          >
            Poglobljeno
          </a>
          <a
            href="#/knjige"
            aria-current={
              current === "knjige" || current.startsWith("knjige/")
                ? "page"
                : undefined
            }
          >
            Knjige
          </a>
          <a
            href="#/revija"
            aria-current={
              current === "revija" || current.startsWith("revija/") ? "page" : undefined
            }
          >
            Revija
          </a>
          <a
            href="#/o-nas"
            aria-current={current === "o-nas" ? "page" : undefined}
          >
            O Share International
          </a>
          <a
            href="#/kontakt"
            aria-current={current === "kontakt" ? "page" : undefined}
          >
            Kontakt
          </a>
        </div>
      </nav>
    </>
  );
}
