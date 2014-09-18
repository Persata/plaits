var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

// Set Views Path
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Export App
module.exports = app;