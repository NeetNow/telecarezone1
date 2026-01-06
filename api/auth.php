<?php
/**
 * Authentication API Handlers
 */

function handleAdminRoutes($segments, $method, $data, $queryParams) {
    $action = $segments[1] ?? '';
    
    switch ($action) {
        case 'login':
            if ($method !== 'POST') sendError('Method not allowed', 405);
            adminLogin($data);
            break;
            
        case 'create-default':
            if ($method !== 'POST') sendError('Method not allowed', 405);
            createDefaultAdmin();
            break;
            
        case 'analytics':
            JWTService::verifyToken();
            if (isset($segments[2])) {
                // GET /admin/analytics/{id}
                getAnalyticsByProfessional($segments[2]);
            } else {
                // GET /admin/analytics/overview
                if (isset($segments[3]) && $segments[3] === 'overview') {
                    getPlatformAnalytics();
                } else {
                    getPlatformAnalytics();
                }
            }
            break;
            
        default:
            sendError('Admin endpoint not found', 404);
    }
}

function adminLogin($data) {
    if (!isset($data['username']) || !isset($data['password'])) {
        sendError('Username and password required', 400);
    }
    
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        // MySQL query
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare('SELECT * FROM admin_users WHERE username = ?');
        $stmt->execute([$data['username']]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        // MongoDB query
        $admin = $db->admin_users->findOne(['username' => $data['username']]);
        if ($admin) {
            $admin = json_decode(json_encode($admin), true);
        }
    }
    
    // Check password - support both 'password' and 'password_hash' field names
    $passwordHash = $admin['password'] ?? $admin['password_hash'] ?? '';
    
    if (!$admin || !password_verify($data['password'], $passwordHash)) {
        sendError('Invalid credentials', 401);
    }
    
    $token = JWTService::createToken($data['username']);
    sendResponse(['access_token' => $token, 'token_type' => 'bearer']);
}

function createDefaultAdmin() {
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        // Check if admin exists
        $stmt = $conn->prepare('SELECT id FROM admin_users WHERE username = ?');
        $stmt->execute(['admin']);
        if ($stmt->fetch()) {
            sendResponse(['message' => 'Admin already exists']);
        }
        
        // Create admin
        $stmt = $conn->prepare('INSERT INTO admin_users (username, password) VALUES (?, ?)');
        $stmt->execute(['admin', password_hash('admin123', PASSWORD_BCRYPT)]);
    } else {
        // MongoDB
        $existing = $db->admin_users->findOne(['username' => 'admin']);
        if ($existing) {
            sendResponse(['message' => 'Admin already exists']);
        }
        
        $db->admin_users->insertOne([
            'username' => 'admin',
            'password' => password_hash('admin123', PASSWORD_BCRYPT),
            'created_at' => date('Y-m-d H:i:s')
        ]);
    }
    
    sendResponse(['message' => 'Default admin created', 'username' => 'admin', 'password' => 'admin123']);
}
?>