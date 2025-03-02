if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const ejsLint = require('ejs-lint');


const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter =  require("./routes/user.js");


main()
    .then(()=>{
    console.log("connected to DB");
}).catch((err) =>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
// app.engine('ejs', ejsLint);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretcode", 
    resave:false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
    };

app.get("/", (req, res)=>{
    res.send("hi i am root server");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use((req,res, next)=>{
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     console.log(res.locals.success);
//     let currUser = req.user;
//     res.locals.currUser = req.user;
//     console.log(currUser);
//     next();
// });

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user || null; // Ensure currUser is always defined
    console.log("Current User:", res.locals.currUser);
    next();
});
app.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    res.redirect("/listings"); // Change this based on your setup
});


// app.get("/demoUser", async (req,res)=>{
// let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student"
// });
//  let registeredUser = await User.register(fakeUser, "helloworld");
// res.send(registeredUser);
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// function error{
//     if(title, description, price, country, location === ""){
//         res.send("can not submit form b")
//     };
// };

app.all("*", (req,res,next)=> {
    next(new expressError(404,"page not found"));
});
app.use((err, req, res, next)=>{
    let{statusCode = 500, message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});
app.listen(4040,()=>{
    console.log("server running");
});
