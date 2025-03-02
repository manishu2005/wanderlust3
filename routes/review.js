const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/warpAsync.js");
const expressError = require("../utils/expressError.js");
const reviews = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isreviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");
const review = require("../models/review.js");
// Post Reviews Route
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

//Delete review route
router.delete("/:reviewId", 
    isLoggedIn, isreviewAuthor,
    wrapAsync(reviewController.destroyReview));

module.exports = router; 