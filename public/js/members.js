$(document).ready(function () {
  var search = $("form.searchup");
  var stockname = $("input#stock-input");

  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.email);
    for (let i = 0; i < data.data.length; i++){
      $(".stock-data").append($("<button>").text(data.data[i].stockname));
    }
  });

  search.on("submit", function (event) {
    event.preventDefault();
    var stockName = stockname.val().trim();
    if (!stockName) {
      return;
    }
    searchStock(stockName);
    stockname.val("");
  });

  function searchStock(Name) {
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
});
