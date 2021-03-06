const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log(req.body);
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID non valable !";
    } else {
      next();
    }
  } catch (error) {
    res.status(403).json({ error: new Error("Requête invalide") });
  }
};
