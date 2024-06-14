// const validator = require("../utils/validate")
// const  validator  = require('validatorjs');
const express = require('express');
const Validator  = require('validatorjs');
const app = express();
const regsiterValidation =  (req, res, next) => {
    const validateRule = {
        "username": "required|string|min:3", 
        "email": "required|email", 
        "password":"required|min:6",
        //  "phoneNumber":"required|max:10|min:10"
    }
const validateData = (data, rules) => {
        const validation = new Validator(data, rules);
        if (validation.fails()) {
          const errors = validation.errors.all();
          throw new Error(JSON.stringify(errors));
        }
      };
     validateData(req.body, validateRule, {}, (err, status) =>{
        if (!status){
            res.status(412)
            .send({
                success: false,
                    message: 'Validation failed',
                    data: err
            })}
     })
     next();
    } 
const loginValidation =  (req, res, next) => {
    const validateRule = {
       "email": "required|email", 
       "password":"required|min:6",
     }
const validateData = (data, rules) => {
        const validation = new Validator(data, rules);
        if (validation.fails()) {
          const errors = validation.errors.all();
          throw new Error(JSON.stringify(errors));
        }
      };
validateData(req.body, validateRule, {}, (err, status) =>{
       if (!status){
           res.status(412)
           .send({
               success: false,
                   message: 'Validation failed',
                   data: err
           })}
    })
    next();
  }
module.exports = {
     regsiterValidation, 
     loginValidation,
}