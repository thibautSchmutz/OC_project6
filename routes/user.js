const express = require("express");

// Importation des méthodes du controller
const { signup, login } = require("../controllers/user");

// Déclaration du router express
const router = express.Router();

// Assignation des routes
router.post("/signup", signup);
router.post("/login", login);

// Exportation du module
module.exports = router;
