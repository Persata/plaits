'use strict';

/**
 * File Mappings Config
 * File value mappings go here in order to normalise requests from different file upload libraries.
 * Currently supports bodyparser (deprecated) or Multer
 * @type {Object}
 */
var FileMappings = {
    /**
     * Multer
     */
    Multer: {
        originalFilename: 'originalname',
        type: 'mimetype'
    },
    /**
     * Body Parser (Defaults)
     */
    BodyParser: {
        originalFilename: 'originalFilename',
        type: 'type'
    },
    /**
     * Default
     */
    Default: {
        originalFilename: 'originalFilename',
        type: 'type'
    }
};

module.exports = FileMappings;