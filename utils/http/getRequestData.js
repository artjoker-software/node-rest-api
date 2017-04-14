const getRequestData = (request) => {
  const requestParameters =
    (request.method === 'POST' || request.method === 'PUT') ?
      request.body : request.query;

  const uriParameters = request.params;
  const token = request.headers.access_token;
  const tokenParameters = (token && token !== 'null') ? { access_token: request.headers.access_token } : { };

  return { ...requestParameters, ...uriParameters, ...tokenParameters };
};

export default getRequestData;
