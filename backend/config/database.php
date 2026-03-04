<?php
/**
 * Database Configuration
 * Compatible with both MongoDB  and MySQL 
 */

class Database {
    private static $instance = null;
    private $connection;
    private $db;
    
    // For Hostinger MySQL
<<<<<<< HEAD
    // private $mysql_host = 'localhost';
    // private $mysql_user = 'root';
    // private $mysql_pass = '';
    // private $mysql_db = 'telecarezone_db';
=======
    private $mysql_host = 'your_db_host';
    private $mysql_user = 'your_db_user';
    private $mysql_pass = 'your_db_password';
    private $mysql_db = 'your_db_name';
>>>>>>> d817e6ae58c7daac1551e467c2d4525bae4d8a03
    
    // For  MongoDB
    private $mongo_url = 'mongodb://localhost:27017';
    private $mongo_db = 'telecarezone_db';
    
    private function __construct() {
        $this->loadEnvironmentVariables();
        // Auto-detect database type
        // Use MySQL by default now (migration complete)
        if (getenv('DB_TYPE') === 'mongodb') {
            // MongoDB (only if explicitly set)
            $this->connectMongoDB();
        } else {
            // MySQL (default)
            $this->connectMySQL();
        }
    }

    private function loadEnvironmentVariables() {
        $envFile = __DIR__ . '/../../.env';
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                if (strpos($line, '=') === false) continue;
                list($key, $value) = explode('=', $line, 2);
                $_ENV[trim($key)] = trim($value);
                putenv(trim($key) . '=' . trim($value));
            }
        }

        $this->mysql_host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: $this->mysql_host;
        $this->mysql_user = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: $this->mysql_user;
        $this->mysql_pass = $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?: $this->mysql_pass;
        $this->mysql_db = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: $this->mysql_db;
    }
    
    private function connectMySQL() {
        try {
            $dsn = "mysql:host={$this->mysql_host};dbname={$this->mysql_db};charset=utf8mb4";
            $this->connection = new PDO($dsn, $this->mysql_user, $this->mysql_pass);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->db = 'mysql';
        } catch(PDOException $e) {
            die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
        }
    }
    
    private function connectMongoDB() {
        try {
            $this->connection = new MongoDB\Client($this->mongo_url);
            $this->db = $this->connection->selectDatabase($this->mongo_db);
        } catch(Exception $e) {
            die(json_encode(['error' => 'MongoDB connection failed: ' . $e->getMessage()]));
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function getDB() {
        return $this->db;
    }
    
    public function isMySQL() {
        return $this->db === 'mysql';
    }
}
?>