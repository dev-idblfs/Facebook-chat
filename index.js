'user strick'

const express = require('express');
bodyParser = require('body-parser');
app = express().use(bodyParser.json());

app.listen(process.env.PORT || 1337, () => console.log("server is running...!"));
