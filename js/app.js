$(document).ready(main);

var count = 1;
var screenWidth = $(window).width();

function main () {
	// console.log(screenWidth);
	if (screenWidth > 768) {
		// alert('ok');
	} else {
		$(".menu-bar").click (function(){
			if (count == 1){
				$('nav').animate({
					left: '0'
				});
				count = 0;
			} else {
				count = 1;
				$('nav').animate({
					left: '-100%'
				});
			}
		});
	}
}

