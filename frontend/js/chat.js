document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");

    /**
     * Send message to chatbot API
     */
    window.sendMessage = async () => {
        const message = userInput.value.trim();
        if (message === "") return;

        // Add user message to chat
        addMessage(message, "user-message");

        // Clear input field
        userInput.value = "";

        try {
            const response = await fetch("http://localhost:3000/chat/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Yjc1NzM4NWE0MmNiYWU3ZGZjZDg2MiIsIm5hbWUiOiJKb2huIERvZSIsInJvbGUiOiJwYXRpZW50IiwiaWF0IjoxNzQwODc0MDAwLCJleHAiOjE3NDA4Nzc2MDB9.WSXtxLheUaNLJ46z-Tj67EGEFHwOsdVriqBP9FenJEc"
                },
                body: JSON.stringify({ message })
            });

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