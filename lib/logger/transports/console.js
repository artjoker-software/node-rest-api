import { transports } from 'winston';

const consoleTransport = new (transports.Console)({
  colorize: true
});

export default consoleTransport;
