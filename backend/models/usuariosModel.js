const { getPool, sql } = require("../config/db");
const bcrypt = require("bcrypt");

// Obtener todos los usuarios (sin la contraseña)
const obtenerUsuarios = async () => {
    const pool = getPool();

    const resultado = await pool.request().query(`
        SELECT id_usuario, nombre, apellido, correo, rol
        FROM Usuarios
        ORDER BY id_usuario
    `);

    return resultado.recordset;
};

// Obtener un usuario por ID (sin la contraseña)
const obtenerUsuarioPorId = async (id) => {
    const pool = getPool();

    const resultado = await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            SELECT id_usuario, nombre, apellido, correo, rol
            FROM Usuarios
            WHERE id_usuario = @id
        `);

    return resultado.recordset[0];
};

// Crear usuario


// Crear usuario
const crearUsuario = async (usuario) => {
    const { nombre, apellido, correo, contrasena, rol } = usuario;

    const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

    const pool = getPool();

    const resultado = await pool
        .request()
        .input("nombre", sql.VarChar(100), nombre)
        .input("apellido", sql.VarChar(100), apellido)
        .input("correo", sql.VarChar(100), correo)
        .input("contrasena", sql.VarChar(255), contrasenaHasheada)
        .input("rol", sql.VarChar(20), rol)
        .query(`
            INSERT INTO Usuarios
            (nombre, apellido, correo, contrasena, rol)

            OUTPUT INSERTED.id_usuario, INSERTED.nombre, INSERTED.apellido, INSERTED.correo, INSERTED.rol

            VALUES
            (@nombre, @apellido, @correo, @contrasena, @rol)
        `);

    return resultado.recordset[0];
};

// Actualizar usuario (contraseña opcional)
const actualizarUsuario = async (id, usuario) => {
    const { nombre, apellido, correo, contrasena, rol } = usuario;

    const pool = getPool();

    const request = pool
        .request()
        .input("id", sql.Int, id)
        .input("nombre", sql.VarChar(100), nombre)
        .input("apellido", sql.VarChar(100), apellido)
        .input("correo", sql.VarChar(100), correo)
        .input("rol", sql.VarChar(20), rol);

    if (contrasena) {
        request.input("contrasena", sql.VarChar(255), contrasena);

        await request.query(`
            UPDATE Usuarios
            SET nombre = @nombre,
                apellido = @apellido,
                correo = @correo,
                contrasena = @contrasena,
                rol = @rol
            WHERE id_usuario = @id
        `);
    } else {
        await request.query(`
            UPDATE Usuarios
            SET nombre = @nombre,
                apellido = @apellido,
                correo = @correo,
                rol = @rol
            WHERE id_usuario = @id
        `);
    }
};

// Eliminar usuario
const eliminarUsuario = async (id) => {
    const pool = getPool();

    await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            DELETE FROM Usuarios
            WHERE id_usuario = @id
        `);
};

// Buscar usuario por correo (incluye contraseña, solo para login)
const obtenerUsuarioPorCorreo = async (correo) => {
    const pool = getPool();

    const resultado = await pool
        .request()
        .input("correo", sql.VarChar(100), correo)
        .query(`
            SELECT id_usuario, nombre, apellido, correo, contrasena, rol
            FROM Usuarios
            WHERE correo = @correo
        `);

    return resultado.recordset[0];
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    obtenerUsuarioPorCorreo
};