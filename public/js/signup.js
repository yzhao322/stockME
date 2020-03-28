$(document).ready(function() {
  var signUpForm = $("form.signup");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");

  signUpForm.on("submit", function(event) {
    event.preventDefault();
    $(".signUpSuccessed").css("display","block");
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      title: "Member"
    };

    if (!userData.email || !userData.password || !userData.title) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password, userData.title);
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password, title) {
    $.post("/api/signup", {
      email: email,
      password: password,
      title: title
    })
      .then(function(data) {
        
        window.location.replace("/signUpSuccess");
      })
      .catch(handleLoginErr(err));
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
