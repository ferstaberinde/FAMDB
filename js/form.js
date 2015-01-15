Parse.initialize("1IijmSndIGJFPg6cw6xDl5PRe5AiGCHliyPzIgPc",
    "NHQLKq3nL8i0aK6Hz9J4EOMbAvHgkEu2XY5RAq8Q");

if (!Parse.User.current() || Parse.User.current() === null) {
    window.location.href = "index.html";
}

UpdateLogin();
$("#missionAuthors").hide();
$("#editMissionsAuthorToggle").hide();

// Decide whether mission is being edited or updated
var queryDict = {};
location.search.substr(1).split("&").forEach(function(item) {
    queryDict[item.split("=")[0]] = item.split("=")[1];
});
var MissionObject = Parse.Object.extend("Missions");
var query = new Parse.Query(MissionObject);
query.get(queryDict.row, {
            success: function(object) {
                LoadMission(false,object);
            },
            error: function(model,error) {
                if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
                LoadMission(true,null);
                }
            }
});

function LoadMission(newMission,object) {
    var currentUser = Parse.User.current();
    if (currentUser === null) return;
        
    // If mission exists, populate the elements
    if (newMission) {
        $('.editMissionsTitle').append(' Add Mission');
        $('#editMissionsHeader').children().append('Add Mission');
        $("#editMissionsAuthorToggle").show();
        GetMissionAuthor(newMission);     
    } else {
        $("#loading").show();
        $('.editMissionsTitle').append(' Edit Mission');
        $('#editMissionsHeader').children().append('Edit Mission');
        $("#authorSelected").hide();
        $("#missionAuthors").show();
        var MissionObject = object;
        var ACL = object.getACL();
        query.find({
                    success: function(roles) {
                        for (var x = 0; x < roles.length; x++) {
                            if (ACL.getWriteAccess(
                                    roles[x]) ||
                                ACL.getWriteAccess(
                                    currentUser)) {
                                window.row = object;
                                $("#missionName").val(
                                    object.get(
                                        "missionName"
                                    ));
                                $("#missionGame").val(
                                    object.get(
                                        "game")
                                );
                                $("#missionIsland")
                                    .val(object.get(
                                        "missionMap"
                                    ));
                                $("#missionSession")
                                    .val(object.get(
                                        "Session"
                                    ));
                                $("#missionType").val(
                                    object.get(
                                        "missionType"
                                    ));
                                $("#missionSlots").val(
                                    object.get(
                                        "missionPlayers"
                                    ));
                                 $("#missionPlaycount").val(
                                    object.get(
                                        "playedCounter"
                                    ));
                                $("#authorSelected")
                                    .val(object.get(
                                        "missionAuthor"
                                    ));
                                $("#missionAuthors")
                                    .val(object.get(
                                        "missionAuthor"
                                    ));
                                $(
                                    "#missionDescription"
                                ).val(object.get(
                                    "missionDesc"
                                ));
                                $(
                                    "#missionNotes"
                                ).val(object.get(
                                    "missionNotes"
                                ));
                                $(
                                    "#f3Version"
                                ).val(object.get(
                                    "Scripts"
                                ));

                                var bool = object.get(
                                    "isBroken");
                                if (bool) {
                                    $(
                                        "#missionBroken"
                                    ).prop(
                                        'checked',
                                        true);
                                }

                                var bool = object.get(
                                    "needsRevision");
                                if (bool) {
                                    $(
                                        "#missionNeedsRevision"
                                    ).prop(
                                        'checked',
                                        true);
                                }

                                $("#loading").hide();
                                //   $("#form_edit").show();
                                return;
                            }
                        }
                    },
                    error: function(error) {
                        alert("Error: " + error.code +
                            " " + error.message
                        );
                    }
                });
    }
    
    
    $('#missionSave').click({param1: object}, function(event) {
        SaveMission(event.data.param1);
    });
}

function SaveMission(object) {
    
    var missionName = $("#missionName").val();
    var missionGame = $("#missionGame").val();
    var missionIsland = $("#missionIsland").val();
    var missionSession = $("#missionSession").val();
    var missionType = $("#missionType").val();
    var missionSlots = Number($("#missionSlots").val());
    var missionPlaycount = Number($('#missionPlaycount').val());
    var missionsAuthors = $("#missionAuthors").val();
    if (missionsAuthors === "" || missionsAuthors === null) {
        missionsAuthors = $("#authorSelected").val();
    }
    var missionDescription = $("#missionDescription").val();
    var missionNotes = $("#missionNotes").val();
    var missionF3version = $("#f3Version").val();
    var isBroken = $('#missionBroken').prop('checked');
    var needsRevision = $('#missionNeedsRevision').prop('checked');

    if ( !(missionName.match(/^[a-zA-Z0-9'-_][a-zA-Z0-9'-_ ]+$/)) || missionName === "" || missionName === null) {
        MissionSaveError("Enter a mission name!");
        return false;
    }
    if (missionGame === "" || missionGame === null) {
        MissionSaveError("Select a game!");
        return false;
    }
    if (missionIsland === "" || missionIsland === null) {
        MissionSaveError("Select an island!");
        return false;
    }
    if (missionSession === "" || missionSession === null) {
        MissionSaveError("Select a session!");
        return false;
    }
    if (missionType === "" || missionType === null) {
        MissionSaveError("Select a mission type!");
        return false;
    }

    if (isNaN(missionSlots)  || missionSlots <= 0 || missionSlots === null) {
        MissionSaveError("Slots must be a number > 0");
        return false;
    }

    if (isNaN(missionPlaycount)  || missionPlaycount < 0 || missionPlaycount === null) {
        MissionSaveError("Playcount must be at least 0");
        return false;
    }

    if (missionsAuthors === "" || missionsAuthors === null) {
        MissionSaveError("Select or enter an author!");
        return false;
    }
    
    if (missionDescription.trim().length < 1  || missionDescription === null) {
        MissionSaveError("Enter a description for your mission!");
        return false;
    }
    if (missionF3version === "" || missionF3version === null) {
        MissionSaveError("Select a F3 version!");
        return false;
    }
    if (isBroken || needsRevision) {
        if (missionNotes.trim().length < 1 || missionNotes ===
            null) {
            MissionSaveError("Please enter notes on the state of the mission!");
            return false;
        }
    }
    
    var Mission = Parse.Object.extend("Missions");
    var objMission = new Mission();
    
    var currentUser = Parse.User.current();
    
    if (object === null) {
        objMission.set("createdBy", currentUser);
    } else {
       objMission = window.row;
    }
        
    objMission.set("missionName", missionName);
    objMission.set("game", missionGame);
    objMission.set("missionMap", missionIsland);
    objMission.set("Session", missionSession);
    objMission.set("missionType", missionType);
    objMission.set("missionPlayers", missionSlots);
    objMission.set("playedCounter", missionPlaycount);
    objMission.set("missionAuthor", missionsAuthors);
    objMission.set("missionDesc", missionDescription);
    objMission.set("isBroken", isBroken);
    objMission.set("needsRevision", needsRevision);
    objMission.set("Scripts",missionF3version);
    objMission.set("missionNotes", missionNotes);
    
    var postACL = new Parse.ACL();
    postACL.setRoleWriteAccess("Administrator", true);
    postACL.setPublicReadAccess(true);
    postACL.setWriteAccess(currentUser.id, true);
    objMission.setACL(postACL);
    objMission.save(null, {
        success: function(gameScore) {
            window.location.href = "index.html";
        },
        error: function(gameScore, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and description.
            $("#errorEdit").text(error.message);
        }
    });
    return false;
}

function MissionSaveError(string) {
    $("#errorEdit").text(string);
}

function ToggleAuthors() {
    $("#authorSelected").toggle();
    $("#missionAuthors").toggle(); 
}

UpdateLogin();