const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  // console.log("Bearer tok -->", req.headers.authorization);
  const user = await User.findOne({
    token: req.headers.authorization.replace("Bearer ", ""),
  });
  console.log("user -->", user);
  if (user) {
    req.user = user;

    next();
  } else {
    return res.status(401).json("IsAuthenticated non validé");
  }
};

module.exports = isAuthenticated;
