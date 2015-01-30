var express = require('express');
var http = require('http');
var Plaits = require('../../index');
var multer = require('multer');
var app = express();

// Configure
Plaits.setValidatorConfig({fileValueMappings: Plaits.FileMappings.Multer});

// Basic Express Middleware
app.use(new Plaits.ExpressMiddleware());

// Multer
app.use(multer({dest: 'test/uploads/'}));

// Export App
module.exports = app;