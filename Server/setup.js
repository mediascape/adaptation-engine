#!/usr/bin/env node

"use strict";
/**
 * MediaScape SharedState - setup.js
 * Setup the config file
 *
 * @author Andreas Bosl <bosl@irt.de>
 * @copyright 2014 Institut für Rundfunktechnik GmbH, All rights reserved.
 */

var config = require('./config.example.js');

var readline = require('readline');
var fs = require('fs');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Starting Setup...');
console.log('If you want to use Authentication, please first generate your Client-ID and Secret at https://console.developers.google.com/project');



var q1 = function () {
    rl.question("Do you want to use Authentication (y/n)? \n[n]:", function (input) {
        if (input.length == 0) {
            config.auth.useAuthentication = false;
            q2();
        } else {
            if (input == 'y') {
                config.auth.useAuthentication = true;
                q1_1();
            } else {
                if (input == 'n') {
                    config.auth.useAuthentication = false;
                    q2();
                } else {
                    console.log('Sorry, please try again');
                    q1();
                }
            }
        }
    });
};


var q1_1 = function () {
    rl.question("Your GOOGLE_CLIENT_ID:", function (input) {
        if (input.length > 0) {
            config.auth.GOOGLE_CLIENT_ID = input;
            q1_2();
        } else {
            console.log('Sorry, please try again');
            q1_1();
        }
    });
};

var q1_2 = function () {
    rl.question("Your GOOGLE_CLIENT_SECRET:", function (input) {
        if (input.length > 0) {
            config.auth.GOOGLE_CLIENT_SECRET = input;
            q1_3();
        } else {
            console.log('Sorry, please try again');
            q1_2();
        }
    });
};

var q1_3 = function () {
    rl.question("Your GOOGLE_CALLBACK_URL (Your Domain + /auth/google/callback):", function (input) {
        if (input.length > 0) {
            config.auth.GOOGLE_CALLBACK_URL = input;
            q1_4();
        } else {
            console.log('Sorry, please try again');
            q1_3();
        }
    });
};

var q1_4 = function () {
    rl.question("Your Secret for the session cookie [" + config.auth.session_secret + "]:", function (input) {
        if (input.length == 0) {
            q1_5();
        } else {
            config.auth.session_secret = input;
            q1_5();
        }
    });
};

var q1_5 = function () {
    rl.question("Name for the session cookie [" + config.auth.session_name + "]:", function (input) {
        if (input.length == 0) {
            q2();
        } else {
            config.auth.session_name = input;
            q2();
        }
    });
};




var q2 = function () {
    rl.question("URI to your mongodb [" + config.mongoose.uri + "]:", function (input) {
        if (input.length == 0) {
            q3();
        } else {
            config.mongoose.uri = input;
            q3();
        }
    });
};

var q3 = function () {
    rl.question("Port for the Express Server [" + config.express.port + "]:", function (input) {
        if (input.length == 0) {
            rl.close();
            save();
        } else {
            config.express.port = input;
            rl.close();
            save();
        }
    });
};

var save = function () {
    fs.writeFile('config.js', 'var config =' + JSON.stringify(config, null, "\t") + '\nmodule.exports = config;', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("Saved to config.js!");
    });

};
q1();
