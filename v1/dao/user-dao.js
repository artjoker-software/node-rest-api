import BaseDAO from '../../lib/base/baseDAO';
import { User } from '../models';
import { tokenService } from '../services';
import { RequestValidationError } from '../../lib/http/errors';
import constructUpdateObject from '../../utils/general/constructUpdateObject';

class UserDAO extends BaseDAO {

  * createOrUpdate(params) {
    const prev = yield this.getByEmail(params.email);
    let result = null;

    if (Object.keys(prev).length < 1) {
      // Sign up
      result = yield this.daoProxy.create(params);
    } else {
      // Check if it's a sign-in request (has password)
      if (prev.password && params.password) {
        throw new RequestValidationError('User with this email has already been registered.');
      }

      // Login
      const data = constructUpdateObject(prev, params);
      result = (Object.keys(data).length > 0) ?
        yield this.update({ id: prev.id, ...data }) :
        prev;
    }


    result.access_token = yield tokenService.generate(result.id, result.role);

    return result;
  }

  * getByEmail(email) {
    return yield this.daoProxy.loadBy({ email });
  }

}

export default new UserDAO(User);
