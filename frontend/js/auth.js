const API_URL = "http://localhost:3000";

//  Function to register a user
async function registerUser(event) {
  event.preventDefault(); // Prevent page reload

  const name = document.getElementById("username").value; // Change from 'name' to 'username'
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  console.log(name, email, password);

  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }), // Change 'name' to 'username'
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

  console.log(email, password);

  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();

    console.log("login successful", data);

    // ✅ Store user info in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.user.name);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("userID", data.user._id);

    alert(`✅ Welcome, ${data.user.name}!`);

    // Redirect based on role
    if (data.user.role === "admin") {
      window.location.href = "admin_dashboard.html";
    } else if (data.user.role === "doctor") {
      window.location.href = "doctor_dashboard.html";
    } else {
      window.location.href = "patient_dashboard.html"; // Redirect to courses page for regular users
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
