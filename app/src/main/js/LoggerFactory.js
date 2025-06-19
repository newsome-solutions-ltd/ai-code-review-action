const winston = require('winston');

const loggerFactory = {
    createLogger: () => {
        const level = (process.env.LOG_LEVEL) ?? 'info'
        return winston.createLogger({
            level: level,
            format: winston.format.simple(),
            transports: [new winston.transports.Console()]
        });
    }
};

module.exports = loggerFactory;
