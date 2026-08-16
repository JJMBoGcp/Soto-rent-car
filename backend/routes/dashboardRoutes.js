const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardControllers");

router.get("/resumen", dashboardController.obtenerResumen);
router.get("/reservas-recientes", dashboardController.obtenerReservasRecientes);

module.exports = router;