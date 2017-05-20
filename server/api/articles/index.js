'use strict'

const articlesController = require('./article.controller');

module.exports = function(server) {
  server.get('/articles', articlesController.getArticles);
  server.get('/article/:article_id', articlesController.getArticleById);
  server.post('/articles-post', articlesController.getArticlesPostParams);
}
