(function($) { "use strict";

	$(function() {
		var header = $(".start-style");
		$(window).scroll(function() {
			var scroll = $(window).scrollTop();

			if (scroll >= 10) {
				header.removeClass('start-style').addClass("scroll-on");
			} else {
				header.removeClass("scroll-on").addClass('start-style');
			}
		});
	});

	//Animation

	$(document).ready(function() {
		$('.wrap.hero-anime').removeClass('hero-anime');
	});

	//Menu On Hover

	$('.wrap').on('mouseenter mouseleave','.nav-item',function(e){
			if ($(window).width() > 750) {
				var _d=$(e.target).closest('.nav-item');_d.addClass('show');
				setTimeout(function(){
				_d[_d.is(':hover')?'addClass':'removeClass']('show');
				},1);
			}
	});



  })(jQuery);

  $(document).ready(function()
	{
	$("#switch").click(function(){
		if ($("#test").hasClass("dark")) {
			$("#test").removeClass("dark");
			$("#switch").removeClass("switched");
		}
		else {
			$("#test").addClass("dark");
			$("#switch").addClass("switched");
		}
	});
});


	//Switch light/dark

