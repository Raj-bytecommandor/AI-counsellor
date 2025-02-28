 function toggleChat() {
  const chatWindow = document.getElementById('chatbot-container');// isse ham chatbot name ke html ke element ko select kr rahe hain
  chatWindow.classList.toggle('active');// agar active class laga hua hai to hatayega nahi to addd kregaa chat windo ko open ya close toggle karne ke liye
}

function sendMessage() {
  const input = document.getElementById('userInput');//  user ka input field access krega
  const message = input.value.trim();// extra space hatana aur empty message send hone se rokna

  if (message) {
      addMessage(message, 'user');// agar message empty nahi hai tabhi aage ka code run hoga
      input.value = '';// input box ko clear krega
 
      setTimeout(() => {
          addMessage("I'm analyzing your request. Soon I'll provide personalized career guidance here.", 'bot');
      }, 1000); // 1 second ke baad chatbot ka reply display krega
  }
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
      sendMessage();// agar enter press krega to sendmessage() call hoga// taki user enter daba ke aage bdh jaye
  }
}

function addMessage(text, type) {
  const messages = document.getElementById('chatBox');
  const messageDiv = document.createElement('div');// ye naya div create krega jo message ke dekhne ke liye use hoga
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = text;// ye div ke andar actual text message add krega
  messages.appendChild(messageDiv);//chatbox me naye message ko add karega
  messages.scrollTop = messages.scrollHeight;
}

document.getElementById("userInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
      event.preventDefault();// default ativities prevent krega jaise ki auto submit na ho
      sendMessage();
  }
});
