import HTTP_STATUS_CODES from 'http-status-codes';

export default ({ name, status, message, details }) => ({
  status: status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
  name,
  message,
  details
});
