// var express = require('express');
// var router = express.Router();
// var acountController = require('../controller/account');
// // ROUTES 
// router.post("/postAccount",acountController.createAccount);
// router.post('/signin',acountController.signin);
// module.exports = router;
const express = require("express");
const router = express.Router();
//Imporing the authvalidation functions for login and register 
const {  regsiterValidation, loginValidation,validateData} = require("../middleware/validation")
//Importing functions from auth controller
const { signin,login ,createAccount, userProfile, users} = require("../controller/account")
//Importing the JWT verifyer from auth middleware 
//  const {authenticateUser} = require("../middleware/auth.middleware") 
const {authenticateUser} = require("../middleware/authentication") 

//Register route with register validation 
router.post("/register",loginValidation,createAccount);
//Login route with register validation
router.post("/signin",loginValidation, signin);
// Or
router.post("/login",loginValidation,login);
//Profile route with register validation
router.get("/profile/:id", authenticateUser, userProfile);
//all users route with 
router.get("/users", authenticateUser, users);
module.exports = router;
