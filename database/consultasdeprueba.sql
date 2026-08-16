/*Consulta para ver reservas de vehiuculos*/
USE SotoRentCar;
GO

SELECT 
    r.id_reserva,
    u.nombre + ' ' + u.apellido AS cliente,
    v.marca + ' ' + v.modelo AS vehiculo,
    v.placa,
    r.fecha_inicio,
    r.fecha_fin,
    'RD$' + FORMAT(r.total, 'N2') AS total,
    r.estado
FROM Reservas r
JOIN Clientes c ON r.id_cliente = c.id_cliente
JOIN Usuarios u ON c.id_usuario = u.id_usuario
JOIN Vehiculos v ON r.id_vehiculo = v.id_vehiculo
ORDER BY r.id_reserva;

/*Factura con los montos actualizados*/
USE SotoRentCar;
GO

SELECT 
    f.id_factura,
    u.nombre + ' ' + u.apellido AS cliente,
    v.marca + ' ' + v.modelo AS vehiculo,
    f.fecha_factura,
    'RD$' + FORMAT(f.subtotal, 'N2') AS subtotal,
    'RD$' + FORMAT(f.impuesto, 'N2') AS itbis,
    'RD$' + FORMAT(f.total, 'N2') AS total
FROM Facturas f
JOIN Reservas r ON f.id_reserva = r.id_reserva
JOIN Clientes c ON r.id_cliente = c.id_cliente
JOIN Usuarios u ON c.id_usuario = u.id_usuario
JOIN Vehiculos v ON r.id_vehiculo = v.id_vehiculo
ORDER BY f.id_factura;

/*Ingresos por vehiculos*/
SELECT 
    v.marca + ' ' + v.modelo AS vehiculo,
    v.placa,
    COUNT(r.id_reserva) AS veces_alquilado,
    'RD$' + FORMAT(SUM(r.total), 'N2') AS ingresos_totales
FROM Vehiculos v
JOIN Reservas r ON v.id_vehiculo = r.id_vehiculo
GROUP BY v.marca, v.modelo, v.placa
ORDER BY SUM(r.total) DESC;

