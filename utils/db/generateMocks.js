import fs from 'fs';
import { omit } from 'lodash';
import users from '../../docs/db-snippets/users.json';

const filepath = './docs/mocks'; // absoulte path
const usersPath = `${filepath}/users-mock.json`;
const omitUserKeys = ['password', 'restoring_password', 'twitter_id', 'facebook_id'];

// Base functions
const saveToFile = (name, path, data) =>
  fs.writeFile(path, data, err => (err) ?
    console.error(err) :
    console.log(`Successfully saved formatted ${name} to ${path}`)
  );

const toISO = value => new Date(value || {}).toISOString();

const formatBaseTimestamps = object => ({
  updated_at: toISO(object.updated_at),
  created_at: toISO(object.created_at)
});

// Formatting functions
const formatUserMock = user => omit({
  ...user,
  ...formatBaseTimestamps(user)
}, ...omitUserKeys);

// Data
const formattedUsers = users
  .sort((one, two) => new Date(two.created_at) - new Date(one.created_at))
  .map(formatUserMock);

// JSON
const usersJson = JSON.stringify(formattedUsers, (key, value) => (key === 'phone_number') ? value.toString() : value);

// Save files
const saveSequence = [{
  name: 'users',
  path: usersPath,
  value: usersJson
}];

// Save operations
saveSequence.forEach(({ name, path, value }) => saveToFile(name, path, value));
