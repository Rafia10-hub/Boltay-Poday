// ✅ All screens
const screens = {
  auth: document.getElementById("authScreen"),
  home: document.getElementById("homeScreen"),
  template: document.getElementById("templateScreen"),
  dashboard: document.getElementById("dashboardScreen"),
  profile: document.getElementById("profileScreen"),
  chat: document.getElementById("chatScreen"),
  infoScreen: document.getElementById("infoScreen"),
  plantDetailScreen: document.getElementById("plantDetailScreen")
};

// Common elements
const authTitle = document.getElementById("authTitle");
const authBtn = document.getElementById("authBtn");
const toggleAuth = document.getElementById("toggleAuth");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const authMessage = document.getElementById("authMessage");
const passwordHelp = document.getElementById("passwordHelp");
const showPassword = document.getElementById("showPassword");
const templateSelect = document.getElementById("templateSelect");
const templateMessage = document.getElementById("templateMessage");
const authTokenBox = document.getElementById("authTokenBox");
const welcomeMsg = document.getElementById("welcomeMsg");
const sideMenu = document.getElementById("sideMenu");
const profileEmail = document.getElementById("profileEmail");
const profileToken = document.getElementById("profileToken");

let isLogin = true;
let screenHistory = [];

// ✅ Navigation helpers
function showScreen(screenName, addToHistory = true) {
  Object.values(screens).forEach(s => s.classList.add("hidden"));
  if (screens[screenName]) {
    screens[screenName].classList.remove("hidden");
    if (addToHistory) screenHistory.push(screenName);
  }
}

function goBack() {
  if (screenHistory.length > 1) {
    screenHistory.pop();
    const prev = screenHistory[screenHistory.length - 1];
    showScreen(prev, false);
  }
}

// ✅ Side menu
function toggleMenu() {
  sideMenu.classList.toggle("hidden");
}
function goHome() {
  toggleMenu();
  showScreen("home");
}
function viewProfile() {
  toggleMenu();
  const email = localStorage.getItem("loggedInUser");
  const token = localStorage.getItem(`${email}_authToken`);
  profileEmail.innerText = `Email: ${email}`;
  profileToken.innerText = `Auth Token: ${token}`;
  showScreen("profile");
}
function logout() {
  localStorage.removeItem("loggedInUser");
  toggleMenu();
  showScreen("auth");
}

// ✅ Password validation
function isValidPassword(password) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
  return regex.test(password);
}

// Live password help
passwordInput.addEventListener("input", () => {
  const pwd = passwordInput.value;
  if (!pwd) {
    passwordHelp.innerText = "";
  } else if (!isValidPassword(pwd)) {
    passwordHelp.innerText = "⚠️ Password should be at least 6 characters, include letters, numbers & symbols.";
  } else {
    passwordHelp.innerText = "✅ Strong password!";
    passwordHelp.style.color = "green";
  }
});

// Switch login/signup
toggleAuth.addEventListener("click", () => {
  isLogin = !isLogin;
  authTitle.innerText = isLogin ? "Login" : "Sign Up";
  authBtn.innerText = isLogin ? "Login" : "Register";
  toggleAuth.innerText = isLogin ? "Sign up" : "Login";
  confirmPasswordInput.classList.toggle("hidden", isLogin);
  authMessage.innerText = "";
});

// Handle login/signup
authBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();
  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (!email || !password) {
    authMessage.innerText = "Please fill all fields!";
    return;
  }

  if (isLogin) {
    if (users[email] && users[email] === password) {
      localStorage.setItem("loggedInUser", email);
      showScreen("home");
    } else {
      authMessage.innerText = "Invalid email or password!";
    }
  } else {
    if (password !== confirmPassword) {
      authMessage.innerText = "Passwords do not match!";
      return;
    }
    if (!isValidPassword(password)) {
      authMessage.innerText = "Password must be ≥6 chars with letters, numbers & symbols!";
      return;
    }
    if (users[email]) {
      authMessage.innerText = "User already exists!";
    } else {
      users[email] = password;
      localStorage.setItem("users", JSON.stringify(users));
      authMessage.style.color = "green";
      authMessage.innerText = "Signup successful! Please login.";
      isLogin = true;
      authTitle.innerText = "Login";
      authBtn.innerText = "Login";
      toggleAuth.innerText = "Sign up";
      confirmPasswordInput.classList.add("hidden");
    }
  }
});

// Show password
showPassword.addEventListener("change", () => {
  const type = showPassword.checked ? "text" : "password";
  passwordInput.type = type;
  confirmPasswordInput.type = type;
});

// ✅ Template selection
document.getElementById("gotoTemplateBtn").addEventListener("click", () => {
  showScreen("template");
});
document.getElementById("chooseTemplateBtn").addEventListener("click", () => {
  const template = templateSelect.value;
  const email = localStorage.getItem("loggedInUser");
  if (!template) {
    templateMessage.innerText = "⚠️ Please select a template!";
    return;
  }
  let token = localStorage.getItem(`${email}_authToken`);
  if (!token) {
    token = `${email.split("@")[0]}_${template}_${Date.now().toString(36)}`;
    localStorage.setItem(`${email}_authToken`, token);
  }
  showDashboard(email, token, template);
});
function showDashboard(email, token, template) {
  welcomeMsg.innerText = `Welcome to Smart Gardening with Boltay Poday 🌱\n(${email})`;
  authTokenBox.innerText = token;
  document.getElementById("sensorData").innerHTML =
    template === "temp_moisture_humidity"
      ? "<p>🌡 Temperature: -- °C</p><p>💧 Moisture: -- %</p><p>☁ Humidity: -- %</p>"
      : template === "ph_temp_moisture"
      ? "<p>⚗ pH Value: --</p><p>🌡 Temperature: -- °C</p><p>💧 Moisture: -- %</p>"
      : "<p>💧 Moisture: -- %</p><p>⚗ pH Value: --</p>";
  showScreen("dashboard");
}

// ✅ Chat box
document.getElementById("gotoChatBtn").addEventListener("click", () => {
  showScreen("chat");
});
document.getElementById("sendChat").addEventListener("click", () => {
  const chatInput = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatBox");
  const msg = chatInput.value.trim();
  if (!msg) return;
  chatBox.innerHTML += `<div class="chat-message"><span class="chat-user">You:</span> ${msg}</div>`;
  chatInput.value = "";
  setTimeout(() => {
    chatBox.innerHTML += `<div class="chat-message"><span class="chat-bot">Plant Doctor:</span> This seems like a common plant issue. 🌱 Water properly and give sunlight! </div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 800);
});

// ✅ Plants Info navigation
document.getElementById("gotoPlantsBtn").addEventListener("click", () => {
  showScreen("infoScreen");
});

// Plant Data
const plantData = {
  "Peace Lily": {
    img: "https://i.ibb.co/7WBN6Pz/peace-lily.jpg",
    info: "Peace Lily helps purify the air and thrives in low light. Water when soil feels dry."
  },
  "Areca Palm": {
    img: "https://i.ibb.co/8Nk8fnp/areca-palm.jpg",
    info: "Areca Palm is a natural humidifier and needs bright indirect sunlight with regular watering."
  },
  "Snake Plant": {
    img: "https://i.ibb.co/YQ3Kj6d/snake-plant.jpg",
    info: "Snake Plant improves air quality at night. Water sparingly as it stores water in leaves."
  },
  "Aloe Vera": {
    img: "https://i.ibb.co/WgPqCFW/aloevera.jpg",
    info: "Aloe Vera is a medicinal plant that prefers sunlight. Water deeply but infrequently."
  },
  "Spider Plant": {
    img: "https://i.ibb.co/kc3f1v2/spider-plant.jpg",
    info: "Spider Plant is resilient, grows well in indirect sunlight and removes indoor toxins."
  },
  "Money Plant": {
    img: "https://i.ibb.co/ykhTR4N/money-plant.jpg",
    info: "Money Plant is believed to bring good luck. It grows in water or soil with little care."
  }
};

// Show Plant Info
function showPlantInfo(plantName) {
  document.getElementById("plantDetailTitle").innerText = plantName;
  document.getElementById("plantDetailImage").src = plantData[plantName].img;
  document.getElementById("plantDetailText").innerText = plantData[plantName].info;
  showScreen("plantDetailScreen");
}

// ✅ Auto login
window.onload = () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    showScreen("home");
  } else {
    showScreen("auth");
  }
};
