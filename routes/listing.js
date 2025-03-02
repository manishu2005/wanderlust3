const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/warpAsync.js");
const Listing = require("../models/listing.js");
const{isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer  = require('multer');
const {stroage} = require("../cloudConfigr.js");
const upload = multer({ stroage });


const listingController= require("../controllers/listing.js");

router
.route("/")
.get
(wrapAsync(listingController.index))
.post
(isLoggedIn,upload.single('listing[image]'),validateListing,
    wrapAsync(listingController.createListing));

//new route
router.get
("/new", isLoggedIn, listingController.renderNewForm);

router
.route("/:id")
.get
(wrapAsync(listingController.showListing))
.put
( isLoggedIn, validateListing, isOwner,
    wrapAsync(listingController.updateListing))
.delete
( isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));



//edit route
router.get
("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;


// //index route 
// router.get
// ("/", wrapAsync(listingController.index));
//create route
// router.post
// ("/", isLoggedIn,validateListing,
//     wrapAsync(listingController.createListing));
//create route
// router.post
// ("/", validateListing,
//     wrapAsync(async(req,res,next)=>{
//     // let {title, description, image, price, country, location} = req.body; (another method abstracting data)    
//         const newListing = new Listing(req.body.listing);      
//         // console.log(newListing);
//         await newListing.save();
//         res.redirect(`/listings`);
// }));

// //show route
// router.get
// ("/:id", wrapAsync(listingController.showListing));
//update route
// router.put
// ("/:id", isLoggedIn, validateListing, isOwner,
//      wrapAsync(listingController.updateListing));

// //delete route
// router.delete
// ("/:id", isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));