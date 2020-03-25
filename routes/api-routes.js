// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
var axios = require('axios');
var apiKey = "4MH53GP5D4RCM8NJ";
var apikey2 = "E763I45M680QQVZB";

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  app.post("/api/stock_name", function (req, res) {
    db.Stock.create({
      stockname: req.body.stockname,
      username: req.body.username,
      stocknotes: req.body.stocknotes
    }).then(function () {
      res.redirect("/members");
    }).catch(function (err) {
      console.log(err);
    });
  });

  app.get("/api/search_this_stock/:symbol", function (req, res) {
    var stockUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${req.params.symbol}&apikey=${apiKey}`;
    axios.get(stockUrl)
      .then(function (response) {
        res.json(response.data);
      })
      .catch((Err) => {
        console.log(Err);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      db.Stock.findAll({
        where: {
          username: req.user.email
        }
      }).then(function (stockdata) {
        res.json({
          email: req.user.email,
          id: req.user.id,
          data: stockdata
        });
      });
    }
  });

  app.get("/api/user/:username", function (req, res) {
    db.User.findAll({
      where: {
        email: req.params.username
      }
    })
      .then(function (data) {
        let userdetails = data[0].dataValues;
        res.json(userdetails);
      }).catch(function (error) {
        console.error(error);
      });
  });

  app.delete("/api/user_data/:stockname", function (req, res) {
    db.Stock.destroy({
      where: {
        stockname: req.params.stockname,
      }
    }).then(function (data) {
      res.json(data);
    }).catch(function (err) {
      console.log(err);
    });
  });

  app.delete("/api/user_data", function (req, res) {
    db.Stock.destroy({
      where: {}
    })
      .then(function (data) {
        res.json(data);
      }).catch(function (err) {
        console.log(err);
      });
  });


  app.delete("/api/user/:username", function (req, res) {
    db.User.destroy({
      where: {
        email: req.params.username,
      }
    }).then(function (data) {
      res.json(data);
    }).catch(function (err) {
      console.log(err);
    });
  });

  app.put("/api/stock_name", function (req, res) {
    db.Stock.update({
      stocknotes: req.body.stocknotes
    }, {
        where: {
          stockname: req.body.stockname
        }
      }).then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        // Whenever a validation or flag fails, an error is thrown
        // We can "catch" the error to prevent it from being "thrown", which could crash our node app
        res.json(err);
      });
  });

  app.put("/api/user/notes/:username", function (req, res) {
    db.User.update({
      notes: req.body.notes
    }, {
        where: {
          email: req.params.username
        }
      }).then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.put("/api/user/title/:username", function (req, res) {
    db.User.update({
      title: req.body.title
    }, {
        where: {
          email: req.params.username
        }
      }).then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  });



};
