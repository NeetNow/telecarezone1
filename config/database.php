<?php
/**
 * ============================================================================
 * Database Configuration Class
 * ============================================================================
 * 
 * This class provides a singleton database connection that works with both:
 * - MySQL/MariaDB (default for XAMPP, Hostinger)
 * - MongoDB (optional, for Hostinger platform)
 * 
 * The connection type is automatically detected based on environment or
 * can be explicitly set via DB_TYPE environment variable.
 * 
 * @author TeleCareZone Development Team
 * @version 2.0.0
 * 
 * ============================================================================
 * USAGE EXAMPLES:
 * ============================================================================
 * 
 * // Get database instance
 * $db = Database::getInstance()->getDB();
 * 
 * // Check if using MySQL
 * if (Database::getInstance()->isMySQL()) {
 *     // MySQL specific code
 *     $conn = Database::getInstance()->getConnection();
 *     $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
 * } else {
 *     // MongoDB specific code
 *     $users = $db->users->find(['id' => $userId]);
 * }
 * 
 * ============================================================================
 */

class Database {
    // Singleton instance
    private static $instance = null;
    
    // Database connection object (PDO for MySQL, MongoDB\Client for MongoDB)
    private $connection;
    
    // Database type identifier ('mysql' or MongoDB\Database object)
    private $db;
    
    // ========================================================================
    // MYSQL CONFIGURATION
    // ========================================================================
    // These settings are configured via environment variables
    // For Hostinger: See config/.env file
    private $mysql_host;
    private $mysql_user;
    private $mysql_pass;
    private $mysql_db;
    
    // ========================================================================
    // MONGODB CONFIGURATION
    // ========================================================================
    // These settings are for Hostinger platform or if you want to use MongoDB
    private $mongo_url = 'mongodb://localhost:27017';
    private $mongo_db = 'telecarezone_db';
    
    /**
     * Private constructor to enforce singleton pattern
     * Automatically connects to the appropriate database
     */
    private function __construct() {
        // ====================================================================
        // LOAD DATABASE CREDENTIALS FROM ENVIRONMENT
        // ====================================================================
        // Load from .env file or use defaults
        $this->loadEnvironmentVariables();
        
        // ====================================================================
        // AUTO-DETECT DATABASE TYPE
        // ====================================================================
        $dbType = getenv('DB_TYPE') ?: 'mysql';
        
        if ($dbType === 'mongodb') {
            $this->connectMongoDB();
        } else {
            $this->connectMySQL();
        }
    }
    
    /**
     * Load database credentials from environment variables or .env file
     */
    private function loadEnvironmentVariables() {
        // Load from .env file if exists
        $envFile = __DIR__ . '/.env';
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                list($key, $value) = explode('=', $line, 2);
                $_ENV[trim($key)] = trim($value);
            }
        }
        
        // Set database credentials (with fallbacks)
        $this->mysql_host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: 'localhost';
        $this->mysql_user = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'root';
        $this->mysql_pass = $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?: '';
        $this->mysql_db = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'telecarezone_db';
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
