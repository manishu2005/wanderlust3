const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/warpAsync.js");
const expressError = require("../utils/expressError.js");
const reviews = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isreviewAuthor} = require("../middleware.js");

// Post Reviews Route
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res) => {
        // console.log(req.params.id);
        let listing = await Listing.findById(req.params.id);
        let newReview = new reviews(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);
            // console.log(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success","New review Created");
        res.redirect(`/listings/${listing._id}`);
    })
);

//Delete review route
router.delete("/:reviewId", 
    isLoggedIn, isreviewAuthor,
    wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params;

     await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await reviews.findByIdAndDelete(reviewId);

    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router; 