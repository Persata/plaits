'use strict';

/**
 * File Mappings Config
 * File value mappings go here in order to normalise requests from different file upload libraries.
 * Currently supports multiparty (deprecated) or Multer
 * @type {Object}
 */
var FileFieldMappings = {
    /**
     * Multer
     */
    Multer: {
        originalFilename: 'originalname',
        type: 'mimetype'
    },
    /**
     * Multiparty (Defaults)
     */
    Multiparty: {
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

module.exports = FileFieldMappings;