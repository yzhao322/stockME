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
    searchButton.on("click",".stock-data", function () {
      var symbol = this.id;
      getStockData(symbol);
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
      .then(function (data) {
        let stockInfo = $("<p>").text('data');
        $(".info").append(stockInfo);
        window.location.replace("/members");
      })
      .catch((Err) => {
        console.log(Err);
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
