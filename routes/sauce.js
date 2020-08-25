const express = require("express");

// Importation des middlewares
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

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
router.route("/").get(auth, getAllSauces).post(auth, multer, createSauce);
router
  .route("/:id")
  .get(auth, getOneSauce)
  .put(auth, multer, updateSauce)
  .delete(auth, deleteSauce);
router.route("/:id/like").post(auth, updateLikes);

// Exportation du module
module.exports = router;
