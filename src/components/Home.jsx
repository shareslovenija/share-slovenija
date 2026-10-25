import { imageUrl } from "../content/images";
import React from "react";
import { pages } from "../content/pages";
const highlights = [
  "Amerika brez smeri",
  "Slepi vodijo videče",
  "Poziv Ameriki",
  "Poročilo o svetovni pravičnosti 2026",
  "Kako se začnejo državljanske vojne",
  "Britanski policisti spregovorijo o opažanjih nepojasnjenih zračnih pojavov",
  "Fašizem konca časov in boj za živi svet — recenzija",
  "Sreča: spoznanja nove znanosti — recenzija",
];
export default function Home() {
  return (
    <>
      <div
        className="image-montage"
        aria-label="Fotografije duhovnih znamenj in humanitarnega delovanja"
      >
        {[
          "banner-light",
          "banner-cargo",
          "priorities",
          "banner-church",
          "banner-crop",
        ].map((image, i) => (
          <img
            referrerPolicy="no-referrer"
            key={image}
            src={imageUrl(image)}
            alt={
              [
                "Svetlobni pojav",
                "Raztovarjanje pomoči",
                "Osnovne človeške potrebe",
                "Svetloba na cerkvi",
                "Žitni krog",
              ][i]
            }
          />
        ))}
      </div>
      <section className="home-lead container">
        <p className="eyebrow">Sporočilo upanja za prihodnost</p>
        <h1>Prihod Maitreje, svetovnega učitelja</h1>
        <div className="lead-copy">
          <p>
            Mnogi danes pričakujejo vrnitev svojega učitelja, naj ga imenujejo
            Kristus, Mesija, peti Buda, Krišna ali imam Mahdi. Milijoni že vedo,
            da <a href="#/maitreja">Maitreja, svetovni učitelj</a>, ki
            izpolnjuje ta pričakovanja, že živi med nami in se postopoma
            razkriva javnosti.
          </p>
          <p>
            Maitreja želi biti znan preprosto kot Učitelj. Ne prihaja kot verski
            voditelj ali ustanovitelj nove religije, temveč kot vzgojitelj v
            najširšem pomenu besede: učitelj in vodnik za vse ljudi ne glede na
            njihovo poreklo ali prepričanje. Skupaj z{" "}
            <a href="#/mojstri-modrosti">mojstri modrosti</a> nam želi pokazati,
            kako rešiti naše najtežje svetovne probleme.
          </p>
          <p>
            V času velike politične, gospodarske in družbene krize bo Maitreja
            navdihoval človeštvo, da se prepozna kot ena družina in ustvari
            civilizacijo, ki temelji na medsebojni delitvi, gospodarski in
            družbeni pravičnosti ter svetovnem sodelovanju.
          </p>
        </div>
        <a className="button" href="#/uvod">
          Uvod za nove bralce <span>→</span>
        </a>
      </section>
      <section className="soft-section">
        <div className="container magazine-feature">
          <div className="magazine">
            <p className="eyebrow">Revija Share International</p>
            <h2>
              Politično in duhovno.
              <br />
              Skupen pogled na svet.
            </h2>
            <div className="magazine-content">
              <img
                referrerPolicy="no-referrer"
                src={imageUrl("magazine")}
                alt="Naslovnica revije Share International, oktober 2026"
                loading="lazy"
              />
              <div>
                <span className="issue-label">Oktober 2026</span>
                <ul>
                  {highlights.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <a className="text-link" href="#/viri/revija">
                  Revija in izdaje →
                </a>
              </div>
            </div>
            <p>
              Revija povezuje politične, družbene, gospodarske in duhovne
              spremembe ter spodbuja praktično delovanje za pravičnejši in
              sočutnejši svet.
            </p>
          </div>
        </div>
      </section>
      <section className="container topics">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Poglobite razumevanje</p>
            <h2>Ideje za drugačno prihodnost</h2>
          </div>
          <a href="#/viri">Vsi viri →</a>
        </div>
        <div className="topic-grid">
          {pages
            .filter((p) =>
              [
                "maitreja",
                "prednostne-naloge",
                "nauki",
                "vecna-modrost",
                "transmisijska-meditacija",
                "o-nas",
              ].includes(p.slug),
            )
            .map((p) => (
              <a className="topic-card" href={"#/" + p.slug} key={p.slug}>
                <img
                  referrerPolicy="no-referrer"
                  src={imageUrl(p.image)}
                  alt=""
                  loading="lazy"
                />
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.intro}</p>
                  <span>Preberite več →</span>
                </div>
              </a>
            ))}
        </div>
      </section>
      <section className="quote-section">
        <div className="container">
          <p>
            »Brez medsebojne delitve ni pravičnosti.
            <br />
            Brez pravičnosti ni miru.«
          </p>
          <span>
            Maitreja ·{" "}
            <a href="#/prednostne-naloge">Prednostne naloge za svet</a>
          </span>
        </div>
      </section>
    </>
  );
}
