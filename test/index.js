'use strict';

var Plaits = require('../index');
var should = require('should');

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
 * LoginForm Declaration Without Name
 */
var LoginFormWithoutName = Plaits.Model.extend({
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
 * LoginForm Declaration Without Labels
 */
var LoginFormWithoutLabels = Plaits.Model.extend({
    name: modelName,
    fields: [
        'email_address',
        'password'
    ],
    defaults: {
        email_address: 'persata@gmail.com'
    }
});

/**
 * LoginForm Declaration
 */
var LoginForm = Plaits.Model.extend({
    name: modelName,
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
 * Good Values to Test
 */
var goodValueRequestStub = {body: {loginForm_email_address: 'also_valid@example.com', loginForm_password: 'password456'}};

/**
 * Base Library Tests
 */
describe('Plaits', function () {

    /**
     * Extend Test
     */
    it('should have a model to extend', function (done) {
        Plaits.Model.extend.should.be.a.Function;
        done();
    });

    /**
     * Instance Test
     */
    it('should allow instances to be created with new', function (done) {
        var loginForm = new LoginForm();
        loginForm.attributes.should.be.an.Object;
        done();
    });

    /**
     * Name Error Test
     */
    it('should throw an error when trying to instantiate a new form without a name', function (done) {
        try {
            new LoginFormWithoutName();
        } catch (e) {
            e.should.have.property('message', 'You must specify a name for this Plaits form model');
            return done();
        }
        return done('No error thrown');
    });

    /**
     * Get Test
     */
    it('should allow get() to fetch attribute values', function (done) {
        var loginForm = new LoginForm();
        loginForm.get.should.be.a.function;
        loginForm.get('email_address').should.equal('persata@gmail.com');
        done();
    });

    /**
     * Defaults Test
     */
    it('should have defaults set from model declaration', function (done) {
        var loginForm = new LoginForm();
        var email_addressValue = loginForm.get('email_address');
        email_addressValue.should.equal('persata@gmail.com');
        done();
    });

    /**
     * Set Test
     */
    it('should allow set() to set attribute values', function (done) {
        var loginForm = new LoginForm();
        // Set
        loginForm.set({
            password: 'pass123'
        });
        // Get
        var passwordValue = loginForm.get('password');
        // Check Equal
        passwordValue.should.equal('pass123');
        done();
    });

    /**
     * Provided Labels Test
     */
    it('should have labels', function (done) {
        var loginForm = new LoginForm();
        loginForm.getLabelText('email_address').should.equal('Your Email Address');
        loginForm.getLabelText('password').should.equal('Your Password');
        done();
    });

    /**
     * Auto Generated Labels Test
     */
    it('should create humanised labels when not provided', function (done) {
        var loginForm = new LoginFormWithoutLabels();
        loginForm.getLabelText('email_address').should.equal('Email Address');
        loginForm.getLabelText('password').should.equal('Password');
        done();
    });

    /**
     * Field Identifier Test
     */
    it('should provide html id & name attributes for templates', function (done) {
        var loginForm = new LoginForm();
        loginForm.getFieldIdentifier('email_address').should.equal(modelName + '_' + 'email_address');
        loginForm.getFieldIdentifier('password').should.equal(modelName + '_' + 'password');
        done();
    });

    /**
     * Error on Absent Fields Test
     */
    it('should throw an error for fields that do not exist', function (done) {
        var loginForm = new LoginForm();
        try {
            loginForm.getFieldIdentifier('non_existent_field');
        } catch (e) {
            return done();
        }
        return done('Error not thrown!');
    });

    /**
     * Parse Sync Test
     */
    it('should parse request body and parameters synchronously when required', function (done) {
        var loginForm = new LoginForm().parseRequestSync(goodValueRequestStub);
        loginForm.get('email_address').should.equal('also_valid@example.com');
        loginForm.get('password').should.equal('password456');
        done();
    });

    /**
     * Parse Async Test
     */
    it('should parse request body and parameters asynchronously', function (done) {
        new LoginForm().parseRequest(goodValueRequestStub).then(function (loginForm) {
            loginForm.get('email_address').should.equal('also_valid@example.com');
            loginForm.get('password').should.equal('password456');
            done();
        });
    });
});