import winston from 'winston';
import consoleTransport from './transports/console';

const transports = [];
const shouldLog = (process.argv[process.argv.length - 1] === 'log');
const isTesting = (process.env.NODE_ENV === 'test');

// Logging to console is a synchronous operation
if ((isTesting && shouldLog) || !isTesting) {
  // TODO: Do not log in production to console
  // Log to console if the flag is passed in cmd in testing or in any other environment
  transports.push(consoleTransport);
}

const logger = new winston.Logger({ transports });

export default logger;
