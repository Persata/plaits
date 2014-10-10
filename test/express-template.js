'use strict';

var Plaits = require('../index');
var should = require('should');
var request = require('supertest');
var path = require('path');

// Spin Up App
var app = require('./express/server-template');

/**
 * RegisterForm Declaration
 */
var RegisterForm = Plaits.Model.extend({
    name: 'registerForm',
    fields: [
        'username',
        'email',
        'password',
        'job_description',
        'age',
        'favourite_color',
        'anniversary',
        'preferred_lunch_time',
        'homepage',
        'contact_number',
        'newsletter'
    ],
    validators: {
        username: [
            Plaits.Validators.required(),
            Plaits.Validators.alpha()
        ],
        email: [
            Plaits.Validators.required(),
            Plaits.Validators.email()
        ],
        password: [
            Plaits.Validators.required()
        ],
        job_description: [
            Plaits.Validators.required()
        ],
        age: [
            Plaits.Validators.required(),
            Plaits.Validators.int()
        ],
        favourite_color: [
            Plaits.Validators.required()
        ],
        anniversary: [
            Plaits.Validators.required()
        ],
        preferred_lunch_time: [
            Plaits.Validators.required()
        ],
        homepage: [
            Plaits.Validators.required()
        ],
        contact_number: [
            Plaits.Validators.required()
        ]
    },
    ageOptions: {
        null: 'Choose Your Age',
        25: 'Twenty Five'
    },
    ageOptionsOnlyValues: {
        25: 25,
        26: 26,
        27: 27
    }
});

/**
 * Express Middleware Tests
 */
describe('Plaits Express Middleware HTML Template Helper', function () {

    /**
     * Middleware Test
     */
    it('should provide a middleware to attach html template render helper to res.locals', function (done) {
        // Add Test Route
        app.get('/test', function (req, res) {
            // Test
            should(res.locals).have.property('Plaits');
            should(res.locals.Plaits).have.property('Html');
            should(res.locals.Plaits.Html).have.property('Template');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/test').expect(200, done);
    });

    /**
     * Reset Template Test
     */
    it('should generate a reset template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/reset-template', function (req, res) {
            // Generate Template
            var reset = res.locals.Plaits.Html.Template.reset();
            // Check
            reset.should.equal('<div class="form-row"><input type="reset" value="Reset" /></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/reset-template').expect(200, done);
    });

    /**
     * Submit Template Test
     */
    it('should generate a submit template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/submit-template', function (req, res) {
            // Generate Template
            var submit = res.locals.Plaits.Html.Template.submit();
            // And Generate Again So We Cover View Cache
            submit = res.locals.Plaits.Html.Template.submit();
            // Check
            submit.should.equal('<div class="form-row"><input type="submit" value="Submit" /></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/submit-template').expect(200, done);
    });

    /**
     * Text Template Test
     */
    it('should generate a text field template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/text-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Set Value
            registerForm.set('username', 'Persata');
            // Generate Template
            var text = res.locals.Plaits.Html.Template.text(registerForm, 'username');
            // Check
            text.should.equal('<div class="form-row"><label class="required req" for="registerForm_username">Username<span>*</span></label><input type="text" name="registerForm_username" value="Persata" class="required req" id="registerForm_username" /></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/text-template').expect(200, done);
    });

    /**
     * Custom Text Template Test
     */
    it('should generate a custom text field template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/custom-text-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Set Value
            registerForm.set('username', 'Persata');
            // Generate Template
            var text = res.locals.Plaits.Html.Template.render('text-custom', registerForm, 'username');
            // Check
            text.should.equal('<input type="text" name="registerForm_username" value="Persata" class="required req" id="registerForm_username" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/custom-text-template').expect(200, done);
    });

    /**
     * Email Template Test
     */
    it('should generate an email field template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/email-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Set Value
            registerForm.set('email', 'persata@gmail.com');
            // Generate Template
            var email = res.locals.Plaits.Html.Template.email(registerForm, 'email');
            // Check
            email.should.equal('<div class="form-row"><label class="required req" for="registerForm_email">Email<span>*</span></label><input type="email" name="registerForm_email" value="persata@gmail.com" class="required req" id="registerForm_email" /></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/email-template').expect(200, done);
    });

    /**
     * Password Template Test
     */
    it('should generate a password field template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/password-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Set Value
            registerForm.set('password', 'testUnoDos3');
            // Generate Template
            var password = res.locals.Plaits.Html.Template.password(registerForm, 'password');
            // Check
            password.should.equal('<div class="form-row"><label class="required req" for="registerForm_password">Password<span>*</span></label><input type="password" name="registerForm_password" value="testUnoDos3" class="required req" id="registerForm_password" /></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/password-template').expect(200, done);
    });

    /**
     * Text Area Template Test
     */
    it('should generate a password field template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/text-area-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Set Value
            registerForm.set('job_description', 'Web Developerino');
            // Generate Template
            var textArea = res.locals.Plaits.Html.Template.textArea(registerForm, 'job_description');
            // Check
            textArea.should.equal('<div class="form-row"><label class="required req" for="registerForm_job_description">Job Description<span>*</span></label><textarea name="registerForm_job_description" id="registerForm_job_description" class="required req">Web Developerino</textarea></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/text-area-template').expect(200, done);
    });

    /**
     * Number Template Test
     */
    it('should generate a number field template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/number-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Set Value
            registerForm.set('age', '26');
            // Generate Template
            var number = res.locals.Plaits.Html.Template.number(registerForm, 'age');
            // Check
            number.should.equal('<div class="form-row"><label class="required req" for="registerForm_age">Age<span>*</span></label><input type="number" name="registerForm_age" value="26" class="required req" id="registerForm_age" /></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/number-template').expect(200, done);
    });

    /**
     * Color Template Test
     */
    it('should generate a color field template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/color-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Set Value
            registerForm.set('favourite_color', '#900');
            // Generate Template
            var color = res.locals.Plaits.Html.Template.color(registerForm, 'favourite_color');
            // Check
            color.should.equal('<div class="form-row"><label class="required req" for="registerForm_favourite_color">Favourite Color<span>*</span></label><input type="color" name="registerForm_favourite_color" value="#900" class="required req" id="registerForm_favourite_color" /></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/color-template').expect(200, done);
    });

    /**
     * Date Template Test
     */
    it('should generate a date field template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/date-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Set Value
            registerForm.set('anniversary', '17/10/2010');
            // Generate Template
            var date = res.locals.Plaits.Html.Template.date(registerForm, 'anniversary');
            // Check
            date.should.equal('<div class="form-row"><label class="required req" for="registerForm_anniversary">Anniversary<span>*</span></label><input type="date" name="registerForm_anniversary" value="17/10/2010" class="required req" id="registerForm_anniversary" /></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/date-template').expect(200, done);
    });

    /**
     * Time Template Test
     */
    it('should generate a time field template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/time-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Set Value
            registerForm.set('preferred_lunch_time', '1PM');
            // Generate Template
            var time = res.locals.Plaits.Html.Template.time(registerForm, 'preferred_lunch_time');
            // Check
            time.should.equal('<div class="form-row"><label class="required req" for="registerForm_preferred_lunch_time">Preferred Lunch Time<span>*</span></label><input type="time" name="registerForm_preferred_lunch_time" value="1PM" class="required req" id="registerForm_preferred_lunch_time" /></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/time-template').expect(200, done);
    });

    /**
     * Url Template Test
     */
    it('should generate a url field template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/url-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Set Value
            registerForm.set('homepage', 'http://www.persata.com');
            // Generate Template
            var url = res.locals.Plaits.Html.Template.url(registerForm, 'homepage');
            // Check
            url.should.equal('<div class="form-row"><label class="required req" for="registerForm_homepage">Homepage<span>*</span></label><input type="url" name="registerForm_homepage" value="http://www.persata.com" class="required req" id="registerForm_homepage" /></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/url-template').expect(200, done);
    });

    /**
     * Url Template Test
     */
    it('should generate a tel field template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/tel-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Set Value
            registerForm.set('contact_number', '01234 999 999');
            // Generate Template
            var tel = res.locals.Plaits.Html.Template.tel(registerForm, 'contact_number');
            // Check
            tel.should.equal('<div class="form-row"><label class="required req" for="registerForm_contact_number">Contact Number<span>*</span></label><input type="tel" name="registerForm_contact_number" value="01234 999 999" class="required req" id="registerForm_contact_number" /></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/tel-template').expect(200, done);
    });

    /**
     * Search Template Test
     */
    it('should generate a search field template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/search-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Set Value
            registerForm.set('contact_number', '');
            // Generate Template
            var search = res.locals.Plaits.Html.Template.search(registerForm, 'contact_number');
            // Check
            search.should.equal('<div class="form-row"><label class="required req" for="registerForm_contact_number">Contact Number<span>*</span></label><input type="search" name="registerForm_contact_number" value="" class="required req" id="registerForm_contact_number" /></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/search-template').expect(200, done);
    });

    /**
     * Range Template Test
     */
    it('should generate a range field template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/range-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Set Value
            registerForm.set('age', '');
            // Generate Template
            var range = res.locals.Plaits.Html.Template.range(registerForm, 'age');
            // Check
            range.should.equal('<div class="form-row"><label class="required req" for="registerForm_age">Age<span>*</span></label><input type="range" name="registerForm_age" value="" class="required req" id="registerForm_age" /></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/range-template').expect(200, done);
    });

    /**
     * File Template Test
     */
    it('should generate a range field template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/file-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Set Value
            registerForm.set('age', '');
            // Generate Template
            var range = res.locals.Plaits.Html.Template.file(registerForm, 'age');
            // Check
            range.should.equal('<div class="form-row"><label class="required req" for="registerForm_age">Age<span>*</span></label><input type="file" name="registerForm_age" value="" class="required req" id="registerForm_age" /></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/file-template').expect(200, done);
    });

    /**
     * Select Template Test
     */
    it('should generate a select template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/select-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Set Value
            registerForm.set('age', '');
            // Generate Template
            var select = res.locals.Plaits.Html.Template.select(registerForm, 'age', registerForm.ageOptions);
            // Check
            select.should.equal('<div class="form-row"><label class="required req" for="registerForm_age">Age<span>*</span></label><select name="registerForm_age" class="required req" id="registerForm_age">\n<option value="">Choose Your Age</option>\n<option value="25">Twenty Five</option>\n</select></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/select-template').expect(200, done);
    });

    /**
     * Checkbox Template Test
     */
    it('should generate a checkbox template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/checkbox-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate Template
            var checkbox = res.locals.Plaits.Html.Template.checkbox(registerForm, 'newsletter');
            // Check
            checkbox.should.equal('<div class="form-row"><label for="registerForm_newsletter">Newsletter</label><input value="1" type="checkbox" name="registerForm_newsletter" id="registerForm_newsletter" /></div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/checkbox-template').expect(200, done);
    });

    /**
     * Radio Template Test
     */
    it('should generate a radio template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/radio-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate Template
            var radio = res.locals.Plaits.Html.Template.radio(registerForm, 'newsletter');
            // Check
            radio.should.equal('<input value="1" type="radio" name="registerForm_newsletter" id="registerForm_newsletter" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/radio-template').expect(200, done);
    });

    /**
     * Checkbox List Template Test
     */
    it('should generate a checkbox list template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/checkbox-list-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate Template
            var checkboxList = res.locals.Plaits.Html.Template.checkboxList(registerForm, 'age', registerForm.ageOptionsOnlyValues);
            // Check
            checkboxList.should.equal('<div class="form-row"><label class="required req" for="registerForm_age">Age<span>*</span></label><label><input type="checkbox" value="25" name="registerForm_age" id="registerForm_age_1" />25</label>\n' +
            '<br />\n' +
            '<label><input type="checkbox" value="26" name="registerForm_age" id="registerForm_age_2" />26</label>\n' +
            '<br />\n' +
            '<label><input type="checkbox" value="27" name="registerForm_age" id="registerForm_age_3" />27</label>\n' +
            '</div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/checkbox-list-template').expect(200, done);
    });

    /**
     * Radio List Template Test
     */
    it('should generate a radio list template for a specific model and attribute', function (done) {
        // Add Test Route
        app.get('/radio-list-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate Template
            var radioList = res.locals.Plaits.Html.Template.radioList(registerForm, 'age', registerForm.ageOptionsOnlyValues);
            // Check
            radioList.should.equal('<div class="form-row"><label class="required req" for="registerForm_age">Age<span>*</span></label><label><input type="radio" value="25" name="registerForm_age" id="registerForm_age_1" />25</label>\n' +
            '<br />\n' +
            '<label><input type="radio" value="26" name="registerForm_age" id="registerForm_age_2" />26</label>\n' +
            '<br />\n' +
            '<label><input type="radio" value="27" name="registerForm_age" id="registerForm_age_3" />27</label>\n' +
            '</div>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/radio-list-template').expect(200, done);
    });

    /**
     * Error On Missing Template Test
     */
    it('should generate an error when attempting to render a template that does not exist', function (done) {
        // Add Test Route
        app.get('/error-missing-template', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate Template
            (function () {
                res.locals.Plaits.Html.Template.render('text-custom-missing', registerForm, 'username');
            }).should.throw('Unable to find suitable Plaits template file for requested template \'text-custom-missing\' in any path.');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/error-missing-template').expect(200, done);
    });
});