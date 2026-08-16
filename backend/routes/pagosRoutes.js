const express = require("express");
const router = express.Router();
const pagosController = require("../controllers/pagosControllers");

// Esta línea debe ir ANTES de "/:id"
router.get("/apoyo/reservas", pagosController.obtenerReservasParaSelect);

router.get("/", pagosController.obtenerPagos);
router.get("/:id", pagosController.obtenerPagoPorId);
router.post("/", pagosController.crearPago);
router.put("/:id", pagosController.actualizarPago);
router.delete("/:id", pagosController.eliminarPago);

module.exports = router;