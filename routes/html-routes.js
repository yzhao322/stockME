// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
var db = require("../models");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      if (req.body.title === "Member") {
        res.redirect("/members");
      }
      else if (req.body.title === "Manager") {
        res.redirect("/managers");
      }
      else if (req.body.title === "Master") {
        res.redirect("/master");
      }
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      if (req.body.title === "Member") {
        res.redirect("/members");
      }
      else if (req.body.title === "Manager") {
        res.redirect("/managers");
      }
      else if (req.body.title === "Master") {
        res.redirect("/master");
      }
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

  app.get("/managers", isAuthenticated, function (req, res) {
    db.User.findAll({
      where: {
        title: "Member"
      }
    })
      .then(function (data) {
        let userList = [];
        for (let i = 0; i < data.length; i++){
            userList.push(data[i].dataValues.email)
        }
        res.render("index", { userlist: userList });
      }).catch(function (error) {
        console.error(error);
      })
  });
  app.get("/master", isAuthenticated, function (req, res) {
    db.User.findAll({
      where: {
        title: ["Member", "Manager"]
      }
    })
      .then(function (data) {
        let usermember = [];
        let usermanager = [];
        for (let i = 0; i < data.length; i++){
          if (data[i].dataValues.title === "Member") {
            usermember.push(data[i].dataValues);
          }
          else {
            usermanager.push(data[i].dataValues);
          }
        }
      
        res.render("master", { usermember: usermember, usermanager:usermanager });
      }).catch(function (error) {
        console.error(error);
      })
  });

};
