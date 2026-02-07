# TeleCareZone - Product Requirements Document

## Overview
TeleCareZone is a production-grade SAAS platform for healthcare professionals to manage online teleconsultations, appointments, and patient interactions.

## Core Features

### 1. Main Website
- **Homepage**: Modern, professional design inspired by mfine.co
- **Static Pages**: About, Blogs, Contact, Privacy Policy, Terms of Service

### 2. Professional Landing Pages (PATH-BASED ROUTING)
- **URL Format**: `/{professional-slug}` (e.g., `/priya-sharma`)
- **Booking URL**: `/{professional-slug}/book` (e.g., `/priya-sharma/book`)
- **NO SUBDOMAINS** - All routing is path-based for simplicity and portability
- Works on any domain without DNS configuration

### 3. Admin Dashboard
- **Login**: `/admin/login`
- **Credentials**: `teleadmin` / `teleadm@2026`

## Technology Stack
- **Frontend**: React 18, TailwindCSS, Shadcn UI, React Router
- **Backend**: Core PHP 8.0+, RESTful API
- **Database**: MySQL
- **Deployment**: Hostinger shared hosting compatible


```

## Key URLs (All Relative Paths)
```
/                    → Homepage
/about               → About page
/blogs               → Blog articles
/contact             → Contact page
/privacy-policy      → Privacy Policy
/terms               → Terms of Service
/join-expert         → Expert registration form
/admin/login         → Admin login
/admin/*             → Admin dashboard
/{slug}              → Professional landing page
/{slug}/book         → Appointment booking
/payment/{id}        → Payment page
/confirmation/{id}   → Confirmation page
```

## API Endpoints
- `GET /api/` - Health check
- `GET /api/professionals/approved` - List approved doctors
- `GET /api/public/professional/{slug}` - Get doctor by slug
- `POST /api/admin/login` - Admin authentication

## Deployment Notes

### .htaccess Configuration
- All paths are relative (no RewriteBase)
- Works in any directory on any domain
- API routes: `/api/*` → `api_index.php`
- Frontend routes: Everything else → `index.html`

### Files to Upload to Hostinger
```
public_html/
├── index.html          ← React app entry
├── api_index.php       ← PHP API router
├── .htaccess           ← Apache rewrite rules
├── static/             ← CSS/JS assets
├── api/                ← PHP API endpoints
├── config/             ← Database configuration
├── services/           ← PHP services
└── vendor/             ← PHP dependencies
```

---

## What's Implemented ✅

### February 5, 2026
1. ✅ **Removed subdomain routing** - All professional pages now use path-based URLs
2. ✅ **Updated App.js** - Simplified routing without subdomain detection
3. ✅ **Updated DoctorLanding.js** - Uses `/:professionalSlug` parameter
4. ✅ **Updated BookAppointment.js** - Uses `/:professionalSlug/book` parameter
5. ✅ **Updated MainLanding.js** - Doctor cards link to `/{slug}` instead of `/doctor/{slug}`
6. ✅ **Updated Admin pages** - Show relative URLs `/{slug}` instead of `{slug}.domain.com`
7. ✅ **Updated .htaccess** - All relative paths, works on any domain/directory
8. ✅ **Rebuilt React app** - Production build with new routing

---

## Backlog / Future Tasks

### P1 - High Priority
- Razorpay payment integration (requires API keys)
- Google Meet integration (requires API keys)
- Email/WhatsApp notifications (requires API keys)

### P2 - Medium Priority
- Doctor profile photo uploads
- Patient dashboard
- Appointment history

---

## Test Credentials
- **Admin**: teleadmin / teleadm@2026
