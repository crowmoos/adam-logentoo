'use strict'

const ZipCodeController = require('./zipcode.controller');

module.exports = function(server) {
  server.get('/zipcode/:term', ZipCodeController.getZipCodesByTerm);
}
