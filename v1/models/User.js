import mongoose, { Schema } from 'mongoose';
import { id, defaultSchemaOptions } from '../../database';
import { validateUser } from './validators';

export const UserSchemaObject = {
  id,
  email: {
    type: String,
    unique: true,
    required: true,
    validate: validateUser.email
  },
  password: {
    type: String,
    default: null
  },
  is_activated: {
    type: Boolean,
    default: false
  },
  restoring_password: {
    type: Boolean,
    default: false
  },
  last_password_reset: {
    type: Date,
    default: 0
  },
  first_name: String,
  last_name: String,
  profile_img: {
    type: String,
    default: null
  },
  twitter_id: {
    type: String,
    unique: true
  },
  facebook_id: {
    type: String,
    unique: true
  }

};

const UserSchema = new Schema(UserSchemaObject, defaultSchemaOptions);

const User = mongoose.model('User', UserSchema);

export default User;
