module.exports = (req, res, next) => {
  console.log("test du middleware authentification");
  next();
};
