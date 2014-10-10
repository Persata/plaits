'use strict';

var Plaits = require('../index');
require('should');

describe('Plaits Individual Validation Functions', function () {

    /**
     * Email Test - Valid
     */
    it('should validate good emails', function (done) {
        // Function
        var emailValidator = Plaits.Validators.email();
        // Get Result
        var result = emailValidator('persata@gmail.com', 'Email');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * Email Test - Invalid
     */
    it('should invalidate bad emails', function (done) {
        // Function
        var emailValidator = Plaits.Validators.email();
        // Get Result
        var result = emailValidator('notavalidemailaddress', 'Your email');
        // Check
        result.should.equal('Your email must be a valid email address.');
        // Done
        done();
    });

    /**
     * Required Function - Valid
     */
    it('should validate good required fields', function (done) {
        // Function
        var requiredValidator = Plaits.Validators.required();
        // Get Result
        var result = requiredValidator('Ross');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * Required Function - Invalid
     */
    it('should invalidate bad required fields', function (done) {
        // Function
        var requiredValidator = Plaits.Validators.required();
        // Get Result
        var result = requiredValidator('', 'Name');
        // Check
        result.should.equal('Name is a required field.');
        // Done
        done();
    });

    /**
     * Max Length - Valid
     */
    it('should validate good maximum lengths', function (done) {
        // Function
        var maxLengthValidator = Plaits.Validators.maxLength(6);
        // Get Result
        var result = maxLengthValidator('Ross');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * Max Length - Invalid
     */
    it('should invalidate bad maximum lengths', function (done) {
        // Function
        var maxLengthValidator = Plaits.Validators.maxLength(6);
        // Get Result
        var result = maxLengthValidator('Ross Kinsman', 'Name');
        // Check
        result.should.equal('Name must be no more than 6 characters long.');
        // Done
        done();
    });

    /**
     * Max Length - Invalid - Custom Message
     */
    it('should invalidate bad maximum lengths with custom error messages', function (done) {
        // Function
        var maxLengthValidator = Plaits.Validators.maxLength(6, '{{label}} has to be less than {{maxLength}} chars!');
        // Get Result
        var result = maxLengthValidator('Ross Kinsman', 'Name', {}, {});
        // Check
        result.should.equal('Name has to be less than 6 chars!');
        // Done
        done();
    });

    /**
     * Min Length - Valid
     */
    it('should validate good minimum length values', function (done) {
        // Function
        var minLengthValidator = Plaits.Validators.minLength(6);
        // Get Result
        var result = minLengthValidator('Ross Kinsman');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * Min Length - Invalid
     */
    it('should invalidate bad minimum length values', function (done) {
        // Function
        var minLengthValidator = Plaits.Validators.minLength(6);
        // Get Result
        var result = minLengthValidator('Ross', 'Name');
        // Check
        result.should.equal('Name must be at least 6 characters long.');
        // Done
        done();
    });

    /**
     * Between Length - Valid
     */
    it('should validate values that are between a certain length', function (done) {
        // Function
        var betweenLengthValidator = Plaits.Validators.length(6, 12);
        // Get Result
        var result = betweenLengthValidator('Ross Kinsman');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * Between Length - Invalid
     */
    it('should invalidate values that are not between a certain length', function (done) {
        // Function
        var betweenLengthValidator = Plaits.Validators.length(6, 12);
        // Get Result
        var result = betweenLengthValidator('Ross Robert Kinsman', 'Name');
        // Check
        result.should.equal('Name must be between 6 and 12 characters long.');
        // Done
        done();
    });

    /**
     * Between Length - Valid - Custom Error Message
     */
    it('should validate values that are between a certain length when a custom error message is given', function (done) {
        // Function
        var betweenLengthValidator = Plaits.Validators.length(6, 12, '{{label}} has to be more than 6 and less than 12 characters.');
        // Get Result
        var result = betweenLengthValidator('Ross Kinsman', 'Name', {}, {});
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * Between Length - Invalid - Custom Error Message
     */
    it('should invalidate values that are not between a certain length with a custom error message', function (done) {
        // Function
        var betweenLengthValidator = Plaits.Validators.length(6, 12, '{{label}} has to be more than 6 and less than 12 characters.');
        // Get Result
        var result = betweenLengthValidator('Ross Robert Kinsman', 'Name', {}, {});
        // Check
        result.should.equal('Name has to be more than 6 and less than 12 characters.');
        // Done
        done();
    });

    /**
     * Exact Length - Valid
     */
    it('should validate values that are exactly a certain length', function (done) {
        // Function
        var exactLengthValidator = Plaits.Validators.length(4);
        // Get Result
        var result = exactLengthValidator('Ross');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * Exact Length - Custom Error Message
     */
    it('should validate values that are exactly a certain length', function (done) {
        // Function
        var exactLengthValidator = Plaits.Validators.length(4, 'Exactly 4 characters please!');
        // Get Result
        var result = exactLengthValidator('Ross');
        // Check
        result.should.equal(true);
        // Invalid
        var invalidResult = exactLengthValidator('R', 'Name', {}, {});
        // Check
        invalidResult.should.equal('Exactly 4 characters please!');
        // Done
        done();
    });

    /**
     * Exact Length - Invalid
     */
    it('should invalidate values that are not exactly a certain length', function (done) {
        // Function
        var exactLengthValidator = Plaits.Validators.length(4);
        // Get Result
        var result = exactLengthValidator('Persata', 'Username');
        // Check
        result.should.equal('Username must be exactly 4 characters long.');
        // Done
        done();
    });

    /**
     * Between Length - Invalid - Too Short
     */
    it('should invalidate values that are too short and outside a range', function (done) {
        // Function
        var betweenLengthValidator = Plaits.Validators.length(6, 12);
        // Get Result
        var result = betweenLengthValidator('Ross', 'Name');
        // Check
        result.should.equal('Name must be between 6 and 12 characters long.');
        // Done
        done();
    });

    /**
     * Between Length - Invalid - Too Long
     */
    it('should invalidate values that are too long and outside a range', function (done) {
        // Function
        var betweenLengthValidator = Plaits.Validators.length(6, 10);
        // Get Result
        var result = betweenLengthValidator('Ross', 'Username');
        // Check
        result.should.equal('Username must be between 6 and 10 characters long.');
        // Done
        done();
    });

    /**
     * Numeric - Valid
     */
    it('should validate good numeric values', function (done) {
        // Function
        var numericValidator = Plaits.Validators.numeric();
        // Get Result
        var result = numericValidator('1234');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * Numeric - Invalid
     */
    it('should invalidate bad numeric values', function (done) {
        // Function
        var numericValidator = Plaits.Validators.numeric();
        // Get Result
        var result = numericValidator('Clearly not a number', 'PIN');
        // Check
        result.should.equal('PIN must be a numeric value.');
        // Done
        done();
    });

    /**
     * Alpha - Valid
     */
    it('should validate good alpha values', function (done) {
        // Function
        var alphaValidator = Plaits.Validators.alpha();
        // Get Result
        var result = alphaValidator('Persata');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * Alpha - Invalid
     */
    it('should invalidate bad alpha values', function (done) {
        // Function
        var alphaValidator = Plaits.Validators.alpha();
        // Get Result
        var result = alphaValidator('1234', 'Username');
        // Check
        result.should.equal('Username must consist of only letters.');
        // Done
        done();
    });

    /**
     * Alphanumeric - Valid
     */
    it('should validate good alphanumeric values', function (done) {
        // Function
        var alphanumericValidator = Plaits.Validators.alphanumeric();
        // Get Result
        var result = alphanumericValidator('Persata123');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * Alphanumeric - Invalid
     */
    it('should invalidate bad alphanumeric values', function (done) {
        // Function
        var alphanumericValidator = Plaits.Validators.alphanumeric();
        // Get Result
        var result = alphanumericValidator('Persata_Plaits', 'Username');
        // Check
        result.should.equal('Username must contain only letters and numbers.');
        // Done
        done();
    });

    /**
     * IP Address - Valid - Any Version
     */
    it('should validate good IP address values of any version', function (done) {
        // Function
        var ipAddressValidator = Plaits.Validators.ipAddress();
        // Get Result
        var result = ipAddressValidator('127.0.0.1', 'IP Address');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * IP Address - Invalid - Any Version
     */
    it('should invalidate bad IP address values of any version', function (done) {
        // Function
        var ipAddressValidator = Plaits.Validators.ipAddress();
        // Get Result
        var result = ipAddressValidator('localhost', 'IP Address');
        // Check
        result.should.equal('IP Address must be a version 4 or 6 IP address.');
        // Done
        done();
    });

    /**
     * IP Address - Valid - Version 4
     */
    it('should validate good IP address version 4 values', function (done) {
        // Function
        var ipAddressValidator = Plaits.Validators.ipAddress(4);
        // Get Result
        var result = ipAddressValidator('127.0.0.1');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * IP Address - Valid - Version 6
     */
    it('should validate good IP address values', function (done) {
        // Function
        var ipAddressValidator = Plaits.Validators.ipAddress(6);
        // Get Result
        var result = ipAddressValidator('0:0:0:0:0:0:0:1');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * IP Address - Invalid - Version 4
     */
    it('should invalidate bad IP address version 4 values', function (done) {
        // Function
        var ipAddressValidator = Plaits.Validators.ipAddress(4);
        // Get Result
        var result = ipAddressValidator('localhost', 'IP Address');
        // Check
        result.should.equal('IP Address must be a version 4 IP address.');
        // Done
        done();
    });

    /**
     * IP Address - Invalid - Version 6
     */
    it('should invalidate bad IP address version 4 values', function (done) {
        // Function
        var ipAddressValidator = Plaits.Validators.ipAddress(6);
        // Get Result
        var result = ipAddressValidator('localhost', 'IP Address');
        // Check
        result.should.equal('IP Address must be a version 6 IP address.');
        // Done
        done();
    });

    /**
     * IP Address - Invalid - Specific Version & Custom Message
     */
    it('should invalidate bad IP address values of any version with a custom error message', function (done) {
        // Function
        var ipAddressValidator = Plaits.Validators.ipAddress(6, '{{label}} is not a valid IP address.');
        // Get Result
        var result = ipAddressValidator('localhost', 'IP Address', {}, {});
        // Check
        result.should.equal('IP Address is not a valid IP address.');
        // Done
        done();
    });

    /**
     * Alphanumeric - Valid
     */
    it('should validate good credit card values', function (done) {
        // Function
        var creditCardValidator = Plaits.Validators.creditCard();
        // Get Result
        var result = creditCardValidator('5570979378786895');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * Alphanumeric - Invalid
     */
    it('should invalidate bad credit card values', function (done) {
        // Function
        var creditCardValidator = Plaits.Validators.creditCard();
        // Get Result
        var result = creditCardValidator('5570979378786890', 'Credit card');
        // Check
        result.should.equal('Credit card must be a valid credit card.');
        // Done
        done();
    });

    /**
     * Equals - Valid
     */
    it('should validate good values that are equal to the given value', function (done) {
        // Function
        var equalsValidator = Plaits.Validators.equals('Persata');
        // Get Result
        var result = equalsValidator('Persata');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * Equals - Invalid
     */
    it('should invalidate bad values that are not part of the allowed values', function (done) {
        // Function
        var equalsValidator = Plaits.Validators.equals('Persata');
        // Get Result
        var result = equalsValidator('Ross', 'Username');
        // Check
        result.should.equal('Username must equal Persata.');
        // Done
        done();
    });

    /**
     * One Of - Valid
     */
    it('should validate good values that are part of the allowed values', function (done) {
        // Function
        var isInValidator = Plaits.Validators.oneOf(['Ross', 'Persata']);
        // Get Result
        var result = isInValidator('Ross');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * Is In - Invalid
     */
    it('should invalidate bad values that are not part of the allowed values', function (done) {
        // Function
        var isInValidator = Plaits.Validators.oneOf(['Ross', 'Persata']);
        // Get Result
        var result = isInValidator('5570979378786890', 'Your name');
        // Check
        result.should.equal('Your name must be one of: Ross, Persata.');
        // Done
        done();
    });

    /**
     * Contains - Valid
     */
    it('should validate good values that contain the given value', function (done) {
        // Function
        var containsValidator = Plaits.Validators.contains('m33p');
        // Get Result
        var result = containsValidator('m33p meep!');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * Contains - Invalid
     */
    it('should invalidate bad values that do not contain the given value', function (done) {
        // Function
        var containsValidator = Plaits.Validators.contains('m33p');
        // Get Result
        var result = containsValidator('Just meep meep', 'Your catchphrase');
        // Check
        result.should.equal('Your catchphrase must contain the characters "m33p".');
        // Done
        done();
    });

    /**
     * Regex Matches - Valid
     */
    it('should validate good values that match the regex', function (done) {
        // Function
        var matchesValidator = Plaits.Validators.matches(new RegExp('woop'));
        // Get Result
        var result = matchesValidator('woop woop!');
        // Check
        result.should.equal(true);
        // Done
        done();
    });

    /**
     * Regex Matches - Invalid
     */
    it('should invalidate bad values that do not match the regex', function (done) {
        // Function
        var matchesValidator = Plaits.Validators.matches(new RegExp('woop'));
        // Get Result
        var result = matchesValidator('Just meep meep', 'Your catchphrase');
        // Check
        result.should.equal('Your catchphrase must match the pattern /woop/.');
        // Done
        done();
    });

    /**
     * Any Date Format - Valid
     */
    it('should validate good date values', function (done) {
        // Function
        var dateValidator = Plaits.Validators.date();
        // Get Results
        dateValidator('2014-11-10').should.equal(true);
        dateValidator('2014.11.10').should.equal(true);
        dateValidator('2014/11/10').should.equal(true);
        dateValidator('2014-11-10 00:00:00').should.equal(true);
        dateValidator('10/11/2014').should.equal(true);
        dateValidator('2014').should.equal(true);
        // Done
        done();
    });

    /**
     * Any Date - Invalid
     */
    it('should invalidate bad date values', function (done) {
        // Functions
        Plaits.Validators.date()('2014/13/32', 'Birthday').should.equal('Birthday must be a valid date.');
        Plaits.Validators.date()('foo', 'Birthday').should.equal('Birthday must be a valid date.');
        Plaits.Validators.date()('GMT', 'Birthday').should.equal('Birthday must be a valid date.');
        // Done
        done();
    });

    /**
     * Specific Date Formats - Valid
     */
    it('should validate good date values of a specific format', function (done) {
        // Functions
        Plaits.Validators.dateFormat('YYYY/MM/DD')('1987/11/10', 'Birthday').should.equal(true);
        Plaits.Validators.dateFormat('YYYY-MM-DD')('1987-11-10', 'Birthday').should.equal(true);
        Plaits.Validators.dateFormat('YYYY-MM-DD H:m:s')('1987-11-10 00:00:00', 'Birthday').should.equal(true);
        Plaits.Validators.dateFormat('D/M/Y')('10/11/1987', 'Birthday').should.equal(true);
        // Done
        done();
    });

    /**
     * Specific Date Formats - Invalid
     */
    it('should invalidate bad date values that are not a specific format', function (done) {
        // Functions
        Plaits.Validators.dateFormat('YYYY/MM/DD')('1987/13/10', 'Birthday').should.equal('Birthday must be a valid date in the format YYYY/MM/DD.');
        Plaits.Validators.dateFormat('YYYY-MM-DD')('1987-11', 'Birthday').should.equal('Birthday must be a valid date in the format YYYY-MM-DD.');
        Plaits.Validators.dateFormat('YYYY-MM-DD H:m:s')('1987-11-10 25:00:00', 'Birthday').should.equal('Birthday must be a valid date in the format YYYY-MM-DD H:m:s.');
        Plaits.Validators.dateFormat('D/M/Y')('31/11/1987', 'Birthday').should.equal('Birthday must be a valid date in the format D/M/Y.');
        // Done
        done();
    });

    /**
     * Url - Valid
     */
    it('should validate good URL values', function (done) {
        // Functions
        Plaits.Validators.url()('www.github.com').should.equal(true);
        Plaits.Validators.url()('www.github.com/persata/plaits.git').should.equal(true);
        Plaits.Validators.url({require_protocol: true})('http://www.github.com/persata/plaits.git').should.equal(true);
        Plaits.Validators.url('This must be a valid URL.')('www.github.com/persata/plaits.git').should.equal(true);
        Plaits.Validators.url({}, 'This must be a valid URL.')('www.github.com/persata/plaits.git', 'GitHub URL', {}, {}).should.equal(true);
        // Done
        done();
    });

    /**
     * Url - Invalid
     */
    it('should invalidate bad URL values', function (done) {
        // Functions
        Plaits.Validators.url('This must be a valid URL.')('persata', 'GitHub URL', {}, {}).should.equal('This must be a valid URL.');
        Plaits.Validators.url()('persata', 'GitHub URL').should.equal('GitHub URL must be a valid URL.');
        Plaits.Validators.url({require_protocol: true})('www.github.com/persata/plaits.git', 'GitHub URL').should.equal('GitHub URL must be a valid URL.');
        Plaits.Validators.url({protocols: ['http'], require_protocol: true})('www.github.com/persata/plaits.git', 'GitHub URL').should.equal('GitHub URL must be a valid URL.');
        Plaits.Validators.url({protocols: ['http'], require_protocol: true}, 'This must be a valid non-secure URL.')('www.github.com/persata/plaits.git', 'GitHub URL', {}, {}).should.equal('This must be a valid non-secure URL.');
        // Done
        done();
    });

    /**
     * Matching Property - Valid
     */
    it('should validate good matching properties', function (done) {
        new (Plaits.Model.extend({
            name: 'signup',
            fields: [
                'email_address',
                'password',
                'password_confirm'
            ],
            validators: {
                password_confirm: Plaits.Validators.matchProperty('password')
            }
        }))().set({
                password: 'test123',
                password_confirm: 'test123'
            }).validate().then(function (result) {
                // Result
                result.should.equal(true);
            }).then(done, done);
    });

    /**
     * Matching Property - Invalid
     */
    it('should invalidate bad matching properties', function (done) {
        new (Plaits.Model.extend({
            name: 'signup',
            fields: [
                'email_address',
                'password',
                'password_confirm'
            ],
            validators: {
                password_confirm: Plaits.Validators.matchProperty('password')
            }
        }))().set({
            password: 'test123',
            password_confirm: 'test456'
        }).validate().then(function (result) {
            // Result
            result.should.equal(false);
            // Errors
            this.getErrors('password_confirm').should.containEql('The value of Password Confirm must be the same as Password.');
        }).then(done, done);
    });

    /**
     * Int - Valid
     */
    it('should validate good int values', function (done) {
        // Functions
        Plaits.Validators.int()('5').should.equal(true);
        Plaits.Validators.int()(10).should.equal(true);
        // Done
        done();
    });

    /**
     * Int - Invalid
     */
    it('should invalidate bad int values', function (done) {
        // Functions
        Plaits.Validators.int()('Word', 'Your age').should.equal('Your age must be an integer.');
        Plaits.Validators.int()('Not A Number', 'Your age').should.equal('Your age must be an integer.');
        Plaits.Validators.int()('NaN', 'Your age').should.equal('Your age must be an integer.');
        Plaits.Validators.int('{{label}} should be like this: 26')('NaN', 'Your weight', {}, {}).should.equal('Your weight should be like this: 26');
        // Done
        done();
    });

    /**
     * Int - Valid
     */
    it('should validate good float values', function (done) {
        // Functions
        Plaits.Validators.float()('5').should.equal(true);
        Plaits.Validators.float()('5.0').should.equal(true);
        // Done
        done();
    });

    /**
     * Int - Invalid
     */
    it('should invalidate bad float values', function (done) {
        // Functions
        Plaits.Validators.float()('Word', 'Your weight').should.equal('Your weight must be a valid floating point number.');
        Plaits.Validators.float()('Not A Number', 'Your weight').should.equal('Your weight must be a valid floating point number.');
        Plaits.Validators.float()('NaN', 'Your weight').should.equal('Your weight must be a valid floating point number.');
        Plaits.Validators.float('{{label}} should be like this: 54.5')('NaN', 'Your weight', {}, {}).should.equal('Your weight should be like this: 54.5');
        // Done
        done();
    });

});