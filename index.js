const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const path = require('path');

// Firebase Admin SDK 초기화
const serviceAccount = path.join(__dirname, '/meer-856f7-ed67da0eef70.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(bodyParser.json());

app.post('/send', (req, res) => {
    const { token, title, body , topic } = req.body;

    const message = {
        notification: {
            title: title,
            body: body
        },
         token: token
    };

    admin.messaging().send(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
            res.status(200).send('Message sent successfully');
        })
        .catch((error) => {
            console.error('Error sending message:', error);
            res.status(500).send('Failed to send message');
        });
});

app.listen(3001, () => {
    console.log('Server is running on port 3000');
});
