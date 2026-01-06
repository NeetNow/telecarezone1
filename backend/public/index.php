<?php
/**
 * TeleCareZone API - Main Router
 * Core PHP Backend - Compatible with Hostinger
 */

// Load configuration
require_once __DIR__ . '/../config/config.php';

// Get request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/api', '', $uri); // Remove /api prefix
$uri = rtrim($uri, '/');

// Parse URI segments
$segments = explode('/', trim($uri, '/'));

// Get request body for POST/PUT
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true) ?? [];

// Get query parameters
$queryParams = $_GET;

// Response helper
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

// Error handler
function sendError($message, $statusCode = 400) {
    http_response_code($statusCode);
    echo json_encode(['error' => $message]);
    exit;
}

try {
    // Load API handlers
    require_once __DIR__ . '/../api/auth.php';
    require_once __DIR__ . '/../api/professionals.php';
    require_once __DIR__ . '/../api/appointments.php';
    require_once __DIR__ . '/../api/payments.php';
    require_once __DIR__ . '/../api/testimonials.php';
    require_once __DIR__ . '/../api/analytics.php';
    
    // Route requests
    $endpoint = $segments[0] ?? '';
    
    switch ($endpoint) {
        // Root endpoint
        case '':
            sendResponse(['message' => 'TeleCareZone API - PHP Backend', 'version' => '1.0.0']);
            break;
            
        // Admin authentication
        case 'admin':
            handleAdminRoutes($segments, $method, $data, $queryParams);
            break;
            
        // Professionals
        case 'professionals':
            handleProfessionalsRoutes($segments, $method, $data, $queryParams);
            break;
            
        // Public professional routes
        case 'public':
            handlePublicRoutes($segments, $method, $data);
            break;
            
        // Onboarding
        case 'onboarding':
            handleOnboardingRoutes($segments, $method, $data);
            break;
            
        // Appointments
        case 'appointments':
            handleAppointmentsRoutes($segments, $method, $data, $queryParams);
            break;
            
        // Payments
        case 'payments':
            handlePaymentsRoutes($segments, $method, $data, $queryParams);
            break;
            
        // Testimonials
        case 'testimonials':
            handleTestimonialsRoutes($segments, $method, $data);
            break;
            
        // 404
        default:
            sendError('Endpoint not found', 404);
    }
    
} catch (Exception $e) {
    error_log('API Error: ' . $e->getMessage());
    sendError('Internal server error: ' . $e->getMessage(), 500);
}
?>
