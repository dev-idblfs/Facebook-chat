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


app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "EAAI87J7KpbYBAIpMUP7Qv4kj0ttbHaEYtr8cSdStQ3NIEnxnAZCAZA9apHzjJDWDRYzwD8OZBJZAH8JBzLGAbbIebi4YmZBzwpGz4PfnTs7xjyztjdf2QETCCFLOUFh2BLc3T3RhOAmpYoqwYw2b8knDfLkSxBgRl6mHIr84l6ohKTT340ERI"

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {

    let body = req.body;
    console.log("entered");
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
        console.log("inside_page");
        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {
            console.log("inside_body");
            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        console.log("not done");
            
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

});
