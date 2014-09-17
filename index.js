'use strict';

// Bluebird
/* jshint ignore:start */
var Promise = require('bluebird');
/* jshint ignore:end */

// Model
var Model = require('./lib/model');

// Validators
var Validators = require('./lib/validators');

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
    Plaits.expressMiddleware = ExpressMiddleware;

    /**
     * Extend
     * @type {function(): child|exports}
     */
    Model.extend = require('simple-extend');

    // Return
    return Plaits;
})();

// Exports
module.exports = Plaits;