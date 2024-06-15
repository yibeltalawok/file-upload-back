
module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define("users", {
         firstName: {
            type: Sequelize.STRING,
            allowNull: false
           },
          middleName: {
            type: Sequelize.STRING,
            allowNull: false
          },
          lastName: {
            type: Sequelize.STRING,
            allowNull: false
          },
          sex: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false
          }
    });  
    return user;
  };