// Images are requested directly from their original host. Fonts stay local.
const files = {
  "banner-light": "202005-light-blessing3-1024x739.jpg",
  "banner-cargo": "202006-unloading_cargo-1-1024x683.jpg",
  priorities: "maitreyas_priorities.jpg",
  "banner-church": "201309_light-blessing_moscow-church_2004.jpg",
  "banner-crop": "200311_adams-grave_alton-barnes_wiltshire_20030804.jpg",
  maitreya: "book_cover_world_teacher-1024x722.jpg",
  wisdom: "book_cover_ageless_wisdom_teaching3a-2-1024x722.jpg",
  meditation: "book_cover_transmission2a-1024x722.jpg",
  teachings: "book_cover_laws_of_life1-2-1024x722.jpg",
  magazine: "si-cover-202610.jpg",
  creme: "200907_bc_tokyo1.jpg",
};

export function imageUrl(name) {
  if (!files[name]) throw new Error(`Unknown image: ${name}`);
  return "https://rsrc.share-international.org/images/" + files[name];
}
