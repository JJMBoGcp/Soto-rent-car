const reservasModel = require("../models/reservasModel");

const obtenerReservas = async (req, res) => {
    try {
        const reservas = await reservasModel.obtenerReservas();
        res.status(200).json(reservas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las reservas", error: error.message });
    }
};

const obtenerReservaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const reserva = await reservasModel.obtenerReservaPorId(id);

        if (!reserva) {
            return res.status(404).json({ mensaje: "Reserva no encontrada" });
        }

        res.status(200).json(reserva);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la reserva", error: error.message });
    }
};

// Rutas de apoyo para llenar los <select> del formulario
const obtenerClientesParaSelect = async (req, res) => {
    try {
        const clientes = await reservasModel.obtenerClientesParaSelect();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener clientes", error: error.message });
    }
};

const obtenerVehiculosParaSelect = async (req, res) => {
    try {
        const vehiculos = await reservasModel.obtenerVehiculosParaSelect();
        res.status(200).json(vehiculos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener vehículos", error: error.message });
    }
};

const crearReserva = async (req, res) => {
    try {
        let datosReserva = { ...req.body };

        // Si quien reserva es un cliente (no admin), forzamos su propio id_cliente
        // ignorando cualquier id_cliente que venga del formulario (seguridad)
        if (req.usuario && req.usuario.rol === "cliente") {

            const id_cliente = await reservasModel.obtenerIdClientePorUsuario(req.usuario.id_usuario);

            if (!id_cliente) {
                return res.status(400).json({ mensaje: "No se encontró un perfil de cliente asociado a tu cuenta." });
            }

            datosReserva.id_cliente = id_cliente;
        }

        const nuevaReserva = await reservasModel.crearReserva(datosReserva);
        res.status(201).json({ mensaje: "Reserva creada correctamente", reserva: nuevaReserva });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear la reserva", error: error.message });
    }
};

const actualizarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        await reservasModel.actualizarReserva(id, req.body);
        res.status(200).json({ mensaje: "Reserva actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la reserva", error: error.message });
    }
};

const eliminarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        await reservasModel.eliminarReserva(id);
        res.status(200).json({ mensaje: "Reserva eliminada correctamente" });
    } catch (error) {
        if (error.message.includes("REFERENCE constraint")) {
            return res.status(409).json({
                mensaje: "No se puede eliminar esta reserva porque tiene pagos o facturas asociadas."
            });
        }

        res.status(500).json({ mensaje: "Error al eliminar la reserva", error: error.message });
    }
};

module.exports = {
    obtenerReservas,
    obtenerReservaPorId,
    obtenerClientesParaSelect,
    obtenerVehiculosParaSelect,
    crearReserva,
    actualizarReserva,
    eliminarReserva
};