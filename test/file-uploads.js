'use strict';

var Plaits = require('../index');
var should = require('should');
var request = require('supertest');
var fs = require('fs-extra');

// Spin Up Apps
var appMulter = require('./express/server-multer');
var appMultiparty = require('./express/server-multiparty');

/**
 * ProfileForm Declaration
 */
var ProfileForm = Plaits.Model.extend({
    name: 'profileForm',
    fields: [
        'octocat'
    ],
    validators: {
        octocat: [
            Plaits.Validators.File.required()
        ]
    }
});

/**
 * Profile Form with Wildcard Regex
 */
var ProfileFormSize = ProfileForm.extend({
    validators: {
        octocat: [
            Plaits.Validators.File.required(),
            Plaits.Validators.File.maxSize('60kB')
        ]
    }
});

/**
 * Profile Form with MIME Type
 */
var ProfileFormMimeType = ProfileForm.extend({
    validators: {
        octocat: [
            Plaits.Validators.File.required(),
            Plaits.Validators.File.minSize('60kB'),
            Plaits.Validators.File.mimeTypes(['image/png'])
        ]
    }
});

/**
 * After -> Clean Up
 */
after(function (done) {
    fs.remove('test/uploads/', function (err) {
        if (err) return done(err);
        return done();
    });
});

/**
 * Plaits File Tests
 */
describe('Plaits File Upload Library Support', function () {
    /**
     * Multer Test - Valid
     */
    it('should successfully validate files when uploaded into an express instance using multer', function (done) {
        // Set Multer
        Plaits.setValidatorConfig({fileFieldMappings: Plaits.FileFieldMappings.Multer});
        // Add Multer Test Route
        appMulter.post('/multer-valid', function (req) {
            new ProfileForm().parseRequestSync(req).validate().then(function (result) {
                // Check Result
                result.should.equal(true);
            }).then(done, done);
        });
        // Send Request
        request(appMulter).post('/multer-valid').attach('profileForm_octocat', 'test/files/privateinvestocat.jpg').expect(200, done);
    });

    /**
     * Multer Test - Invalid on Size
     */
    it('should successfully validate false on size against files when uploaded into an express instance using multer', function (done) {
        // Set Multer
        Plaits.setValidatorConfig({fileFieldMappings: Plaits.FileFieldMappings.Multer});
        // Add Multer Test Route
        appMulter.post('/multer-invalid-size', function (req) {
            new ProfileFormSize().parseRequestSync(req).validate().then(function (result) {
                // Check Result
                result.should.equal(false);
                // Error Message
                this.getErrors('octocat').should.containEql('Octocat must be smaller than 60kB.');
            }).then(done, done);
        });
        // Send Request
        request(appMulter).post('/multer-invalid-size').attach('profileForm_octocat', 'test/files/privateinvestocat.jpg').expect(200, done);
    });

    /**
     * Multer Test - Invalid on Mime
     */
    it('should successfully validate false on mime type against files when uploaded into an express instance using multer', function (done) {
        // Set Multer
        Plaits.setValidatorConfig({fileFieldMappings: Plaits.FileFieldMappings.Multer});
        // Add Multer Test Route
        appMulter.post('/multer-invalid-mime', function (req) {
            new ProfileFormMimeType().parseRequestSync(req).validate().then(function (result) {
                // Check Result
                result.should.equal(false);
                // Error Message
                this.getErrors('octocat').should.containEql('Octocat must be one of the following file types: image/png.');
            }).then(done, done);
        });
        // Send Request
        request(appMulter).post('/multer-invalid-mime').attach('profileForm_octocat', 'test/files/privateinvestocat.jpg').expect(200, done);
    });

    /**
     * Multiparty Test - Valid
     */
    it('should successfully validate files when uploaded into an express instance using multiparty', function (done) {
        // Set Multiparty Config
        Plaits.setValidatorConfig({fileFieldMappings: Plaits.FileFieldMappings.Multiparty});
        // Add Multiparty Test Route
        appMultiparty.post('/multiparty-valid', function (req) {
            new ProfileForm().parseRequestSync(req).validate().then(function (result) {
                // Check Result
                result.should.equal(true);
            }).then(done, done);
        });
        // Send Request
        request(appMultiparty).post('/multiparty-valid').attach('profileForm_octocat', 'test/files/privateinvestocat.jpg').expect(200, done);
    });

    /**
     * Multiparty Test - Invalid on Size
     */
    it('should successfully validate false on size against files when uploaded into an express instance using multiparty', function (done) {
        // Set Multiparty Config
        Plaits.setValidatorConfig({fileFieldMappings: Plaits.FileFieldMappings.Multiparty});
        // Add Multiparty Test Route
        appMultiparty.post('/multer-invalid-size', function (req) {
            new ProfileFormSize().parseRequestSync(req).validate().then(function (result) {
                // Check Result
                result.should.equal(false);
                // Error Message
                this.getErrors('octocat').should.containEql('Octocat must be smaller than 60kB.');
            }).then(done, done);
        });
        // Send Request
        request(appMultiparty).post('/multer-invalid-size').attach('profileForm_octocat', 'test/files/privateinvestocat.jpg').expect(200, done);
    });

    /**
     * Multiparty Test - Invalid on Mime
     */
    it('should successfully validate false on mime type against files when uploaded into an express instance using multiparty', function (done) {
        // Set Multiparty Config
        Plaits.setValidatorConfig({fileFieldMappings: Plaits.FileFieldMappings.Multiparty});
        // Add Multiparty Test Route
        appMultiparty.post('/multer-invalid-mime', function (req) {
            new ProfileFormMimeType().parseRequestSync(req).validate().then(function (result) {
                // Check Result
                result.should.equal(false);
                // Error Message
                this.getErrors('octocat').should.containEql('Octocat must be one of the following file types: image/png.');
            }).then(done, done);
        });
        // Send Request
        request(appMultiparty).post('/multer-invalid-mime').attach('profileForm_octocat', 'test/files/privateinvestocat.jpg').expect(200, done);
    });
});