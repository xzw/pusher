'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../services/auth');
var LocalStrategy = require('passport-local').Strategy;

var router = express.Router();

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the model
      },
      function(email, password, done) {
        User.findOne({
          email: email.toLowerCase()
        }, function(err, user) {
          if (err) return done(err);

          if (!user) {
            return done(null, false, { message: 'This email is not registered.' });
          }
          if (!user.authenticate(password)) {
            return done(null, false, { message: 'This password is not correct.' });
          }
          return done(null, user);
        });
      }
  ));
};

router.post('/passport', function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.status(401).json(error);
    if (!user) return res.status(404).json({message: 'Something went wrong, please try again.'});

    var token = auth.signToken(user._id, user.role);
    res.json({token: token});
  })(req, res, next)
});

module.exports = router;