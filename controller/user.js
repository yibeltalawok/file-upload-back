var EventEmitter = require('events').EventEmitter;
const db = require("../models");
const User = db.user;
var fileDal = require('../dal/user');
 //User Register
 const jwt = require('jsonwebtoken')
//Importing the bcrypt package
 const bcrypt = require('bcryptjs')
exports.createUser = (req, res,next)=> {
 // exports.createAccount = (req, res, next) => {
 const { firstName, middleName,lastName,sex,email} = req.body;
//  console.log(req)
  //Verifying the email address inputed is not used already 
 const verifyEmail =  User.findOne({where: { email: email }  })
  // console.log(verifyEmail)
  try {
      if (!verifyEmail) {
          return res.status(403).json({
              message: "Email already used"
          })
      } else {
          //generating userId
          //using bcrypt to hash the password sent from the user
          bcrypt.hash(req.body.password, 10)
              .then((hash) => {
                  //Registering the user
                  const user = new User({
                      firstName: firstName,
                      middleName,middleName,
                      lastName:lastName,
                      sex:sex,
                      email: email,
                      password: hash,
                  });
                  // console.log("data===",user)
                  user.save()
                      .then((response) => {
                          return res.status(200).json({
                              message: 'user successfully created!',
                              result: response,
                              success: true
                          })})
                      .catch((error) => {
                          res.status(500).json({
                              error: error,
                          })})})}
         } catch (error) {
           return res.status(412).send({
           success: false,
           message: error.message
         })}}
     exports.update = (req, res, next) => {
     let id = req.params.id;
    //  console.log("aa=",id)
     const { firstName, middleName,lastName,sex,email,password} = req.body;
     let userData={ 
           firstName: firstName,
           middleName,middleName,
           lastName:lastName,
            sex:sex,
            email: email,
           password: password,
                 }
     User.update(userData, {
     where: { id: id }
     })
     .then(num => {
       if (num == 1) {
         res.send({
           message: "like was updated successfully."
         });} 
       else {
         res.send({
           message: `Cannot update like with id=${id}. Maybe Blog was not found or req.body is empty!`
         });}})
     .catch(err => {
       res.status(500).send({
         message: "Error updating like with id=" + id
       }); });};
       exports.findAll=(req,res)=>{
        let workflow = new EventEmitter();
        workflow.on('fetchAllFiles', () => {
        fileDal.getCollection((err, files) => {
         // console.log("files",err)
               if (err) {
                 return res.status(500).json({
                   message: 'ሰርቨሩ እየሰራ አይደለም',
                 });
               }
               if (files && files.length > 0) {
                 workflow.emit('respond', files);
               } else {
                 return res.status(200).json([]
                   ///message: 'file is not found'
                 );
               }
             });
           });
           workflow.on('respond', (files) => {
             res.status(200).json(files);
           });
           workflow.emit('fetchAllFiles');
         }
