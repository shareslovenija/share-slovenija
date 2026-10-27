import React from "react";
export default function Footer() {
  return (
    <footer>
      <div className="container footer-line">
        <span>
          © {new Date().getFullYear()} Share Slovenija ·{" "}
          <a href="mailto:info.slo@share-international.net">
            info.slo@share-international.net
          </a>
        </span>
        <a href="#/zasebnost">
          Ta spletna stran ne uporablja piškotkov in ne sledi obiskovalcem.
        </a>
      </div>
    </footer>
  );
}
