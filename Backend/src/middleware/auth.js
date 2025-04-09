const jwt = require("jsonwebtoken");
const { RegistrationUser } = require("../models/index");

const auth = (roles = []) => async (req, res, next) => {
  try {
    const token = req.body.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send({ error: "Unauthorized" });

    const verifyUser = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verifyUser);
    const user = await RegistrationUser.findOne({ _id: verifyUser._id });
    if (!user || (roles.length && !roles.includes(user.role))) {
      return res.status(403).send({ error: "Forbidden" });
    }
    
    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    res.status(401).send({ error: "Authentication failed" });
    res.status(400).send({ error: "Please Authenticate" });
  }
};

module.exports = auth;
