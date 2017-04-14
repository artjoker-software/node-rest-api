import { object, string } from 'joi';
import extendedString from '../../../utils/joi-extends/string';

const allowUnknown = false;
const password = extendedString().hash().allow(null);
const email = string().email().lowercase();

const baseValidationRules = {
  email,
  first_name: string().allow(''),
  last_name: string().allow(''),
  profile_img: string().uri()
};

export const create = object()
  .keys({
    ...baseValidationRules,
    password,
    twitter_id: extendedString().digits().allow(null),
    facebook_id: extendedString().digits().allow(null),
    email: email.required()
  })
  .xor('password', 'twitter_id', 'facebook_id')
  .with('password', 'email')
  .without('password', ['first_name', 'last_name', 'profile_img'])
  .with('twitter_id', ['first_name', 'profile_img'])
  .with('facebook_id', ['first_name', 'profile_img'])
  .without('twitter_id', 'is_agent')
  .without('facebook_id', 'is_agent')
  .unknown(allowUnknown);

export const load = object()
  .keys({
    $sort: string()
  })
  .unknown(allowUnknown);
