const Listing = require("./models/user.js");
const Review = require("./models/review");
const {listingSchema, reviewSchema}= require("./schema.js");
const expressError = require("./utils/expressError.js");

module.exports.isLoggedIn = (req,res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing");
       return res.redirect("/login");
    } 
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner= async (req,res,next) => {
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
     req.flash("error","you are not the owner of this listing");
    return  res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error } =   listingSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
      throw new expressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isreviewAuthor= async (req,res,next) => {
    let {id, reviewid}= req.params;
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)){
     req.flash("error","you are not the owner of this listing");
    return  res.redirect(`/listings/${id}`);
    }

    next();
}