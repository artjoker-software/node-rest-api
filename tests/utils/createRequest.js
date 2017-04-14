const createMockRequest = (ua, ip) => ({
  headers: {
    ['user-agent']: ua
  },
  connection: {
    remoteAddress: ip
  }
});

export default createMockRequest;
