$(document).ready(function() {
    var signUpForm = $("form.signup");
    var emailInput = $("input#email-input");
    var passwordInput = $("input#password-input");

    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    signUpForm.on("submit", function(event) {
        event.preventDefault();

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
            .catch(function(err) {

                $("#errorMsg").text(err.responseJSON.original.sqlMessage.slice(0, 15));
                $(".modal-header").css("background-color", "red");
                modal.style.display = "block";
                $(".msg").text(email + " is already taken, try another.");
            });
    }
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

});