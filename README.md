# neeedo-webapp 

a [Sails](http://sailsjs.org) application

[![Travis Build Status][travis-image]][travis-url]

[![Dependency Status][dependencies-image]][dependencies-url]

[![codecov.io][codecov-image]][codecov-url]

![codecov.io][codecov-report]


Live webapp
----------

http://www.neeedo.com

Installation
----------

- Please install ImageMagick first: http://www.imagemagick.org/ .
- Install the latest [Node.js](https://nodejs.org/download/) (which includes the NPM package manager) .
- Checkout the project and install the NPM dependencies

```bash
git clone https://github.com/neeedo/neeedo-webapp.git
npm install
```

- If you want to make use of grunt (e.g. to run the code coverage task more smoothly), please install Grunt and set up the Grunt CLI (-> http://gruntjs.com/getting-started ).


Configuration
----------

You can set a custom configuration if desired. Therefore, please copy config/env/development.js to config/env/custom.js or similiar and adjust the configuration. 

Afterwards, set the environment before running the app:

```bash
NODE_ENV = custom
```

Run the project
----------

Make sure to have the neeedo Api running according to your config/env/development.js configuration or the custom one.

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
