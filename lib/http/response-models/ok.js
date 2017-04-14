const defaultCollectionResponseModel = collection => (collection);
const defaultObjectResponseModel = data => (data);

export default ({ query, data }) => {
  if (Array.isArray(data)) {
    return defaultCollectionResponseModel(data, query);
  }
  return defaultObjectResponseModel(data);
};
