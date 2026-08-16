const express = require("express");
const router = express.Router();
const reservasController = require("../controllers/reservasControllers");
const { verificarToken } = require("../middleware/auth");


router.get("/apoyo/clientes", reservasController.obtenerClientesParaSelect);
router.get("/apoyo/vehiculos", reservasController.obtenerVehiculosParaSelect);

router.get("/", reservasController.obtenerReservas);
router.get("/:id", reservasController.obtenerReservaPorId);
router.post("/", verificarToken, reservasController.crearReserva);
router.put("/:id", reservasController.actualizarReserva);
router.delete("/:id", reservasController.eliminarReserva);

module.exports = router;

module.exports = router;