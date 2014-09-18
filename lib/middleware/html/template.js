'use strict';

// Lodash
var _ = require('lodash');

// Path
var path = require('path');

// File System
var fs = require('fs');

// Helper Options
var helperOptions;

/**
 * Template Html Helpers
 * @returns {{textField: Function}}
 * @constructor
 */
var TemplateHelper = function (app, options) {

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
            return '';
            var view = internals.getView('textField');
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

    },

    /**
     * Construct View
     * @param templatePath string
     * @return View
     */
    _constructView: function (templatePath) {
        return new (res.app.get('view'))(templatePath, {
            defaultEngine: res.app.get('view engine'),
            root: res.app.get('views'),
            engines: res.app.engines
        });
    },

    /**
     * Get View for Template Path
     * @param templatePath
     * @returns {*}
     */
    getView: function (templatePath) {
        // Construct View
        return this._constructView(this._resolveTemplatePath(templatePath));
    }
};

module.exports = TemplateHelper;