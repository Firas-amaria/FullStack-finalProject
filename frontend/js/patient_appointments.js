const API_URL = "http://localhost:3000"; // Update if needed

document.addEventListener("DOMContentLoaded", () => {
  loadAllAppointments();
  setupLogout();
});

// Function to fetch and display all appointments
async function loadAllAppointments() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch appointments");

    const appointments = await response.json();
    console.log("Fetched Appointments:", appointments); // Debugging print

    displayAllAppointments(appointments);
  } catch (error) {
    console.error("Error loading appointments:", error);
    document.getElementById(
      "appointments-list"
    ).innerHTML = `<p>Error loading appointments.</p>`;
  }
}

async function cancelAppointment(appointmentId) {
  if (!confirm("Are you sure you want to cancel this appointment?")) return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to cancel appointment");

    alert("Appointment canceled successfully.");
    loadAllAppointments(); // Refresh list after deletion
  } catch (error) {
    console.error("Error canceling appointment:", error);
    alert("Failed to cancel appointment. Please try again.");
  }
}

// Function to display all appointments
// Function to display all appointments with a "Cancel" button
function displayAllAppointments(appointments) {
  const appointmentsList = document.getElementById("appointments-list");
  appointmentsList.innerHTML = "";

  if (appointments.length === 0) {
    appointmentsList.innerHTML = `<p>No appointments found.</p>`;
    return;
  }

  appointments.forEach((appointment) => {
    const card = document.createElement("div");
    card.classList.add("appointment-card");

    card.innerHTML = `
          <p><strong>Doctor:</strong> ${appointment.doctorName}</p>
          <p><strong>details:</strong> ${appointment.details}</p>
          <p><strong>Date:</strong> ${new Date(
            appointment.appointmentDate
          ).toLocaleString()}</p>
          <p><strong>Status:</strong> ${appointment.status}</p>
          <button class="cancel-btn" onclick="cancelAppointment('${
            appointment._id
          }')">Cancel</button>
      `;

    appointmentsList.appendChild(card);
  });
}

// Logout function
function setupLogout() {
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}
