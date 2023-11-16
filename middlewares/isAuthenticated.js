const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  // toute la logique d'authentification : récup du token, replace, findOne, etc...
  //   console.log(req.headers.authorization); // Bearer c6pQYokEhXIqW8xoZg
  const token = req.headers.authorization.replace("Bearer ", "");
  //   console.log(token); // c6pQYokEhXIqW8xoZg
  // une fois le token "délesté" de "Bearer ", vous pouvez recherché votre utilisateur dans la BDD grâce à un petit findOne :
  const userFound = await User.findOne({ token: token }).select("account");

  if (userFound) {
    req.user = userFound;

    next();
  } else {
    return res.status(401).json("Unauthorized");
  }
};

module.exports = isAuthenticated;
