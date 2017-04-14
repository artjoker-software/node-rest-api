import co from 'co';
import omit from 'lodash/omit';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { userService, passwordService, tokenService } from '../';
import { AuthorisationError } from '../../../lib/http/errors';

const LOCAL_KEY = 'local';

const localPassportConfig = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
  session: false
};

const localPassportCallback = (request, email, password, done) => co(function* () {
  const user = yield userService.getByEmail(email);

  if (Object.keys(user).length < 1) {
    done(new AuthorisationError('No user with this email'));
  } else {
    yield passwordService.checkPassword(password, user.password);

    // Didn't throw
    user.access_token = yield tokenService.generate(user.id, user.role);
    done(null, omit(user, 'password'));
  }
})
  .catch(err => done(err));

passport.use(LOCAL_KEY, new LocalStrategy(localPassportConfig, localPassportCallback));

export default LOCAL_KEY;
