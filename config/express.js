/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var compression = require('compression');
var bodyParser = require('body-parser');
//var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
//var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var passport = require('passport');
var glob = require('glob');

module.exports = function (app,config) {
    var env = app.get('env');

    //app.set('views', config.root + '/server/views');
    //app.engine('html', require('ejs').renderFile);
    //app.set('view engine', 'html');
    //app.use(compression());
    app.use(logger('dev'));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    //app.use(methodOverride());
    app.use(cookieParser());
    app.use(passport.initialize());

    if ('production' === env) {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    }

    if ('development' === env || 'test' === env) {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }
};