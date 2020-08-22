const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const colors = require("colors");

dotenv.config({ path: "./config/config.env" });

// Connexion à la base de données
connectDB();

// Liens vers les différentes routes
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

// Création de l'application à partir d'express
const app = express();

// Gestion des CORS
app.use((req, res, next) => {
  //Accepter n'importe quel origine
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Lecture du format JSON des requêtes entrantes
app.use(express.json());

// Log des requêtes
app.use(morgan("dev"));

// Redirection vers les routes
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`Serveur lancé sur le port : ${PORT}`.bgWhite.brightBlue.bold)
);
