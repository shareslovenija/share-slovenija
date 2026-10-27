import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { findPage, pages } from "./content/pages";
import { questionCategories } from "./content/questionCategories";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Article from "./components/Article";
import FullArticle from "./components/FullArticle";
import { MasterArticle, findMasterArticle } from "./components/MasterArticles";
import { BookOrder, BookPage, Books, findBook } from "./components/Books";
import Magazine, { MagazineIssue } from "./components/Magazine";
import Home from "./components/Home";
import "./styles.css";
function useRoute() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const change = () => setHash(location.hash);
    addEventListener("hashchange", change);
    return () => removeEventListener("hashchange", change);
  }, []);
  const [slug = "", query = ""] = hash.replace(/^#\/?/, "").split("?");
  return { slug, params: new URLSearchParams(query) };
}
function Contact() {
  return (
    <div className="container simple-page narrow">
      <p className="eyebrow">Povežite se</p>
      <h1>Kontakt</h1>
      <p className="intro">
        Za vprašanja o naših dejavnostih, publikacijah in transmisijski
        meditaciji nam pišite ali nas pokličite.
      </p>
      <address className="contact-card">
        <strong>Share Slovenija</strong>
        <span>Gregorčičeva 9</span>
        <span>4000 Kranj</span>
        <span>
          Telefon: <a href="tel:+38640463489">040 463 489</a>
        </span>
        <span>
          E-pošta:{" "}
          <a href="mailto:info.slo@share-international.net">
            info.slo@share-international.net
          </a>
        </span>
      </address>
      <h2>Mednarodna organizacija</h2>
      <p>
        Share International lahko kontaktirate tudi prek{" "}
        <a href="https://share-international.org/contact/" lang="en" rel="noreferrer">
          kontaktnega obrazca na mednarodni spletni strani
        </a>
        .
      </p>
      <h2>Iščete meditacijsko skupino?</h2>
      <p>
        Podatke o lokalnih skupinah bomo dodali, ko bodo na voljo. Udeležba pri
        transmisijski meditaciji je brezplačna.
      </p>
      <a href="#/transmisijska-meditacija">Več o transmisijski meditaciji →</a>
    </div>
  );
}
function Privacy() {
  return (
    <div className="container simple-page narrow">
      <h1>Zasebnost</h1>
      <p>
        Ta slovenska predstavitev ne uporablja analitike ali oglasnih
        sledilnikov. Iskanje poteka lokalno po vsebini slovenskih
        predstavitvenih strani.
      </p>
      <h2>Naročilo knjig</h2>
      <p>
        Podatke, ki jih vnesete v obrazec za naročilo knjig, prek storitve
        FormSubmit (formsubmit.co) posredujemo po e-pošti na naslov
        info.slo@share-international.net. Uporabimo jih samo za izvedbo
        naročila.
      </p>
      <h2>Zunanje povezave</h2>
      <p>
        Pisave so shranjene skupaj s stranjo. Fotografije se nalagajo neposredno
        z zunanjega strežnika Share International, ki ob tem prejme podatke za
        povezavo, vključno z naslovom IP. Stran ne nalaga zunanjih
        predvajalnikov in ne zahteva privolitve za videoposnetke.
      </p>
      <p>
        Za povezavo do angleške različice uporabite jezikovno izbiro v zgornji
        vrstici. Ob obisku drugega spletnega mesta veljajo njegova pravila
        zasebnosti.
      </p>
    </div>
  );
}
function Search({ params }) {
  const q = params.get("q") || "";
  const normalize = (s) =>
    s
      .toLocaleLowerCase("sl")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  const [masterArticles, setMasterArticles] = useState([]);
  useEffect(() => {
    if (q.trim() && !masterArticles.length)
      import("./content/master-articles-search.json").then((module) =>
        setMasterArticles(module.default),
      );
  }, [q]);
  const results = q.trim()
    ? [
        ...pages.filter((p) =>
          normalize(JSON.stringify(p)).includes(normalize(q.trim())),
        ),
        ...masterArticles
          .filter((article) =>
            normalize(article.title + "\n" + article.text).includes(
              normalize(q.trim()),
            ),
          )
          .map((article) => ({
            slug: "clanki-mojstra/" + article.slug,
            title: article.title,
            intro: `Mojstrova sporočila · Share International, ${article.date}`,
          })),
      ]
    : [];
  return (
    <div className="container simple-page narrow">
      <h1>Iskanje</h1>
      <p role="status">
        {q.trim()
          ? `${results.length} zadetkov za »${q}«`
          : "V zgornje iskalno polje vnesite iskani izraz."}
      </p>
      {results.map((p) => (
        <a className="search-result" key={p.slug} href={"#/" + p.slug}>
          <h2>{p.title}</h2>
          <p>{p.intro}</p>
        </a>
      ))}
      {q.trim() && !results.length && (
        <p>
          Ni zadetkov. Poskusite z drugim izrazom, na primer »meditacija«,
          »Maitreja« ali »modrost«.
        </p>
      )}
    </div>
  );
}
function App() {
  const { slug, params } = useRoute();
  const masterArticle = findMasterArticle(slug);
  const book = findBook(slug);
  const page = findPage(
    slug === "poglobljeno"
      ? "maitreja"
      : slug === "znamenja/nlo"
        ? "znamenja/nlp"
        : slug,
  );
  useEffect(() => {
    document.title =
      (page?.title ||
        masterArticle?.title ||
        book?.title ||
        (slug === "knjige/narocilo" && "Naročilo knjig") ||
        {
          poglobljeno: "Poglobljeno",
          knjige: "Knjige",
          revija: "Revija",
        }[slug] ||
        (slug.startsWith("revija/") && "Revija Share International") ||
        {
          kontakt: "Kontakt",
          iskanje: "Iskanje",
          zasebnost: "Zasebnost",
        }[slug] ||
        "Share International") + " — Slovenija";
    // The former "Viri in publikacije" section is now the book list.
    if (slug === "viri" || slug.startsWith("viri/")) {
      const rest = slug.replace(/^viri\/?(knjige\/?)?/, "");
      location.replace(
        "#/knjige" +
          (slug.startsWith("viri/knjige/") ? "/" + rest : "") +
          (params.toString() ? "?" + params : ""),
      );
      return;
    }
    if (book?.href) {
      location.replace(book.href);
      return;
    }
    const anchor = params.get("ancla");
    const section = params.get("odsek");
    if (anchor && slug === "vprasanja-in-odgovori") {
      const category = questionCategories.find((category) =>
        category.questionIds.includes(anchor),
      );
      if (category) {
        location.replace(
          `#/${category.slug}?ancla=${encodeURIComponent(anchor)}`,
        );
        return;
      }
    }
    if (anchor) {
      document.getElementById(anchor)?.scrollIntoView();
      return;
    }
    if (section !== null) {
      document.getElementById("odsek-" + section)?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
      document.getElementById("vsebina")?.focus({ preventScroll: true });
    }
  }, [slug, params.toString()]);
  return (
    <>
      <Header current={slug} />
      <main id="vsebina" tabIndex="-1">
        {!slug ? (
          <Home />
        ) : page ? (
          page.blocks ? (
            <FullArticle page={page} />
          ) : (
            <Article page={page} />
          )
        ) : masterArticle ? (
          <MasterArticle meta={masterArticle} />
        ) : slug === "revija" ? (
          <Magazine />
        ) : slug.startsWith("revija/") ? (
          <MagazineIssue id={slug.slice("revija/".length)} anchor={params.get("ancla")} />
        ) : slug === "knjige" ? (
          <Books />
        ) : slug === "knjige/narocilo" ? (
          <BookOrder selected={params.get("knjiga")} />
        ) : book ? (
          <BookPage book={book} anchor={params.get("ancla")} />
        ) : slug === "kontakt" ? (
          <Contact />
        ) : slug === "iskanje" ? (
          <Search params={params} />
        ) : slug === "zasebnost" ? (
          <Privacy />
        ) : (
          <div className="container simple-page">
            <h1>Strani ni mogoče najti</h1>
            <a href="#/">Vrnite se na domačo stran →</a>
          </div>
        )}
      </main>
      <Footer />
      <a
        className="back-top"
        href="#vsebina"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
          });
        }}
        aria-label="Na vrh strani"
      >
        ↑
      </a>
    </>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
