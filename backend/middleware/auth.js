const jwt = require("jsonwebtoken");

// Verifica que exista un token válido
const verificarToken = (req, res, next) => {

    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ mensaje: "No autorizado. Inicia sesión." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decodificado; // { id_usuario, correo, rol, nombre }
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: "Token inválido o expirado." });
    }

};

// Exige además que el rol sea admin
const soloAdmin = (req, res, next) => {

    if (req.usuario.rol !== "admin") {
        return res.status(403).json({ mensaje: "Acceso restringido a administradores." });
    }

    next();

};

module.exports = { verificarToken, soloAdmin };