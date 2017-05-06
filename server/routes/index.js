'use strict'

// app.use('/api/genericCycle', require('./api/genericCycle'));

module.exports = function(server) {
  require('../api/articles')(server);
}
