var jwt = require("jsonwebtoken");
const Model = require('../models');
const secretKey="bezkoder-secret-key"
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
const User = Model.accounts;
const authenticateUser = (req, res, next) => {
  // User.findOne().then(user => {
  //       var token = jwt.sign({ id: user.id }, config.secret, {
  //         expiresIn: 86400 
  //       });
              // Get the JWT from the request header
   var token = req.header('Authorization')?.replace('Bearer ', '');
   if (!token) {
     return res.status(401).json({ message: 'No token provided' });
   }
   try {
     // Verify and decode the JWT
    //  console.log(token)
     const decoded = jwt.verify(token, secretKey);
    //  console.log("yes yes")
    // console.log(decoded)
     const user =  User.findByPk(decoded.id);
     if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
      next();
    //  res.json(token)
   } catch (error) {
     console.error(error);
     return res.status(401).json({ token });
   }
      // })
      // .catch(err => {
      //   res.status(500).send({ message: err.message });
      // }); 
};
module.exports = { authenticateUser };
