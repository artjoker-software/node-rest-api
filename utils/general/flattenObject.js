const flattenObject = (object, prekey = '', ignore = []) => {
  if (!prekey) {
    delete object.created_at;
    delete object.updated_at;
  }

  let flat = {};

  for (const key of Object.keys(object)) {
    const value = object[key];

    if (value === undefined || value === null || key === '_id') {
      continue;
    }

    if (ignore.indexOf(key) !== -1) {
      flat[key] = value;
      continue;
    }

    const newKey = (prekey !== '') ? `${prekey}.${key}` : key;

    if (value.constructor === Array) {
      // for (let idx = 0; idx < value.length; idx += 1) {
      //   flat[newKey + '.' + idx] = value[idx];
      // }
      flat[newKey] = value;
    } else if (typeof value === 'object') {
      flat = { ...flat, ...flattenObject(value, newKey) };
    } else {
      flat[newKey] = value;
    }
  }

  return flat;
};

export default flattenObject;
