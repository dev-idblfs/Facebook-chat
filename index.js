'user strick'

const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());

app.listen(process.env.PORT || 1337, () => console.log("server is running...@ " + process.env.PORT));

// Adds support for GET requests to our webhook
app.get('/', (req, res) => {
    console.log('working');
    res.sendStatus(200);
});

let VERIFY_TOKEN = "EAAI87J7KpbYBAIpMUP7Qv4kj0ttbHaEYtr8cSdStQ3NIEnxnAZCAZA9apHzjJDWDRYzwD8OZBJZAH8JBzLGAbbIebi4YmZBzwpGz4PfnTs7xjyztjdf2QETCCFLOUFh2BLc3T3RhOAmpYoqwYw2b8knDfLkSxBgRl6mHIr84l6ohKTT340ERI"

app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.

    // Parse the query params
    console.log('step 1');
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        console.log('step 2');
    
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            console.log('NOT_VERIFIED');
    
            res.sendStatus(403);
        }
    }
});

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {
    console.log('STEP -1 APP');
    
    // Parse the request body from the POST
    let body = req.body;
    
    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
        console.log('STEP 2 APP');
    
        body.entry.forEach(function (entry) {
            console.log('steps');
        
            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender ID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {

                handlePostback(sender_psid, webhook_event.postback);
            }

        });
        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        console.log('STEP 2 NOT WORKED');
    
        res.sendStatus(404);

    }

});

function handleMessage(sender_psid, received_message) {
    let response;

    // Checks if the message contains text
    if (received_message.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
        }
    } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
    }

    // Send the response message
    callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
    console.log('ok')
    let response;
    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { "text": "Thanks!" }
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
    let access_token
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": access_token },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}