class RequestLoggerTestController {

  requestBodyTest(req, res) {
    return res.send('OK');
  }

  requestParamsTest(req, res) {
    return res.send('OK');
  }

  requestQueryTest(req, res) {
    return res.send('OK');
  }
}

export default new RequestLoggerTestController();
