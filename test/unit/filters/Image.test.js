/*
 * dependencies
 */
var ImageFilter = require('../../../api/filters/Image'),
  sinon = require('sinon'),
  should = require('should');

var givenAnImageFilterWithMaxDimension100_100 = function () {
  return new ImageFilter(100, 100);
};

var whenCalculateDimensionIsCalledWithImagesWith150_200 = function (imageFilter) {
  return imageFilter.calculateMaxDimensions(150, 200);
};

var thenResultingDimensionsShouldBe = function (resultingDimensions, expectedHeight, expectedWidth) {
  return resultingDimensions.resizedHeight.should.be.equal(expectedHeight)
    && resultingDimensions.resizedWidth.should.be.equal(expectedWidth);
};

describe('[UNIT TEST] ImageFilter', function () {
  it("calculateMaxDimension", function (done) {
    var imageFilter = givenAnImageFilterWithMaxDimension100_100();
    var resultingDimensions = whenCalculateDimensionIsCalledWithImagesWith150_200(imageFilter);

    thenResultingDimensionsShouldBe(resultingDimensions, 75, 100);

    done();
  });
});
