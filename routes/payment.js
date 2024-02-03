const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.use(express.json());

router.post("/payment", async (req, res) => {
  try {
    const token = req.body.stripeToken;
    const chargeObject = await stripe.charges.create({
      amount: 3333,
      currency: "eur",
      description: "La description de l'objet acheté",
      source: token,
    });
    return res.status(200).json(chargeObject);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
