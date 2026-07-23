<?php
require_once '../Modelo/auth.php';

gruas_start_session();
session_unset();
session_destroy();
setcookie('currentUser', '', time() - 3600, '/');

header('Content-Type: application/json; charset=utf-8');
echo json_encode(['success' => 1]);
?>
