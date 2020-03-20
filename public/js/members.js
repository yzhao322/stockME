$(document).ready(function () {
  var search = $("form.searchup");
  var stockname = $("input#stock-input");

  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.email);
  })

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
      // .then(function () {
      //   $.get("/api/stock_data").then(function (data) {
      //     $(".stock-data").text(data);
      //   })
      // });;
  }
});
