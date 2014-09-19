var express = require('express');
var http = require('http');
var path = require('path');
var Plaits = require('../../index');
var app = express();

// New Middleware With Some Custom Options
var expressMiddleware = new Plaits.ExpressMiddleware(app, {
    templatePaths: path.join(__dirname, '..', 'templates'),
    errorCssClass: 'error has-error',
    requiredCssClass: 'required req'
});
// Use Middleware
app.use(expressMiddleware);

// Export App
module.exports = app;