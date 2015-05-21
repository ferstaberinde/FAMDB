var missionTypes = ["Adversarial","Adversarial (ZEUS)","Coop","Coop (ZEUS)","ZEUS vs. Players","ZEUS vs. ZEUS","Other"];
var islands = ["Altis","Stratis","Virtual Reality"];
var games = ["Arma 3"];
var session = ["Vanilla"];


function GetGamesList(parent) {
    "use strict";
    $.each(games, function (key, value) {
        $(parent).append($("<option/>", {
            value: value,
            text: value
        }));
    });
}
function GetIslandsList(parent) {
    "use strict";

    $.each(islands, function (key, value) {
        $(parent).append($("<option/>", {
            value: value,
            text: value
        }));
    });
} 
function GetSessionsList(parent) {
    "use strict";
    $.each(session, function (key, value) {
        $(parent).append($("<option/>", {
            value: value,
            text: value
        }));
    });
} 
function GetMissionTypesList(parent) {
    "use strict";
    $.each(missionTypes, function (key, value) {
        $(parent).append($("<option/>", {
            value: value,
            text: value
        }));
    });
} 
function GenerateMissionTypesCheckbox(parent) {
    "use strict";
    $.each(missionTypes, function (key, value) {
        $('<input />', { type: 'checkbox', id: value, value: value,name: "missionType",checked:true }).appendTo(parent);
        $('<label />', { 'for': value, text: value }).appendTo(parent);
        $('<br/>',{}).appendTo(parent);
    });
} 

