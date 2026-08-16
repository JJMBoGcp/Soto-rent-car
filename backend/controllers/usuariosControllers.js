const usuariosModel = require("../models/usuariosModel");

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {

    try {

        const usuarios = await usuariosModel.obtenerUsuarios();

        res.status(200).json(usuarios);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener los usuarios",
            error: error.message
        });

    }

};

// Obtener usuario por ID
const obtenerUsuarioPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const usuario = await usuariosModel.obtenerUsuarioPorId(id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json(usuario);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener el usuario",
            error: error.message
        });

    }

};

// Crear usuario
const crearUsuario = async (req, res) => {

    try {

        const nuevoUsuario = await usuariosModel.crearUsuario(req.body);

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            usuario: nuevoUsuario
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al crear el usuario",
            error: error.message
        });

    }

};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {

    try {

        const { id } = req.params;

        await usuariosModel.actualizarUsuario(id, req.body);

        res.status(200).json({
            mensaje: "Usuario actualizado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al actualizar el usuario",
            error: error.message
        });

    }

};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {

    try {

        const { id } = req.params;

        await usuariosModel.eliminarUsuario(id);

        res.status(200).json({
            mensaje: "Usuario eliminado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al eliminar el usuario",
            error: error.message
        });

    }

};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};