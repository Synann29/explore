

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



// === Event Listeners ===



// Function to update the UI based on login status
function updateAuthUI() {

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

