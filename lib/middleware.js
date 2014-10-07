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
var defaultTemplatePath = path.join(__dirname, 'templates');

// Default Template Extension
var defaultTemplateExtension = 'jade';

/**
 * Plaits Express Middleware
 * @param options
 * @return {Function}
 * @constructor
 */
var ExpressMiddleware = function (options) {

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
         * Templates
         */
        _templates: [
            'reset',
            'submit',
            'text',
            'email',
            'password',
            'number',
            'range',
            'color',
            'search',
            'date',
            'time',
            'tel',
            'url',
            'select',
            'checkbox',
            'radio',
            'checkboxList',
            'radioList',
            'textArea',
            'errorSummary'
        ],

        /**
         * Resolve Template Paths At Boot Time, So They're 'Cached' For Later Use
         * @param options
         */
        resolveTemplatePaths: function (options) {
            // Options
            options = options || {};

            // Template Paths?
            if (options.templatePaths && !_.isArray(options.templatePaths)) {
                options.templatePaths = [options.templatePaths];
            } else if (!options.templatePaths) {
                options.templatePaths = [];
            }

            // Fetch All Template Names From Directories
            _.forEach(options.templatePaths, function (templatePath) {
                // Get Contents, Iterate
                _.forEach(fs.readdirSync(templatePath), function (templateFsObject) {
                    // Check It's a Template
                    if (this.stringEndsWith(templateFsObject, '.jade')) {
                        // Remove Extension
                        templateFsObject = templateFsObject.split('.jade')[0];
                        // Not Already Set?
                        if (!this._templates[templateFsObject]) {
                            this._templates.push(templateFsObject);
                        }
                    }
                }, this);
            }, this);

            // Iterate And Resolve
            _.forEach(this._templates, function (templateName) {
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
        },

        /**
         * String Ends With
         * @param string
         * @param suffix
         * @return {boolean}
         */
        stringEndsWith: function (string, suffix) {
            return suffix.length > 0 && string.substring(string.length - suffix.length, string.length) === suffix;
        }
    };

    // Resolve Template Paths
    internals.resolveTemplatePaths(options);

    /**
     * Middleware Function
     */
    return function (req, res, next) {
        // Attach Helpers To Locals
        if (options.name) {
            res.locals[options.name] = {
                Html: new Html(res, internals.getTemplatePaths(), options)
            };
        } else {
            res.locals.Plaits = {
                Html: new Html(res, internals.getTemplatePaths(), options)
            };
        }
        // Onto The Next Middleware
        next();
    };
};

module.exports = ExpressMiddleware;