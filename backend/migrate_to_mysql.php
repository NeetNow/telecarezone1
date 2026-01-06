<?php
/**
 * Migration Script: MongoDB to MySQL
 * Migrates all data from MongoDB to MySQL
 */

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config/database.php';

// Connect to MongoDB
$mongoClient = new MongoDB\Client('mongodb://localhost:27017');
$mongodb = $mongoClient->selectDatabase('telecarezone_db');

// Connect to MySQL
$mysql = new PDO(
    'mysql:host=localhost;dbname=telecarezone_db;charset=utf8mb4',
    'root',
    ''
);
$mysql->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

echo "=== TeleCareZone: MongoDB to MySQL Migration ===\n\n";

// Migrate Professionals
echo "Migrating Professionals...\n";
$professionals = $mongodb->professionals->find([], ['projection' => ['_id' => 0]]);
$profCount = 0;

foreach ($professionals as $prof) {
    $prof = json_decode(json_encode($prof), true);
    
    $stmt = $mysql->prepare("
        INSERT INTO professionals (
            id, first_name, last_name, phone, email, speciality,
            ug_qualification, pg_qualification, superspeciality, area_of_expertise,
            instagram, youtube, twitter, consulting_fees, subdomain,
            profile_photo, bio, experience_years, status, razorpay_account_id, created_at
        ) VALUES (
            :id, :first_name, :last_name, :phone, :email, :speciality,
            :ug_qualification, :pg_qualification, :superspeciality, :area_of_expertise,
            :instagram, :youtube, :twitter, :consulting_fees, :subdomain,
            :profile_photo, :bio, :experience_years, :status, :razorpay_account_id, :created_at
        ) ON DUPLICATE KEY UPDATE
            first_name = VALUES(first_name),
            last_name = VALUES(last_name)
    ");
    
    $stmt->execute([
        ':id' => $prof['id'] ?? null,
        ':first_name' => $prof['first_name'] ?? '',
        ':last_name' => $prof['last_name'] ?? '',
        ':phone' => $prof['phone'] ?? '',
        ':email' => $prof['email'] ?? '',
        ':speciality' => $prof['speciality'] ?? null,
        ':ug_qualification' => $prof['ug_qualification'] ?? null,
        ':pg_qualification' => $prof['pg_qualification'] ?? null,
        ':superspeciality' => $prof['superspeciality'] ?? null,
        ':area_of_expertise' => $prof['area_of_expertise'] ?? null,
        ':instagram' => $prof['instagram'] ?? null,
        ':youtube' => $prof['youtube'] ?? null,
        ':twitter' => $prof['twitter'] ?? null,
        ':consulting_fees' => $prof['consulting_fees'] ?? 0,
        ':subdomain' => $prof['subdomain'] ?? '',
        ':profile_photo' => $prof['profile_photo'] ?? null,
        ':bio' => $prof['bio'] ?? null,
        ':experience_years' => $prof['experience_years'] ?? null,
        ':status' => $prof['status'] ?? 'pending',
        ':razorpay_account_id' => $prof['razorpay_account_id'] ?? null,
        ':created_at' => isset($prof['created_at']) ? date('Y-m-d H:i:s', strtotime($prof['created_at'])) : date('Y-m-d H:i:s')
    ]);
    
    $profCount++;
}

echo "✓ Migrated $profCount professionals\n\n";

// Migrate Admin Users
echo "Migrating Admin Users...\n";
$adminUsers = $mongodb->admin_users->find([], ['projection' => ['_id' => 0]]);
$adminCount = 0;

foreach ($adminUsers as $admin) {
    $admin = json_decode(json_encode($admin), true);
    
    $stmt = $mysql->prepare("
        INSERT INTO admin_users (username, password, created_at)
        VALUES (:username, :password, :created_at)
        ON DUPLICATE KEY UPDATE password = VALUES(password)
    ");
    
    // Use password_hash field from MongoDB or password field
    $passwordHash = $admin['password_hash'] ?? $admin['password'] ?? '';
    
    $stmt->execute([
        ':username' => $admin['username'] ?? '',
        ':password' => $passwordHash,
        ':created_at' => isset($admin['created_at']) ? date('Y-m-d H:i:s', strtotime($admin['created_at'])) : date('Y-m-d H:i:s')
    ]);
    
    $adminCount++;
}

echo "✓ Migrated $adminCount admin users\n\n";

// Migrate Appointments (if any)
echo "Migrating Appointments...\n";
$appointments = $mongodb->appointments->find([], ['projection' => ['_id' => 0]]);
$apptCount = 0;

foreach ($appointments as $appt) {
    $appt = json_decode(json_encode($appt), true);
    
    $stmt = $mysql->prepare("
        INSERT INTO appointments (
            id, professional_id, patient_id, appointment_datetime,
            patient_first_name, patient_last_name, patient_phone, patient_email,
            patient_gender, patient_age, referral_source, issue_detail,
            payment_id, payment_status, meeting_link, status, created_at
        ) VALUES (
            :id, :professional_id, :patient_id, :appointment_datetime,
            :patient_first_name, :patient_last_name, :patient_phone, :patient_email,
            :patient_gender, :patient_age, :referral_source, :issue_detail,
            :payment_id, :payment_status, :meeting_link, :status, :created_at
        ) ON DUPLICATE KEY UPDATE
            status = VALUES(status)
    ");
    
    $stmt->execute([
        ':id' => $appt['id'] ?? null,
        ':professional_id' => $appt['professional_id'] ?? '',
        ':patient_id' => $appt['patient_id'] ?? '',
        ':appointment_datetime' => isset($appt['appointment_datetime']) ? date('Y-m-d H:i:s', strtotime($appt['appointment_datetime'])) : date('Y-m-d H:i:s'),
        ':patient_first_name' => $appt['patient_first_name'] ?? '',
        ':patient_last_name' => $appt['patient_last_name'] ?? '',
        ':patient_phone' => $appt['patient_phone'] ?? '',
        ':patient_email' => $appt['patient_email'] ?? '',
        ':patient_gender' => $appt['patient_gender'] ?? 'other',
        ':patient_age' => $appt['patient_age'] ?? 0,
        ':referral_source' => $appt['referral_source'] ?? '',
        ':issue_detail' => $appt['issue_detail'] ?? '',
        ':payment_id' => $appt['payment_id'] ?? null,
        ':payment_status' => $appt['payment_status'] ?? 'pending',
        ':meeting_link' => $appt['meeting_link'] ?? null,
        ':status' => $appt['status'] ?? 'scheduled',
        ':created_at' => isset($appt['created_at']) ? date('Y-m-d H:i:s', strtotime($appt['created_at'])) : date('Y-m-d H:i:s')
    ]);
    
    $apptCount++;
}

echo "✓ Migrated $apptCount appointments\n\n";

echo "=== Migration Complete ===\n";
echo "Summary:\n";
echo "- Professionals: $profCount\n";
echo "- Admin Users: $adminCount\n";
echo "- Appointments: $apptCount\n";
echo "\nNext step: Update database.php to use MySQL by setting DB_TYPE=mysql\n";
?>
