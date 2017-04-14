import { isValid } from 'shortid';

export default {
  name: 'shortId',
  message: 'needs to be a valid short id string',
  validate: value => isValid(value)
};
