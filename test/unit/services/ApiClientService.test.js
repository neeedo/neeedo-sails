/*
 * dependencies
 */
var ApiClientService = require('../../../api/services/ApiClientService'),
    UserValidator =  require('../../../api/validators/chains/User'),
    Factory = require('../../library/Factory')
    sinon = require('sinon'),
    should = require('should');

// common validator stub that can be used for validator object stubbing
var validatorStub = Factory.newValidator();

var givenAnLoginServiceStub = function() {
  return sinon.stub(sails.services.loginservice, "getCurrentUser", function(req) {return {} } );
};

var restoreLoginServiceStub = function() {
  sails.services.loginservice.getCurrentUser.restore();
};

var givenAnUserValidatorIsValidStub = function(isValid) {
  return sinon.stub(validatorStub, "isValid", function(value) {return isValid} );
};

var givenAnUserValidatorErrorMessagesStub = function(errorMessages) {
  return sinon.stub(validatorStub, "getErrorMessages", function() {return errorMessages} );
};

var restoreUserValidation = function() {
  validatorStub.isValid.restore();
  validatorStub.getErrorMessages.restore();
};

var givenAnUserValidationServiceStub = function() {
  return sinon.stub(sails.services.validationservice, 'newUserValidator', function(translator) { return validatorStub; }) ;
};

var restoreUserValidationServiceStub = function() {
  sails.services.validationservice.newUserValidator.restore();
};

var givenALoginValidationServiceStub = function() {
  return sinon.stub(sails.services.validationservice, 'newLoginValidator', function(translator) { return validatorStub; }) ;
};

var restoreLoginValidationServiceStub = function() {
  sails.services.validationservice.newLoginValidator.restore();
};

var givenAnOfferValidationServiceStub = function() {
  return sinon.stub(sails.services.validationservice, 'newOfferValidator', function(translator) { return validatorStub; }) ;
};

var restoreOfferValidationServiceStub = function() {
  sails.services.validationservice.newOfferValidator.restore();
};

var givenAnDemandValidationServiceStub = function() {
  return sinon.stub(sails.services.validationservice, 'newDemandValidator', function(translator) { return validatorStub; }) ;
};

var restoreDemandValidationServiceStub = function() {
  sails.services.validationservice.newDemandValidator.restore();
};

var givenAMessageValidationServiceStub = function() {
  return sinon.stub(sails.services.validationservice, 'newMessageValidator', function(translator) { return validatorStub; }) ;
};

var restoreMessageValidationServiceStub = function() {
  sails.services.validationservice.newMessageValidator.restore();
};

var givenAnIdValidationServiceStub = function() {
  return sinon.stub(sails.services.validationservice, 'newIdValidator', function(translator) { return validatorStub; }) ;
};

var restoreIdValidationServiceStub = function() {
  sails.services.validationservice.newIdValidator.restore();
};

var getCommonReqStub = function() {
  return {
    param: function (key) {
      return "don't care about the value";
    }
  }
};

describe('[UNIT TEST] ApiClientService', function () {

  /* #################################################################
   * #
   * # registration validation
   * #
   * #################################################################
   */
  describe('validateAndCreateNewRegisterFromRequest if validation fails', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(false);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      validationServiceStub = givenAnUserValidationServiceStub();

      done();
    });

    after(function(done){
      restoreUserValidationServiceStub();
      restoreUserValidation();
      done();
    });

    it("it calls onErrorCallback", function (done) {
      var req = getCommonReqStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewRegisterFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.True;
      (undefined === returnValue).should.be.True;

      done();
    });
  });

  describe('validateAndCreateNewRegisterFromRequest if validation succeeds', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(true);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      validationServiceStub = givenAnUserValidationServiceStub();

      done();
    });

    after(function(done){
      restoreUserValidationServiceStub();
      restoreUserValidation();
      done();
    });

    it("it returns new register model", function (done) {
      var req = getCommonReqStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewRegisterFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.False;
      returnValue.should.be.an.Object;

      done();
    });
  });

  /* #################################################################
   * #
   * # login validation
   * #
   * #################################################################
   */
  describe('validateAndCreateNewLoginFromRequest if validation fails', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(false);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      validationServiceStub = givenALoginValidationServiceStub();

      done();
    });

    after(function(done){
      restoreLoginValidationServiceStub();
      restoreUserValidation();
      done();
    });

    it("it calls onErrorCallback", function (done) {
      var req = getCommonReqStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewLoginFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.True;
      (undefined === returnValue).should.be.True;

      done();
    });
  });

  describe('validateAndCreateNewLoginFromRequest if validation succeeds', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(true);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      validationServiceStub = givenALoginValidationServiceStub();

      done();
    });

    after(function(done){
      restoreLoginValidationServiceStub();
      restoreUserValidation();
      done();
    });

    it("it returns new login model", function (done) {
      var req = getCommonReqStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewLoginFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.False;
      returnValue.should.be.an.Object;

      done();
    });
  });

  /* #################################################################
   * #
   * # offer validation
   * #
   * #################################################################
   */
  describe('validateAndCreateNewOfferFromRequest if validation fails', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(false);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      givenAnLoginServiceStub();

      validationServiceStub = givenAnOfferValidationServiceStub();

      done();
    });

    after(function(done){
      restoreOfferValidationServiceStub();
      restoreUserValidation();
      restoreLoginServiceStub();

      done();
    });

    it("it calls onErrorCallback", function (done) {
      var req = getCommonReqStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewOfferFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.True;
      (undefined === returnValue).should.be.True;

      done();
    });
  });

  describe('validateAndCreateNewOfferFromRequest if validation succeeds', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(true);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      givenAnLoginServiceStub();

      validationServiceStub = givenAnOfferValidationServiceStub();

      done();
    });

    after(function(done){
      restoreOfferValidationServiceStub();
      restoreUserValidation();
      restoreLoginServiceStub();

      done();
    });

    it("it returns new offer model", function (done) {
      var req = Factory.newCreateOfferRequestStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewOfferFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.False;
      returnValue.should.be.an.Object;

      done();
    });
  });

  /* #################################################################
   * #
   * # demand validation
   * #
   * #################################################################
   */
  describe('validateAndCreateNewDemandFromRequest if validation fails', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(false);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      givenAnLoginServiceStub();

      validationServiceStub = givenAnDemandValidationServiceStub();

      done();
    });

    after(function(done){
      restoreDemandValidationServiceStub();
      restoreUserValidation();
      restoreLoginServiceStub();

      done();
    });

    it("it calls onErrorCallback", function (done) {
      var req = getCommonReqStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewDemandFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.True;
      (undefined === returnValue).should.be.True;

      done();
    });
  });

  describe('validateAndCreateNewDemandFromRequest if validation succeeds', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(true);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      givenAnLoginServiceStub();

      validationServiceStub = givenAnDemandValidationServiceStub();

      done();
    });

    after(function(done){
      restoreDemandValidationServiceStub();
      restoreUserValidation();
      restoreLoginServiceStub();

      done();
    });

    it("it returns new demand model", function (done) {
      var req = Factory.newCreateDemandRequestStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewDemandFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.False;
      returnValue.should.be.an.Object;

      done();
    });
  });

  /* #################################################################
   * #
   * # message validation
   * #
   * #################################################################
   */
  describe('validateAndCreateNewMessageFromRequest if validation fails', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(false);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      givenAnLoginServiceStub();

      validationServiceStub = givenAMessageValidationServiceStub();

      done();
    });

    after(function(done){
      restoreMessageValidationServiceStub();
      restoreUserValidation();
      restoreLoginServiceStub();

      done();
    });

    it("it calls onErrorCallback", function (done) {
      var req = getCommonReqStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewMessageFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.True;
      (undefined === returnValue).should.be.True;

      done();
    });
  });

  describe('validateAndCreateNewDemandFromRequest if validation succeeds', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(true);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      givenAnLoginServiceStub();

      validationServiceStub = givenAMessageValidationServiceStub();

      done();
    });

    after(function(done){
      restoreMessageValidationServiceStub();
      restoreUserValidation();
      restoreLoginServiceStub();

      done();
    });

    it("it returns new message model", function (done) {
      var req = getCommonReqStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewMessageFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.False;
      returnValue.should.be.an.Object;

      done();
    });
  });

  /* #################################################################
   * #
   * # favorites validation
   * #
   * #################################################################
   */
  describe('validateAndCreateNewFavoriteFromRequest if validation fails', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(false);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      givenAnLoginServiceStub();

      validationServiceStub = givenAnIdValidationServiceStub();

      done();
    });

    after(function(done){
      restoreIdValidationServiceStub();
      restoreUserValidation();
      restoreLoginServiceStub();

      done();
    });

    it("it calls onErrorCallback", function (done) {
      var req = getCommonReqStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewFavoriteFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.True;
      (undefined === returnValue).should.be.True;

      done();
    });
  });

  describe('validateAndCreateNewFavoriteFromRequest if validation succeeds', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(true);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      givenAnLoginServiceStub();

      validationServiceStub = givenAnIdValidationServiceStub();

      done();
    });

    after(function(done){
      restoreIdValidationServiceStub();
      restoreUserValidation();
      restoreLoginServiceStub();

      done();
    });

    it("it returns new favorite model", function (done) {
      var req = getCommonReqStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewFavoriteFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.False;
      returnValue.should.be.an.Object;

      done();
    });
  });

  /* #################################################################
   * #
   * # conversation validation
   * #
   * #################################################################
   */
  describe('validateAndCreateNewConversationFromRequest if validation fails', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(false);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      givenAnLoginServiceStub();

      validationServiceStub = givenAnIdValidationServiceStub();

      done();
    });

    after(function(done){
      restoreIdValidationServiceStub();
      restoreUserValidation();
      restoreLoginServiceStub();

      done();
    });

    it("it calls onErrorCallback", function (done) {
      var req = getCommonReqStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewConversationFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.True;
      (undefined === returnValue).should.be.True;

      done();
    });
  });

  describe('validateAndCreateNewConversationFromRequest if validation succeeds', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(true);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      givenAnLoginServiceStub();

      validationServiceStub = givenAnIdValidationServiceStub();

      done();
    });

    after(function(done){
      restoreIdValidationServiceStub();
      restoreUserValidation();
      restoreLoginServiceStub();

      done();
    });

    it("it returns new conversation model", function (done) {
      var req = getCommonReqStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewConversationFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.False;
      returnValue.should.be.an.Object;

      done();
    });
  });

  /* #################################################################
   * #
   * # demand ID validation
   * #
   * #################################################################
   */
  describe('validateAndCreateNewDemandIdFromRequest if validation fails', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(false);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      givenAnLoginServiceStub();

      validationServiceStub = givenAnIdValidationServiceStub();

      done();
    });

    after(function(done){
      restoreIdValidationServiceStub();
      restoreUserValidation();
      restoreLoginServiceStub();

      done();
    });

    it("it calls onErrorCallback", function (done) {
      var req = getCommonReqStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewDemandIdFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.True;
      (undefined === returnValue).should.be.True;

      done();
    });
  });

  describe('validateAndCreateNewDemandIdFromRequest if validation succeeds', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(true);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      givenAnLoginServiceStub();

      validationServiceStub = givenAnIdValidationServiceStub();

      done();
    });

    after(function(done){
      restoreIdValidationServiceStub();
      restoreUserValidation();
      restoreLoginServiceStub();

      done();
    });

    it("it returns ID", function (done) {
      var req = getCommonReqStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewDemandIdFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.False;
      returnValue.should.be.a.String;

      done();
    });
  });

  /* #################################################################
   * #
   * # offer ID validation
   * #
   * #################################################################
   */
  describe('validateAndCreateNewOfferIdFromRequest if validation fails', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(false);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      givenAnLoginServiceStub();

      validationServiceStub = givenAnIdValidationServiceStub();

      done();
    });

    after(function(done){
      restoreIdValidationServiceStub();
      restoreUserValidation();
      restoreLoginServiceStub();

      done();
    });

    it("it calls onErrorCallback", function (done) {
      var req = getCommonReqStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewOfferIdFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.True;
      (undefined === returnValue).should.be.True;

      done();
    });
  });

  describe('validateAndCreateNewOfferIdFromRequest if validation succeeds', function() {
    var validationServiceStub;

    before(function(done){
      givenAnUserValidatorIsValidStub(true);
      givenAnUserValidatorErrorMessagesStub(["message"]);
      givenAnLoginServiceStub();

      validationServiceStub = givenAnIdValidationServiceStub();

      done();
    });

    after(function(done){
      restoreIdValidationServiceStub();
      restoreUserValidation();
      restoreLoginServiceStub();

      done();
    });

    it("it returns ID", function (done) {
      var req = getCommonReqStub(),
        res = {},
        onErrorCallbackSpy = sinon.spy();

      // trigger policy
      var returnValue = ApiClientService.validateAndCreateNewOfferIdFromRequest(req, res, onErrorCallbackSpy);

      onErrorCallbackSpy.calledOnce.should.be.False;
      returnValue.should.be.a.String;

      done();
    });
  });

});
