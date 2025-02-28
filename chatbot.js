 document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');

    // Test connection when page loads
    fetch('/ping')
        .then(res => res.json())
        .then(() => console.log('Server connected'))
        .catch(err => console.error('Server connection test failed:', err));

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        try {
            appendMessage('user', message);
            userInput.value = '';
            appendMessage('bot', 'Thinking...');

            const response = await fetch('http://localhost:3000/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            
            // Remove thinking message
            const thinkingMsg = document.querySelector('.message.bot:last-child');
            if (thinkingMsg?.textContent === 'Thinking...') {
                thinkingMsg.remove();
            }

            if (data.error) {
                throw new Error(data.response);
            }

            appendMessage('bot', data.response);

        } catch (error) {
            console.error('Error:', error);
            const thinkingMsg = document.querySelector('.message.bot:last-child');
            if (thinkingMsg?.textContent === 'Thinking...') {
                thinkingMsg.remove();
            }
            appendMessage('error', 'Error connecting to chatbot. Please try again.');
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
