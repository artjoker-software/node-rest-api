import omit from 'lodash/omit';
import sortObjectKeys from '../../utils/general/sortObjectKeys';
import { userDAO } from '../dao';
import { passwordService } from './';
import { usersConstants } from '../../constants';

class UserService {

  userDAO;
  omitKeys = ['password', 'restoring_password', 'last_password_reset', 'twitter_id', 'facebook_id'];

  constructor(DAO) {
    this.userDAO = DAO;
  }

  formatUserResponse = (user, omitKeys = this.omitKeys) => sortObjectKeys(omit(user, omitKeys));

  * createOrUpdate({ password = null, email, ...userData }) {
    const hash = yield passwordService.createPasswordHash(password);
    const user = yield this.userDAO.createOrUpdate({ ...userData, email: email.toLowerCase(), password: hash });
    return this.formatUserResponse(user);
  }

  * load(query) {
    const source = (query.$sort) ? query : { ...usersConstants.defaultUsersParams, ...query };
    const users = yield this.userDAO.load(source);
    return users.map(item => this.formatUserResponse(item));
  }

  * getByEmail(email) {
    const user = yield this.userDAO.loadBy({ email: email.toLowerCase() });
    const omitKeys = this.omitKeys.filter(key => key !== 'password'); // Don't omit password, internal use
    return this.formatUserResponse(user, omitKeys);
  }

  * getByFacebook(id = 0) {
    const user = yield this.userDAO.loadBy({ facebook_id: id });
    return this.formatUserResponse(user);
  }

  * getByTwitter(id = 0) {
    const user = yield this.userDAO.loadBy({ twitter_id: id });
    return this.formatUserResponse(user);
  }

}

export default new UserService(userDAO);
