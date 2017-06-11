'use strict'

const errors = require('restify-errors');
const articlesCollection = require('./article.model');
const winston = require('winston');
const DECREMENTAL = -1;
const INCREMENTAL = 1;

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

class ArticlesController {
  constructor() {
  }

  getArticles(req, res, next) {
    articlesCollection.find({}, (err, docs) => {
      if(err) {
        log.error(err);
        return next(new errors.InvalidContentError(err.errors.name.message));
      }
      res.json(docs);
      next();
    });
  }

  getArticleById(req, res, next) {
    articlesCollection.findOne({ _id: req.params.article_id }, (err, doc) => {
      if(err) {
        return next(new errors.InvalidContentError(err.errors.name.message));
      }
      res.send(doc);
      next();
    });
  }

  getArticlesPostParams(req, res, next) {
    let typeLocation = [];
    let zipCodesQuery = {};
    let query;
    let sortBy = { date : DECREMENTAL};

    if(!req.params) {
      res.status(500).json({error:'bad request missing params'});
      return;
    }

    let isPro = req.params.isPro + 0 ;
    let isPerso = req.params.isPerso + 0 ;

    if(req.params.isStudio) {
      typeLocation.push(0);
    }
    if(req.params.isMaison) {
      typeLocation.push(1);
    }
    if(req.params.isAppart) {
      typeLocation.push(2);
    }
    if(req.params.isGarage) {
      typeLocation.push(3);
    }

    query = {
        '$or':[{'isPerso': isPerso},{'isPro': isPro}],
        'type' : {'$in' : typeLocation},
      }
    ;

    if(req.params.zipCodes && req.params.zipCodes.length > 0) {
      let zipCodesList = req.params.zipCodes;
      query.zipCode = {'$in' : zipCodesList};
    }

    if(req.params.price) {
      let priceQuery = {};
      if(req.params.price.lower) {
        priceQuery['$gt'] = req.params.price.lower;
      }
      if(req.params.price.upper) {
        priceQuery['$lt'] = req.params.price.upper;
      }
      query.price = priceQuery;
    }

    if(req.params.nbrRooms && req.params.nbrRooms.length !== 0) {
      query.rooms = {'$in' : req.params.nbrRooms.map(elm => parseInt(elm))};
    }



    articlesCollection.find(query, (err, doc) => {
      if(err) {
        return next(new errors.InvalidContentError(err));
      }
      res.send(doc);
      next();
    }).sort(sortBy);
  }

}

module.exports = new ArticlesController();
