<?php
/**
 * Professionals API Handlers
 */

function handleProfessionalsRoutes($segments, $method, $data, $queryParams) {
    $action = $segments[1] ?? '';
    
    if ($action === 'approved') {
        // Public route: GET /professionals/approved
        getApprovedProfessionals();
    } elseif (!empty($action) && ctype_alnum($action)) {
        // GET/PUT /professionals/{id}
        JWTService::verifyToken();
        if ($method === 'GET') {
            getProfessionalById($action);
        } elseif ($method === 'PUT') {
            updateProfessional($action, $data);
        } else {
            sendError('Method not allowed', 405);
        }
    } else {
        // GET /professionals or POST /professionals
        JWTService::verifyToken();
        if ($method === 'GET') {
            getAllProfessionals($queryParams);
        } elseif ($method === 'POST') {
            createProfessional($data);
        } else {
            sendError('Method not allowed', 405);
        }
    }
}

function handlePublicRoutes($segments, $method, $data) {
    if ($segments[1] === 'professional' && isset($segments[2])) {
        getProfessionalBySubdomain($segments[2]);
    } else {
        sendError('Public endpoint not found', 404);
    }
}

function handleOnboardingRoutes($segments, $method, $data) {
    if ($segments[1] === 'submit' && $method === 'POST') {
        submitProfessionalApplication($data);
    } else {
        sendError('Onboarding endpoint not found', 404);
    }
}

function getAllProfessionals($queryParams) {
    $db = Database::getInstance()->getDB();
    $status = $queryParams['status'] ?? null;
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $sql = 'SELECT * FROM professionals';
        if ($status) {
            $sql .= ' WHERE status = ?';
            $stmt = $conn->prepare($sql);
            $stmt->execute([$status]);
        } else {
            $stmt = $conn->query($sql);
        }
        $professionals = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $filter = $status ? ['status' => $status] : [];
        $professionals = iterator_to_array($db->professionals->find($filter));
        $professionals = json_decode(json_encode($professionals), true);
        // Remove MongoDB _id
        foreach ($professionals as &$prof) {
            unset($prof['_id']);
        }
    }
    
    sendResponse($professionals);
}

function getApprovedProfessionals() {
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare('SELECT * FROM professionals WHERE status = ?');
        $stmt->execute(['approved']);
        $professionals = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $professionals = iterator_to_array($db->professionals->find(['status' => 'approved']));
        $professionals = json_decode(json_encode($professionals), true);
        foreach ($professionals as &$prof) {
            unset($prof['_id']);
        }
    }
    
    sendResponse($professionals);
}

function getProfessionalById($id) {
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare('SELECT * FROM professionals WHERE id = ?');
        $stmt->execute([$id]);
        $professional = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        $professional = $db->professionals->findOne(['id' => $id]);
        if ($professional) {
            $professional = json_decode(json_encode($professional), true);
            unset($professional['_id']);
        }
    }
    
    if (!$professional) {
        sendError('Professional not found', 404);
    }
    
    sendResponse($professional);
}

function getProfessionalBySubdomain($subdomain) {
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        // First try to find by subdomain, then by ID (to handle both cases)
        $stmt = $conn->prepare('SELECT * FROM professionals WHERE (subdomain = ? OR id = ?) AND status = ?');
        $stmt->execute([$subdomain, $subdomain, 'approved']);
        $professional = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        $professional = $db->professionals->findOne([
            '$and' => [
                [
                    '$or' => [
                        ['subdomain' => $subdomain],
                        ['id' => $subdomain]
                    ]
                ],
                ['status' => 'approved']
            ]
        ]);
        if ($professional) {
            $professional = json_decode(json_encode($professional), true);
            unset($professional['_id']);
        }
    }
    
    if (!$professional) {
        sendError('Professional not found', 404);
    }
    
    sendResponse($professional);
}

function createProfessional($data) {
    // Validate required fields
    $required = ['first_name', 'last_name', 'phone', 'email', 'consulting_fees'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            sendError("Field {$field} is required", 400);
        }
    }
    
    // Generate subdomain
    $subdomain = generateSubdomain($data['first_name'], $data['last_name']);
    
    // Only include essential fields
    $professional = [
        'id' => uniqid('prof_'),
        'first_name' => $data['first_name'],
        'last_name' => $data['last_name'],
        'phone' => $data['phone'],
        'email' => $data['email'],
        'consulting_fees' => floatval($data['consulting_fees']),
        'subdomain' => $subdomain,
        'status' => 'approved',
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    // Add optional fields only if they're provided
    $optionalFields = [
        'speciality', 'ug_qualification', 'pg_qualification', 'superspeciality',
        'area_of_expertise', 'instagram', 'youtube', 'twitter', 'linkedin', 'facebook'
    ];
    
    foreach ($optionalFields as $field) {
        if (!empty($data[$field])) {
            $professional[$field] = $data[$field];
        }
    }
    
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        
        // Check what columns exist
        $stmt = $conn->prepare("DESCRIBE professionals");
        $stmt->execute();
        $existingColumns = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
        
        // Filter to only existing columns
        $filteredProfessional = array_intersect_key($professional, array_flip($existingColumns));
        
        $fields = implode(', ', array_keys($filteredProfessional));
        $placeholders = implode(', ', array_fill(0, count($filteredProfessional), '?'));
        $stmt = $conn->prepare("INSERT INTO professionals ({$fields}) VALUES ({$placeholders})");
        $stmt->execute(array_values($filteredProfessional));
    } else {
        $db->professionals->insertOne($professional);
    }
    
    unset($professional['_id']);
    sendResponse($professional, 201);
}

function generateSubdomain($firstName, $lastName) {
    $subdomain = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $firstName . $lastName));
    
    // Check if subdomain exists and add number if needed
    $db = Database::getInstance()->getDB();
    $originalSubdomain = $subdomain;
    $counter = 1;
    
    while (true) {
        if ($db === 'mysql') {
            $conn = Database::getInstance()->getConnection();
            $stmt = $conn->prepare('SELECT id FROM professionals WHERE subdomain = ?');
            $stmt->execute([$subdomain]);
            $exists = $stmt->fetch();
        } else {
            $exists = $db->professionals->findOne(['subdomain' => $subdomain]);
        }
        
        if (!$exists) break;
        
        $subdomain = $originalSubdomain . $counter;
        $counter++;
    }
    
    return $subdomain;
}

function submitProfessionalApplication($data) {
    error_log("submitProfessionalApplication called with data: " . json_encode($data));
    
    $required = ['first_name', 'last_name', 'phone', 'email'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            sendError("Field {$field} is required", 400);
        }
    }
    
    $subdomain = generateSubdomain($data['first_name'], $data['last_name']);
    
    // ONLY include essential fields that we know exist
    $professional = [
        'id' => uniqid('prof_'),
        'first_name' => $data['first_name'],
        'last_name' => $data['last_name'],
        'phone' => $data['phone'],
        'email' => $data['email'],
        'subdomain' => $subdomain,
        'status' => 'pending',
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    // Add optional social media fields if provided
    $socialFields = ['instagram', 'youtube', 'twitter', 'linkedin', 'facebook'];
    foreach ($socialFields as $field) {
        if (!empty($data[$field])) {
            $professional[$field] = $data[$field];
        }
    }
    
    // Add other optional fields
    $optionalFields = ['speciality', 'ug_qualification', 'pg_qualification', 'superspeciality', 'area_of_expertise', 'consulting_fees'];
    foreach ($optionalFields as $field) {
        if (!empty($data[$field])) {
            $professional[$field] = $field === 'consulting_fees' ? floatval($data[$field]) : $data[$field];
        }
    }
    
    error_log("Professional data (essential only): " . json_encode($professional));
    
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        
        // Check what columns exist
        $stmt = $conn->prepare("DESCRIBE professionals");
        $stmt->execute();
        $existingColumns = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
        
        error_log("Existing columns: " . json_encode($existingColumns));
        
        // Filter to only existing columns
        $filteredProfessional = array_intersect_key($professional, array_flip($existingColumns));
        
        error_log("Filtered professional data: " . json_encode($filteredProfessional));
        
        $fields = implode(', ', array_keys($filteredProfessional));
        $placeholders = implode(', ', array_fill(0, count($filteredProfessional), '?'));
        
        error_log("SQL: INSERT INTO professionals ({$fields}) VALUES ({$placeholders})");
        
        $stmt = $conn->prepare("INSERT INTO professionals ({$fields}) VALUES ({$placeholders})");
        $stmt->execute(array_values($filteredProfessional));
    } else {
        $db->professionals->insertOne($professional);
    }
    
    unset($professional['_id']);
    sendResponse($professional, 201);
}

function updateProfessional($id, $data) {
    $db = Database::getInstance()->getDB();
    
    // Remove empty values
    $updateData = array_filter($data, function($value) {
        return $value !== null && $value !== '';
    });
    
    if (empty($updateData)) {
        sendError('No data to update', 400);
    }
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $setClause = implode(', ', array_map(fn($k) => "{$k} = ?", array_keys($updateData)));
        $stmt = $conn->prepare("UPDATE professionals SET {$setClause} WHERE id = ?");
        $values = array_values($updateData);
        $values[] = $id;
        $stmt->execute($values);
    } else {
        $db->professionals->updateOne(
            ['id' => $id],
            ['$set' => $updateData]
        );
    }
    
    // Get updated professional
    getProfessionalById($id);
}
?>