$(document).ready(function () {
    const upgrade = $("form.upgrade");
    const degrade = $("form.degrade");

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
})