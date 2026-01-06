<?php
/**
 * Analytics API Handlers
 */

function getAnalyticsByProfessional($professionalId) {
    $db = Database::getInstance()->getDB();
    
    // Get appointments
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        
        // Count appointments
        $stmt = $conn->prepare('SELECT COUNT(*) as total, SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as completed FROM appointments WHERE professional_id = ?');
        $stmt->execute([$professionalId]);
        $apptStats = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Sum payments
        $stmt = $conn->prepare('SELECT SUM(amount) as total_revenue, SUM(platform_fee) as platform_revenue, SUM(doctor_amount) as doctor_revenue FROM payments WHERE professional_id = ?');
        $stmt->execute([$professionalId]);
        $paymentStats = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        // MongoDB aggregation
        $appointments = iterator_to_array($db->appointments->find(['professional_id' => $professionalId]));
        $apptStats = [
            'total' => count($appointments),
            'completed' => count(array_filter($appointments, fn($a) => $a['status'] === 'completed'))
        ];
        
        $payments = iterator_to_array($db->payments->find(['professional_id' => $professionalId]));
        $paymentStats = [
            'total_revenue' => array_sum(array_column($payments, 'amount')),
            'platform_revenue' => array_sum(array_column($payments, 'platform_fee')),
            'doctor_revenue' => array_sum(array_column($payments, 'doctor_amount'))
        ];
    }
    
    $analytics = [
        'professional_id' => $professionalId,
        'total_appointments' => intval($apptStats['total'] ?? 0),
        'completed_appointments' => intval($apptStats['completed'] ?? 0),
        'total_revenue' => floatval($paymentStats['total_revenue'] ?? 0),
        'platform_revenue' => floatval($paymentStats['platform_revenue'] ?? 0),
        'doctor_revenue' => floatval($paymentStats['doctor_revenue'] ?? 0)
    ];
    
    sendResponse($analytics);
}

function getPlatformAnalytics() {
    $db = Database::getInstance()->getDB();
    
    if ($db === 'mysql') {
        $conn = Database::getInstance()->getConnection();
        
        // Count professionals
        $stmt = $conn->query('SELECT COUNT(*) as total, SUM(CASE WHEN status = "approved" THEN 1 ELSE 0 END) as approved, SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending FROM professionals');
        $profStats = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Count appointments
        $stmt = $conn->query('SELECT COUNT(*) as total, SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as completed FROM appointments');
        $apptStats = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Sum payments
        $stmt = $conn->query('SELECT SUM(amount) as total_revenue, SUM(platform_fee) as platform_revenue FROM payments');
        $paymentStats = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        $professionals = iterator_to_array($db->professionals->find());
        $profStats = [
            'total' => count($professionals),
            'approved' => count(array_filter($professionals, fn($p) => $p['status'] === 'approved')),
            'pending' => count(array_filter($professionals, fn($p) => $p['status'] === 'pending'))
        ];
        
        $appointments = iterator_to_array($db->appointments->find());
        $apptStats = [
            'total' => count($appointments),
            'completed' => count(array_filter($appointments, fn($a) => $a['status'] === 'completed'))
        ];
        
        $payments = iterator_to_array($db->payments->find());
        $paymentStats = [
            'total_revenue' => array_sum(array_column($payments, 'amount')),
            'platform_revenue' => array_sum(array_column($payments, 'platform_fee'))
        ];
    }
    
    $analytics = [
        'total_professionals' => intval($profStats['total'] ?? 0),
        'approved_professionals' => intval($profStats['approved'] ?? 0),
        'pending_professionals' => intval($profStats['pending'] ?? 0),
        'total_appointments' => intval($apptStats['total'] ?? 0),
        'completed_appointments' => intval($apptStats['completed'] ?? 0),
        'total_revenue' => floatval($paymentStats['total_revenue'] ?? 0),
        'platform_revenue' => floatval($paymentStats['platform_revenue'] ?? 0)
    ];
    
    sendResponse($analytics);
}
?>