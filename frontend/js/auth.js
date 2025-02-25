const API_URL = "http://localhost:3000";

// ✅ Function to register a user
async function registerUser(event) {
  event.preventDefault(); // Prevent page reload

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (response.ok) {
    alert("✅ Registration successful! You can now log in.");
    window.location.href = "login.html";
  } else {
    const errorData = await response.json();
    document.getElementById("register-error").innerText = errorData.error;
    document.getElementById("register-error").style.display = "block";
  }
}

// ✅ Function to log in a user
async function loginUser(event) {
  event.preventDefault(); // Prevent page reload

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();

    // ✅ Store user info in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.user.username);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("userID", data.user.userid);

    alert(`✅ Welcome, ${data.user.username}!`);

    // Redirect based on role
    if (data.user.role === "admin") {
      window.location.href = "dashboard-admin.html";
    } else if (data.user.role === "instructor") {
      window.location.href = "dashboard-instructor.html"; // Redirect to instructor dashboard
    } else {
      window.location.href = "student-dashboard.html"; // Redirect to courses page for regular users
    }
  } else {
    const errorData = await response.json();
    document.getElementById("login-error").innerText = errorData.error;
    document.getElementById("login-error").style.display = "block";
  }
}

// ✅ Function to check if user is logged in
function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html"; // Redirect to login if not logged in
  }
}

// ✅ Function to log out
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  window.location.href = "index.html"; // Redirect to homepage
}

// ✅ Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("register-form")) {
    document
      .getElementById("register-form")
      .addEventListener("submit", registerUser);
  }

  if (document.getElementById("login-form")) {
    document.getElementById("login-form").addEventListener("submit", loginUser);
  }
});
