var express = require("express");
var router = express.Router({mergeParames: true});//to replace app, and merge address if it has address in app.js
var Campground = require("../models/campground");
var middleware = require("../middleware/index");

//INDEX ROUTES
router.get("/campgrounds", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allcamp){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allcamp});//{currentUser: req.user}
        }
    });
    //res.render("campgrounds", {campgrounds: campgrounds});
});
//CREATE ROUTE
router.post("/campgrounds", middleware.isLoggedIn,function(req, res){
    //res.send("you hit the post route");
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name:name, price:price, image:image, description: desc, author: author};
    // newCampground.author.id = req.user._id;          //cannot do this!!!!! must define author then create newCampground
    // newCampground.author.username = req.req.username;
    //create a new campground and save to DB
    Campground.create(newCampground,function(err, camp){
        if(err){
            console.log(err);
        } else{
            console.log(camp);
            res.redirect("/campgrounds");//it is actually a get request
        }
    });
    //campgrounds.push(newCampground);
    //res.redirect("/campgrounds");//it is actually a get request
    //get data from form and add to campground array
    //back to campgrounds page
});//it is a convention that has same name
//NEW ROUTE
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});//still convention

//SHOW ROUTE
router.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    //render show template with that campground
    //Campground.findById(req.params.id, function(err, foundCampground){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});

//EDIT ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnerShip,function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/edit", {campground:foundCampground});
        }
    });
});

//UPDATE ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnerShip, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnerShip, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, deletedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});
// //authentication
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();//!!!!!next(), watch the bracket!!! dumbass!!!
//     }else{
//         res.redirect("/login");
//     }
// }
// //authorization
// function checkCampgroundOwnerShip(req, res, next){
//     //is user logged in
//     if(req.isAuthenticated()){
//         //if so, does user own the campgorund
//         Campground.findById(req.params.id, function(err, foundCampground){
//             if(err){
//                 res.redirect("back");
//             }else{
//                 if(foundCampground.author.id.equals(req.user.username)){//cannot use === because id is an object not a string
//                     next();
//                 }else{
//                     res.redirect("back");
//                 }
//             }
//         });
//     }else{
//         res.redirect("/login");//back to previous page
//     }
// }

module.exports = router;