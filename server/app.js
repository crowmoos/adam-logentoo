'use strict'

const restify       = require('restify');
const bunyan        = require('bunyan');
const bunyanWinston = require('bunyan-winston-adapter');
const mongoose      = require('mongoose');

const config        = require('./config');
const loggerConf    = require('./config/logger.js');

let server;
let db;

loggerConf.initLogger();

server = restify.createServer({
  name    : config.name,
  version : config.version,
  log     : bunyanWinston.createAdapter(loggerT),
});

server.use(restify.jsonBodyParser({ mapParams: true }));
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser({ mapParams: true }));
server.use(restify.fullResponse());

server.on('uncaughtException', (req, res, route, err) => {
    loggerT.error(err.stack);
    res.send(err);
});

server.listen(config.port, function() {
    mongoose.connection.on('error', function(err) {
        loggerT.error('Mongoose default connection error: ', err);
        process.exit(1);
    })

    mongoose.connection.on('open', function(err) {
        if (err) {
            loggerT.error('Mongoose default connection error: ', err);
            process.exit(1);
        }

        loggerT.info(
            '%s v%s ready to accept connections on port %s in %s environment.',
            server.name,
            config.version,
            config.port,
            config.env
        );

        require('./routes')(server);
    });

    db = mongoose.connect(config.db.uri);
});
