const winston = require('winston');

const initLogger = () => {
  winston.loggers.add('tech', {
    console: {
      level: 'info',
      colorize: true,
      prettyPrint: true,
      timestamp: true
    },
    file: {
      filename: './logs/Techlogs.txt'
    }
  });

  global.loggerT = winston.loggers.get('tech');
}

module.exports.initLogger = initLogger;
