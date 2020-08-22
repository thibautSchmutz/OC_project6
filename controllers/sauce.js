// Importation du model mongoose
// const Sauce = require("../models/Sauce");

// @desc      Récupérer toutes les sauces
// @route     GET /api/sauces
// @access    Private (auth)
exports.getAllSauces = (req, res, next) => {
  console.log("getAllSauces");
  res.send("toutes les sauces");
};

// @desc      Récupérer une sauce
// @route     GET /api/sauces/:id
// @access    Private (auth)
exports.getOneSauce = (req, res, next) => {
  id = req.params.id;
  console.log(`getOneSauce de la sauce ${id}`);
  res.send(`sauce qui a l'id ${id}`);
};

// @desc      Créer une nouvelle sauce
// @route     POST /api/sauces
// @access    Private (auth)
exports.createSauce = (req, res, next) => {
  console.log("createSauce");
  res.send(`Nouvelle sauce crée : ${req.body.name}`);
};

// @desc      Modifier une sauce
// @route     PUT /api/sauces/:id
// @access    Private (auth + owner)
exports.updateSauce = (req, res, next) => {
  id = req.params.id;
  console.log(`updateSauce de la sauce ${id}`);
  res.send(`Sauce ${req.body.name} modifiée`);
};

// @desc      Supprimer une sauce
// @route     DELETE /api/sauces/:id
// @access    Private (auth + owner)
exports.deleteSauce = (req, res, next) => {
  id = req.params.id;
  console.log(`deleteSauce de la sauce ${id}`);
  res.send(`Sauce ${req.body.name} supprimée`);
};

// @desc      Ajouter un like ou un dislike sur une sauce
// @route     POST /api/sauces/:id/like
// @access    (auth)
exports.updateLikes = (req, res, next) => {
  const user = req.body.user;
  const id = req.params.id;

  req.body.like === 1
    ? res.send(`${user} a liké la sauce ${id}`)
    : res.send(`${user} a disliké la sauce ${id}`);

  console.log(`Action de like sur la sauce ${id}`);
};
