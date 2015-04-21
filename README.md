# neeedo-sails <a href='https://travis-ci.org/neeedo/neeedo-sails'><img src="https://travis-ci.org/neeedo/neeedo-sails.svg?branch=master" alt="Travis Build Status"/></a> <a href='https://www.versioneye.com/user/projects/552e45184379b22cee000004'><img src='https://www.versioneye.com/user/projects/552e45184379b22cee000004/badge.svg?style=flat' alt="Dependency Status" /></a>
![codecov.io](https://codecov.io/github/neeedo/neeedo-sails/branch.svg?branch=master)

a [Sails](http://sailsjs.org) application

Installation
----------

- Install the latest [Node.js](https://nodejs.org/download/) (which includes the NPM package manager) .
- Checkout the project and install the NPM dependencies

```bash
git clone https://github.com/neeedo/neeedo-sails.git
npm install
```
- If you want to make use of grunt (e.g. to run the code coverage task more smoothly), please install Grunt and set up the Grunt CLI (-> http://gruntjs.com/getting-started ).


Run the project
----------

```bash
npm start
```

Generate test coverage report
----------

```bash
grunt mocha_istanbul
```
