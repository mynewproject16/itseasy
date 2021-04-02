$(document).ready(function() {

  // HAMBURGER MENU ANIMATION

  var Menu = {
    el: {
      ham: $('.menu')
    },
    init: function() {
      Menu.bindUIactions();
    },
    bindUIactions: function() {
      Menu.el.ham
        .on(
          "touchstart click",
          function(event) {
            event.preventDefault();
            Menu.activateMenu(event);
          }
        );
    },
    activateMenu: function() {
      Menu.el.ham.toggleClass('menu-opened');
    }
  };
  Menu.init();


  // BACK TO TOP BUTTON
  $(function() {
    var back = $(".back_to_top");
    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      if (scroll >= 400) {
        $(back).addClass("active");
      } else {
        $(back).removeClass("active");
      }
    });
  });

  // (function ($) {
  //     $(document).ready(function () {
  //         //
  //         var mySlidebars = new $.slidebars();
  //
  //
  //     });
  // })(jQuery);

});
