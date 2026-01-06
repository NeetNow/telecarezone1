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
        $stmt = $conn->prepare('SELECT * FROM professionals WHERE subdomain = ? AND status = ?');
        $stmt->execute([$subdomain, 'approved']);
        $professional = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        $professional = $db->professionals->findOne(['subdomain' => $subdomain, 'status' => 'approved']);
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
    
    $professional = [
        'id' => uniqid('prof_'),
        'first_name' => $data['first_name'],
        'last_name' => $data['last_name'],
        'phone' => $data['phone'],
        'email' => $data['email'],
        'speciality' => $data['speciality'] ?? null,
        'ug_qualification' => $data['ug_qualification'] ?? null,
        'pg_qualification' => $data['pg_qualification'] ?? null,
        'superspeciality' => $data['superspeciality'] ?? null,
        'area_of_expertise' => $data['area_of_expertise'] ?? null,
        'instagram' => $data['instagram'] ?? null,
        'youtube' => $data['youtube'] ?? null,
        'twitter' => $data['twitter'] ?? null,
        'consulting_fees' => floatval($data['consulting_fees']),
        'subdomain' => $subdomain,
        'status' => 'approved',
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $fields = implode(', ', array_keys($professional));
        $placeholders = implode(', ', array_fill(0, count($professional), '?'));
        $stmt = $conn->prepare("INSERT INTO professionals ({$fields}) VALUES ({$placeholders})");
        $stmt->execute(array_values($professional));
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

function submitProfessionalApplication($data) {
    $required = ['first_name', 'last_name', 'phone', 'email'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            sendError("Field {$field} is required", 400);
        }
    }
    
    $subdomain = generateSubdomain($data['first_name'], $data['last_name']);
    
    $professional = [
        'id' => uniqid('prof_'),
        'first_name' => $data['first_name'],
        'last_name' => $data['last_name'],
        'phone' => $data['phone'],
        'email' => $data['email'],
        'speciality' => $data['speciality'] ?? null,
        'ug_qualification' => $data['ug_qualification'] ?? null,
        'pg_qualification' => $data['pg_qualification'] ?? null,
        'superspeciality' => $data['superspeciality'] ?? null,
        'area_of_expertise' => $data['area_of_expertise'] ?? null,
        'instagram' => $data['instagram'] ?? null,
        'youtube' => $data['youtube'] ?? null,
        'twitter' => $data['twitter'] ?? null,
        'consulting_fees' => floatval($data['consulting_fees'] ?? 0),
        'subdomain' => $subdomain,
        'status' => 'pending',
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $fields = implode(', ', array_keys($professional));
        $placeholders = implode(', ', array_fill(0, count($professional), '?'));
        $stmt = $conn->prepare("INSERT INTO professionals ({$fields}) VALUES ({$placeholders})");
        $stmt->execute(array_values($professional));
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
?>