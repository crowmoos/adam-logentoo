'use strict'

const errors = require('restify-errors');
const articlesCollection = require('./article.model');

const SORTING = {
  PRICE: 'price',
  SURFACE: 'surface',
  ROOMS: 'rooms',
  DECREMENTAL:-1,
  INCREMENTAL: 1,
};

const ARTICLE_TYPE = {
  STUDIO: 0,
  APPARTEMENT: 1,
  MAISON: 2,
  GARAGE: 3,
  OTHERS: 4,
};

class ArticlesController {
  getArticles(req, res, next) {
    articlesCollection.find({}, (err, docs) => {
      if (err) {
        loggerT.error(err);
        return next(new errors.RestError(err.errors.name.message));
      }

      next(docs);
    });
  }

  getArticleById(req, res, next) {
    if (! req.params || !req.params.article_id) {
      return next(new errors.MissingParameterError('missing article_id'));
    }

    articlesCollection.findOne({ _id: req.params.article_id }, (err, doc) => {
      if (err) {
        return next(new errors.RestError(err.errors.name.message));
      }

      next(doc);
    });
  }

  getArticlesPostParams(req, res, next) {
    let articleTypes = [],
        priceQuery,
        zipCodesList,
        query,
        sortBy,
        isPro,
        isPerso
    ;

    loggerT.info(req.params);

    if (!req.params) {
      loggerT.errror('bad request missing params');
      return next(new errors.MissingParameterError('bad request missing params'));
    }

    isPro = req.params.isPro + 0 ;
    isPerso = req.params.isPerso + 0 ;

    req.params.isStudio && articleTypes.push(ARTICLE_TYPE.STUDIO);
    req.params.isMaison && articleTypes.push(ARTICLE_TYPE.MAISON);
    req.params.isAppart && articleTypes.push(ARTICLE_TYPE.APPARTEMENT);
    req.params.isGarage && articleTypes.push(ARTICLE_TYPE.GARAGE);

    switch (req.params.sort) {
      case SORTING.PRICE:
        sortBy = { price: SORTING.INCREMENTAL}
        break;
      case SORTING.SURFACE:
        sortBy = { surface: SORTING.DECREMENTAL}
        break;
      case SORTING.ROOMS:
        sortBy = { rooms: SORTING.DECREMENTAL}
        break;
      default:
        sortBy = { date : SORTING.DECREMENTAL};
    }

    query = {
        '$or':[{'isPerso': isPerso},{'isPro': isPro}],
        'type' : {'$in' : articleTypes},
      }
    ;

    if (req.params.zipCodes && req.params.zipCodes.length > 0) {
      zipCodesList = req.params.zipCodes;
      query.zipCode = {'$in' : zipCodesList};
    }

    if (req.params.price) {
      priceQuery = {};
      if (req.params.price.lower) {
        priceQuery['$gt'] = req.params.price.lower;
      }

      if (req.params.price.upper) {
        priceQuery['$lt'] = req.params.price.upper;
      }

      query.price = priceQuery;
    }

    if (req.params.nbrRooms && req.params.nbrRooms.length !== 0) {
      query.rooms = {'$in' : req.params.nbrRooms.map(elm => parseInt(elm))};
    }

    articlesCollection.find(query, (err, doc) => {
      if (err) {
        return next(new errors.InvalidContentError(err));
      }

      res.send(doc);
      next();
    }).sort(sortBy);
  }
}

module.exports = new ArticlesController();
