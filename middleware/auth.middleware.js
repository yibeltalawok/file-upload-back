const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    // console.log("Token==",token)
    // console.log("AcessToken==",accessToken)
    const decoded = jwt.verify(token, config.secret);
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
     req.userData = decoded;
     next();
    } catch (err) {
      console.error(err);
    return res.status(401).json({
      message: "Authentification Failed"
    });}};
module.exports = { authenticateUser };