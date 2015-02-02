Plaits
=========

[![Build Status](https://travis-ci.org/Persata/plaits.svg)](https://travis-ci.org/Persata/plaits)
[![Dependency Status](https://gemnasium.com/Persata/plaits.svg)](https://gemnasium.com/Persata/plaits)
[![Coverage Status](https://img.shields.io/coveralls/Persata/plaits.svg)](https://coveralls.io/r/Persata/plaits?branch=master)

Plaits is a form creation, validation and rendering library for Node.js.

It supports both synchronous and asynchronous validation (via [Promises](https://github.com/petkaantonov/bluebird/)), and comes with many built-in validators, many of which are provided
by the excellent [validator.js library](https://github.com/chriso/validator.js). Plaits also supports file upload validation, including size and MIME-Type checking.

It is intended for use with [Express](http://expressjs.com/), but can be used with other libraries and frameworks too.

For the full documentation, please visit [http://persata.github.io/plaits/](http://persata.github.io/plaits/).

Plaits is inspired by the form validation features found in frameworks such as [.NET MVC](http://www.asp.net/mvc/mvc4),
and thanks goes to the great work done on the [Bookshelf ORM](https://github.com/tgriesser/bookshelf) for additional inspiration and helping with some underlying code principles.

The source is available on [GitHub](https://github.com/Persata/plaits), and it comes with a large suite of [unit tests](https://travis-ci.org/Persata/plaits).

Example Model
-------------

```javascript
// Require Plaits
var Plaits = require('plaits');

// Register Form Declaration
var RegisterForm = Plaits.Model.extend(
  {
    // Form Name
    name: 'register_form',
    // Field List
    fields: [
      'username',
      'email_address',
      'password',
      'confirm_password',
      'avatar'
    ],
    // Validators
    validators: {
      username: [
        Plaits.Validators.required(),
        Plaits.Validators.alphanumeric()
      ],
      email_address: [
        Plaits.Validators.required(),
        Plaits.Validators.email()
      ],
      password: [
        Plaits.Validators.required(),
        Plaits.Validators.minLength(8)
      ],
      confirm_password: [
        Plaits.Validators.matchProperty('password')
      ],
      avatar: [
        Plaits.Validators.File.required(),
        Plaits.Validators.File.maxSize('120kB'),
        Plaits.Validators.File.mimeTypes(['image/*'])
      ]
    }
  }
);

// Export Form
module.exports = RegisterForm;
```
