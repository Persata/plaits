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
        textField: function (model, attribute) {
            // Get Template
            var template = internals.getTemplate('textField', templatePaths);
            // Opts
            var locals = _.merge(res.locals, {
                model: model,
                attribute: attribute
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