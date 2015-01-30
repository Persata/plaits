'use strict';

var Plaits = require('../index');
var should = require('should');
var request = require('supertest');

// Spin Up App
var appMulter = require('./express/server-multer');

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
            Plaits.Validators.File.required(),
            Plaits.Validators.File.maxSize('50kb')
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
 * Plaits File Tests
 */
describe('Plaits File Upload Validators', function () {
    /**
     * Multer Test
     */
    it('should validate files when uploaded into an express instance using multer', function (done) {
        // Add Multer Test Route
        appMulter.post('/multer', function (req, res) {
            console.log(req.files);
            new ProfileForm().parseRequestSync(req).validate().then(function (result) {
                console.log(this.getErrors());
                debugger;
                res.end();
            });
        });
        // Send Request
        request(appMulter).post('/multer').attach('profileForm_octocat', 'test/files/privateinvestocat.jpg').expect(200, done);
    });
});