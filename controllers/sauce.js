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
// @access    Private (auth + owner(front))
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
// @access    Private (auth + owner(front))
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
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;

  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      switch (like) {
        case 1:
          Sauce.updateOne(
            { _id: sauceId },
            {
              $inc: { likes: +1 },
              $push: { usersLiked: userId },
            }
          )
            .then(() => {
              res.status(200).json({
                message: `Un like a été ajouté à la sauce ${sauce.name}`,
              });
            })
            .catch((error) => res.status(400).json({ error }));
          break;
        case 0:
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: userId },
              }
            )
              .then(() => {
                res.status(200).json({
                  message: `Un like a été retiré de la sauce ${sauce.name}`,
                });
              })
              .catch((error) => res.status(400).json({ error }));
          } else if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: userId },
              }
            )
              .then(() => {
                res.status(200).json({
                  message: `Un dislike a été retiré de la sauce ${sauce.name}`,
                });
              })
              .catch((error) => res.status(400).json({ error }));
          }
          break;
        case -1:
          Sauce.updateOne(
            { _id: sauceId },
            {
              $inc: { dislikes: +1 },
              $push: { usersDisliked: userId },
            }
          )
            .then(() => {
              res.status(200).json({
                message: `Un dislike a été ajouté de la sauce ${sauce.name}`,
              });
            })
            .catch((error) => res.status(400).json({ error }));
          break;
        default:
          throw "Bad Request : Aucune action n'a été enregistrée sur les likes/dislikes";
      }
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};
