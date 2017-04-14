import { hash, compare } from 'bcrypt';
import { AuthorisationError } from '../../lib/http/errors';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

class PasswordService {

  createPasswordHash = (password = null) =>
    (password) ?
      new Promise((resolve, reject) =>
        hash(password, getRandomInt(8, 11), (err, hashed) =>
          err ? reject(err) : resolve(hashed))) :
      Promise.resolve(null);

  checkPassword = (password, hashed) =>
    new Promise((resolve, reject) =>
      compare(password, hashed, (err, res) => (err) ? // eslint-disable-line no-nested-ternary
        reject(err) :
        (!res) ?
          reject(new AuthorisationError('Wrong password')) :
          resolve(res)));

}

export default new PasswordService();
