<?php
include("../Modelo/conexion.php");

$conexion = new Conexion();
$conn = $conexion->Conectar();

if ($conn->connect_error) {
    die(json_encode(array('success' => 0, 'message' => 'Database connection failed')));
}

if (isset($_POST['usuarioNew']) && !empty($_POST['usuarioNew']) && isset($_POST['passwordNew']) && !empty($_POST['passwordNew']) && isset($_POST['correoNew']) && !empty($_POST['correoNew'])) {
    $usuarioNew = $_POST['usuarioNew'];
    $passwordNew = password_hash($_POST['passwordNew'], PASSWORD_DEFAULT);
    $correoNew = $_POST['correoNew'];

    $query = "SELECT * FROM users WHERE username=?";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die(json_encode(array('success' => 0, 'message' => 'Failed to prepare statement')));
    }
    $stmt->bind_param("s", $usuarioNew);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(array('success' => 1, 'message' => 'Usuario ya existe'));
    } else {
        $insertQuery = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($insertQuery);
        if ($stmt === false) {
            die(json_encode(array('success' => 0, 'message' => 'Failed to prepare insert statement')));
        }
        $stmt->bind_param("sss", $usuarioNew, $passwordNew, $correoNew);
        if ($stmt->execute()) {
            echo json_encode(array('success' => 2, 'message' => 'Usuario creado exitosamente'));
        } else {
            echo json_encode(array('success' => 0, 'message' => 'Error al crear el usuario'));
        }
    }
} else {
    echo json_encode(array('success' => 0, 'message' => 'Invalid input'));
}
?>
