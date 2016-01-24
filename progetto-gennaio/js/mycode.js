$(document).ready(function() {

  var select = $('select');
  select.material_select();
  // Tabs are initialized automatically, but if you add tabs dynamically you will have to initialize them like this.
  // $('ul.tabs').tabs();


  $(".button-collapse").sideNav({
      menuWidth: 350,
  });


  // close sideNav on click
  $('#dropActivityMenu').click(function(){
    $('.button-collapse').sideNav('hide');
  });


  $('.modal-trigger').leanModal();
    $('#androidManifestModal').openModal();
});
