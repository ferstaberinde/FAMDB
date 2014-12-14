Parse.initialize("1IijmSndIGJFPg6cw6xDl5PRe5AiGCHliyPzIgPc",
    "NHQLKq3nL8i0aK6Hz9J4EOMbAvHgkEu2XY5RAq8Q");
if (!Parse.User.current()) {
    window.location.href = "index.html";
}
function MissionSaveError(string)
{
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
    if (missionName === "" || missionName === null) {
        MissionSaveError("Name is invaild.");
        return false;
    }
    if (missionGame === "" || missionGame === null) {
        MissionSaveError("Invaild game selection");
        return false;
    }
    if (missionIsland === "" || missionIsland === null) {
        MissionSaveError("Invaild Island selection");
        return false;
    }
    if (missionSession === "" || missionSession === null) {
        MissionSaveError("Invaild Session selection");
        return false;
    }
    if (missionType === "" || missionType === null) {
        MissionSaveError("Invaild mission type selection");
        return false;
    }
    if ((missionSlots < 0) || missionSlots === null) {
        MissionSaveError("Invaild data in Slots field");
        return false;
    }
    if (missionsAuthors === "" || missionsAuthors === null) {
        MissionSaveError("Invaild data in Author field");
        return false;
    }
    if (missionDescription === "" || missionDescription === null) {
        MissionSaveError("Invaild data in Mission Description field");
        return false;
    }
    if (missionF3version === "" || missionF3version === null) {
        MissionSaveError("Invaild data in F3 version field");
        return false;
    }
    if (isBroken) {
        if (missionNotes === "" || missionNotes ===
            null) {
            MissionSaveError("Missing mission notes");
            return false;
        }
    }
    if (needsRevision) {
        if (missionNotes === "" || missionNotes ===
            null) {
            MissionSaveError("Missing mission notes");
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
