const express = require('express');

const path = require('path');

const app = express().use(express.static(path.join(__dirname,'templates')));


app.listen(process.env.PORT || 1337, () => console.log("server is running...@ " + process.env.PORT));

// Adds support for GET requests to our webhook
app.get('/', (req, res) => {
    console.log('working');
    res.sendStatus(200);
});