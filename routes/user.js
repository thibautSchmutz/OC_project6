const express = require("express");
const nocache = require("nocache");

// Importation de middleware
const cache = nocache();
const passwordCheck = require("../middlewares/passwordCheck");
const rateLimiter = require("../utils/rateLimit");

// Importation des méthodes du controller
const { signup, login } = require("../controllers/user");

// Déclaration du router express
const router = express.Router();

// Assignation des routes
router.post("/signup", cache, passwordCheck, signup);
router.post("/login", cache, rateLimiter, login);

// Exportation du module
module.exports = router;
