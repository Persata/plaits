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
        'password'
    ],
    validators: {
        email_address: Plaits.Validators.email()
    }
});

/**
 * Plaits Required Tests
 */
describe('Plaits Exceptions', function () {

    /**
     * Throw Error on Missing Field
     */
    it('should allow empty values when the required option is not specified', function (done) {
        // New Form
        var loginForm = new LoginForm();
        // Try To Get Errors for Field
        try {
            loginForm.getErrors('email');
        } catch (e) {
            e.message.should.equal("Field 'email' Not Found In Model 'loginForm'");
            return done();
        }
        return done('No Error Message Returned');
    });
});