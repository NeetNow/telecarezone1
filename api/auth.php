<?php
/**
 * Authentication API Handlers 
 * 
 */

function handleDoctorRoutes($segments, $method, $data, $queryParams) {
    $action = $segments[1] ?? '';
    
    switch ($action) {
        case 'login':
            if ($method !== 'POST') sendError('Method not allowed', 405);
            doctorLogin($data);
            break;
            
        default:
            sendError('Doctor endpoint not found', 404);
    }
}

function doctorLogin($data) {
    if (!isset($data['email']) || !isset($data['password'])) {
        sendError('Email and password required', 400);
    }
    
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        // MySQL query
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare('SELECT * FROM professionals WHERE email = ?');
        $stmt->execute([$data['email']]);
        $professional = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        // MongoDB query
        $professional = $db->professionals->findOne(['email' => $data['email']]);
        if ($professional) {
            $professional = json_decode(json_encode($professional), true);
        }
    }
    
    // Check password - support both 'password' and 'password_hash' field names
    $passwordHash = $professional['password'] ?? $professional['password_hash'] ?? '';
    
    if (!$professional || !password_verify($data['password'], $passwordHash)) {
        sendError('Invalid credentials', 401);
    }
    
    // Generate token
    $token = JWTService::createToken($professional['id']);
    
    // Remove sensitive data before sending response
    unset($professional['password']);
    unset($professional['password_hash']);
    
    sendResponse([
        'success' => true,
        'token' => $token,
        'doctor' => $professional
    ]);
}

function handlePatientsRoutes($segments, $method, $data, $queryParams) {
    $action = $segments[1] ?? '';
    
    if ($action === 'professional' && isset($segments[2])) {
        // GET /patients/professional/{id} - No auth required for doctor dashboard
        getProfessionalPatients($segments[2]);
    } elseif (!empty($action) && ctype_alnum($action)) {
        // GET /patients/{id}
        JWTService::verifyToken();
        getPatientById($action);
    } else {
        sendError('Patient endpoint not found', 404);
    }
}

function getProfessionalPatients($professionalId) {
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        // Get all patients who have appointments with this professional
        $stmt = $conn->prepare('
            SELECT DISTINCT p.* FROM patients p
            INNER JOIN appointments a ON p.id = a.patient_id
            WHERE a.professional_id = ?
            ORDER BY p.created_at DESC
        ');
        $stmt->execute([$professionalId]);
        $patients = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        // MongoDB aggregation
        $appointments = iterator_to_array($db->appointments->find(['professional_id' => $professionalId]));
        $patientIds = array_unique(array_column($appointments, 'patient_id'));
        
        $patients = [];
        foreach ($patientIds as $patientId) {
            $patient = $db->patients->findOne(['id' => $patientId]);
            if ($patient) {
                $patientData = json_decode(json_encode($patient), true);
                unset($patientData['_id']);
                $patients[] = $patientData;
            }
        }
    }
    
    sendResponse($patients);
}

function getPatientById($id) {
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare('SELECT * FROM patients WHERE id = ?');
        $stmt->execute([$id]);
        $patient = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        $patient = $db->patients->findOne(['id' => $id]);
        if ($patient) {
            $patient = json_decode(json_encode($patient), true);
            unset($patient['_id']);
        }
    }
    
    if (!$patient) {
        sendError('Patient not found', 404);
    }
    
    sendResponse($patient);
}

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
            $analyticsTarget = $segments[2] ?? '';

            // GET /admin/analytics/overview
            if ($analyticsTarget === '' || $analyticsTarget === 'overview') {
                getPlatformAnalytics();
            } else {
                // GET /admin/analytics/{id}
                getAnalyticsByProfessional($analyticsTarget);
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