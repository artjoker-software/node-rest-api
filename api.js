import express from 'express';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import passport from 'passport';
import { apiPort, apiHost, auth } from './config';
import logger from './lib/logger';

import {
  errorSender,
  requestLogger,
  notFound,
  extendResponse
} from './middleware';

import v1 from './v1/routes';

const isTesting = (process.env.NODE_ENV === 'test');

const app = express();
const MongoStore = connectMongo(session);

// third-party middleware;
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(session({
  ...auth.session,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());

// custom middleware
app.use(requestLogger);
app.use(extendResponse);

// routes
app.use('/v1', v1);

// Only for tests
if (isTesting) {
  app.use('/test-routes', require('./tests/mocks/index')); // eslint-disable-line global-require
}

// throw not found error if no route matched
app.use(notFound);

// send error
app.use(errorSender);

if (apiPort) {
  app.listen(apiPort, (err) => {
    if (!err) {
      console.info('----\n==>    API is running on port %s', apiPort);
      console.info('==>    Send requests to http://%s:%s', apiHost, apiPort);
    } else {
      logger.error(err);
    }
  });
} else {
  logger.error(new Error('ERROR: No PORT environment variable has been specified'));
}

export default app;
