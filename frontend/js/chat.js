document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");

  /**
   * Send message to chatbot API
   */

  window.sendMessage = async () => {
    const message = userInput.value.trim();
    if (message === "") return;

    // הוספת הודעת המשתמש לצ'אט
    addMessage(message, "user-message");

    // ניקוי שדה הקלט
    userInput.value = "";

    // קריאת הטוקן של המשתמש המחובר
    const token = localStorage.getItem("token");

    if (!token) {
      addMessage("❌ אין הרשאה. התחבר מחדש.", "bot-message");

      // המתנה של 3 שניות ואז הפניה לדף ההתחברות
      setTimeout(() => {
        window.location.href = "login.html";
      }, 3000);

      return;
    }

    try {
      const response = await fetch("http://localhost:3000/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("שגיאה בשרת");
      }

      const data = await response.json();
      addMessage(data.botMessage, "bot-message");
    } catch (error) {
      addMessage("❌ שגיאה בהתחברות לשרת", "bot-message");
    }
  };

  /**
   * Add a message to the chatbox
   */

  function addMessage(text, className) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", className);
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to latest message
  }
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  window.location.href = "login.html"; // Redirect to homepage
}

document.getElementById("logout-btn").addEventListener("click", logout);
