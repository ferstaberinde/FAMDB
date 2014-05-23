function CenterPopup(divname) {
//request data for centering
var windowWidth = document.documentElement.clientWidth;
var windowHeight = document.documentElement.clientHeight;
var popupHeight = $(divname).height();
var popupWidth = $(divname).width();
//centering
$(divname).css({
"position": "absolute",
"top": windowHeight/2-popupHeight/2,
"left": windowWidth/2-popupWidth/2
});
//only need force for IE6

$("#backgroundPopup").css({
"height": windowHeight
});

}
function OpenPopup(divname) {
  CenterPopup(divname);
  $("#backgroundPopup").css({
    "opacity": "0.7"
  });
  $("#backgroundPopup").fadeIn("slow");
  $(divname).fadeIn("slow");

}
function HidePopup(divname)
{
  $("#backgroundPopup").fadeOut("slow");
  $(divname).fadeOut("slow");
}





$( window ).resize(function() {
  CenterPopup("#loginWindow");
  CenterPopup("#deleteWindow");
});

function DeletePopup(row)
{
  window.delRow = row;
  OpenPopup("#deleteWindow");
}
