const clientesModel = require("../models/clientesModel");

// Obtener todos los clientes
const obtenerClientes = async (req, res) => {

    try {

        const clientes = await clientesModel.obtenerClientes();

        res.status(200).json(clientes);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener los clientes",
            error: error.message
        });

    }

};

// Obtener cliente por ID
const obtenerClientePorId = async (req, res) => {

    try {

        const { id } = req.params;

        const cliente = await clientesModel.obtenerClientePorId(id);

        if (!cliente) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        res.status(200).json(cliente);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener el cliente",
            error: error.message
        });

    }

};

// Crear cliente
const crearCliente = async (req, res) => {

    try {

        const nuevoCliente = await clientesModel.crearCliente(req.body);

        res.status(201).json({
            mensaje: "Cliente creado correctamente",
            cliente: nuevoCliente
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al crear el cliente",
            error: error.message
        });

    }

};

// Actualizar cliente
const actualizarCliente = async (req, res) => {

    try {

        const { id } = req.params;

        await clientesModel.actualizarCliente(id, req.body);

        res.status(200).json({
            mensaje: "Cliente actualizado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al actualizar el cliente",
            error: error.message
        });

    }

};

// Eliminar cliente
const eliminarCliente = async (req, res) => {

    try {

        const { id } = req.params;

        await clientesModel.eliminarCliente(id);

        res.status(200).json({
            mensaje: "Cliente eliminado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al eliminar el cliente",
            error: error.message
        });

    }

};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};