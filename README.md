# Artjoker's Node.js REST API

This project contains a core API structure, based on [Service Oriented Architechture.](https://en.wikipedia.org/wiki/Service-oriented_architecture)  
It utilizes the latest features of JavaScript (ES6/ES7) using runtime babel transpilation and generators to synchronize the asynchronous code and avoid callback hell.  
It is production ready and fully configurable via environment.  
### Features:
- hot reloading and runtime transpilation
- user signup and login via facebook, twitter and local strategy with account aggregation via [passport](http://passportjs.org/)
- basic Create and Read operations on the user model as an example
- non sequential random [ids](https://github.com/dylang/shortid) (no default *_id*)
- synchronous requests via [*co](https://github.com/tj/co)
- request validation via [JOI](https://github.com/hapijs/joi)
- [bcrypt](https://www.npmjs.com/package/bcrypt) for password caching and [JWT](https://jwt.io/) for stateless access
- full test suite and **100%** test coverage via [Mocha](https://mochajs.org/)
- [AirBnB code style](https://github.com/airbnb/javascript) linting
- Fully customizable and flexible due to [SOA](https://en.wikipedia.org/wiki/Service-oriented_architecture) approach

### Stack:
<a alt="Express" href="http://expressjs.com/">
<img alt="Express" src="https://camo.githubusercontent.com/fc61dcbdb7a6e49d3adecc12194b24ab20dfa25b/68747470733a2f2f692e636c6f756475702e636f6d2f7a6659366c4c376546612d3330303078333030302e706e67"  width="250"/>
</a>
<a alt="MongoDB" href="https://www.mongodb.com/">
<img alt="MongoDB" src="https://webassets.mongodb.com/_com_assets/cms/MongoDB-Logo-5c3a7405a85675366beb3a5ec4c032348c390b3f142f5e6dddf1d78e2df5cb5c.png"  width="280"/>
</a>
<a alt="Babel" href="https://babeljs.io/">
<img alt="Babel" src="https://raw.githubusercontent.com/babel/logo/master/babel.png"  width="180"/>
</a>
<a alt="Passport" href="http://passportjs.org/">
<img alt="Passport" src="https://vickev.com/uploads/1376269369423.png"  width="300"/>
</a>
<a alt="Mocha" href="https://mochajs.org/">
<img alt="Mocha + Chai" src="https://www.dropbox.com/s/1u7a1893085s9jp/mocha-chai.png?dl=0&raw=1"  width="150"/>
</a>
<a alt="ESLint" href="http://eslint.org/">
<img alt="ESLint" src="https://www.dropbox.com/s/i9l0kuxg0orpvwn/eslint.png?dl=0&raw=1"  width="230"/>
</a>

### Commands:

#### Setup:
1) Clone this repository.  
2) Install and run Mongo on your system or provide a remote connection string.  
3) Install dependencies (`npm install`)

#### Production:
*Command*: `npm start`  
You will need to provide all the necessary environment variables.

#### Development:
*Command*: `npm run local`  
Employs hot reloading and runtime transpilation, all of the variables are supplied.  
Test it on `http://localhost:3030`

#### Testing:
*Command*: `npm test`  
Will run all of the unit and behaviour tests and generate a coverage file.  
Current project test-coverage is **100%** to provide examples on all possible test cases.  
  
*Command*: `npm run test-suite -- './tests/path/to/the.test.js'`  
Will run a single test suite, convenient for TDD.

#### Code Style:
*Command*: `npm run lint`  
Will run [ESLint]() to check the code complience to the [AirBnB](https://github.com/airbnb/javascript) code style.
