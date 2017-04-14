import validate from 'mongoose-validator';

export const email = [
  validate({
    validator: 'isEmail',
    message: 'Email is invalid, got {VALUE}'
  })
];

export default email;
