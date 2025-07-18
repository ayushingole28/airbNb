const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn} = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js"); 
const upload = multer({ storage })




// const validateListing = (req, res, next) => {
//   console.log("VALIDATION INPUT:", req.body);  // 👈 Add this
//   const { error } = listingSchema.validate(req.body);
//   if (error) {
//     console.log("VALIDATION ERROR:", error.details);  // 👈 Add this
//     throw new ExpressError(400, error.details[0].message);
//   } else {
//     next();
//   }
// };

// const validateListing = (req, res, next) => {
//   req.body.listing = req.body.listing || {};

//   // Attach image from multer
//   if (req.file) {
//     req.body.listing.image = {
//       url: req.file.path,
//       filename: req.file.filename,
//     };
//   }

//   console.log("VALIDATION INPUT:", req.body);

//   const { error } = listingSchema.validate(req.body);
//   if (error) {
//     console.log("VALIDATION ERROR:", error.details);
//     throw new ExpressError(400, error.details[0].message);
//   } else {
//     next();
//   }
// };
const validateListing = (req, res, next) => {
  req.body.listing = req.body.listing || {};

  // Only add image field if file is uploaded
  if (req.file) {
    req.body.listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  console.log("VALIDATION INPUT:", req.body);

  const { error } = listingSchema.validate(req.body, { allowUnknown: true });
  if (error) {
    console.log("VALIDATION ERROR:", error.details);
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};



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

router.route("/listings")
//show all listings as front page
.get(wrapAsync(listingController.index))
.post( isLoggedIn,
  upload.single('listing[image]'),
   validateListing,
    
wrapAsync(listingController.postListing));

// Get request to add new form
router.get("/listings/new",isLoggedIn,listingController.renderNewForm);

router.route("/listings/:id")
//Show details of list
.get(listingController.showListing)
//Patch request to edit the list
.patch( isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.patchEdit),)
//Delete request 
.delete(isLoggedIn,listingController.deleteListing);

//get request to render edit form
router.get("/listings/:id/edit",isLoggedIn,listingController.getEdit);



module.exports = router;