const digitsRegex = /^[0-9]+$/i;

export default {
  name: 'digits',
  message: 'needs to contain only digits [0-9]',
  validate: value => digitsRegex.test(value)
};
