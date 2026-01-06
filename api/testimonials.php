<?php
/**
 * Testimonials API Handlers
 */

function handleTestimonialsRoutes($segments, $method, $data) {
    $action = $segments[1] ?? '';
    
    if (empty($action)) {
        // POST /testimonials
        if ($method === 'POST') {
            JWTService::verifyToken();
            createTestimonial($data);
        } else {
            sendError('Method not allowed', 405);
        }
    } else {
        // GET /testimonials/{professional_id}
        if ($method === 'GET') {
            getProfessionalTestimonials($action);
        } else {
            sendError('Method not allowed', 405);
        }
    }
}

function createTestimonial($data) {
    $required = ['professional_id', 'patient_name', 'content'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            sendError("Field {$field} is required", 400);
        }
    }
    
    $testimonial = [
        'id' => uniqid('test_'),
        'professional_id' => $data['professional_id'],
        'patient_name' => $data['patient_name'],
        'content' => $data['content'],
        'rating' => intval($data['rating'] ?? 5),
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $fields = implode(', ', array_keys($testimonial));
        $placeholders = implode(', ', array_fill(0, count($testimonial), '?'));
        $stmt = $conn->prepare("INSERT INTO testimonials ({$fields}) VALUES ({$placeholders})");
        $stmt->execute(array_values($testimonial));
    } else {
        $db->testimonials->insertOne($testimonial);
    }
    
    unset($testimonial['_id']);
    sendResponse($testimonial, 201);
}

function getProfessionalTestimonials($professionalId) {
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare('SELECT * FROM testimonials WHERE professional_id = ? ORDER BY created_at DESC LIMIT 100');
        $stmt->execute([$professionalId]);
        $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $testimonials = iterator_to_array($db->testimonials->find(
            ['professional_id' => $professionalId],
            ['limit' => 100, 'sort' => ['created_at' => -1]]
        ));
        $testimonials = json_decode(json_encode($testimonials), true);
        foreach ($testimonials as &$test) {
            unset($test['_id']);
        }
    }
    
    sendResponse($testimonials);
}
?>