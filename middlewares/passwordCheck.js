const Password = require("../models/Password");

const passwordCheck = (req, res, next) => {
  if (!Password.validate(req.body.password)) {
    res.status(400).json({ message: "Mot de passe trop faible" });
    console.log("Mot de passe trop faible");
  } else {
    next();
  }
};

module.exports = passwordCheck;
