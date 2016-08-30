$(document).ready(function () {
	var $header = $("header");
	$("#search > span").click(function () {
		if ( !$header.hasClass("toggled") ) {
			$("#header-container, .wrapper").animate({ height : "300px" }, 300);
			$(".search").slideDown(300);
		}
		else {
			$("#header-container, .wrapper").animate({ height : "250px" }, 300);
			$(".search").slideUp(300);
		}
		$header.toggleClass("toggled");
	});
});