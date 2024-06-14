const Model = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Post = Model.posts;
exports.create = async (postData, cb) => {
  try {
    // const eplusapp = await EplusappFile.create(eplusappData); 
    const eplusapp=await Post.create(postData)   
    return cb(null, eplusapp?.dataValues);
  } catch (err) {
    return cb(err.message);
  }
};

exports.getCollection = async (query,cb) => {
 // console.log("sort",filter.sort)
    
    try {

      // let searchKey ={
      //   where:{
      //     createdAt:{
      //     [Op.like]:`${query}`
      //     }
        
      // // //order:[['updatedAt','DESC']]
      //    }
      //  }
       //console.log("key",searchKey)
      let files = await Post.findAll(query);
      return cb(null, files);
    } catch (err) {
      return cb(err);
    }
  };

  exports.delete = async (query, cb) => {
    try {
      const file = await EplusappFile.findByPk(query);
      file.destroy();
      return cb(null, file?.dataValues);
    } catch (err) {
      return cb(err);
    }
  };