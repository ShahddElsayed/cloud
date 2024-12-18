const express = require('express');
const admin = require("firebase-admin");
const cors = require('cors'); 
const app = express();

app.use(cors());  

app.use(express.json());
admin.initializeApp({
  credential: admin.credential.cert("serviceAccountKey.json"),
});

app.post('/api/subscribe', (req, res) => {
  const { token, topic } = req.body;
  admin.messaging().subscribeToTopic(token, topic)
    .then(response => {
      res.json({ success: true, response });
    })
    .catch(error => {
      res.status(500).json({ success: false, error });
    });
});

app.post('/api/unsubscribe', (req, res) => {
  const { token, topic } = req.body;
  admin.messaging().unsubscribeFromTopic(token, topic)
    .then(response => {
      res.json({ success: true, response });
    })
    .catch(error => {
      res.status(500).json({ success: false, error });
    });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

/*
const sendDataMessage = (deviceToken, topic, action) => {
  const message = {
    token: deviceToken,
    data: {
      [action === "subscribeToTopic" ? "subscribeToTopic" : "unsubscribeToTopic"]: topic,
    },
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log(`Successfully sent ${action} message:`, response);
    })
    .catch((error) => {
      console.log(`Error sending ${action} message:`, error);
    });
};


const deviceToken =
  "chd213UaoiD53jRoU7V1eW:APA91bFy2-whA1ihVfaKJ0Qb11ePD1_NDAUnDbwZlJPaxwVnTyJ-e86vF8WaSljnKAXggiuQEKl5kTgwktxtCRx-AsCRkA6nH71RNnec_XFvmBJ6TnEktQg";
const topic = "sports"; 

sendDataMessage(deviceToken, topic, "subscribeToTopic");

//sendDataMessage(deviceToken, topic, "unsubscribe");
/*

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("serviceAccountKey.json"),
});

const sendDataMessage = (deviceToken, topic, action) => {
  const message = {
    token: deviceToken, 
    data: {
      [action === "subscribeToTopic" ? "subscribeToTopic" : "unsubscribeToTopic"]: topic,
    },
  };

  admin.messaging()
    .send(message)
    .then((response) => {
      console.log(`Successfully sent ${action} message:`, response);
    })
    .catch((error) => {
      console.log(`Error sending ${action} message:`, error);
    });
};

// Example to send subscription data message
const deviceToken = "cmqQog-xtgUjwHqVExTdEz:APA91bH_NvEmPlDh8cFmV5W1s1XQ-zc2E3xi99noqe7PZ4D0aDM2IrxJaVzR0p5KPO0QyBrpi_2VqEz5u5QkNu5ztclac58YzaksgIR9MYUY3-yGXBMp4Co";
const topic = "sports";  // The topic you want to subscribe to
sendDataMessage(deviceToken, topic, "subscribeToTopic");

// Example to send unsubscription data message
// sendDataMessage(deviceToken, topic, "unsubscribeToTopic");*/