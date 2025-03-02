const API_URL = "http://localhost:3000"; // Update as needed

document.addEventListener("DOMContentLoaded", async () => {
  await loadAppointments();
  setupLogout();
});

// Function to load appointments for the doctor
async function loadAppointments() {
  const token = localStorage.getItem("token");
  const doctorName = localStorage.getItem("username"); // Assuming username is stored after login

  try {
    const response = await fetch(`${API_URL}/doctor/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch appointments");

    const appointments = await response.json();
    displayAppointments(appointments, doctorName);
  } catch (error) {
    console.error("Error loading appointments:", error);
    document.getElementById(
      "appointments-list"
    ).innerHTML = `<p>Error loading appointments.</p>`;
  }
}

// Function to display appointments for the doctor
function displayAppointments(appointments, doctorName) {
  const appointmentsList = document.getElementById("appointments-list");
  appointmentsList.innerHTML = "";

  // Filter only the appointments assigned to this doctor
  const doctorAppointments = appointments.filter(
    (app) => app.doctorName === doctorName
  );

  if (doctorAppointments.length === 0) {
    appointmentsList.innerHTML = `<p>No upcoming appointments.</p>`;
    return;
  }

  doctorAppointments.forEach((appointment) => {
    const card = document.createElement("div");
    card.classList.add("appointment-card");

    card.innerHTML = `
            <p><strong>Patient:</strong> ${
              appointment.userId.name || "Unknown"
            }</p>
            <p><strong>details:</strong> ${appointment.details}</p>
            <p><strong>Date:</strong> ${new Date(
              appointment.appointmentDate
            ).toLocaleString()}</p>
            <p><strong>Status:</strong> ${appointment.status}</p>
            <div class="actions">
                <button class="complete-btn" onclick="markAsCompleted('${
                  appointment._id
                }')">Complete</button>
                <button class="cancel-btn" onclick="cancelAppointment('${
                  appointment._id
                }')">Cancel</button>
                <button class="delete-btn" onclick="deleteAppointment('${
                  appointment._id
                }')">Delete</button>
            </div>
        `;

    appointmentsList.appendChild(card);
  });
}

// Function to mark appointment as completed
async function markAsCompleted(appointmentId) {
  if (!confirm("Mark this appointment as completed?")) return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/doctor/appointment/${appointmentId}/complete`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error("Failed to complete appointment");

    alert("Appointment marked as completed.");
    loadAppointments(); // Refresh appointments
  } catch (error) {
    console.error("Error completing appointment:", error);
    alert("Failed to complete appointment.");
  }
}

// Function to cancel an appointment
async function cancelAppointment(appointmentId) {
  if (!confirm("Are you sure you want to cancel this appointment?")) return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/doctor/appointment/${appointmentId}/cancel`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error("Failed to cancel appointment");

    alert("Appointment canceled.");
    loadAppointments(); // Refresh appointments
  } catch (error) {
    console.error("Error canceling appointment:", error);
    alert("Failed to cancel appointment.");
  }
}

/**
 * Delete an appointment (Doctor Only)
 */
async function deleteAppointment(appointmentId) {
  if (
    !confirm(
      "Are you sure you want to delete this appointment? This action cannot be undone."
    )
  )
    return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/doctor/appointment/${appointmentId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error("Failed to delete appointment");

    alert("Appointment deleted successfully.");
    loadAppointments(); // Refresh appointment list
  } catch (error) {
    console.error("Error deleting appointment:", error);
    alert("Failed to delete appointment. Please try again.");
  }
}

// Function to handle logout
function setupLogout() {
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "login.html";
  });
}
