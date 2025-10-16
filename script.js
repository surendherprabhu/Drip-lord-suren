// script.js — frontend

const BACKEND_URL = "https://drip-lord-suren-backend.onrender.com";

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatbox = document.getElementById('chatbox');
const newConvoBtn = document.getElementById('new-convo');
const convoList = document.getElementById('convo-list');
const aboutBtn = document.getElementById('about-btn');
const aboutModal = document.getElementById('about-modal');
const aboutClose = document.getElementById('about-close');
const saveAbout = document.getElementById('save-about');
const cancelAbout = document.getElementById('cancel-about');

let conversations = [];
let activeConvoId = null;

function createConvo(title = 'New Conversation'){
  const id = Date.now().toString();
  const convo = { id, title, messages: [] };
  conversations.unshift(convo);
  activeConvoId = id;
  renderConversations();
  loadConversation(id);
}

function renderConversations(){
  convoList.innerHTML = '';
  conversations.forEach(c =>{
    const li = document.createElement('li');
    li.className = 'convo-item';
    li.textContent = c.title;
    li.onclick = ()=>{ activeConvoId = c.id; loadConversation(c.id); };
    convoList.appendChild(li);
  });
}

function loadConversation(id){
  const convo = conversations.find(c=>c.id === id);
  chatbox.innerHTML = '';
  if(!convo) return;
  convo.messages.forEach(m => appendMessageToDOM(m));
  chatbox.scrollTop = chatbox.scrollHeight;
}

function appendMessageToDOM(msg){
  const d = document.createElement('div');
  d.classList.add('message', msg.role === 'user' ? 'user-message' : 'bot-message');
  d.textContent = msg.content;
  chatbox.appendChild(d);
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function sendMessageToServer(message){
  // posts to your backend which uses the OpenAI key stored on the server
  const resp = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ message, conversation_id: activeConvoId })
  });
  if(!resp.ok){
    const err = await resp.text();
    throw new Error(err || 'Server error');
  }
  const data = await resp.json();
  return data.reply;
}

chatForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const text = userInput.value.trim();
  if(!text) return;

  const userMsg = { role:'user', content: text };
  appendMessageToDOM(userMsg);

  // save locally
  const convo = conversations.find(c=>c.id === activeConvoId);
  if(convo){ convo.messages.push(userMsg); }

  userInput.value = '';

  // show a temporary typing bubble
  const typingBubble = document.createElement('div');
  typingBubble.className = 'message bot-message';
  typingBubble.textContent = '...';
  chatbox.appendChild(typingBubble);
  chatbox.scrollTop = chatbox.scrollHeight;

  try{
    const reply = await sendMessageToServer(text);
    // remove typing bubble
    typingBubble.remove();

    const botMsg = { role:'bot', content: reply };
    appendMessageToDOM(botMsg);
    if(convo){ convo.messages.push(botMsg); }
  }catch(err){
    typingBubble.remove();
    const errMsg = { role: 'bot', content: "Sorry, I couldn't understand that. (Server error)" };
    appendMessageToDOM(errMsg);
    if(convo) convo.messages.push(errMsg);
    console.error(err);
  }
});

// UI: new convo
newConvoBtn.addEventListener('click', ()=> createConvo());

// About modal
aboutBtn.addEventListener('click', ()=>{ aboutModal.setAttribute('aria-hidden', 'false'); });
aboutClose.addEventListener('click', ()=>{ aboutModal.setAttribute('aria-hidden', 'true'); });
cancelAbout.addEventListener('click', ()=>{ aboutModal.setAttribute('aria-hidden', 'true'); });

saveAbout.addEventListener('click', ()=>{
  const bio = document.getElementById('bio').value;
  const fileInput = document.getElementById('avatar');
  if(fileInput.files && fileInput.files[0]){
    const reader = new FileReader();
    reader.onload = e => {
      const imgData = e.target.result;
      // small demo: set header mascot
      document.querySelector('.brand-mascot').src = imgData;
    };
    reader.readAsDataURL(fileInput.files[0]);
  }
  // store bio in localStorage for demo
  localStorage.setItem('drip_bio', bio);
  aboutModal.setAttribute('aria-hidden','true');
});

// initial setup
if(!conversations.length) createConvo('General');

// load bio if present
const savedBio = localStorage.getItem('drip_bio');
if(savedBio){ document.getElementById('bio').value = savedBio }
