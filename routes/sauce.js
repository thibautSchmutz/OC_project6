const express = require("express");

// Importation des middlewares

// Importation des méthodes du Controller
getAllSauces;
createSauce;
getOneSauce;
updateSauce;
deleteSauce;
updateLikes;

// Déclaration du router express
const router = express.Router();

// Assignation des routes
router.route("/").get(getAllSauces).post(createSauce);
router.route("/:id").get(getOneSauce).put(updateSauce).delete(deleteSauce);
router.route("/:id/like").post(updateLikes);
