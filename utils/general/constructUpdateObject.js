const constructUpdateObject = (original, update) => {
  const result = {};

  for (const key of Object.keys(update)) {
    if (update[key] && original[key] === null || original[key] === undefined) {
      result[key] = update[key];
    }
  }

  return result;
};

export default constructUpdateObject;
