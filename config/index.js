const PORTS = {
  development: 3030,
  test: 9000
};

export const hostNames = {
  local: 'http://localhost:3000',
  development: 'https://dev.artjoker.ua',
  staging: 'https://staging.artjoker.ua',
  production: 'https://api.artjoker.ua'
};

export const fullHost = hostNames[process.env.NODE_ENV || 'local'];

export const apiPort = process.env.PORT || PORTS[process.env.NODE_ENV] || 3030;
export const apiHost = process.env.HOST || 'localhost';

export const auth = {

  base: {
    headers: {
      accessToken: 'access_token'
    }
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'projectjwtsecret',
    expirationTime: '30 days',
    issuer: 'Artjoker'
  },

  session: {
    secret: process.env.SESSION_SECRET || 'projectsessionsecret',
    resave: false,
    saveUninitialized: false
  },

  logger: {},

  // https://developers.facebook.com/
  facebook: {
    appID: process.env.FACEBOOK_APP_ID || 'facebook-mock',
    appSecret: process.env.FACEBOOK_APP_SECRET || 'facebook-mock'
  },

  // https://apps.twitter.com/
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY || 'twitter-mock',
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || 'twitter-mock'
  }
};
