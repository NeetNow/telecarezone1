<?php
/**
 * Application Configuration
 * Works on Hostinger
 */

// Load Composer autoloader (only if exists)
if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require_once __DIR__ . '/../vendor/autoload.php';
}

// Load environment variables from .env file
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
        putenv(trim($key) . '=' . trim($value)); // Also set for getenv()
    }
}

// Error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 0); // Set to 1 for debugging

// CORS Configuration
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// JWT Secret
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'your_jwt_secret_key');
define('JWT_ALGORITHM', 'HS256');

// Fast2SMS Configuration  
define('FAST2SMS_API_KEY', getenv('FAST2SMS_API_KEY') ?: 'your_fast2sms_api_key');
define('FAST2SMS_SENDER_ID', getenv('FAST2SMS_SENDER_ID') ?: 'YOUR_SENDER_ID');

// Google Meet Configuration
define('GOOGLE_CLIENT_ID', getenv('GOOGLE_CLIENT_ID') ?: 'your_google_client_id');
define('GOOGLE_CLIENT_SECRET', getenv('GOOGLE_CLIENT_SECRET') ?: 'your_google_client_secret');
define('GOOGLE_REDIRECT_URI', getenv('GOOGLE_REDIRECT_URI') ?: 'https://yourdomain.com/callback');

// Razorpay Configuration
define('RAZORPAY_KEY_ID', getenv('RAZORPAY_KEY_ID'));
define('RAZORPAY_KEY_SECRET', getenv('RAZORPAY_KEY_SECRET'));

// Application Settings
define('APP_NAME', 'TeleCareZone');
define('APP_URL', getenv('APP_URL') ?: 'https://yourdomain.com');
define('PLATFORM_FEE_PERCENTAGE', getenv('PLATFORM_FEE_PERCENTAGE') ?: 10);
define('DOCTOR_FEE_PERCENTAGE', getenv('DOCTOR_FEE_PERCENTAGE') ?: 90);

// Timezone
date_default_timezone_set('Asia/Kolkata');

// Autoload classes
spl_autoload_register(function ($class) {
    $paths = [
        __DIR__ . '/../models/' . $class . '.php',
        __DIR__ . '/../services/' . $class . '.php',
    ];
    
    foreach ($paths as $path) {
        if (file_exists($path)) {
            require_once $path;
            return;
        }
    }
});

// Load database
require_once __DIR__ . '/database.php';
?>