import createMockRequest from '../utils/createRequest';

const mockAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko';
const mockIp = '91.222.248.14';
const mockRequest = createMockRequest(mockAgent, mockIp);

export default mockRequest;

export const emptyRequest = createMockRequest();
