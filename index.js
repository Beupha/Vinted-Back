require = "dotenv".config();

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const isAuthenticated = require("./middlewares/isAuthenticated");
app.use(express.json());
const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: "db7tagilw",
  api_key: "153837273158517",
  api_secret: "pgL70R61LKUFvnj3KNoIWgGCkH4",
});
mongoose.connect(process.env.MONGODB_URI);

const userRoutes = require("./routes/user");
app.use(userRoutes);

const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

app.all("*", (req, res) => {
  return res.status(404).json("Not found");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server on fire 🔥");
});
