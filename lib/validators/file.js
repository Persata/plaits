'use strict';

// Lodash
var _ = require('lodash');

// Promise
/* jshint ignore:start */
var Promise = require('bluebird');
/* jshint ignore:end */

// Lib Magic
var mmm = require('mmmagic'), Magic = mmm.Magic;

/**
 * File Validators for Plaits Forms
 * @constructor
 * @param validatorInternals
 * @param validator
 * @param config
 * @returns {*}
 */
var FileValidators = function (validatorInternals, validator, config) {
    /**
     * File Validators
     * @type {*}
     */
    return {
        /**
         * File Required Validator
         * @param [customErrorMessage]
         * @returns {Function}
         */
        required: function (customErrorMessage) {
            // Return Required File Validation Function
            return function requiredFileValidator(value, label, formModel, additionalVars) {
                // Check
                if ((value === null || typeof value === 'undefined') || (value === '') || internals.getNormalisedFileValue(value, 'size', config) === 0 || internals.getNormalisedFileValue(value, 'name', config) === '' || internals.getNormalisedFileValue(value, 'originalFilename', config) === '') {
                    if (customErrorMessage) {
                        // Invalid, Custom Error Message
                        return validatorInternals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label}));
                    } else {
                        // Invalid, Standard Error Message
                        return validatorInternals.parseErrorMessage('{{label}} is a required field.', {label: label});
                    }
                } else {
                    return true;
                }
            };
        },

        /**
         * File Minimum Size Validator
         * @param minSize
         * @param [customErrorMessage]
         * @returns {Function}
         */
        minSize: function (minSize, customErrorMessage) {
            // Return Min Size Validation Function
            return function minSizeValidator(value, label, formModel, additionalVars) {
                // Check
                if (value) {
                    // Get Uploaded Size
                    var fileSize = internals.getNormalisedFileValue(value, 'size', config);
                    // Get Validator Size in Bytes
                    var sizeInBytes = internals.getSizeInBytes(minSize);
                    // Compare Size
                    if (fileSize >= sizeInBytes || fileSize === 0) {
                        return true;
                    } else if (customErrorMessage) {
                        // Invalid, Custom Error Message
                        return validatorInternals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label, size: internals.humanizeBytes(sizeInBytes)}));
                    } else {
                        // Invalid, Standard Error Message
                        return validatorInternals.parseErrorMessage('{{label}} must be at least {{size}}.', {label: label, size: internals.humanizeBytes(sizeInBytes)});
                    }
                } else {
                    return true;
                }
            };
        },

        /**
         * File Maximum Size Validator
         * @param maxSize
         * @param [customErrorMessage]
         * @returns {Function}
         */
        maxSize: function (maxSize, customErrorMessage) {
            // Return Max Size Validation Function
            return function maxSizeValidator(value, label, formModel, additionalVars) {
                // Check
                if (value) {
                    // Get Uploaded Size
                    var fileSize = internals.getNormalisedFileValue(value, 'size', config);
                    // Get Validator Size in Bytes
                    var sizeInBytes = internals.getSizeInBytes(maxSize);
                    // Compare Size
                    if (sizeInBytes >= fileSize || fileSize === 0) {
                        return true;
                    } else if (customErrorMessage) {
                        // Invalid, Custom Error Message
                        return validatorInternals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label, size: internals.humanizeBytes(sizeInBytes)}));
                    } else {
                        // Invalid, Standard Error Message
                        return validatorInternals.parseErrorMessage('{{label}} must be smaller than {{size}}.', {label: label, size: internals.humanizeBytes(sizeInBytes)});
                    }
                } else {
                    return true;
                }
            };
        },

        /**
         * MIME Type Validation
         * @param mimeTypes
         * @param [customErrorMessage]
         * @returns {Function}
         */
        mimeTypes: function (mimeTypes, customErrorMessage) {
            // Return MIME Type Validation Function
            return function mimeTypeValidator(value, label, formModel, additionalVars) {
                // Should we check, i.e. has anything been uploaded?
                if ((value === null || typeof value === 'undefined') || (value === '') || internals.getNormalisedFileValue(value, 'size', config) === 0 || internals.getNormalisedFileValue(value, 'name', config) === '' || internals.getNormalisedFileValue(value, 'originalFilename', config) === '') {
                    // No, so return true.
                    return true;
                } // Else -> Do validation.
                // Array? Make One Out Of It
                if (!_.isArray(mimeTypes)) {
                    mimeTypes = [mimeTypes];
                }
                // Iterate And Separate Wildcards, If Any
                var standardMimeTypes = [];
                var wildCardMimeTypes = [];
                mimeTypes.forEach(function (mimeType) {
                    // Check Regex
                    var regexResult = internals.mimeTypeWildcardRegex.exec(mimeType);
                    if (regexResult && regexResult.length === 3) {
                        // Wildcard Regex
                        wildCardMimeTypes.push(regexResult[1]);
                    } else {
                        standardMimeTypes.push(mimeType);
                    }
                });
                // Get Type
                var normalisedMimeType = internals.getNormalisedFileValue(value, 'type', config);
                // Use In Validator To Check Standard Mime Types
                if (validator.isIn(normalisedMimeType, standardMimeTypes)) {
                    // Found a match, valid
                    return true;
                }
                // Now try the wildcards
                var uploadedMimeTypeRegexResult = internals.mimeTypeRegex.exec(normalisedMimeType);
                // Good regex?
                if (uploadedMimeTypeRegexResult && uploadedMimeTypeRegexResult.length === 3) {
                    // Use In Validator To Check Wildcard Mime Types
                    if (validator.isIn(uploadedMimeTypeRegexResult[1], wildCardMimeTypes)) {
                        // Valid
                        return true;
                    }
                }
                // If we reach here without returning, it's not valid, so return the error message.
                if (customErrorMessage) {
                    // Invalid, Custom Error Message
                    return validatorInternals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label}));
                } else {
                    // Invalid, Standard Error Message
                    return validatorInternals.parseErrorMessage('{{label}} must be one of the following file types: {{mimeTypes}}.', {label: label, mimeTypes: mimeTypes.join(', ')});
                }
            };
        },

        /**
         * Enforce Matching Mime Types.
         * Useful for checking that the MIME type of an uploaded image is actually an image,
         * and not an .exe or something wild that like.
         *
         * This validator is asynchronous due to the nature of the libmagic external bindings,
         * so must be used with validate() and not validateSync().
         *
         * @param [customErrorMessage]
         * @returns {Function}
         */
        enforceMimeMatch: function (customErrorMessage) {
            // Return Mime Match Validator
            return function enforceMimeMatchValidator(value, label, formModel, additionalVars) {
                // Return Promise
                return new Promise(function (resolve, reject) {
                    // New Magic, with MIME Type
                    var magic = new Magic(mmm.MAGIC_MIME_TYPE);
                    // Check File
                    magic.detectFile(internals.getNormalisedFileValue(value, 'path', config), function (err, result) {
                        // Error?
                        if (err) {
                            // Reject Promise
                            return reject(err);
                        }
                        // No Error -> Compare Result
                        if (result === internals.getNormalisedFileValue(value, 'type', config)) {
                            // All good, MIME type matches, resolve the promise as true.
                            return resolve(true);
                        } else {
                            // Not valid, so return the error message -> check for custom first
                            if (customErrorMessage) {
                                // Invalid, Custom Error Message
                                return resolve(validatorInternals.parseErrorMessage(customErrorMessage, _.merge(additionalVars, {label: label})));
                            } else {
                                // Invalid, Standard Error Message
                                return resolve(validatorInternals.parseErrorMessage('The MIME Type of {{label}} does not match its contents.', {label: label}));
                            }
                        }
                    });
                });
            };
        },

        /**
         * File Helpers
         */
        helpers: {
            /**
             * Check If Form Value Is A File
             * @param formValue
             * @return boolean
             */
            hasFile: function (formValue) {
                // Apply Same Logic As Required Validator
                if ((formValue === null || typeof formValue === 'undefined') || (formValue === '') || internals.getNormalisedFileValue(formValue, 'size', config) === 0 || internals.getNormalisedFileValue(formValue, 'name', config) === '' || internals.getNormalisedFileValue(formValue, 'originalFilename', config) === '') {
                    return false;
                } else {
                    return true;
                }
            }
        }
    };
};

/**
 * File Validator Internals
 * @type {*}
 */
var internals = {
    /**
     * File Size Conversion Array
     */
    fileSizeConversions: {
        k: 1024, K: 1024, kb: 1024, KB: 1024, kB: 1024,
        m: Math.pow(1024, 2), M: Math.pow(1024, 2), MB: Math.pow(1024, 2),
        g: Math.pow(1024, 3), G: Math.pow(1024, 3), GB: Math.pow(1024, 3)
    },

    /**
     * File Size Regex
     */
    fileSizeRegex: /(\d+)(\D+)/i,

    /**
     * MIME-Type Wildcard Regex
     */
    mimeTypeWildcardRegex: /(\D+)\/(\*)/i,

    /**
     * MIME-Type Of Submitted Form Regex
     */
    mimeTypeRegex: /(\D+)\/(\D+)/i,

    /**
     * Get Size in Bytes
     * @param sizeString
     */
    getSizeInBytes: function (sizeString) {
        // Declarations
        var jedecDenomination, numericValue, regexResult;
        // Get Regex Result
        regexResult = this.fileSizeRegex.exec(sizeString);
        // Check
        if (regexResult) {
            numericValue = regexResult[1];
            jedecDenomination = regexResult[2];
            if ((!isNaN(parseFloat(numericValue))) && this.fileSizeConversions[jedecDenomination]) {
                return numericValue * this.fileSizeConversions[jedecDenomination];
            }
        } else if ((regexResult === null) && (!isNaN(parseInt(sizeString)))) {
            return sizeString;
        }
        throw new Error('Unable to parse the maximum file size supplied - use either a number, or JEDEC denomination under 1TB, e.g. 2M, 120kB');
    },

    /**
     * Humanize The File Size
     * @param bytesAmount
     * @returns string
     */
    humanizeBytes: function (bytesAmount) {
        var divideAmount, humanString;
        for (divideAmount in this.humanizeDivisions) {
            humanString = this.humanizeDivisions[divideAmount];
            if ((bytesAmount / divideAmount) < 1024) {
                return (bytesAmount / divideAmount) + humanString;
            }
        }
        return bytesAmount + ' bytes';
    },

    /**
     * Get Normalised Value
     * By using passed configuration, get a normalised value for size, original path etc.
     * @param fileObject {Object}
     * @param value String
     * @param config {Object}
     */
    getNormalisedFileValue: function (fileObject, value, config) {
        // Check if there's an equivalent mapping
        if (config.fileFieldMappings && config.fileFieldMappings[value]) {
            return fileObject[config.fileFieldMappings[value]];
        } else {
            // Return Default / Value Requested
            return fileObject[value];
        }
    }
};

/**
 * Humanize Divisions for File Sizes
 * @type {Array}
 */
internals.humanizeDivisions = [];
internals.humanizeDivisions[1024] = 'kB';
internals.humanizeDivisions[Math.pow(1024, 2)] = 'MB';
internals.humanizeDivisions[Math.pow(1024, 3)] = 'GB';

// Export
module.exports = FileValidators;