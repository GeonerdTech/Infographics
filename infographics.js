const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYwb51qsz3iU3Ao_RBT2k-S965ZLSa4dN7jRWLyLTcx9b4CMG35BdmpUEiduwoByFiFwx5ncFzk0ht/pub?output=csv";

let currentSlides = [];
let currentIndex = 0;

fetch(SHEET_URL)
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split("\n").map(row => row.split(","));
    const headers = rows.shift(); // Remove header
    const grid = document.getElementById("infographics-grid");

    let groups = [];
    let currentGroup = { title: "", category: "", images: [] };

    rows.forEach(row => {
      const [title, category, image] = row.map(cell => cell.trim());

      // Blank row = group end
      if (!title && !category && !image) {
        if (currentGroup.images.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = { title: "", category: "", images: [] };
        return;
      }

      // New group starts
      if (title || category) {
        if (currentGroup.images.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = {
          title: title || "Untitled",
          category: category || "Uncategorized",
          images: []
        };
      }

      if (image && image.startsWith("http")) {
        currentGroup.images.push(image);
      }
    });

    if (currentGroup.images.length > 0) {
      groups.push(currentGroup);
    }

    // Render
    groups.forEach(group => {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.innerHTML = `
        <img src="${group.images[0]}" alt="${group.title}">
        <div class="tile-title">${group.title}</div>
      `;

      tile.addEventListener("click", () => openModal(group.images));
      grid.appendChild(tile);
    });
  })
  .catch(err => console.error("Failed to load data:", err));

// --- Modal Functions ---

function openModal(images) {
  currentSlides = images;
  currentIndex = 0;

  // Preload all images
  images.forEach(url => {
    const img = new Image();
    img.src = url;
  });

  updateModalImage();
  document.getElementById("infographicModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("infographicModal").style.display = "none";
}

function nextSlide() {
  if (!currentSlides.length) return;
  currentIndex = (currentIndex + 1) % currentSlides.length;
  updateModalImage();
}

function prevSlide() {
  if (!currentSlides.length) return;
  currentIndex = (currentIndex - 1 + currentSlides.length) % currentSlides.length;
  updateModalImage();
}

function updateModalImage() {
  const img = document.getElementById("modalImage");
  img.style.opacity = 0;

  const temp = new Image();
  temp.onload = () => {
    img.src = currentSlides[currentIndex];
    img.style.opacity = 1;
  };
  temp.src = currentSlides[currentIndex];
}
