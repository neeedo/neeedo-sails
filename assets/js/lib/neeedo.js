var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
				body = document.body;

showLeft.onclick = function() {
  classie.toggle( this, 'active' );
  classie.toggle( menuLeft, 'cbp-spmenu-open' );
};

function toggle_visibility(id) {
  var e = document.getElementById(id);
  if(e.style.display == 'none')
    e.style.display = 'block';
  else
    e.style.display = 'none';
}
