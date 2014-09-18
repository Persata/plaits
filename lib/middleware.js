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
 * Express Middleware
 */
var ExpressMiddleware = (function () {
    /**
     * Constructor
     */
    return function ExpressMiddleware(app, options) {

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
             * Resolve Template Paths At Runtime
             * @param app
             * @param options
             */
            resolveTemplatePaths: function (app, options) {
                // Options
                options = options || {};
                // Iterate And Resolve
                _.forEach(this._standardTemplates, function (templateName) {
                    // Check User Provided
                    var templatePath = false;
                    // Path Attempt
                    var pathAttempt = '';
                    // Config Passed In?
                    if (options.templatePath) {
                        // Extension
                        var fileExtension = options.templateExtension ? options.templateExtension : defaultTemplateExtension;
                        // Attempt
                        pathAttempt = path.join(options.templatePath, templateName + '.' + fileExtension);
                        // Check
                        if (fs.existsSync(pathAttempt)) {
                            this._templatePaths[templateName] = pathAttempt;
                        }
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
            },

            /**
             * Get Resolved Template Paths
             * @return {*}
             */
            getTemplatePaths: function () {
                return this._templatePaths;
            }
        };

        /**
         * Middleware Function
         */
        return function (req, res, next) {
            // Attach Helpers To Locals
            res.locals.Plaits = {
                Html: new Html(res, internals.getTemplatePaths(), options)
            };
            // Onto The Next Middleware
            next();
        }
    }

})();

module.exports = ExpressMiddleware;