const pagosModel = require("../models/pagosModel");

const obtenerPagos = async (req, res) => {
    try {
        const pagos = await pagosModel.obtenerPagos();
        res.status(200).json(pagos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los pagos", error: error.message });
    }
};

const obtenerPagoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const pago = await pagosModel.obtenerPagoPorId(id);

        if (!pago) {
            return res.status(404).json({ mensaje: "Pago no encontrado" });
        }

        res.status(200).json(pago);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el pago", error: error.message });
    }
};

// Ruta de apoyo para llenar el <select> del formulario
const obtenerReservasParaSelect = async (req, res) => {
    try {
        const reservas = await pagosModel.obtenerReservasParaSelect();
        res.status(200).json(reservas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener reservas", error: error.message });
    }
};

const crearPago = async (req, res) => {
    try {
        const nuevoPago = await pagosModel.crearPago(req.body);
        res.status(201).json({ mensaje: "Pago creado correctamente", pago: nuevoPago });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el pago", error: error.message });
    }
};

const actualizarPago = async (req, res) => {
    try {
        const { id } = req.params;
        await pagosModel.actualizarPago(id, req.body);
        res.status(200).json({ mensaje: "Pago actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el pago", error: error.message });
    }
};

const eliminarPago = async (req, res) => {
    try {
        const { id } = req.params;
        await pagosModel.eliminarPago(id);
        res.status(200).json({ mensaje: "Pago eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el pago", error: error.message });
    }
};

module.exports = {
    obtenerPagos,
    obtenerPagoPorId,
    obtenerReservasParaSelect,
    crearPago,
    actualizarPago,
    eliminarPago
};