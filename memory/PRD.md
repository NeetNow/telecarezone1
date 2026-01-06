# TeleCareZone - Product Requirements Document

## Overview
TeleCareZone is a production-grade SAAS platform for healthcare professionals to manage online teleconsultations, appointments, and patient interactions.

## Core Features

### 1. Main Website
- **Homepage**: Modern, professional design inspired by mfine.co
  - Hero section with CTA buttons
  - Stats bar (10L+ consultations, 500+ doctors, 4.8 rating, 24/7 availability)
  - Specialties grid (General Physician, Dermatologist, Psychiatrist, etc.)
  - How it Works section (3 steps)
  - Healthcare Experts section displaying approved doctors
  - Testimonials section
  - CTA banner
  - Professional footer with navigation links

- **Static Pages**:
  - `/about` - About TeleCareZone
  - `/blogs` - Healthcare articles with category filtering
  - `/contact` - Contact form and company information
  - `/privacy-policy` - Privacy Policy
  - `/terms` - Terms of Service

### 2. Expert Subdomains
- Each approved expert gets a personalized landing page
- URL format: `/doctor/{subdomain}` (e.g., `/doctor/priya-sharma`)
- Customizable theme colors per doctor

### 3. Admin Dashboard
- **Login**: `/admin/login`
- **Credentials**: `teleadmin` / `teleadm@2026`
- **Features**:
  - List of all doctors
  - Analytics (week/month/quarter revenue)
  - Individual doctor analytics
  - Leads from "Join as Expert" form
  - 27-field onboarding form for new doctors

## Technology Stack
- **Frontend**: React 18, TailwindCSS, Shadcn UI, React Router
- **Backend**: Core PHP 8.0+, RESTful API
- **Database**: MySQL/MariaDB
- **Deployment**: Hostinger shared hosting compatible

## Design System
- **Primary Color**: Teal (#0d9488)
- **Secondary Color**: Cyan (#06b6d4)
- **Font**: System fonts
- **UI Library**: Shadcn UI components

## API Endpoints
- `GET /api/` - Health check
- `GET /api/professionals/approved` - List approved doctors
- `GET /api/public/professional/{subdomain}` - Get doctor by subdomain
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/onboarding/list` - List all professionals (admin)
- `POST /api/admin/onboarding/create` - Create new professional (admin)

## Database Schema
- `professionals` - 27+ fields for doctor profiles
- `admin_users` - Admin credentials
- `patients` - Patient records
- `appointments` - Booking records
- `payments` - Payment transactions
- `testimonials` - Patient reviews

## Mocked Integrations (Pending API Keys)
- Razorpay (Payment Gateway)
- Google Meet (Video Consultations)
- Fast2SMS (WhatsApp/SMS Notifications)

---

## What's Implemented ✅

### Session: January 5, 2026
1. ✅ Environment setup (PHP 8, MariaDB, database schema)
2. ✅ Homepage redesign (mfine.co inspired, teal color scheme)
3. ✅ All 3 approved doctors displaying correctly
4. ✅ Routes added for About, Blogs, Contact, Privacy, Terms
5. ✅ Shared Header/Footer components
6. ✅ Footer navigation links working
7. ✅ Admin credentials updated (teleadmin/teleadm@2026)
8. ✅ Documentation cleanup (removed XAMPP guide, etc.)
9. ✅ Domain references updated to telecarezone.com
10. ✅ All 17 automated tests passing

---

## Backlog / Future Tasks

### P0 - Critical
- None currently

### P1 - High Priority
- Full appointment booking flow on expert landing pages
- Actual Razorpay integration (requires API keys)
- Google Meet integration (requires API keys)
- Email/WhatsApp notifications (requires API keys)

### P2 - Medium Priority
- Doctor profile photo uploads
- Patient dashboard
- Appointment history
- Digital prescriptions

### P3 - Low Priority
- Mobile app wrapper
- Push notifications
- Multi-language support

---

## Deployment

### Files to Deploy
- All files in `/app/` root directory
- See `HOSTINGER_DEPLOYMENT_GUIDE.md` for detailed instructions
- See `DEPLOYMENT_CHECKLIST.md` for quick reference

### Environment Variables (config/.env)
```
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=telecarezone_db
JWT_SECRET=your_jwt_secret
```

---

## Test Credentials
- **Admin**: teleadmin / teleadm@2026
- **Test URL**: https://telecarezone.com/admin/login
