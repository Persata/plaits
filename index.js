'use strict';

// Model
var Model = require('./lib/model');

// Validators
var Validators = require('./lib/validators');

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
     * Extend
     * @type {function(): child|exports}
     */
    Model.extend = require('simple-extend');

    // Return
    return Plaits;
})();

// Exports
module.exports = Plaits;