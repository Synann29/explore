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
const favoritedLink = document.getElementById('favorited-image');
const savedLink = document.getElementById('save-gallery');
const usernameInput = document.getElementById('username'); // Renamed to avoid conflict
const gallery = document.getElementById('gallery');
const saved_gallary_div = document.getElementById('saved-gallery');
const uploadBtnDesktop = document.getElementById('uploadBtnDesktop');
const uploadBtnMobile = document.getElementById('uploadBtnMobile');


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


// Mobile menu toggle
mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

mobileCollectionBtn.addEventListener("click", () => {
    mobileCollection.classList.toggle("hidden");
});

// Function to handle tab switching logic
const switchTab = (activeLink, inactiveLink, galleryToShow, galleryToHide) => {
    activeLink.classList.add('active-link');
    inactiveLink.classList.remove('active-link');

    galleryToShow.classList.remove('hidden');
    galleryToHide.classList.add('hidden');
};

// Add event listener to the "favorited" tab
if (favoritedLink) {
    favoritedLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab(favoritedLink, savedLink, gallery, saved_gallary_div);
    });
}

// Add event listener to the "saved" tab
if (savedLink) {
    savedLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab(savedLink, favoritedLink, saved_gallary_div, gallery);
    });
}

// Initial state on page load
// Set "favorited" as the default active tab
document.addEventListener('DOMContentLoaded', () => {
    if (favoritedLink) {
        favoritedLink.classList.add('active-link');
    }
});



// === Event Listeners ===


// Function to update the UI based on login status
function updateAuthUI() {
    isLoggedIn = localStorage.getItem('isLoggedIn')
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
        localStorage.setItem("loggedInUser", loginUsername);
        updateAuthUI();
        alert("Login successful!");
        if (authModal) authModal.classList.remove('is-active');
        displayProfileUsername();
    } else {
        alert("Invalid username or password");
    }
}

// Handles the logout process
function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    updateAuthUI();
    alert("You have been logged out.");
    displayProfileUsername();
}

// New function to display the username on the profile page
function displayProfileUsername() {
    const profileUsernameElement = document.getElementById('profileUsername');
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (profileUsernameElement) {
        profileUsernameElement.textContent = loggedInUser ? loggedInUser : 'Unknown';
    }
}

// Event listeners for the entire page
document.addEventListener('DOMContentLoaded', function() {
    // Initial UI update on page load
    updateAuthUI();
    // Display the username on page load
    displayProfileUsername();

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

    const images = JSON.parse(localStorage.getItem('liked')) || [];
    const sample_image = document.getElementById('sample-image')
    const gallery = document.getElementById('gallery')
    if (favoritedLink) favoritedLink.addEventListener('click', () => {
        if (sample_image) sample_image.classList.add('hidden');
        if (saved_gallary_div) saved_gallary_div.classList.add('hidden');

        gallery.innerHTML = "";

        gallery.className = 'w-full h-full p-6 sm:columns-2 md:columns-3 lg:columns-4 gap-6 gap-y-6';

        images.forEach(item => {
            const card = document.createElement('div');
            card.className = 'relative group mb-6 rounded-2xl overflow-hidden break-inside-avoid';

            const img = document.createElement('img');
            img.src = item.urls.regular;
            img.className = 'gallery-img w-full object-cover rounded-2xl cursor-pointer';
            img.alt = item.alt_description || 'Unsplash Image';

            card.addEventListener('click', e => {
                if (e.target.closest('a') || e.target.closest('i')) return;
                currentImage = allImages.indexOf(item);
                showPopup(item);
            });

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
            download.className = 'bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-full';
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
                <button class="liked-btn"><i class="fa-solid fa-heart text-xl cursor-pointer text-red-600"></i></button>
                <button><i class="fa-regular fa-bookmark text-xl cursor-pointer"></i></button>
            `;

            overlay.appendChild(topOverlay);
            overlay.appendChild(bottomOverlay);

            card.appendChild(img);
            card.appendChild(overlay);

            gallery.appendChild(card);
            const likedBtn = bottomOverlay.querySelector('.liked-btn');
            likedBtn.addEventListener('click', e => {
                e.preventDefault();
                toggleLiked(item);
            });
        });
    });

    const save_image = JSON.parse(localStorage.getItem('save')) || [];
    const saved_gallary = document.getElementById('saved-gallery')
    if (savedLink) savedLink.addEventListener('click', () => {
        if (sample_image) sample_image.classList.add('hidden');
        if (gallery) gallery.classList.add('hidden');

        if (saved_gallary) saved_gallary.innerHTML = "";

        if (saved_gallary) saved_gallary.className = 'w-full h-full p-6 sm:columns-2 md:columns-3 lg:columns-4 gap-8 gap-y-6';

        save_image.forEach(item => {
            const card = document.createElement('div');
            card.className = 'relative group mb-6 rounded-2xl overflow-hidden break-inside-avoid';

            const img = document.createElement('img');
            img.src = item.urls.regular;
            img.className = 'gallery-img w-full object-cover rounded-2xl cursor-pointer';
            img.alt = item.alt_description || 'Unsplash Image';

            card.addEventListener('click', e => {
                if (e.target.closest('a') || e.target.closest('i')) return;
                currentImage = allImages.indexOf(item);
                showPopup(item);
            });

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
                <button class="liked-btn"><i class="fa-regular fa-heart text-xl cursor-pointer "></i></button>
                <button class="saved-btn"><i class="fa-solid fa-bookmark text-xl cursor-pointer text-yellow-600"></i></button>
            `;

            overlay.appendChild(topOverlay);
            overlay.appendChild(bottomOverlay);

            card.appendChild(img);
            card.appendChild(overlay);

            if (saved_gallary) saved_gallary.appendChild(card);
            const likedBtn = bottomOverlay.querySelector('.liked-btn');
            likedBtn.addEventListener('click', e => {
                e.preventDefault();
                toggleLiked(item);
            });
            // 🚨 This is the new event listener
            const savedBtn = bottomOverlay.querySelector('.saved-btn');
            savedBtn.addEventListener('click', e => {
                e.preventDefault();
                toggleSaved(item);
            });
        });
    });
});

function toggleLiked(item) {
    let liked = JSON.parse(localStorage.getItem('liked')) || [];
    const exists = liked.some(l => l.id === item.id);
    if (exists) {
        liked = liked.filter(l => l.id !== item.id);
    } else {
        liked.push(item);
    }
    localStorage.setItem('liked', JSON.stringify(liked));
}

// 🚨 This is the new function to toggle saved images
function toggleSaved(item) {
    let saved = JSON.parse(localStorage.getItem('save')) || []; // Corrected to 'save'
    const exists = saved.some(l => l.id === item.id);
    if (exists) {
        saved = saved.filter(l => l.id !== item.id);
    } else {
        saved.push(item);
    }
    localStorage.setItem('save', JSON.stringify(saved)); // Corrected to 'save'
}
