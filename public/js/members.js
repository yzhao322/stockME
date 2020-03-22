$(document).ready(function () {
  var add = $("form.addup");
  var deleteit = $("form.delete");
  var addNotes = $("form.update-notes");
  var stockname = $("input#stock-input");
  var stocknotes = $("textarea#stock-notes");
  

 
  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.email);
    for (let i = 0; i < data.data.length; i++) {
      $(".search").append($("<button>").attr("class", "stock-data").attr("id", `${data.data[i].stockname}`).text(data.data[i].stockname));
      $(".search").append($("<p>").text("\nNotes: " + data.data[i].stocknotes));
    }
  });



    var searchButton = $("form.search");
    searchButton.on("click", ".stock-data", function (event) {
    event.preventDefault();
    var symbol = this.id;
    getStockData(symbol);
    showData(symbol);
    });

  add.on("submit", function (event) {
    event.preventDefault();
    var stockName = stockname.val().trim();
    var notes = stocknotes.val().trim();
    if (!stockName) {
      return;
    }
    addStock(stockName, notes);
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

  });

  addNotes.on("submit", function (event) {
    event.preventDefault();
    var notes = stocknotes.val().trim();
    var stockName = stockname.val().trim();
    if (!stockName || !notes) {
      return;
    }
    updateStockNotes(notes, stockName);
    stockname.val("");
    stocknotes.val("");
  });

  function getStockData(symbol) {
    $.get("/api/search_this_stock" + symbol)
      .then(function () {
        window.location.replace("/members");
      })
      .catch((Err) => {
        console.log(Err);
      });
    return symbol;
  }

  function showData(symbol) {
    $.get(`/api/search_this_stock/${symbol}`).then(function (data) {
      $(".info1").text("symbol:  " + data["Global Quote"]["01. symbol"]);
      $(".info2").text("open:  " + data["Global Quote"]["02. open"]);
      $(".info3").text("high:  " + data["Global Quote"]["03. high"]);
      $(".info4").text("low:  " + data["Global Quote"]["04. low"]);
      $(".info5").text("price:  " + data["Global Quote"]["05. price"]);
      $(".info6").text("volume:  " + data["Global Quote"]["06. volume"]);
      $(".info7").text("latest trading day:  " + data["Global Quote"]["07. latest trading day"]);
      $(".info8").text("previous close:  " + data["Global Quote"]["08. previous close"]);
      $(".info9").text("change:  " + data["Global Quote"]["09. change"]);
      $(".info10").text("change percent:  " + data["Global Quote"]["10. change percent"]);
    });
  }


  function addStock(Name, notes) {
    $.post("/api/stock_name", {
      stockname: Name,
      username: $(".member-name").text(),
      stocknotes: notes,
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

  function updateStockNotes(notes, stockName) {
    $.ajax({
      method: "PUT",
      url: "/api/stock_name",
      data: {stocknotes: notes, stockname: stockName }
    })
      .then(function () {
      window.location.replace("/members");
    })
    .catch((Err) => {
      console.log(Err);
    });
  }

});
