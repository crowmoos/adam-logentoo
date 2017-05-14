const mongoose = require('mongoose')

let zipModel = new mongoose.Schema({
        _id: Number,
        zipCode: String,
  }, { minimize: false })
;

module.exports = mongoose.model('zip', zipModel);
