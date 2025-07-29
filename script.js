// Splash screen
setTimeout(() => {
  document.getElementById('splash-screen').style.display = 'none';
}, 2000);

// Constants
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSqeus79UjHIdABYDSnbY6yUuow6rl_4BAf1GDqsOUuoZWUBZlDITJnkQ7NnXhLgeeTJNtsuxcwc8Pj/pub?gid=0&single=true&output=csv&t=" + new Date().getTime();

const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');
const filter = document.getElementById('categoryFilter');
let imageData = [];
let currentIndex = 0;
let itemsPerLoad = 10;
let loaded = 0;

// Modal elements
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.getElementById('close');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shareBtn = document.getElementById('share');

// Offline detect
window.addEventListener("offline", () => {
  document.getElementById("offline-banner").style.display = "block";
});
window.addEventListener("online", () => {
  document.getElementById("offline-banner").style.display = "none";
});

// Fetch CSV
fetch(sheetURL)
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split("\n").slice(1).reverse(); // newest first
    const categories = new Set();

    rows.forEach((row, i) => {
      const [image, category] = row.split(",").map(cell => cell.replace(/"/g, "").trim());
      if (image) {
        imageData.push({ image, category });
        categories.add(category);
      }
    });

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      filter.appendChild(option);
    });

    loadMoreImages();
  });

function loadMoreImages() {
  const selected = filter.value;
  const filtered = selected ? imageData.filter(d => d.category === selected) : imageData;
  const slice = filtered.slice(loaded, loaded + itemsPerLoad);
  slice.forEach((data, i) => addImageTile(data, loaded + i));
  loaded += itemsPerLoad;
  loader.innerHTML = loaded >= filtered.length ? "✅ All loaded" : "⏳ Loading more...";
}

function addImageTile(data, index) {
  const div = document.createElement('div');
  div.className = 'image-tile';
  const img = document.createElement('img');
  img.src = data.image;
  img.alt = `Image ${index + 1}`;
  img.setAttribute('data-index', index);
  img.onclick = () => openModal(index);
  div.appendChild(img);
  gallery.appendChild(div);
}

function openModal(i) {
  currentIndex = i;
  modalImg.src = imageData[i].image;
  modal.style.display = 'block';
}

function closeModal() { modal.style.display = 'none'; }
function showNext() {
  currentIndex = (currentIndex + 1) % imageData.length;
  modalImg.src = imageData[currentIndex].image;
}
function showPrev() {
  currentIndex = (currentIndex - 1 + imageData.length) % imageData.length;
  modalImg.src = imageData[currentIndex].image;
}

closeBtn.onclick = closeModal;
nextBtn.onclick = showNext;
prevBtn.onclick = showPrev;
modal.onclick = e => { if (e.target === modal) closeModal(); };

document.addEventListener('keydown', e => {
  if (modal.style.display === 'block') {
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'Escape') closeModal();
  }
});

// Swipe support
let touchStartX = 0;
modal.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
modal.addEventListener('touchend', e => {
  const touchEndX = e.changedTouches[0].clientX;
  if (touchStartX - touchEndX > 50) showNext();
  if (touchEndX - touchStartX > 50) showPrev();
});

// Infinite scroll
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    loadMoreImages();
  }
});

// Filter
filter.onchange = () => {
  gallery.innerHTML = '';
  loaded = 0;
  loadMoreImages();
};

// Web Share
shareBtn.onclick = () => {
  const url = `${location.href.split("?")[0]}?image=${currentIndex}`;
  if (navigator.share) {
    navigator.share({ title: "NewsGrid by GeoNerd", url });
  } else {
    prompt("Copy and share this link:", url);
  }
};

// Deep link
const params = new URLSearchParams(location.search);
if (params.get("image")) {
  const i = parseInt(params.get("image"));
  setTimeout(() => openModal(i), 2500); // after splash
}
