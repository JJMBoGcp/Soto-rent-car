const { getPool, sql } = require("../config/db");

// Obtener todos los vehículos
const obtenerVehiculos = async () => {
    const pool = getPool();

    const resultado = await pool.request().query(`
        SELECT * FROM Vehiculos
    `);

    return resultado.recordset;
};

// Obtener un vehículo por ID
const obtenerVehiculoPorId = async (id) => {
    const pool = getPool();

    const resultado = await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            SELECT *
            FROM Vehiculos
            WHERE id_vehiculo = @id
        `);

    return resultado.recordset[0];
};

// Crear vehículo
const crearVehiculo = async (vehiculo) => {
    const {
        marca,
        modelo,
        anio,
        color,
        categoria,
        placa,
        precio_dia,
        estado
    } = vehiculo;

    const pool = getPool();

    const resultado = await pool
        .request()
        .input("marca", sql.VarChar(100), marca)
        .input("modelo", sql.VarChar(100), modelo)
        .input("anio", sql.Int, anio)
        .input("color", sql.VarChar(50), color)
        .input("categoria", sql.VarChar(50), categoria)
        .input("placa", sql.VarChar(20), placa)
        .input("precio_dia", sql.Decimal(10, 2), precio_dia)
        .input("estado", sql.VarChar(50), estado)
        .query(`
            INSERT INTO Vehiculos
            (marca, modelo, anio, color, categoria, placa, precio_dia, estado)

            OUTPUT INSERTED.*

            VALUES
            (@marca, @modelo, @anio, @color, @categoria, @placa, @precio_dia, @estado)
        `);

    return resultado.recordset[0];
};

// Actualizar vehículo
const actualizarVehiculo = async (id, vehiculo) => {
    const {
        marca,
        modelo,
        anio,
        color,
        categoria,
        placa,
        precio_dia,
        estado
    } = vehiculo;

    const pool = getPool();

    await pool
        .request()
        .input("id", sql.Int, id)
        .input("marca", sql.VarChar(100), marca)
        .input("modelo", sql.VarChar(100), modelo)
        .input("anio", sql.Int, anio)
        .input("color", sql.VarChar(50), color)
        .input("categoria", sql.VarChar(50), categoria)
        .input("placa", sql.VarChar(20), placa)
        .input("precio_dia", sql.Decimal(10, 2), precio_dia)
        .input("estado", sql.VarChar(50), estado)
        .query(`
            UPDATE Vehiculos
            SET
                marca = @marca,
                modelo = @modelo,
                anio = @anio,
                color = @color,
                categoria = @categoria,
                placa = @placa,
                precio_dia = @precio_dia,
                estado = @estado
            WHERE id_vehiculo = @id
        `);
};

// Eliminar vehículo
const eliminarVehiculo = async (id) => {
    const pool = getPool();

    await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            DELETE FROM Vehiculos
            WHERE id_vehiculo = @id
        `);
};

module.exports = {
    obtenerVehiculos,
    obtenerVehiculoPorId,
    crearVehiculo,
    actualizarVehiculo,
    eliminarVehiculo
};