const API_URL = "http://localhost:3000"; // Update as needed

document.addEventListener("DOMContentLoaded", async () => {
  await loadDoctors();
  setupAppointmentSubmission();
  setupLogout();
});

// Function to fetch doctors from the backend
// Function to fetch doctors from the new public route
async function loadDoctors() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/users/doctors`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch doctors");

    const doctors = await response.json();

    const doctorSelect = document.getElementById("doctor-select");
    doctorSelect.innerHTML = "<option value=''>Select a doctor</option>";

    doctors.forEach((doctor) => {
      const option = document.createElement("option");
      option.value = doctor.name;
      option.textContent = doctor.name;
      doctorSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading doctors:", error);
  }
}

// Function to handle appointment creation
function setupAppointmentSubmission() {
  document
    .getElementById("submit-appointment")
    .addEventListener("click", async () => {
      const doctorName = document.getElementById("doctor-select").value;
      const details = document.getElementById("appointment-details").value; // Now appointment details
      const date = document.getElementById("appointment-date").value;
      const time = document.getElementById("appointment-time").value;

      if (!doctorName || !details || !date || !time) {
        alert("Please fill out all fields.");
        return;
      }

      const appointmentDate = new Date(`${date}T${time}:00`);

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/appointments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: "self", // Backend assigns userId from token
            doctorName,
            details, // Now contains appointment details
            appointmentDate,
          }),
        });

        if (!response.ok) throw new Error("Failed to create appointment");

        document.getElementById("message").textContent =
          "Appointment successfully created!";
        setTimeout(() => {
          window.location.href = "patient_appointments.html"; // Redirect after success
        }, 1000);
      } catch (error) {
        console.error("Error creating appointment:", error);
        alert("Failed to create appointment. Please try again.");
      }
    });
}

// Logout function
function setupLogout() {
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}
