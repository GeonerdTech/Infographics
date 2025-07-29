document.getElementById("upload-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const imageUrl = this.imageUrl.value.trim();
  const category = this.category.value.trim();
  const password = this.password.value.trim();

  const correctPassword = "GeoNerdCMS2025"; // ✅ Set your own password

  if (password !== correctPassword) {
    document.getElementById("message").textContent = "❌ Incorrect password.";
    document.getElementById("message").style.color = "red";
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbwb8z78b3rQ47Ud4SAf-BulalSnfs0p5wQAbwFTHHQDjMp10TRVI2BA7z2XKClNY9OisA/exec", {
    method: "POST",
    mode: "no-cors", // Required for Google Apps Script
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageUrl, category }),
  });

  document.getElementById("message").textContent = "✅ Uploaded successfully!";
  document.getElementById("message").style.color = "green";
  this.reset();
});
