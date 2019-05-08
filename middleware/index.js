var middlewareObj = {},
    Campground = require("../models/campground"),
    Comment = require("../models/comment");
    
    
    
middlewareObj.checkCampgroundOwnerShip = function checkCampgroundOwnerShip(req, res, next){
    //is user logged in
    if(req.isAuthenticated()){
        //if so, does user own the campgorund
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user.id)){//cannot use === because id is an object not a string
                    next();
                }else{
                    req.flash("error", "You do not have permission");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "Please Login First");
        res.redirect("/login");//back to previous page
    }
}

middlewareObj.checkCommentOwnerShip = function checkCommentOwnerShip(req, res, next){
    //is user logged in
    if(req.isAuthenticated()){
        //if so, does user own the campgorund
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Comment not found");
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user.id)){//cannot use === because id is an object not a string
                    next();
                }else{
                    req.flash("error", "You do not have permission");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "Please Login First");
        res.redirect("/login");//back to previous page
    }
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();//!!!!!next(), watch the bracket!!! dumbass!!!
    }else{
        req.flash("error", "Please Login First");//it must be put before redirection, "error" is defined in app.js
        res.redirect("/login");
    }
}


module.exports = middlewareObj;