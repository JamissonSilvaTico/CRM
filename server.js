require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Importe o módulo 'path'
const customerRoutes = require("./customer.routes");
const schedulingRoutes = require("./scheduling.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Configuração para Produção ---
// Servir os arquivos estáticos da build do React
app.use(express.static(path.join(__dirname, "dist")));

// API Routes
app.use("/api/customers", customerRoutes);
app.use("/api/schedules", schedulingRoutes);

// --- Rota Catch-all para o Frontend ---
// Qualquer outra requisição GET que não seja para a API, envia o index.html do React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Database Connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server only after DB connection is successful
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
