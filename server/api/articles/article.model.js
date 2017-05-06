const mongoose = require('mongoose')

let articleModel = new mongoose.Schema({
    links: {
        title: String,
        imgSrc: String,
        link: String,
        price : String,
        city : String,
        rooms : Number,
        surface : Number
    },
    status: {
        enum: ['pending', 'complete', 'overdue']
    },
}, { minimize: false })

;
module.exports = mongoose.model('link', articleModel);
