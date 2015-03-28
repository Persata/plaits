'use strict';

// Plaits
var Plaits = require('../index');

// Promise
var Promise = require('bluebird');

/**
 * ProfileForm Declaration
 */
var ProfileForm = Plaits.Model.extend({
    name: 'profileForm',
    fields: [
        'avatar'
    ],
    validators: {
        avatar: [
            Plaits.Validators.File.required(),
            Plaits.Validators.File.minSize('100kB'),
            Plaits.Validators.File.maxSize(200 * 1024),
            Plaits.Validators.File.mimeTypes([
                'image/jpg',
                'image/jpeg',
                'image/png',
                'image/gif'
            ])
        ]
    }
});

/**
 * Profile Form with Wildcard Regex
 */
var ProfileFormWildCardRegex = ProfileForm.extend({
    validators: {
        avatar: [
            Plaits.Validators.File.required(),
            Plaits.Validators.File.minSize('100kB'),
            Plaits.Validators.File.maxSize('200kB'),
            Plaits.Validators.File.mimeTypes('image/*')
        ]
    }
});

/**
 * Profile Form with Enforced MIME Type Matching
 */
var ProfileFormEnforceMimeType = ProfileForm.extend({
    validators: {
        avatar: [
            Plaits.Validators.File.required(),
            Plaits.Validators.File.enforceMimeMatch()
        ]
    }
});

/**
 * File Upload Good Values
 */
var fileGoodValuesRequestStub = {files: {profileForm_avatar: {name: 'me.jpg', originalFilename: 'me.jpg', path: '/var/tmp/9911-lpnc4.jpg', size: 162258, type: 'image/png'}}};
var fileGoodValuesRequestStubCorrectMimeInspect = {files: {profileForm_avatar: {name: 'plaits.png', originalFilename: 'plaits.png', path: 'test/files/plaits.png', size: 166258, type: 'image/png'}}};

/**
 * File Upload Bad Values
 */
var filesBadValueRequestStubNoFile = {files: {profileForm_avatar: {name: '', originalFilename: '', path: '/var/tmp/', size: 0, type: 'application/octet-stream'}}};
var filesBadValueRequestStubTooSmall = {files: {profileForm_avatar: {name: 'me.jpg', originalFilename: 'me.jpg', path: '/var/tmp/9911-lpnc4.jpg', size: 66258, type: 'image/jpeg'}}};
var filesBadValueRequestStubTooLarge = {files: {profileForm_avatar: {name: 'me.jpg', originalFilename: 'me.jpg', path: '/var/tmp/9911-lpnc4.jpg', size: 3145728, type: 'image/jpeg'}}};
var filesBadValueRequestStubInvalidType = {files: {profileForm_avatar: {name: 'you.zip', originalFilename: 'you.zip', path: '/var/tmp/9911-lpnc5.zip', size: 166258, type: 'application/zip'}}};
var fileGoodValuesRequestStubIncorrectMimeInspect = {files: {profileForm_avatar: {name: 'plaits.jpg', originalFilename: 'plaits.jpg', path: 'test/files/plaits.jpg', size: 166258, type: 'image/jpeg'}}};

/**
 * File Upload Reject Promise
 */
var fileGoodValuesRequestStubPromiseReject = {files: {profileForm_avatar: {name: 'plaits-logo.jpg', originalFilename: 'plaits-logo.jpg', path: 'test/files/plaits-logo.jpg', size: 166258, type: 'image/jpeg'}}};

/**
 * Before Each -> Set File Field Mappings to Default
 */
beforeEach(function (done) {
    // Set Default Mappings
    Plaits.setValidatorConfig({fileFieldMappings: Plaits.FileFieldMappings.Default});
    // Done
    done();
});

/**
 * Plaits File Tests
 */
describe('Plaits File Validators', function () {

    /**
     * Required - Valid
     */
    it('should validate good required file uploads', function (done) {
        new ProfileForm().parseRequestSync(fileGoodValuesRequestStub).validate().then(function (result) {
            // Check Result
            result.should.equal(true);
        }).then(done, done);
    });

    /**
     * Required - Invalid
     */
    it('should invalidate bad required file uploads', function (done) {
        new ProfileForm().parseRequestSync(filesBadValueRequestStubNoFile).validate().then(function (result) {
            // Check Result
            result.should.equal(false);
            // Check Error
            this.getErrors('avatar').should.containEql('Avatar is a required field.');
        }).then(done, done);
    });

    /**
     * Min Size - Valid
     */
    it('should validate good minimum size on file uploads', function (done) {
        new ProfileForm().parseRequestSync(fileGoodValuesRequestStub).validate().then(function (result) {
            // Check Result
            result.should.equal(true);
        }).then(done, done);
    });

    /**
     * Min Size - Invalid
     */
    it('should invalidate bad minimum size on file uploads', function (done) {
        new ProfileForm().parseRequestSync(filesBadValueRequestStubTooSmall).validate().then(function (result) {
            // Check Result
            result.should.equal(false);
            // Error Message
            this.getErrors('avatar').should.containEql('Avatar must be at least 100kB.');
        }).then(done, done);
    });

    /**
     * Max Size - Valid
     */
    it('should validate good maximum size on file uploads', function (done) {
        new ProfileForm().parseRequestSync(fileGoodValuesRequestStub).validate().then(function (result) {
            // Check Result
            result.should.equal(true);
        }).then(done, done);
    });

    /**
     * Max Size - Invalid
     */
    it('should invalidate bad maximum size on file uploads', function (done) {
        new ProfileForm().parseRequestSync(filesBadValueRequestStubTooLarge).validate().then(function (result) {
            // Check Result
            result.should.equal(false);
            // Error Message
            this.getErrors('avatar').should.containEql('Avatar must be smaller than 200kB.');
        }).then(done, done);
    });

    /**
     * Mime Type - Valid
     */
    it('should validate good mime types on file uploads', function (done) {
        new ProfileForm().parseRequestSync(fileGoodValuesRequestStub).validate().then(function (result) {
            // Check Result
            result.should.equal(true);
        }).then(done, done);
    });

    /**
     * Mime Type - Invalid
     */
    it('should invalidate bad mime types on file uploads', function (done) {
        new ProfileForm().parseRequestSync(filesBadValueRequestStubInvalidType).validate().then(function (result) {
            // Check Result
            result.should.equal(false);
            // Check Error
            this.getErrors('avatar').should.containEql('Avatar must be one of the following file types: image/jpg, image/jpeg, image/png, image/gif.');
        }).then(done, done);
    });

    /**
     * Mime Type Wildcard - Valid
     */
    it('should validate good mime types on file uploads when a wildcard regex is given', function (done) {
        new ProfileFormWildCardRegex().parseRequestSync(fileGoodValuesRequestStub).validate().then(function (result) {
            // Check Result
            result.should.equal(true);
        }).then(done, done);
    });

    /**
     * Mime Type Wildcard - Invalid
     */
    it('should invalidate bad mime types on file uploads when a wildcard regex is given', function (done) {
        new ProfileFormWildCardRegex().parseRequestSync(filesBadValueRequestStubInvalidType).validate().then(function (result) {
            // Check Result
            result.should.equal(false);
            // Check Error
            this.getErrors('avatar').should.containEql('Avatar must be one of the following file types: image/*.');
        }).then(done, done);
    });

    /**
     * Enforce MIME Match - Valid
     */
    it('should validate good mime matches on file uploads', function (done) {
        new ProfileFormEnforceMimeType().parseRequestSync(fileGoodValuesRequestStubCorrectMimeInspect).validate().then(function (result) {
            // Check Result
            result.should.equal(true);
        }).then(done, done);
    });

    /**
     * Enforce MIME Match - Invalid
     */
    it('should invalidate bad mime matches on file uploads', function (done) {
        new ProfileFormEnforceMimeType().parseRequestSync(fileGoodValuesRequestStubIncorrectMimeInspect).validate().then(function (result) {
            // Check Result
            result.should.equal(false);
            // Check Error
            this.getErrors('avatar').should.containEql('The MIME Type of Avatar does not match its contents.');
        }).then(done, done);
    });

    /**
     * File Upload Checking
     */
    it('should allow for easily checking if a file was uploaded', function (done) {
        // True -> File Uploaded
        new ProfileForm().parseRequestSync(fileGoodValuesRequestStub).hasFile('avatar').should.equal(true);
        // False -> Empty Form Submission
        new ProfileForm().parseRequestSync(filesBadValueRequestStubNoFile).hasFile('avatar').should.equal(false);
        done();
    });

    /**
     * Enforce MIME Match - Exception - Promise Rejection
     */
    it('should reject the promise if there is an issue with LibMagic', function (done) {
        new ProfileFormEnforceMimeType().parseRequestSync(fileGoodValuesRequestStubPromiseReject).validate().then().catch(function (error) {
            error.should.be.an.instanceOf(Error);
        }).then(done, done);
    });
});