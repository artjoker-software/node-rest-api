import co from 'co';
import axios from 'axios';
import omit from 'lodash/omit';
import useragent from 'useragent';
import ipregex from 'ip-regex';
import { getClientIp } from 'request-ip';
import logger from '../../lib/logger';

const ipRegEx = ipregex(({ exact: true }));
const omitLocationKeys = ['metro_code', 'country_code', 'region_code', 'zip_code', 'ip'];
const locationProviderUrl = 'http://freegeoip.net/json/';

const getLocation = ip =>
  new Promise((resolve, reject) =>
    axios.get(locationProviderUrl + ip)
      .then(res => resolve(res.data))
      .catch(err => reject(err.data)));

const getVersionString = agent =>
  (agent.family === 'Other') ? // eslint-disable-line no-nested-ternary
    agent.family :
    (+agent.major) ?
      `${agent.family} ${agent.major}.${agent.minor}.${agent.patch}` :
      agent.family;

const authenitcateDevice = request => co(function* () {
  let location = null;
  const agent = useragent.parse(request.headers['user-agent']);
  const ip = getClientIp(request);

  if (ipRegEx.test(ip)) {
    try {
      location = yield getLocation(ip);
    } catch (err) {
      logger.error(`Couldn't get the location for the ip ${ip}:`, err);
    }
  }

  return {
    ip,
    browser: getVersionString(agent),
    os: getVersionString(agent.os),
    device: getVersionString(agent.device),
    location: (location) ? omit(location, omitLocationKeys) : null,
    loginDate: new Date()
  };
});

export default authenitcateDevice;
