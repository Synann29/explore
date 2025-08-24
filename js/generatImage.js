import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

  const API_KEY = "AIzaSyDhg6qZlm5dcmMo7d8W-6KkYpzUjNZeZjU"; // Replace with your API key
  const genAI = new GoogleGenerativeAI(API_KEY);

  const btn = document.getElementById("generateBtn");
  const spinner = document.getElementById("btnSpinner");
  const downloadBtn = document.getElementById("downloadBtn");
  const promptInput = document.getElementById("promptInput");
  const aiText = document.getElementById("aiText");
  const aiImage = document.getElementById("aiImage");
  const resultCard = document.getElementById("resultCard");// multiple upload buttons
  const fileInput = document.getElementById('upload-image');
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileCollectionBtn = document.getElementById("mobile-collection-btn");
  const mobileCollection = document.getElementById("mobile-collection");
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

let currentImageData = "";

// === Dark/Light Mode Toggle ===
// Check saved theme on load
if (localStorage.getItem("theme") === "dark" || 
   (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
} else {
    document.documentElement.classList.remove("dark");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
}

// Toggle theme on click
themeToggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    if (document.documentElement.classList.contains("dark")) {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
        localStorage.setItem("theme", "dark");
    } else {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        localStorage.setItem("theme", "light");
    }
});


// === Upload Flow ===
async function uploadToCloudinary(file) {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', unsignedUploadPreset);

    const res = await fetch(url, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Failed to upload image to Cloudinary');
    return res.json();
}

async function getImaggaTags(imageUrl) {
    const auth = btoa(`${imaggaApiKey}:${imaggaApiSecret}`);
    const apiUrl = `https://api.imagga.com/v2/tags?image_url=${encodeURIComponent(imageUrl)}`;

    const res = await fetch(apiUrl, {
        headers: { Authorization: `Basic ${auth}` }
    });

    if (!res.ok) throw new Error('Failed to get tags from Imagga');

    const data = await res.json();
    return data.result.tags;
}

async function searchUnsplash(query) {
    const url = `https://api.unsplash.com/search/photos?client_id=${access_key}&query=${encodeURIComponent(query)}&per_page=20`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Unsplash API error');
    const data = await res.json();
    return data.results;
}

function displayImages(images) {
    gallery.innerHTML = '';
    images.forEach(img => {
        const imgEl = document.createElement('img');
        imgEl.src = img.urls.small;
        imgEl.alt = img.alt_description || 'Unsplash Image';
        imgEl.className = 'gallery-img rounded-2xl cursor-pointer w-full object-cover mb-6';
        gallery.appendChild(imgEl);
    });
}


  // Mobile menu toggle
mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

mobileCollectionBtn.addEventListener("click", () => {
  mobileCollection.classList.toggle("hidden");
});

  btn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert("Please enter a description before generating.");
      return;
    }


    // Show loading spinner and disable buttons
    spinner.classList.remove("hidden");
    btn.disabled = true;
    downloadBtn.disabled = true;

    aiText.textContent = "";
    aiImage.src = "";
    aiImage.style.display = "none";
    resultCard.style.display = "none";
    currentImageData = "";

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-preview-image-generation",
      });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      });

      const parts = result.response.candidates[0].content.parts;

      for (const part of parts) {
        if (part.text) {
        //   aiText.textContent = part.text;
        }
        if (part.inlineData) {
          currentImageData = part.inlineData.data;
          aiImage.src = `data:image/png;base64,${currentImageData}`;
          aiImage.style.display = "block";
          downloadBtn.disabled = false;
        }
      }
      resultCard.style.display = "block";
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Check console for details.");
    } finally {
      spinner.classList.add("hidden");
      btn.disabled = false;
    }
  });

  // Download functionality
  downloadBtn.addEventListener("click", () => {
    if (!currentImageData) return;

    const link = document.createElement("a");
    link.href = `data:image/png;base64,${currentImageData}`;
    link.download = "generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Allow Enter key to trigger generate
  promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      btn.click();
    }
  });