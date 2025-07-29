const form = document.getElementById('uploadForm');
const status = document.getElementById('status');

// Set your password
const ADMIN_PASSWORD = "geonerd123"; // change this

// Your live Apps Script Web App endpoint
const ENDPOINT = "https://script.google.com/macros/s/AKfycbwb8z78b3rQ47Ud4SAf-BulalSnfs0p5wQAbwFTHHQDjMp10TRVI2BA7z2XKClNY9OisA/exec";

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const image = document.getElementById('image').value.trim();
  const category = document.getElementById('category').value.trim();
  const password = document.getElementById('password').value.trim();

  if (password !== ADMIN_PASSWORD) {
    status.textContent = "❌ Incorrect password";
    status.style.color = "red";
    return;
  }

  status.textContent = "⏳ Uploading...";
  status.style.color = "#333";

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      body: new URLSearchParams({
        Image: image,
        Category: category
      })
    });

    const text = await res.text();
    if (res.ok) {
      status.textContent = "✅ Uploaded successfully!";
      status.style.color = "green";
      form.reset();
    } else {
      throw new Error(text);
    }
  } catch (err) {
    status.textContent = "❌ Upload failed: " + err.message;
    status.style.color = "red";
  }
});
