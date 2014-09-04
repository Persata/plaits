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
 * LoginForm Declaration - Synchronous, Automatic Error Messages
 */
var LoginFormSyncAutomaticErrorMessages = Plaits.Model.extend({
    name: modelName,
    fields: [
        'email_address',
        'password'
    ],
    labels: modelLabels,
    validators: modelValidatorsAutomaticErrorMessages
});

/**
 * LoginForm Declaration - Synchronous, Manual Error Messages
 */
var LoginFormSyncManualErrorMessages = LoginFormSyncAutomaticErrorMessages.extend({
    validators: modelValidatorsManualErrorMessages
});

/**
 * LoginForm Declaration - Synchronous, Custom Validation Functions
 */
var LoginFormSyncCustomValidationFunction = LoginFormSyncAutomaticErrorMessages.extend({
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
 * Good Values to Test
 */
var goodValueRequestStub = {body: {loginForm_email_address: 'also_valid@example.com', loginForm_password: 'password456'}};

/**
 * Bad Values To Test
 */
var badValueRequestStub = {body: {loginForm_email_address: 'notavalidemailaddress', loginForm_password: ''}};
var badValueRequestStubEmailInUse = {body: {loginForm_email_address: 'ross@persata.com', loginForm_password: ''}};

/**
 * Plaits Form Synchronous Validation Tests
 */
describe('Plaits Form Synchronous Validation', function () {
    it('should synchronously validate successfully with these values', function (done) {
        var validationResult = new LoginFormSyncAutomaticErrorMessages().parseRequestSync(goodValueRequestStub).validateSync();
        validationResult.should.equal(true);
        done();
    });

    it('should return invalid when validation synchronously with these values', function (done) {
        var validationResult = new LoginFormSyncAutomaticErrorMessages().parseRequestSync(badValueRequestStub).validateSync();
        validationResult.should.equal(false);
        done();
    });

    it('should provide error messages automatically when invalid values are given', function (done) {
        // New Form
        var loginForm = new LoginFormSyncAutomaticErrorMessages();
        // Get Validation Result
        var validationResult = loginForm.parseRequestSync(badValueRequestStub).validateSync();
        // Invalid
        validationResult.should.equal(false);
        // Get Error Messages
        var errorMessages = loginForm.getErrors();
        // Check
        errorMessages.email_address.should.containEql('Your Email Address must be a valid email address.');
        errorMessages.password.should.containEql('Your Password must be at least 6 characters long.');
        done();
    });

    it('should provide error messages that you set when invalid values are given', function (done) {
        // New Form
        var loginForm = new LoginFormSyncManualErrorMessages();
        // Get Validation Result
        var validationResult = loginForm.parseRequestSync(badValueRequestStub).validateSync();
        // Invalid
        validationResult.should.equal(false);
        // Get Error Messages
        var errorMessages = loginForm.getErrors();
        // Check
        errorMessages.email_address.should.containEql('Please provide a valid email address.');
        errorMessages.password.should.containEql('Your password has to be 6 characters or more!');
        done();
    });

    it('should allow custom validation functions to be defined', function (done) {
        // New Form
        var loginForm = new LoginFormSyncCustomValidationFunction();
        // Get Validation Result
        var validationResult = loginForm.parseRequestSync(badValueRequestStubEmailInUse).validateSync();
        // Invalid
        validationResult.should.equal(false);
        // Get Error Messages
        var errorMessages = loginForm.getErrors();
        // Check
        errorMessages.email_address.should.containEql('That email address is already in use!');
        done();
    });
});