const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
const path = require('path');




// Path to your firebase account key JSON file
    const keyPath = path.join(__dirname, '/meer-856f7-ed67da0eef70.json');

    const client = new GoogleAuth({
        keyFile: keyPath,
        scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    });

    async function getAccessToken() {
        const authClient = await client.getClient();
        const accessTokenResponse = await authClient.getAccessToken();
        return accessTokenResponse.token;
    }

    async function sendMessage(token) {
        const url = 'https://fcm.googleapis.com/v1/projects/meer-856f7/messages:send';
        const message = {
            message: {

                    "topic": "news",
                    "notification": {
                        "title": "Breaking News",
                        "body": "Detection news story available."
                    },
                    "data": {
                        "story_id": "story_12345"
                    }
            }
        }

        try {
            const response = await axios.post(url, message, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Successfully sent message:', response.data);
        } catch (error) {
            console.error('Error sending message:', error.response ? error.response.data : error.message);
        }
    }

    getAccessToken().then(token => {
        console.log(token)
        sendMessage(token);
    }).catch(error => {
        console.error('Error getting access token:', error);
    });
