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
    userId: sauceObject.userId,
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
    .then(() =>
      res.status(200).json({ message: `Sauce ${sauceObject.name} modifiée` })
    )
    .catch((error) => res.status(400).json({ error }));
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
  const userId = req.body.userId;
  const like = req.body.like; // peut être : 1, -1 ou 0

  // Récupérer l'objet de la BDD
  Sauce.findById(req.params.id)
    .then((sauce) => {
      if (like === 1) {
        sauce.usersLiked.push(userId);
        sauce.likes = sauce.usersLiked.length;
      } else if (like === -1) {
        sauce.usersDisliked.push(userId);
        sauce.dislikes = sauce.usersDisliked.length;
      } else {
        // like === 0
        if (sauce.usersLiked.includes(userId)) {
          sauce.usersLiked.filter((user) => user !== userId);
          sauce.likes = sauce.usersLiked.length;
        } else if (sauce.usersDisliked.includes(userId)) {
          sauce.usersDisliked.filter((user) => user !== userId);
          sauce.dislikes = sauce.usersDisliked.length;
        }
      }
      // Enregistrer les modifications dans le BDD
      Sauce.findByIdAndUpdate(req.params.id, { ...sauce })
        .then(() =>
          res
            .status(203)
            .json({ message: "Action de sur les likes enregistrée" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};
