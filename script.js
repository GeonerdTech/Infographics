const form = document.getElementById('upload-form');
const status = document.getElementById('status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const imageUrl = document.getElementById('imageUrl').value.trim();
  const category = document.getElementById('category').value.trim();

  if (!imageUrl || !category) {
    status.textContent = "Both fields are required.";
    return;
  }

  status.textContent = "Uploading...";

  try {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbwb8z78b3rQ47Ud4SAf-BulalSnfs0p5wQAbwFTHHQDjMp10TRVI2BA7z2XKClNY9OisA/exec',
      {
        method: 'POST',
        mode: 'no-cors', // needed for Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl, category }),
      }
    );

    status.textContent = "✅ Uploaded successfully!";
    form.reset();
  } catch (error) {
    console.error(error);
    status.textContent = "❌ Upload failed. Try again.";
  }
});
