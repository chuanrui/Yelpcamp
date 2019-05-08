var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

var data = [
    {
        name: "Clouds Rest",
        image: "https://images.unsplash.com/photo-1556610626-9976884aae5b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        description: "blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah"
    },
    {
        name: "Clouds Rest",
        image: "https://images.unsplash.com/photo-1556524989-c8126dbb4a87?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        description: "blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah"
    },
    {
        name: "Clouds Rest",
        image: "https://images.unsplash.com/photo-1554185256-7b994c659b88?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        description: "blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah"
    }
]

function seedDB(){
    //remove all campgrounds
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("remove campgrounds!");
            //add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, data){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("success added");
                        //add a few comments
                        Comment.create(
                            {
                                text:"This is a great place!",
                                author:"chuanrui"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                }else{
                                    data.comments.push(comment);
                                    data.save(function(err, data){
                                        if(err){
                                            console.log(err);
                                        }else{
                                            //console.log(data);
                                        }
                                    });
                                }
                            }
                        );
                    }
                });
            });
        }
    });
}

module.exports = seedDB;
