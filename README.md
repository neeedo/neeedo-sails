# neeedo-webapp 

a [Sails](http://sailsjs.org) application

[![Travis Build Status][travis-image]][travis-url]

[![Dependency Status][dependencies-image]][dependencies-url]

[![codecov.io][codecov-image]][codecov-url]

![codecov.io][codecov-report]


Installation
----------

- Install the latest [Node.js](https://nodejs.org/download/) (which includes the NPM package manager) .
- Checkout the project and install the NPM dependencies

```bash
git clone https://github.com/neeedo/neeedo-webapp.git
npm install
```

- If you want to make use of grunt (e.g. to run the code coverage task more smoothly), please install Grunt and set up the Grunt CLI (-> http://gruntjs.com/getting-started ).

Run the project
----------

```bash
npm start
```

- The default environment is 'development'. On production systems, set the NODE_ENV environment variable to 'production'.

Generate test coverage report
----------

```bash
grunt testcoverage
```
[travis-image]: https://travis-ci.org/neeedo/neeedo-webapp.svg?branch=master
[travis-url]: https://travis-ci.org/neeedo/neeedo-webapp
[dependencies-image]: https://www.versioneye.com/user/projects/552e45184379b22cee000004/badge.svg?style=flat
[dependencies-url]: https://www.versioneye.com/user/projects/552e45184379b22cee000004
[codecov-image]: https://codecov.io/github/neeedo/neeedo-webapp/coverage.svg?branch=master
[codecov-url]: https://codecov.io/github/neeedo/neeedo-webapp?branch=master
[codecov-report]: https://codecov.io/github/neeedo/neeedo-webapp/branch.svg?branch=master
