importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDMJghN1kJp0uxDqDJGw0nlCeLMYvfi16M",
  authDomain: "task2-aee1a.firebaseapp.com",
  projectId: "task2-aee1a",
  storageBucket: "task2-aee1a.firebasestorage.app",
  messagingSenderId: "107165657478",
  appId: "1:107165657478:web:5f4aee4401ffd5e9cc2407",
  measurementId: "G-1GKHEDRPTK"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const notificationTitle = payload.notification?.title || "Background Message";
  const notificationOptions = {
      body: payload.notification?.body || "You have a new message.",
      icon: payload.notification?.image
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

  handleDynamicTopicSubscription(payload.data);
  saveMessageToDatabase(payload);
});

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

