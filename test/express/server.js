var express = require('express');
var http = require('http');
var path = require('path');
var Plaits = require('../../index');
var app = express();

// Basic Express Middleware
app.use(new Plaits.ExpressMiddleware());

// Export App
module.exports = app;