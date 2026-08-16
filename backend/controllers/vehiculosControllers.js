const vehiculosModel = require("../models/vehiculosModel");

// Obtener todos los vehículos
const obtenerVehiculos = async (req, res) => {

    try {

        const vehiculos = await vehiculosModel.obtenerVehiculos();

        res.status(200).json(vehiculos);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener los vehículos",
            error: error.message
        });

    }

};

// Obtener vehículo por ID
const obtenerVehiculoPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const vehiculo = await vehiculosModel.obtenerVehiculoPorId(id);

        if (!vehiculo) {
            return res.status(404).json({
                mensaje: "Vehículo no encontrado"
            });
        }

        res.status(200).json(vehiculo);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener el vehículo",
            error: error.message
        });

    }

};

// Crear vehículo
const crearVehiculo = async (req, res) => {

    try {

        const nuevoVehiculo = await vehiculosModel.crearVehiculo(req.body);

        res.status(201).json({
            mensaje: "Vehículo creado correctamente",
            vehiculo: nuevoVehiculo
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al crear el vehículo",
            error: error.message
        });

    }

};

// Actualizar vehículo
const actualizarVehiculo = async (req, res) => {

    try {

        const { id } = req.params;

        await vehiculosModel.actualizarVehiculo(id, req.body);

        res.status(200).json({
            mensaje: "Vehículo actualizado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al actualizar el vehículo",
            error: error.message
        });

    }

};

// Eliminar vehículo
const eliminarVehiculo = async (req, res) => {

    try {

        const { id } = req.params;

        await vehiculosModel.eliminarVehiculo(id);

        res.status(200).json({
            mensaje: "Vehículo eliminado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al eliminar el vehículo",
            error: error.message
        });

    }

};

module.exports = {
    obtenerVehiculos,
    obtenerVehiculoPorId,
    crearVehiculo,
    actualizarVehiculo,
    eliminarVehiculo
};