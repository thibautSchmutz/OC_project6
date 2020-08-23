// Importation du model mongoose Sauce
const Sauce = require("../models/Sauce");
const fs = require("fs");

// @desc      Récupérer toutes les sauces
// @route     GET /api/sauces
// @access    Private (auth)
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// @desc      Récupérer une sauce
// @route     GET /api/sauces/:id
// @access    Private (auth)
exports.getOneSauce = (req, res, next) => {
  Sauce.findById(req.params.id)
    .then((sauce) => {
      if (!sauce) {
        res.status(404).send("Sauce introuvable");
      }
      res.status(200).json(sauce);
    })
    .catch((error) =>
      res.status(400).send("Bad Request : Format d'ID incorrect")
    );
};

// @desc      Créer une nouvelle sauce
// @route     POST /api/sauces
// @access    Private (auth)
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);

  const sauce = new Sauce({
    ...sauceObject,
    userId: req.customUserID,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  Sauce.create(sauce)
    .then(() => res.status(201).json(`sauce ${sauce.name} ajoutée`))
    .catch((error) => res.status(400).json({ error }));
};

// @desc      Modifier une sauce
// @route     PUT /api/sauces/:id
// @access    Private (auth + owner)
exports.updateSauce = (req, res, next) => {
  // Extraction de body de la requête en fonction de la présence d'une image ou non.
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  // Sauce.findByIdAndUpdate(req.params.id, { ...sauceObject })
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée" }))
    .catch((error) => res.status(400).json({ error }));

  console.log(`updateSauce de la sauce à l'id : ${req.params.id}`);
};

// @desc      Supprimer une sauce
// @route     DELETE /api/sauces/:id
// @access    Private (auth + owner)
exports.deleteSauce = (req, res, next) => {
  Sauce.findById(req.params.id)
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
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
