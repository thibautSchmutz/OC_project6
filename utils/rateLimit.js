const rateLimit = require("express-rate-limit");

// Création d'une instance d'express-rate-limit pour limiter le nombre de requête sur la route /api/auth
const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // Plage d'une heure
  max: 5, // bloque à partir de 5 essais
  message: "Trop de tentatives, vous pourrez réessayer dans une heure",
});

module.exports = rateLimiter;
