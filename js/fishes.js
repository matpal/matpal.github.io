$(document).ready(function(){

  var numberOfFishes = 2;

  var animateFish = function (){
    // setTimeout(500);

    $('.fish').map(function(){
      var randomHeight = (Math.random() * 800) + 100 + "px";
      $(this).attr('top', randomHeight).css('top', randomHeight);
    });

    $('.fish')
    .css({
      left:"-106px",
      // top: altezza+"px", //100
    })
    .animate({
      left: "50px",
      // top:(altezza+100)+"px", //200
      top: ($(this).attr('top') + 100) + "px"
    },1000)
    .animateRotate(150, {
        duration: 1200,
        easing: 'swing',
        complete: function() {},
        step: function(){},
    })
    .animate({
      // top: (altezza+300)+"px", //400
      top: ($(this).attr('top') + 300) + "px",
      left:"-156px"
    },1000);


};

for(var i=0; i < numberOfFishes ; i++){
  var temp = document.createElement('img');
  temp.src = "img/fish.png";
  temp.setAttribute('class','fish');

  var altezza = (Math.random() * 800) + 100;
  temp.setAttribute('top', altezza+"px");
  // $(temp).css('top', altezza+"px");
  //Set attribute id or class
  $('#fishes').append($(temp));
}

//chiamare setInterval per ciascun fish
setInterval(animateFish, (Math.random() * 5000) + 1000);   // 7 - 4

});

$.fn.animateRotate = function(angle, duration, easing, complete) {
  var args = $.speed(duration, easing, complete);
  var step = args.step;
  return this.each(function(i, e) {
    args.complete = $.proxy(args.complete, e);
    args.step = function(now) {
      $.style(e, 'transform', 'rotate(' + now + 'deg)');
      if (step) return step.apply(e, arguments);
    };

    $({deg: 0}).animate({deg: angle}, args);
  });
};
