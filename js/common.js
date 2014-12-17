function GetMissionAuthor() {
    var MissionObject = Parse.Object.extend("Missions");
    var query = new Parse.Query(MissionObject);
    query.limit(1000);
    query.find({
        success: function(results) {
            $("#authorSelected").empty();
            $("#authorSelected").append(
                "<option>All Authors</option>");
            var arr = [];
            for (var x = 0; x < results.length; x++) {
                var obj = results[x];
                var authors = obj.get("missionAuthor").split(",");
                for(var y = 0; y < authors.length;y++) {
                    var author = authors[y].trim();
                    if (arr.indexOf(author) == -1) {
                        $("#authorSelected").append("<option>" +
                            author +
                            "</option>");
                        arr.push(author);
                    }
                }
            }
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function MissionSaveError(string) {
    $("#errorEdit").text(string);
}

function toggleAuthors() {
    $("#authorSelected").toggle();
    $("#missionAuthors").toggle(); 
}