'use strict';

// Lodash
var _ = require('lodash');

// Jade
var jade = require('jade');

/**
 * Template Helper
 * @param res
 * @param templatePaths
 * @return {{textField: Function}}
 * @constructor
 */
var TemplateHelper = function (res, templatePaths) {
    return {
        /**
         * Generate Text Field Template
         * @param model
         * @param attribute
         * @returns {*}
         */
        text: function (model, attribute) {
            // Get Template
            var template = internals.getTemplate('text', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute
            });
            // Render
            return template(locals);
        },

        /**
         * Render Email Field Template
         * @param model PlaitsModel
         * @param attribute string
         * @returns {string}
         */
        email: function (model, attribute) {
            // Get Template
            var template = internals.getTemplate('email', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute
            });
            // Render
            return template(locals);
        },

        /**
         * Render Text Area Template
         * @param model PlaitsModel
         * @param attribute string
         * @returns {string}
         */
        textArea: function (model, attribute) {
            // Get Template
            var template = internals.getTemplate('textArea', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute
            });
            // Render
            return template(locals);
        },

        /**
         * Number Template
         * @param model PlaitsModel
         * @param attribute string
         * @returns {string}
         */
        number: function (model, attribute) {
            // Get Template
            var template = internals.getTemplate('number', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute
            });
            // Render
            return template(locals);
        },

        /**
         * Range Template
         * @param model PlaitsModel
         * @param attribute string
         * @returns {string}
         */
        range: function (model, attribute) {
            // Get Template
            var template = internals.getTemplate('range', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute
            });
            // Render
            return template(locals);
        },

        /**
         * Color Template
         * @param model PlaitsModel
         * @param attribute string
         * @returns {string}
         */
        color: function (model, attribute) {
            // Get Template
            var template = internals.getTemplate('color', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute
            });
            // Render
            return template(locals);
        },

        /**
         * Search Template
         * @param model PlaitsModel
         * @param attribute string
         * @returns {string}
         */
        search: function (model, attribute) {
            // Get Template
            var template = internals.getTemplate('search', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute
            });
            // Render
            return template(locals);
        },

        /**
         * Date Template
         * @param model PlaitsModel
         * @param attribute string
         * @returns {string}
         */
        date: function (model, attribute) {
            // Get Template
            var template = internals.getTemplate('date', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute
            });
            // Render
            return template(locals);
        },

        /**
         * Time Template
         * @param model PlaitsModel
         * @param attribute string
         * @returns {string}
         */
        time: function (model, attribute) {
            // Get Template
            var template = internals.getTemplate('time', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute
            });
            // Render
            return template(locals);
        },

        /**
         * Tel Template
         * @param model PlaitsModel
         * @param attribute string

         * @returns {string}
         */
        tel: function (model, attribute) {
            // Get Template
            var template = internals.getTemplate('tel', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute
            });
            // Render
            return template(locals);
        },

        /**
         * Url Template
         * @param model PlaitsModel
         * @param attribute string
         * @returns {string}
         */
        url: function (model, attribute) {
            // Get Template
            var template = internals.getTemplate('url', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute
            });
            // Render
            return template(locals);
        },

        /**
         * Password Template
         * @param model PlaitsModel
         * @param attribute string
         * @returns {string}
         */
        password: function (model, attribute) {
            // Get Template
            var template = internals.getTemplate('password', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute
            });
            // Render
            return template(locals);
        },

        /**
         * File Template
         * @param model PlaitsModel
         * @param attribute string
         * @returns {string}
         */
        file: function (model, attribute) {
            // Get Template
            var template = internals.getTemplate('file', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute
            });
            // Render
            return template(locals);
        },

        /**
         * Select Template
         * @param model PlaitsModel
         * @param attribute string
         * @param items Object
         * @returns {string}
         */
        select: function (model, attribute, items) {
            // Get Template
            var template = internals.getTemplate('textArea', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute,
                items: items
            });
            // Render
            return template(locals);
        },

        /**
         * Single Checkbox For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @returns {string}
         */
        checkbox: function (model, attribute) {
            // Get Template
            var template = internals.getTemplate('checkbox', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute
            });
            // Render
            return template(locals);
        },

        /**
         * Single Radio Button For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @returns {string}
         */
        radio: function (model, attribute) {
            // Get Template
            var template = internals.getTemplate('radio', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute
            });
            // Render
            return template(locals);
        },

        /**
         * Generate a Checkbox List for a Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param items Object
         * @return {string}
         */
        checkboxList: function (model, attribute, items) {
            // Get Template
            var template = internals.getTemplate('checkboxList', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute,
                items: items
            });
            // Render
            return template(locals);
        },

        /**
         * Generate a Radio List for a Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param items Object
         * @return {string}
         */
        radioList: function (model, attribute, items) {
            // Get Template
            var template = internals.getTemplate('radioList', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute,
                items: items
            });
            // Render
            return template(locals);
        }
    };
};

/**
 * Template Helper Internals
 * @type {{}}
 */
var internals = {

    /**
     * Compiled Templates
     */
    _compiledTemplates: {},

    /**
     * Get Template
     * @param templateName
     * @param templatePaths
     * @return {*}
     */
    getTemplate: function (templateName, templatePaths) {
        // Check View Cache
        if (this._compiledTemplates[templateName]) {
            return this._compiledTemplates[templateName];
        } else {
            // No Match, Check Path
            if (templatePaths[templateName]) {
                // Get Template
                var template = templatePaths[templateName];
                // Compile & Cache
                this._compiledTemplates[templateName] = jade.compileFile(template);
                // Return
                return this._compiledTemplates[templateName];
            } else {
                // Throw Error
                throw new Error('Unable to find suitable Plaits template for ' + templateName + ' in any path.');
            }
        }
    }
};

module.exports = TemplateHelper;