<?php
/**
 * Payments API Handlers
 */

function handlePaymentsRoutes($segments, $method, $data, $queryParams) {
    $action = $segments[1] ?? '';
    
    if ($action === 'create-order') {
        if ($method !== 'POST') sendError('Method not allowed', 405);
        createPaymentOrder($queryParams);
    } elseif ($action === 'verify-payment') {
        if ($method !== 'POST') sendError('Method not allowed', 405);
        verifyPayment($data);
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
    
    // Use RazorpayService to create real order
    $razorpay = new RazorpayService();
    $result = $razorpay->createOrder($professional['consulting_fees']);
    
    if ($result['success']) {
        sendResponse([
            'success' => true,
            'order_id' => $result['order_id'],
            'amount' => $result['amount'],
            'currency' => $result['currency'],
            'key_id' => $result['key_id'],
            'appointment_id' => $appointmentId,
            'professional_id' => $appointment['professional_id'],
            'consulting_fees' => $professional['consulting_fees']
        ]);
    } else {
        sendError('Failed to create payment order: ' . ($result['error'] ?? 'Unknown error'), 500);
    }
}

function verifyPayment($data) {
    $orderId = $data['order_id'] ?? '';
    $paymentId = $data['payment_id'] ?? '';
    $signature = $data['signature'] ?? '';
    $appointmentId = $data['appointment_id'] ?? '';
    
    if (empty($orderId) || empty($paymentId) || empty($signature) || empty($appointmentId)) {
        sendError('Missing required payment verification fields', 400);
    }
    
    // Verify payment signature
    $razorpay = new RazorpayService();
    $isValid = $razorpay->verifyPaymentSignature($orderId, $paymentId, $signature);
    
    if (!$isValid) {
        sendError('Invalid payment signature', 400);
    }
    
    // Get appointment details
    $db = Database::getInstance()->getDB();
    
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
    
    // Get professional details
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
    
    // Generate meeting link
    $googleMeet = new GoogleMeetService();
    $meetingLink = $googleMeet->createMeeting($appointment, $professional);
    
    // Update appointment payment status
    if ($db === 'mysql') {
        $stmt = $conn->prepare('UPDATE appointments SET payment_id = ?, payment_status = ?, meeting_link = ?, whatsapp_sent = 1 WHERE id = ?');
        $stmt->execute([$paymentId, 'completed', $meetingLink, $appointmentId]);
    } else {
        $db->appointments->updateOne(
            ['id' => $appointmentId],
            ['$set' => ['payment_status' => 'completed', 'payment_id' => $paymentId, 'meeting_link' => $meetingLink, 'whatsapp_sent' => true]]
        );
    }
    
    // Create payment record
    $amount = $professional['consulting_fees'];
    $platformFee = $amount * (PLATFORM_FEE_PERCENTAGE / 100);
    $doctorAmount = $amount * (DOCTOR_FEE_PERCENTAGE / 100);
    
    $payment = [
        'id' => uniqid('pay_'),
        'appointment_id' => $appointmentId,
        'professional_id' => $professional['id'],
        'razorpay_payment_id' => $paymentId,
        'razorpay_order_id' => $orderId,
        'amount' => $amount,
        'platform_fee' => $platformFee,
        'doctor_amount' => $doctorAmount,
        'status' => 'completed',
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    if ($db === 'mysql') {
        $fields = implode(', ', array_keys($payment));
        $placeholders = implode(', ', array_fill(0, count($payment), '?'));
        $stmt = $conn->prepare("INSERT INTO payments ({$fields}) VALUES ({$placeholders})");
        $stmt->execute(array_values($payment));
    } else {
        $db->payments->insertOne($payment);
    }
    
    // Send WhatsApp notifications
    $fast2sms = new Fast2SMSService();
    $appointment['meeting_link'] = $meetingLink;
    
    $fast2sms->sendAppointmentConfirmation($appointment, $professional);
    $fast2sms->sendDoctorNotification($appointment, $professional);
    
    sendResponse([
        'success' => true,
        'message' => 'Payment verified successfully',
        'appointment_id' => $appointmentId,
        'payment_id' => $paymentId,
        'meeting_link' => $meetingLink
    ]);
}
?>