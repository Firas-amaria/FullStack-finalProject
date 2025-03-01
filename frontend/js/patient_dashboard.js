document.addEventListener("DOMContentLoaded", () => {
  loadAppointments();
  setupLogout();
});

// Static data for testing
const mockAppointments = [
  {
    doctorName: "Dr. Smith",
    specialty: "Cardiology",
    date: "2025-03-01 10:00 AM",
  },
  {
    doctorName: "Dr. Brown",
    specialty: "Neurology",
    date: "2025-03-05 2:00 PM",
  },
  {
    doctorName: "Dr. Johnson",
    specialty: "Dermatology",
    date: "2025-03-10 9:30 AM",
  },
  {
    doctorName: "Dr. Wilson",
    specialty: "Pediatrics",
    date: "2025-03-15 1:00 PM",
  },
];

// Function to display only 3 nearest appointments
function loadAppointments() {
  const appointmentsList = document.getElementById("appointments-list");
  appointmentsList.innerHTML = "";

  const upcomingAppointments = mockAppointments.slice(0, 3); // Get only the first 3

  upcomingAppointments.forEach((appointment) => {
    const card = document.createElement("div");
    card.classList.add("appointment-card");

    card.innerHTML = `
            <p><strong>Doctor:</strong> ${appointment.doctorName}</p>
            <p><strong>Specialty:</strong> ${appointment.specialty}</p>
            <p><strong>Date:</strong> ${appointment.date}</p>
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
