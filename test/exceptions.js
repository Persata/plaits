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
        }).should.throw();

        // Try To Use hasErrors for Field
        (function () {
            loginForm.hasErrors('email');
        }).should.throw();
        // Done
        return done();
    });

    /**
     * Throw Error on File Size Validator
     */
    it('should throw an', function (done) {
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
});