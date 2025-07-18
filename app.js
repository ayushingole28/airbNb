if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}

console.log(process.env.SECRET);

// Add this as the first line in your app.js
process.removeAllListeners('warning');
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);
const wrapAsync = require("./utils/wrapAsync.js");
const Err = require("./utils/ExpressError.js");
const ExpressError = require("./utils/ExpressError.js");
const port = 8000;
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended : true}));
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const DbUrl = process.env.ATLASDB_URL;
// main()
// .then((res) =>{
// console.log("connection succesful");
// })
// .catch(err => console.log(err));

// async function main() {
//   await mongoose.connect(DbUrl);
//  // 'mongodb://127.0.0.1:27017/wander'
// }

require('dotenv').config();
console.log("🔧 Connecting to:", process.env.ATLASDB_URL);


mongoose.connect(process.env.ATLASDB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB Atlas");
}).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err);
});


// const sessionOptions = {
//   secret: "mysupersecretcode",
//   resave:false,
//   saveUninitialized:true,

//   cookie:{
//     expires : Date.now() + 7*24*60*60*1000,
//     maxAge:7*24*60*60*1000,
//     httpOnly : true,
//   },
// };
const MongoStore = require("connect-mongo");

const sessionOptions = {
  store: MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    touchAfter: 24 * 3600 // time in seconds
  }),
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //to store user related information in session means serialize 
passport.deserializeUser(User.deserializeUser()); //just opposite of deserialize

app.use((req, res, next) =>{
 res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // Good practice to add error too
  next();
}); //pbkdf2 hashing algorithm

app.get("/demouser", async(req, res) =>{
  let fakeuser = new User({
    email:"student@gmail.com",
    username:"delta-student",
  });
  let registerUser = await User.register(fakeuser, "helloworld"); //register method automatically will save fakeuser in db,also it will check wether username is unique.
  res.send(registerUser);
});

app.use("/",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/", userRouter);

//Middleware
app.use((err,req,res,next) =>{
  let {statusCode = 500,message} = err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message); err.stack,err.trace
});

app.listen(port,()=>{
  console.log("Hi i am listening to port no.",port);
});