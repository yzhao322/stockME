// import { parse } from "querystring";



$(document).ready(function() {

    let add = $("form.addup");
    let deleteit = $("form.delete");
    let addNotes = $("form.update-notes");
    let stockname = $("input#stock-input");
    let stocknotes = $("textarea#userNotes");
    let searchButton = $("form.stock-button");
    let clearAll = $("form.clear-all");
    let userNotes = [];
    let Purchase = 0;

    //styling page
    $(".manage-options").hide();
    $("li#manage-options").click(function(event) {
        event.preventDefault();
        $(".searching-stock").hide();
        $(".stock-notes").hide();
        $(".investments").hide();
        $('.manage-options').toggle("slide");
    });

    $(".searching-stock").hide();
    $("li#searching-stock").click(function(event) {
        event.preventDefault();
        $(".manage-options").hide();
        $(".stock-notes").hide();
        $(".investments").hide();
        $('.searching-stock').toggle("slide");
    });

    $(".investments").hide();
    $("li#investments").click(function(event) {
        event.preventDefault();
        $(".manage-options").hide();
        $(".searching-stock").hide();
        $(".stock-notes").hide();
        $('.investments').toggle("slide");
    });

    $(".stock-notes").hide();
    $("li#stock-notes").click(function(event) {
        event.preventDefault();
        $(".manage-options").hide();
        $(".searching-stock").hide();
        $(".investments").hide();
        $('.stock-notes').toggle("slide");
    });

    $.get("/api/user_data").then(function(data) {
        $(".member-name").text(data.email);
        console.log(data);
        for (let i = 0; i < data.data.length; i++) {
            $(".stock-button").append($("<button>").attr("class", "search-buttton").attr("id", `${data.data[i].stockname}`).text(data.data[i].stockname.toUpperCase()).css("border-radius", "6px"));
            $(".notes-stocknames").append($("<option>").text(data.data[i].stockname.toUpperCase()).css("border-radius", "6px"));
            $("form.search").append($("<p>").text(data.data[i].stockname.toUpperCase()));
            $("form.search").append($("<p>").text("Notes: " + data.data[i].stocknotes));
            $("form.search").append($("<br>"));
            userNotes.push({ 'symbol': data.data[i].stockname, 'notes': data.data[i].stocknotes })
        }
    }).then(function() {
        $("#profitOrLoss").on("click", function(event) {
            event.preventDefault();
            $(".inverstments-panel").css("display", "block");
            let username = $(".member-name").text();

            $.get("/api/purchased_stock/" + username).then(function(data) {

                $(".PurchasedStock").text("");
                $(".totalInvestment").text("");
                for (let i = 0; i < data.data.length; i++) {
                    $(".PurchasedStock").append($('<ul style="color:green">').text("Stock Name: " + data.data[i].purchaseStockName));
                    $(".PurchasedStock").append($("<ul>").text("Stock Purchased Shares: " + data.data[i].purchaseShares));
                    $(".PurchasedStock").append($("<ul>").text("Stock Purchased Value: $" + data.data[i].purchasePrice));
                    $(".PurchasedStock").append($("<ul>").text("Stock Purchased on: " + data.data[i].createdAt.slice(0, 10)));
                    $(".PurchasedStock").append($('<hr class="new">'));

                    Purchase += parseFloat(data.data[i].purchasePrice.toFixed(3)); //purchasePrice in database = buy price x buy shares;

                    let shares = parseInt(data.data[i].purchaseShares);
                    let PurchasedValue = parseFloat(data.data[i].purchasePrice);
                    let purchaseStockName = data.data[i].purchaseStockName;
                    let PurchaseDate = data.data[i].createdAt;
                    getCurrentStockPrice(purchaseStockName, shares, PurchasedValue, PurchaseDate, i);

                }

                $(".totalInvestment").append($("<p>").text("Total investment " + ": $ " + Purchase));
            })


        })
    })



    //Add stock name as button into stock search panel
    add.on("submit", function(event) {
        event.preventDefault();
        $(".welcome").css("display", "block");
        $(".stock-opration").css("display", "none");
        $(".inverstments-panel").css("display", "none");
        let stockName = stockname.val().trim();
        if (!stockName) {
            return;
        }
        addStock(stockName);
        stockname.val("");
    });

    //delet stock name from stock search panel
    deleteit.on("submit", function(event) {
        event.preventDefault();
        $(".welcome").css("display", "block");
        $(".stock-opration").css("display", "none");
        $(".inverstments-panel").css("display", "none");
        let stockName = stockname.val().trim();
        if (!stockName) {
            return;
        }
        deleteStock(stockName);
        stockname.val("");

    });

    //add user notes
    addNotes.on("submit", function(event) {
        event.preventDefault();
        $(".welcome").css("display", "block");
        $(".stock-opration").css("display", "none");
        $(".inverstments-panel").css("display", "none");
        let notes = stocknotes.val().trim();

        let stockName = $(".notes-stocknames :selected").text();
        alert(stockName);


        if (!stockName || !notes) {
            return;
        }
        updateStockNotes(notes, stockName);
        stockname.val("");
        stocknotes.val("");
    });

    //clear all stock on stock search panel
    clearAll.on("submit", function(event) {
        event.preventDefault();
        let username = $(".member-name").text();
        $(".welcome").css("display", "block");
        confirmClearAll(username);
    });

    function confirmClearAll(username) {
        if (confirm("Are you sure to delete all?")) {
            deleteALL(username);
        }
        return false;
    }

    //send stock to controller and get data back
    searchButton.on("click", ".search-buttton", function(event) {
        event.preventDefault();
        let symbol = this.id;
        let username = $(".member-name").text();
        $(".stock-info").css("display", "block");
        $(".stock-opration").css("display", "block");
        getStockData(symbol, username);
    });

})

function getStockData(symbol, username) {
    $.get(`/api/search_this_stock/${symbol}`).then(function(data) {
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

        $("form.submitPurchase").on("submit", function(event) {
            event.preventDefault();
            alert("success");
            $(".welcome").css("display", "block");
            let shares = parseFloat(purchaseInput.val());
            let price = shares * data["Global Quote"]["05. price"];
            let stockname = data["Global Quote"]["01. symbol"];
            addPurchasePrice(price, stockname, username, shares);
            purchaseInput.val("");
        });
    }).catch((Err) => {
        alert("Sorry! Support team is on the way! - (Error code: E-MEM-07)");
        console.log(Err);
    });
}


function getCurrentStockPrice(symbol, shares, purchasedValue, PurchaseDate) {
    $.get(`/api/search_this_stock/${symbol}`).then(function(data) {
        let currentPrice = parseFloat(data["Global Quote"]["05. price"]);
        let currentValues = shares * currentPrice;
        let spread = purchasedValue - currentValues;
        if (spread == 0) {
            $(".inverstments").append($("<p>").text("Your investments on " + symbol + " at " + PurchaseDate.slice(0, 10)));
            $(".inverstments").append($("<p>").attr("class", `spread`).text("$" + spread.toFixed(2)).css("color", "gray"));
        } else if (spread < 0) {
            $(".inverstments").append($("<p>").text("Your investments on " + symbol + " at " + PurchaseDate.slice(0, 10)));
            $(".inverstments").append($("<p>").attr("class", `spread`).text("$" + spread.toFixed(2)).css("color", "red"));
        } else {
            $(".inverstments").append($("<p>").text("Your investments on " + symbol + " at " + PurchaseDate.slice(0, 10)));
            $(".inverstments").append($("<p>").attr("class", `spread`).text("$" + spread.toFixed(2)).css("color", "green"));
        };
    }).catch((Err) => {
        alert("Sorry! Support team is on the way! - (Error code: E-MEM-06)");
        console.log(Err);
    })
}



function addStock(Name) {
    $.post("/api/stock_name", {
            stockname: Name,
            username: $(".member-name").text(),
        })
        .then(function() {
            alert(Name + " is added successfully");
            window.location.replace("/members");

        })
        .catch((Err) => {
            alert("Sorry! Support team is on the way! - (Error code: E-MEM-05)");
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
        .then(function() {
            alert("Stored purchases!");
            window.location.replace("/members");
        })
        .catch((Err) => {
            alert("Sorry! Support team is on the way! - (Error code: E-MEM-04");
            console.log(Err);
        });
}

function deleteStock(Name) {
    $.ajax({
            method: "DELETE",
            url: "/api/user_data/" + Name
        })
        .then(function() {
            alert(Name + " deleted successfully");
            window.location.replace("/members");
        })
        .catch((Err) => {
            alert("Sorry! Support team is on the way! - (Error code: E-MEM-03");
            console.log(Err);
        })
}

function deleteALL(username) {
    $.ajax({
            method: "DELETE",
            url: "/api/user_data/all/" + username
        })
        .then(function() {
            alert("All stocks deleted successfully");
            window.location.replace("/members");
        })
        .catch((Err) => {
            alert("Sorry! Support team is on the way! - (Error code: E-MEM-02");
            console.log(Err);
        })
}

function updateStockNotes(notes, stockName) {
    $.ajax({
            method: "PUT",
            url: "/api/stock_name",
            data: { stocknotes: notes, stockname: stockName }
        })
        .then(function() {
            window.location.replace("/members");
        })
        .catch((Err) => {
            alert("Sorry! Support team is on the way! - (Error code: E-MEM-01");
            console.log(Err);
        });
};