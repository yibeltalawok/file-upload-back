const Model = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const user = Model.user;
exports.create = async (userData, cb) => {
  try {
    const users=await user.create(userData)  
    // console.log("yess")
    return cb(null, users?.dataValues);
  } catch (err) {
    return cb(err.message);
  }};