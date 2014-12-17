Parse.initialize("1IijmSndIGJFPg6cw6xDl5PRe5AiGCHliyPzIgPc",
    "NHQLKq3nL8i0aK6Hz9J4EOMbAvHgkEu2XY5RAq8Q");
if (Parse.User.current() === null) {
    window.location.href = "index.html";
}
UpdateLogin();
function LoadRow() {
    var queryDict = {};
    location.search.substr(1).split("&").forEach(function(item) {
        queryDict[item.split("=")[0]] = item.split("=")[1];
    });
    if (queryDict.row) {
        var MissionObject = Parse.Object.extend("Missions");
        var query = new Parse.Query(MissionObject);
        query.get(queryDict.row, {
            success: function(object) {
                var currentUser = Parse.User.current();
                if (currentUser === null) return;
                var query = new Parse.Query(Parse.Role);
                query.equalTo("users", currentUser);
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
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }
    else
    {
      window.location.href = "index.html";
    }
}

function FixRows() {
    var MissionObject = Parse.Object.extend("Missions");
    var query = new Parse.Query(MissionObject);
    query.limit(1000);
    query.find({
        success: function(results) {
            var arr = [];
            for (var x = 0; x < results.length; x++) {
                var obj = results[x];
                if (obj.get("missionType") == "Co-op") {
                    obj.set("missionType", "Coop");
                    obj.save();
                }
            }
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function CheckRights(rowid, userid, ACL) {
    var currentUser = Parse.User.current();
    var query = new Parse.Query(Parse.Role);
    query.equalTo("users", currentUser);
    var value = null;
    query.find({
        success: function(roles) {
            for (var x = 0; x < roles.length; x++) {
                if (ACL.getWriteAccess(roles[x])) {
                    return;
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
$('#missionSave').click(function() {
    var missionName = $("#missionName").val();
    var missionGame = $("#missionGame").val();
    var missionIsland = $("#missionIsland").val();
    var missionSession = $("#missionSession").val();
    var missionType = $("#missionType").val();
    var missionSlots = Number($("#missionSlots").val());
    var missionsAuthors = $("#missionAuthors").val();
    var missionDescription = $("#missionDescription").val();
    var missionNotes = $("#missionNotes").val();
    var missionF3version = $("#f3Version").val();
    var isBroken = $('#missionBroken').prop('checked');
    var needsRevision = $('#missionNeedsRevision').prop('checked');
    
    if ( !(missionName.match(/^[a-zA-Z0-9][a-zA-Z0-9 ]+$/)) || missionName === "" || missionName === null) {
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

    window.row.set("missionName", missionName);
    window.row.set("game", missionGame);
    window.row.set("missionMap", missionIsland);
    window.row.set("Session", missionSession);
    window.row.set("missionType", missionType);
    window.row.set("missionPlayers", missionSlots);
    window.row.set("missionAuthor", missionsAuthors);
    window.row.set("missionDesc", missionDescription);
    window.row.set("isBroken", isBroken);
    window.row.set("needsRevision", needsRevision);
    window.row.set("Scripts",missionF3version);
    window.row.set("missionNotes", missionNotes);
    window.row.save(null, {
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
});
$("#loading").show();
LoadRow();
UpdateLogin();
