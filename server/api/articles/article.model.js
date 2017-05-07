const mongoose = require('mongoose')

let articleModel = new mongoose.Schema({
    articles: {
        title: String,
        imgSrc: String,
        link: String,
        price : Number,
        city : String,
        zipCode: Number,
        rooms : Number,
        surface : Number,
        isPro: Number,
        isPerso: Number,
    },
    status: {
        enum: ['pending', 'complete', 'overdue']
    },
  }, { minimize: false })
;
  module.exports = mongoose.model('article', articleModel);
