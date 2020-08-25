const express = require("express");
const nocache = require("nocache");

// Importation de middleware
const rateLimiter = require("../utils/rateLimit");

// Importation des méthodes du controller
const { signup, login } = require("../controllers/user");

// Instanciation du middleware nocache
const cache = nocache();

// Déclaration du router express
const router = express.Router();

// Assignation des routes
router.post("/signup", cache, rateLimiter, signup);
router.post("/login", cache, rateLimiter, login);

// Exportation du module
module.exports = router;
