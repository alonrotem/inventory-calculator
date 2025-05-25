//const { createLogger, format, transports } = require('winston');
const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
/*
{
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}
*/
const logFilesPath = path.join(__dirname, 'logs');

const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logFilesPath, 'romtech-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
});

const get_logger = function (){
  const l = winston.createLogger({
    level: 'debug', // default level
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
    )
  });
  const fileRotateTransport = new winston.transports.DailyRotateFile({
      filename: path.join(logFilesPath, 'romtech-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      options: { flags: 'w' }
  });
  const errorfileRotateTransport  = new winston.transports.DailyRotateFile({
    filename: path.join(logFilesPath, 'errors-log-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    level: 'error',
    options: { flags: 'w' }
  });
  l.add(new winston.transports.Console({ level: 'error' }));
  l.add(fileRotateTransport);
  l.add(errorfileRotateTransport);
  return l;
}

let logger = get_logger();

const closeTransports = function() {
  if(logger) {
    logger.transports.forEach(t => {
      if (t instanceof winston.transports.File || t instanceof  winston.transports.DailyRotateFile) {
        console.log("closing transport " + t.name);
        t.close();
      }
    });
    logger.close();
  }
}

const renew_logger = function (){
  end_logger();
  logger = get_logger();
}

const end_logger = function(){
  if(logger) {
    closeTransports();
    //logger.end();
    logger.close();
  }
}

module.exports =  { 
  logger, 
  closeTransports, 
  renew_logger,
  logFilesPath,
  end_logger
};