// Need to paste the value of this variable to http://www.json-generator.com/ to generate users.
// Returns an JSON array of 50 random users
// It should be minified with http://www.tutorialspoint.com/online_json_minifier.htm
// before saving it to ./users.json

const mockScript = [
  '{{repeat(50)}}',
  {
    id: function() {
      var possible = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0-_";
      var length = 7;
      var res = '';

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }

      function getRandomSymbol() {
        return possible[getRandomInt(0, possible.length - 1)];
      }

      for (var i = 0; i < length; i += 1) {
        res += getRandomSymbol();
      }

      return res;
    },
    password: function() {
      var possible = "qwertyuiopasdfghjklzxcvbnm0123456789-";
      var length = 64;
      var res = '';

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }

      function getRandomSymbol() {
        return possible[getRandomInt(0, possible.length - 1)];
      }

      for (var i = 0; i < length; i += 1) {
        res += getRandomSymbol();
      }

      return res;
    },
    first_name: '{{firstName()}}',
    last_name: '{{surname()}}',
    email: '{{email()}}',
    twitter_id: '{{random(integer(1000000000, 9999999999), null)}}',
    facebook_id: '{{random(integer(100000000000000, 100001000000000), null)}}',
    profile_img: 'https://placeimg.com/250/250/people',
    is_activated:'{{bool()}}',
    restoring_password: false,
    updated_at: '{{integer(1471344000000, 1471345000000)}}',
    created_at: '{{integer(1471344000000, 1471345000000)}}'
  }
];

export default mockScript;
