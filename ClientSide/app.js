import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getMessaging,
  onMessage,
  getToken,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDMJghN1kJp0uxDqDJGw0nlCeLMYvfi16M",
  authDomain: "task2-aee1a.firebaseapp.com",
  projectId: "task2-aee1a",
  storageBucket: "task2-aee1a.firebasestorage.app",
  messagingSenderId: "107165657478",
  appId: "1:107165657478:web:5f4aee4401ffd5e9cc2407",
  measurementId: "G-1GKHEDRPTK"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const dbfirebaseConfig = {
  apiKey: "AIzaSyBz0z6s3y8AG92E_Nj7gBoSqhZoTwkjvaU",
  authDomain: "cloud-computing-task-4e32f.firebaseapp.com",
  databaseURL: "https://cloud-computing-task-4e32f-default-rtdb.firebaseio.com",
  projectId: "cloud-computing-task-4e32f",
  storageBucket: "cloud-computing-task-4e32f.firebasestorage.app",
  messagingSenderId: "621439371688",
  appId: "1:621439371688:web:a2685bc39ff62aa7bbb59d",
  measurementId: "G-MZ5K6TNFXS"
};

const Database = initializeApp(dbfirebaseConfig, "1:621439371688:web:a2685bc39ff62aa7bbb59d");
const db = getFirestore(Database);

async function requestPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging);
      console.log("Firebase Token:", token);
      window.currentFCMToken = token;  
    }
  } catch (err) {
    console.error("Permission denied", err);
  }
}

requestPermission();


onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
  handleDynamicTopicSubscription(payload.data);
  saveMessageToDatabase(payload);
});

async function saveMessageToDatabase(payload) {
  try {
    await addDoc(collection(db, "notifications"), {
      timestamp: new Date().toISOString(),
      data: payload.data,
      notification: payload.notification || null,
    });
    console.log("Message saved to database");
  } catch (error) {
    console.error("Error saving message to database:", error);
  }
}

function handleDynamicTopicSubscription(data) {
  if (data.subscribeToTopic) {
    const topic = data.subscribeToTopic;
    console.log(`Sending subscription request to backend for topic: ${topic}`);
    sendToBackend('/api/subscribe', window.currentFCMToken, topic);
  }

  if (data.unsubscribeToTopic) {
    const topic = data.unsubscribeToTopic;
    console.log(`Sending unsubscription request to backend for topic: ${topic}`);
    sendToBackend('/api/unsubscribe', window.currentFCMToken, topic);
  }
  console.log("Current FCM Token:", window.currentFCMToken);

}

function sendToBackend(endpoint, token, topic) {
  const backendURL = "http://localhost:3000";  

  fetch(`${backendURL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: token,
      topic: topic
    })
  })
  .then((response) => response.json())
  .then((data) => console.log("Server response:", data))
  .catch((err) => console.error("Error:", err));
}


if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}


async function fetchNotifications() {
  try {
    const notificationsSnapshot = await getDocs(collection(db, "notifications"));
    const notificationsList = notificationsSnapshot.docs.map(doc => doc.data());

    const tableBody = document.querySelector('#notificationsTable tbody');
    if (!tableBody) {
      console.error("Table body element not found.");
      return;
    }
    tableBody.innerHTML = '';

    notificationsList.forEach(notification => {
      const row = document.createElement('tr');

      const timestampCell = document.createElement('td');
      timestampCell.textContent = notification.timestamp || 'No Timestamp';
      row.appendChild(timestampCell);

      const notificationCell = document.createElement('td');
      notificationCell.textContent = notification.notification ? notification.notification.title : 'No Notification';
      row.appendChild(notificationCell);

      const dataCell = document.createElement('td');
      dataCell.textContent = notification.data ? JSON.stringify(notification.data) : 'No Data';
      row.appendChild(dataCell);

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}

window.onload = fetchNotifications;
