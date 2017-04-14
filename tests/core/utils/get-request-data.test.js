import { assert } from 'chai';
import { getRequestData } from '../../../utils/http';

describe('Get request data util', () => {
  const mockRequestWithGETmethod = {
    query: {
      param1: 'val1'
    },
    params: {
      param3: 'val3'
    },
    headers: {},
    method: 'GET'
  };

  const mockRequestWithPOSTTmethod = {
    body: {
      param2: 'val2'
    },
    params: {
      param3: 'val3'
    },
    headers: {},
    method: 'POST'
  };

  it('get request data of GET method', () => {
    assert.deepEqual(getRequestData(mockRequestWithGETmethod), { ...mockRequestWithGETmethod.query, ...mockRequestWithGETmethod.params });
  });

  it('get request data of POST method', () => {
    assert.deepEqual(getRequestData(mockRequestWithPOSTTmethod), { ...mockRequestWithPOSTTmethod.body, ...mockRequestWithPOSTTmethod.params });
  });
});
