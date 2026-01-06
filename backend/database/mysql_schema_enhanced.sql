-- ============================================================================
-- TeleCareZone Enhanced MySQL Database Schema
-- ============================================================================
-- Version: 2.0.0
-- Date: December 2025
-- Compatible with: XAMPP, WAMP, Hostinger
-- ============================================================================

-- Create database
CREATE DATABASE IF NOT EXISTS telecarezone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE telecarezone_db;

-- ============================================================================
-- PROFESSIONALS TABLE (Enhanced with 27+ fields)
-- ============================================================================
CREATE TABLE IF NOT EXISTS professionals (
    -- Primary Key
    id VARCHAR(50) PRIMARY KEY,
    
    -- Basic Information
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    state VARCHAR(100),
    display_name VARCHAR(255) NOT NULL,
    
    -- Professional Information
    profession_qualification TEXT,
    bio TEXT,
    experience_years INT,
    
    -- Theme & Branding
    theme_color VARCHAR(7) DEFAULT '#667eea',
    
    -- Social Media URLs
    instagram VARCHAR(500),
    youtube VARCHAR(500),
    linkedin VARCHAR(500),
    facebook VARCHAR(500),
    twitter VARCHAR(500),
    
    -- Bank Details (Encrypted in production)
    bank_account_name VARCHAR(255),
    bank_account_number VARCHAR(255),
    bank_ifsc_code VARCHAR(20),
    bank_branch VARCHAR(255),
    
    -- Appointment Settings
    appointment_days JSON,
    morning_time VARCHAR(50) DEFAULT '9:00 AM - 1:00 PM',
    evening_time VARCHAR(50) DEFAULT '5:00 PM - 9:00 PM',
    
    -- Media Links
    intro_video VARCHAR(500),
    testimonial_1 VARCHAR(500),
    testimonial_2 VARCHAR(500),
    testimonial_3 VARCHAR(500),
    
    -- Consulting Fee
    consulting_fees DECIMAL(10,2) DEFAULT 500.00,
    
    -- File Uploads
    profile_photo VARCHAR(500),
    
    -- System Fields
    subdomain VARCHAR(255) UNIQUE NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    razorpay_account_id VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for Performance
    INDEX idx_subdomain (subdomain),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_display_name (display_name)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- PATIENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female', 'other'),
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_phone (phone),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- APPOINTMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(50) PRIMARY KEY,
    professional_id VARCHAR(50) NOT NULL,
    patient_id VARCHAR(50),
    
    -- Appointment Details
    appointment_datetime DATETIME NOT NULL,
    duration_minutes INT DEFAULT 15,
    
    -- Patient Information
    patient_first_name VARCHAR(255) NOT NULL,
    patient_last_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    patient_email VARCHAR(255) NOT NULL,
    patient_gender ENUM('male', 'female', 'other') NOT NULL,
    patient_age INT NOT NULL,
    
    -- Additional Info
    referral_source VARCHAR(255),
    issue_detail TEXT NOT NULL,
    
    -- Payment & Meeting
    payment_id VARCHAR(255),
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    meeting_link VARCHAR(500),
    
    -- Status & Notifications
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    email_sent BOOLEAN DEFAULT FALSE,
    reminder_sent BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_professional (professional_id),
    INDEX idx_datetime (appointment_datetime),
    INDEX idx_patient_phone (patient_phone),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- PAYMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(50) PRIMARY KEY,
    appointment_id VARCHAR(50) NOT NULL,
    professional_id VARCHAR(50) NOT NULL,
    
    -- Razorpay Details
    razorpay_payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    
    -- Amount Breakdown
    amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    doctor_amount DECIMAL(10,2) NOT NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_professional (professional_id),
    INDEX idx_appointment (appointment_id),
    INDEX idx_status (status)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TESTIMONIALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR(50) PRIMARY KEY,
    professional_id VARCHAR(50) NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    rating INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_professional (professional_id),
    INDEX idx_rating (rating)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- ADMIN USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INSERT DEFAULT ADMIN USER
-- ============================================================================
-- Username: teleadmin
-- Password: teleadm@2026
INSERT IGNORE INTO admin_users (username, password, full_name, email) 
VALUES ('teleadmin', '$2b$12$Z/OQZ.WFWQwBPE1C0IOMYuzVyl5d.ORqps5tIJ/KB7ssrjkMiQC72', 'Admin User', 'admin@mykitchenfarm.com');

-- ============================================================================
-- INSERT SAMPLE PROFESSIONALS (3 Experts as requested)
-- ============================================================================

-- Expert 1: Dr. Rakesh Zha (MBBS MD)
INSERT INTO professionals (
    id, first_name, last_name, email, display_name, 
    profession_qualification, bio, experience_years,
    consulting_fees, subdomain, status, theme_color,
    appointment_days, morning_time, evening_time,
    profile_photo, created_at
) VALUES (
    'rakesh-zha-001',
    'Rakesh',
    'Zha',
    'rakesh.zha@telecarezone.com',
    'Dr. Rakesh Zha',
    'MBBS, MD (General Medicine)',
    'Dr. Rakesh Zha is a highly experienced General Medicine specialist with 13 years of clinical practice. He specializes in diagnosing and treating a wide range of medical conditions with a patient-centered approach.',
    13,
    700.00,
    'rakeshzha',
    'approved',
    '#3B82F6',
    '["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]',
    '9:00 AM - 1:00 PM',
    '5:00 PM - 9:00 PM',
    '/uploads/profiles/rakeshzha.jpg',
    NOW()
);

-- Expert 2: Dr. Rubina Shah (BAMS MD)
INSERT INTO professionals (
    id, first_name, last_name, email, display_name,
    profession_qualification, bio, experience_years,
    consulting_fees, subdomain, status, theme_color,
    appointment_days, morning_time, evening_time,
    profile_photo, created_at
) VALUES (
    'rubina-shah-002',
    'Rubina',
    'Shah',
    'rubina.shah@telecarezone.com',
    'Dr. Rubina Shah',
    'BAMS, MD (Rasashastra)',
    'Dr. Rubina Shah is an Ayurvedic medicine expert specializing in Rasashastra with 8 years of experience. She combines traditional Ayurvedic wisdom with modern medical understanding to provide holistic healthcare solutions.',
    8,
    500.00,
    'rubinashah',
    'approved',
    '#10B981',
    '["Monday","Tuesday","Wednesday","Thursday","Friday"]',
    '10:00 AM - 2:00 PM',
    '6:00 PM - 9:00 PM',
    '/uploads/profiles/rubinashah.jpg',
    NOW()
);

-- Expert 3: Sania Batra (Wellness Coach)
INSERT INTO professionals (
    id, first_name, last_name, email, display_name,
    profession_qualification, bio, experience_years,
    consulting_fees, subdomain, status, theme_color,
    appointment_days, morning_time, evening_time,
    profile_photo, created_at
) VALUES (
    'sania-batra-003',
    'Sania',
    'Batra',
    'sania.batra@telecarezone.com',
    'Sania Batra',
    'Certified Wellness Coach',
    'Sania Batra is a dedicated Wellness Coach specializing in mental healing and relaxation techniques. With a holistic approach to wellness, she helps clients achieve balance, reduce stress, and enhance overall well-being.',
    5,
    300.00,
    'saniabatra',
    'approved',
    '#8B5CF6',
    '["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]',
    '8:00 AM - 12:00 PM',
    '4:00 PM - 8:00 PM',
    '/uploads/profiles/saniabatra.jpg',
    NOW()
);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
