import React from "react";
import { resourceCategories } from "../content/resources";

export default function Resources() {
  return (
    <div className="container simple-page">
      <p className="eyebrow">Nadaljnje raziskovanje</p>
      <h1>Viri in publikacije</h1>
      <p className="intro">
        Raziščite naše publikacije, članke, posnetke in dogodke. Vsebine bomo
        dodajali postopoma.
      </p>
      <div className="resource-grid">
        {resourceCategories.map((category) => (
          <a href={`#/viri/${category.slug}`} key={category.slug}>
            <h2>{category.title}</h2>
            <p>{category.description}</p>
            <span>Odpri kategorijo →</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function ResourceCategory({ category }) {
  return (
    <div className="container simple-page narrow">
      <nav className="breadcrumb" aria-label="Pot do strani">
        <a href="#/">Domov</a>
        <span>/</span>
        <a href="#/viri">Viri in publikacije</a>
        <span>/</span>
        <span aria-current="page">{category.title}</span>
      </nav>
      <h1>{category.title}</h1>
      <p className="intro">{category.description}</p>
      <section className="resource-placeholder" aria-label="Vsebina v pripravi">
        <h2>Vsebina je v pripravi</h2>
        <p>{category.placeholder}</p>
        <p>
          Trenutno še ni objavljenih vsebin. Vabljeni, da nas ponovno obiščete.
        </p>
      </section>
      <a className="text-link" href="#/viri">
        ← Nazaj na vire in publikacije
      </a>
    </div>
  );
}
