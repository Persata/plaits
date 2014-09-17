'use strict';

// Lodash
var _ = require('lodash');

// Helper Options
var helperOptions = {
    renderSpecialAttributesValue: true,
    errorCssClass: 'error',
    requiredCssClass: 'required',
    errorContainerTag: 'div',
    errorContainerClass: 'error-message',
    errorSummaryContainerClass: 'error-summary',
    errorSummaryText: 'Please fix the following validation errors:'
};

/**
 * Plaits Html Helper
 * @type {Function}
 */
var PlaitsHtml = function (options) {

    // Merge Helper Options
    helperOptions = _.merge(helperOptions, options);

    /**
     * Return Html Helper
     */
    return {

        /**
         * Render a General Button
         * @param label
         * @param htmlAttributes
         * @returns {*}
         */
        button: function (label, htmlAttributes) {
            // Attributes
            htmlAttributes = htmlAttributes || {};
            // Check Type
            if (!(htmlAttributes.type)) {
                htmlAttributes.type = 'button';
            }
            // Value?
            if (!htmlAttributes.value && htmlAttributes.type !== 'image') {
                htmlAttributes.value = label;
            }
            // Return Input
            return internals.tag('input', htmlAttributes);
        },

        /**
         * Render a Reset Button
         * @param text string
         * @param [htmlAttributes] Object
         */
        resetButton: function (text, htmlAttributes) {
            htmlAttributes = htmlAttributes || {};
            htmlAttributes.type = 'reset';
            return this.button(text, htmlAttributes);
        },

        /**
         * Render a Submit Button
         * @param text string
         * @param [htmlAttributes] Object
         */
        submitButton: function (text, htmlAttributes) {
            htmlAttributes = htmlAttributes || {};
            htmlAttributes.type = 'submit';
            return this.button(text, htmlAttributes);
        },

        /**
         * Generate a Label for an Input
         * @param model
         * @param attribute
         * @param [htmlAttributes]
         */
        labelFor: function (model, attribute, htmlAttributes) {
            // Html Attributes
            htmlAttributes = htmlAttributes || {};
            // Label Text
            var labelText = model.getLabelText(attribute);
            // Required?
            if (model.isRequired(attribute)) {
                // Add Class
                htmlAttributes = internals.addRequiredCss(htmlAttributes);
                // Also Add Required Asterisk To Content
                labelText += '<span>*</span>';
            }
            // Errors?
            if (model.hasErrors(attribute)) {
                htmlAttributes = internals.addErrorCss(htmlAttributes);
            }
            // For
            htmlAttributes.for = model.getFieldIdentifier(attribute);
            // Generate Label
            return internals.tag('label', htmlAttributes, labelText);
        },

        /**
         * Generate An Error Container For The Model's Attribute.
         * Shows the first error for a model's attribute.
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         */
        firstErrorFor: function (model, attribute, htmlAttributes) {
            // Html Attributes
            htmlAttributes = htmlAttributes || {};
            // Get First Error
            var firstError = model.getFirstError(attribute);
            // Error?
            if (firstError === '') {
                return '';
            } else {
                // Class?
                if (!htmlAttributes.class) {
                    htmlAttributes.class = helperOptions.errorContainerClass;
                }
                // Generate & Return
                return internals.tag(helperOptions.errorContainerTag, htmlAttributes, firstError);
            }
        },

        /**
         * Generate A Container With All Errors For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         */
        errorsFor: function (model, attribute, htmlAttributes) {
            // Html Attributes
            htmlAttributes = htmlAttributes || {};
            // Has Errors?
            if (model.hasErrors(attribute)) {
                // Class?
                if (!htmlAttributes.class) {
                    htmlAttributes.class = helperOptions.errorSummaryContainerClass;
                }
                // Error List
                var errorList = [];
                // Iterate
                _.forEach(model.getErrors(attribute), function (item) {
                    errorList.push(
                        internals.tag('li', {}, item)
                    );
                });
                // Generate & Return
                return internals.tag(helperOptions.errorContainerTag, htmlAttributes, '\n' + internals.tag('ul', {}, '\n' + errorList.join('\n') + '\n') + '\n');
            } else {
                return '';
            }
        },

        errorSummary: function (model, summaryText, htmlAttributes) {
            // Html Attributes
            htmlAttributes = htmlAttributes || {};
            // Summary Text
            summaryText = summaryText || helperOptions.errorSummaryText;
            // Has Errors?
            if (model.hasErrors()) {
                // Class?
                if (!htmlAttributes.class) {
                    htmlAttributes.class = helperOptions.errorSummaryContainerClass;
                }
                // Header Tag
                var headerTag = internals.tag('p', {}, summaryText);
                // Error List
                var errorList = [];
                // Iterate
                _.forOwn(model.getErrors(), function (fieldErrors) {
                    _.forEach(fieldErrors, function (item) {
                        errorList.push(
                            internals.tag('li', {}, item)
                        );
                    });
                });
                // Generate & Return
                return internals.tag(helperOptions.errorContainerTag, htmlAttributes, '\n' + headerTag + '\n' + internals.tag('ul', {}, '\n' + errorList.join('\n') + '\n') + '\n');
            } else {
                return '';
            }
        },

        /**
         * Render a Text Input For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        textFieldFor: function (model, attribute, htmlAttributes) {
            return internals.inputField('text', model, attribute, htmlAttributes);
        },

        /**
         * Render an Email Input For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        emailFieldFor: function (model, attribute, htmlAttributes) {
            return internals.inputField('email', model, attribute, htmlAttributes);
        },

        /**
         * Render a Text Area For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        textAreaFor: function (model, attribute, htmlAttributes) {
            // Build Html Attributes
            htmlAttributes = htmlAttributes || {};
            htmlAttributes.name = model.getFieldIdentifier(attribute);
            // Check for ID, provide one if not given
            if (!htmlAttributes.id) {
                htmlAttributes.id = htmlAttributes.name;
            }
            // Render & Return
            return internals.tag('textarea', htmlAttributes, (model.get(attribute) === undefined) ? '' : model.get(attribute));
        },

        /**
         * Number Field For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        numberFieldFor: function (model, attribute, htmlAttributes) {
            return internals.inputField('number', model, attribute, htmlAttributes);
        },

        /**
         * Range Field For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        rangeFieldFor: function (model, attribute, htmlAttributes) {
            return internals.inputField('range', model, attribute, htmlAttributes);
        },

        /**
         * Color Field For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        colorFieldFor: function (model, attribute, htmlAttributes) {
            return internals.inputField('color', model, attribute, htmlAttributes);
        },

        /**
         * Search Field For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        searchFieldFor: function (model, attribute, htmlAttributes) {
            return internals.inputField('search', model, attribute, htmlAttributes);
        },

        /**
         * Date Field For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        dateFieldFor: function (model, attribute, htmlAttributes) {
            return internals.inputField('date', model, attribute, htmlAttributes);
        },

        /**
         * Time Field For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        timeFieldFor: function (model, attribute, htmlAttributes) {
            return internals.inputField('time', model, attribute, htmlAttributes);
        },

        /**
         * Tel Field For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        telFieldFor: function (model, attribute, htmlAttributes) {
            return internals.inputField('tel', model, attribute, htmlAttributes);
        },

        /**
         * Url Field For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        urlFieldFor: function (model, attribute, htmlAttributes) {
            return internals.inputField('url', model, attribute, htmlAttributes);
        },

        /**
         * Hidden Field For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        hiddenFieldFor: function (model, attribute, htmlAttributes) {
            return internals.inputField('hidden', model, attribute, htmlAttributes);
        },

        /**
         * Password Field For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        passwordFieldFor: function (model, attribute, htmlAttributes) {
            return internals.inputField('password', model, attribute, htmlAttributes);
        },

        /**
         * File Field For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        fileFieldFor: function (model, attribute, htmlAttributes) {
            return internals.inputField('file', model, attribute, htmlAttributes);
        },

        /**
         * Select Input For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param items Object
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        selectFor: function (model, attribute, items, htmlAttributes) {
            // Attributes
            htmlAttributes = htmlAttributes || {};
            // Build HTML Attributes
            htmlAttributes.name = model.getFieldIdentifier(attribute);
            // Required?
            if (model.isRequired(attribute)) {
                htmlAttributes = internals.addRequiredCss(htmlAttributes);
            }
            // Errors?
            if (model.hasErrors(attribute)) {
                htmlAttributes = internals.addErrorCss(htmlAttributes);
            }
            // Check for ID, provide one if not given
            if (!htmlAttributes.id) {
                htmlAttributes.id = htmlAttributes.name;
            }
            // Get Value
            var selectValue = model.get(attribute);
            // Build Options
            var selectOptions = internals.renderSelectOptions(selectValue, items);
            // Multiple
            if (htmlAttributes.multiple && !htmlAttributes.size) {
                htmlAttributes.size = 4;
            }
            // Build Tag & Return
            return internals.tag('select', htmlAttributes, '\n' + selectOptions + '\n');
        },

        /**
         * Single Checkbox For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        checkboxFor: function (model, attribute, htmlAttributes) {
            // Attributes
            htmlAttributes = htmlAttributes || {};
            // Value?
            if (!htmlAttributes.value) {
                htmlAttributes.value = 1;
            }
            // Checked?
            /* jshint ignore:start */
            if (typeof htmlAttributes.checked === 'undefined' && model.get(attribute) == htmlAttributes.value) {
                htmlAttributes.checked = 'checked';
            }
            /* jshint ignore:end */
            // Generate
            return internals.inputField('checkbox', model, attribute, htmlAttributes);
        },

        /**
         * Single Radio Button For The Model's Attribute
         * @param model PlaitsModel
         * @param attribute string
         * @param [htmlAttributes] Object
         * @returns {string}
         */
        radioFor: function (model, attribute, htmlAttributes) {
            // Attributes
            htmlAttributes = htmlAttributes || {};
            // Value?
            if (!htmlAttributes.value) {
                htmlAttributes.value = 1;
            }
            // Checked?
            /* jshint ignore:start */
            if (typeof htmlAttributes.checked === 'undefined' && model.get(attribute) == htmlAttributes.value) {
                htmlAttributes.checked = 'checked';
            }
            /* jshint ignore:end */
            // Generate
            return internals.inputField('radio', model, attribute, htmlAttributes);
        }
    };
};

/**
 * Internals
 * @see https://github.com/yiisoft/yii/blob/1.1.15/framework/web/helpers/CHtml.php
 * @see https://github.com/yiisoft/yii2/blob/master/framework/helpers/BaseHtml.php
 * @type {*}
 */
var internals = {

    /**
     * Special Attributes
     */
    specialAttributes: [
        'async',
        'autofocus',
        'autoplay',
        'checked',
        'controls',
        'declare',
        'default',
        'defer',
        'disabled',
        'formnovalidate',
        'hidden',
        'ismap',
        'loop',
        'multiple',
        'muted',
        'nohref',
        'noresize',
        'novalidate',
        'open',
        'readonly',
        'required',
        'reversed',
        'scoped',
        'seamless',
        'selected',
        'typemustmatch'
    ],

    /**
     * Encode Html Value
     * @param value
     */
    encode: function (value) {
        return _.escape(value);
    },

    /**
     * Render HTML Attributes To String
     * @param htmlAttributes
     * @returns {string}
     */
    renderHtmlAttributes: function (htmlAttributes) {
        // Empty String
        var html = '';

        // Iterate Over Attributes
        _.forOwn(htmlAttributes, function (value, attribute) {
            // Special Value?
            if (_.contains(this.specialAttributes, attribute)) {
                // Value Set?
                if (value) {
                    html += ' ' + attribute;
                    if (helperOptions.renderSpecialAttributesValue === true) {
                        html += '="' + attribute + '"';
                    }
                }
            } else if (value !== null) {
                html += ' ' + attribute + '="' + (this.encode(value)) + '"';
            }
        }, this);

        // Return Html
        return html;
    },

    /**
     * Return Tag
     * @param tagType string
     * @param htmlAttributes Object
     * @param [closeTag]
     * @param [content]
     * @returns {string}
     */
    tag: function (tagType, htmlAttributes, content, closeTag) {
        // Close Tag
        closeTag = closeTag !== false;
        // Content
        content = content === undefined ? false : content;
        // Build & Return
        var html = '<' + tagType + this.renderHtmlAttributes(htmlAttributes);
        // Content or Not?
        if (content === false) {
            return html + ' />';
        } else {
            return closeTag ? html + '>' + content + '</' + tagType + '>' : html + '>' + content;
        }

    },

    /**
     * Render an Input Field of Specified Type
     * @param inputType string
     * @param model PlaitsModel
     * @param attribute string
     * @param htmlAttributes Object
     * @return string
     */
    inputField: function (inputType, model, attribute, htmlAttributes) {
        // Build Html Attributes
        htmlAttributes = htmlAttributes || {};
        htmlAttributes.type = inputType;
        htmlAttributes.name = model.getFieldIdentifier(attribute);
        // Value already set by other function?
        if (!htmlAttributes.value) {
            htmlAttributes.value = model.get(attribute);
        }
        // Required?
        if (model.isRequired(attribute)) {
            htmlAttributes = this.addRequiredCss(htmlAttributes);
        }
        // Errors?
        if (model.hasErrors(attribute)) {
            htmlAttributes = this.addErrorCss(htmlAttributes);
        }
        // Check for ID, provide one if not given
        if (!htmlAttributes.id) {
            htmlAttributes.id = htmlAttributes.name;
        }
        // Return Tag
        return this.tag('input', htmlAttributes);
    },

    /**
     * Add Require CSS Class
     * @param htmlAttributes
     * @returns {*}
     */
    addRequiredCss: function (htmlAttributes) {
        // Add Class Where Appropriate
        if (htmlAttributes.class) {
            htmlAttributes.class = htmlAttributes.class + ' ' + helperOptions.requiredCssClass;
        } else {
            htmlAttributes.class = helperOptions.requiredCssClass;
        }
        // Return
        return htmlAttributes;
    },

    /**
     * Add Error CSS Class
     * @param htmlAttributes
     * @returns {*}
     */
    addErrorCss: function (htmlAttributes) {
        // Add Class Where Appropriate
        if (htmlAttributes.class) {
            htmlAttributes.class = htmlAttributes.class + ' ' + helperOptions.errorCssClass;
        } else {
            htmlAttributes.class = helperOptions.errorCssClass;
        }
        // Return
        return htmlAttributes;
    },

    /**
     * Render Select Options to HTML
     * @param selectedValue Object
     * @param items Object
     */
    renderSelectOptions: function (selectedValue, items) {
        // Lines
        var lines = [];

        // Empty Option? Put that first
        if (items[null]) {
            // Add Item
            lines.push(
                this.tag('option', {value: ''}, items[null])
            );
        } else if (items[undefined]) {
            // Add Item
            lines.push(
                this.tag('option', {value: ''}, items[undefined])
            );
        }

        // Omit Null and Undefined
        items = _.omit(items, ['null', 'undefined']);

        // Iterate Over Items
        _.forOwn(items, function (text, value) {
            // Attributes
            var htmlAttributes = {
                value: value
            };
            // Check Value
            if (selectedValue && selectedValue.toString() === value) {
                htmlAttributes.selected = 'selected';
            }
            // Push Onto Array
            lines.push(
                this.tag('option', htmlAttributes, text)
            );
        }, this);

        // Return
        return lines.join('\n');
    }
};

module.exports = PlaitsHtml;