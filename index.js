'use strict';

// Lodash
var _ = require('lodash');

// Bluebird
/* jshint ignore:start */
var Promise = require('bluebird');
/* jshint ignore:end */

// Model
var Model = require('./lib/model');

// Validators
var Validators = require('./lib/validators');

// File Mappings
var FileMappings = require('./lib/mappings');

// Express Middleware
var ExpressMiddleware = require('./lib/middleware');

// Plaits
var Plaits = (function () {

    /**
     * Constructor
     * @constructor
     */
    function Plaits() {
    }

    /**
     * Model
     * @constructor
     */
    Plaits.Model = Model;

    /**
     * Validators
     * @type {Validators|exports}
     */
    Plaits.Validators = Validators;

    /**
     * Promise for Convenience
     * @type {Promise|*}
     */
    Plaits.Promise = Promise;

    /**
     * Express Middleware
     * @type {*|exports}
     */
    Plaits.ExpressMiddleware = ExpressMiddleware;

    /**
     * File Mappings
     * @type {*|exports}
     */
    Plaits.FileMappings = FileMappings;

    /**
     * Extend
     * @type {function(): child|exports}
     */
    Model.extend = require('simple-extend');

    /**
     * Set Validator Config
     * @param validatorConfig
     */
    Plaits.setValidatorConfig = function (validatorConfig) {
        _.extend(this.Validators.config, validatorConfig);
    };

    // Return
    return Plaits;
})();

// Exports
module.exports = Plaits;