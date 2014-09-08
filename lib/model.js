'use strict';

// Lodash
var _ = require('lodash');

// Inherits
var inherits = require('inherits');

// Inflect
var inflection = require('inflection');

// Promise
var Promise = require('bluebird');

/**
 * Base Model
 * @type {exports}
 */
var BaseModel = require('./base/model');

/**
 * Plaits Model
 * @constructor
 */
function PlaitsModel() {
    BaseModel.apply(this, arguments);
}

inherits(PlaitsModel, BaseModel);

/**
 * Extend
 */
_.extend(PlaitsModel.prototype, {
    /**
     * Get Label Text
     * @return String
     */
    getLabelText: function (field) {
        // Set?
        if (this.labels && this.labels[field] != null) {
            // Return
            return this.labels[field];
        } else {
            // Title and Return
            return inflection.titleize(field);
        }
    },

    /**
     * Get Field Identifier (Name / ID) For A Given Field
     * @param field
     * @ return string
     */
    getFieldIdentifier: function (field) {
        // Set?
        if (this.fields && _.contains(this.fields, field)) {
            // Return
            return this.name + '_' + field;
        } else {
            // Throw Error
            throw new Error("Field " + field + " Not Found In Model");
        }
    },

    /**
     * Add Error Message For Given Field
     * @param field
     * @param errorMessage
     * @returns {PlaitsModel}
     */
    addError: function (field, errorMessage) {
        // Object Already Exists?
        if (!this._errors[field]) {
            this._errors[field] = [];
        }
        // Add To Error Object
        this._errors[field].push(errorMessage);
        // Return This For Chaining
        return this;
    },

    /**
     * Return Errors for Field, Or All Errors If No Field Given
     * @param [field]
     * @returns {Array}
     */
    getErrors: function (field) {
        // Check Fields
        if (field && this.fields && _.contains(this.fields, field)) {
            // Get Errors for Field
            return this._errors[field];
        } else if (!field) { // No Field Specified
            return this._errors;
        } else {
            // Throw Error
            throw new Error("Field " + field + " Not Found In Model");
        }
    },

    /**
     * Parse Request
     * @param request
     * @private
     * @returns {PlaitsModel}
     */
    _parseRequest: function (request) {
        // Loop Over Fields
        this.fields.forEach(function (field) {
            // Get Identifier
            var fieldIdentifier = this.getFieldIdentifier(field);
            // Check Body (POST)
            if (request.body && typeof request.body[fieldIdentifier] !== 'undefined') {
                this.set(field, request.body[fieldIdentifier]);
            } else if (request.query && request.query[fieldIdentifier] !== 'undefined') { // Check Query (GET)
                this.set(field, request.query[fieldIdentifier]);
            }
        }, this);
        // Return This
        return this;
    },

    /**
     * Parse Request With A Promise
     * @param request
     * @returns {*}
     */
    parseRequest: function (request) {
        return Promise.bind(this).then(function () {
            return this.triggerThen('beforeParseRequest', this, request);
        }).then(function () {
            return this._parseRequest(request);
        }).tap(function () {
            return this.triggerThen('afterParseRequest', this, request);
        });
    },

    /**
     * Parse Request Synchronously
     * @param request
     * @returns {PlaitsModel}
     */
    parseRequestSync: function (request) {
        // Before Event
        this.trigger('beforeParseRequest', this, request);
        // Parse Request
        this._parseRequest(request);
        // After Event
        this.trigger('afterParseRequest', this, request);
        // Return for Chaining
        return this;
    },

    _validateSync: function (additionalVars) {
        // Overall Result
        var overallResult = true;
        // Iterate Over Fields
        this.fields.forEach(function (field) {
            // Check Validator
            if (this.validators && this.validators[field]) {
                // Array of Validators?
                if (Array.isArray(this.validators[field])) {
                    // Iterate
                    this.validators[field].forEach(function (validationFunction) {
                        // Check It's a Function
                        if (_.isFunction(validationFunction)) {
                            // Get Result
                            var result = validationFunction(this.get(field), this.getLabelText(field), this, additionalVars ? additionalVars : {});
                            // Check
                            if (result !== true) {
                                // Add Error For Field
                                this.addError(field, result);
                                // Overall Result Is Invalid
                                overallResult = false;
                            }
                        } else {
                            throw new Error('Expected a function for validation - got ' + typeof validationFunction);
                        }
                    }, this);
                } else {
                    // Get Result
                    var result = this.validators[field](this.get(field), this.getLabelText(field), additionalVars);
                    // Check
                    if (result !== true) {
                        // Add Error For Field
                        this.addError(field, result);
                        // Overall Result Is Invalid
                        overallResult = false;
                    }
                }
            }
        }, this);
        // Return Overall Result
        return overallResult;
    },

    /**
     * Validate The Form & Data Synchronously
     * @param [additionalVars]
     * @return Boolean
     */
    validateSync: function (additionalVars) {
        // Before Event
        this.trigger('beforeValidate', this, additionalVars);
        // Parse Request
        var result = this._validateSync(additionalVars);
        // After Event
        this.trigger('afterValidate', this, additionalVars);
        // Return for Chaining
        return result;
    },

    /**
     * Handle Validation
     * @param additionalVars
     * @private
     */
    _validate: function (additionalVars) {
        // Overall Result
        var overallResult = true;
        // Iterate Over Fields
        return Promise.map(this.fields, function (field) {
            // Check
            if (this.validators && this.validators[field]) {
                // Array of Validators?
                if (Array.isArray(this.validators[field])) {
                    // Build Map
                    return Promise.map(this.validators[field], function (validationFunction) {
                        // Check It's a Function
                        if (_.isFunction(validationFunction)) {
                            // Create Promise Method
                            validationFunction = Promise.method(validationFunction);
                            // Run
                            return validationFunction(this.get(field), this.getLabelText(field), this, additionalVars ? additionalVars : {}).then(function (result) {
                                // Check Result
                                if (result !== true) {
                                    // Add Error For Field
                                    this.addError(field, result);
                                    // Overall Result Is Invalid
                                    overallResult = false;
                                }
                            }.bind(this));
                        } else {
                            throw new Error('Expected a function for validation - got ' + typeof validationFunction);
                        }
                    }.bind(this), this);
                } else {
                    // Create Promise Method
                    var validationFunction = Promise.method(this.validators[field]);
                    // Run
                    return validationFunction(this.get(field), this.getLabelText(field), this, additionalVars ? additionalVars : {}).then(function (result) {
                        // Check Result
                        if (result !== true) {
                            // Add Error For Field
                            this.addError(field, result);
                            // Overall Result Is Invalid
                            overallResult = false;
                        }
                    }.bind(this));
                }
            }
        }.bind(this)).then(function () {
            // Return Result
            return overallResult;
        });
    },

    /**
     * Validate The Form & Data Asynchronously
     * @param [additionalVars]
     * @return Promise
     */
    validate: function (additionalVars) {
        return Promise.bind(this).then(function () {
            return this.triggerThen('beforeValidate', this);
        }).then(function () {
            return this._validate(additionalVars);
        }).tap(function (validationResult) {
            return this.triggerThen('afterValidate', this, validationResult, this.getErrors());
        });
    }
});

/**
 * Module Exports
 */
module.exports = PlaitsModel;