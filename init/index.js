const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
    .then(()=>{
    console.log("connected to DB");
}).catch((err) =>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    // initData.data = initData.data.map((obj)=>({...obj, owner:"672f7dbce973a2debf9f5f90"}));//679e0f5cc4cb9c48ac4521d2
    initData.data = initData.data.map((obj)=>({...obj, owner:"679e0f5cc4cb9c48ac4521d3"}));//679e0f5cc4cb9c48ac4521d2


    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();