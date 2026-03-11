<?php
/**
 * Appointments API Handlers
 */

function handleAppointmentsRoutes($segments, $method, $data, $queryParams) {
    $action = $segments[1] ?? '';
    
    if (empty($action)) {
        // POST /appointments
        if ($method === 'POST') {
            createAppointment($data);
        } else {
            sendError('Method not allowed', 405);
        }
    } elseif ($action === 'check-availability') {
        // GET /appointments/check-availability?professional_id=xxx&date=xxx
        if ($method === 'GET') {
            checkSlotAvailability($queryParams);
        } else {
            sendError('Method not allowed', 405);
        }
    } elseif ($action === 'professional' && isset($segments[2])) {
        // GET /appointments/professional/{id} - No auth required for doctor dashboard
        getProfessionalAppointments($segments[2]);
    } elseif (strpos($action, 'complete-payment') !== false || (isset($segments[2]) && $segments[2] === 'complete-payment')) {
        // PUT /appointments/{id}/complete-payment
        $appointmentId = $segments[0] === 'appointments' ? $segments[1] : $action;
        completeAppointmentPayment($appointmentId, $queryParams);
    } else {
        // GET /appointments/{id}
        getAppointmentById($action);
    }
}

function createAppointment($data) {
    // Validate required fields
    $required = ['professional_id', 'appointment_datetime', 'patient_first_name', 'patient_last_name', 
                 'patient_phone', 'patient_email', 'patient_gender', 'patient_age', 'referral_source', 'issue_detail'];
    
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            sendError("Field {$field} is required", 400);
        }
    }

    $slotTs = strtotime($data['appointment_datetime']);
    if (!$slotTs) {
        sendError('Invalid appointment_datetime', 400);
    }
    $slotStart = date('Y-m-d H:i:00', $slotTs);
    $slotEnd = date('Y-m-d H:i:00', strtotime($slotStart . ' +1 minute'));
    
    $db = Database::getInstance()->getDB();
    
    // Verify professional exists
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare('SELECT id FROM professionals WHERE id = ? AND status = ?');
        $stmt->execute([$data['professional_id'], 'approved']);
        if (!$stmt->fetch()) {
            sendError('Professional not found', 404);
        }

        // Prevent double booking (same professional + same minute)
        $stmt = $conn->prepare('SELECT id FROM appointments WHERE professional_id = ? AND appointment_datetime >= ? AND appointment_datetime < ? AND status != ? LIMIT 1');
        $stmt->execute([$data['professional_id'], $slotStart, $slotEnd, 'cancelled']);
        if ($stmt->fetch()) {
            sendError('Slot already booked', 409);
        }
    } else {
        $professional = $db->professionals->findOne(['id' => $data['professional_id'], 'status' => 'approved']);
        if (!$professional) {
            sendError('Professional not found', 404);
        }

        $minutePrefix = date('Y-m-d H:i', $slotTs);
        $existing = $db->appointments->findOne([
            'professional_id' => $data['professional_id'],
            'appointment_datetime' => ['$regex' => "^$minutePrefix"],
            'status' => ['$ne' => 'cancelled']
        ]);
        if ($existing) {
            sendError('Slot already booked', 409);
        }
    }
    
    // Create patient record
    $patientId = uniqid('pat_');
    $patient = [
        'id' => $patientId,
        'first_name' => $data['patient_first_name'],
        'last_name' => $data['patient_last_name'],
        'phone' => $data['patient_phone'],
        'email' => $data['patient_email'],
        'gender' => $data['patient_gender'],
        'age' => intval($data['patient_age']),
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    if ($db === 'mysql') {
        $fields = implode(', ', array_keys($patient));
        $placeholders = implode(', ', array_fill(0, count($patient), '?'));
        $stmt = $conn->prepare("INSERT INTO patients ({$fields}) VALUES ({$placeholders})");
        $stmt->execute(array_values($patient));
    } else {
        $db->patients->insertOne($patient);
    }
    
    // Create appointment
    $appointment = [
        'id' => uniqid('appt_'),
        'professional_id' => $data['professional_id'],
        'patient_id' => $patientId,
        'appointment_datetime' => $slotStart,
        'patient_first_name' => $data['patient_first_name'],
        'patient_last_name' => $data['patient_last_name'],
        'patient_phone' => $data['patient_phone'],
        'patient_email' => $data['patient_email'],
        'patient_gender' => $data['patient_gender'],
        'patient_age' => intval($data['patient_age']),
        'referral_source' => $data['referral_source'],
        'issue_detail' => $data['issue_detail'],
        'payment_status' => 'pending',
        'status' => 'scheduled',
        'whatsapp_sent' => 0,
        'reminder_sent' => 0,
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    if ($db === 'mysql') {
        $fields = implode(', ', array_keys($appointment));
        $placeholders = implode(', ', array_fill(0, count($appointment), '?'));
        $stmt = $conn->prepare("INSERT INTO appointments ({$fields}) VALUES ({$placeholders})");
        $stmt->execute(array_values($appointment));
    } else {
        $db->appointments->insertOne($appointment);
    }
    
    unset($appointment['_id']);
    sendResponse($appointment, 201);
}

function checkSlotAvailability($queryParams) {
    $professionalId = $queryParams['professional_id'] ?? '';
    $date = $queryParams['date'] ?? '';

    if (empty($professionalId) || empty($date)) {
        sendError('professional_id and date are required', 400);
    }

    $timestamp = strtotime($date);
    if ($timestamp) {
        $date = date('Y-m-d', $timestamp);
    }

    $db = Database::getInstance()->getDB();

    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare('SELECT appointment_datetime FROM appointments WHERE professional_id = ? AND DATE(appointment_datetime) = ? AND status != ?');
        $stmt->execute([$professionalId, $date, 'cancelled']);
        $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $appointments = iterator_to_array($db->appointments->find([
            'professional_id' => $professionalId,
            'appointment_datetime' => ['$regex' => "^$date"],
            'status' => ['$ne' => 'cancelled']
        ]));
        $appointments = json_decode(json_encode($appointments), true);
    }

    $bookedSlots = [];
    foreach ($appointments as $appointment) {
        $ts = strtotime($appointment['appointment_datetime'] ?? '');
        if ($ts) {
            $bookedSlots[] = date('Y-m-d H:i:00', $ts);
        }
    }

    sendResponse(['booked_slots' => $bookedSlots]);
}

function getAppointmentById($id) {
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare('SELECT * FROM appointments WHERE id = ?');
        $stmt->execute([$id]);
        $appointment = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        $appointment = $db->appointments->findOne(['id' => $id]);
        if ($appointment) {
            $appointment = json_decode(json_encode($appointment), true);
            unset($appointment['_id']);
        }
    }
    
    if (!$appointment) {
        sendError('Appointment not found', 404);
    }
    
    sendResponse($appointment);
}

function getProfessionalAppointments($professionalId) {
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare('SELECT * FROM appointments WHERE professional_id = ?');
        $stmt->execute([$professionalId]);
        $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $appointments = iterator_to_array($db->appointments->find(['professional_id' => $professionalId]));
        $appointments = json_decode(json_encode($appointments), true);
        foreach ($appointments as &$appt) {
            unset($appt['_id']);
        }
    }
    
    sendResponse($appointments);
}

function completeAppointmentPayment($appointmentId, $queryParams) {
    $paymentId = $queryParams['payment_id'] ?? '';
    $razorpayOrderId = $queryParams['razorpay_order_id'] ?? '';
    
    if (empty($paymentId) || empty($razorpayOrderId)) {
        sendError('payment_id and razorpay_order_id are required', 400);
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
    
    // Generate meeting link
    $googleMeet = new GoogleMeetService();
    $meetingLink = $googleMeet->createMeeting($appointment, $professional);
    
    // Update appointment
    $updateData = [
        'payment_id' => $paymentId,
        'payment_status' => 'completed',
        'meeting_link' => $meetingLink
    ];
    
    if ($db === 'mysql') {
        $stmt = $conn->prepare('UPDATE appointments SET payment_id = ?, payment_status = ?, meeting_link = ?, whatsapp_sent = 1 WHERE id = ?');
        $stmt->execute([$paymentId, 'completed', $meetingLink, $appointmentId]);
    } else {
        $db->appointments->updateOne(
            ['id' => $appointmentId],
            ['$set' => array_merge($updateData, ['whatsapp_sent' => true])]
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
        'razorpay_order_id' => $razorpayOrderId,
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
    
    sendResponse(['success' => true, 'meeting_link' => $meetingLink]);
}
?>