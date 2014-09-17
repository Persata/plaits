'use strict';

var Plaits = require('../index');
var should = require('should');
var request = require('supertest');

// Spin Up App
var app = require('./express/server');

/**
 * RegisterForm Declaration
 */
var RegisterForm = Plaits.Model.extend({
    name: 'registerForm',
    fields: [
        'username',
        'email',
        'age',
        'password',
        'password_confirm',
        'job_description',
        'date_employment_started',
        'avatar',
        'accept_terms'
    ],
    validators: {
        username: [
            Plaits.Validators.alpha()
        ],
        email: [
            Plaits.Validators.required(),
            Plaits.Validators.email()
        ],
        age: [
            Plaits.Validators.required(),
            Plaits.Validators.int()
        ],
        password: [
            Plaits.Validators.required()
        ],
        password_confirm: [
            Plaits.Validators.required(),
            Plaits.Validators.matchProperty('password')
        ],
        job_description: Plaits.Validators.required(),
        date_employment_started: [
            Plaits.Validators.required(),
            Plaits.Validators.dateFormat('YYYY/mm/dd')
        ],
        avatar: [
            Plaits.Validators.File.required(),
            Plaits.Validators.File.maxSize(131072)
        ],
        accept_terms: Plaits.Validators.required()
    },
    ageOptions: {
        null: 'Choose Your Age',
        25: 'Twenty Five'
    },
    ageOptionsUndefined: {
        undefined: 'Choose Your Age',
        25: 'Twenty Five'
    },
    ageOptionsOnlyValues: {
        25: 25,
        26: 26,
        27: 27
    }
});

// Before
before(function (done) {
    // Use Middleware
    app.use(Plaits.expressMiddleware());
    // Done
    done();
});

/**
 * Express Middleware Tests
 */
describe('Plaits Express Middleware & HTML Helper', function () {

    /**
     * Middleware Test
     */
    it('should provide a middleware to attach html render helper to res.locals', function (done) {
        // Add Test Route
        app.get('/test', function (req, res) {
            // Test
            should(res.locals).have.property('Plaits');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/test').expect(200, done);
    });

    /**
     * Button Test
     */
    it('should generate a button using the html helper', function (done) {
        // Add Test Route
        app.get('/button', function (req, res) {
            // Generate
            var button = res.locals.Plaits.Html.button('Sign Up');
            // Test
            button.should.equal('<input type="button" value="Sign Up" />');
            // Classes Etc
            var buttonWithAttributes = res.locals.Plaits.Html.button('Sign Up', {class: 'btn btn-primary', id: 'submit-button'});
            // Test
            buttonWithAttributes.should.equal('<input class="btn btn-primary" id="submit-button" type="button" value="Sign Up" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/button').expect(200, done);
    });

    /**
     * Submit Button Test
     */
    it('should generate a submit button using the html helper', function (done) {
        // Add Test Route
        app.get('/submit-button', function (req, res) {
            // Generate
            var submitButton = res.locals.Plaits.Html.submitButton('Sign Up');
            // Test
            submitButton.should.equal('<input type="submit" value="Sign Up" />');
            // Classes Etc
            var submitButtonWithAttributes = res.locals.Plaits.Html.submitButton('Sign Up', {class: 'btn btn-primary', id: 'submit-button'});
            // Test
            submitButtonWithAttributes.should.equal('<input class="btn btn-primary" id="submit-button" type="submit" value="Sign Up" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/submit-button').expect(200, done);
    });

    /**
     * Reset Button Test
     */
    it('should generate a reset button using the html helper', function (done) {
        // Add Test Route
        app.get('/reset-button', function (req, res) {
            // Generate
            var resetButton = res.locals.Plaits.Html.resetButton('Reset');
            // Test
            resetButton.should.equal('<input type="reset" value="Reset" />');
            // Classes Etc
            var resetButtonWithAttributes = res.locals.Plaits.Html.resetButton('Reset', {class: 'btn btn-secondary', id: 'reset-button'});
            // Test
            resetButtonWithAttributes.should.equal('<input class="btn btn-secondary" id="reset-button" type="reset" value="Reset" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/reset-button').expect(200, done);
    });

    /**
     * Label Test
     */
    it('should generate a label using the html helper', function (done) {
        // Add Test Route
        app.get('/label', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();

            // Generate
            var label = res.locals.Plaits.Html.labelFor(registerForm, 'age');
            // Test
            label.should.equal('<label class="required" for="registerForm_age">Age<span>*</span></label>');

            // Error CSS Test -> Adding a fake error
            registerForm.addError('age', 'This is a fake error!');
            // Generate
            var labelWithError = res.locals.Plaits.Html.labelFor(registerForm, 'age');
            // Test
            labelWithError.should.equal('<label class="required error" for="registerForm_age">Age<span>*</span></label>');

            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/label').expect(200, done);
    });

    /**
     * Text Field Test
     */
    it('should generate a text field using the html helper', function (done) {
        // Add Test Route
        app.get('/text-field', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var textField = res.locals.Plaits.Html.textFieldFor(registerForm, 'username');
            // Test
            textField.should.equal('<input type="text" name="registerForm_username" value="" id="registerForm_username" />');

            // Set Value
            registerForm.set('username', 'Persata');
            // Generate
            var textFieldWithValue = res.locals.Plaits.Html.textFieldFor(registerForm, 'username');
            // Test
            textFieldWithValue.should.equal('<input type="text" name="registerForm_username" value="Persata" id="registerForm_username" />');

            // Error CSS Test -> Adding a fake error
            registerForm.addError('username', 'This is a fake error!');
            // Generate
            var textFieldWithError = res.locals.Plaits.Html.textFieldFor(registerForm, 'username');
            // Test
            textFieldWithError.should.equal('<input type="text" name="registerForm_username" value="Persata" class="error" id="registerForm_username" />');

            // Custom Class -> Generate
            var textFieldWithCustomClass = res.locals.Plaits.Html.textFieldFor(registerForm, 'username', {class: 'text-input'});
            // Test
            textFieldWithCustomClass.should.equal('<input class="text-input error" type="text" name="registerForm_username" value="Persata" id="registerForm_username" />');

            // Special Attribute
            var textFieldWithSpecialAttribute = res.locals.Plaits.Html.textFieldFor(registerForm, 'username', {required: true});
            // Test
            textFieldWithSpecialAttribute.should.equal('<input required="required" type="text" name="registerForm_username" value="Persata" class="error" id="registerForm_username" />');

            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/text-field').expect(200, done);
    });

    /**
     * Email Field Test
     */
    it('should generate an email field using the html helper', function (done) {
        // Add Test Route
        app.get('/email-field', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var emailField = res.locals.Plaits.Html.emailFieldFor(registerForm, 'email');
            // Test
            emailField.should.equal('<input type="email" name="registerForm_email" value="" class="required" id="registerForm_email" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/email-field').expect(200, done);
    });

    /**
     * Textarea Test
     */
    it('should generate a textarea using the html helper', function (done) {
        // Add Test Route
        app.get('/text-area', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var textArea = res.locals.Plaits.Html.textAreaFor(registerForm, 'job_description');
            // Test
            textArea.should.equal('<textarea name="registerForm_job_description" id="registerForm_job_description"></textarea>');
            // Set Value
            registerForm.set('job_description', 'Web Developer');
            // Generate
            var textAreaWithValue = res.locals.Plaits.Html.textAreaFor(registerForm, 'job_description');
            // Test
            textAreaWithValue.should.equal('<textarea name="registerForm_job_description" id="registerForm_job_description">Web Developer</textarea>');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/text-area').expect(200, done);
    });

    /**
     * Number Field Test
     */
    it('should generate a number field using the html helper', function (done) {
        // Add Test Route
        app.get('/number-field', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var numberField = res.locals.Plaits.Html.numberFieldFor(registerForm, 'age');
            // Test
            numberField.should.equal('<input type="number" name="registerForm_age" value="" class="required" id="registerForm_age" />');
            // Set Value
            registerForm.set('age', 26);
            // Generate
            var numberFieldWithValue = res.locals.Plaits.Html.numberFieldFor(registerForm, 'age');
            // Test
            numberFieldWithValue.should.equal('<input type="number" name="registerForm_age" value="26" class="required" id="registerForm_age" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/number-field').expect(200, done);
    });

    /**
     * Range Field Test
     */
    it('should generate a range field using the html helper', function (done) {
        // Add Test Route
        app.get('/range-field', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var rangeField = res.locals.Plaits.Html.rangeFieldFor(registerForm, 'age');
            // Test
            rangeField.should.equal('<input type="range" name="registerForm_age" value="" class="required" id="registerForm_age" />');
            // Set Value
            registerForm.set('age', 26);
            // Generate
            var rangeFieldWithValue = res.locals.Plaits.Html.rangeFieldFor(registerForm, 'age');
            // Test
            rangeFieldWithValue.should.equal('<input type="range" name="registerForm_age" value="26" class="required" id="registerForm_age" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/range-field').expect(200, done);
    });

    /**
     * Date Field Test
     */
    it('should generate a date field using the html helper', function (done) {
        // Add Test Route
        app.get('/date-field', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var dateField = res.locals.Plaits.Html.dateFieldFor(registerForm, 'date_employment_started');
            // Test
            dateField.should.equal('<input type="date" name="registerForm_date_employment_started" value="" class="required" id="registerForm_date_employment_started" />');
            // Set Value
            registerForm.set('date_employment_started', '2014/09/14');
            // Generate
            var dateFieldWithValue = res.locals.Plaits.Html.dateFieldFor(registerForm, 'date_employment_started');
            // Test
            dateFieldWithValue.should.equal('<input type="date" name="registerForm_date_employment_started" value="2014/09/14" class="required" id="registerForm_date_employment_started" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/date-field').expect(200, done);
    });

    /**
     * Color Field Test
     */
    it('should generate a color field using the html helper', function (done) {
        // Add Test Route
        app.get('/color-field', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var colorField = res.locals.Plaits.Html.colorFieldFor(registerForm, 'age');
            // Test
            colorField.should.equal('<input type="color" name="registerForm_age" value="" class="required" id="registerForm_age" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/color-field').expect(200, done);
    });

    /**
     * Search Field Test
     */
    it('should generate a search field using the html helper', function (done) {
        // Add Test Route
        app.get('/search-field', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var searchField = res.locals.Plaits.Html.searchFieldFor(registerForm, 'password');
            // Test
            searchField.should.equal('<input type="search" name="registerForm_password" value="" class="required" id="registerForm_password" />');
            // Error
            registerForm.addError('password', 'Please choose a password');
            // Generate
            var searchFieldWithError = res.locals.Plaits.Html.searchFieldFor(registerForm, 'password', {class: 'password'});
            // Test
            searchFieldWithError.should.equal('<input class="password required error" type="search" name="registerForm_password" value="" id="registerForm_password" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/search-field').expect(200, done);
    });

    /**
     * Time Field Test -> Don't really have any time field so just using age
     */
    it('should generate a time field using the html helper', function (done) {
        // Add Test Route
        app.get('/time-field', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var timeField = res.locals.Plaits.Html.timeFieldFor(registerForm, 'age');
            // Test
            timeField.should.equal('<input type="time" name="registerForm_age" value="" class="required" id="registerForm_age" />');
            // Set Value
            registerForm.set('age', '0900');
            // Generate
            var timeFieldWithValue = res.locals.Plaits.Html.timeFieldFor(registerForm, 'age');
            // Test
            timeFieldWithValue.should.equal('<input type="time" name="registerForm_age" value="0900" class="required" id="registerForm_age" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/time-field').expect(200, done);
    });

    /**
     * Tel Field Test -> Don't have a tel field so just using age
     */
    it('should generate a tel field using the html helper', function (done) {
        // Add Test Route
        app.get('/tel-field', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var telField = res.locals.Plaits.Html.telFieldFor(registerForm, 'age');
            // Test
            telField.should.equal('<input type="tel" name="registerForm_age" value="" class="required" id="registerForm_age" />');
            // Set Value
            registerForm.set('age', '07780 123 456');
            // Generate
            var telFieldWithValue = res.locals.Plaits.Html.telFieldFor(registerForm, 'age');
            // Test
            telFieldWithValue.should.equal('<input type="tel" name="registerForm_age" value="07780 123 456" class="required" id="registerForm_age" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/tel-field').expect(200, done);
    });

    /**
     * Url Field Test -> Don't have a url field so just using age
     */
    it('should generate a url field using the html helper', function (done) {
        // Add Test Route
        app.get('/url-field', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var urlField = res.locals.Plaits.Html.urlFieldFor(registerForm, 'age');
            // Test
            urlField.should.equal('<input type="url" name="registerForm_age" value="" class="required" id="registerForm_age" />');
            // Set Value
            registerForm.set('age', '07780 123 456');
            // Generate
            var urlFieldWithValue = res.locals.Plaits.Html.urlFieldFor(registerForm, 'age');
            // Test
            urlFieldWithValue.should.equal('<input type="url" name="registerForm_age" value="07780 123 456" class="required" id="registerForm_age" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/url-field').expect(200, done);
    });

    /**
     * Hidden Field Test
     */
    it('should generate a hidden field using the html helper', function (done) {
        // Add Test Route
        app.get('/hidden-field', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var hiddenField = res.locals.Plaits.Html.hiddenFieldFor(registerForm, 'age');
            // Test
            hiddenField.should.equal('<input type="hidden" name="registerForm_age" value="" class="required" id="registerForm_age" />');
            // Set Value
            registerForm.set('age', 26);
            // Generate
            var hiddenFieldWithValue = res.locals.Plaits.Html.hiddenFieldFor(registerForm, 'age');
            // Test
            hiddenFieldWithValue.should.equal('<input type="hidden" name="registerForm_age" value="26" class="required" id="registerForm_age" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/hidden-field').expect(200, done);
    });

    /**
     * Password Field Test
     */
    it('should generate a password field using the html helper', function (done) {
        // Add Test Route
        app.get('/password-field', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var passwordField = res.locals.Plaits.Html.passwordFieldFor(registerForm, 'password');
            // Test
            passwordField.should.equal('<input type="password" name="registerForm_password" value="" class="required" id="registerForm_password" />');
            // Set Value
            registerForm.set('password', 'test321');
            // Generate
            var passwordFieldWithValue = res.locals.Plaits.Html.passwordFieldFor(registerForm, 'password');
            // Test
            passwordFieldWithValue.should.equal('<input type="password" name="registerForm_password" value="test321" class="required" id="registerForm_password" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/password-field').expect(200, done);
    });

    /**
     * File Field Test
     */
    it('should generate a file field using the html helper', function (done) {
        // Add Test Route
        app.get('/file-field', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var fileField = res.locals.Plaits.Html.fileFieldFor(registerForm, 'avatar');
            // Test
            fileField.should.equal('<input type="file" name="registerForm_avatar" value="" class="required" id="registerForm_avatar" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/file-field').expect(200, done);
    });

    /**
     * Select Test
     */
    it('should generate a select using the html helper', function (done) {
        // Add Test Route
        app.get('/select-field', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();

            // Generate
            var select = res.locals.Plaits.Html.selectFor(registerForm, 'age', registerForm.ageOptions);
            // Test
            select.should.equal('<select name="registerForm_age" class="required" id="registerForm_age">\n' +
            '<option value="">Choose Your Age</option>\n' +
            '<option value="25">Twenty Five</option>\n' +
            '</select>');

            // Select With Value
            registerForm.set('age', 25);
            // Generate
            var selectWithValue = res.locals.Plaits.Html.selectFor(registerForm, 'age', registerForm.ageOptions);
            // Test
            selectWithValue.should.equal('<select name="registerForm_age" class="required" id="registerForm_age">\n' +
            '<option value="">Choose Your Age</option>\n' +
            '<option value="25" selected="selected">Twenty Five</option>\n' +
            '</select>');

            // Select With Errors
            registerForm.addError('age', 'Please select your age');
            // Generate
            var selectWithValueAndError = res.locals.Plaits.Html.selectFor(registerForm, 'age', registerForm.ageOptionsUndefined);
            // Test
            selectWithValueAndError.should.equal('<select name="registerForm_age" class="required error" id="registerForm_age">\n' +
            '<option value="">Choose Your Age</option>\n' +
            '<option value="25" selected="selected">Twenty Five</option>\n' +
            '</select>');

            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/select-field').expect(200, done);
    });

    /**
     * Multi Select Test
     */
    it('should generate a multiselect using the html helper', function (done) {
        // Add Test Route
        app.get('/multi-select-field', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();

            // Generate
            var multiSelect = res.locals.Plaits.Html.selectFor(registerForm, 'age', registerForm.ageOptions, {multiple: true});
            // Test
            multiSelect.should.equal('<select multiple="multiple" name="registerForm_age" class="required" id="registerForm_age" size="4">\n' +
            '<option value="">Choose Your Age</option>\n' +
            '<option value="25">Twenty Five</option>\n' +
            '</select>');

            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/multi-select-field').expect(200, done);
    });

    /**
     * Single Checkbox Test
     */
    it('should generate a single checkbox using the html helper', function (done) {
        // Add Test Route
        app.get('/single-checkbox', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var checkbox = res.locals.Plaits.Html.checkboxFor(registerForm, 'accept_terms');
            // Test
            checkbox.should.equal('<input value="1" type="checkbox" name="registerForm_accept_terms" class="required" id="registerForm_accept_terms" />');
            // Set Checked
            registerForm.set('accept_terms', true);
            // Generate
            var checkedCheckbox = res.locals.Plaits.Html.checkboxFor(registerForm, 'accept_terms');
            // Test
            checkedCheckbox.should.equal('<input value="1" checked="checked" type="checkbox" name="registerForm_accept_terms" class="required" id="registerForm_accept_terms" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/single-checkbox').expect(200, done);
    });

    /**
     * Multiple Checkbox Test
     */
    it('should generate multiple checkboxes using the html helper', function (done) {
        // Add Test Route
        app.get('/multiple-checkbox', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var checkboxList = res.locals.Plaits.Html.checkboxListFor(registerForm, 'age', registerForm.ageOptionsOnlyValues);
            // Test
            checkboxList.should.equal('<label><input type="checkbox" value="25" name="registerForm_age" id="registerForm_age_1" />25</label>\n' +
            '<br />\n' +
            '<label><input type="checkbox" value="26" name="registerForm_age" id="registerForm_age_2" />26</label>\n' +
            '<br />\n' +
            '<label><input type="checkbox" value="27" name="registerForm_age" id="registerForm_age_3" />27</label>\n');

            // Check
            registerForm.set('age', ['25', '26']);
            // Generate
            var checkedCheckboxList = res.locals.Plaits.Html.checkboxListFor(registerForm, 'age', registerForm.ageOptionsOnlyValues);
            // Test
            checkedCheckboxList.should.equal('<label><input type="checkbox" checked="checked" value="25" name="registerForm_age" id="registerForm_age_1" />25</label>\n' +
            '<br />\n' +
            '<label><input type="checkbox" checked="checked" value="26" name="registerForm_age" id="registerForm_age_2" />26</label>\n' +
            '<br />\n' +
            '<label><input type="checkbox" value="27" name="registerForm_age" id="registerForm_age_3" />27</label>\n');

            // Error
            registerForm.set('age', []);
            registerForm.addError('age', 'Please choose your age');
            // Generate
            var errorCheckboxList = res.locals.Plaits.Html.checkboxListFor(registerForm, 'age', registerForm.ageOptionsOnlyValues);
            // Test
            errorCheckboxList.should.equal('<label><input class="error" type="checkbox" value="25" name="registerForm_age" id="registerForm_age_1" />25</label>\n' +
            '<br />\n' +
            '<label><input class="error" type="checkbox" value="26" name="registerForm_age" id="registerForm_age_2" />26</label>\n' +
            '<br />\n' +
            '<label><input class="error" type="checkbox" value="27" name="registerForm_age" id="registerForm_age_3" />27</label>\n');

            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/multiple-checkbox').expect(200, done);
    });

    /**
     * Multiple Radio Test
     */
    it('should generate multiple radios using the html helper', function (done) {
        // Add Test Route
        app.get('/multiple-radio', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var radioList = res.locals.Plaits.Html.radioListFor(registerForm, 'age', registerForm.ageOptionsOnlyValues);
            // Test
            radioList.should.equal('<label><input type="radio" value="25" name="registerForm_age" id="registerForm_age_1" />25</label>\n' +
            '<br />\n' +
            '<label><input type="radio" value="26" name="registerForm_age" id="registerForm_age_2" />26</label>\n' +
            '<br />\n' +
            '<label><input type="radio" value="27" name="registerForm_age" id="registerForm_age_3" />27</label>\n');

            // Check
            registerForm.set('age', '26');
            // Generate
            var checkedRadioList = res.locals.Plaits.Html.radioListFor(registerForm, 'age', registerForm.ageOptionsOnlyValues);
            // Test
            checkedRadioList.should.equal('<label><input type="radio" value="25" name="registerForm_age" id="registerForm_age_1" />25</label>\n' +
            '<br />\n' +
            '<label><input type="radio" checked="checked" value="26" name="registerForm_age" id="registerForm_age_2" />26</label>\n' +
            '<br />\n' +
            '<label><input type="radio" value="27" name="registerForm_age" id="registerForm_age_3" />27</label>\n');

            // Error
            registerForm.set('age', null);
            registerForm.addError('age', 'Please choose your age');
            // Generate
            var errorRadioList = res.locals.Plaits.Html.radioListFor(registerForm, 'age', registerForm.ageOptionsOnlyValues);
            // Test
            errorRadioList.should.equal('<label><input class="error" type="radio" value="25" name="registerForm_age" id="registerForm_age_1" />25</label>\n' +
            '<br />\n' +
            '<label><input class="error" type="radio" value="26" name="registerForm_age" id="registerForm_age_2" />26</label>\n' +
            '<br />\n' +
            '<label><input class="error" type="radio" value="27" name="registerForm_age" id="registerForm_age_3" />27</label>\n');

            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/multiple-radio').expect(200, done);
    });

    /**
     * Single Radio Button Test
     */
    it('should generate a single checkbox using the html helper', function (done) {
        // Add Test Route
        app.get('/single-radio', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();
            // Generate
            var radio = res.locals.Plaits.Html.radioFor(registerForm, 'accept_terms');
            // Test
            radio.should.equal('<input value="1" type="radio" name="registerForm_accept_terms" class="required" id="registerForm_accept_terms" />');
            // Set Checked
            registerForm.set('accept_terms', true);
            // Generate
            var checkedRadio = res.locals.Plaits.Html.radioFor(registerForm, 'accept_terms');
            // Test
            checkedRadio.should.equal('<input value="1" checked="checked" type="radio" name="registerForm_accept_terms" class="required" id="registerForm_accept_terms" />');
            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/single-radio').expect(200, done);
    });

    /**
     * First Error Test
     */
    it('should generate an error container using the html helper', function (done) {
        // Add Test Route
        app.get('/error-container', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();

            // Empty Error Container
            var emptyErrorContainer = res.locals.Plaits.Html.firstErrorFor(registerForm, 'age');

            // Test
            emptyErrorContainer.should.equal('');

            // Add Error
            registerForm.addError('age', 'You must specify your age');

            // Generate
            var errorContainer = res.locals.Plaits.Html.firstErrorFor(registerForm, 'age');

            // Test
            errorContainer.should.equal('<div class="error-message">You must specify your age</div>');

            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/error-container').expect(200, done);
    });

    /**
     * All Errors For Field Test
     */
    it('should generate an error container for all errors on a field using the html helper', function (done) {
        // Add Test Route
        app.get('/error-container-all', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();

            // Empty Error Container
            var emptyErrorContainer = res.locals.Plaits.Html.errorsFor(registerForm, 'age');

            // Test
            emptyErrorContainer.should.equal('');

            // Add Errors
            registerForm.addError('age', 'You must specify your age');
            registerForm.addError('age', 'Your age must be a number');

            // Generate
            var errorContainer = res.locals.Plaits.Html.errorsFor(registerForm, 'age');

            // Test
            errorContainer.should.equal('<div class="error-summary">\n' +
            '<ul>\n' +
            '<li>You must specify your age</li>\n' +
            '<li>Your age must be a number</li>\n' +
            '</ul>\n' +
            '</div>');

            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/error-container-all').expect(200, done);
    });

    /**
     * All Errors For Form
     */
    it('should generate an error container for all errors on a form using the html helper', function (done) {
        // Add Test Route
        app.get('/error-container-all-form', function (req, res) {
            // Register Form
            var registerForm = new RegisterForm();

            // Empty Error Summary
            var emptyErrorSummary = res.locals.Plaits.Html.errorSummary(registerForm);

            // Test
            emptyErrorSummary.should.equal('');

            // Add Errors
            registerForm.addError('age', 'You must specify your age');
            registerForm.addError('age', 'Your age must be a number');
            registerForm.addError('username', 'You must specify a username');
            registerForm.addError('username', 'Your username must consist of only letters and numbers');

            // Generate
            var errorSummary = res.locals.Plaits.Html.errorSummary(registerForm);

            // Test
            errorSummary.should.equal('<div class="error-summary">\n' +
                '<p>Please fix the following validation errors:</p>\n' +
                '<ul>\n' +
                '<li>You must specify your age</li>\n' +
                '<li>Your age must be a number</li>\n' +
                '<li>You must specify a username</li>\n' +
                '<li>Your username must consist of only letters and numbers</li>\n' +
                '</ul>\n' +
                '</div>'
            );

            // End Response
            res.end();
        });
        // Send Request
        request(app).get('/error-container-all-form').expect(200, done);
    });
});