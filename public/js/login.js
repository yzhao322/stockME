$(document).ready(function() {
    // Getting references to our form and inputs
    var loginForm = $("form.login");
    var emailInput = $("input#email-input");
    var passwordInput = $("input#password-input");
    var titleInput = $("#selector :selected");

    document.getElementById("clickMe").addEventListener("click", myFunction);

    var modal = document.getElementById("myModal");



    // When the form is submitted, we validate there's an email and password entered
    loginForm.on("submit", function(event) {
        event.preventDefault();
        var userData = {
            email: emailInput.val().trim(),
            password: passwordInput.val().trim(),
            title: titleInput.val()
        };

        if (!userData.email || !userData.password || !userData.title) {
            return;
        }

        // If we have an email and password we run the loginUser function and clear the form
        loginUser(userData.email, userData.password, userData.title);
        emailInput.val("");
        passwordInput.val("");
    });



    // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
    function loginUser(email, password, title) {
        $.post("/api/login", {
                email: email,
                password: password,
                title: title
            })
            .then(function(data) {
                if (data.title === "Member") {
                    window.location.replace("/members");
                } else if (data.title === "Manager") {
                    window.location.replace("/managers");
                } else if (data.title === "Master") {
                    window.location.replace("/master");
                }
            })
            .catch(function(err) {
                $(".modal-header").css("background-color", "orange");
                modal.style.display = "block";
            });
    }



    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    function myFunction() {
        window.location.href = "/signup.html";
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