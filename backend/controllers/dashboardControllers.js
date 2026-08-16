const dashboardModel = require("../models/dashboardModel");

const obtenerResumen = async (req, res) => {

    try {

        const resumen = await dashboardModel.obtenerResumen();

        res.status(200).json(resumen);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener el resumen",
            error: error.message
        });

    }

};

const obtenerReservasRecientes = async (req, res) => {

    try {

        const reservas = await dashboardModel.obtenerReservasRecientes();

        res.status(200).json(reservas);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener reservas recientes",
            error: error.message
        });

    }

};

module.exports = {
    obtenerResumen,
    obtenerReservasRecientes
};