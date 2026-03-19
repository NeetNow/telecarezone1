-- TeleCareZone MySQL Database Schema
-- Compatible with Hostinger and any MySQL 5.7+ hosting

-- Create database
CREATE DATABASE IF NOT EXISTS telecarezone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE telecarezone_db;

-- Professionals Table
CREATE TABLE IF NOT EXISTS professionals (
    id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    speciality VARCHAR(255),
    ug_qualification VARCHAR(255),
    pg_qualification VARCHAR(255),
    superspeciality VARCHAR(255),
    area_of_expertise TEXT,
    instagram VARCHAR(255),
    youtube VARCHAR(255),
    twitter VARCHAR(255),
    consulting_fees DECIMAL(10,2) DEFAULT 0.00,
    subdomain VARCHAR(255) UNIQUE NOT NULL,
    profile_photo VARCHAR(500),
    bio TEXT,
    experience_years INT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    razorpay_account_id VARCHAR(255),
    
    -- Enhanced fields for landing page customization
    intro_video_1 VARCHAR(500),
    intro_video_2 VARCHAR(500),
    intro_video_3 VARCHAR(500),
    testimonial_video_1 VARCHAR(500),
    testimonial_video_2 VARCHAR(500),
    template_image_1 VARCHAR(500),
    template_image_2 VARCHAR(500),
    theme_color VARCHAR(7) DEFAULT '#667eea',
    practice_description TEXT,
    informatory_image_1 VARCHAR(500),
    informatory_image_2 VARCHAR(500),
    available_days JSON,
    morning_slots VARCHAR(50),
    evening_slots VARCHAR(50),
    
    -- Bank details (should be encrypted in production)
    bank_name VARCHAR(255),
    account_number VARCHAR(255),
    ifsc_code VARCHAR(20),
    branch_name VARCHAR(255),
    pin_code VARCHAR(10),
    upi_phone VARCHAR(20),
    account_holder_name VARCHAR(255),
    address TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_subdomain (subdomain),
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patients Table
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

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(50) PRIMARY KEY,
    professional_id VARCHAR(50) NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    appointment_datetime DATETIME NOT NULL,
    patient_first_name VARCHAR(255) NOT NULL,
    patient_last_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    patient_email VARCHAR(255) NOT NULL,
    patient_gender ENUM('male', 'female', 'other') NOT NULL,
    patient_age INT NOT NULL,
    referral_source VARCHAR(255) NOT NULL,
    issue_detail TEXT NOT NULL,
    payment_id VARCHAR(255),
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    meeting_link VARCHAR(500),
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    reminder_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_professional (professional_id),
    INDEX idx_datetime (appointment_datetime),
    INDEX idx_patient_phone (patient_phone),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(50) PRIMARY KEY,
    appointment_id VARCHAR(50) NOT NULL,
    professional_id VARCHAR(50) NOT NULL,
    razorpay_payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    doctor_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_professional (professional_id),
    INDEX idx_appointment (appointment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR(50) PRIMARY KEY,
    professional_id VARCHAR(50) NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    rating INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_professional (professional_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO admin_users (username, password) 
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Sample data migration from MongoDB (optional)
-- This can be run after setting up to migrate existing data
