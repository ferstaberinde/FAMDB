function GetMissionAuthor(preSelect) {
    var MissionObject = Parse.Object.extend("Missions");
    var query = new Parse.Query(MissionObject);
    query.limit(1000);
    query.find({
        success: function(results) {
           // $("#authorSelected").empty();
            //$("#authorSelected").append(
            //    "<option>All Authors</option>");
            var 
                arr = [],
                authors = [];

            for (var x = 0; x < results.length; x++) {
                var obj = results[x];
                authors = authors.concat(obj.get("missionAuthor").split(','));
            }

            for(var y = 0; y < authors.length;y++) {
                var author = authors[y].trim();
                if (arr.indexOf(author) == -1) {
                    arr.push(author);
                }
            }

            arr.sort(function (a, b){
                var aName = a.toLowerCase();
                var bName = b.toLowerCase(); 
                return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
              }
            );

            for (var y = 0;y < arr.length;y++) {
                $("#authorSelected").append("<option>" +
                arr[y] +
                "</option>");
            }

           if (preSelect && arr.indexOf(Parse.User.current().get("username")) != -1) {
                $("#authorSelected").val(Parse.User.current().get("username"));
            };
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function CheckRights(rowid, userid, ACL) {
    var currentUser = Parse.User.current();

    // If the current user has created the entry, add edit & delete buttons
    if (currentUser.id == userid) {
      $("#" + rowid).append(
        '<ul><li><a href="edit.html?row=' +
        rowid + '">Edit</a></li><li><a href="#" onClick="DeletePopup(\'' +
        rowid +
        '\')">Delete</a></li></ul>');
      //return;
    }

    // Check if admin
    var query = new Parse.Query(Parse.Role);
    query.equalTo("users", currentUser);
    var value = null;
    query.find({
        success: function(roles) {
            for (var x = 0; x < roles.length; x++) {
                if (ACL.getWriteAccess(roles[x])) {

                    // Add incrementor for play-counter
                    //$('#' + rowid + '_cellPlayed').append(' <a href="#">+</a>');
                    
                    // If admin is not creator of the entry, add edit & delete buttons
                    if (currentUser.id != userid) {
                        $("#" + rowid).append(
                          '<ul><li><a href="edit.html?row=' +
                            rowid + '">Edit</a></li><li><a href="#" onClick="DeletePopup(\'' +
                            rowid +
                            '\')">Delete</a></li></ul>');
                    }
                    
                    return;
                }
            }
        },
        error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
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