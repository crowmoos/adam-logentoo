'use strict'

module.exports = function(server) {
  require('../api/articles')(server);
  require('../api/zipcodes')(server);
}
