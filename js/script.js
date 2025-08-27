// === Config ===
const access_key = "i25ZBDCmKcrOOzF0dhWnV3GlTFeC8F466csveqAgQOc";

const cloudName = 'dpyh3815e'; // replace with your Cloudinary cloud name
const unsignedUploadPreset = 'upload preset'; // replace with your unsigned upload preset

const imaggaApiKey = 'acc_c0d9a94be42753b';
const imaggaApiSecret = 'a6de1e448b1e48647f27fe28e93c8136';

// === DOM Elements ===
const gallery = document.querySelector('.gallery');
const popup = document.getElementById("image-popup");
const largeImage = document.querySelector(".large-img");
const downloadBtn = document.getElementById("download-btn");
const preBtn = document.getElementById("pre-btn");
const nxtBtn = document.getElementById("nxt-btn");
const closeBtn = document.getElementById("close-btn");
const navList = document.getElementById('nav-list');
const searchInput = document.getElementById('search-box');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessages = document.getElementById('errorMessages');
const skeletonLoader = document.getElementById('skeletonLoader');
const uploadBtns = document.querySelectorAll('#uploadBtn'); // multiple upload buttons
const fileInput = document.getElementById('upload-image');
const navLinks = document.querySelectorAll("#nav-list .nav-link");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileCollectionBtn = document.getElementById("mobile-collection-btn");
const mobileCollection = document.getElementById("mobile-collection");
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// === State ===
let currentImage = 0;
let allImages = [];
let currentPage = 1;
let currentSearchQuery = 'random';
let isFetching = false;


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
    const isDark = document.documentElement.classList.toggle("dark");
    if (isDark) {
        themeIcon.classList.replace("fa-sun", "fa-moon");
        localStorage.setItem("theme", "dark");
    } else {
        themeIcon.classList.replace("fa-moon", "fa-sun");
        localStorage.setItem("theme", "light");
    }
});


// === Show/Hide Loading & Errors ===
const showLoading = () => {
    // Hide the gallery and show the skeleton loader
    gallery.classList.add('hidden');
    skeletonLoader.classList.remove('hidden');
    loadingIndicator.classList.add('hidden'); // Ensure the spinner is hidden
    errorMessages.classList.add('hidden');
};

const hideLoading = () => {
    // Hide the skeleton loader when data is ready
    skeletonLoader.classList.add('hidden');
    gallery.classList.remove('hidden');
    loadingIndicator.classList.add('hidden'); // Redundant but good practice
};

const showError = (message) => {
    hideLoading(); // Hide the skeleton loader
    gallery.classList.add('hidden'); // Hide the gallery
    errorMessages.textContent = message;
    errorMessages.classList.remove('hidden');
};

const clearError = () => {
    errorMessages.textContent = '';
    errorMessages.classList.add('hidden');
};

// Filter buttons click handler
function resetCategoryButtons() {
    navLinks.forEach(link => {
        link.classList.remove("underline", "text-gray-600", "font-bold");
        link.classList.add("text-gray-600");
    });
}
// Listen for all clicks on the page
document.addEventListener("click", function (event) {
    // If the clicked element is NOT a category filter button
    if (!event.target.classList.contains("nav-link")) {
        resetCategoryButtons();
    }
});

// Mobile menu toggle
mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

mobileCollectionBtn.addEventListener("click", () => {
    mobileCollection.classList.toggle("hidden");
});

// === Fetch Images from Unsplash ===
async function getImages(query = 'random', page = 1) {
    if (isFetching) return;
    isFetching = true;
    currentSearchQuery = query;

    if (page === 1) showLoading(); // Show skeleton on first load

    try {
        const url = `https://api.unsplash.com/search/photos?client_id=${access_key}&query=${encodeURIComponent(query)}&per_page=20&page=${page}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        const newImages = data.results;

        if (page === 1) allImages = [];

        if (newImages && newImages.length > 0) {
            allImages = allImages.concat(newImages);
            if (page === 1) gallery.innerHTML = ''; // clear on new search
            renderImages(newImages);
        } else {
            showError("No images found.");
        }
    } catch (err) {
        console.error(err);
        showError("Failed to load images.");
    } finally {
        hideLoading(); // Hide skeleton on completion
        isFetching = false;
    }
}

// === Render Images to Gallery ===
function renderImages(images) {
     const authModal = document.getElementById("authModal");
    images.forEach(item => {
        const card = document.createElement('div');
        card.className = 'relative group mb-6 rounded-2xl overflow-hidden break-inside-avoid';

        const img = document.createElement('img');
        img.src = item.urls.regular;
        img.className = 'gallery-img w-full object-cover rounded-2xl cursor-pointer';
        img.alt = item.alt_description || 'Unsplash Image';

        // Open popup on image click (exclude clicks on links or icons)
        card.addEventListener('click', e => {
            if (e.target.closest('a') || e.target.closest('i')) return;
            currentImage = allImages.indexOf(item);
            showPopup(item);
        });

        // Overlay
        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300';
        overlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))';

        const topOverlay = document.createElement('div');
        topOverlay.className = 'flex justify-between items-center';

        const profile = document.createElement('div');
        profile.className = 'flex items-center text-white';

        const avatar = document.createElement('img');
        avatar.src = item.user.profile_image.small;
        avatar.alt = item.user.name;
        avatar.className = 'w-8 h-8 rounded-full mr-2';

        const name = document.createElement('span');
        name.className = 'font-bold text-sm';
        name.textContent = item.user.name;

        profile.appendChild(avatar);
        profile.appendChild(name);

        const download = document.createElement('a');
        download.href = '#';
        download.className = 'bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-full';
        download.innerHTML = `<i class="fa-solid fa-download mr-1"></i>Download`;
        download.addEventListener('click', e => {
            e.preventDefault();
            const websiteName = "explore";
            const filename = `${websiteName}-${item.user.username}-${Date.now()}.jpg`;
            downloadImage(item.urls.full, filename);
        });

        topOverlay.appendChild(profile);
        topOverlay.appendChild(download);

        const bottomOverlay = document.createElement('div');
        bottomOverlay.className = 'flex justify-end text-white space-x-4';
        bottomOverlay.innerHTML = `
            <button class="liked-btn"><i class="fa-regular fa-heart text-xl cursor-pointer"></i></button>
            <button class="save-btn"><i class="fa-regular fa-bookmark text-xl cursor-pointer"></i></button>
        `;

        // Select the button only inside this card
        const likedBtn = bottomOverlay.querySelector('.liked-btn');
        likedBtn.addEventListener('click', e => {
            e.preventDefault();
            if(localStorage.getItem('username') === null){
                authModal.classList.add('is-active');
            }else{
                saveLiked(item);
            }
        });
        const saveBtn = bottomOverlay.querySelector('.save-btn');
        saveBtn.addEventListener('click', e => {
            e.preventDefault();
            if(localStorage.getItem('username') === null){
                authModal.classList.add('is-active');
            }else{
                saveButton(item);
            }
        });

        overlay.appendChild(topOverlay);
        overlay.appendChild(bottomOverlay);

        card.appendChild(img);
        card.appendChild(overlay);
        gallery.appendChild(card);
    });
}

function saveLiked(item) {
    let liked = JSON.parse(localStorage.getItem('liked')) || [];
    // Check if already liked (avoid duplicates)
    const exists = liked.some(l => l.id === item.id);
    if (!exists) {
        liked.push(item);
        localStorage.setItem('liked', JSON.stringify(liked));
    }
}
function saveButton(item) {
    let save = JSON.parse(localStorage.getItem('save')) || [];
    // Check if already liked (avoid duplicates)
    const exists = save.some(l => l.id === item.id);
    if (!exists) {
        save.push(item);
        localStorage.setItem('save', JSON.stringify(save));
    }
}

// === Popup Logic ===
function showPopup(item) {
    if (!item) return;
    largeImage.src = item.urls.regular;
    downloadBtn.dataset.url = item.urls.full;
    downloadBtn.dataset.username = item.user.username;
    popup.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    setTimeout(() => popup.classList.add('opacity-100'), 10);
    document.body.classList.add('no-scroll');
}

function hidePopup() {
    popup.classList.remove('opacity-100');
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => popup.classList.add('hidden'), 300);
    document.body.classList.remove('no-scroll');
}

// === Universal Download Function ===
async function downloadImage(url, defaultFilename = 'image.jpg') {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const imageURL = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = defaultFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(imageURL); 
        
    } catch (error) {
        console.error('Download failed:', error);
    }
}

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



// === Event Listeners ===



// Popup controls
closeBtn.addEventListener('click', hidePopup);
preBtn.addEventListener('click', () => {
    if (currentImage > 0) {
        currentImage--;
        showPopup(allImages[currentImage]);
    }
});

nxtBtn.addEventListener('click', () => {
    if (currentImage < allImages.length - 1) {
        currentImage++;
        showPopup(allImages[currentImage]);
    }
});

document.addEventListener('keydown', e => {
    if (e.key === "Escape" && !popup.classList.contains('hidden')) {
        hidePopup();
    }
});

downloadBtn.addEventListener('click', async e => {
    e.preventDefault();
    const url = downloadBtn.dataset.url;
    const username = downloadBtn.dataset.username || "unsplash";
    const websiteName = "explore";
    const filename = `${websiteName}-${username}-${Date.now()}.jpg`;

    await downloadImage(url, filename);
});

// Nav category clicks
navList.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
        e.preventDefault();
        const category = e.target.getAttribute('data-category');
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('font-bold', 'text-black', 'underline', 'underline-offset-4');
        });
        e.target.classList.add('font-bold', 'text-black', 'underline', 'underline-offset-4');
        currentPage = 1;
        getImages(category);
    }
});

// Search input Enter key triggers search
searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const term = searchInput.value.trim();
        if (term) {
            currentPage = 1;
            getImages(term);
        }
    }
});


// Upload buttons trigger file input
uploadBtns.forEach(btn => btn.addEventListener('click', () => fileInput.click()));

// Upload file input change event
fileInput.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;

    clearError();
    showLoading();
    gallery.innerHTML = '';

    try {
        // 1. Upload to Cloudinary
        const uploaded = await uploadToCloudinary(file);

        // 2. Get tags from Imagga
        const tags = await getImaggaTags(uploaded.secure_url);
        if (!tags || tags.length === 0) throw new Error('No tags found for this image');

        // Use top tag for search
        const topTag = tags[0].tag.en;

        // 3. Search Unsplash
        const unsplashResults = await searchUnsplash(topTag);
        if (!unsplashResults || unsplashResults.length === 0) throw new Error('No similar images found on Unsplash');

        // 4. Display results
        displayImages(unsplashResults);
        allImages = unsplashResults;
        currentSearchQuery = topTag;
        currentPage = 1;
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
        fileInput.value = '';
    }
});


// Infinite scroll loading more images
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        // Load more images when the user scrolls near the bottom of the page
        if (scrollTop + clientHeight >= scrollHeight - 100 && !isFetching) {
            currentPage++;
            getImages(currentSearchQuery, currentPage);
        }
    }, 100);
});


// Function to update the UI based on login status
function updateAuthUI() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const loginBtn = document.getElementById("loginBtn");
    const loginBtnMobile = document.getElementById("loginBtn-mobile");
    const profileBtn = document.getElementById("profileBtn");
    const profileBtnMobile = document.getElementById("profileBtn-mobile");
    const uploadBtnDesktop = document.getElementById("uploadBtnDesktop");
    const uploadBtnMobile = document.getElementById("uploadBtnMobile");

    if (isLoggedIn) {
        if (loginBtn) loginBtn.classList.add("hidden");
        if (loginBtnMobile) loginBtnMobile.classList.add("hidden");
        if (profileBtn) profileBtn.classList.remove("hidden");
        if (profileBtnMobile) profileBtnMobile.classList.remove("hidden");
        if (uploadBtnDesktop) uploadBtnDesktop.classList.remove("hidden");
        if (uploadBtnMobile) uploadBtnMobile.classList.remove("hidden");
    } else {
        if (loginBtn) loginBtn.classList.remove("hidden");
        if (loginBtnMobile) loginBtnMobile.classList.remove("hidden");
        if (profileBtn) profileBtn.classList.add("hidden");
        if (profileBtnMobile) profileBtnMobile.classList.add("hidden");
        if (uploadBtnDesktop) uploadBtnDesktop.classList.add("hidden");
        if (uploadBtnMobile) uploadBtnMobile.classList.add("hidden");
    }
}

// Handles the registration form submission
function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const authContainer = document.getElementById("auth-container");

    if (!username || !password) {
        alert("Please fill out all fields.");
        return;
    }

    if (localStorage.getItem("username") === username) {
        alert("This username is already taken. Please choose another.");
        return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    alert("Registration successful! Please log in.");
    if (authContainer) authContainer.classList.remove('right-panel-active');
}

// Handles the login form submission
function handleLogin(event) {
    event.preventDefault();
    const loginUsername = document.querySelector("#LoginForm input[type='text']").value;
    const loginPassword = document.querySelector("#LoginForm input[type='password']").value;
    const authModal = document.getElementById("authModal");

    const usernameLogin = localStorage.getItem("username");
    const passwordLogin = localStorage.getItem("password");

    if (loginUsername === usernameLogin && loginPassword === passwordLogin) {
        localStorage.setItem("isLoggedIn", "true");
        updateAuthUI();
        alert("Login successful!");
        if (authModal) authModal.classList.remove('is-active');
    } else {
        alert("Invalid username or password");
    }
}

// Handles the logout process
function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    updateAuthUI();
    alert("You have been logged out.");
}

// Event listeners for the entire page
document.addEventListener('DOMContentLoaded', function() {
    // Initial UI update on page load
    updateAuthUI();
    
    // Get all necessary elements
    const profileBtn = document.getElementById("profileBtn");
    const profileBtnMobile = document.getElementById("profileBtn-mobile");
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
    const themeIconMobile = document.getElementById('theme-icon-mobile');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileCollectionBtn = document.getElementById('mobile-collection-btn');
    const mobileCollection = document.getElementById('mobile-collection');
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnMobile = document.getElementById('loginBtn-mobile');
    const authModal = document.getElementById('authModal');
    const closeModalBtn = document.getElementById('closeModal');
    const authContainer = document.getElementById('auth-container');
    const signInBtn = document.getElementById('signInBtn');
    const signUpBtn = document.getElementById('signUpBtn');

    // Theme toggle logic
    const toggleTheme = () => {
        document.body.classList.toggle('bg-gray-800');
        document.body.classList.toggle('text-white');
        document.querySelector('nav').classList.toggle('bg-white');
        document.querySelector('nav').classList.toggle('bg-gray-700');
        document.querySelectorAll('a, button, span').forEach(el => {
            if (el.id !== 'theme-toggle' && el.id !== 'theme-toggle-mobile') {
                el.classList.toggle('text-gray-800');
                el.classList.toggle('text-white');
            }
        });
        if (themeIcon) themeIcon.classList.toggle('fa-sun');
        if (themeIcon) themeIcon.classList.toggle('fa-moon');
        if (themeIconMobile) themeIconMobile.classList.toggle('fa-sun');
        if (themeIconMobile) themeIconMobile.classList.toggle('fa-moon');
    };

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);

    // Mobile menu logic
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', () => {
        if (mobileMenu) mobileMenu.classList.toggle('hidden');
    });
    if (mobileCollectionBtn) mobileCollectionBtn.addEventListener('click', () => {
        if (mobileCollection) mobileCollection.classList.toggle('hidden');
    });

    // Modal & Form Toggle Logic
    const openModal = () => {
        if (authModal) authModal.classList.add('is-active');
    };

    const closeModal = () => {
        if (authModal) authModal.classList.remove('is-active');
    };

    if (loginBtn) loginBtn.addEventListener('click', openModal);
    if (loginBtnMobile) loginBtnMobile.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside of the auth container
    if (authModal) {
        authModal.addEventListener('click', (event) => {
            if (event.target === authModal) {
                closeModal();
            }
        });
    }

    // Event listeners for the form animation
    if (signUpBtn) signUpBtn.addEventListener('click', () => {
        if (authContainer) authContainer.classList.add('right-panel-active');
    });
    if (signInBtn) signInBtn.addEventListener('click', () => {
        if (authContainer) authContainer.classList.remove('right-panel-active');
    });

    // New event listeners for the profile buttons to handle logout
    if (profileBtn) profileBtn.addEventListener('click', handleLogout);
    if (profileBtnMobile) profileBtnMobile.addEventListener('click', handleLogout);
});




// Initial fetch
getImages("random");