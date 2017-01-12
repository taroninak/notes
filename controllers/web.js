const express = require('express');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const userService = require('../services/user');

class WebController {
    handle(app) {
        passport.use(new BasicStrategy((id, password, cb) => {
            userService.authorize(id).then(user => cb(null, user)).catch(err => cb(err, false));
        }));
        passport.serializeUser((user, cb) => cb(null,user));
        passport.deserializeUser((user, cb) => cb(null,user));

        app.use(express.static('public'));
        app.use(cookieParser());
        app.use(session({ secret: 'keyboard cat', proxy: true, resave: true, saveUninitialized: true }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.get('/signin', passport.authenticate('basic', { session: true }), this.signin);
    }

    getHomePage(req, res, next) {
        res.send('Hello nigger!');
    }

    signin(req, res, next) {
        res.send(req.user);
    }
}

module.exports = new WebController();
module.exports.WebController = WebController;
