#!/usr/bin/env node
if (process.env.NODE_ENV === 'local') {
  const pipingOptions = { hook: true, ignore: /(\/\.|~$|\.json$)/i };
  const piping = require('piping')(pipingOptions); // eslint-disable-line global-require
  console.log((piping) ? 'Piping is watching for changes' : 'Piping failed to load');
}

require('babel-register');
require('./../api');

if (!process.env.NODE_ENV) {
  console.error('Environment variable was not set');
}
