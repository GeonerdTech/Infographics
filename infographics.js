const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYwb51qsz3iU3Ao_RBT2k-S965ZLSa4dN7jRWLyLTcx9b4CMG35BdmpUEiduwoByFiFwx5ncFzk0ht/pub?output=csv";

let currentSlides = [];
let currentIndex = 0;

console.log("JS Loaded");

fetch(SHEET_URL)
  .then(res => res.text())
  .then(csv => {
    console.log("CSV Fetched");
    const rows = csv.trim().split("\n").map(row => row.split(","));
    const headers = rows.shift(); // remove first row (titles)
    const grid = document.getElementById("infographics-grid");

    rows.forEach((cols, i) => {
      const title = cols[0]?.trim();
      const images = cols.slice(2).filter(url => url && url.startsWith("http"));

      if (images.length === 0) return;

      const tile = document.createElement("div");
      tile.className = "tile";
      tile.innerHTML = `
        <img src="${images[0]}" alt="${title}">
        <div class="tile-title">${title}</div>
      `;

      tile.addEventListener("click", () => openModal(images));
      grid.appendChild(tile);
    });
  })
  .catch(err => {
    console.error("Failed to load CSV:", err);
  });

function openModal(images) {
  currentSlides = images;
  currentIndex = 0;
  document.getElementById("modalImage").src = images[0];
  document.getElementById("infographicModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("infographicModal").style.display = "none";
}

function nextSlide() {
  if (!currentSlides.length) return;
  currentIndex = (currentIndex + 1) % currentSlides.length;
  document.getElementById("modalImage").src = currentSlides[currentIndex];
}

function prevSlide() {
  if (!currentSlides.length) return;
  currentIndex = (currentIndex - 1 + currentSlides.length) % currentSlides.length;
  document.getElementById("modalImage").src = currentSlides[currentIndex];
}
