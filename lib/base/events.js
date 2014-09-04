// Bluebird Promises
var Promise     = require('bluebird');
// Backbone
var Backbone    = require('backbone');
// Trigger Then
var triggerThen = require('trigger-then');

// Trigger Then Mixin for Backbone Events
triggerThen(Backbone, Promise);

// Module Exports
module.exports = Backbone.Events;