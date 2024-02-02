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
    return res.status(200).json({
      message: "Votre inscription est bien effective",
      token: newUser.token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// La connexion

router.post("/user/login", async (req, res) => {
  try {
    const receivedMail = req.body.email;

    const userFound = await User.findOne({ email: receivedMail });

    // if (!userFound) {
    //   return res.status(400).json({
    //     message:
    //       "Nous n'avons pas trouvé de compte associé à cette adresse email",
    //   });
    // }

    const receivedPassword = req.body.password;

    const saltedReceivedPassword = receivedPassword + userFound.salt;

    const newHash = SHA256(saltedReceivedPassword).toString(encBase64);

    if (newHash === userFound.hash) {
      return res
        .status(200)
        .json({ message: "Vous êtes bien connecté", token: userFound.token });
    } else {
      return res.status(401).json({ message: "Accès refusé" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
