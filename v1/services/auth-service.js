import passport from 'passport';
import { LOCAL_PASSPORT_KEY, FACEBOOK_PASSPORT_KEY, TWITTER_PASSPORT_KEY } from './passport';
import { RequestValidationError } from '../../lib/http/errors';

class AuthService {

  // Note: sessions are required for oAuth 1.0 so they must used for Twitter
  session = false;
  localConfig = { session: this.session, scope: [] };
  socialConfig = { session: this.session, scope: ['email'] };
  socialCallbackConfig = { session: this.session, failureRedirect: '/' };

  sendResponse = ([error, user, info = {}], req, res) =>
    (error || Object.keys(info).length > 0) ?
      res.error(error || new RequestValidationError(info.message)) :
      res.ok(user);

  loginByLocal = (req, res, next) => passport.authenticate(LOCAL_PASSPORT_KEY, this.localConfig,
    (...data) => this.sendResponse(data, req, res))(req, res, next);

  loginBySocial = KEY => passport.authenticate(KEY, this.socialConfig);

  loginBySocialCallback = ([req, res, next], KEY) => passport.authenticate(KEY, this.socialCallbackConfig,
    (...data) => this.sendResponse(data, req, res))(req, res, next);

  loginByFacebook = () => this.loginBySocial(FACEBOOK_PASSPORT_KEY);
  loginByTwitter = () => this.loginBySocial(TWITTER_PASSPORT_KEY);
  loginByFacebookCallback = (...data) => this.loginBySocialCallback(data, FACEBOOK_PASSPORT_KEY);
  loginByTwitterCallback = (...data) => this.loginBySocialCallback(data, TWITTER_PASSPORT_KEY);

}

export default new AuthService();
