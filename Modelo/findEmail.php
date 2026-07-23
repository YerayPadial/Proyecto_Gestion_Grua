<?php
include("conexion.php");

$conexion = new Conexion();
$conn = $conexion->Conectar();

if ($conn->connect_error) {
    die(json_encode(array('success' => 0, 'message' => 'Database connection failed')));
}

if (isset($_POST['correo']) && !empty($_POST['correo'])) {
    $correo = $_POST['correo'];

    $query = "SELECT id FROM users WHERE email=?";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die(json_encode(array('success' => 0, 'message' => 'Failed to prepare statement')));
    }
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    echo json_encode(array('success' => 1, 'message' => 'Si el correo está registrado, el administrador podrá restablecer la contraseña.'));
} else {
    echo json_encode(array('success' => 0, 'message' => 'Invalid input'));
}
?>
