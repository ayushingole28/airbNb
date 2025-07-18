const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
module.exports.postReview = async(req,res) => {
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        console.log("new review saved",newReview);
        listing.review.push(newReview);
        await newReview.save();
        await listing.save();
        res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async(req,res,next) => {
  console.log("RECEIVED REVIEW BODY:", req.body); //
  let {id, reviewId} = req.params;
  console.log(id);
  console.log(reviewId);
  await Listing.findByIdAndUpdate(id, {$pull : {review : reviewId}});
  let del = await Review.findByIdAndDelete(reviewId);
  console.log(del);
  res.redirect(`/listings/${id}`);
}