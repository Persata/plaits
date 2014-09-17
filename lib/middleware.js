'use strict';

// Html Helper
var Html = require('./middleware/html');

/**
 * Express Middleware
 * @param options
 * @returns {Function}
 * @constructor
 */
var ExpressMiddleware = function (options) {

    // Options
    options = options || {};

    // Build Html Helper
    var htmlHelper = Html(options);

    /**
     * Middleware Function
     * @param req
     * @param res
     * @param next
     */
    return function (req, res, next) {
        // Attach Helpers To Locals
        res.locals.Plaits = {
            Html: htmlHelper
        };
        // Onto The Next Middleware
        next();
    };
};

module.exports = ExpressMiddleware;