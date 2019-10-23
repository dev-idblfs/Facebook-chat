const express = require('express');

const path = require('path');

const app = express().use(express.static(path.join(__dirname,'templates')));


app.listen(process.env.PORT || 1337, () => console.log("server is running...@ " + process.env.PORT));

// Adds support for GET requests to our webhook
app.get('/', (req, res) => {
    console.log('working');
    fbAsyncInit = function () {
        FB.init({
            appId: 2605373396193317,
            cookie: true,
            xfbml: true,
            version: 'v4.0'
        });

        FB.AppEvents.logPageView();

    };

    if (typeof d !== 'undefined') {
        (function (d, s, id) {
            console.log('aa');
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }
            (document, 'script', 'facebook-jssdk'));


    }

    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });


    res.sendStatus(200);
});