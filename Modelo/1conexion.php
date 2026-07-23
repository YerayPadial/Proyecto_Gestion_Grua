<?php
class Conexion {
    private $servername;
    private $username;
    private $password;
    private $dbname;
    private $conn;

    public function __construct() {
        $config = $this->loadConfig();

        $this->servername = $this->cleanValue($config['DB_HOST'] ?? 'localhost');
        $this->username = $this->cleanValue($config['DB_USER'] ?? '');
        $this->password = $this->cleanValue($config['DB_PASS'] ?? '');
        $this->dbname = $this->cleanValue($config['DB_NAME'] ?? '');
    }

    private function loadConfig() {
        $paths = array_filter([
            getenv('GRUAS_ENV_PATH') ?: null,
            dirname(__DIR__, 6) . '/.gruas.env',
            __DIR__ . '/../.env',
        ]);

        foreach ($paths as $path) {
            if (is_readable($path)) {
                return parse_ini_file($path, false, INI_SCANNER_RAW) ?: [];
            }
        }

        return [];
    }

    private function cleanValue($value) {
        return trim($value, " \t\n\r\0\x0B\"'");
    }

    public function Conectar() {
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);

        if ($this->conn->connect_error) {
            die("Conexión fallida: " . $this->conn->connect_error);
        }

        $this->conn->set_charset("utf8"); // Establece el conjunto de caracteres a UTF-8

        return $this->conn;
    }
}
?>
