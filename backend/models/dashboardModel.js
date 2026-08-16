const { getPool, sql } = require("../config/db");

// Resumen general (para las 5 tarjetas)
const obtenerResumen = async () => {
    const pool = getPool();

    const resultado = await pool.request().query(`
        SELECT
            (SELECT COUNT(*) FROM Usuarios) AS total_usuarios,
            (SELECT COUNT(*) FROM Clientes) AS total_clientes,
            (SELECT COUNT(*) FROM Vehiculos) AS total_vehiculos,
            (SELECT COUNT(*) FROM Reservas) AS total_reservas,
            (SELECT COUNT(*) FROM Pagos) AS total_pagos
    `);

    return resultado.recordset[0];
};

// Últimas 5 reservas (con nombre de cliente y vehículo)
const obtenerReservasRecientes = async () => {
    const pool = getPool();

    const resultado = await pool.request().query(`
        SELECT TOP 5
            r.id_reserva,
            u.nombre + ' ' + u.apellido AS cliente,
            v.marca + ' ' + v.modelo AS vehiculo,
            r.fecha_inicio,
            r.fecha_fin,
            r.estado
        FROM Reservas r
        JOIN Clientes c ON r.id_cliente = c.id_cliente
        JOIN Usuarios u ON c.id_usuario = u.id_usuario
        JOIN Vehiculos v ON r.id_vehiculo = v.id_vehiculo
        ORDER BY r.id_reserva DESC
    `);

    return resultado.recordset;
};

module.exports = {
    obtenerResumen,
    obtenerReservasRecientes
};