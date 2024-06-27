const Model = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const likes = Model.likes;
// exports.update = async (fileData,id, cb) => {
// //    console.log("data=",fileData)
//    var { id } = id;
//    console.log(id)
//   try {
//     // const eplusapp = await EplusappFile.create(eplusappData); 
//     // const like=await likes.update(fileData)   
//     const like=await likes.update(fileData, {
//         where: { id: id }
//       })
//     return cb(null, like?.dataValues);
//   } catch (err) {
//     return cb(err.message);
//   }
// };
exports.getCollection = async (query, cb) => {
  try {
    let files = await likes.findAll(query);
    return cb(null, files);
  } catch (err) {
    return cb(err);
  }
};