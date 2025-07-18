const mongoose = require("mongoose");
const Review =  require("./review.js")
const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        
    },
    description:{
        type:String,
        
    },
    image:{
    url:String,
        filename:String,
    },
    price:{
        type:Number,
        required: true
    },
    location:{
        type:String,
       
    },
    country:{
        type:String,
    
    },
    review:
        [
            {
              type:mongoose.Schema.Types.ObjectId,
              ref:"Review"
            }
        ],
        owner :{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing)
    {
     await Review.deleteMany({_id : {$in : listing.review}});
    }
 
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title: String,
//     description: String,
//     price: Number,
//     image: String,
//     location: String,
//     country: String,
//     owner: {
//         type: Schema.Types.ObjectId,
//         ref: "User"  // ✅ THIS is critical!
//     },
//     review: [
//         {
//             type: Schema.Types.ObjectId,
//             ref: "Review"
//         }
//     ]
// });

// module.exports = mongoose.model("Listing", listingSchema);
