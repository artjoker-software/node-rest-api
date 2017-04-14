import BaseController from '../../lib/base/baseController';
import { userService } from '../services';
import { requestValidation } from '../../lib/decorators';
import { userSchema } from './validation-schemas';

const validationRules = {
  create: userSchema.create,
  load: userSchema.load
};

@requestValidation(validationRules)
class UserController extends BaseController {

  * create({ body }, response) {
    const user = yield this.service.createOrUpdate(body);
    return response.ok(user);
  }

}

export default new UserController(userService);
