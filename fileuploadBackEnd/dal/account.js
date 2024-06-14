const Model = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const user = Model.accounts;
exports.create = async (userData, cb) => {
  try {
    const users=await user.create(userData)  
    // console.log("yess")
    return cb(null, users?.dataValues);
  } catch (err) {
    return cb(err.message);
  }
};

// exports.getCollection = async (query,cb) => {    
//     try {
//       let files = await user.findAll(query);
//       return cb(null, files);
//     } catch (err) {
//       return cb(err);
//     }
//   };

//   exports.delete = async (query, cb) => {
//     try {
//       const file = await user.findByPk(query);
//       file.destroy();
//       return cb(null, file?.dataValues);
//     } catch (err) {
//       return cb(err);
//     }
//   };