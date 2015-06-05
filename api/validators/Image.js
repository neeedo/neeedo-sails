var _ = require('underscore');

function Image(allowedTypes, maxSizeInBytes, maxCount, typeDescriptions, translator) {
  if (!_.isArray(allowedTypes)) {
    throw new Error('Image:: allowed types must be array!');
  }

  if (!_.isString(typeDescriptions)) {
    throw new Error('Image:: description must be string!');
  }

  if (!_.isNumber(maxSizeInBytes)) {
    throw new Error('Image:: maxSizeInBytes must be numeric!');
  }

  if (!_.isNumber(maxCount)) {
    throw new Error('Image:: maxCount must be numeric!');
  }

  this.allowedTypes = allowedTypes;
  this.maxSizeInBytes = maxSizeInBytes;
  this.maxCount = maxCount;
  this.typeDescriptions = typeDescriptions;
  this.translator = translator;
  this.errorMessages = [];
  this.currentCount = 0;
  this.descriptions = [
    {
      key :  this.translator('Allowed file types'),
      value: this.typeDescriptions
    },
    {
      key :  this.translator('maximal size'),
      value: this.maxSizeInBytes + " bytes "
    },
    {
      key :  this.translator('maximum number of images'),
      value: this.maxCount
    },
  ];
}

Image.prototype.isTypeValid = function(file)
{
  return -1 !== this.allowedTypes.indexOf(file.type);
};

Image.prototype.isFileSizeValid = function(file)
{
  return this.maxSizeInBytes >= file.size;
};

Image.prototype.isCountValid = function()
{
  return this.currentCount <= this.maxCount;
};

Image.prototype.isValid = function(file)
{
  this.currentCount++;

  if (! _.isObject(file)) {
    return false;
  }

  if (!this.isCountValid()) {
    this.errorMessages.push(this.translator('You uploaded too many images.') + " "
    +  this.translator("maximum number of images") + ": " +  this.maxCount);

    return false;
  }

  if (!this.isTypeValid(file)) {
    this.errorMessages.push(this.translator('You uploaded an invalid file type (file %s).', file.filename) + " "
    +  this.translator("Allowed file types") + ": " +  this.typeDescriptions);

    return false;
  }

  if (!this.isFileSizeValid(file)) {
    this.errorMessages.push(this.translator('The file %s is too big.', file.filename) + " "
    +  this.translator("maximal size") + ": " +  this.maxSizeInBytes);

    return false;
  }

  return true;
};

Image.prototype.getDescriptions = function() {
  return this.descriptions;
};

Image.prototype.getErrorMessages = function() {
  return this.errorMessages.join(', ');
};

module.exports = Image;
