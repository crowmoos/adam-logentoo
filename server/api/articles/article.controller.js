'use strict'

const errors = require('restify-errors');
const articlesCollection = require('./article.model');
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

  getArticlePostParams(req, res, next) {
    articlesCollection.findOne(req.params, (err, doc) => {
      if(err) {
        return next(new errors.InvalidContentError(err.errors.name.message));
      }
      res.send(doc);
      next();
    });
  }



}

module.exports = new ArticlesController();
