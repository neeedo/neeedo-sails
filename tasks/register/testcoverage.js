module.exports = function (grunt) {
  grunt.registerTask('testcoverage', [
    'mocha_istanbul:coverage'
  ]);
};
