const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.use(express.json());

router.post("/payment", async (req, res) => {
  //   console.log("req.body ->", req.body);
  try {
    const token = req.body.token;
    const chargeObject = await stripe.charges.create({
      amount: req.body.amount * 100,
      currency: "eur",
      description: req.body.title,
      source: token,
    });
    // console.log("chargeObject ->", chargeObject);
    return res.status(200).json(chargeObject);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
