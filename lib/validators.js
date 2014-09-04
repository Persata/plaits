'use strict';

// Lodash
var _ = require('lodash');

// Node Validator
var validator = require('validator');

// Moment
var moment = require('moment');

/**
 * Lodash Template Settings
 * @type {RegExp}
 */
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

// Base Validators for Plaits Form
var Validators = {
    /**
     * Email Validator
     * @param [customErrorMessage]
     * @return {Function}
     */
    email: function (customErrorMessage) {
        // Return Email Validation Function
        return function emailValidator(value, label, formModel, additionalVars) {
            // Check
            if (validator.isEmail(value)) {
                // Valid -> All Good
                return true;
            } else if (customErrorMessage) {
                // Invalid, Custom Error Message
                return internals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label}));
            } else {
                // Invalid, Standard Error Message
                return internals.parseErrorMessage('{{label}} must be a valid email address.', {label: label});
            }
        };
    },

    /**
     * Required Validator
     * @param [customErrorMessage]
     * @return {Function}
     */
    required: function (customErrorMessage) {
        // Return Required Validation Function
        return function requiredValidator(value, label, formModel, additionalVars) {
            // Check
            if (!validator.isNull(value)) {
                // Valid -> All Good
                return true;
            } else if (customErrorMessage) {
                // Invalid, Custom Error Message
                return internals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label}));
            } else {
                // Invalid, Standard Error Message
                return internals.parseErrorMessage('{{label}} is a required field.', {label: label});
            }
        };
    },

    /**
     * Min Length Validator
     * @param minLength
     * @param [customErrorMessage]
     * @return {Function}
     */
    minLength: function (minLength, customErrorMessage) {
        // Return Min Length Validation Function
        return function minLengthValidator(value, label, additionalVars) {
            // Check
            if (validator.isLength(value, minLength)) {
                // Valid -> All Good
                return true;
            } else if (customErrorMessage) {
                // Invalid, Custom Error Message
                return internals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label, minLength: minLength}));
            } else {
                // Invalid, Standard Error Message
                return internals.parseErrorMessage('{{label}} must be at least {{minLength}} characters long.', {label: label, minLength: minLength});
            }
        }
    },

    /**
     * Max Length Validator
     * @param maxLength
     * @param [customErrorMessage]
     * @return {Function}
     */
    maxLength: function (maxLength, customErrorMessage) {
        // Return Max Length Validation Function
        return function maxLengthValidator(value, label, additionalVars) {
            // Check
            if (validator.isLength(value, 0, maxLength)) {
                // Valid -> All Good
                return true;
            } else if (customErrorMessage) {
                // Invalid, Custom Error Message
                return internals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label, maxLength: maxLength}));
            } else {
                // Invalid, Standard Error Message
                return internals.parseErrorMessage('{{label}} must be no more than {{maxLength}} characters long.', {label: label, maxLength: maxLength});
            }
        }
    },

    /**
     * Length & Length Range Validators
     * @returns {Function}
     */
    length: function () {
        // Arguments Length
        var originalArguments = arguments;
        // Return Length Validation Function
        return function lengthValidator(value, label, additionalVars) {
            // Work Out Arguments
            if (originalArguments.length === 3) {
                // 3 Arguments -> Min, Max and Custom Message
                // Run Function
                if (validator.isLength(value, originalArguments[0], originalArguments[1])) {
                    // Valid -> All Good
                    return true;
                } else {
                    // Invalid, Custom Error Message
                    return internals.parseErrorMessage(originalArguments[2], _.merge(additionalVars, {label: label}));
                }
            } else if (originalArguments.length === 2) {
                // Two Arguments -> Min and Max, or Min and Custom Message?
                if (_.isString(originalArguments[1])) {
                    // Custom Error Message -> Run Function
                    if (validator.isLength(value, originalArguments[0], originalArguments[0])) {
                        // Valid -> All Good
                        return true;
                    } else {
                        // Invalid, Custom Error Message
                        return internals.parseErrorMessage(originalArguments[1], _.merge(additionalVars, {label: label}));
                    }
                } else {
                    // Min & Max -> Run Function
                    if (validator.isLength(value, originalArguments[0], originalArguments[1])) {
                        // Valid -> All Good
                        return true;
                    } else {
                        // Invalid, Custom Error Message
                        return internals.parseErrorMessage('{{label}} must be between {{minLength}} and {{maxLength}} characters long.', {
                            label: label,
                            minLength: originalArguments[0],
                            maxLength: originalArguments[1]
                        });
                    }
                }
            } else if (originalArguments.length === 1) {
                // Run Function
                if (validator.isLength(value, originalArguments[0], originalArguments[0])) {
                    // Valid -> All Good
                    return true;
                } else {
                    // Invalid, Standard Error Message
                    return internals.parseErrorMessage('{{label}} must be exactly {{exactLength}} characters long.', {label: label, exactLength: originalArguments[0]});
                }
            } else if (originalArguments.length > 3) {
                // Too Many
                throw new Error('Too many arguments specified for length validator.');
            } else if (originalArguments.length === 0) {
                // Not Enough
                throw new Error('Not enough arguments specified for length validator - must specify at least one argument.');
            }
        }
    },

    /**
     * Numeric Validator
     * @param [customErrorMessage]
     * @returns {Function}
     */
    numeric: function (customErrorMessage) {
        // Return Numeric Validation Function
        return function numericValidator(value, label, additionalVars) {
            // Check
            if (validator.isNumeric(value)) {
                // Valid -> All Good
                return true;
            } else if (customErrorMessage) {
                // Invalid, Custom Error Message
                return internals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label}));
            } else {
                // Invalid, Standard Error Message
                return internals.parseErrorMessage('{{label}} must be a numeric value.', {label: label});
            }
        }
    },

    /**
     * Alpha Validation Function
     * @param [customErrorMessage]
     * @returns {Function}
     */
    alpha: function (customErrorMessage) {
        // Return Alpha Validation Function
        return function alphaValidator(value, label, additionalVars) {
            // Check
            if (validator.isAlpha(value)) {
                // Valid -> All Good
                return true;
            } else if (customErrorMessage) {
                // Invalid, Custom Error Message
                return internals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label}));
            } else {
                // Invalid, Standard Error Message
                return internals.parseErrorMessage('{{label}} must consist of only letters.', {label: label});
            }
        }
    },

    /**
     * Alphanumeric Validation Function
     * @param [customErrorMessage]
     * @returns {Function}
     */
    alphanumeric: function (customErrorMessage) {
        // Return Alpha Validation Function
        return function alphaNumericValidator(value, label, additionalVars) {
            // Check
            if (validator.isAlphanumeric(value)) {
                // Valid -> All Good
                return true;
            } else if (customErrorMessage) {
                // Invalid, Custom Error Message
                return internals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label}));
            } else {
                // Invalid, Standard Error Message
                return internals.parseErrorMessage('{{label}} must contain only letters and numbers.', {label: label});
            }
        }
    },

    /**
     * Url Validation Function
     * @returns {Function}
     */
    url: function () {
        // Arguments Length
        var originalArguments = arguments;
        // Return Url Validation Function
        return function urlValidator(value, label, additionalVars) {
            // Args Length Checks
            if (originalArguments.length === 2) {
                // Version & Custom Error Message
                if (validator.isURL(value, originalArguments[0], originalArguments[1])) {
                    // Valid -> All Good
                    return true;
                } else {
                    // Invalid, Custom Error Message
                    return internals.parseErrorMessage(originalArguments[1], _.merge(additionalVars, {label: label}));
                }
            } else if (originalArguments.length === 1) {
                // One Argument -> Message or Version?
                if (_.isString(originalArguments[0])) {
                    // Custom Error Message -> Run Function
                    if (validator.isURL(value)) {
                        // Valid -> All Good
                        return true;
                    } else {
                        // Invalid, Custom Error Message
                        return internals.parseErrorMessage(originalArguments[0], _.merge(additionalVars, {label: label}));
                    }
                } else { // Else -> An Options Object
                    // Version -> Run Function
                    if (validator.isURL(value, originalArguments[0])) {
                        // Valid -> All Good
                        return true;
                    } else {
                        // Invalid, Standard Error Message
                        return internals.parseErrorMessage('{{label}} must be a valid URL.', {label: label});
                    }
                }
            } else if (originalArguments.length === 0) {
                // No Args
                if (validator.isURL(value)) {
                    // Valid -> All Good
                    return true;
                } else {
                    // Invalid, Standard Error Message
                    return internals.parseErrorMessage('{{label}} must be a valid URL.', {label: label});
                }
            } else {
                throw new Error('Invalid number of arguments for URL validator function.');
            }
        }
    },

    /**
     * IP Address Validator
     * @returns {Function}
     */
    ipAddress: function () {
        // Arguments Length
        var originalArguments = arguments;
        // Return IP Address Validation Function
        return function ipAddressValidator(value, label, additionalVars) {
            // Args Length Checks
            if (originalArguments.length === 2) {
                // Version & Custom Error Message
                if (validator.isIP(value, originalArguments[0])) {
                    // Valid -> All Good
                    return true;
                } else {
                    // Invalid, Custom Error Message
                    return internals.parseErrorMessage(originalArguments[1], _.merge(additionalVars, {label: label}));
                }
            } else if (originalArguments.length === 1) {
                // One Argument -> Message or Version?
                if (_.isString(originalArguments[0])) {
                    // Custom Error Message -> Run Function
                    if (validator.isIP(value)) {
                        // Valid -> All Good
                        return true;
                    } else {
                        // Invalid, Custom Error Message
                        return internals.parseErrorMessage(originalArguments[0], _.merge(additionalVars, {label: label}));
                    }
                } else {
                    // Version -> Run Function
                    if (validator.isIP(value, originalArguments[0])) {
                        // Valid -> All Good
                        return true;
                    } else {
                        // Invalid, Standard Error Message
                        return internals.parseErrorMessage('{{label}} must be a version {{version}} IP address.', {label: label, version: originalArguments[0]});
                    }
                }
            } else if (originalArguments.length === 0) {
                // No Args
                if (validator.isIP(value)) {
                    // Valid -> All Good
                    return true;
                } else {
                    // Invalid, Standard Error Message
                    return internals.parseErrorMessage('{{label}} must be a version 4 or 6 IP address.', {label: label});
                }
            } else {
                throw new Error('Invalid number of arguments for IP Address validator function');
            }
        }
    },

    /**
     * Credit Card Validation Function
     * @param [customErrorMessage]
     * @returns {Function}
     */
    creditCard: function (customErrorMessage) {
        // Return Credit Card Validation Function
        return function creditCardValidator(value, label, additionalVars) {
            // Check
            if (validator.isCreditCard(value)) {
                // Valid -> All Good
                return true;
            } else if (customErrorMessage) {
                // Invalid, Custom Error Message
                return internals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label}));
            } else {
                // Invalid, Standard Error Message
                return internals.parseErrorMessage('{{label}} must be a valid credit card.', {label: label});
            }
        }
    },

    /**
     * Equals Validation Function
     * @param equalValue
     * @param [customErrorMessage]
     * @returns {Function}
     */
    equals: function (equalValue, customErrorMessage) {
        // Return Equals Validation Function
        return function equalsValidator(value, label, additionalVars) {
            // Check
            if (validator.equals(value, equalValue)) {
                // Valid -> All Good
                return true;
            } else if (customErrorMessage) {
                // Invalid, Custom Error Message
                return internals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label}));
            } else {
                // Invalid, Standard Error Message
                return internals.parseErrorMessage('{{label}} must equal {{equalValue}}.', {label: label, equalValue: equalValue});
            }
        }
    },

    /**
     * Is In List of Allowed Values Validation Function
     * @param allowedValues
     * @param [customErrorMessage]
     * @returns {Function}
     */
    isIn: function (allowedValues, customErrorMessage) {
        // Check
        if (!_.isArray(allowedValues)) {
            throw new Error('Invalid list given for isIn validator.');
        }
        // Return Is In Validation Function
        return function inListValidator(value, label, additionalVars) {
            // Check
            if (validator.isIn(value, allowedValues)) {
                // Valid -> All Good
                return true;
            } else if (customErrorMessage) {
                // Invalid, Custom Error Message
                return internals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label}));
            } else {
                // Invalid, Standard Error Message
                return internals.parseErrorMessage('{{label}} must be one of: {{allowedValues}}.', {label: label, allowedValues: allowedValues.join(', ')});
            }
        }
    },

    /**
     * Contains Validator
     * @param containsValue
     * @param [customErrorMessage]
     * @returns {Function}
     */
    contains: function (containsValue, customErrorMessage) {
        // Return Contains Validation Function
        return function containsValidator(value, label, additionalVars) {
            // Check
            if (validator.contains(value, containsValue)) {
                // Valid -> All Good
                return true;
            } else if (customErrorMessage) {
                // Invalid, Custom Error Message
                return internals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label}));
            } else {
                // Invalid, Standard Error Message
                return internals.parseErrorMessage('{{label}} must contain the characters "{{containsValue}}".', {label: label, containsValue: containsValue});
            }
        }
    },

    /**
     * Matches Validator
     * @param regexValue RegExp
     * @param [customErrorMessage]
     * @returns {Function}
     */
    matches: function (regexValue, customErrorMessage) {
        // Return Contains Validation Function
        return function containsValidator(value, label, additionalVars) {
            // Check
            if (validator.matches(value, regexValue)) {
                // Valid -> All Good
                return true;
            } else if (customErrorMessage) {
                // Invalid, Custom Error Message
                return internals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label}));
            } else {
                // Invalid, Standard Error Message
                return internals.parseErrorMessage('{{label}} must match the pattern {{regexValue}}.', {label: label, regexValue: regexValue.toString()});
            }
        }
    },

    /**
     * Date Validator
     * @param [customErrorMessage]
     * @returns {Function}
     */
    date: function (customErrorMessage) {
        // Return Date Validation Function
        return function dateValidator(value, label, additionalVars) {
            // Check
            if (validator.isDate(value)) {
                // Valid -> All Good
                return true;
            } else if (customErrorMessage) {
                // Invalid, Custom Error Message
                return internals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label}));
            } else {
                // Invalid, Standard Error Message
                return internals.parseErrorMessage('{{label}} must be a valid date.', {label: label});
            }
        }
    },

    /**
     * Date With Format Validator
     * @param dateFormat
     * @param [customErrorMessage]
     * @returns {Function}
     */
    dateFormat: function (dateFormat, customErrorMessage) {
        // Return Date With Format Validation Function
        return function dateFormatValidator(value, label, additionalVars) {
            // Check
            if (internals.dateFormatValidator(value, dateFormat)) {
                // Valid -> All Good
                return true;
            } else if (customErrorMessage) {
                // Invalid, Custom Error Message
                return internals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label}));
            } else {
                // Invalid, Standard Error Message
                return internals.parseErrorMessage('{{label}} must be a valid date in the format {{dateFormat}}.', {label: label, dateFormat: dateFormat});
            }
        }
    }
};

/**
 * Validation Internals
 * @type {{_parseErrorMessage: Function}}
 */
var internals = {
    /**
     * Parse And Render Error Message with
     * @param errorMessage
     * @param fields
     * @returns String
     */
    parseErrorMessage: function (errorMessage, fields) {
        return _.template(errorMessage, fields);
    },

    /**
     * Date Validator With Provided Format
     */
    dateFormatValidator: function (dateValue, dateFormat) {
        var momentResult = moment(dateValue, dateFormat, true);
        return momentResult.isValid();
    }
};


module.exports = Validators;