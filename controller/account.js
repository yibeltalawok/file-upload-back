const express = require('express')
var EventEmitter = require('events').EventEmitter;
const config = require("../config/auth.config");
var fileDal = require('../dal/account');
const Model = require('../models');
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
const User = Model.accounts;
//Importing the JWT package
const jwt = require('jsonwebtoken')
//Importing the bcrypt package
const bcrypt = require('bcryptjs')
//Importing the express-async-handler package
const asyncHandler = require("express-async-handler");
//Importing the uuidv4 package to generate userId
const {v4 : uuidv4} = require('uuid')
//         // User Register
  // exports.createAccount = (req, res, next) => {
  //        let workflow = new EventEmitter();                       
  //          const { username,email, password } = req.body;
  //              // Check if the username is already taken
  //          const existingUser =  User.findOne({ where: { username } });
  //          if (existingUser) {
  //              return res.status(400).json({ message: 'Username already exists' });
  //                  }
  //       let userData={ username:req.body.username,
  //           email:req.body.email,
  //           password:bcrypt.hashSync(req.body.password, 10)
  //           }
  //        workflow.on('validateData', (userData) => {
  //         if (!userData.username || !userData.password || !userData.email) {
  //         return res.status(400).json({ message: 'እባክዎ የፋይሉን ስም ያስገቡ' });
  //            }
  //         else
  //          {
  //        workflow.emit('createFile',userData);
  //           }});
  //        workflow.on('createFile', (userData) => {
  //         // console.log("create account")
  //        fileDal.create(userData, (err, file) => {
  //         if (err) {
  //           return res.status(500).json({
  //           message: 'ሰርቨሩ እየሰራ አይደለም',
  //             });}
  //        workflow.emit('respond', file);
  //            });
  //          });
  //        workflow.on('respond', (file) => {
  //          res.status(200).json(file);
  //          });
  //       workflow.emit('validateData', userData);
  //        };     

  const createAccount = asyncHandler(async (req, res) => {
      // exports.createAccount = (req, res, next) => {

    //Destructuing the inputs from req.body 
    const { username, email } = req.body;
    //Verifying the email address inputed is not used already 
    const verifyEmail = await User.findOne({where: { email: email }  })
    try {
        if (verifyEmail) {
            return res.status(403).json({
                message: "Email already used"
            })
        } else {
            //generating userId
            const userId = uuidv4()
            //using bcrypt to hash the password sent from the user
            bcrypt.hash(req.body.password, 10)
                .then((hash) => {
                    //Registering the user
                    const user = new User({
                        username: username,
                        email: email,
                        password: hash,
                    });
                    //saving the data to the mongodb user collection
                    user.save()
                        .then((response) => {
                            return res.status(201).json({
                                message: 'user successfully created!',
                                result: response,
                                success: true
                            })
                        })
                        .catch((error) => {
                            res.status(500).json({
                                error: error,
                            })
                        })
                   })}
     } catch (error) {
        return res.status(412).send({
            success: false,
            message: error.message
        })
    }
  })

  //user login
  const signin = asyncHandler(async (req, res) => {
        // console.log(req.body)
const { email } = req.body
    User.findOne({
      where: {
     email: email
      }
    })
      .then(user => {
        if (!user) 
         {
          return res.status(404).send({ message: "User Not found." });
        }
        //  console.log(user.password)
       var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        // result[0]['password'],
        if (!passwordIsValid) {
          console.log("no user")
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400 // 24 hours
        });
        // const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
        // var authorities = [];
        // user.getRoles().then(roles => {
        //   for (let i = 0; i < roles.length; i++) {
        //     authorities.push("ROLE_" + roles[i].name.toUpperCase());
        //   }
        //   res.json(token)
        // });
        res.json(token)

      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  });
  const login = asyncHandler(async (req, res) => {
    //Destructing the inputs from req.body
    const { email, password } = req.body
    //created a variable to assign the user
    let getUser
    //verifying that the user with the email exist or not
    User.findOne({
        where:{email: email}   
     }).then((user) => {
        if (!user) {
            //if user does not exist responding Authentication Failed
            return res.status(401).json({
                message: "Authentication Failed",
            })}
        //assigned the user to getUser variable
        getUser = user
        /*
    Then compare the password from the req.body and the hased password on the database 
    using the bcrypt.compare built in function
    */
  return bcrypt.compareSync(password, user.password)
    })
        .then((response) => {
            if (!response) {
                return res.status(401).json({
                    message: "Here Also Authentication Failed"
                })
            } else {
                let jwtToken = jwt.sign(
                    {
                        email: getUser.email,
                        userId: getUser.userId
                    },
                    //Signign the token with the JWT_SECRET in the .env
                    // process.env.JWT_SECRET,
                    config.secret,
                    {
                        expiresIn: "1h"
                    })
                return res.status(200).json({
                    accessToken: jwtToken,
                    //I like to send the userId of the user that loggedin in order to fetch his data and dispaly
                    userId: getUser.id,
                })}})
        .catch((err) => {
            return res.status(401).json({
                messgae: err.message,
                success: false
            })})})
// Profile image 
const userProfile = asyncHandler(async (req, res, next) => {
  //Destructing id from the req.params
  const { id } = req.params;

  try {
      //verifying if the user exist in the database
      const verifyUser = await User.findOne({ userId: id })
      if (!verifyUser) {
          return res.status(403).json({
              message: "user not found",
              success: false,
          })
      } else {
          return res.status(200).json({
              messgae: `user ${verifyUser.fullName}`,
              success: true
          })
      }
  }
  catch (error) {
      return res.status(401).json({
          sucess: false,
          message: error.message,
      })
  }
});
  //Fetching all users from database
  const users = asyncHandler(async (req, res) => {
  try {
      const users = await User.findAll();
    //   console.log(users)
      return res.status(200).json({
          data: users,
          sucess: true,
          message: "users list"
      })
  } catch (error) {
      return res.status(401).json({
          sucess: false,
          message: error.message,
      })
  }

})
module.exports = {
  createAccount,
  signin,
  login,
  userProfile,
  users
}