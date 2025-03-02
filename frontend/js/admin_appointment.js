const API_URL = "http://localhost:3000"; // Add /api
document.addEventListener("DOMContentLoaded", async () => {
  await loadPatients();
  await loadDoctors();
  setupCreateAppointment();
});

// Function to fetch and populate patients in dropdown
async function loadPatients() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch patients");

    const users = await response.json();
    const patients = users.filter((user) => user.role === "patient");

    const patientSelect = document.getElementById("patient-select");
    patientSelect.innerHTML = patients.length
      ? patients
          .map((user) => `<option value="${user._id}">${user.name}</option>`)
          .join("")
      : "<option value=''>No patients available</option>";
  } catch (error) {
    console.error("Error loading patients:", error);
  }
}

async function loadDoctors() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch doctors");

    const users = await response.json();
    const doctors = users.filter((user) => user.role === "doctor");

    const doctorSelect = document.getElementById("doctor-select");
    doctorSelect.innerHTML = doctors.length
      ? doctors
          .map((user) => `<option value="${user.name}">${user.name}</option>`)
          .join("")
      : "<option value=''>No doctors available</option>";
  } catch (error) {
    console.error("Error loading doctors:", error);
  }
}

// Function to handle appointment creation
function setupCreateAppointment() {
  document
    .getElementById("submit-appointment")
    .addEventListener("click", async () => {
      const userId = document.getElementById("patient-select").value;
      const doctorName = document.getElementById("doctor-select").value;
      const details = document.getElementById("details").value;
      const date = document.getElementById("appointment-date").value;
      const time = document.getElementById("appointment-time").value;

      if (!userId || !doctorName || !details || !date || !time) {
        alert("Please fill out all fields.");
        return;
      }

      const appointmentDate = new Date(`${date}T${time}:00`);
      console.log("Final Appointment Data:", {
        userId,
        doctorName,
        details,
        appointmentDate,
      }); // DEBUG PRINT

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/appointments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId, // Using name instead of ID
            doctorName, // Using doctor's name instead of ID
            details,
            appointmentDate,
          }),
        });

        if (!response.ok) throw new Error("Failed to create appointment");

        document.getElementById("message").textContent =
          "Appointment successfully created!";
      } catch (error) {
        console.error("Error creating appointment:", error);
        alert("Failed to create appointment. Please try again.");
      }
    });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  window.location.href = "login.html"; // Redirect to homepage
}
document.getElementById("dashboard-link").addEventListener("click", () => {
  window.location.href = "admin_dashboard.html";
});

document.getElementById("logout-btn").addEventListener("click", logout);
