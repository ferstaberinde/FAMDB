Parse.initialize("1IijmSndIGJFPg6cw6xDl5PRe5AiGCHliyPzIgPc",
    "NHQLKq3nL8i0aK6Hz9J4EOMbAvHgkEu2XY5RAq8Q");

$('textarea').focus(function() {
	   defaultTexts = ["Short description of the mission as well as any special gameplay features.","Notes on mission playability, balance etc."]

	   if ($.inArray($(this).val(),defaultTexts) != -1 ) {
	   		$(this).val('');
		}
});

$('#submitButton').click(function() {
    LoadData();
    return false;
});

UpdateLogin();
GetMissionAuthor();
LoadData();
