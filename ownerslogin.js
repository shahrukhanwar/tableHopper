var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.render("ownerslogin", {
    title: "Login",
    assets: "ownerslogin",
    logolink: "/ownerslogin",
    navlink: "Login as Restaurant Owner",
    option1: "Login as Customer",
    navadd1: "/"
  });
});

router.post("/signup", (req, res) => {
  var db = req.app.locals.db;
  db.collection("ownersLoginData").insert(req.body);
  res.redirect("/ownerslogin");
});

router.post("/login", (req, res) => {
  var db = req.app.locals.db;
  db.collection("ownersLoginData")
    .find()
    .toArray((err, result) => {
      if (err) throw err;
      for (var i = 0; i < result.length; i++) {
        if (
          req.body.username == result[i].username &&
          req.body.password == result[i].password
        ) {
          req.session.ownerloggedin = true;
          req.app.locals.ownerloggedin = req.session.ownerloggedin;
          req.session.ownerusername = result[i].username;
          req.app.locals.ownerusername = req.session.ownerusername;
        }
      }
      res.redirect("/ownerhome");
    });
});

router.post("/forgot", (req, res) => {
  var db = req.app.locals.db;
  db.collection("ownersLoginData")
    .find()
    .toArray((err, result) => {
      if (err) throw err;
      for (var i = 0; i < result.length; i++) {
        if (
          req.body.username == result[i].username &&
          req.body.securityQues == result[i].securityQues
        ) {
          db.collection("ownersLoginData").updateOne(
            { username: result[i].username },
            {
              $set: { password: req.body.password }
            }
          );
        }
      }
      res.redirect("/ownerslogin");
    });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  req.app.locals.ownerloggedin = false;
  req.app.locals.ownerusername = "";
  res.redirect("/ownerslogin");
});

module.exports = router;
