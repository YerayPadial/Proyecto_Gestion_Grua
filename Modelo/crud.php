<?php
require_once 'auth.php';
gruas_require_login(true);
include_once 'conexion.php'; // Incluye el archivo de conexión a la base de datos
$objeto = new Conexion(); // Crea una nueva instancia de la clase Conexion
$conexion = $objeto->Conectar(); // Establece la conexión a la base de datos

$_POST = json_decode(file_get_contents("php://input"), true); // Decodifica el JSON recibido en el cuerpo de la solicitud HTTP y lo convierte en un array asociativo de PHP
$opcion = (isset($_POST['opcion'])) ? $_POST['opcion'] : ''; // Obtiene el valor de 'opcion' del array $_POST, si no está definido, asigna una cadena vacía
$id = (isset($_POST['id'])) ? $_POST['id'] : ''; // Obtiene el valor de 'id' del array $_POST, si no está definido, asigna una cadena vacía
$fechaentrada = (isset($_POST['fechaentrada'])) ? $_POST['fechaentrada'] : ''; // Obtiene el valor de 'fechaentrada' del array $_POST, si no está definido, asigna una cadena vacía
$fechasalida = (isset($_POST['fechasalida'])) ? $_POST['fechasalida'] : ''; // Obtiene el valor de 'fechasalida' del array $_POST, si no está definido, asigna una cadena vacía
$lugar = (isset($_POST['lugar'])) ? $_POST['lugar'] : ''; // Obtiene el valor de 'lugar' del array $_POST, si no está definido, asigna una cadena vacía
$direccion = (isset($_POST['direccion'])) ? $_POST['direccion'] : ''; // Obtiene el valor de 'direccion' del array $_POST, si no está definido, asigna una cadena vacía
$agente = (isset($_POST['agente'])) ? $_POST['agente'] : ''; // Obtiene el valor de 'agente' del array $_POST, si no está definido, asigna una cadena vacía
$matricula = (isset($_POST['matricula'])) ? $_POST['matricula'] : ''; // Obtiene el valor de 'matricula' del array $_POST, si no está definido, asigna una cadena vacía
$marca = (isset($_POST['marca'])) ? $_POST['marca'] : ''; // Obtiene el valor de 'marca' del array $_POST, si no está definido, asigna una cadena vacía
$modelo = (isset($_POST['modelo'])) ? $_POST['modelo'] : ''; // Obtiene el valor de 'modelo' del array $_POST, si no está definido, asigna una cadena vacía
$color = (isset($_POST['color'])) ? $_POST['color'] : ''; // Obtiene el valor de 'color' del array $_POST, si no está definido, asigna una cadena vacía
$motivo = (isset($_POST['motivo'])) ? $_POST['motivo'] : ''; // Obtiene el valor de 'motivo' del array $_POST, si no está definido, asigna una cadena vacía
$tipovehiculo = (isset($_POST['tipovehiculo'])) ? $_POST['tipovehiculo'] : ''; // Obtiene el valor de 'tipovehiculo' del array $_POST, si no está definido, asigna una cadena vacía
$grua = (isset($_POST['grua'])) ? $_POST['grua'] : ''; // Obtiene el valor de 'grua' del array $_POST, si no está definido, asigna una cadena vacía
$estado = (isset($_POST['estado'])) ? $_POST['estado'] : ''; // Obtiene el valor de 'estado' del array $_POST, si no está definido, asigna una cadena vacía
$idvehiculos = (isset($_POST['idvehiculos'])) ? $_POST['idvehiculos'] : '';
$nombre = (isset($_POST['nombre'])) ? $_POST['nombre'] : '';
$nif = (isset($_POST['nif'])) ? $_POST['nif'] : '';
$domicilio = (isset($_POST['domicilio'])) ? $_POST['domicilio'] : '';
$poblacion = (isset($_POST['poblacion'])) ? $_POST['poblacion'] : '';
$provincia = (isset($_POST['provincia'])) ? $_POST['provincia'] : '';
$permiso = (isset($_POST['permiso'])) ? $_POST['permiso'] : '';
$fecha = (isset($_POST['fecha'])) ? $_POST['fecha'] : '';
$importeretirada = (isset($_POST['importeretirada'])) ? $_POST['importeretirada'] : '';
$importedeposito = (isset($_POST['importedeposito'])) ? $_POST['importedeposito'] : '';
$total = (isset($_POST['total'])) ? $_POST['total'] : '';
$opcionespago = (isset($_POST['opcionespago'])) ? $_POST['opcionespago'] : '';
$data = [];

switch ($opcion) { // Evalúa la variable $opcion para determinar qué operación realizar
    case 1: // Opción 1: Insertar un nuevo registro en la tabla 'vehiculos'
        $consulta = "INSERT INTO vehiculos (id, fechaentrada, fechasalida, lugar, direccion, agente, matricula, marca, modelo, color, motivo, tipovehiculo, grua, estado) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $resultado = $conexion->prepare($consulta); // Prepara la consulta SQL
        $resultado->bind_param("ssssssssssssss", $id, $fechaentrada, $fechasalida, $lugar, $direccion, $agente, $matricula, $marca, $modelo, $color, $motivo, $tipovehiculo, $grua, $estado);
        $resultado->execute(); // Ejecuta la consulta
        $data = ['status' => 'success'];
        break;
    case 2: // Opción 2: Actualizar un registro existente en la tabla 'vehiculos'
        $consulta = "UPDATE vehiculos SET fechaentrada=?, fechasalida=?, lugar=?, direccion=?, agente=?, matricula=?, marca=?, modelo=?, color=?, motivo=?, tipovehiculo=?, grua=?, estado=? WHERE id=?";
        $resultado = $conexion->prepare($consulta); // Prepara la consulta SQL
        $resultado->bind_param("ssssssssssssss", $fechaentrada, $fechasalida, $lugar, $direccion, $agente, $matricula, $marca, $modelo, $color, $motivo, $tipovehiculo, $grua, $estado, $id);
        $resultado->execute(); // Ejecuta la consulta
        $data = ['status' => 'success'];
        break;
    case 3: // Opción 3: Eliminar un registro de la tabla 'vehiculos'
        $consulta = "DELETE FROM vehiculos WHERE id=?";
        $resultado = $conexion->prepare($consulta); // Prepara la consulta SQL
        $resultado->bind_param("s", $id);
        $resultado->execute(); // Ejecuta la consulta
        $data = ['status' => 'success'];
        break;
    case 4: // Opción 4: Seleccionar todos los registros de la tabla 'vehiculos'
        $consulta = "SELECT id, fechaentrada, fechasalida, lugar, direccion, agente, matricula, marca, modelo, color, motivo, tipovehiculo, grua, estado FROM vehiculos";
        $resultado = $conexion->prepare($consulta); // Prepara la consulta SQL
        $resultado->execute(); // Ejecuta la consulta
        $data = $resultado->get_result()->fetch_all(MYSQLI_ASSOC); // Obtiene todos los resultados de la consulta en un array asociativo
        break;
    case 5: // Nueva opción para insertar una retirada
        $conexion->begin_transaction();
        try {
            $consulta = "INSERT INTO retiradas (idvehiculos, nombre, nif, domicilio, poblacion, provincia, permiso, fecha, agente, importeretirada, importedeposito, total, opcionespago) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $resultado = $conexion->prepare($consulta);
            $resultado->bind_param("sssssssssddds", $idvehiculos, $nombre, $nif, $domicilio, $poblacion, $provincia, $permiso, $fecha, $agente, $importeretirada, $importedeposito, $total, $opcionespago);
            $resultado->execute();

            $consulta = "UPDATE vehiculos SET estado='Liquidado' WHERE id=?";
            $resultado = $conexion->prepare($consulta);
            $resultado->bind_param("s", $idvehiculos);
            $resultado->execute();

            $conexion->commit();
            $data = ['status' => 'success'];
        } catch (Throwable $e) {
            $conexion->rollback();
            http_response_code(500);
            $data = ['status' => 'error', 'message' => 'No se pudo guardar la retirada'];
        }
        break;
    case 6: // Opción 6: Seleccionar todos los registros de la tabla 'retiradas'
        gruas_require_login(true, true);
        $consulta = "SELECT idvehiculos, nombre, nif, domicilio, poblacion, provincia, permiso, fecha, agente, importeretirada, importedeposito, total, opcionespago FROM retiradas";
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();
        $data = $resultado->get_result()->fetch_all(MYSQLI_ASSOC);
        break;
}
print json_encode($data, JSON_UNESCAPED_UNICODE); // Codifica el array $data en formato JSON y lo imprime
$conexion = NULL; // Cierra la conexión a la base de datos
