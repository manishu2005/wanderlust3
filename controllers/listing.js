const Listing = require("../models/listing");
module.exports.index= async (req,res)=>{
    const allListings=  await Listing.find({});
      res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req, res) => {
    let {title, description, price, country, location} = req.params;
   
    res.render("listings/new.ejs")
 };

 module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing =  await  Listing.findById(id).populate("owner")
    .populate({path: "reviews", 
        populate: {
            path:"author",
    },
})
    // .populate("owner");
    console.log(listing);
        if(!listing){
        req.flash("error", "listing you request does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async(req,res,next)=>{
    // let {title, description, image, price, country, location} = req.body; (another method abstracting data)
    let{id}= req.params;  
    const url = req.file.path;
    const fileName = req.file.fileName;  
        const newListing = new Listing(req.body.listing);      
        // console.log(newListing);
        newListing.owner = req.user.id;
        if (req.user) {
            console.log(req.user._id);  
            newListing.owner = req.user; 
            req.flash("success","New listing Created");
        next(); 
        } else {
            req.flash("error", "You must be logged in to create a listing.");
            return res.redirect("/login");  // Redirect if user is not logged in
        }
        newListing.image = {url, fileName};
        await newListing.save();
        
        res.redirect(`/listings`);
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing =  await  Listing.findById(id);
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "listing you request does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing =async(req, res) =>{
    
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success"," listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing =  async (req,res)=>{
    let {id}= req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," listing deleted");
    res.redirect("/listings");
}