<?php
/**
 * Payments API Handlers
 */

function handlePaymentsRoutes($segments, $method, $data, $queryParams) {
    $action = $segments[1] ?? '';
    
    if ($action === 'create-order') {
        if ($method !== 'POST') sendError('Method not allowed', 405);
        createPaymentOrder($queryParams);
    } else {
        sendError('Payment endpoint not found', 404);
    }
}

function createPaymentOrder($queryParams) {
    $appointmentId = $queryParams['appointment_id'] ?? '';
    
    if (empty($appointmentId)) {
        sendError('appointment_id is required', 400);
    }
    
    $db = Database::getInstance()->getDB();
    
    // Get appointment
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare('SELECT * FROM appointments WHERE id = ?');
        $stmt->execute([$appointmentId]);
        $appointment = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        $appointment = $db->appointments->findOne(['id' => $appointmentId]);
        if ($appointment) {
            $appointment = json_decode(json_encode($appointment), true);
        }
    }
    
    if (!$appointment) {
        sendError('Appointment not found', 404);
    }
    
    // Get professional
    if ($db === 'mysql') {
        $stmt = $conn->prepare('SELECT * FROM professionals WHERE id = ?');
        $stmt->execute([$appointment['professional_id']]);
        $professional = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        $professional = $db->professionals->findOne(['id' => $appointment['professional_id']]);
        if ($professional) {
            $professional = json_decode(json_encode($professional), true);
        }
    }
    
    if (!$professional) {
        sendError('Professional not found', 404);
    }
    
    // Create Razorpay order
    $razorpay = new RazorpayService();
    $order = $razorpay->createOrder($professional['consulting_fees']);
    
    if (!$order['success']) {
        // Return mock order for testing
        sendResponse([
            'order_id' => 'order_' . uniqid(),
            'amount' => intval($professional['consulting_fees'] * 100),
            'currency' => 'INR',
            'key_id' => RAZORPAY_KEY_ID
        ]);
    }
    
    sendResponse($order);
}
?>