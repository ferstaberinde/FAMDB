// Functions used by both form.js and missions.js

// Function to populate #authorsSelected dropdown field with all authors from the DB
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

           if (preSelect && (arr.indexOf(Parse.User.current().get("username"))) != -1) {        
                $("#authorSelected").val(Parse.User.current().get("username"));
            };
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function CheckRights(obj, userid, ACL) {
    var currentUser = Parse.User.current();
    var rowid = obj.id;
    // If the current user has created the entry, add edit & delete buttons
    if (currentUser.id == userid) {
      $("#" + rowid).append(
        '<ul><li><a href="form.html?row=' +
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

                    // Add modifiers for play-counter
                   $('#' + rowid + '_counterPlayed').parent()
                        .append(' <a href="#" title="Increase playcount" onClick ="ChangePlayedCount(\''+ rowid +'\',+1)">+</a>')
                        .prepend('<a href="#" title="Decrease playcount" onClick="ChangePlayedCount(\''+ rowid +'\',-1)">- </a>');
                    
                    // If admin is not creator of the entry, add edit & delete buttons
                    if (currentUser.id != userid) {
                        $("#" + rowid).append(
                          '<ul><li><a href="form.html?row=' +
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

function ChangePlayedCount(id,mod) {
        
    var MissionObject = Parse.Object.extend("Missions");
    var query = new Parse.Query(MissionObject);
    
    query.get(id, {
            success: function(obj) {
                var counterPlayed = $('#'+obj.id+'_counterPlayed');
                var counterPlayedVal = Number(counterPlayed.html());
                
                if (counterPlayedVal + (mod) < 0 || counterPlayedVal + (mod) > 100) return;
                
                counterPlayed.html(counterPlayedVal + (mod));
                obj.set("playedCounter", obj.get("playedCounter") + (mod));
                SaveMission(obj,Parse.User.current(),false);
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
    });
    
}

function ToggleAuthors() {
    $("#authorSelected").toggle();
    $("#missionAuthors").toggle(); 
}

// Saves mission to DB
function SaveMission(objMission,currentUser,close) {
    var postACL = new Parse.ACL();
    postACL.setRoleWriteAccess("Administrator", true);
    postACL.setPublicReadAccess(true);
    postACL.setWriteAccess(currentUser.id, true);
    objMission.setACL(postACL);
    objMission.save(null, {
        success: function() {
            if (close) {window.location.href = "index.html";}
        },
        error: function(error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and description.
            $("#errorEdit").text(error.message);
        }
    });
    return false;
}