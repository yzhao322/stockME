$(document).ready(function () {
    const viewDetails = $(".view-details");
    const deleteAccount = $(".delete-account");
    const addNotesToAccount = $("form.create-notes");
    const notesContent = $("textarea#account-notes");
    const account = $("input#username");
    const upgrade = $("form.upgrade");
    const degrade = $("form.degrade");

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
        let username = account.val();
        let notes = notesContent.val().trim();
        addNotesTo(username, notes);
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
            let createdDate = $("<p>").text( data.email + " is created at: " + data.createdAt);
            $(".user-list").append(createdDate);
            let accountNotes = $("<p>").text( data.email + "'s notes : " + data.notes);
            $(".user-list").append(accountNotes);
        })
            .catch((Err) => {
                console.log(Err);
            });
    }

    function addNotesTo(username, notes) {
        $.ajax({
            method: "PUT",
            url: "/api/user/notes/" + username,
            data: { notes: notes}
          })
            .then(function () {
                window.location.replace("/managers");
            })
            .catch((Err) => {
                console.log(Err);
            });
    }
    function upgradeToManager(username) {
        $.ajax({
            method: "PUT",
            url: "/api/user/title/" + username,
            data: { title: "Manager"}
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
            data: { title: "Member"}
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


})