$(document).ready(function() {
    const viewDetails = $(".view-details");
    const deleteAccount = $(".delete-account");
    const notesContent = $("textarea#account-notes");
    const account = $("input#usernameByInput");
    const upgrade = $("form.upgrade");
    const degrade = $("form.degrade");


    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var addNotebtn = document.getElementById("submit");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    //styling pages
    $("span").hide();

    $(".user-list-info").hide();
    $("li#user-list-info").click(function(event) {
        event.preventDefault();
        $('.user-list-info').toggle("slide");
    });

    $(".account-management").hide();
    $("li#account-management").click(function(event) {
        event.preventDefault();
        $('.account-management').toggle("slide");
    });

    $("form.notePanel").hide();
    $("li#notePanel").click(function(event) {
        event.preventDefault();
        $('form.notePanel').toggle("slide");
    });

    account.on("click", function(event) {
        event.preventDefault();
        $("form span").show();
        $("#addNoteMsg").text("Enter a note that you want to add to this account");
    })

    viewDetails.on("click", function(event) {
        event.preventDefault();
        let username = this.name;
        getDetail(username);
        $("input.form-control").text((this.name)).attr("placeholder", this.name);

    });

    addNotebtn.onclick = function() {


        event.preventDefault();

        let notes = notesContent.val().trim();

        let username = $("input#usernameByInput.form-control").val();
        let username2 = document.getElementById("usernameByInput").textContent;


        if (username) {
            document.getElementById("addNoteMsg").textContent = "You have updated notes to ：" + username;
            addNotesTo(username, notes);

        } else if (username2) {
            document.getElementById("addNoteMsg").textContent = "You have updated notes to ： " + username2;
            addNotesTo(username2, notes);


        } else {
            onsole.log("Nothing is selected")
        }

        modal.style.display = "block";

    }



    deleteAccount.on("click", function(event) {
        event.preventDefault();
        let username = this.name;
        deleteThisAccount(username);
    });

    upgrade.on("submit", function(event) {
        event.preventDefault();
        let username = this.name;
        upgradeToManager(username);
    });
    degrade.on("submit", function(event) {
        event.preventDefault();
        let username = this.name;
        degradeToMember(username);
    });

    function getDetail(username) {
        $.get("/api/user/" + username).then(function(data) {
                $(".user-list").text("");
                let createdDate = $("<p>").text(data.email + " is created at: " + data.createdAt);
                $(".user-list").append($("<hr>"));
                $(".user-list").append(createdDate);
                let accountNotes = $("<p>").text(data.email + "'s notes : " + data.notes);
                $(".user-list").append(accountNotes);
                $("#selectedUser").text("You have selected :")
                $("#usernameDisplay").text(data.email);
            })
            .catch((Err) => {
                console.log(Err);
            });
    }

    function addNotesTo(username, notes) {
        $.ajax({
                method: "PUT",
                url: "/api/user/notes/" + username,
                data: { notes: notes }
            })
            .catch((Err) => {
                console.log(Err);
            });
    }

    function upgradeToManager(username) {
        $.ajax({
                method: "PUT",
                url: "/api/user/title/" + username,
                data: { title: "Manager" }
            })
            .then(function() {
                window.location.replace("/master");
            })
            .catch((Err) => {
                console.log(Err);
            });
    }

    function degradeToMember(username) {
        $.ajax({
                method: "PUT",
                url: "/api/user/title/" + username,
                data: { title: "Member" }
            })
            .then(function() {
                window.location.replace("/master");
            })
            .catch((Err) => {
                console.log(Err);
            });
    }

    function deleteThisAccount(username) {
        $.ajax({
                method: "DELETE",
                url: "/api/user/" + username
            })
            .then(function() {
                window.location.replace("/managers");
            })
            .catch((Err) => {
                console.log(Err);
            });
    }

    // Get the modal


    // When the user clicks the button, open the modal 


    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {

        modal.style.display = "none";
        event.preventDefault();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            event.preventDefault();
            window.location.replace("/managers");
        }
    }

})