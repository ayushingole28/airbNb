const User = require("../models/user.js");
const {saveRedirectUrl} = require("../middleware.js");
const passport = require("passport");
module.exports.getSignUp = (req, res) =>{
    res.render("user/signup.ejs");
}

module.exports.postSignUp = async(req, res) =>{
    try{
   let {username, email, password} = req.body;
   const newUser = new User({email, username});
   const registerdUser = await User.register(newUser, password);
   console.log(registerdUser);
   req.login(registerdUser, (err) =>{
    if(err) {
        return next(err); //doubt
       
    }
     req.flash("success", "welcome to wanderlust");
   res.redirect("/listings");
   });
   
    }
    catch(e)
    {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    }

module.exports.logoutController = (req, res) =>{
    req.logout((err) =>{
       if(err) {
        next(err);
       } 
       req.flash("success", "you are logged out");
       res.redirect("/listings");
    } )
};

module.exports.loginController = async(req, res) =>{
 //passport will check whether the user exist or not in db

req.flash("success", "welcome to wanderlust");
let redirectUrl = res.locals.redirectUrl || "/listings";
res.redirect(redirectUrl);
}

module.exports.loginRender = async(req, res) =>{
    res.render("user/login.ejs");
}


