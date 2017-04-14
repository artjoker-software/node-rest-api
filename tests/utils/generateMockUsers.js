import co from 'co';
import { assert } from 'chai';
import { tokenService, passwordService } from '../../v1/services';
import userMocks from '../../docs/db-snippets/users.json';

const expireOptions = { expiresIn: '5s' };
const usersDB = userMocks.map(user => ({ ...user }));

export const getUnassignedToken = () => tokenService.generate(null, tokenService.TOKEN_TYPES.ADMIN, expireOptions);

export const generateUserTokens = (all = false) => co(function* () {
  const tokens = [];

  assert.equal(tokens.length, 0);
  assert.equal(usersDB.length, 50);

  const length = (all) ? usersDB.length : 2;

  for (let idx = 0; idx < length; idx += 1) {
    const token = yield tokenService.generate(userMocks[idx].id, tokenService.TOKEN_TYPES.USER, expireOptions);
    tokens.push(token);
  }

  assert.equal(tokens.length, length);

  return tokens;
});

export const generateMockUsers = (passwords = false) => co(function* () {
  const users = [];

  assert.equal(users.length, 0);
  assert.equal(usersDB.length, 50);

  for (let idx = 0; idx < usersDB.length; idx += 1) {
    const password = (passwords) ? yield passwordService.createPasswordHash(userMocks[idx].password) : userMocks[idx].password;

    users.push({ ...userMocks[idx], password });
  }

  // Ensure that users[1] has a password and email fields, prevent mutation
  let index = 1;
  const userWithPassword = { ...userMocks.find(({ password, email }, idx) => {
    let result = false;
    if (idx > 0) {
      index = idx;
      result = !!(password) && !!(email);
    }
    return result;
  }) };

  if (!userWithPassword) {
    throw new Error('Regenerate the user mocks');
  }

  // Generate credentials
  userWithPassword.password = (passwords) ? yield passwordService.createPasswordHash(userWithPassword.password) : userWithPassword.password;

  // Swap
  users[index] = users[1];
  users[1] = userWithPassword;

  assert.equal(users.length, usersDB.length);

  return users;
});
