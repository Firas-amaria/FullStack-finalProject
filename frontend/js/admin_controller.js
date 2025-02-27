const API_URL = "http://localhost:3000"; // Update as needed

// Function to fetch and display users
async function loadUsers() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized! Please log in again.");
      window.location.href = "login.html"; // Redirect to login
      return;
    }

    // Fetch users from API
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch users");

    const users = await response.json();

    // Filter out the admin user
    const nonAdminUsers = users.filter((user) => user.role !== "admin");

    // Select the user list container
    const userList = document.getElementById("user-list");
    userList.innerHTML = "";

    // If no users found
    if (nonAdminUsers.length === 0) {
      userList.innerHTML = `<p>No users found.</p>`;
      return;
    }

    // Loop through and create user cards
    nonAdminUsers.forEach((user) => {
      const card = document.createElement("div");
      card.classList.add("card");

      // Determine new role for promote/demote button
      const newRole = user.role === "patient" ? "doctor" : "patient";
      const buttonText =
        user.role === "patient" ? "Promote to Doctor" : "Demote to patient";

      card.innerHTML = `
        <strong>${user.name}</strong> <br>
        <small>${user.email}</small> <br>
        <small>Role: <span id="role-${user._id}">${user.role}</span></small> <br>
        <button class="btn-promote" onclick="updateUserRole('${user._id}', '${newRole}')">${buttonText}</button>
        <button class="btn-delete" onclick="deleteUser('${user._id}', this)">Delete</button>
      `;

      userList.appendChild(card);
    });

    // Show the admin section after users are loaded
    document.getElementById("admin-section").style.display = "block";
  } catch (error) {
    console.error("Error loading users:", error);
    alert("Failed to load users. Please try again later.");
  }
}

// Function to promote or demote a user
async function updateUserRole(userId, newRole) {
  if (
    !confirm(`Are you sure you want to change this user's role to ${newRole}?`)
  )
    return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    });

    if (!response.ok) throw new Error("Failed to update user role");

    // Update role in the UI instantly
    document.getElementById(`role-${userId}`).textContent = newRole;

    // Update the button text dynamically
    const button = document.querySelector(
      `button[onclick="updateUserRole('${userId}', '${newRole}')"]`
    );
    button.textContent =
      newRole === "patient" ? "Promote to Doctor" : "Demote to patient";
    button.setAttribute(
      "onclick",
      `updateUserRole('${userId}', '${
        newRole === "patient" ? "doctor" : "patient"
      }')`
    );

    alert("User role updated successfully");
  } catch (error) {
    console.error("Error updating user role:", error);
    alert("Failed to update user role. Please try again.");
  }
}

// Function to delete a user
async function deleteUser(userId, button) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to delete user");

    // Remove user from UI without reloading the page
    const userCard = button.parentElement;
    userCard.remove();

    alert("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Failed to delete user. Please try again.");
  }
}

// Load users and courses on page load

async function loadAdminName() {
  try {
    // Fix: Use `username` instead of `name`
    document.getElementById("username").innerText =
      localStorage.getItem("username") || "Admin";
  } catch (error) {
    console.error("Error loading admin info:", error);
  }
}

// Logout function
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  window.location.href = "login.html"; // Redirect to homepage
}
function createAppointment() {
  window.location.href = "admin_appointment.html";
}
// Attach logout function to the button
document.getElementById("logout-btn").addEventListener("click", logout);
document
  .getElementById("create-appointment-btn")
  .addEventListener("click", createAppointment);
// Load admin name and users when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadAdminName();
  loadUsers();
});
