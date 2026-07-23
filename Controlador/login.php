<?php
require_once("../Modelo/auth.php");
include("../Modelo/conexion.php");

gruas_start_session();

$conexion = new Conexion();
$conn = $conexion->Conectar();

if ($conn->connect_error) {
    die(json_encode(array('success' => 0, 'message' => 'Database connection failed')));
}

if (isset($_POST['usuario']) && !empty($_POST['usuario']) && isset($_POST['password']) && !empty($_POST['password'])) {
    $usuario = $_POST['usuario'];
    $password = $_POST['password'];
    
    $query = "SELECT id, username, password, email FROM users WHERE username=? OR email=? LIMIT 1";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die(json_encode(array('success' => 0, 'message' => 'Failed to prepare statement')));
    }
    $stmt->bind_param("ss", $usuario, $usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $storedPassword = $user['password'];
        $validPassword = password_verify($password, $storedPassword);

        if (!$validPassword && empty(password_get_info($storedPassword)['algo']) && hash_equals($storedPassword, $password)) {
            $validPassword = true;
            $newHash = password_hash($password, PASSWORD_DEFAULT);
            $update = $conn->prepare("UPDATE users SET password=? WHERE id=?");
            if ($update !== false) {
                $update->bind_param("si", $newHash, $user['id']);
                $update->execute();
            }
        }

        if (!$validPassword) {
            echo json_encode(array('success' => 0, 'message' => 'Invalid username or password'));
            exit;
        }

        session_regenerate_id(true);
        $_SESSION['currentUser'] = $user['username'];
        $_SESSION['last_activity'] = time(); // Tiempo de la última actividad
        setcookie('currentUser', $user['username'], [
            'expires' => time() + 1800,
            'path' => '/',
            'secure' => !empty($_SERVER['HTTPS']),
            'httponly' => false,
            'samesite' => 'Lax',
        ]);
        echo json_encode(array('success' => 1, 'username' => $user['username']));
    } else {
        echo json_encode(array('success' => 0, 'message' => 'Invalid username or password'));
    }
} else {
    echo json_encode(array('success' => 0, 'message' => 'Invalid input'));
}
?>
