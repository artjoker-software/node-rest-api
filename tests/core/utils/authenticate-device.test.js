import co from 'co';
import { assert } from 'chai';
import { stub } from 'sinon';
import timekeeper from 'timekeeper';
import axios from 'axios';
import authenticateDevice from '../../../utils/http/authenticateDevice';
import createMockRequest from '../../utils/createRequest';

describe('Device authenticator suite', () => {
  const agents = {
    chromeMac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36',
    chromeWin: 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2224.3 Safari/537.36',
    chromeLinux: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.517 Safari/537.36',
    safariMac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A',
    firefoxUbuntu: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:24.0) Gecko/20100101 Firefox/24.0',
    ieWin: 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko',
    iosSafari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
    iosChrome: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 5_1_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3',
    androidChrome: 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'
  };

  const ips = {
    london: '131.228.17.26',
    kharkiv: '91.222.248.14',
    telaviv: '62.219.130.183'
  };

  it('returns the device data from request', () => co(function* () {
    const loginDate = new Date();
    timekeeper.freeze(loginDate);

    const empty = yield authenticateDevice(createMockRequest(''));
    assert.deepEqual(empty, {
      browser: 'Other',
      os: 'Other',
      device: 'Other',
      ip: null,
      location: null,
      loginDate
    }, 'Wrong default output');

    const chromeMac = yield authenticateDevice(createMockRequest(agents.chromeMac));
    assert.deepEqual(chromeMac, {
      browser: 'Chrome 41.0.2227',
      os: 'Mac OS X 10.10.1',
      device: 'Other',
      ip: null,
      location: null,
      loginDate
    }, 'Wrong chrome + mac device');

    const chromeWin = yield authenticateDevice(createMockRequest(agents.chromeWin));
    assert.deepEqual(chromeWin, {
      browser: 'Chrome 41.0.2224',
      os: 'Windows XP',
      device: 'Other',
      ip: null,
      location: null,
      loginDate
    }, 'Wrong chrome + win device');

    const chromeLinux = yield authenticateDevice(createMockRequest(agents.chromeLinux));
    assert.deepEqual(chromeLinux, {
      browser: 'Chrome 33.0.1750',
      os: 'Linux',
      device: 'Other',
      ip: null,
      location: null,
      loginDate
    }, 'Wrong chrome + linux device');

    const ieWin = yield authenticateDevice(createMockRequest(agents.ieWin));
    assert.deepEqual(ieWin, {
      browser: 'IE 11.0.0',
      os: 'Windows 7',
      device: 'Other',
      ip: null,
      location: null,
      loginDate
    }, 'Wrong ie + win device');

    const safariMac = yield authenticateDevice(createMockRequest(agents.safariMac));
    assert.deepEqual(safariMac, {
      browser: 'Safari 7.0.3',
      os: 'Mac OS X 10.9.3',
      device: 'Other',
      ip: null,
      location: null,
      loginDate
    }, 'Wrong safari + mac device');

    const firefoxUbuntu = yield authenticateDevice(createMockRequest(agents.firefoxUbuntu));
    assert.deepEqual(firefoxUbuntu, {
      browser: 'Firefox 24.0.0',
      os: 'Ubuntu',
      device: 'Other',
      ip: null,
      location: null,
      loginDate
    }, 'Wrong firefox + ubuntu device');

    const iosSafari = yield authenticateDevice(createMockRequest(agents.iosSafari));
    assert.deepEqual(iosSafari, {
      browser: 'Mobile Safari 6.0.0',
      os: 'iOS 6.0.0',
      device: 'iPhone',
      ip: null,
      location: null,
      loginDate
    }, 'Wrong safari + iOS device');

    const iosChrome = yield authenticateDevice(createMockRequest(agents.iosChrome));
    assert.deepEqual(iosChrome, {
      browser: 'Chrome Mobile iOS 19.0.1084',
      os: 'iOS 5.1.1',
      device: 'iPhone',
      ip: null,
      location: null,
      loginDate
    }, 'Wrong chrome + iOS device');

    const androidChrome = yield authenticateDevice(createMockRequest(agents.androidChrome));
    assert.deepEqual(androidChrome, {
      browser: 'Chrome Mobile 18.0.1025',
      os: 'Android 4.0.4',
      device: 'Samsung Galaxy Nexus',
      ip: null,
      location: null,
      loginDate
    }, 'Wrong chrome + android device');

    timekeeper.reset();
  }));

  it('returns IP data and location of the request', function () {
    this.timeout(3000);

    return co(function* () {
      const londonData = yield authenticateDevice(createMockRequest(undefined, ips.london));
      assert.equal(londonData.ip, ips.london);
      assert.deepEqual(londonData.location.country_name, 'United Kingdom');

      const kharkivData = yield authenticateDevice(createMockRequest(undefined, ips.kharkiv));
      assert.equal(kharkivData.ip, ips.kharkiv);
      assert.deepEqual(kharkivData.location.city, 'Kharkiv');
      assert.deepEqual(kharkivData.location.country_name, 'Ukraine');

      const telAvivData = yield authenticateDevice(createMockRequest(undefined, ips.telaviv));
      assert.equal(telAvivData.ip, ips.telaviv);
      assert.deepEqual(telAvivData.location.country_name, 'Israel');
    });
  });

  it('catches synthetic errors while getting a location', () => co(function* () {
    const requestStub = stub(axios, 'get', () => Promise.reject({ data: new Error('Mock') }));
    const londonData = yield authenticateDevice(createMockRequest(undefined, ips.london));
    axios.get.restore();

    assert.isTrue(requestStub.calledOnce);
    try {
      yield requestStub.firstCall.returnValue;
      throw new Error('Should not execute');
    } catch (err) {
      assert.equal(err.data.message, 'Mock');
    }
    assert.equal(londonData.ip, ips.london);
    assert.isNull(londonData.location);
  }));
});
