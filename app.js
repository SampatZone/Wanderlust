const express= require("express");
const app=  express();
const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const Listing= require("../major project/models/listing.js");
const path = require ("path");
const methodOverride =require("method-override");
const ejsMate= require("ejs-mate");


main().then(()=>{
    console.log("connected")
}).catch((err)=>{
    console.log(err);
    
})


async function main(params) {
 await mongoose.connect(MONGO_URL);

}
app.get("/listing", async (req,res)=> {
    const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use (express.static(path.join(__dirname,"/public")));

// app.get("/testlisting",async (req,res)=>{
//     let sampleListing= new Listing({
//         title:"My villa",
//         description:"by the beach",
//         price:1500,
//         location:"goa",
//         country: "india", 


//     });
//     await sampleListing.save();
//     console.log("saved");
//     res.send("succesful");

// });
app.get("/listings/new", (req,res)=>
{
    res.render("listings/new.ejs");

});

app.get("/listings/:id", async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});

});
// new route



app.get("/", (req,res)=>{
    res.send("root");
});

 app.listen(8080,()=>{
    console.log("port 8080");

 });
 app.post("/listings", async (req ,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing")
 })
 app.get("/listing/:id/edit",async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
 });
 app.put("/listing/:id", async(req,res)=>
{
    let {id}= req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing})
     res.redirect(`/listing/${id}`);

});

app.delete("/listings/:id", async(req,res)=> {
    let {id}= req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");
});