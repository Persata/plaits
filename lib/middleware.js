'use strict';

// Path
var path = require('path');

// File System
var fs = require('fs');

// Lodash
var _ = require('lodash');

// Html Helper
var Html = require('./middleware/html');

// Default Template Path
var defaultTemplatePath = path.join(__dirname, 'middleware', 'html', 'templates');

// Default Template Extension
var defaultTemplateExtension = 'jade';

/**
 * Plaits Express Middleware
 * @param app
 * @param options
 * @return {Function}
 * @constructor
 */
var ExpressMiddleware = function (app, options) {

    // Options
    options = options || {};

    /**
     * Middleware Internals
     * @type {*}
     */
    var internals = {
        /**
         * Resolved Template Paths
         */
        _templatePaths: {},

        /**
         * Standard Templates
         */
        _standardTemplates: [
            'textField',
            'passwordField'
        ],

        /**
         * Resolve Template Paths At Boot Time, So They're 'Cached' For Later Use
         * @param app
         * @param options
         */
        resolveTemplatePaths: function (app, options) {
            // Options
            options = options || {};
            // Template Paths?
            if (options.templatePaths && !_.isArray(options.templatePaths)) {
                options.templatePaths = [options.templatePaths];
            } else if (!options.templatePaths) {
                options.templatePaths = [];
            }
            // Iterate And Resolve
            _.forEach(this._standardTemplates, function (templateName) {
                // Path Attempt
                var pathAttempt = '';
                // Config Passed In?
                if (options.templatePaths.length) {
                    // Iterate
                    _.forEach(options.templatePaths, function (templatePath) {
                        // Extension
                        var fileExtension = options.templateExtension ? options.templateExtension : defaultTemplateExtension;
                        // Attempt
                        pathAttempt = path.join(templatePath, templateName + '.' + fileExtension);
                        // Check
                        if (fs.existsSync(pathAttempt)) {
                            // Assign
                            this._templatePaths[templateName] = pathAttempt;
                            // Exit Early
                            return true;
                        }
                    }, this);
                }
                // Template Path Found?
                if (!this._templatePaths[templateName]) {
                    // Check Default Provided
                    pathAttempt = path.join(defaultTemplatePath, templateName + '.' + defaultTemplateExtension);
                    // Check
                    if (fs.existsSync(pathAttempt)) {
                        this._templatePaths[templateName] = pathAttempt;
                    }
                }
                // Still Nothing? Null
                if (!this._templatePaths[templateName]) {
                    // Not Found
                    this._templatePaths[templateName] = false;
                }
            }, this);
            // Return Template Paths
            return this._templatePaths;
        },

        /**
         * Get Resolved Template Paths
         * @return {*}
         */
        getTemplatePaths: function () {
            return this._templatePaths;
        }
    };

    // Resolve Template Paths
    internals.resolveTemplatePaths(app, options);

    /**
     * Middleware Function
     */
    return function (req, res, next) {
        // Attach Helpers To Locals
        if (options.name) {
            res.locals[options.name] = {
                Html: new Html(res, internals.getTemplatePaths(), options)
            }
        } else {
            res.locals.Plaits = {
                Html: new Html(res, internals.getTemplatePaths(), options)
            }
        }
        // Onto The Next Middleware
        next();
    }
};

module.exports = ExpressMiddleware;