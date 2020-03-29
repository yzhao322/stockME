$(document).ready(function () {
    const viewDetails = $(".view-details");
    const deleteAccount = $(".delete-account");
    const addNotesToAccount = $("form.create-notes");
    const notesContent = $("textarea#account-notes");
    const account = $("input#usernameByInput");
    const upgrade = $("form.upgrade");
    const degrade = $("form.degrade");

    var username;
    var username2;
   

    $("span").hide();

    account.on("click", function (event) {
        event.preventDefault();
        $("form span").show();
        $("#addNoteMsg").text("Enter a note that you want to add to this account");
    })

    viewDetails.on("click", function (event) {
        event.preventDefault();
        let username = this.parentElement.querySelector("p").textContent;
        getDetail(username);
    });

    deleteAccount.on("click", function (event) {
        event.preventDefault();
        let username = this.parentElement.querySelector("p").textContent;
        deleteThisAccount(username);
    });

    addNotesToAccount.on("submit", function (event) {
        event.preventDefault();

        let notes = notesContent.val().trim();
        username = account.val();
        username2 = $("#username").text();
        console.log("username: ", username, "username2:", username2);


        if (username != null) {
            addNotesTo(username, notes);
            username= username.toString();
            $("#addNoteMsg2").text("notes are succesully updated to ", username);
        } else {
            addNotesTo(username2, notes);
            username2= username2.toString();
            $("#addNoteMsg2").text("notes are succesully updated to ", username2);
        };

        
    });

    upgrade.on("submit", function (event) {
        event.preventDefault();
        let username = this.name;
        upgradeToManager(username);
    });
    degrade.on("submit", function (event) {
        event.preventDefault();
        let username = this.name;
        degradeToMember(username);
    });

    function getDetail(username) {
        $.get("/api/user/" + username).then(function (data) {
            $(".user-list").text("");
            let createdDate = $("<p>").text(data.email + " is created at: " + data.createdAt);
            $(".user-list").append($("<hr>"));
            $(".user-list").append(createdDate);
            let accountNotes = $("<p>").text(data.email + "'s notes : " + data.notes);
            $(".user-list").append(accountNotes);
            $("#selectedUser").text("You have selected :")
            $("#username").text(data.email);
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
            .then(function () {
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
            .then(function () {
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
            .then(function () {
                window.location.replace("/managers");
            })
            .catch((Err) => {
                console.log(Err);
            });
    }

    // Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementsByClassName("submit")[0];

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function(username,username2) { 
  modal.style.display = "block";
}


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  console.log(username);
  window.location.replace("/managers");
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

})