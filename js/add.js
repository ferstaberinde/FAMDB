Parse.initialize("1IijmSndIGJFPg6cw6xDl5PRe5AiGCHliyPzIgPc",
    "NHQLKq3nL8i0aK6Hz9J4EOMbAvHgkEu2XY5RAq8Q");
if (!Parse.User.current()) {
    window.location.href = "index.html";
}

UpdateLogin();
GetMissionAuthor();
$("#missionAuthors").hide();

$('#missionSave').click(function() {
    var missionName = $("#missionName").val();
    var missionGame = $("#missionGame").val();
    var missionIsland = $("#missionIsland").val();
    var missionSession = $("#missionSession").val();
    var missionType = $("#missionType").val();
    var missionSlots = Number($("#missionSlots").val());
    var missionsAuthors = $("#authorSelected").val();
    if ($("#missionAuthors").val().trim().length > 1) {
        missionsAuthors = $("#missionAuthors").val();
    };
    var missionDescription = $("#missionDescription").val();
    var missionNotes = $("#missionNotes").val();
    var missionF3version = $("#f3Version").val();
    var isBroken = $('#missionBroken').prop('checked');
    var needsRevision = $('#missionNeedsRevision').prop('checked');
    
    if ( !(missionName.match(/^[a-zA-Z0-9][a-zA-Z0-9 ]+$/)) || missionName === "" || missionName === null) {
        MissionSaveError("Mission can't be empty or begin with a whitespace!");
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

    if (missionsAuthors === "All Authors" || missionsAuthors.trim().length < 1 || missionsAuthors === null) {
        MissionSaveError("Select an existing author or create a new one!");
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
    objMission.set("missionName", missionName);
    objMission.set("game", missionGame);
    objMission.set("missionMap", missionIsland);
    objMission.set("Session", missionSession);
    objMission.set("missionType", missionType);
    objMission.set("missionPlayers", missionSlots);
    objMission.set("missionAuthor", missionsAuthors);
    objMission.set("missionDesc", missionDescription);
    objMission.set("isBroken", isBroken);
    objMission.set("needsRevision", needsRevision);
    objMission.set("Scripts",missionF3version);
    objMission.set("missionNotes", missionNotes);
    objMission.set("playedCounter", 0);
    objMission.set("createdBy", Parse.User.current());
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
});
