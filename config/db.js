const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Lecture des variables d'environnement
dotenv.config({ path: "./config/srt.env" });

let mongoUri = process.env.PROD_MODE
  ? process.env.MONGO_URI_PROD
  : process.env.MONGO_URI_DEV;

const connectDB = async () => {
  const conn = await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  const nodeMode = process.env.PROD_MODE ? "production" : "developpement";

  console.log(
    `MongoDB connecté: ${conn.connection.host} en mode ${nodeMode}`.bgGreen
      .black.bold
  );
};

module.exports = connectDB;
