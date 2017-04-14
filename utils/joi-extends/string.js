import Joi, { string } from 'joi';
import extensions from './string-extensions';


const language = {};
for (const extension of extensions) {
  language[extension.name] = extension.message;
}

const rules = extensions.map(extension => ({
  name: extension.name,
  validate(params, value, state, options) {
    return (extension.validate(value)) ? value : this.createError(`string.${extension.name}`, { v: value }, state, options);
  }
}));

const customJoi = Joi.extend({
  base: string(),
  name: 'string',
  language,
  rules
});

export default customJoi.string;
