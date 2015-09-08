#!/usr/bin/env node

"use strict";
/**
 * MediaScape SharedState - express.js
 * Simple Express Server
 *
 * @author Andreas Bosl <bosl@irt.de>
 * @copyright 2014 Institut für Rundfunktechnik GmbH, All rights reserved.
 */

function ExpressServer() {
    var that;

    var config = require('../config');

    var log4js = require('log4js');
    log4js.configure(config.logConfig);
    var logger = log4js.getLogger('ExpressServer');

    // Setup express server
    var express = require('express');
    var app = express();
    var server = require('http').createServer(app);
    var passport = require('passport');
    var util = require('util');
    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    var MongoStore = require('connect-mongo')(session);


    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    var redirectMS = null;
    var redirectForCallback = '/';

    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.  However, since this example does not
    //   have a database of user records, the complete Google profile is
    //   serialized and deserialized.
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    // Use the GoogleStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and Google
    //   profile), and invoke a callback with a user object.
    passport.use(new GoogleStrategy({
            clientID: config.auth.GOOGLE_CLIENT_ID,
            clientSecret: config.auth.GOOGLE_CLIENT_SECRET,
            //NOTE :
            //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
            //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/ 
            //then edit your /etc/hosts local file to point on your private IP. 
            //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
            //if you use it.
            callbackURL: config.auth.GOOGLE_CALLBACK_URL,
            passReqToCallback: true
        },
        function (request, accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {

                // To keep the example simple, the user's Google profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the Google account with a user record in your database,
                // and return that user instead.
                return done(null, profile);
            });
        }
    ));




    // configure Express
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);


    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(session({
        secret: config.auth.session_secret,
        name: config.auth.session_name,
        proxy: true,
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({
            url: config.mongoose.uri + 'session'
        }),
        cookie: {httpOnly:false}
    }));

    app.use(passport.initialize());
    app.use(passport.session());


    app.get('/', function (req, res) {
        res.render('index', {
            user: req.user
        });
    });

    app.get('/info', ensureAuthenticated, function (req, res) {
        res.render('info', {
            user: req.user
        });
    });
    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve
    //   redirecting the user to google.com.  After authorization, Google
    //   will redirect the user back to this application at /auth/google/callback
    app.get('/auth/google', function (req, res, next) {
        if (req.query) {
            if (req.query.redirectMS) {
                res.cookie('redirectMS', req.query.redirectMS, {
                    maxAge: 900000,
                    httpOnly: true
                })
            } else {
                res.clearCookie('redirectMS');
            }
        } else {
            res.clearCookie('redirectMS');
        }
        next();
    }, passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login']
    }));

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.



    app.get('/auth/google/callback', function (req, res, next) {
        passport.authenticate('google', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/');
            } else {
                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }

                    if (req.cookies.redirectMS && req.cookies.redirectMS != 'undefined') {
                        res.clearCookie('redirectMS');
                        return res.redirect(req.cookies.redirectMS);
                    } else {
                        return res.redirect('/example.html');
                    }
                });
            }
        })(req, res, next);
    });



    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/example.html', ensureAuthenticated, function (req, res) {
        res.render("../www/example.html", {
            user: req.user
        });
    });

    app.use(express.static(__dirname + config.express.filePath));


    server.listen(config.express.port, function () {
        logger.debug('Webserver listening at port %d', config.express.port);
    });



    // Simple route middleware to ensure user is authenticated.
    //   Use this route middleware on any resource that needs to be protected.  If
    //   the request is authenticated (typically via a persistent login session),
    //   the request will proceed.  Otherwise, the user will be redirected to the
    //   login page.
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        if (!config.auth.useAuthentication){
            return next();
        }
        res.redirect('/');
    }



    function getServer() {
        return server;
    };

    that = {
        getServer: getServer
    };

    return that;
}

module.exports = ExpressServer;