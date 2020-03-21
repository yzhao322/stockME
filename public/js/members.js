$(document).ready(function () {
  var add = $("form.addup");
  var deleteit = $("form.delete");
  var stockname = $("input#stock-input");

  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.email);
    for (let i = 0; i < data.data.length; i++){
      $(".stock-data").append($("<button>").text(data.data[i].stockname));
    }
  });

  add.on("submit", function (event) {
    event.preventDefault();
    var stockName = stockname.val().trim();
    if (!stockName) {
      return;
    }
    addStock(stockName);
    stockname.val("");
  });

  deleteit.on("submit", function (event) {
    event.preventDefault();
    var stockName = stockname.val().trim();
    if (!stockName) {
      return;
    }
    deleteStock(stockName);
    stockname.val("");

  })

  function addStock(Name) {
    $.post("/api/stock_name", {
      stockname: Name,
      username: $(".member-name").text()
    })
      .then(function () {
        window.location.replace("/members");
      })
      .catch((Err) => {
        console.log(Err);
      })
  }

  function deleteStock(Name) {
    $.ajax({
      method: "DELETE",
      url: "/api/user_data/" + Name
    })
      .then(function () {
        window.location.replace("/members");
      })
      .catch((Err) => {
        console.log(Err);
      })
  }

});
