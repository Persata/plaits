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
 * With Required
 */
var LoginFormRequired = LoginForm.extend({
    validators: {
        email_address: [
            Plaits.Validators.required(),
            Plaits.Validators.email()
        ]
    }
});

/**
 * With Required & Custom Error
 */
var LoginFormRequiredWithCustomError = LoginForm.extend({
    validators: {
        email_address: [
            Plaits.Validators.required('An {{label}} must be provided!'),
            Plaits.Validators.email()
        ]
    }
});

/**
 * Good Values to Test
 */
var requestStub = {body: {loginForm_email_address: '', loginForm_password: ''}};

/**
 * Plaits Required Tests
 */
describe('Plaits Required Validators', function () {

    /**
     * Required Not Specified
     */
    it('should allow empty values when the required option is not specified', function (done) {
        new LoginForm().parseRequestSync(requestStub).validate().then(function (result) {
            result.should.equal(true);
        }).then(done, done);
    });

    /**
     * Required Not Specified - Check
     */
    it('should report a field as not required if it is not required', function (done) {
        new LoginForm().isRequired('password').should.equal(false);
        done();
    });

    /**
     * Required Specified
     */
    it('should not allow empty values when the required option is specified', function (done) {
        new LoginFormRequired().parseRequestSync(requestStub).validate().then(function (result) {
            result.should.equal(false);
            this.getErrors('email_address').should.containEql('Email Address is a required field.');
        }).then(done, done);
    });

    /**
     * Required Specified With Custom Error Message
     */
    it('should not allow empty values when the required option is specified and return a custom error message', function (done) {
        new LoginFormRequiredWithCustomError().parseRequestSync(requestStub).validate().then(function (result) {
            result.should.equal(false);
            this.getErrors('email_address').should.containEql('An Email Address must be provided!');
        }).then(done, done);
    });
});