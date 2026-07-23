-- Drop the existing table
DROP TABLE IF EXISTS users;

-- Create the table usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

-- Users must be created by the application so passwords are stored with password_hash().


DROP TABLE IF EXISTS user_logs;

CREATE TABLE IF NOT EXISTS user_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    login_time DATETIME NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username)
);
ALTER TABLE user_logs ADD COLUMN action VARCHAR(255) NOT NULL;

-- Create the table para los vehiculos
 CREATE TABLE `vehiculos` (
  `id` varchar(10) NOT NULL DEFAULT '',
  `fechaentrada` datetime NOT NULL,
  `fechasalida` datetime NOT NULL,
  `lugar` varchar(100) NOT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `agente` varchar(20) NOT NULL,
  `matricula` varchar(10) NOT NULL,
  `marca` varchar(100) NOT NULL,
  `modelo` varchar(50) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `motivo` varchar(200) NOT NULL DEFAULT '',
  `tipovehiculo` varchar(100) NOT NULL DEFAULT '',
  `grua` varchar(50) NOT NULL,
  `estado` varchar(20) DEFAULT 'En depósito'
) ENGINE=MyISAM DEFAULT CHARSET=ucs2;

-- Create the table para los datos de las retiradas
CREATE TABLE `retiradas` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `idvehiculos` varchar(10) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `nif` varchar(15) DEFAULT NULL,
  `domicilio` varchar(150) DEFAULT NULL,
  `poblacion` varchar(50) DEFAULT NULL,
  `provincia` varchar(50) DEFAULT NULL,
  `permiso` varchar(20) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `agente` varchar(20) DEFAULT NULL,
  `importeretirada` float DEFAULT NULL,
  `importedeposito` float DEFAULT NULL,
  `total` float DEFAULT NULL,
  `opcionespago` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;




-- Insert some example vehiculos
INSERT INTO vehiculos (id, fechaentrada, fechasalida, lugar, direccion, agente, matricula, marca, modelo, color, motivo, tipovehiculo, grua, estado) 
VALUES 
('V001', '2025-02-01 08:00:00', '2025-02-01 18:00:00', 'Parking Lot A', '123 Main St', 'Agent1', 'ABC123', 'Toyota', 'Corolla', 'Red', 'Parking Violation', 'Sedan', 'TowTruck1', 'En depósito'),
('V002', '2025-02-02 09:00:00', '2025-02-02 19:00:00', 'Parking Lot B', '456 Elm St', 'Agent2', 'DEF456', 'Honda', 'Civic', 'Blue', 'Expired Registration', 'Sedan', 'TowTruck2', 'En depósito'),
('V003', '2025-02-03 10:00:00', '2025-02-03 20:00:00', 'Parking Lot C', '789 Oak St', 'Agent3', 'GHI789', 'Ford', 'Focus', 'Green', 'Illegal Parking', 'Hatchback', 'TowTruck3', 'En depósito');
INSERT INTO `vehiculos` (`id`, `fechaentrada`, `fechasalida`, `lugar`, `direccion`, `agente`, `matricula`, `marca`, `modelo`, `color`, `motivo`, `tipovehiculo`, `grua`, `estado`) VALUES
('V006', '2023-10-06 07:45:00', '2023-10-06 15:45:00', 'Aeropuerto Internacional', 'Avenida Aeropuerto 789', 'Agente006', 'MNO345', 'Hyundai', 'Elantra', 'Plateado', 'Estacionamiento en zona restringida', 'Sedán', 'Grúa006', 'En depósito'),
('V007', '2023-10-07 08:30:00', '2023-10-07 16:30:00', 'Centro Histórico', 'Calle Historia 101', 'Agente007', 'PQR678', 'Kia', 'Rio', 'Blanco', 'Obstrucción de paso peatonal', 'Hatchback', 'Grúa007', 'Retirado'),
('V008', '2023-10-08 09:15:00', '2023-10-08 17:15:00', 'Zona Residencial', 'Calle Residencia 202', 'Agente008', 'STU901', 'Honda', 'Civic', 'Negro', 'Estacionamiento prolongado', 'Sedán', 'Grúa008', 'En depósito'),
('V009', '2023-10-09 10:00:00', '2023-10-09 18:00:00', 'Plaza del Sol', 'Avenida Sol 303', 'Agente009', 'VWX234', 'Mazda', '3', 'Rojo', 'Accidente leve', 'Hatchback', 'Grúa009', 'En depósito'),
('V010', '2023-10-10 11:45:00', '2023-10-10 19:45:00', 'Parque de los Niños', 'Calle Niños 404', 'Agente010', 'YZA567', 'Subaru', 'Impreza', 'Azul', 'Estacionamiento en zona escolar', 'Sedán', 'Grúa010', 'Retirado'),
('V011', '2023-10-11 12:30:00', '2023-10-11 20:30:00', 'Zona Comercial', 'Avenida Comercio 505', 'Agente011', 'BCD890', 'Peugeot', '208', 'Gris', 'Obstrucción de entrada comercial', 'Hatchback', 'Grúa011', 'En depósito'),
('V012', '2023-10-12 13:15:00', '2023-10-12 21:15:00', 'Estación de Tren', 'Calle Tren 606', 'Agente012', 'EFG123', 'Renault', 'Clio', 'Blanco', 'Estacionamiento en zona de carga', 'Hatchback', 'Grúa012', 'Retirado'),
('V013', '2023-10-13 14:00:00', '2023-10-13 22:00:00', 'Centro Deportivo', 'Avenida Deporte 707', 'Agente013', 'HIJ456', 'Fiat', 'Tipo', 'Negro', 'Estacionamiento en área deportiva', 'Sedán', 'Grúa013', 'En depósito'),
('V014', '2023-10-14 15:45:00', '2023-10-14 23:45:00', 'Zona Hospitalaria', 'Calle Hospital 808', 'Agente014', 'KLM789', 'Volvo', 'S60', 'Plateado', 'Obstrucción de ambulancia', 'Sedán', 'Grúa014', 'Retirado'),
('V015', '2023-10-15 16:30:00', '2023-10-16 00:30:00', 'Plaza de la Cultura', 'Avenida Cultura 909', 'Agente015', 'NOP012', 'BMW', 'Serie 3', 'Azul', 'Estacionamiento en zona cultural', 'Sedán', 'Grúa015', 'En depósito');


-- Insert some example retiradas
INSERT INTO retiradas (idvehiculos, nombre, nif, domicilio, poblacion, provincia, permiso, fecha, agente, importeretirada, importedeposito, total, opcionespago) 
VALUES 
('V001', 'John Doe', '12345678A', '123 Main St', 'CityA', 'ProvinceA', 'B123456', '2025-02-01 18:30:00', 'Agent1', 100.00, 50.00, 150.00, 'Credit Card'),
('V002', 'Jane Smith', '87654321B', '456 Elm St', 'CityB', 'ProvinceB', 'C654321', '2025-02-02 19:30:00', 'Agent2', 120.00, 60.00, 180.00, 'Cash'),
('V003', 'Alice Johnson', '11223344C', '789 Oak St', 'CityC', 'ProvinceC', 'D112233', '2025-02-03 20:30:00', 'Agent3', 110.00, 55.00, 165.00, 'Debit Card');
