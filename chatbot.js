document.addEventListener('DOMContentLoaded', () => {
  const userInput = document.getElementById('userInput');
  const chatBox = document.getElementById('chatBox');

  async function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
      try {
        appendMessage('user', message);
        userInput.value = '';
        appendMessage('bot', 'Thinking...');

        console.log('Sending message:', message);
        const response = await fetch('http://localhost:3000/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message })
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        
      
        chatBox.removeChild(chatBox.lastChild);

        if (data.error) {
          throw new Error(data.response);
        }

        appendMessage('bot', data.response);

      } catch (error) {
        console.error('Error details:', error);
        
        if (chatBox.lastChild && chatBox.lastChild.textContent === 'Thinking...') {
          chatBox.removeChild(chatBox.lastChild);
        }
        appendMessage('error', `Error: ${error.message}`);
      }
    }
  }

  function appendMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  document.querySelector('.chatbot-input button').addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
});
