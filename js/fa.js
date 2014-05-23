var $A2Selector = $("#arma2select");
var $A3Selector = $("#arma3select");
var $CoopSelector = $("#coopselect");
var $AdvSelector = $("#advselect");
var $MapSelect = $("#mapselect");
var $MapSelectButton = $("#mapselectbutton");
var $VanillaButton = $("#vanillaButton");
var $VButton = $("#vButton");
var $SearchInput = $("#searchinput");
var $MissionTable = $("#missionTable");
var $MissionTitle = $("#missionTitle");
var $MissionAuthor = $("#missionAuthor");
var $PlayedText = $("#playedTimes");
var $LastPlayedText = $("#playedago");
var $MissionDesc = $("#missionDescTextArea");
var $MissionBrokenMsg = $("#brokenTextArea");
var $PlayerPrefix = $("#playedagoprefix");

var $MarkPlayedButton = $("#markplayedButton");
var $MarkBrokenButton = $("#markBrokenButton");
var $LoginButton = $("#loginButton");
var $LogoutButton = $("#logoutButton");
var $EditButton = $("#editrowButton");
var $SaveButton = $("#saveButton");
var $AddRowButton = $("#addRowButton");
var $AllButtion = $("#sessionallButton");
var $gameImage = $("#gameImage");
//// images
var imageCoop = "images/group-128.png";
var imageAdv = "images/v-128.png";
var imageV = "images/radio-128.png";
var imageVanilla = "images/vanilla-128.png";
var imageSlots = "images/slots-128.png";
var imageARMA3 = "images/arma3.png";
var imageARMA2 = "images/arma2.png";

var images = [imageCoop,imageAdv,imageV,imageVanilla,imageSlots,imageARMA3,imageARMA2];
function preload(arrayOfImages) {
  $(arrayOfImages).each(function () {
    $('<img />').attr('src',this).appendTo('body').css('display','none');
  });
}
preload(images);
var $iamgesDiv = $("#imagesDiv");
var ARMA2 = 0;
var ARMA3  = 1;
var currentGame = 1; // A3
var isLoading = false;
var gamenames = ["Arma 2","Arma 3"];
var arma3maps = ["All","Altis","Stratis"];
var arma2maps = ["All","Chernarus","Utes","Takistan","Desert","Zargabad","Proving Grounds","Shapur","United Sahrani","Podagorsk","Fallujah","Celle2"];

var currentMap = "All";
var currentSession = "All";
var currentType = "Adversarial";
var currentRow = "";

function SetGame(game)
{
  currentGame = game;
  console.log(game);
}

function HandleMap(item)
{
  currentMap = $(item).text();
  LoadData();
}

function FillMapSelect(game)
{
  var arr = [];
  if(game == ARMA3)
  {
    arr = arma3maps;
  }
  else
  {
    arr = arma2maps;
  }
  var ul = $MapSelect.find( "ul" );
  ul.empty();
  $("#mapEdit").empty();
  for(var x=0;x<arr.length;x++)
  {
    var value = arr[x];
    ul.append("<li><a href='#' onclick=HandleMap(this)>"+value+"</a></li>");
  }
  for(var x=0;x<arma2maps.length;x++)
  {
    if(arma2maps[x] != "All")
      $("#mapEdit").append("<option>"+arma2maps[x]+"</option>");
  }
  for(var x=0;x<arma3maps.length;x++)
  {
    if(arma3maps[x] != "All")
      $("#mapEdit").append("<option>"+arma3maps[x]+"</option>");
  }
}
function LoadRow(rowid)
{
  var Mission = Parse.Object.extend("Missions");
  var query = new Parse.Query(Mission);
  query.include("createdBy");
  query.equalTo("objectId",rowid);
  query.first({
    success: function(object) {
      if(object == null)
        return;
      ShowRow(object);
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}
function ShowRow(rowobject)
{
  $MissionTitle.text(rowobject.get("missionName"));
  $MissionAuthor.text(rowobject.get("missionAuthor"));
  var counter = rowobject.get("playedCounter");
  if(counter == null) { counter=0;};
  $PlayedText.text(counter);
  var lastPlayed = rowobject.get("lastPlayed");
  if(lastPlayed != null)
  {

    var then = moment(lastPlayed);
    var res = then.fromNow().split(" ");
    lastPlayed = res[0];
    $PlayerPrefix.text(res[1]+" "+res[2]);
  }
  else
  {
    lastPlayed = 0;
  }
  $MissionDesc.html(rowobject.get("missionDesc").replace(/\n/g, "<br />"));
  if(rowobject.get("brokenMsg") != null && rowobject.get("isBroken") != null && rowobject.get("isBroken") == true )
    $MissionBrokenMsg.html(rowobject.get("brokenMsg").replace(/\n/g, "<br />"));
  else
    $MissionBrokenMsg.html("");
  $LastPlayedText.text(lastPlayed);
  if(currentGame == ARMA3)
    $gameImage.attr("src", imageARMA3);
  else
    $gameImage.attr("src",imageARMA2);
  $iamgesDiv.empty();
  $iamgesDiv.append('<img src="'+imageSlots+'" class="margin5left" alt="some_text" width="16" height="16"><small>'+rowobject.get("missionPlayers")+'</small></img>');
  if(rowobject.get("Session") == "V+")
  {
        $iamgesDiv.append('<img src="'+imageV+'" class="margin5left" alt="some_text" width="16" height="16"></img>');
  }
  else
  {
        $iamgesDiv.append('<img src="'+imageVanilla+'" class="margin5left" alt="some_text" width="16" height="16"></img>');
  }
  if(rowobject.get("missionType") == "Co-op")
  {
    $iamgesDiv.append('<img src="'+imageCoop+'"  class="margin5left" alt="some_text" width="16" height="16"></img>');
  }
  else
  {
    $iamgesDiv.append('<img src="'+imageAdv+'"  class="margin5left" alt="some_text" width="16" height="16"></img>');
  }
  var query = (new Parse.Query(Parse.Role));
  query.equalTo("name", "Administrator");
  query.equalTo("users", Parse.User.current());
  var value = null;
  query.first({
    success: function(adminRole) {
      if((Parse.User.current() != null && Parse.User.current().id == rowobject.get("createdBy").id) || adminRole != null && Parse.User.current() != null )
      {
        $MarkPlayedButton.show();
        $MarkBrokenButton.show();
        $EditButton.show();
      }
      else
      {
        $MarkPlayedButton.hide();
        $MarkBrokenButton.hide();
        $EditButton.hide();
      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}
function ShowSignUp()
{
  $("#signForm").show();
  $("#loginForm").hide();
}
function LogOut()
{
  Parse.User.logOut();
  LoggedIn();
  ResetLogin();
  ReloadRow();
}
function ResetLogin()
{
  $('#signForm').hide();
  $('#loginForm').show();
}
function Close(id)
{
  $("#"+id).remove();
}
function TryLogin()
{
  var user = $("#loginUsername").val();
  var pass = $("#loginPassword").val();
  //   alert(user +" "+pass);
  //  var user = "tiger";
  //  var pass = "tiger";
  Parse.User.logIn(user, pass, {
    success: function(user) {
      $('#loginScreen').modal('hide');
      LoggedIn();
      ResetLogin();
      ReloadRow();
    },
    error: function(user, error) {
      var id = Math.floor((Math.random()*100)+1);
      if(error.code === 101)
      {
        var str = "Wrong username or password.";
      }
      else
      {
        var str = "Whoops something went wrong! ("+error.message+")";
      }

      $("#loginPasswordError").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")
    }
  });
  return false;
}
function Signup()
{
  $("#signUserError").empty();
  $("#signPasswordError").empty();
  $("#signEmailError").empty();
  var userN = $("#signUsername").val();
  var pass = $("#signPassword").val();
  var email = $("#signEmail").val();
  var user = new Parse.User();
  user.set("username", userN);
  user.set("password", pass);
  user.set("email",email);
  user.set("isAdmin",false);


  user.signUp(null, {
    success: function(user) {
      user.save();
      var postACL = new Parse.ACL();
      postACL.setRoleReadAccess("Administrator",true);
      postACL.setRoleWriteAccess("Administrator", true);
      user.setACL(postACL);
      user.save();

    },
    error: function(user, error) {
      switch(error.code)
      {
        case Parse.Error.USERNAME_TAKEN:
          var id = Math.floor((Math.random()*100)+1);
          var str = "<small>Username has already been taken</small>";
          $("#signUserError").append("<div id='"+id+"' class='alert smallnote center-block alert-danger alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>");
          break;
        case -1:
          if($("#signUsername").val() === "")
          {
            var id = Math.floor((Math.random()*100)+1);
            var str = "<small>You need a username</small>";
            $("#signUserError").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>");
          }
          if($("#signPassword").val() === "")
          {
            var id = Math.floor((Math.random()*100)+1);
            var str = "<small>You need a password</small>";
            $("#signPasswordError").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>");
          }
          break;
        case Parse.Error.EMAIL_TAKEN:
          var id = Math.floor((Math.random()*100)+1);
          var str = "<small>Email has already been registered</small>";
          $("#signEmailError").append("<div id='"+id+"' class='alert smallnote center-block alert-danger alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>");
          break;
        default:
          alert(error.message +error.code);
      }
      return false;
    }
  });

  return false;
}
function ReloadRow()
{
  if(currentRow == "")
    return;
  LoadRow(currentRow);
}
function LoadData()
{
  if(isLoading)
  {
    return;
  }
  isLoading = true;
  $("#missionTable tbody").empty();
  var Mission = Parse.Object.extend("Missions");
  var query = new Parse.Query(Mission);
  query.limit(1000);
  query.exists("missionName");
  query.include("createdBy");
  query.equalTo("game",gamenames[currentGame]);
  query.equalTo("missionType",currentType);
  if($SearchInput.val() != "")
  {
    query.contains("missionName",$SearchInput.val());
  }
  if(currentMap != "All")
  {
    query.equalTo("missionMap",currentMap);
  }
  if(currentSession != "All")
  {
    query.equalTo("Session",currentSession);
  }
  query.find({
    success: function(results) {
      // alert("Successfully retrieved " + results.length + " scores.");
      // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        var text = "<tr id='"+object.id+"'><td>"+object.get("missionName")+"</td><td>"+object.get("missionPlayers")+"</td><td>"+moment(object.get("lastPlayed")).fromNow()+"</td></tr>";
        $("#missionTable tbody").append(text);
        if(object.get("isBroken") != null && object.get("isBroken") == true)
        {
          $("#"+object.id).addClass("danger");
        }
        $("#"+object.id).click(function () {
          if(currentRow != "")
          {
            $("#"+currentRow).removeClass("active");
          }
          var id = $(this).attr('id');
          $("#"+id).addClass("active");
          currentRow = id;
          LoadRow(id);
        });
      }
      isLoading = false;
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
      isLoading = false;
    }
  });

}

function LoggedIn()
{
  if(Parse.User.current() != null)
  {
    $LoginButton.hide();
    $LogoutButton.show();
    $AddRowButton.show();
  }
  else
  {
    $LoginButton.show();
    $LogoutButton.hide();
    $AddRowButton.hide();
  }
};
function Edit(id)
{
  // build edit window
  var Mission = Parse.Object.extend("Missions");
  var query = new Parse.Query(Mission);
  query.equalTo("objectId",id);
  query.first({
    success: function(obj) {
      // set model window info
      $("#missionName").val(obj.get("missionName"));
      $("#mapEdit").val(obj.get("missionMap"));
      $("#authorEdit").val(obj.get("missionAuthor"));
      $("#Slots").val(""+obj.get("missionPlayers"));
      $("#Session").val(obj.get("Session"));
      $("#game").val(obj.get("game"));
      $("#missionType").val(obj.get("missionType"));
      $("#missionDesc").val(obj.get("missionDesc"));
      if(obj.get("isBroken") == true)
      {
        $("#brokenTrueButt").button('toggle');

      }
      else
      {
        $("#brokenFalseButt").button('toggle');
      }
      $("#isBrokenMsg").val(obj.get("brokenMsg"));
      window.editObject = obj;
      $('#editWindow').modal();
    },
    error: function(error) {
      LogError(error);
    }
  });
}
function TryEdit()
{
  if(!window.editObject)
  {
    return;
  }
  miss = window.editObject;
  var missionName = $("#missionName").val();
  var missionMap = $("#mapEdit").val();
  var session = $("#Session").val();
  var missionType = $("#missionType").val();
  var missionDesc = $("#missionDesc").val();
  var missionPlayers = parseInt($("#Slots").val());
  var missionAuthor = $("#authorEdit").val();
  var game = $("#game").val();
  var isbrokenMsg = $("#isBrokenMsg").val();
  var isBroken = false;
  if($("#brokenTrueButt").hasClass("active"))
  {
    isBroken = true;
  }
  var error = false;
  if(missionName == "")
  {
    var id = Math.floor((Math.random()*100)+1);
    var str = "<small>You need a mission name</small>";
    $("#error-missionName").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")
    error = true;
  }
  if(missionMap == "")
  {
    var id = Math.floor((Math.random()*100)+1);
    var str = "<small>You need to specify a island</small>";
    $("#error-map").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")
    error = true;
  }
  if(session == "")
  {
    var id = Math.floor((Math.random()*100)+1);
    var str = "<small>You need a session type</small>";
    $("#error-session").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")
    error = true;
  }
  if(missionType == "")
  {
    var id = Math.floor((Math.random()*100)+1);
    var str = "<small>You need a mission type</small>";
    $("#error-missionType").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")
    error = true;
  }
  if(missionDesc == "")
  {
    var id = Math.floor((Math.random()*100)+1);
    var str = "<small>You need a mission description</small>";
    $("#error-missionDesc").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")
    error = true;
  }
  if(missionPlayers <= 0 || isNaN(missionPlayers))
  {
    var id = Math.floor((Math.random()*100)+1);
    var str = "<small>You need to specify number of slots</small>";
    $("#error-Slots").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")
    error = true;
  }

  if(missionAuthor == "")
  {
    var id = Math.floor((Math.random()*100)+1);
    var str = "<small>You need a author</small>";
    $("#error-author").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")
    error = true;
  }
  if(error)
  {
    return;
  }
  miss.set("missionName",missionName);
  miss.set("missionMap",missionMap);
  miss.set("Session",session);
  miss.set("missionType",missionType);
  miss.set("missionDesc",missionDesc);
  miss.set("missionPlayers",missionPlayers);
  miss.set("missionAuthor",missionAuthor);
  miss.set("game",game);
  miss.set("playedCounter",0);
  miss.set("createdBy",Parse.User.current());
  miss.set("isBroken",isBroken);
  miss.set("brokenMsg",isbrokenMsg);
  miss.save(null, {
    success: function(gameScore) {
      // Execute any logic that should take place after the object is saved.
      $('#editWindow').modal('hide')
      LoadData();
      ReloadRow();
      window.editObject = null;
    },
    error: function(gameScore, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and description.
      var id = Math.floor((Math.random()*100)+1);
      var str = "<small>"+error.message+"</small>";
      $("#error-missionDesc").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")

    }
  });
}
function TryAdd()
{
  var Mission = Parse.Object.extend("Missions");
  var currentUser = Parse.User.current();
  var miss = new Mission();
  var missionName = $("#missionName").val();
  var missionMap = $("#map").val();
  var session = $("#Session").val();
  var missionType = $("#missionType").val();
  var missionDesc = $("#missionDesc").val();
  var missionPlayers = parseInt($("#Slots").val());
  var missionAuthor = $("#author").val();
  var game = $("#game").val();
  var error = false;
  if(missionName == "")
  {
    var id = Math.floor((Math.random()*100)+1);
    var str = "<small>You need a mission name</small>";
    $("#error-missionName").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")
    error = true;
  }
  if(missionMap == "")
  {
    var id = Math.floor((Math.random()*100)+1);
    var str = "<small>You need to specify a island</small>";
    $("#error-map").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")
    error = true;
  }
  if(session == "")
  {
    var id = Math.floor((Math.random()*100)+1);
    var str = "<small>You need a session type</small>";
    $("#error-session").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")
    error = true;
  }
  if(missionType == "")
  {
    var id = Math.floor((Math.random()*100)+1);
    var str = "<small>You need a mission type</small>";
    $("#error-missionType").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")
    error = true;
  }
  if(missionDesc == "")
  {
    var id = Math.floor((Math.random()*100)+1);
    var str = "<small>You need a mission description</small>";
    $("#error-missionDesc").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")
    error = true;
  }
  if(missionPlayers <= 0 || isNaN(missionPlayers))
  {
    var id = Math.floor((Math.random()*100)+1);
    var str = "<small>You need to specify number of slots</small>";
    $("#error-Slots").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")
    error = true;
  }
  if(missionAuthor == "")
  {
    var id = Math.floor((Math.random()*100)+1);
    var str = "<small>You need a author</small>";
    $("#error-author").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")
    error = true;
  }
  if(error)
  {
    return;
  }
  miss.set("missionName",missionName);
  miss.set("missionMap",missionMap);
  miss.set("Session",session);
  miss.set("missionType",missionType);
  miss.set("missionDesc",missionDesc);
  miss.set("missionPlayers",missionPlayers);
  miss.set("missionAuthor",missionAuthor);
  miss.set("isBroken",false);
  miss.set("game",game);
  miss.set("playedCounter",0);
  miss.set("createdBy",Parse.User.current());
  var postACL = new Parse.ACL();
  postACL.setRoleWriteAccess("Administrator", true);
  postACL.setPublicReadAccess(true);
  postACL.setWriteAccess(currentUser.id, true);
  miss.setACL(postACL);
  miss.save(null, {
    success: function(gameScore) {
      // Execute any logic that should take place after the object is saved.
      $('#editWindow').modal('hide')
      LoadData();
      ReloadRow();
    },
    error: function(gameScore, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and description.
      var str = error.message;
      $("#error-missionDesc").append("<div id='"+id+"' class='alert smallnote center-block alert-warning alert-dismissable'><button type='button' class='close' onclick='Close("+id+")' aria-hidden='true'>&times;</button>"+str+"</div>")
    }
  });
  return false;
}
function DeleteCurrent()
{
  if(!window.editObject)
    return;
  window.editObject.destroy({
    success: function(myObject) {
      $('#editWindow').modal('hide');
      $('#confirmDeleteModal').modal('hide');
      window.editObject = null;
      LoadData();
    },
    error: function(myObject, error) {
      Alert("Error:"+error.message);
    }
  });
}
function MarkAsPlayed(id)
{
  var Mission = Parse.Object.extend("Missions");
  var query = new Parse.Query(Mission);
  query.equalTo("objectId",id);
  query.first({
    success: function(obj) {
      var counter = obj.get("playedCounter");
      if(counter == "undefined")
      {
        counter = 1;
      }
      else
      {
        counter += 1;
      }
      obj.set("playedCounter",counter);
      obj.set("lastPlayed",new Date());
      obj.save().then(function() {
        ReloadRow();
        LoadData();
      }, function(error) {
        // The file either could not be read, or could not be saved to Parse.
      });
    },
    error: function(error) {
      LogError(error);
    }
  });
}
////// INIT \\\\\\\\\\\\\\\
$A2Selector.change(function(){
  SetGame(0);
  FillMapSelect(0);
  LoadData();
});
$A3Selector.change(function(){
  SetGame(1);
  FillMapSelect(1);
  LoadData();
});
$CoopSelector.change(function(){
  currentType = "Co-op";
  LoadData();
});
$VButton.click(function(){
  currentSession = "V+";
  LoadData();
});
$VanillaButton.click(function(){
  currentSession = "Vanilla";
  LoadData();
});
$AllButtion.click(function(){
  currentSession = "All";
  LoadData();
});
$AdvSelector.change(function(){
  currentType = "Adversarial";
  LoadData();
});
$SearchInput.on('input',function(){
  LoadData();
});

$EditButton.click(function(){
  Edit(currentRow);

});
$AddRowButton.click(function(){
  ClearEditWindow();

});
$MarkPlayedButton.click(function(){
  if(currentRow == "" || currentRow == null)
    return;
  MarkAsPlayed(currentRow);
  ReloadRow();
});
function ClearEditWindow()
{
  $("#missionName").val("");
  $("#mapEdit").val("");
  $("#authorEdit").val("");
  $("#Slots").val("");
  $("#Session").val("");
  $("#game").val("");
  $("#missionType").val("");
  $("#missionDesc").val("");
  $("#brokenFalseButt").button('toggle');
  $("#isBrokenMsg").val("");
  window.editObject = null;
  $('#editWindow').modal();
}
$SaveButton.click(function(){
  if(window.editObject != null)
  {
    TryEdit();
  }
  else
  {
    TryAdd();
  }
});

Parse.initialize("1IijmSndIGJFPg6cw6xDl5PRe5AiGCHliyPzIgPc", "NHQLKq3nL8i0aK6Hz9J4EOMbAvHgkEu2XY5RAq8Q");
FillMapSelect(1);
LoadData();
LoggedIn();
ResetLogin();
$EditButton.hide();
$MarkPlayedButton.hide();
$MarkBrokenButton.hide();
