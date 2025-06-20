const winston = require('winston');
const actions = require('@actions/core');

const loggerFactory = {
    createLogger: () => {
        const input = actions.getInput('log_level');
        const level = (input?.length > 0) ? input : 'info';
        return winston.createLogger({
            level: level,
            format: winston.format.simple(),
            transports: [new winston.transports.Console()]
        });
    }
};

module.exports = loggerFactory;
