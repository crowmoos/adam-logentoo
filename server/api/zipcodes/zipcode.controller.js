'use strict'

const errors = require('restify-errors');
const zipCodeCollection = require('./zip.model');
const winston = require('winston');

const log = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            timestamp: () => {
                return new Date().toString()
            },
            json: true
        }),
    ]
})
;

class ZipCodeController {
  constructor() {
  }

  getZipCodesByTerm(req, res, next) {
    var regex = new RegExp(req.params.term, 'i');
    zipCodeCollection.find({zipCode:regex}, (err, docs) => {
      if(err) {
        log.error(err);
        return next(new errors.InvalidContentError(err.errors.name.message));
      }
      res.send(docs.map(doc => {
        return {
          zipCode:doc._id,
          name: doc.zipCode.toLowerCase()
        }
      }));
      next();
    });
  }

}

module.exports = new ZipCodeController();
