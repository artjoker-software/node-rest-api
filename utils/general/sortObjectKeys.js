const excludeKeys = ['id', 'created_at', 'updated_at'];

const sortObjectKeys = (object = {}) => {
  const sorted = {};

  if (object && object.constructor === Object) {
    const keys = Object.keys(object).filter(key => excludeKeys.indexOf(key) === -1).sort();

    if (object.id) {
      sorted.id = object.id;
    }

    for (const key of keys) {
      sorted[key] = object[key];
    }

    if (object.created_at) {
      sorted.created_at = object.created_at;
    }

    if (object.updated_at) {
      sorted.updated_at = object.updated_at;
    }
  }

  return sorted;
};

export default sortObjectKeys;
