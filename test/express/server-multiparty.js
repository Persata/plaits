var express = require('express');
var http = require('http');
var Plaits = require('../../index');
var multipart = require('connect-multiparty');
var app = express();

// Use Multer
app.use(multipart());

// Basic Express Middleware
app.use(new Plaits.ExpressMiddleware());

// Export App
module.exports = app;