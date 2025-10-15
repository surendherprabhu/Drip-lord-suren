const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatbox = document.getElementById('chatbox');

// Your OpenAI API key
const API_KEY = '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';

async function getBotResponse(message) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        max_tokens: 500
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";
  } catch (error) {
    console.error('Error fetching bot response:', error);
    return "Oops! Something went wrong.";
  }
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  // Display user message
  const userMsg = document.createElement('div');
  userMsg.classList.add('message', 'user-message');
  userMsg.textContent = message;
  chatbox.appendChild(userMsg);
  chatbox.scrollTop = chatbox.scrollHeight;

  userInput.value = '';

  // Get bot response
  const botReply = await getBotResponse(message);
  const botMsg = document.createElement('div');
  botMsg.classList.add('message', 'bot-message');
  botMsg.textContent = botReply;
  chatbox.appendChild(botMsg);
  chatbox.scrollTop = chatbox.scrollHeight;
});
