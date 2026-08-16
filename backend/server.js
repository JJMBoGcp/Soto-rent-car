const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const { conectarDB } = require("./config/db");

const usuariosRoutes = require("./routes/usuariosRoutes");
const clientesRoutes = require("./routes/clientesRoutes");
const vehiculosRoutes = require("./routes/vehiculosRoutes");
const reservasRoutes = require("./routes/reservasRoutes");
const pagosRoutes = require("./routes/pagosRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());

// Sirve todo el frontend (HTML, CSS, JS) desde este mismo servidor
app.use(express.static(path.join(__dirname, "../frontend")));

// La carpeta assets (imágenes/logo) vive fuera de frontend, así que se sirve aparte
app.use("/assets", express.static(path.join(__dirname, "../assets")));

conectarDB();

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});