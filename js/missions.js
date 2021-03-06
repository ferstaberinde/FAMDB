// Functions used to populate the main table

function LoadData() {
    var sessionVal = $("#sessionSelected").val();
    var mapVal = $("#islandSelected").val();
    var authorVal = $("#authorSelected").val();
    var gameVal = $("#gameSelected").val();
    var MissionObject = Parse.Object.extend("Missions");
    var searchVal = $("#searchText").val();
    var query = new Parse.Query(MissionObject);
    if (mapVal != "All Maps") query.equalTo("missionMap", mapVal);
    if (authorVal != "All Authors") query.contains("missionAuthor",
        authorVal);
    
    if ($("#missionBroken:checked").val()) query.equalTo("isBroken", true);
    if ($("#missionNeedsRevision:checked").val()) query.equalTo("needsRevision", true);
    if ($("#missionWorking:checked").val()) query.equalTo("isBroken", false);
    //if ($("#missionFine:checked").val()) query.equalTo("needsRevision", true);
	var checkboxes = $("#missionTypes").find(':checkbox');
	var strings = [];
	for(var x = 0;x<checkboxes.length;x++) {
		var checkbox = checkboxes[x];
		if(checkbox.checked === true) {
			strings.push(checkbox.id);
		}
	}
	query.containedIn("missionType",strings);

    if (searchVal !== "") query.contains("missionName", searchVal);
    query.greaterThanOrEqualTo("missionPlayers", Number($("#slotsMin").val()));
    query.lessThanOrEqualTo("missionPlayers", Number($("#slotsMax").val()));
    if(sessionVal != "All Sessions")
    {
         query.equalTo("Session", sessionVal);
    }
    if(gameVal != "All Games")
    {
         query.equalTo("game", gameVal);
    }
    query.limit(1000);
    query.include("createdBy");
    $("#missionTable > tbody").html("");
    query.find({
        success: function(results) {
            var flip = false;
            for (var x = 0; x < results.length; x++) {
                var obj = results[x];
                var data = "";
                data = '<tr class="row">';
                flip = !flip;
                data +=
                    '<td class="cellMissions"><a href="#"><i id="chevron" class="fa fa-chevron-up"></i> ' +
                    obj.get("missionName") + '</a></td>';
                
                data += '<td class="cellType">' + 
					obj.get("missionType") + '</td>';

                data += '<td class="cellSlots">' + 
					obj.get("missionPlayers") + '</td>';
                
                var missionMap = obj.get("missionMap");
                if (missionMap == "Virtual Reality") {missionMap = "VR"};
                data += '<td class="cellIsland">' + missionMap + '</td>';
                
                data += '<td class="cellPlayed"><a class="playCounterMod" href="#" title="Decrease playcount">-</a> <span id="' +  obj.id + '_counterPlayed">' + obj.get(
                        "playedCounter") + '</span> <a class="playCounterMod" href="#" title="Increase playcount">+</a></td>';
                
                if (obj.get("lastPlayed") && obj.get("lastPlayed").split(' ')[0] > 2013) {data +=
                    '<td class="cellLastPlayed"> <span title="Set last date played" id="' +  obj.id + '_lastPlayed">' + obj.get("lastPlayed") +
                    '</span></td>'}
                else {data += '<td class="cellLastPlayed"><span title="Set last date played" id="' +  obj.id + '_lastPlayed">Never</span></td>'};

                data += '<td class="cellAuthor">' + obj.get(
                    "missionAuthor") + '</td>';
                data += '<td class="cellModified">' + moment(
                        obj.updatedAt).format("YYYY MM DD") +
                    '</td>';
                
                if (obj.get("isBroken") === true) data +=
                    '<td class="cellBroken"><i title="Broken" class="fa fa-exclamation-triangle"></i></td>';
                else data += '<td class="cellBroken"></td>';
                
                if (obj.get("needsRevision") === true) data +=
                    '<td class="cellRevision"><i title="Revision" class="fa fa-exclamation-circle"></i></td>';
                else data += '<td class="cellRevision"></td>';
                
                data += '</tr>';
                data +=
                    '<tr id="descRow" class="row descRow"><td id="' +
                    obj.id +
                    '" class="cellDropdown" colspan="10">';
                data +=
                    '<p class="fullInfo"><span class="cellDropdownSubtitle">Map</span><br>' +
                    obj.get("missionMap") + "</p>";
                data +=     '<p class="fullInfo"><span class="cellDropdownSubtitle">Type</span><br>' +
                    obj.get("missionType"); + "</p>";        
            
                data += '<p class="fullInfo"><span class="cellDropdownSubtitle"># Slots</span><br>'+obj.get("missionPlayers")+'</p>';
                
                data += '<p class="fullInfo"><span class="cellDropdownSubtitle"># Played</span><br>' +
                    obj.get("playedCounter") + "</p>";
                
                if (obj.get("lastPlayed") && obj.get("lastPlayed").split(' ')[0] > 2013) data +=
                    '<p class="fullInfo"><span class="cellDropdownSubtitle">Last Played</span><br>' +
                    obj.get("lastPlayed") + "</p>";
                else data += '<p class="fullInfo"><span class="cellDropdownSubtitle">Last Played</span><br>Never';
                
                data +=
                    '<p class="fullInfo"><span class="cellDropdownSubtitle">Author(s)</span><br>' +
                    obj.get("missionAuthor") + "</p>";
                data +=
                    '<p class="fullInfo"><span class="cellDropdownSubtitle">Last Modified</span><br>' +
                    moment(obj.updatedAt).format("YYYY MM DD") +
                    "</p>";
                data +=
                    '<p><span class="cellDropdownSubtitle">Description</span><br>' +
                    obj.get("missionDesc").replace(/\n/g,
                        "<br />") + "</p>";
              if(obj.get("Scripts"))
              {
                data +=
                    '<p><span class="cellDropdownSubtitle">F3 Version</span><br>' +
                    obj.get("Scripts").replace(/\n/g, "<br />") +
                    "</p>";
              }

            if (obj.get("isBroken") === true) {
                data +=
                    '<p class="fullInfo"><span class="cellDropdownSubtitle">Broken</span><br>Yes</p>';

            }
            else data +=
             '<p class="fullInfo"><span class="cellDropdownSubtitle">Broken</span><br>No</p>';

            if (obj.get("needsRevision") === true) {
                    data +=
                        '<p class="fullInfo"><span class="cellDropdownSubtitle">Needs Revision</span><br>Yes</p>';

             }
            else data +=
             '<p class="fullInfo"><span class="cellDropdownSubtitle">Needs Revision</span><br>No</p>';

              if (obj.get("missionNotes")) data +=
                        '<p><span class="cellDropdownSubtitle">Mission Notes</span><br>' +
                        obj.get("missionNotes").replace(/\n/g,
                            "<br />") + "</p>";

                data += '</td></tr>';
                $("#missionTable > tbody").append(data);

                var ACL = obj.getACL();
                if (Parse.User.current()) CheckRights(obj,
                   obj.get("createdBy").id, ACL);
            }
            
            // Hide all description rows
            $('.descRow').hide();

            // Setup hide/show toggle on clicking the mission name
            $(".cellMissions").click(function() {
              $(this).find("#chevron").toggleClass("fa-chevron-down fa-chevron-up");
              $(this).parent().next('#descRow').toggle();
                return false;
            });

            // Sort the table
            $("#missionTable").tablesorter({
                // sort on the first column and third column, order asc
                widgets: ["zebra"], // initialize zebra striping of the table
                sortList: [[0,0]], // Sort table alphabetically by default
                widgetZebra: {
                    css: ["normal-row", "odd"]
                },
                cssChildRow: "descRow"
            });

            setTimeout(function() {
                var resort = false, // re-apply the current sort
                    callback = function(table) {};
                // let the plugin know that we made a update, then the plugin will
                // automatically sort the table based on the header settings
                $("table").trigger("updateAll", [resort,
                    callback
                ]);
            }, 100);
            
        },
        error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });
    // <ul><li><a href="#">Delete</a></li><li><a href="#">Edit</a></li></ul>
}

function DeleteRow() {
    var MissionObject = Parse.Object.extend("Missions");
    var query = new Parse.Query(MissionObject);
    query.get(window.delRow, {
        success: function(object) {
            object.destroy({
                success: function(myObject) {
                    HidePopup("#deleteWindow");
                    LoadData();
                    return false;
                },
                error: function(myObject, error) {
                    Alert("Error:" + error.message);
                }
            });
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}
