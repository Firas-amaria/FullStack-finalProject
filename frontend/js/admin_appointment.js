const API_URL = "http://localhost:3000"; // Add /api
document.addEventListener("DOMContentLoaded", async () => {
  await loadPatients();
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
          .map(
            (user) =>
              `<option value="${user._id}">${
                user.name + "-" + user._id
              }</option>`
          )
          .join("")
      : "<option value=''>No patients available</option>";
  } catch (error) {
    console.error("Error loading patients:", error);
  }
}

// Function to handle appointment creation
function setupCreateAppointment() {
  document
    .getElementById("submit-appointment")
    .addEventListener("click", async () => {
      const patientId = document.getElementById("patient-select").value;
      const doctorName = document.getElementById("doctor-name").value;
      const specialty = document.getElementById("specialty").value;
      const date = document.getElementById("appointment-date").value;
      const time = document.getElementById("appointment-time").value;

      if (!patientId || !doctorName || !specialty || !date || !time) {
        alert("Please fill out all fields.");
        return;
      }

      const appointmentDate = new Date(`${date}T${time}:00`);

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/appointments`, {
          // Update API URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: patientId,
            doctorName,
            specialty,
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
