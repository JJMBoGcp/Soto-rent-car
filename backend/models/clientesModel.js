const { getPool, sql } = require("../config/db");
const bcrypt = require("bcrypt");

// Obtener todos los clientes (con datos del usuario)
const obtenerClientes = async () => {
    const pool = getPool();

    const resultado = await pool.request().query(`
        SELECT
            c.id_cliente,
            c.id_usuario,
            u.nombre,
            u.apellido,
            u.correo,
            c.telefono,
            c.direccion,
            c.licencia
        FROM Clientes c
        JOIN Usuarios u ON c.id_usuario = u.id_usuario
        ORDER BY c.id_cliente
    `);

    return resultado.recordset;
};

// Obtener un cliente por ID (con datos del usuario)
const obtenerClientePorId = async (id) => {
    const pool = getPool();

    const resultado = await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            SELECT
                c.id_cliente,
                c.id_usuario,
                u.nombre,
                u.apellido,
                u.correo,
                c.telefono,
                c.direccion,
                c.licencia
            FROM Clientes c
            JOIN Usuarios u ON c.id_usuario = u.id_usuario
            WHERE c.id_cliente = @id
        `);

    return resultado.recordset[0];
};

// Crear cliente (crea el Usuario y luego el Cliente)
const crearCliente = async (cliente) => {
    const {
        nombre,
        apellido,
        correo,
        contrasena,
        telefono,
        direccion,
        licencia,
    } = cliente;

    const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

    const pool = getPool();

    // 1. Crear el usuario primero
    const resultadoUsuario = await pool
        .request()
        .input("nombre", sql.VarChar(100), nombre)
        .input("apellido", sql.VarChar(100), apellido)
        .input("correo", sql.VarChar(100), correo)
        .input("contrasena", sql.VarChar(255), contrasenaHasheada)
        .input("rol", sql.VarChar(20), "cliente")
        .query(`
            INSERT INTO Usuarios
            (nombre, apellido, correo, contrasena, rol)

            OUTPUT INSERTED.id_usuario

            VALUES
            (@nombre, @apellido, @correo, @contrasena, @rol)
        `);

    const id_usuario = resultadoUsuario.recordset[0].id_usuario;

    // 2. Crear el cliente con ese id_usuario
    const resultadoCliente = await pool
        .request()
        .input("id_usuario", sql.Int, id_usuario)
        .input("telefono", sql.VarChar(20), telefono)
        .input("direccion", sql.VarChar(255), direccion)
        .input("licencia", sql.VarChar(50), licencia)
        .query(`
            INSERT INTO Clientes
            (id_usuario, telefono, direccion, licencia)

            OUTPUT INSERTED.*

            VALUES
            (@id_usuario, @telefono, @direccion, @licencia)
        `);

    return resultadoCliente.recordset[0];
};

// Actualizar cliente (actualiza Usuario y Cliente)
const actualizarCliente = async (id, cliente) => {
    const {
        nombre,
        apellido,
        correo,
        contrasena,
        telefono,
        direccion,
        licencia,
    } = cliente;

    const pool = getPool();

    // Primero necesitamos el id_usuario real de este cliente
    const clienteActual = await obtenerClientePorId(id);

    if (!clienteActual) {
        throw new Error("Cliente no encontrado");
    }

    const id_usuario = clienteActual.id_usuario;

    // 1. Actualizar el usuario (contraseña solo si se envió una nueva)
    const requestUsuario = pool
        .request()
        .input("id_usuario", sql.Int, id_usuario)
        .input("nombre", sql.VarChar(100), nombre)
        .input("apellido", sql.VarChar(100), apellido)
        .input("correo", sql.VarChar(100), correo);

    if (contrasena) {
        const contrasenaHasheada = await bcrypt.hash(contrasena, 10);
        requestUsuario.input("contrasena", sql.VarChar(255), contrasenaHasheada);
        await requestUsuario.query(`
            UPDATE Usuarios
            SET nombre = @nombre,
                apellido = @apellido,
                correo = @correo,
                contrasena = @contrasena
            WHERE id_usuario = @id_usuario
        `);
    } else {
        await requestUsuario.query(`
            UPDATE Usuarios
            SET nombre = @nombre,
                apellido = @apellido,
                correo = @correo
            WHERE id_usuario = @id_usuario
        `);
    }

    // 2. Actualizar el cliente
    await pool
        .request()
        .input("id", sql.Int, id)
        .input("telefono", sql.VarChar(20), telefono)
        .input("direccion", sql.VarChar(255), direccion)
        .input("licencia", sql.VarChar(50), licencia)
        .query(`
            UPDATE Clientes
            SET
                telefono = @telefono,
                direccion = @direccion,
                licencia = @licencia
            WHERE id_cliente = @id
        `);
};

// Eliminar cliente (elimina Cliente y su Usuario asociado)
const eliminarCliente = async (id) => {
    const pool = getPool();

    const clienteActual = await obtenerClientePorId(id);

    if (!clienteActual) {
        throw new Error("Cliente no encontrado");
    }

    // 1. Eliminar el cliente primero (por la FK)
    await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            DELETE FROM Clientes
            WHERE id_cliente = @id
        `);

    // 2. Eliminar el usuario asociado
    await pool
        .request()
        .input("id_usuario", sql.Int, clienteActual.id_usuario)
        .query(`
            DELETE FROM Usuarios
            WHERE id_usuario = @id_usuario
        `);
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};