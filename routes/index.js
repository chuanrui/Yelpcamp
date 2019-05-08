var express = require("express");
var router = express.Router({mergeParames: true});//to replace app
var User = require("../models/user");
var passport = require("passport");

router.get("/", function(req, res){
    res.render("landing");
});

//AUTH ROUTES
//show register form
router.get("/register", function(req, res){
    res.render("register");
});
//handle sign up logic
router.post("/register", function(req, res){
    User.register(new User({
        username: req.body.username//only parse username because we do not want to save password into database
    }), req.body.password, function(err, user){//hash the password then store it into database
        if(err){
            req.flash("error", err.message);
            console.log(err);
            return res.redirect("/register");//if err, just return
        }
        passport.authenticate("local")(req, res, function(){//run serializeUser() method here
            req.flash("success", "Welcome! "+user.username);
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN ROUTES
//show login form
router.get("/login", function(req, res){
    res.render("login");
});
//handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),function(req, res){
});
//LOGOUT ROUTES
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have logged out!");//"success" is defined in app.js
    res.redirect("/campgrounds");
});

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();//!!!!!next(), watch the bracket!!! dumbass!!!
//     }else{
//         res.redirect("/login");
//     }
// }

module.exports = router;