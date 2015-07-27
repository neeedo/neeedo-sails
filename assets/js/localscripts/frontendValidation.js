var validateLoginModal = function(){
  classie.removeClass(document.getElementById('errorMail'), 'showError' );
  classie.removeClass(document.getElementById('errorPassword'), 'showError' );
  var bool = true;
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

  if(document.getElementById('email').value.toString() == "" || !re.test(document.getElementById('email').value.toString())){
    classie.addClass(document.getElementById('errorMail'), 'showError' );
    bool = false;
  }
  if(document.getElementById('password').value.toString() == ""){
    classie.addClass(document.getElementById('errorPassword'), 'showError' );
    bool = false;
  }
  return bool;
};

var validateLoginForm = function(){
  classie.removeClass(document.getElementById('errorFormMail'), 'showError' );
  classie.removeClass(document.getElementById('errorFormPassword'), 'showError' );
  var bool = true;
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

  if($('#loginContainer').find('#email').val() == "" || !re.test($('#loginContainer').find('#email').val())){
    classie.addClass(document.getElementById('errorFormMail'), 'showError' );
    bool = false;
  }
  if($('#loginContainer').find('#password').val() == ""){
    classie.addClass(document.getElementById('errorFormPassword'), 'showError' );
    bool = false;
  }
  return bool;
};

var validateRegisterForm = function(){
  classie.removeClass(document.getElementById('errorRegisterName'), 'showError' );
  classie.removeClass(document.getElementById('errorRegisterMail'), 'showError' );
  classie.removeClass(document.getElementById('errorRegisterPassword'), 'showError' );
  var bool = true;
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

  if($('#registrationContainer').find('#username').val() == ""){
    classie.addClass(document.getElementById('errorRegisterName'), 'showError' );
    bool = false;
  }
  if($('#registrationContainer').find('#email').val() == "" || !re.test($('#registrationContainer').find('#email').val())){
    classie.addClass(document.getElementById('errorRegisterMail'), 'showError' );
    bool = false;
  }
  if($('#registrationContainer').find('#password').val() == ""){
    classie.addClass(document.getElementById('errorRegisterPassword'), 'showError' );
    bool = false;
  }
  return bool;
};
