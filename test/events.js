'use strict';

// Plaits
var Plaits = require('../index');

// Promise
var Promise = require('bluebird');

/**
 * Model Name for Form Models
 * @type {string}
 */
var modelName = 'loginForm';

/**
 * Model Labels
 * @type {{email_address: string, password: string}}
 */
var modelLabels = {
    email_address: 'Your Email Address',
    password: 'Your Password'
};

/**
 * LoginForm Declaration
 */
var LoginFormSync = Plaits.Model.extend({
    name: modelName,
    initialize: function () {
        /**
         * Before Parse Event
         */
        this.on('beforeParseRequest', function (model, request) {
            // Example Modification To Email Address
            request.body.loginForm_email_address = 'modified_by_event@example.com';
        });

        /**
         * After Parse Event
         */
        this.on('afterParseRequest', function (model) {
            // Example Modification To Password
            model.set('password', 'modified_by_event_123');
        });

        /**
         * Before Validate Event
         */
        this.on('beforeValidate', function (model) {
            // Example Modification To Email Address
            model.set('email_address', 'modified_by_validation_event@example.com');
        });

        /**
         * Before Validate Event
         */
        this.on('beforeValidate', function (model) {
            // Example Modification To Password
            model.set('password', 'modified_by_validation_event_123');
        });
    },
    fields: [
        'email_address',
        'password'
    ],
    labels: modelLabels,
    defaults: {
        email_address: 'persata@gmail.com'
    }
});

/**
 * LoginForm Declaration
 */
var LoginForm = Plaits.Model.extend({
    name: modelName,
    initialize: function () {
        /**
         * Before Parse Event -> Sync
         */
        this.on('beforeParseRequest', function (model, request) {
            // Return Promise
            return Promise.bind(this).then(function () {
                request.body.loginForm_email_address = 'modified_by_event@example.com';
            });
        });

        /**
         * After Parse Event
         */
        this.on('afterParseRequest', function (model) {
            // Return Promise
            return Promise.bind(this).then(function () {
                // Example Modification To Email Address
                model.set('password', 'modified_by_event_123');
            });
        });

        /**
         * Before Validate Event
         */
        this.on('beforeValidate', function (model) {
            // Return Promise
            return Promise.bind(this).then(function () {
                model.set('email_address', 'modified_by_validation_event');
            });
        });

        /**
         * Before Validate Event
         */
        this.on('afterValidate', function (model, validationResult, validationErrors) {
            // Return Promise
            return Promise.bind(this).then(function () {
                // Test Event Arguments
                validationResult.should.equal(false);
                validationErrors.email_address.should.containEql('Your Email Address must be a valid email address.');
                // Example Modification To Email Address
                model.set('password', 'modified_by_validation_event_123');
            });
        });
    },
    fields: [
        'email_address',
        'password'
    ],
    labels: modelLabels,
    defaults: {
        email_address: 'persata@gmail.com'
    },
    validators: {
        email_address: Plaits.Validators.email()
    }
});

/**
 * Good Values to Test
 */
var goodValueRequestStub = {body: {loginForm_email_address: 'also_valid@example.com', loginForm_password: 'password456'}};

/**
 * Plaits Events Tests
 */
describe('Plaits Events', function () {
    it('should trigger events when parsing requests synchronously', function (done) {
        var loginForm = new LoginFormSync().parseRequestSync(goodValueRequestStub);
        loginForm.get('email_address').should.equal('modified_by_event@example.com');
        loginForm.get('password').should.equal('modified_by_event_123');
        done();
    });

    it('should trigger events when parsing requests asynchronously', function (done) {
        new LoginForm().parseRequest(goodValueRequestStub).then(function (loginForm) {
            loginForm.get('email_address').should.equal('modified_by_event@example.com');
            loginForm.get('password').should.equal('modified_by_event_123');
        }).then(done, done);
    });

    it('should trigger events when validating synchronously', function (done) {
        var loginForm = new LoginFormSync();
        loginForm.parseRequest(goodValueRequestStub).then(loginForm.validate.bind(loginForm)).then(function () {
            loginForm.get('email_address').should.equal('modified_by_validation_event@example.com');
        }).then(done, done);
    });

    it('should trigger events when validating asynchronously', function (done) {
        // New Form
        var loginForm = new LoginForm();
        // Parse & Validate Chain
        loginForm.parseRequest(goodValueRequestStub).then(loginForm.validate.bind(loginForm)).then(function (result) {
            // Should Be Invalid Because Of The Event
            result.should.equal(false);
            // Should Have An Email Error
            this.getErrors('email_address').should.containEql('Your Email Address must be a valid email address.');
        }).then(done, done);
    });
});