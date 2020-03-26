$(document).ready(function () {
  let add = $("form.addup");
  let deleteit = $("form.delete");
  let addNotes = $("form.update-notes");
  let stockname = $("input#stock-input");
  let stocknotes = $("textarea#stock-notes");
  let searchButton = $("form.search");
  let clearAll = $("form.clear-all");
  let purchasedsymbol = ""

  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.email);
    for (let i = 0; i < data.data.length; i++) {
      $(".search").append($("<button>").attr("class", "stock-data").attr("id", `${data.data[i].stockname}`).text(data.data[i].stockname));
      $(".search").append($("<p>").text("\nNotes: " + data.data[i].stocknotes));
    }
  }).then(function () {
    let username = $(".member-name").text();
    $.get("/api/purchased_stock/" + username).then(function (data) {
      for (let i = 0; i < data.data.length; i++) {
        $(".PurchasedStock").append($("<ul>").text("Stock Name: " + data.data[i].purchaseStockName));
        $(".PurchasedStock").append($("<ul>").text("Stock Purchased Shares: " + data.data[i].purchaseShares));
        $(".PurchasedStock").append($("<ul>").text("Stock Purchased Price: $" + data.data[i].purchasePrice));
        $(".PurchasedStock").append($("<ul>").text("Stock Purchased on: " + data.data[i].createdAt.slice(0, 10)));
        let symbol = data.data[i].purchaseStockName;
        let purchasedPrice = data.data[i].purchasePrice;
        getStockData(symbol);
        showData(symbol, username);
      }
    })
   
    console.log(data);
    for (let i = 0; i < data.data.length; i++) {
      $(".PurchasedStock").append($("<button>").attr("class", "stock-data").attr("id", `${data.data[i].stockname}`).text(data.data[i].stockname));
      $(".PurchasedStock").append($("<p>").text("\nNotes: " + data.data[i].stocknotes));
    }
  });

  //Add stock name as button into stock search panel
  add.on("submit", function (event) {
    event.preventDefault();
    let stockName = stockname.val().trim();
    let notes = stocknotes.val().trim();
    if (!stockName) {
      return;
    }
    addStock(stockName, notes);
    stockname.val("");
  });

  //delet stock name from stock search panel
  deleteit.on("submit", function (event) {
    event.preventDefault();
    let stockName = stockname.val().trim();
    if (!stockName) {
      return;
    }
    deleteStock(stockName);
    stockname.val("");

  });

  //add user notes
  addNotes.on("submit", function (event) {
    event.preventDefault();
    let notes = stocknotes.val().trim();
    let stockName = stockname.val().trim();
    if (!stockName || !notes) {
      return;
    }
    updateStockNotes(notes, stockName);
    stockname.val("");
    stocknotes.val("");
  });

 //clear all stock on stock search panel
  clearAll.on("submit", function (event) {
    event.preventDefault();
    deleteALL();
  })
  
  //send stock to controller and get data back
  searchButton.on("click", ".stock-data", function (event) {
    event.preventDefault();
    let symbol = this.id;
    getStockData(symbol);
    let username = $(".member-name").text();
    showData(symbol, username);
    
  });


  function getStockData(symbol) {
    $.get("/api/search_this_stock" + symbol)
      .then(function () {
        window.location.replace("/members");
      })
      .catch((Err) => {
        console.log(Err);
      });
  }

  function showData(symbol, username) {
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
      let purchaseInput = $("<input>");
      let purchaseInputSubmit = $("<button>").text("submit");
      $(".purchase").text("Enter shares you want to purchase at this price: ");
      $(".purchase").append(purchaseInput);
      $(".purchase").append(purchaseInputSubmit);
      $("form.submitPurchase").on("submit", function (event) {
        event.preventDefault();
        let shares = parseFloat(purchaseInput.val());
        let price = shares * data["Global Quote"]["05. price"];
        let stockname = data["Global Quote"]["01. symbol"];
        addPurchasePrice(price, stockname, username, shares);
        purchaseInput.val("");
      })
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

  function addPurchasePrice(price, stockname, username, shares) {
    $.post("/api/stock/purchase_price", {
      purchasePrice: price,
      stockname: stockname,
      username: username,
      shares: shares
    })
      .then(function () {
        window.location.replace("/members");
      })
      .catch((Err) => {
        console.log(Err);
      });
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

  function deleteALL() {
    $.ajax({
      method: "DELETE",
      url: "/api/user_data"
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
      data: { stocknotes: notes, stockname: stockName }
    })
      .then(function () {
        window.location.replace("/members");
      })
      .catch((Err) => {
        console.log(Err);
      });
  }


});
