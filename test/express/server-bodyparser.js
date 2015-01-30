var express = require('express');
var http = require('http');
var Plaits = require('../../index');
var app = express();

// Configure
Plaits.setValidatorConfig({fileValueMappings: Plaits.FileMappings.BodyParser});

// Basic Express Middleware
app.use(new Plaits.ExpressMiddleware());

// Export App
module.exports = app;