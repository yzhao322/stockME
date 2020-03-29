// import { parse } from "querystring";



$(document).ready(function () {

  let add = $("form.addup");
  let deleteit = $("form.delete");
  let addNotes = $("form.update-notes");
  let stockname = $("input#stock-input");
  let stocknotes = $("textarea#userNotes");
  let searchButton = $("form.search");
  let clearAll = $("form.clear-all");
  let userNotes = [];
  let Purchase = 0;
  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.email);
    for (let i = 0; i < data.data.length; i++) {
      $(".search").append($("<button>").attr("class", "stock-data").attr("id", `${data.data[i].stockname}`).text(data.data[i].stockname));
      $(".search").append($("<br>"));
      userNotes.push({ 'symbol': data.data[i].stockname, 'notes': data.data[i].stocknotes })
    }

  }).then(function () {
    $("#profitOrLoss").on("click", function (event) {
      event.preventDefault();
      $(".stock-info").css("display", "none");
      $(".stock-opration").css("display","none");
      $(".inverstments-panel").css("display", "block");
      let username = $(".member-name").text();
      
      $.get("/api/purchased_stock/" + username).then(function (data) {
        
        $(".PurchasedStock").text("");
        $(".totalInvestment").text("");
        for (let i = 0; i < data.data.length; i++) {
          $(".PurchasedStock").append($('<ul style="color:green">').text("Stock Name: " + data.data[i].purchaseStockName));
          $(".PurchasedStock").append($("<ul>").text("Stock Purchased Shares: " + data.data[i].purchaseShares));
          $(".PurchasedStock").append($("<ul>").text("Stock Purchased Value: $" + data.data[i].purchasePrice));
          $(".PurchasedStock").append($("<ul>").text("Stock Purchased on: " + data.data[i].createdAt.slice(0, 10)));
          $(".PurchasedStock").append($('<hr class="new">'));

          Purchase +=  parseInt(data.data[i].purchaseShares * data.data[i].purchasePrice);
 
          let shares = parseInt(data.data[i].purchaseShares);
          let PurchasedValue = parseFloat(data.data[i].purchasePrice);
          let purchaseStockName = data.data[i].purchaseStockName;
          let PurchaseDate = data.data[i].createdAt;
          let spreadArray = [];
          getCurrentStockPrice(purchaseStockName, shares, PurchasedValue, PurchaseDate, i);
          
        }

        $(".totalInvestment").append($("<p>").text("Total investment " + ": $ " + Purchase));
      })

  
    })
  })



  //Add stock name as button into stock search panel
  add.on("submit", function (event) {
    event.preventDefault();
    $(".welcome").css("display","block");
    $(".stock-info").css("display", "none");
    $(".stock-opration").css("display","none");
    $(".inverstments-panel").css("display", "none");
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
    $(".welcome").css("display","block");
    $(".stock-info").css("display", "none");
    $(".stock-opration").css("display","none");
    $(".inverstments-panel").css("display", "none");
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
    $(".welcome").css("display","block");
    $(".stock-info").css("display", "none");
    $(".stock-opration").css("display","none");
    $(".inverstments-panel").css("display", "none");
    let notes = stocknotes.val().trim();

    let stockName = $(".info1").text().slice(9);
 

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
    $(".welcome").css("display","block");
    $(".stock-info").css("display", "none");
    $(".stock-opration").css("display","none");
    $(".inverstments-panel").css("display", "none");
    deleteALL();
  });

  //send stock to controller and get data back
  searchButton.on("click", ".stock-data", function (event) {
    event.preventDefault();

    let symbol = this.id;
    let username = $(".member-name").text();
    $(".welcome").css("display","none");
    $(".stock-info").css("display", "block");
    $(".stock-opration").css("display","block");
    $(".inverstments-panel").css("display", "none");
    getStockData(symbol, username, userNotes);
  });

})

function getStockData(symbol, username, userNotes) {
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
    let purchaseInputSubmit = $('<button class="mybtn">').text("submit");
    $(".purchase").text("Enter shares you want to purchase at this price: ");
    $(".purchase").append(purchaseInput);
    $(".purchase").append(purchaseInputSubmit);

    $("form.submitPurchase").on("submit", function (event) {
      event.preventDefault();
      $(".welcome").css("display","block");
      $(".stock-info").css("display", "none");
      $(".stock-opration").css("display","none");
      $(".inverstments-panel").css("display", "none");

      let shares = parseFloat(purchaseInput.val());
      let price = shares * data["Global Quote"]["05. price"];
      let stockname = data["Global Quote"]["01. symbol"];
      addPurchasePrice(price, stockname, username, shares);
      purchaseInput.val("");
    });
  

    for (let i = 0; i < userNotes.length; i++) {
      if (userNotes[i].symbol === data["Global Quote"]["01. symbol"]) {
        $("#userNotes").text(userNotes[i].notes);
      };
    };

  }).catch((Err) => {
    console.log(Err);
  });
}


function getCurrentStockPrice(symbol, shares, purchasedValue,PurchaseDate) {
  $.get(`/api/search_this_stock/${symbol}`).then(function (data) {
    let currentPrice = parseFloat(data["Global Quote"]["05. price"]);
    let currentValues = shares * currentPrice;
    let spread = purchasedValue - currentValues;
    if (spread == 0) {
      $(".inverstments").append($("<p>").text("Your investments on " + symbol + " at " + PurchaseDate.slice(0,10)));
      $(".inverstments").append($("<p>").attr("class", `spread`).text("$" + spread.toFixed(2)).css("color", "gray"));
    }
    else if (spread < 0) {
      $(".inverstments").append($("<p>").text("Your investments on " + symbol + " at " + PurchaseDate.slice(0,10)));
      $(".inverstments").append($("<p>").attr("class", `spread`).text("$" + spread.toFixed(2)).css("color", "red"));
    } 
    else {
      $(".inverstments").append($("<p>").text("Your investments on " + symbol + " at " + PurchaseDate.slice(0,10)));
      $(".inverstments").append($("<p>").attr("class", `spread`).text("$" + spread.toFixed(2)).css("color", "green"));
    }; 
  })
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
};



