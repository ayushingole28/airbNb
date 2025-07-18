const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");

const validateReview = (req, res, next) => {
  console.log("🚨 Full Review Body:", req.body); // 👈 log full body
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    console.log("❌ VALIDATION ERROR:", error.details);
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

router.post("/", isLoggedIn,validateReview,reviewController.postReview);

//Delete route for reviews 
  router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;