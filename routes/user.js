const express = require("express");
const router = express.Router();

const User = require("../models/User");

const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");
const SHA256 = require("crypto-js/sha256");

// L'inscription

router.post("/user/signup", async (req, res) => {
  try {
    // console.log(req.body);
    if (!req.body.username) {
      return res.status(200).json("Veuillez rentrer un nom d'utilisateur");
    }
    // console.log(await User.findOne({ email: req.body.email }));
    if ((await User.findOne({ email: req.body.email })) !== null) {
      return res.status(200).json("Cet email est déjà utilisé");
    }

    const password = req.body.password;
    const salt = uid2(24);
    const saltedPassword = password + salt;
    const hash = encBase64.stringify(SHA256(saltedPassword));

    const newUser = new User({
      email: req.body.email,
      account: {
        username: req.body.username,
        avatar: Object,
      },
      newsletter: req.body.newsletter,
      token: uid2(18),
      hash: hash,
      salt: salt,
    });
    newUser.save();
    return res.status(200).json("Votre inscription est bien effective");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// La connexion

router.post("/user/login", async (req, res) => {
  try {
    const receivedMail = req.body.email;
    // console.log("receivedMail --->", receivedMail);

    const userFound = await User.findOne({ email: receivedMail });
    // console.log("userFound --->", userFound);

    const receivedPassword = req.body.password;
    // console.log("receivedPassword --->", receivedPassword);

    const saltedReceivedPassword = receivedPassword + userFound.salt;
    // console.log("saltedReceivedPassword --->", saltedReceivedPassword);

    const newHash = SHA256(saltedReceivedPassword).toString(encBase64);
    // console.log("newHash --->", newHash);

    if (newHash === userFound.hash) {
      return res
        .status(200)
        .json({ message: "Vous êtes bien connecté", token: userFound.token });
    } else {
      return res.status(401).json("Accès refusé");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
