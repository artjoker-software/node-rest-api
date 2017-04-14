const hashRegex = /^[a-z0-9-]+$/i;
const hashLength = 64;

export default {
  name: 'hash',
  message: `needs to be a ${hashLength}-character hashed user password`,
  validate: value => value.length === hashLength && hashRegex.test(value)
};
