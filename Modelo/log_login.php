<?php
require_once 'auth.php';
gruas_start_session();
// Habilitar el reporte de errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Verificar si la sesión está activa
if (!isset($_SESSION['currentUser']) || (time() - $_SESSION['last_activity']) > 1800) {
    // Si la sesión no está activa o ha expirado, destruir la sesión y salir
    session_unset();
    session_destroy();
    echo json_encode(['status' => 'error', 'message' => 'Sesión expirada o no válida']);
    exit();
}

// Actualizar el tiempo de la última actividad
$_SESSION['last_activity'] = time();

// Incluir el archivo de conexión a la base de datos
include 'conexion.php';

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recibir los datos enviados por JavaScript
    $data = json_decode(file_get_contents('php://input'), true);

    // Verificar si los datos JSON son válidos
    if ($data === null || !isset($data['usuario']) || !isset($data['action'])) {
        echo json_encode(['status' => 'error', 'message' => 'Datos JSON inválidos o faltantes']);
        exit();
    }

    $usuario = $data['usuario'];
    $action = $data['action'];

    // Obtener la fecha y hora actual
    $login_time = date('Y-m-d H:i:s');

    // Crear una instancia de la clase Conexion y obtener la conexión
    $conexion = new Conexion();
    $conn = $conexion->Conectar();

    // Preparar la consulta SQL para insertar el log
    $stmt = $conn->prepare("INSERT INTO user_logs (username, login_time, action) VALUES (?, ?, ?)");
    if ($stmt === false) {
        echo json_encode(['status' => 'error', 'message' => 'Error al preparar la consulta: ' . $conn->error]);
        exit();
    }

    $stmt->bind_param("sss", $usuario, $login_time, $action);

    // Ejecutar la consulta
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Log insertado correctamente']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al insertar el log: ' . $stmt->error]);
    }

    // Cerrar la conexión
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método de solicitud no permitido']);
}
?>
