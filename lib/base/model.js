'use strict';

// Lodash
var _ = require('lodash');
// Backbone
var Backbone = require('backbone');
// Our Events With TriggerThen Support
var Events = require('./events');

// Omit These Properties / Functions From The Model
var omitProperties = [
    'fetch', 'changedAttributes', 'validationError',
    'save', 'sync', 'fetch', 'destroy', 'url',
    'urlRoot', '_validate', 'isValid', 'isNew', 'clone'
];

// Base Model for Plaits Form
var BaseModel = function (attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    // Empty Attributes
    this.attributes = {};
    // Reset
    this._reset();
    // Get Defaults
    var defaults = _.result(this, 'defaults');
    // Build Values From Passed & Defaults
    if (defaults) {
        attrs = _.extend(attrs, defaults);
    }
    // Set Values
    if (options) {
        if (options.parse) attrs = this.parse(attrs, options) || {};
    }
    // Check Name
    if (typeof this.name === 'undefined' || this.name === '' || typeof this.name !== 'string') {
        throw new Error('You must specify a name for this Plaits form model')
    }
    // Empty Errors
    this._errors = {};
    // Set Attributes
    this.set(attrs, options);
    // Initialize
    this.initialize.apply(this, arguments);
};

// Calculate Omitted Properties / Functions
var propertiesWithoutOmitted = _.omit(Backbone.Model.prototype, omitProperties);

// Extend
_.extend(BaseModel.prototype, propertiesWithoutOmitted, Events, {

    // Similar to the standard `Backbone` set method, but without individual
    // change events.
    set: function (key, val, options) {
        if (key == null) return this;
        var attrs;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (typeof key === 'object') {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }
        options || (options = {});

        // Extract attributes and options.
        var hasChanged = false;
        var unset = options.unset;
        var current = this.attributes;
        var prev = this._previousAttributes;

        // For each `set` attribute, update or delete the current value.
        for (var attr in attrs) {
            val = attrs[attr];
            if (!_.isEqual(prev[attr], val)) {
                this.changed[attr] = val;
                if (!_.isEqual(current[attr], val)) hasChanged = true;
            } else {
                delete this.changed[attr];
            }
            unset ? delete current[attr] : current[attr] = val;
        }

        if (hasChanged && !options.silent) this.trigger('change', this, options);
        return this;
    },

    /**
     * Reset Changes & Previous Attributes
     * @returns {BaseModel}
     * @private
     */
    _reset: function() {
        this._previousAttributes = _.extend(Object.create(null), this.attributes);
        this.changed = Object.create(null);
        return this;
    }
});

// Simple Extend
BaseModel.extend = require('simple-extend');

// Extend Base Model
module.exports = BaseModel;