const { getPool, sql } = require("../config/db");

// Obtener todos los pagos (con datos de cliente, vehículo y reserva)
const obtenerPagos = async () => {
    const pool = getPool();

    const resultado = await pool.request().query(`
        SELECT
            p.id_pago,
            p.id_reserva,
            u.nombre + ' ' + u.apellido AS cliente,
            v.marca + ' ' + v.modelo AS vehiculo,
            v.placa,
            r.total AS total_reserva,
            p.monto,
            p.fecha_pago,
            p.metodo_pago,
            p.estado
        FROM Pagos p
        JOIN Reservas r ON p.id_reserva = r.id_reserva
        JOIN Clientes c ON r.id_cliente = c.id_cliente
        JOIN Usuarios u ON c.id_usuario = u.id_usuario
        JOIN Vehiculos v ON r.id_vehiculo = v.id_vehiculo
        ORDER BY p.id_pago DESC
    `);

    return resultado.recordset;
};

// Obtener un pago por ID (con datos de cliente, vehículo y reserva)
const obtenerPagoPorId = async (id) => {
    const pool = getPool();

    const resultado = await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            SELECT
                p.id_pago,
                p.id_reserva,
                u.nombre + ' ' + u.apellido AS cliente,
                v.marca + ' ' + v.modelo AS vehiculo,
                v.placa,
                r.total AS total_reserva,
                p.monto,
                p.fecha_pago,
                p.metodo_pago,
                p.estado
            FROM Pagos p
            JOIN Reservas r ON p.id_reserva = r.id_reserva
            JOIN Clientes c ON r.id_cliente = c.id_cliente
            JOIN Usuarios u ON c.id_usuario = u.id_usuario
            JOIN Vehiculos v ON r.id_vehiculo = v.id_vehiculo
            WHERE p.id_pago = @id
        `);

    return resultado.recordset[0];
};

// Lista simple de reservas (para el <select> del formulario)
const obtenerReservasParaSelect = async () => {
    const pool = getPool();

    const resultado = await pool.request().query(`
        SELECT
            r.id_reserva,
            u.nombre + ' ' + u.apellido AS cliente,
            v.marca + ' ' + v.modelo AS vehiculo,
            v.placa,
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

// Crear pago
const crearPago = async (pago) => {
    const {
        id_reserva,
        monto,
        fecha_pago,
        metodo_pago,
        estado
    } = pago;

    const pool = getPool();

    const resultado = await pool
        .request()
        .input("id_reserva", sql.Int, id_reserva)
        .input("monto", sql.Decimal(10, 2), monto)
        .input("fecha_pago", sql.Date, fecha_pago)
        .input("metodo_pago", sql.VarChar(50), metodo_pago)
        .input("estado", sql.VarChar(50), estado)
        .query(`
            INSERT INTO Pagos
            (id_reserva, monto, fecha_pago, metodo_pago, estado)

            OUTPUT INSERTED.*

            VALUES
            (@id_reserva, @monto, @fecha_pago, @metodo_pago, @estado)
        `);

    return resultado.recordset[0];
};

// Actualizar pago
const actualizarPago = async (id, pago) => {
    const {
        id_reserva,
        monto,
        fecha_pago,
        metodo_pago,
        estado
    } = pago;

    const pool = getPool();

    await pool
        .request()
        .input("id", sql.Int, id)
        .input("id_reserva", sql.Int, id_reserva)
        .input("monto", sql.Decimal(10, 2), monto)
        .input("fecha_pago", sql.Date, fecha_pago)
        .input("metodo_pago", sql.VarChar(50), metodo_pago)
        .input("estado", sql.VarChar(50), estado)
        .query(`
            UPDATE Pagos
            SET
                id_reserva = @id_reserva,
                monto = @monto,
                fecha_pago = @fecha_pago,
                metodo_pago = @metodo_pago,
                estado = @estado
            WHERE id_pago = @id
        `);
};

// Eliminar pago
const eliminarPago = async (id) => {
    const pool = getPool();

    await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            DELETE FROM Pagos
            WHERE id_pago = @id
        `);
};

module.exports = {
    obtenerPagos,
    obtenerPagoPorId,
    obtenerReservasParaSelect,
    crearPago,
    actualizarPago,
    eliminarPago
};