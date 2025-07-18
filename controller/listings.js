const Listing = require("../models/listing");
module.exports.index = async (req,res) =>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res) => {
  
  res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res) => {
  let {id} = req.params;
  const reqList = await Listing.findById(id)
  .populate({
    path : "review",
    populate:{
      path : "author",
    },
  })
  .populate("owner");
  if(!reqList){
  req.flash("error","Listing you requested for does not exist");
    res.redirect("/listings");
  }
  else{
    res.render("listings/show.ejs",{reqList});
  }
  console.log(reqList.owner); 
}

module.exports.postListing =  async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url,"..",filename);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename};
  await newListing.save();
  req.flash("success", "New Listing Created!");
  
   res.redirect("/listings");
};

module.exports.getEdit = async (req,res) =>{
  const {id} = req.params;
  const listToEdit = await Listing.findById(id);
  res.render("listings/edit.ejs",{list:listToEdit}); 
}

module.exports.patchEdit = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id))
  {
    req.flash("error","you don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }
  // req.body contains all updated values
 let list = await Listing.findByIdAndUpdate(id, req.body.listing, {
    new: true,            // returns updated document (optional)
    runValidators: true   // runs schema validators
  });
  if(typeof req.file !== "undefined")
  {
  let url = req.file.path;
  let filename = req.file.filename;
  list.image = {url, filename};
  await list.save();
  }
    
   req.flash("success","Listing edited");
  res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing deleted");
  res.redirect("/listings");
}


