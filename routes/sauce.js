const express = require("express");

// Importation des middlewares
const authentication = require("../middlewares/authentication");
// Importation des méthodes du Controller
const {
  getAllSauces,
  createSauce,
  getOneSauce,
  updateSauce,
  deleteSauce,
  updateLikes,
} = require("../controllers/sauce");

// Déclaration du router express
const router = express.Router();

// Assignation des routes

router
  .route("/")
  .get(authentication, getAllSauces)
  .post(authentication, createSauce);

router
  .route("/:id")
  .get(authentication, getOneSauce)
  .put(authentication, updateSauce)
  .delete(authentication, deleteSauce);

router.route("/:id/like").post(authentication, updateLikes);

module.exports = router;
