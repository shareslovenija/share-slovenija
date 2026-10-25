// Category landing pages are ready for your own publications and media.
export const resourceCategories = [
  {
    slug: "revija",
    title: "Revija in aktualna številka",
    description: "Aktualne teme, pogovori in poročila.",
    placeholder:
      "Tukaj bomo objavili aktualno številko revije in pretekle izdaje.",
  },
  {
    slug: "clanki",
    title: "Arhiv člankov",
    description:
      "Prispevki o medsebojni delitvi, duhovnosti in družbenih spremembah.",
    placeholder: "Tukaj bomo objavili naše članke in druge pisne prispevke.",
  },
  {
    slug: "knjige",
    title: "Knjige",
    description: "Knjige in druge publikacije za poglobljeno branje.",
    placeholder: "Tukaj bomo predstavili knjige in druge publikacije.",
  },
  {
    slug: "videoposnetki",
    title: "Videoposnetki",
    description: "Predavanja, intervjuji in odgovori na vprašanja.",
    placeholder:
      "Tukaj bomo objavili naše videoposnetke, predavanja in intervjuje.",
  },
  {
    slug: "zvocni-posnetki",
    title: "Zvočni posnetki",
    description: "Posnetki predavanj, pogovorov in drugih srečanj.",
    placeholder: "Tukaj bomo objavili naše zvočne posnetke in pogovore.",
  },
  {
    slug: "dogodki",
    title: "Dogodki",
    description: "Predavanja, srečanja in druge prireditve.",
    placeholder: "Tukaj bomo objavili napovedi prihodnjih dogodkov in srečanj.",
  },
];

export const findResourceCategory = (route) =>
  resourceCategories.find((category) => route === `viri/${category.slug}`);
