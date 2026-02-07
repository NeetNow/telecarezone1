<?php
/**
 * Database Configuration
 * Compatible with both MongoDB (Emergent) and MySQL (Hostinger)
 */

class Database {
    private static $instance = null;
    private $connection;
    private $db;
    
    // For Hostinger MySQL
    private $mysql_host = 'localhost';
    private $mysql_user = 'root';
    private $mysql_pass = '';
    private $mysql_db = 'telecarezone_db';
    
    // For Emergent MongoDB
    private $mongo_url = 'mongodb://localhost:27017';
    private $mongo_db = 'telecarezone_db';
    
    private function __construct() {
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