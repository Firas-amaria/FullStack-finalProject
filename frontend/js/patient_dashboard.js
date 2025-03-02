const API_URL = "http://localhost:3000"; // Update if needed

document.addEventListener("DOMContentLoaded", () => {
  loadAppointments();
  setupLogout();
});

// Function to fetch and display 3 nearest appointments
async function loadAppointments() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch appointments");

    const appointments = await response.json();
    console.log("Fetched Appointments:", appointments); // Debugging print

    displayUpcomingAppointments(appointments);
  } catch (error) {
    console.error("Error loading appointments:", error);
    document.getElementById(
      "appointments-list"
    ).innerHTML = `<p>Error loading appointments.</p>`;
  }
}

// Function to display only 3 nearest appointments
function displayUpcomingAppointments(appointments) {
  const appointmentsList = document.getElementById("appointments-list");
  appointmentsList.innerHTML = "";

  // Sort appointments by date and take only the first 3
  const upcomingAppointments = appointments
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 3);

  if (upcomingAppointments.length === 0) {
    appointmentsList.innerHTML = `<p>No upcoming appointments.</p>`;
    return;
  }

  upcomingAppointments.forEach((appointment) => {
    const card = document.createElement("div");
    card.classList.add("appointment-card");

    card.innerHTML = `
            <p><strong>Doctor:</strong> ${appointment.doctorName}</p>
            <p><strong>details:</strong> ${appointment.details}</p>
            <p><strong>Date:</strong> ${new Date(
              appointment.appointmentDate
            ).toLocaleString()}</p>
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
