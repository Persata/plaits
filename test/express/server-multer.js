var express = require('express');
var http = require('http');
var Plaits = require('../../index');
var multer = require('multer');
var app = express();

// Use Multer
app.use(multer({dest: 'test/uploads/'}));

// Basic Express Middleware
app.use(new Plaits.ExpressMiddleware());

// Export App
module.exports = app;