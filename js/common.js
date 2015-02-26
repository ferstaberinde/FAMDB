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
            var currentUser = Parse.User.current();
            if (currentUser === null) return;
            
            if (preSelect) {
                if ((arr.indexOf(currentUser.get("username"))) != -1) {        
                    $("#authorSelected").val(currentUser.get("username"));
                } else {
                    ToggleAuthors();   
                    $("#missionAuthors").val(currentUser.get("username"));
                }
            }
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

// Check if user belongs to a group with write access
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
    
    var query = new Parse.Query(Parse.Role);
    query.equalTo("users", currentUser);
    var value = null;
    query.find({
        success: function(roles) {
            for (var x = 0; x < roles.length; x++) {
                if (ACL.getWriteAccess(roles[x])) {
                    
                    // Don't add the edit/delete to the admin's own missions (otherwise duplicates occur)
                    if (currentUser.id != userid) {
                        $("#" + rowid).append(
                              '<ul><li><a href="form.html?row=' +
                                rowid + '">Edit</a></li><li><a href="#" onClick="DeletePopup(\'' +
                                rowid +
                        '\')">Delete</a></li></ul>');
                    }

                   // Only administrators are allowed to modify the played counter
                    if (roles[x].getName() === "Administrator") {
                       $('#' + rowid + '_counterPlayed').next().click({param1: rowid}, function(event) {ChangePlayedCount(event.data.param1,+1);return false;});
                       $('#' + rowid + '_counterPlayed').prev().click({param1: rowid}, function(event) {ChangePlayedCount(event.data.param1,-1);return false;});
                        
                           
                        
                       $('#' + rowid + '_lastPlayed').datetimepicker({
                            lazyInit: true,
                            timepicker:false,
                            startDate:0,
                           closeOnDateSelect:true,
                           theme:"dark",
                            onSelectDate: function(date,$i){
                                ChangeLastPlayed(rowid,date);
                            }
                        });
                    };
                    
                    $('.playCounterMod').show(); 
                    $('.cellLastPlayed').css({color:"#eaa724", cursor: "pointer"})
                    
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
                
                if (counterPlayedVal + (mod) < 0 || counterPlayedVal + (mod) > 100) return false;
                if (mod > 1) ChangeLastPlayed(obj,$.datepicker.formatDate('yy/mm/dd', new Date()));
                obj.set("playedCounter", obj.get("playedCounter") + (mod));
                SaveMission(obj,Parse.User.current(),false);
                counterPlayed.html(counterPlayedVal + (mod));
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
    });
}

// Opens date-input prompt
function ChangeLastPlayed(rowid,date) {
    var MissionObject = Parse.Object.extend("Missions");
    var query = new Parse.Query(MissionObject);
    
    query.get(rowid, {
        success: function(obj) {
                var fieldLastPlayed = $('#'+obj.id+'_lastPlayed');
                date = moment(date).format("YYYY MM DD");    
                if (date.split(" ")[0] > 2013) {
                    fieldLastPlayed.html(date);
                } else {
                    fieldLastPlayed.html("Never");
                }
                obj.set("lastPlayed", date);
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
        error: function(objMission,error) {
            console.log("Error: " + error.code + " " + error.message);
            $("#errorEdit").text(error.message);
        }
    });
    return false;
}