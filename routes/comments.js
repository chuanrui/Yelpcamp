var express = require("express");
var router = express.Router({mergeParames: true});//to replace app
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

//==============
//COMMENTS ROUTES

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    //lookup campground using ID
    //create new comment
    //connect new comment to campground
    //redirect to show page
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/compgrounds");
        }else{
            
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong :(");
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save comment
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});
//comment edit routes
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnerShip, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            res.redirect("back");
        }else{
            Comment.findById(req.params.comment_id, function(err, comment){
                if(err){
                    res.redirect("back");
                }else{
                    res.render("comments/edit",{campground:campground, comment:comment});
                }
            });
        }
    });
});
//comment update routes
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Successfully edited comment!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//comment destroy routes
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Successfully deleted comment!");
            //res.redirect("back"); they are same for now
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


// //middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();//!!!!!next(), watch the bracket!!! dumbass!!!
//     }else{
//         res.redirect("/login");
//     }
// }

// //authorization
// function checkCommentOwnerShip(req, res, next){
//     //is user logged in
//     if(req.isAuthenticated()){
//         //if so, does user own the campgorund
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//             if(err){
//                 res.redirect("back");
//             }else{
//                 if(foundComment.author.id.equals(req.user.username)){//cannot use === because id is an object not a string
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