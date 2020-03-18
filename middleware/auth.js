const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  //Get token from header
  const token = req.header("x-auth-token");
  //check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, auth denied" });
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    //run if user not valid
    res.status(401).json({ msg: "token is not valid" });
  }
};
