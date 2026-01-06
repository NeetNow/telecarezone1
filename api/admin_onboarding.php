<?php
/**
 * ============================================================================
 * Admin Onboarding API - Comprehensive Doctor Onboarding System
 * ============================================================================
 * 
 * This file handles the complete doctor onboarding process with 27+ fields
 * including file uploads, social media links, bank details, and scheduling.
 * 
 * @author TeleCareZone Development Team
 * @version 2.0.0
 * @since December 2025
 * 
 * ============================================================================
 * ENDPOINTS:
 * ============================================================================
 * POST   /api/admin/onboarding/create    - Create new professional profile
 * GET    /api/admin/onboarding/list      - Get all professionals
 * GET    /api/admin/onboarding/:id       - Get single professional
 * PUT    /api/admin/onboarding/:id       - Update professional
 * DELETE /api/admin/onboarding/:id       - Delete professional
 * POST   /api/admin/onboarding/upload    - Handle file uploads
 * 
 * ============================================================================
 */

/**
 * Route handler for admin onboarding operations
 * 
 * @param array $segments URL segments
 * @param string $method HTTP method
 * @param array $data Request data
 * @param array $queryParams Query parameters
 */
function handleAdminOnboardingRoutes($segments, $method, $data, $queryParams) {
    // Verify admin authentication for all routes
    JWTService::verifyToken();
    
    $action = $segments[2] ?? '';  // Third segment after /admin/onboarding/
    
    switch ($action) {
        // --------------------------------------------------------------------
        // CREATE NEW PROFESSIONAL
        // --------------------------------------------------------------------
        case 'create':
            if ($method !== 'POST') sendError('Method not allowed', 405);
            createProfessionalComplete($data);
            break;
        
        // --------------------------------------------------------------------
        // LIST ALL PROFESSIONALS
        // --------------------------------------------------------------------
        case 'list':
            if ($method !== 'GET') sendError('Method not allowed', 405);
            listAllProfessionals($queryParams);
            break;
        
        // --------------------------------------------------------------------
        // FILE UPLOAD
        // --------------------------------------------------------------------
        case 'upload':
            if ($method !== 'POST') sendError('Method not allowed', 405);
            handleFileUpload($_FILES);
            break;
        
        // --------------------------------------------------------------------
        // GET/UPDATE/DELETE SPECIFIC PROFESSIONAL
        // --------------------------------------------------------------------
        default:
            if (!empty($action)) {
                if ($method === 'GET') {
                    getProfessionalComplete($action);
                } elseif ($method === 'PUT') {
                    updateProfessionalComplete($action, $data);
                } elseif ($method === 'DELETE') {
                    deleteProfessional($action);
                } else {
                    sendError('Method not allowed', 405);
                }
            } else {
                sendError('Invalid onboarding endpoint', 404);
            }
    }
}

/**
 * Create a complete professional profile with all 27 fields
 * 
 * @param array $data Professional data from request body
 */
function createProfessionalComplete($data) {
    $db = Database::getInstance()->getDB();
    
    // ========================================================================
    // STEP 1: VALIDATE REQUIRED FIELDS
    // ========================================================================
    $requiredFields = ['first_name', 'last_name', 'email', 'display_name'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            sendError("Missing required field: $field", 400);
        }
    }
    
    // ========================================================================
    // STEP 2: VALIDATE EMAIL FORMAT
    // ========================================================================
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        sendError('Invalid email format', 400);
    }
    
    // ========================================================================
    // STEP 3: GENERATE UNIQUE ID AND SUBDOMAIN
    // ========================================================================
    $professionalId = generateUniqueId();
    
    // Generate subdomain from display name (lowercase, no spaces)
    $subdomain = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $data['display_name']));
    
    // Check if subdomain already exists
    if (subdomainExists($subdomain)) {
        // Append random number if subdomain exists
        $subdomain .= rand(100, 999);
    }
    
    // ========================================================================
    // STEP 4: PARSE APPOINTMENT DAYS (Multi-select array)
    // ========================================================================
    $appointmentDays = isset($data['appointment_days']) && is_array($data['appointment_days']) 
        ? json_encode($data['appointment_days']) 
        : json_encode(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    
    // ========================================================================
    // STEP 5: PREPARE DATA FOR INSERTION
    // ========================================================================
    $professionalData = [
        'id' => $professionalId,
        'first_name' => $data['first_name'],
        'last_name' => $data['last_name'],
        'email' => $data['email'],
        'country' => $data['country'] ?? 'India',
        'state' => $data['state'] ?? '',
        'display_name' => $data['display_name'],
        'profession_qualification' => $data['profession_qualification'] ?? '',
        'bio' => $data['bio'] ?? '',
        'theme_color' => $data['theme_color'] ?? '#667eea',
        
        // Social Media URLs
        'instagram' => $data['instagram'] ?? '',
        'youtube' => $data['youtube'] ?? '',
        'linkedin' => $data['linkedin'] ?? '',
        'facebook' => $data['facebook'] ?? '',
        'twitter' => $data['twitter'] ?? '',
        
        // Bank Details
        'bank_account_name' => $data['bank_account_name'] ?? '',
        'bank_account_number' => $data['bank_account_number'] ?? '',
        'bank_ifsc_code' => $data['bank_ifsc_code'] ?? '',
        'bank_branch' => $data['bank_branch'] ?? '',
        
        // Appointment Settings
        'appointment_days' => $appointmentDays,
        'morning_time' => $data['morning_time'] ?? '9:00 AM - 1:00 PM',
        'evening_time' => $data['evening_time'] ?? '5:00 PM - 9:00 PM',
        
        // Media Links
        'intro_video' => $data['intro_video'] ?? '',
        'testimonial_1' => $data['testimonial_1'] ?? '',
        'testimonial_2' => $data['testimonial_2'] ?? '',
        'testimonial_3' => $data['testimonial_3'] ?? '',
        
        // Consulting Fee
        'consulting_fees' => floatval($data['consulting_fees'] ?? 500),
        
        // File Uploads (URLs/paths will be set separately after upload)
        'profile_photo' => $data['profile_photo'] ?? '',
        
        // System Fields
        'subdomain' => $subdomain,
        'status' => 'approved',  // Auto-approve from admin panel
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    // ========================================================================
    // STEP 6: INSERT INTO DATABASE
    // ========================================================================
    if ($db === 'mysql') {
        // MySQL insertion
        $conn = Database::getInstance()->getConnection();
        
        $sql = "INSERT INTO professionals (
            id, first_name, last_name, email, country, state, display_name,
            profession_qualification, bio, theme_color,
            instagram, youtube, linkedin, facebook, twitter,
            bank_account_name, bank_account_number, bank_ifsc_code, bank_branch,
            appointment_days, morning_time, evening_time,
            intro_video, testimonial_1, testimonial_2, testimonial_3,
            consulting_fees, profile_photo, subdomain, status, created_at
        ) VALUES (
            :id, :first_name, :last_name, :email, :country, :state, :display_name,
            :profession_qualification, :bio, :theme_color,
            :instagram, :youtube, :linkedin, :facebook, :twitter,
            :bank_account_name, :bank_account_number, :bank_ifsc_code, :bank_branch,
            :appointment_days, :morning_time, :evening_time,
            :intro_video, :testimonial_1, :testimonial_2, :testimonial_3,
            :consulting_fees, :profile_photo, :subdomain, :status, :created_at
        )";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($professionalData);
        
    } else {
        // MongoDB insertion
        $result = $db->professionals->insertOne($professionalData);
        $professionalId = (string) $result->getInsertedId();
    }
    
    // ========================================================================
    // STEP 7: SEND SUCCESS RESPONSE
    // ========================================================================
    sendResponse([
        'success' => true,
        'message' => 'Professional profile created successfully',
        'professional_id' => $professionalId,
        'subdomain' => $subdomain,
        'landing_page_url' => "https://{$subdomain}.telecarezone.com"
    ], 201);
}

/**
 * List all professionals with filtering and pagination
 * 
 * @param array $queryParams Query parameters for filtering
 */
function listAllProfessionals($queryParams) {
    $db = Database::getInstance()->getDB();
    
    // Get filter parameters
    $status = $queryParams['status'] ?? null;
    $limit = isset($queryParams['limit']) ? intval($queryParams['limit']) : 100;
    $offset = isset($queryParams['offset']) ? intval($queryParams['offset']) : 0;
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        
        // Build query
        $sql = "SELECT * FROM professionals";
        if ($status) {
            $sql .= " WHERE status = :status";
        }
        $sql .= " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        
        $stmt = $conn->prepare($sql);
        if ($status) {
            $stmt->bindParam(':status', $status);
        }
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        $professionals = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
    } else {
        // MongoDB query
        $filter = $status ? ['status' => $status] : [];
        $professionals = iterator_to_array(
            $db->professionals->find($filter, [
                'limit' => $limit,
                'skip' => $offset,
                'sort' => ['created_at' => -1]
            ])
        );
    }
    
    sendResponse([
        'success' => true,
        'count' => count($professionals),
        'professionals' => $professionals
    ]);
}

/**
 * Handle file uploads (profile photo, documents, videos)
 * 
 * @param array $files $_FILES array
 */
function handleFileUpload($files) {
    if (empty($files)) {
        sendError('No files uploaded', 400);
    }
    
    $uploadedFiles = [];
    
    foreach ($files as $fieldName => $file) {
        // Validate file
        if ($file['error'] !== UPLOAD_ERR_OK) {
            continue;
        }
        
        // Determine upload directory based on file type
        $fileType = $file['type'];
        if (strpos($fileType, 'image') !== false) {
            $uploadDir = __DIR__ . '/../uploads/profiles/';
        } elseif (strpos($fileType, 'video') !== false) {
            $uploadDir = __DIR__ . '/../uploads/videos/';
        } else {
            $uploadDir = __DIR__ . '/../uploads/documents/';
        }
        
        // Create directory if it doesn't exist
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '_' . time() . '.' . $extension;
        $filePath = $uploadDir . $filename;
        
        // Move uploaded file
        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            $uploadedFiles[$fieldName] = '/uploads/' . basename($uploadDir) . '/' . $filename;
        }
    }
    
    sendResponse([
        'success' => true,
        'message' => 'Files uploaded successfully',
        'files' => $uploadedFiles
    ]);
}

/**
 * Get complete professional profile by ID
 * 
 * @param string $professionalId Professional ID
 */
function getProfessionalComplete($professionalId) {
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare("SELECT * FROM professionals WHERE id = ?");
        $stmt->execute([$professionalId]);
        $professional = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        $professional = $db->professionals->findOne(['id' => $professionalId]);
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

/**
 * Update professional profile
 * 
 * @param string $professionalId Professional ID
 * @param array $data Update data
 */
function updateProfessionalComplete($professionalId, $data) {
    $db = Database::getInstance()->getDB();
    
    // Remove ID from update data
    unset($data['id']);
    unset($data['created_at']);
    
    // Add updated timestamp
    $data['updated_at'] = date('Y-m-d H:i:s');
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        
        // Build update query dynamically
        $updates = [];
        foreach ($data as $key => $value) {
            $updates[] = "$key = :$key";
        }
        
        $sql = "UPDATE professionals SET " . implode(', ', $updates) . " WHERE id = :id";
        $data['id'] = $professionalId;
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($data);
        
    } else {
        $db->professionals->updateOne(
            ['id' => $professionalId],
            ['$set' => $data]
        );
    }
    
    sendResponse([
        'success' => true,
        'message' => 'Professional updated successfully'
    ]);
}

/**
 * Delete professional profile
 * 
 * @param string $professionalId Professional ID
 */
function deleteProfessional($professionalId) {
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare("DELETE FROM professionals WHERE id = ?");
        $stmt->execute([$professionalId]);
    } else {
        $db->professionals->deleteOne(['id' => $professionalId]);
    }
    
    sendResponse([
        'success' => true,
        'message' => 'Professional deleted successfully'
    ]);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate a unique ID for professional
 * 
 * @return string Unique ID
 */
function generateUniqueId() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

/**
 * Check if subdomain already exists
 * 
 * @param string $subdomain Subdomain to check
 * @return bool True if exists, false otherwise
 */
function subdomainExists($subdomain) {
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare("SELECT COUNT(*) FROM professionals WHERE subdomain = ?");
        $stmt->execute([$subdomain]);
        return $stmt->fetchColumn() > 0;
    } else {
        $count = $db->professionals->countDocuments(['subdomain' => $subdomain]);
        return $count > 0;
    }
}

// ============================================================================
// END OF FILE
// ============================================================================
?>
