<?php
/**
 * ============================================================================
 * TeleCareZone - Main Entry Point (index.php)
 * ============================================================================
 * 
 * This is the main router file for the TeleCareZone platform.
 * It handles all incoming HTTP requests and routes them to appropriate handlers.
 * 
 * Compatible with:
 * - Local XAMPP/WAMP server
 * - Hostinger shared hosting
 * 
 * @author TeleCareZone Development Team
 * @version 2.0.0
 * @since December 2025
 * 
 * ============================================================================
 * DIRECTORY STRUCTURE:
 * ============================================================================
 * /app/
 *   ├── index.php           (This file - Main entry point)
 *   ├── .htaccess           (URL rewriting rules)
 *   ├── config/             (Configuration files)
 *   │   ├── config.php      (Application config)
 *   │   └── database.php    (Database connection)
 *   ├── api/                (API endpoint handlers)
 *   │   ├── auth.php        (Authentication endpoints)
 *   │   ├── professionals.php (Doctor management)
 *   │   ├── appointments.php  (Booking management)
 *   │   └── ...
 *   ├── services/           (Business logic services)
 *   │   ├── JWTService.php
 *   │   ├── RazorpayService.php
 *   │   └── ...
 *   ├── models/             (Data models)
 *   ├── uploads/            (Uploaded files)
 *   └── frontend/           (React application)
 * 
 * ============================================================================
 */

// ============================================================================
// STEP 1: ERROR REPORTING & DEBUGGING
// ============================================================================
// Set error reporting level (Change to 0 in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);  // Set to 1 for debugging
ini_set('log_errors', 1);
error_log("TeleCareZone API - Request received: " . $_SERVER['REQUEST_URI']);

// ============================================================================
// STEP 2: LOAD DEPENDENCIES
// ============================================================================
// Load Composer autoloader (for MongoDB library and other dependencies)
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
} else {
    error_log("WARNING: Composer vendor/autoload.php not found");
}

// Load application configuration
require_once __DIR__ . '/config/config.php';

// ============================================================================
// STEP 3: CORS CONFIGURATION
// ============================================================================
// Allow cross-origin requests from frontend
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ============================================================================
// STEP 4: PARSE REQUEST DETAILS
// ============================================================================
// Get HTTP method (GET, POST, PUT, DELETE, etc.)
$method = $_SERVER['REQUEST_METHOD'];

// Get the request URI and clean it
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove any prefix (like /api) from the URI
$uri = str_replace('/api', '', $uri);
$uri = rtrim($uri, '/');

// Split URI into segments for routing
// Example: /professionals/123 becomes ['', 'professionals', '123']
$segments = explode('/', trim($uri, '/'));

// Get request body for POST/PUT/DELETE requests
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true) ?? [];

// Get query parameters from URL
// Example: ?status=approved becomes ['status' => 'approved']
$queryParams = $_GET;

// Log the incoming request for debugging
error_log("Method: $method, URI: $uri, Segments: " . json_encode($segments));

// ============================================================================
// STEP 5: HELPER FUNCTIONS
// ============================================================================

/**
 * Send a successful JSON response
 * 
 * @param mixed $data The data to send in response
 * @param int $statusCode HTTP status code (default: 200)
 */
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Send an error JSON response
 * 
 * @param string $message Error message
 * @param int $statusCode HTTP status code (default: 400)
 */
function sendError($message, $statusCode = 400) {
    http_response_code($statusCode);
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

// ============================================================================
// STEP 6: LOAD API HANDLERS
// ============================================================================
// Load all API endpoint handlers
require_once __DIR__ . '/api/auth.php';               // Authentication
require_once __DIR__ . '/api/professionals.php';      // Doctor management
require_once __DIR__ . '/api/appointments.php';       // Appointment booking
require_once __DIR__ . '/api/payments.php';           // Payment processing
require_once __DIR__ . '/api/testimonials.php';       // Testimonials
require_once __DIR__ . '/api/analytics.php';          // Analytics & reports
require_once __DIR__ . '/api/admin_onboarding.php';   // Admin onboarding system

// ============================================================================
// STEP 7: ROUTING LOGIC
// ============================================================================
try {
    // Get the first segment to determine the endpoint
    $endpoint = $segments[0] ?? '';
    
    // Route the request based on the endpoint
    switch ($endpoint) {
        // --------------------------------------------------------------------
        // ROOT ENDPOINT - API Information
        // --------------------------------------------------------------------
        case '':
            sendResponse([
                'message' => 'TeleCareZone API - PHP Backend',
                'version' => '2.0.0',
                'status' => 'operational',
                'database' => Database::getInstance()->isMySQL() ? 'MySQL' : 'MongoDB',
                'endpoints' => [
                    'auth' => '/api/admin/login',
                    'professionals' => '/api/professionals',
                    'appointments' => '/api/appointments',
                    'payments' => '/api/payments'
                ]
            ]);
            break;
        
        // --------------------------------------------------------------------
        // ADMIN AUTHENTICATION ROUTES
        // --------------------------------------------------------------------
        // Handles: /admin/login, /admin/analytics, /admin/onboarding/*
        case 'admin':
            // Check if it's an onboarding route
            if (isset($segments[1]) && $segments[1] === 'onboarding') {
                handleAdminOnboardingRoutes($segments, $method, $data, $queryParams);
            } else {
                handleAdminRoutes($segments, $method, $data, $queryParams);
            }
            break;
        
        // --------------------------------------------------------------------
        // PROFESSIONALS/DOCTORS ROUTES
        // --------------------------------------------------------------------
        // Handles: /professionals, /professionals/:id, /professionals/approved
        case 'professionals':
            handleProfessionalsRoutes($segments, $method, $data, $queryParams);
            break;
        
        // --------------------------------------------------------------------
        // PUBLIC ROUTES (No authentication required)
        // --------------------------------------------------------------------
        // Handles: /public/professional/:subdomain
        case 'public':
            handlePublicRoutes($segments, $method, $data);
            break;
        
        // --------------------------------------------------------------------
        // ONBOARDING ROUTES (Expert registration)
        // --------------------------------------------------------------------
        // Handles: /onboarding/submit
        case 'onboarding':
            handleOnboardingRoutes($segments, $method, $data);
            break;
        
        // --------------------------------------------------------------------
        // APPOINTMENTS ROUTES
        // --------------------------------------------------------------------
        // Handles: /appointments, /appointments/:id
        case 'appointments':
            handleAppointmentsRoutes($segments, $method, $data, $queryParams);
            break;
        
        // --------------------------------------------------------------------
        // PAYMENTS ROUTES
        // --------------------------------------------------------------------
        // Handles: /payments/create, /payments/verify
        case 'payments':
            handlePaymentsRoutes($segments, $method, $data, $queryParams);
            break;
        
        // --------------------------------------------------------------------
        // TESTIMONIALS ROUTES
        // --------------------------------------------------------------------
        // Handles: /testimonials, /testimonials/:id
        case 'testimonials':
            handleTestimonialsRoutes($segments, $method, $data);
            break;
        
        // --------------------------------------------------------------------
        // HEALTH CHECK ENDPOINT
        // --------------------------------------------------------------------
        case 'health':
            sendResponse([
                'status' => 'healthy',
                'timestamp' => date('c'),
                'database' => Database::getInstance()->isMySQL() ? 'MySQL' : 'MongoDB'
            ]);
            break;
        
        // --------------------------------------------------------------------
        // 404 - ENDPOINT NOT FOUND
        // --------------------------------------------------------------------
        default:
            sendError('Endpoint not found: ' . $endpoint, 404);
    }
    
} catch (Exception $e) {
    // ========================================================================
    // GLOBAL ERROR HANDLER
    // ========================================================================
    // Log the error for debugging
    error_log('API Error: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    
    // Send error response to client
    sendError('Internal server error: ' . $e->getMessage(), 500);
}

// ============================================================================
// END OF FILE
// ============================================================================
?>
