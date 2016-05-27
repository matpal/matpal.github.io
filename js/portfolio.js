$(document).ready(function(){
  $('.value').css({'display':'none'});

  var seconds = ['first', 'second','third','fourth','fifth'];

  var knowledge = {
    // Frontend
    'html': 4,
    'css' : 4,
    'sass': 4,
    'javascript': 3,
    'jquery': 4,
    // Programming
    'c' : 2,
    'java' : 4,
    'php': 3,
    'python': 3,
    // Tools
    'git':3,
    'inkscape':3,
    'gimp':2,
    'uml':3,

  };

  var programming = {

  };

  var animateSquare = function( divIdName ){
    var elements = $('#' + divIdName).find('.value-container');
    for(var i=0; i < elements.length; i++){
      if(i < knowledge[divIdName] ){
        $(elements[i]).children()
         .css({'display':'block'})
         .addClass('animated')
         .addClass('flipInY')
         .addClass(seconds[i]);
      }else{
        $(elements[i]).children().css({'display':'none'});
      }

    }
  }

  // elements = $('#html').find('*');
  // for(var i=0; i < elements.length; i++){
  //   if(i < frontend['html'] ){
  //     $(elements[i]).addClass(seconds[i]).removeClass('empty');
  //   }
  // }
  $('#frontend').hover(
    function(){
      animateSquare('html');
      animateSquare('css');
      animateSquare('sass');
      animateSquare('javascript');
      animateSquare('jquery');
    },
    function(){

    }
  );

  $('#programming').hover(
    function(){
      animateSquare('c');
      animateSquare('java');
      animateSquare('php');
      animateSquare('python');
    },
    function(){

    }
  );

  $('#tools').hover(
    function(){
      animateSquare('git');
      animateSquare('inkscape');
      animateSquare('gimp');
      animateSquare('uml');
    },
    function(){

    }
  );


});
