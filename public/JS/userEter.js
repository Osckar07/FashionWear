
jQuery(function ($) {

  $(".sidebar-dropdown > a").click(function() {
$(".sidebar-submenu").slideUp(200);
if (
  $(this)
    .parent()
    .hasClass("active")
) {
  $(".sidebar-dropdown").removeClass("active");
  $(this)
    .parent()
    .removeClass("active");
} else {
  $(".sidebar-dropdown").removeClass("active");
  $(this)
    .next(".sidebar-submenu")
    .slideDown(200);
  $(this)
    .parent()
    .addClass("active");
}
});



document.body.style.marginLeft = "280";
$("#close-sidebar").click(function() {  
$(".page-wrapper").removeClass("toggled");
document.body.style.marginLeft = "50";
document.body.style.marginRight = "50";
  
});
$("#show-sidebar").click(function() {
$(".page-wrapper").addClass("toggled");
 document.body.style.marginLeft = "280";
});


 
 
});