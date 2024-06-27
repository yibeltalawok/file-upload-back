module.exports = (sequelize, Sequelize) => {
    const Likes = sequelize.define("likes", {
        likes: {
        type: Sequelize.INTEGER 
           },
        views: {
        type: Sequelize.INTEGER 
       },
     });  
    return Likes;
  };