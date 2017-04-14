import shortId from 'shortid';
import { sign, verify } from 'jsonwebtoken';
import { auth } from '../../config';
import { TokenValidationError } from '../../lib/http/errors';

class TokenService {

  SECRET = auth.jwt.secret;
  // The order is important the lower it is, the more "Power" it has
  TOKEN_TYPES = {
    PASSWORD: 'passwordToken',
    USER: 'user'
  };
  OPTIONS = {
    expiresIn: auth.jwt.expirationTime,
    issuer: auth.jwt.issuer
  };

  createPayload = (userId, type = this.TOKEN_TYPES.USER) => ({
    type,
    user_id: userId,
    created: Date.now(),
    jti: shortId.generate()
  });

  generate = (userId, type, options = this.OPTIONS) =>
    new Promise((resolve, reject) =>
      sign(this.createPayload(userId, type), this.SECRET, options,
        (err, token) => (err) ? reject(err) : resolve(token)));

  validate = token =>
    new Promise((resolve, reject) =>
      verify(token, this.SECRET, (err, decoded) =>
        (err) ? reject(new TokenValidationError(err.message)) : resolve(decoded)));


}

export default new TokenService();
