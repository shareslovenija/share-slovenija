import React from "react";
export default function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <a className="footer-brand" href="#/">
            Share International
          </a>
          <p>
            Medsebojna delitev je temelj pravičnosti.
            <br />
            Pravičnost je temelj miru.
          </p>
        </div>
        <div>
          <strong>Raziščite</strong>
          <a href="#/uvod">Uvod za nove bralce</a>
          <a href="#/maitreja">Maitreja, svetovni učitelj</a>
          <a href="#/transmisijska-meditacija">Transmisijska meditacija</a>
        </div>
        <div>
          <strong>Povežite se</strong>
          <a href="#/o-nas">O organizaciji</a>
          <a href="#/kontakt">Kontakt</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>Slovenska predstavitev vsebin Share International</span>
        <div>
          <a href="#/zasebnost">Zasebnost</a>
        </div>
      </div>
    </footer>
  );
}
