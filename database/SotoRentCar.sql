IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SotoRentCar')
BEGIN
    CREATE DATABASE SotoRentCar;
END
GO

USE SotoRentCar;
GO

CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL
);

CREATE TABLE Clientes(
    id_cliente INT PRIMARY KEY IDENTITY(1,1),
    id_usuario INT NOT NULL,
    telefono VARCHAR(20),
    licencia VARCHAR(50),
    direccion VARCHAR(200),
    CONSTRAINT FK_Cliente_Usuario
    FOREIGN KEY(id_usuario)
    REFERENCES Usuarios(id_usuario)
);

CREATE TABLE Vehiculos(
    id_vehiculo INT PRIMARY KEY IDENTITY(1,1),
    marca VARCHAR(50),
    modelo VARCHAR(50),
    anio INT,
    color VARCHAR(30),
    categoria VARCHAR(30),
    placa VARCHAR(20),
    precio_dia DECIMAL(10,2),
    estado VARCHAR(20)
);

CREATE TABLE Reservas(
    id_reserva INT PRIMARY KEY IDENTITY(1,1),
    id_cliente INT NOT NULL,
    id_vehiculo INT NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    total DECIMAL(10,2),
    estado VARCHAR(20),
    CONSTRAINT FK_Reserva_Cliente
    FOREIGN KEY(id_cliente)
    REFERENCES Clientes(id_cliente),
    CONSTRAINT FK_Reserva_Vehiculo
    FOREIGN KEY(id_vehiculo)
    REFERENCES Vehiculos(id_vehiculo)
);

CREATE TABLE Pagos(
    id_pago INT PRIMARY KEY IDENTITY(1,1),
    id_reserva INT NOT NULL,
    monto DECIMAL(10,2),
    metodo_pago VARCHAR(30),
    fecha_pago DATE,
    estado VARCHAR(20),
    CONSTRAINT FK_Pago_Reserva
    FOREIGN KEY(id_reserva)
    REFERENCES Reservas(id_reserva)
);

CREATE TABLE Mantenimientos(
    id_mantenimiento INT PRIMARY KEY IDENTITY(1,1),
    id_vehiculo INT NOT NULL,
    fecha_mantenimiento DATE,
    descripcion VARCHAR(255),
    costo DECIMAL(10,2),
    estado VARCHAR(20),

    CONSTRAINT FK_Mantenimiento_Vehiculo
    FOREIGN KEY(id_vehiculo)
    REFERENCES Vehiculos(id_vehiculo)
);

CREATE TABLE Facturas(
    id_factura INT PRIMARY KEY IDENTITY(1,1),
    id_reserva INT NOT NULL,
    fecha_factura DATE,
    subtotal DECIMAL(10,2),
    impuesto DECIMAL(10,2),
    total DECIMAL(10,2),

    CONSTRAINT FK_Factura_Reserva
    FOREIGN KEY(id_reserva)
    REFERENCES Reservas(id_reserva)
);