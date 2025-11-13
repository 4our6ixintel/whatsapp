// Firebase config
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBG-fuJTC4H7b-IAfjA8fn5kJqoUTCheM8",
    authDomain: "whatsapp-clone-720f5.firebaseapp.com",
    projectId: "whatsapp-clone-720f5",
    storageBucket: "whatsapp-clone-720f5.firebasestorage.app",
    messagingSenderId: "768409862460",
    appId: "1:768409862460:web:7195eba3642325df059e39"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM elements
const nameInput = document.getElementById('nameInput');
const roomInput = document.getElementById('roomInput');
const joinBtn = document.getElementById('joinBtn');
const usersList = document.getElementById('usersList');
const chatWindow = document.getElementById('chatWindow');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

let roomId, userName;

// Join room
joinBtn.onclick = async () => {
  roomId = roomInput.value.trim() || 'defaultroom';
  userName = nameInput.value.trim() || 'Anon';

  // Add user to Firestore users collection
  const userRef = db.collection('rooms').doc(roomId).collection('users').doc(userName);
  await userRef.set({ online: true, joinedAt: firebase.firestore.FieldValue.serverTimestamp() });

  // Remove user on disconnect (simulate presence)
  window.addEventListener('beforeunload', async () => {
    await userRef.delete();
  });

  listenUsers();
  listenMessages();
};

// Listen to users
function listenUsers() {
  db.collection('rooms').doc(roomId).collection('users')
    .onSnapshot(snapshot => {
      usersList.innerHTML = '';
      snapshot.forEach(doc => {
        const li = document.createElement('li');
        li.textContent = doc.id + (doc.id === userName ? ' (You)' : '');
        usersList.appendChild(li);
      });
    });
}

// Listen to chat messages
function listenMessages() {
  db.collection('rooms').doc(roomId).collection('messages')
    .orderBy('timestamp')
    .onSnapshot(snapshot => {
      chatWindow.innerHTML = '';
      snapshot.forEach(doc => {
        const m = doc.data();
        const el = document.createElement('div');
        el.innerHTML = `<strong>${m.sender}</strong>: ${m.text}`;
        chatWindow.appendChild(el);
      });
      chatWindow.scrollTop = chatWindow.scrollHeight;
    });
}

// Send message
sendBtn.onclick = () => {
  const text = chatInput.value.trim();
  if (!text) return;
  db.collection('rooms').doc(roomId).collection('messages').add({
    sender: userName,
    text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  chatInput.value = '';
};
