import co from 'co';
import omit from 'lodash/omit';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { userService, tokenService } from '../';
import { auth, fullHost } from '../../../config';
import mapPassportData from '../../../utils/general/mapPassportData';

const FACEBOOK_KEY = 'facebook';
export const callbackURL = `${fullHost}/api/v1/facebook/callback`;

const facebookPassportConfig = {
  clientID: auth.facebook.appID,
  clientSecret: auth.facebook.appSecret,
  callbackURL,
  profileFields: ['id', 'displayName', 'link', 'photos', 'emails'],
  passReqToCallback: true
};

export const facebookPassportCallback = (request, accessToken, refreshToken, profile, done) => co(function* () {
  const userData = mapPassportData(profile);
  const user = yield userService.getByFacebook(userData.facebook_id);

  if (Object.keys(user).length > 0) {
    user.access_token = yield tokenService.generate(user.id, user.role);
    done(null, omit(user, 'facebook_id'));
  } else {
    const newUser = yield userService.createOrUpdate(userData);
    done(null, newUser);
  }
})
  .catch(err => done(err));

passport.use(FACEBOOK_KEY, new FacebookStrategy(facebookPassportConfig, facebookPassportCallback));

export default FACEBOOK_KEY;
