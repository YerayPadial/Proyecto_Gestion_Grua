<?php
function gruas_start_session() {
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => !empty($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();
}

function gruas_current_user() {
    gruas_start_session();

    if (!isset($_SESSION['currentUser'], $_SESSION['last_activity'])) {
        return null;
    }

    if ((time() - $_SESSION['last_activity']) > 1800) {
        session_unset();
        session_destroy();
        return null;
    }

    $_SESSION['last_activity'] = time();
    return $_SESSION['currentUser'];
}

function gruas_require_login($json = false, $adminOnly = false) {
    $user = gruas_current_user();
    $allowed = $user !== null && (!$adminOnly || $user === 'admin');

    if ($allowed) {
        return $user;
    }

    if ($json) {
        http_response_code($user === null ? 401 : 403);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['status' => 'error', 'message' => 'No autorizado'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    header('Location: ../index.html');
    exit;
}
?>
