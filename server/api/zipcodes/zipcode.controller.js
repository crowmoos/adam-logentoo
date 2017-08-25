'use strict'

const errors = require('restify-errors');
const zipCodeCollection = require('./zip.model');

class ZipCodeController {

  getZipCodesByTerm(req, res, next) {
    if (!req.params || !req.params.term) {
      loggerT.error('Invalid request Missing term');
      return next(new errors.MissingParameterError('Missing term'));
    }

    loggerT.info('GetZipCodesByTerm [', req.params.term,']');
    var regex = new RegExp(req.params.term, 'i');
    zipCodeCollection.find({zipCode:regex}, (err, docs) => {
      if (err) {
        loggerT.error('Cannot find Zipcode:', err);
        return next(new errors.RestError(err.errors && err.errors.name && err.errors.name.message));
      }

      return next(docs.map(doc => {
        return {
          zipCode:doc._id,
          name: doc.zipCode.toLowerCase(),
        }
      }));
    });
  }
}

module.exports = new ZipCodeController();
