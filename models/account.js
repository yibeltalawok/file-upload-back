
  module.exports = (sequelize, Sequelize) => {
    const account = sequelize.define("accounts", {
        username: {
            type: Sequelize.STRING,
            allowNull: false
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
    return account;
  };