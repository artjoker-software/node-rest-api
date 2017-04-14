import { assert } from 'chai';
import mapPassportData from '../../../utils/general/mapPassportData';

describe('Map passport data suite', () => {
  it('maps twitter passport data', () => {
    const twitterData = {
      id: '3544358716',
      username: 'ArtjokerUser',
      displayName: ' John   Smith ',
      emails: [{ value: 'johnsmith@gmail.com' }],
      photos: [{ value: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_3_normal.png' }],
      provider: 'twitter'
    };

    const output = {
      twitter_id: '3544358716',
      email: 'johnsmith@gmail.com',
      first_name: 'John',
      last_name: 'Smith',
      profile_img: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_3_normal.png'
    };

    assert.deepEqual(mapPassportData(twitterData), output);
  });

  it('maps facebook passport data', () => {
    const facebookData = {
      id: '1764717173787085',
      username: undefined,
      displayName: ' Jane   Hopkins',
      name: {
        familyName: undefined,
        givenName: undefined,
        middleName: undefined
      },
      gender: undefined,
      profileUrl: 'https://www.facebook.com/app_scoped_user_id/1764717173787085/',
      emails: [{ value: 'johnnysmith@gmail.com' }],
      photos: [{ value: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=b1d33c3a4d6d57cbfe57dbee85ceef4b&oe=5873202F' }],
      provider: 'facebook'
    };

    const output = {
      facebook_id: '1764717173787085',
      email: 'johnnysmith@gmail.com',
      first_name: 'Jane',
      last_name: 'Hopkins',
      profile_img: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=b1d33c3a4d6d57cbfe57dbee85ceef4b&oe=5873202F'
    };

    assert.deepEqual(mapPassportData(facebookData), output);
  });
});
