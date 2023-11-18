const jwt = require("jsonwebtoken");
const { RegistrationUser } = require("../models/index");

const auth = async (req, res, next) => {
  try {
    const token = req.body.token;
    const verifyUser = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verifyUser);

    const user = await RegistrationUser.findOne({ _id: verifyUser._id });
    if (!user) {
      throw new Error("User not found");
    }
    
    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    res.status(400).send({ error: "Please Authenticate" });
  }
};

module.exports = auth;
