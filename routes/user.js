const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controller/user.js");

router.route("/signUp")
.get( userController.getSignUp)
.post( wrapAsync(userController.postSignUp));

router.route("/login")
.get( userController.loginRender)
.post( saveRedirectUrl,
    passport.authenticate("local", 
    {failureRedirect : "/login", 
    failureFlash : true}),
    userController.loginController
    );



router.get("/logout", userController.logoutController)

module.exports = router;
