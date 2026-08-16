const { getPool, sql } = require("../config/db");

// Obtener todas las reservas (con nombre del cliente y datos del vehículo)
const obtenerReservas = async () => {
    const pool = getPool();

    const resultado = await pool.request().query(`
        SELECT
            r.id_reserva,
            r.id_cliente,
            r.id_vehiculo,
            u.nombre + ' ' + u.apellido AS cliente,
            v.marca + ' ' + v.modelo AS vehiculo,
            v.placa,
            v.precio_dia,
            r.fecha_inicio,
            r.fecha_fin,
            r.total,
            r.estado
        FROM Reservas r
        JOIN Clientes c ON r.id_cliente = c.id_cliente
        JOIN Usuarios u ON c.id_usuario = u.id_usuario
        JOIN Vehiculos v ON r.id_vehiculo = v.id_vehiculo
        ORDER BY r.id_reserva DESC
    `);

    return resultado.recordset;
};

// Obtener una reserva por ID (con nombre del cliente y datos del vehículo)
const obtenerReservaPorId = async (id) => {
    const pool = getPool();

    const resultado = await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            SELECT
                r.id_reserva,
                r.id_cliente,
                r.id_vehiculo,
                u.nombre + ' ' + u.apellido AS cliente,
                v.marca + ' ' + v.modelo AS vehiculo,
                v.placa,
                v.precio_dia,
                r.fecha_inicio,
                r.fecha_fin,
                r.total,
                r.estado
            FROM Reservas r
            JOIN Clientes c ON r.id_cliente = c.id_cliente
            JOIN Usuarios u ON c.id_usuario = u.id_usuario
            JOIN Vehiculos v ON r.id_vehiculo = v.id_vehiculo
            WHERE r.id_reserva = @id
        `);

    return resultado.recordset[0];
};

// Lista simple de clientes (para el <select> del formulario)
const obtenerClientesParaSelect = async () => {
    const pool = getPool();

    const resultado = await pool.request().query(`
        SELECT c.id_cliente, u.nombre + ' ' + u.apellido AS nombre
        FROM Clientes c
        JOIN Usuarios u ON c.id_usuario = u.id_usuario
        ORDER BY u.nombre
    `);

    return resultado.recordset;
};

// Lista simple de vehículos disponibles (para el <select> del formulario)
const obtenerVehiculosParaSelect = async () => {
    const pool = getPool();

    const resultado = await pool.request().query(`
        SELECT id_vehiculo, marca, modelo, placa, precio_dia, estado
        FROM Vehiculos
        ORDER BY marca
    `);

    return resultado.recordset;
};

// Busca el id_cliente correspondiente a un id_usuario (para reservas hechas por el cliente logueado)
const obtenerIdClientePorUsuario = async (id_usuario) => {
    const pool = getPool();

    const resultado = await pool
        .request()
        .input("id_usuario", sql.Int, id_usuario)
        .query(`SELECT id_cliente FROM Clientes WHERE id_usuario = @id_usuario`);

    return resultado.recordset[0]?.id_cliente;
};

// Calcula el total según precio_dia del vehículo y los días de la reserva
const calcularTotal = async (id_vehiculo, fecha_inicio, fecha_fin) => {
    const pool = getPool();

    const resultado = await pool
        .request()
        .input("id_vehiculo", sql.Int, id_vehiculo)
        .query(`SELECT precio_dia FROM Vehiculos WHERE id_vehiculo = @id_vehiculo`);

    const vehiculo = resultado.recordset[0];
    if (!vehiculo) throw new Error("Vehículo no encontrado");

    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);
    const dias = Math.max(1, Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)));

    return dias * Number(vehiculo.precio_dia);
};

// Crear reserva
const crearReserva = async (reserva) => {
    const {
        id_cliente,
        id_vehiculo,
        fecha_inicio,
        fecha_fin,
        estado
    } = reserva;

    const pool = getPool();
    const total = await calcularTotal(id_vehiculo, fecha_inicio, fecha_fin);

    const resultado = await pool
        .request()
        .input("id_cliente", sql.Int, id_cliente)
        .input("id_vehiculo", sql.Int, id_vehiculo)
        .input("fecha_inicio", sql.Date, fecha_inicio)
        .input("fecha_fin", sql.Date, fecha_fin)
        .input("total", sql.Decimal(10, 2), total)
        .input("estado", sql.VarChar(50), estado)
        .query(`
            INSERT INTO Reservas
            (id_cliente, id_vehiculo, fecha_inicio, fecha_fin, total, estado)

            OUTPUT INSERTED.*

            VALUES
            (@id_cliente, @id_vehiculo, @fecha_inicio, @fecha_fin, @total, @estado)
        `);

    return resultado.recordset[0];
};

// Actualizar reserva
const actualizarReserva = async (id, reserva) => {
    const {
        id_cliente,
        id_vehiculo,
        fecha_inicio,
        fecha_fin,
        estado
    } = reserva;

    const pool = getPool();
    const total = await calcularTotal(id_vehiculo, fecha_inicio, fecha_fin);

    await pool
        .request()
        .input("id", sql.Int, id)
        .input("id_cliente", sql.Int, id_cliente)
        .input("id_vehiculo", sql.Int, id_vehiculo)
        .input("fecha_inicio", sql.Date, fecha_inicio)
        .input("fecha_fin", sql.Date, fecha_fin)
        .input("total", sql.Decimal(10, 2), total)
        .input("estado", sql.VarChar(50), estado)
        .query(`
            UPDATE Reservas
            SET
                id_cliente = @id_cliente,
                id_vehiculo = @id_vehiculo,
                fecha_inicio = @fecha_inicio,
                fecha_fin = @fecha_fin,
                total = @total,
                estado = @estado
            WHERE id_reserva = @id
        `);
};

// Eliminar reserva
const eliminarReserva = async (id) => {
    const pool = getPool();

    await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            DELETE FROM Reservas
            WHERE id_reserva = @id
        `);
};

module.exports = {
    obtenerReservas,
    obtenerReservaPorId,
    obtenerClientesParaSelect,
    obtenerVehiculosParaSelect,
    obtenerIdClientePorUsuario,
    crearReserva,
    actualizarReserva,
    eliminarReserva
};