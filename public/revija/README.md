# Revija Share International — številke

Stran »Revija« in razdelek o reviji na domači strani se naložita iz te mape,
zato ju ni treba ponovno graditi.

## Zgradba

- `stevilke.json` — seznam vseh številk, najnovejša na vrhu. Vsaka številka ima
  `id` (ime mape, npr. `2026-09`), `izdaja` (npr. `September 2026`) in po želji
  `poudarki` (seznam člankov za domačo stran) ter `opisNaslovnice`.
- `<leto>-<mesec>/` — mapa posamezne številke:
  - `naslovnica.jpg` — naslovnica (sličica na strani »Revija«),
  - `vsebina.json` — besedilo številke,
  - `slike/` — slike v besedilu.

Številka z oznako `"vDelu": true` je v pripravi: na strani »Revija« je prikazana
kot ploščica »Trenutno v delu« (brez povezave), domača stran pa jo preskoči.
Domača stran prikazuje najnovejšo številko brez te oznake: njeno naslovnico in
`poudarki` ali, če jih ni, naslove člankov. Uvoz številke oznako odstrani.

## Nova številka

1. PDF nove številke shranite v mapo `magazine/`. Ime datoteke naj vsebuje mesec
   in leto, npr. `Share_International_oktober_2026_SL.pdf`.
2. Zaženite `npm run import:revija`. Ustvari mapo številke z naslovnico,
   besedilom in slikami ter jo doda v `stevilke.json`.
3. Po želji v `stevilke.json` dopišite `poudarki` za domačo stran.

Če ima številka samo naslovnico (brez besedila), dovolj je ustvariti mapo z
`naslovnica.jpg` in jo dodati v `stevilke.json`; stran številke tedaj prikaže
naslovnico in poudarke.
