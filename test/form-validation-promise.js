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
 * Model Validators
 * @type {{email_address: *[]}}
 */
var modelValidatorsAutomaticErrorMessages = {
    email_address: [
        Plaits.Validators.email(),
        Plaits.Validators.required()
    ],
    password: [
        Plaits.Validators.minLength(6),
        Plaits.Validators.maxLength(18)
    ]
};

/**
 * Model Validators
 * @type {{email_address: *[]}}
 */
var modelValidatorsManualErrorMessages = {
    email_address: [
        Plaits.Validators.email('Please provide a valid email address.'),
        Plaits.Validators.required('Please provide an email address.')
    ],
    password: [
        Plaits.Validators.minLength(6, 'Your password has to be {{minLength}} characters or more!'),
        Plaits.Validators.maxLength(18, 'You cannot have a password longer than 18 characters!')
    ]
};

/**
 * Model Labels
 * @type {{email_address: string, password: string}}
 */
var modelLabels = {
    email_address: 'Your Email Address',
    password: 'Your Password'
};

/**
 * LoginForm Declaration - Asynchronous, Automatic Error Messages
 */
var LoginFormAsyncAutomaticErrorMessages = Plaits.Model.extend({
    name: modelName,
    fields: [
        'email_address',
        'password'
    ],
    labels: modelLabels,
    validators: modelValidatorsAutomaticErrorMessages
});

/**
 * LoginForm Declaration - Asynchronous, Manual Error Messages
 */
var LoginFormAsyncManualErrorMessages = LoginFormAsyncAutomaticErrorMessages.extend({
    validators: modelValidatorsManualErrorMessages
});

/**
 * LoginForm Declaration - Asynchronous, Custom Validation Functions
 */
var LoginFormAsyncCustomValidationFunction = LoginFormAsyncAutomaticErrorMessages.extend({
    validators: {
        email_address: [
            function (value) {
                if (value === 'ross@persata.com') {
                    return 'That email address is already in use!';
                } else {
                    return true;
                }
            }
        ]
    }
});

/**
 * LoginForm Declaration - Asynchronous, Custom Validation Functions
 */
var LoginFormAsyncPromiseCustomValidationFunction = LoginFormAsyncAutomaticErrorMessages.extend({
    validators: {
        password: [
            function (value, label) {
                return new Promise(function (resolve) {
                    // Compare
                    if (value === '!') {
                        return resolve(label + ' cannot just be an exclamation mark!');
                    } else {
                        return resolve(true);
                    }
                });
            }
        ]
    }
});

/**
 * Good Values to Test
 */
var goodValueRequestStub = {body: {loginForm_email_address: 'also_valid@example.com', loginForm_password: 'password456'}};

/**
 * Bad Values To Test
 */
var badValueRequestStub = {body: {loginForm_email_address: 'notavalidemailaddress', loginForm_password: 'p123'}};
var badValueRequestStubEmailInUse = {body: {loginForm_email_address: 'ross@persata.com', loginForm_password: ''}};
var badValueRequestStubPassword = {body: {loginForm_email_address: 'ross@persata.com', loginForm_password: '!'}};

/**
 * Plaits Form Synchronous Validation Tests
 */
describe('Plaits Form Promise Validation', function () {
    it('should asynchronously validate successfully with these values', function (done) {
        // Form
        var loginForm = new LoginFormAsyncAutomaticErrorMessages();
        // Parse & Validate Chain
        loginForm.parseRequest(goodValueRequestStub).then(loginForm.validate.bind(loginForm)).then(function (validationResult) {
            validationResult.should.equal(true);
        }).then(done).catch(done);
    });

    it('should return invalid when validation asynchronously with these values', function (done) {
        // Form
        var loginForm = new LoginFormAsyncAutomaticErrorMessages();
        // Parse & Validate Chain
        loginForm.parseRequest(badValueRequestStub).then(loginForm.validate.bind(loginForm)).then(function (validationResult) {
            validationResult.should.equal(false);
        }).then(done).catch(done);
    });

    it('should provide error messages automatically when invalid values are given', function (done) {
        // New Form
        var loginForm = new LoginFormAsyncAutomaticErrorMessages();
        // Parse & Validate Chain
        loginForm.parseRequest(badValueRequestStub).then(loginForm.validate.bind(loginForm)).then(function (validationResult) {
            // Invalid
            validationResult.should.equal(false);
            // Get Error Messages
            var errorMessages = loginForm.getErrors();
            // Check
            errorMessages.email_address.should.containEql('Your Email Address must be a valid email address.');
            errorMessages.password.should.containEql('Your Password must be at least 6 characters long.');
        }).then(done).catch(done);
    });

    it('should provide error messages that you set when invalid values are given', function (done) {
        // New Form
        var loginForm = new LoginFormAsyncManualErrorMessages();
        // Parse & Validate Chain
        loginForm.parseRequest(badValueRequestStub).then(loginForm.validate.bind(loginForm)).then(function (validationResult) {
            // Invalid
            validationResult.should.equal(false);
            // Get Error Messages
            var errorMessages = loginForm.getErrors();
            // Check
            errorMessages.email_address.should.containEql('Please provide a valid email address.');
            errorMessages.password.should.containEql('Your password has to be 6 characters or more!');
        }).then(done).catch(done);
    });

    it('should allow custom validation functions to be defined', function (done) {
        // New Form
        var loginForm = new LoginFormAsyncCustomValidationFunction();
        // Parse & Validate Chain
        loginForm.parseRequest(badValueRequestStubEmailInUse).then(loginForm.validate.bind(loginForm)).then(function (validationResult) {
            // Invalid
            validationResult.should.equal(false);
            // Get Error Messages
            var errorMessages = loginForm.getErrors();
            // Check
            errorMessages.email_address.should.containEql('That email address is already in use!');
        }).then(done).catch(done);
    });

    it('should allow custom validation functions to be defined that are promise based functions', function (done) {
        // New Form
        var loginForm = new LoginFormAsyncPromiseCustomValidationFunction();
        // Parse & Validate Chain
        loginForm.parseRequest(badValueRequestStubPassword).then(loginForm.validate.bind(loginForm)).then(function (validationResult) {
            // Invalid
            validationResult.should.equal(false);
            // Get Error Messages
            var errorMessages = loginForm.getErrors();
            // Check
            errorMessages.password.should.containEql('Your Password cannot just be an exclamation mark!');
        }).then(done).catch(done);
    });
});