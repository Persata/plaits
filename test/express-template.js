'use strict';

var Plaits = require('../index');
var should = require('should');
var request = require('supertest');
var path = require('path');

// Spin Up App
var app = require('./express/server-template');

/**
 * RegisterForm Declaration
 */
var RegisterForm = Plaits.Model.extend({
    name: 'registerForm',
    fields: [
        'username'
    ],
    validators: {
        username: [
            Plaits.Validators.required(),
            Plaits.Validators.alpha()
        ]
    }
});

/**
 * Express Middleware Tests
 */
describe('Plaits Express Middleware HTML Template Helper', function () {

    /**
     * Middleware Test
     */
    it('should provide a middleware to attach html template render helper to res.locals', function (done) {
        // Add Test Route
        app.get('/test', function (req, res) {
            // Test
            should(res.locals).have.property('Plaits');
            should(res.locals.Plaits).have.property('Html');
            should(res.locals.Plaits.Html).have.property('Template');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/test').expect(200, done);
    });

    /**
     * Text Template Test
     */
    it('should generate a text field template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/text-field', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Set Value
            registerForm.set('username', 'Persata456');
            // Generate Template
            var text = res.locals.Plaits.Html.Template.text(registerForm, 'username');
            // Check
            text.should.equal('<div class="form-row"><label class="required req" for="registerForm_username">Username<span>*</span></label><input type="text" name="registerForm_username" value="Persata456" class="required req" id="registerForm_username" /></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/text-field').expect(200, done);
    });
});