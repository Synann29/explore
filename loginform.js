// === Authentication Logic ===
const authModal = document.getElementById("authModal");
const authForm = document.getElementById("authForm");
const modalTitle = document.getElementById("modalTitle");
const switchToLogin = document.getElementById("switchToLogin");
const switchToRegister = document.getElementById("switchToRegister");
const logoutBtn = document.getElementById("logoutBtn");

let isLoginMode = true;

// Show modal if not logged in
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  if (!username) {
    openModal("login");
  } else {
    logoutBtn.classList.remove("hidden");
  }
});

// Open modal
function openModal(mode) {
  isLoginMode = (mode === "login");
  modalTitle.textContent = isLoginMode ? "Login" : "Register";
  authModal.classList.remove("hidden");
}

// Close modal
function closeModal() {
  authModal.classList.add("hidden");
}

// Handle login/register
authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (isLoginMode) {
    // login
    const savedUser = localStorage.getItem("username");
    const savedPass = localStorage.getItem("password");

    if (username === savedUser && password === savedPass) {
      alert("Login successful!");
      closeModal();
      logoutBtn.classList.remove("hidden");
    } else {
      alert("Invalid username or password");
    }
  } else {
    // register
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    alert("Registration successful! Please login.");
    openModal("login");
  }
});

// Switch between login/register
switchToLogin.addEventListener("click", () => openModal("login"));
switchToRegister.addEventListener("click", () => openModal("register"));

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("username");
  localStorage.removeItem("password");
  alert("Logged out!");
  logoutBtn.classList.add("hidden");
  openModal("login");
});


// === Your existing JS logic below (gallery, search, popup images, etc.) ===
// Keep all your original code here...
