function toggleChat() {
  const chatWindow = document.getElementById('chatbot-container');
  chatWindow.classList.toggle('active');
}

function sendMessage() {
  const input = document.getElementById('userInput');
  const message = input.value.trim();

  if (message) {
      addMessage(message, 'user');
      input.value = '';
 
      setTimeout(() => {
          addMessage("I'm analyzing your request. Soon I'll provide personalized career guidance here.", 'bot');
      }, 1000);
  }
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
      sendMessage();
  }
}

function addMessage(text, type) {
  const messages = document.getElementById('chatBox');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = text;
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}

document.getElementById("userInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
  }
});
