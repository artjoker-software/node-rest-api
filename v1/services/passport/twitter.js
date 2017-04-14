import co from 'co';
import omit from 'lodash/omit';
import passport from 'passport';
import TwitterStrategy from 'passport-twitter';
import { userService, tokenService } from '../';
import { auth, fullHost } from '../../../config';
import mapPassportData from '../../../utils/general/mapPassportData';

const TWITTER_KEY = 'twitter';
export const callbackURL = `${fullHost}/api/v1/twitter/callback`;

const twitterPassportConfig = {
  consumerKey: auth.twitter.consumerKey,
  consumerSecret: auth.twitter.consumerSecret,
  callbackURL,
  userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
  passReqToCallback: true
};

export const twitterPassportCallback = (request, token, tokenSecret, profile, done) => co(function* () {
  const userData = mapPassportData(profile);
  const user = yield userService.getByTwitter(userData.twitter_id);

  if (Object.keys(user).length > 0) {
    user.access_token = yield tokenService.generate(user.id, user.role);
    done(null, omit(user, 'twitter_id'));
  } else {
    const newUser = yield userService.createOrUpdate(userData);
    done(null, newUser);
  }
})
  .catch(err => done(err));

passport.use(TWITTER_KEY, new TwitterStrategy(twitterPassportConfig, twitterPassportCallback));

export default TWITTER_KEY;
