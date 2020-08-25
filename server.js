const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const colors = require("colors");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const cors = require("cors");

dotenv.config({ path: "./config/srt.env" });

// Connexion à la base de données
connectDB();

// Liens vers les différentes routes
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

// Création de l'application à partir d'express
const app = express();

// Sanitize inputs pour Mongo
app.use(mongoSanitize());

// Ajout des paramètres de securités au headers des responses (contient une méthode xssFilter()).
app.use(helmet());

// Lecture du format JSON des requêtes entrantes
app.use(express.json());

// Gestion des CORS (ouvert sur toutes les routes)
app.use(cors());

// Log des requêtes
app.use(morgan("dev"));

// Création d'un dossier statique pour importer des images du front et les renvoyer au front
app.use("/images", express.static(path.join(__dirname, "images")));

// Redirection vers les routes
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`Serveur lancé sur le port : ${PORT}`.bgWhite.brightBlue.bold)
);
