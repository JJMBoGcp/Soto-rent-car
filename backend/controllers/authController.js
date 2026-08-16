const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuariosModel = require("../models/usuariosModel");
const clientesModel = require("../models/clientesModel");


const login = async (req, res) => {

    try {

        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({ mensaje: "Correo y contraseña son requeridos." });
        }

        const usuario = await usuariosModel.obtenerUsuarioPorCorreo(correo);

        if (!usuario) {
            return res.status(401).json({ mensaje: "Correo o contraseña incorrectos." });
        }

        const coincide = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!coincide) {
            return res.status(401).json({ mensaje: "Correo o contraseña incorrectos." });
        }

        const token = jwt.sign(
            {
                id_usuario: usuario.id_usuario,
                correo: usuario.correo,
                nombre: usuario.nombre,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token,
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (error) {

        res.status(500).json({ mensaje: "Error al iniciar sesión", error: error.message });

    }

};

// REGISTRO (siempre crea un usuario con rol "cliente")
const registro = async (req, res) => {

    try {

        const datosCliente = { ...req.body, rol: "cliente" };

        const nuevoCliente = await clientesModel.crearCliente(datosCliente);

        res.status(201).json({
            mensaje: "Cuenta creada correctamente. Ya puedes iniciar sesión."
        });

    } catch (error) {

        if (error.message.includes("UNIQUE") || error.message.includes("duplicate")) {
            return res.status(409).json({ mensaje: "Ese correo ya está registrado." });
        }

        res.status(500).json({ mensaje: "Error al crear la cuenta", error: error.message });

    }

};

module.exports = { login, registro };