'use strict';

// Plaits
var Plaits = require('../index');

// Promise
var Promise = require('bluebird');

/**
 * LoginForm Declaration
 */
var LoginForm = Plaits.Model.extend({
    name: 'loginForm',
    fields: [
        'email_address',
        'password',
        'avatar',
        'job_title'
    ],
    validators: {
        email_address: Plaits.Validators.email(),
        avatar: Plaits.Validators.File.maxSize('not-a-size'),
        job_title: [
            'notValidationFunction'
        ]
    }
});

/**
 * Plaits Required Tests
 */
describe('Plaits Exceptions', function () {

    /**
     * Throw Error on Missing Field
     */
    it('should throw an error if you attempt to get errors for a field that does not exist', function (done) {
        // New Form
        var loginForm = new LoginForm();

        // Try To Get Errors for Field
        (function () {
            loginForm.getErrors('email');
        }).should.throw("Field 'email' Not Found In Model 'loginForm'");

        // Try To Use hasErrors for Field
        (function () {
            loginForm.hasErrors('email');
        }).should.throw("Field 'email' Not Found In Model 'loginForm'");

        // Try To Use getFirstError for Field
        (function () {
            loginForm.getFirstError('email');
        }).should.throw("Field 'email' Not Found In Model 'loginForm'");

        // Done
        return done();
    });

    /**
     * Throw Error on File Size Validator
     */
    it('should throw an error if the size provided to the validator is not a valid size format', function (done) {
        // New Form
        var loginForm = new LoginForm();
        // Try To Validate
        try {
            loginForm.set('avatar', {});
            loginForm.validateSync();
        } catch (e) {
            e.message.should.equal('Unable to parse the maximum file size supplied - use either a number, or JEDEC denomination under 1TB, e.g. 2M, 120kB');
            return done();
        }
        return done('No Error Message Returned');
    });

    /**
     * Throw Error on Validator That Is Not a Function
     */
    it('should throw an error if a validator is not a function', function (done) {
        // New Form
        var loginForm = new LoginForm();

        // Try To Validate
        (function () {
            loginForm.validateSync();
        }).should.throw();

        // Async
        loginForm.validate().catch(function (e) {
            e.message.should.equal('Expected a function for validation of `job_title` on `loginForm` - got string');
        }).then(function () {
            // Done
            return done();
        });
    });

    /**
     * Throw Error on Length Validator Given Too Many Params
     */
    it('should throw an error if the length validator is given wrong parameters', function (done) {
        // Run Too Long
        (function () {
            Plaits.Validators.length(1, 2, 3, 'go!')();
        }).should.throw('Too many arguments specified for length validator.');
        // Run None
        (function () {
            Plaits.Validators.length()();
        }).should.throw('Not enough arguments specified for length validator - must specify at least one argument.');
        // Done
        return done();
    });
});