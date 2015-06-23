/**
 * Created by Sebastian on 23.06.2015.
 */
$(document).ready(function(){
  var theForm = document.getElementById( 'theForm' );

  new stepsForm( theForm, {
    onSubmit : function( form ) {
      // hide form
      classie.addClass( theForm.querySelector( '.simform-inner' ), 'hide' );

      /*
       form.submit()
       or
       AJAX request (maybe show loading indicator while we don't have an answer..)
       */

      // let's just simulate something...
      var messageEl = theForm.querySelector( '.final-message' );
      messageEl.innerHTML = 'Thank you! We\'ll be in touch.';
      classie.addClass( messageEl, 'show' );
    }
  } );
});

