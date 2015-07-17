var _ = require('underscore');

function Tags(translator, minTagCount, maxTagCount) {
  this.errorMessages = [];
  this.translator = translator;
  this.regex = /^[a-zA-Z0-9-_]+$/;
  this.minTagCount = minTagCount;
  this.maxTagCount = maxTagCount;
}

Tags.prototype.validateNumberOfTags = function(tags)
{
  if (tags.length < this.minTagCount ) {
    this.errorMessages.push(this.translator("You need to provide a minimum of %s tags", this.minTagCount));
    return false;
  }

  if (tags.length > this.maxTagCount) {
    this.errorMessages.push(this.translator("You need to provide a maximum of %s tags", this.maxTagCount));
    return false;
  }

  return true;
};

Tags.prototype.validateEachTag = function(tags)
{
  var isValid = true;

  for (var i=0; i < tags.length; i++) {
    if (!tags[i].match(this.regex)) {
      this.errorMessages.push(this.translator('Invalid tag %s', tags[i]));
      isValid = false;
    }
  }

  return isValid;
};

Tags.prototype.isValid = function(givenTags)
{
  if (!_.isArray(givenTags)) {
    this.errorMessages.push(this.translator('Invalid value for tags.'));
    return false;
  }

  if (!this.validateNumberOfTags(givenTags)) {
    return false;
  }

  if (!this.validateEachTag(givenTags)) {
    return false;
  }

  return true;
};

Tags.prototype.getErrorMessages = function() {
  return this.errorMessages.join(', ');
};

module.exports = Tags;
