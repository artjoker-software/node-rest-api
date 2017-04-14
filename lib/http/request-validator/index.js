import string from '../../../utils/joi-extends/string';

export { default as validator } from './validator';
export const id = string().required().shortId();
