const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/warpAsync.js");
const Listing = require("../models/listing.js");
const{isLoggedIn, isOwner, validateListing} = require("../middleware.js");

//index route 
router.get
("/", wrapAsync(async (req,res)=>{
  const allListings=  await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));



//new route
router.get
("/new", isLoggedIn,(req, res) => {
    let {title, description, price, country, location} = req.params;
   
    res.render("listings/new.ejs")
 });

//show route
router.get
("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing =  await  Listing.findById(id)
    .populate({path: "reviews", 
        populate: {
            path:"author",
    },
})
    .populate("owner");
    console.log(listing);
        if(!listing){
        req.flash("error", "listing you request does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

//create route
router.post
("/", isLoggedIn,validateListing,
    wrapAsync(async(req,res,next)=>{
    // let {title, description, image, price, country, location} = req.body; (another method abstracting data)    
        const newListing = new Listing(req.body.listing);      
        // console.log(newListing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success","New listing Created");
        res.redirect(`/listings`);
}));
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

//edit route
router.get
("/:id/edit", isLoggedIn,isOwner, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing =  await  Listing.findById(id);
    if(!listing){
        req.flash("error", "listing you request does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

//update route
router.put
("/:id", isLoggedIn, validateListing, isOwner,
     wrapAsync(async(req, res) =>{
    
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success"," listing updated");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete
("/:id", isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}= req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," listing deleted");
    res.redirect("/listings");
}));

module.exports = router;