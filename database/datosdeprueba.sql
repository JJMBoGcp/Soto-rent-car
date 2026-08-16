USE SotoRentCar;
GO

-- Usuarios (admin y clientes)
INSERT INTO Usuarios (nombre, apellido, correo, contrasena, rol) VALUES
('Juan', 'Soto', 'juan.soto@sotorentcar.com', 'hashpendiente123', 'admin'),
('Maria', 'Perez', 'maria.perez@gmail.com', 'hashpendiente123', 'cliente'),
('Carlos', 'Ramirez', 'carlos.ramirez@gmail.com', 'hashpendiente123', 'cliente'),
('Ana', 'Gomez', 'ana.gomez@gmail.com', 'hashpendiente123', 'cliente');

-- Clientes (vinculados a usuarios con rol 'cliente')
INSERT INTO Clientes (id_usuario, telefono, licencia, direccion) VALUES
(2, '809-555-1234', 'LIC-001-MP', 'Calle Principal #45, Santo Domingo'),
(3, '809-555-5678', 'LIC-002-CR', 'Av. Independencia #12, Santiago'),
(4, '809-555-9012', 'LIC-003-AG', 'Calle Duarte #78, Santo Domingo Oeste');

-- Vehiculos (precio_dia en RD$)
INSERT INTO Vehiculos (marca, modelo, anio, color, categoria, placa, precio_dia, estado) VALUES
('Toyota', 'Corolla', 2022, 'Blanco', 'Sedán', 'A123456', 2800.00, 'Disponible'),
('Honda', 'CR-V', 2023, 'Gris', 'SUV', 'B234567', 4200.00, 'Disponible'),
('Kia', 'Rio', 2021, 'Rojo', 'Económico', 'C345678', 2200.00, 'Alquilado'),
('Hyundai', 'Tucson', 2023, 'Negro', 'SUV', 'D456789', 3900.00, 'Disponible'),
('Nissan', 'Sentra', 2022, 'Azul', 'Sedán', 'E567890', 2600.00, 'Mantenimiento');

-- Reservas (total en RD$)
INSERT INTO Reservas (id_cliente, id_vehiculo, fecha_inicio, fecha_fin, total, estado) VALUES
(1, 1, '2026-08-01', '2026-08-05', 11200.00, 'Confirmada'),
(2, 3, '2026-07-28', '2026-08-02', 11000.00, 'Activa'),
(3, 2, '2026-08-10', '2026-08-15', 21000.00, 'Pendiente');

-- Pagos (monto en RD$)
INSERT INTO Pagos (id_reserva, monto, metodo_pago, fecha_pago, estado) VALUES
(1, 11200.00, 'Tarjeta', '2026-07-30', 'Completado'),
(2, 11000.00, 'Efectivo', '2026-07-28', 'Completado'),
(3, 6000.00, 'Transferencia', '2026-08-01', 'Parcial');

-- Mantenimientos (costo en RD$)
INSERT INTO Mantenimientos (id_vehiculo, fecha_mantenimiento, descripcion, costo, estado) VALUES
(5, '2026-07-25', 'Cambio de aceite y filtros', 5200.00, 'Completado'),
(3, '2026-07-20', 'Revisión de frenos', 7500.00, 'Completado');

-- Facturas (subtotal/impuesto/total en RD$, ITBIS 18%)
INSERT INTO Facturas (id_reserva, fecha_factura, subtotal, impuesto, total) VALUES
(1, '2026-08-05', 11200.00, 2016.00, 13216.00),
(2, '2026-08-02', 11000.00, 1980.00, 12980.00);