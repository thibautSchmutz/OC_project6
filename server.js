const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const colors = require("colors");

dotenv.config({ path: "./config/config.env" });

// Connexion à la base de données
connectDB();

// Liens vers les différentes routes
// const bootcamps = require('./routes/bootcamps');
// const courses = require('./routes/courses');

// Création de l'application à partir d'express
const app = express();

// Lecture du format JSON des requêtes entrantes
app.use(express.json());

// Log des requêtes
app.use(morgan("dev"));

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Serveur lancé sur le port : ${PORT}`.bgWhite.brightBlue.bold)
);
