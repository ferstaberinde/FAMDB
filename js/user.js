function UpdateLogin()
{
  var currentUser = Parse.User.current();
  if(currentUser)
  {
    $("#LogoutButton").text("Logout");
    $("#AddButton").show();
  }
  else
  {
    $("#LogoutButton").text("Login");
    $("#AddButton").hide();
  }
}


function Login()
{
  $("#errorLogin").text("");
  Parse.User.logIn($("#loginName").val(), $("#PasswordInput").val(), {
  success: function(user) {
     HidePopup("#loginWindow");
      UpdateLogin();
  },
  error: function(user, error) {
    $("#errorLogin").text(error.message);
  }
});
}


function SignUp()
{
  $("#errorSignup").text("");
  var user = new Parse.User();
  user.set("username", $("#signupName").val());
  user.set("password", $("#signupPassword").val());
  user.set("email", $("#signupEmail").val());

  user.signUp(null, {
    success: function(user) {
      HidePopup("#loginWindow");
      $("#signupScreen").hide();
      $("#loginScreen").show();
      UpdateLogin();
    },
    error: function(user, error) {
      $("#errorSignup").text(error.message);
    }
  });
}
$('#LogoutButton').click(function(){
  if(Parse.User.current())
  {
    Parse.User.logOut();
    UpdateLogin();
  }
  else
  {
    OpenPopup("#loginWindow");
  }
});

$("#forgottonPassword").click(function(){
  $("#forgottenScreen").show();
  $("#loginScreen").hide();
});
$("#forgottenWindowOk").click(function(){
  var val = $("#forgottonUsername").val();
  Parse.User.requestPasswordReset(val, {
    success: function() {
      $("#forgottenScreen").hide();
      $("#loginScreen").show();
    }
  });
});

$('#forgottenWindowCancel').click(function(){
  $("#forgottenScreen").hide();
  $("#loginScreen").show();
});


$('#signupWindowOk').click(function(){
  SignUp();
});
$('#loginWindowOk').click(function(){
  Login();
});
$('#loginWindowSignup').click(function(){
  $("#signupScreen").show();
  $("#loginScreen").hide();
});
$('#signupWindowCancel').click(function(){
  $("#signupScreen").hide();
  $("#loginScreen").show();
});

$('#loginWindowCancel').click(function(){
  HidePopup("#loginWindow");
  $("#signupScreen").hide();
  $("#loginScreen").show();
});
