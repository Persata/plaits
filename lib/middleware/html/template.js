'use strict';

// Lodash
var _ = require('lodash');

// Path
var path = require('path');

// File System
var fs = require('fs');

// Helper Options
var helperOptions;

// Default Template Path
var defaultTemplatePath = path.join(__dirname, 'templates');

// Default Template Extension
var defaultTemplateExtension = 'jade';

/**
 * Template Html Helpers
 * @returns {{textField: Function}}
 * @constructor
 */
var TemplateHelper = function (htmlHelper, res, options) {

    // Set Options
    helperOptions = options;

    /**
     * Return
     */
    return {
        /**
         * Generate Text Field Template
         * @param model
         * @param attribute
         */
        textField: function (model, attribute) {
            // Get View
            var view = internals.getView('textField', res);
            // Build Options
            var options = _.merge(res.locals, {
                model: model,
                attribute: attribute
            });
            // Render & Return
            return view.engine(view.path, options);
        }
    };
};

/**
 * Template Internals
 * @type {{}}
 */
var internals = {
    /**
     * Resolve Template Name.
     *
     * Checks config provided template path, then default template path.
     * Throws an error if template cannot be found.
     *
     * @param templateName string
     * @returns {*}
     */
    _resolveTemplatePath: function (templateName) {
        // Check User Provided
        var templatePath = false;
        // Path Attempt
        var pathAttempt = '';
        // Config Passed In?
        if (helperOptions.templatePath) {
            // Extension
            var fileExtension = helperOptions.templateExtension ? helperOptions.templateExtension : defaultTemplateExtension;
            // Attempt
            pathAttempt = path.join(helperOptions.templatePath, templateName + '.' + fileExtension);
            // Check
            if (fs.existsSync(pathAttempt)) {
                return pathAttempt;
            }
        }
        // Template Path Found?
        if (templatePath === false) {
            // Check Default Provided
            pathAttempt = path.join(defaultTemplatePath, templateName + '.' + defaultTemplateExtension);
            // Check
            if (fs.existsSync(pathAttempt)) {
                return pathAttempt;
            }
        }
        // Throw Error, Not Found
        if (templatePath === false) {
            throw new Error('Could not resolve template path for ' + templateName);
        }
    },

    /**
     * Construct View
     * @param templatePath string
     * @param res Object
     * @return View
     */
    _constructView: function (templatePath, res) {
        return new (res.app.get('view'))(templatePath, {
            defaultEngine: res.app.get('view engine'),
            root: res.app.get('views'),
            engines: res.app.engines
        });
    },

    /**
     * Get View for Template Path
     * @param templatePath
     * @param res Object
     * @returns {*}
     */
    getView: function (templatePath, res) {
        // Construct View
        return this._constructView(this._resolveTemplatePath(templatePath), res);
    }
};

module.exports = TemplateHelper;