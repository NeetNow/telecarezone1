# 🚀 TeleCareZone - Hostinger Deployment Guide

**Complete Step-by-Step Guide to Deploy on Hostinger Shared Hosting**

---

## 📋 Pre-Deployment Checklist

Before starting, ensure you have:

- ✅ Hostinger account with cPanel access
- ✅ Domain: **mykitchenfarm.com** (DNS pointing to Hostinger)
- ✅ MySQL Database: **u913267094_telecaredev** (already created)
- ✅ Database password (from Hostinger cPanel)
- ✅ FTP/File Manager access
- ✅ All project files from GitHub

---

## 🗂️ Step 1: Download Project Files from GitHub

### Option A: Download as ZIP
1. Go to your GitHub repository
2. Click **Code** → **Download ZIP**
3. Extract the ZIP file on your computer

### Option B: Clone Repository
```bash
git clone <your-repository-url>
```

---

## 📤 Step 2: Upload Files to Hostinger

### Method 1: Using cPanel File Manager (Recommended)

1. **Login to Hostinger cPanel**
   - Go to https://hpanel.hostinger.com/
   - Navigate to: **Hosting** → **Manage** → **File Manager**

2. **Navigate to public_html**
   - Open `public_html` directory (this is your website root)

3. **Delete Default Files**
   - Delete any existing `index.html` or `index.php` files
   - Keep `.htaccess` if it exists (we'll replace it)

4. **Upload Project Files**
   - Click **Upload** button
   - Upload the following files/folders from your project:
     ```
     ✅ index.html
     ✅ api_index.php
     ✅ .htaccess
     ✅ api/ (folder)
     ✅ config/ (folder)
     ✅ services/ (folder)
     ✅ models/ (folder)
     ✅ uploads/ (folder)
     ✅ static/ (folder - from React build)
     ✅ vendor/ (folder - if exists)
     ✅ database_import.sql
     ```

5. **Set Permissions**
   - Right-click on `uploads/` folder → **Change Permissions** → Set to **755**
   - Right-click on `config/` folder → **Change Permissions** → Set to **755**

### Method 2: Using FTP (FileZilla)

1. **Connect via FTP**
   - Host: ftp.mykitchenfarm.com
   - Username: Your Hostinger FTP username
   - Password: Your Hostinger FTP password
   - Port: 21

2. **Upload Files**
   - Navigate to `/public_html/` on remote side
   - Upload all project files

---

## 🗄️ Step 3: Configure MySQL Database

### 3.1 Get Database Credentials

1. **Login to Hostinger cPanel**
2. Navigate to: **Databases** → **MySQL Databases**
3. Note down:
   - Database Name: `u913267094_telecaredev`
   - Database User: `u913267094_telecaredev`
   - Database Host: `localhost`
   - Password: [Your database password]

### 3.2 Import Database Schema

1. **Open phpMyAdmin**
   - In cPanel, click **phpMyAdmin** under Databases
   - Select database: `u913267094_telecaredev`

2. **Import SQL File**
   - Click **Import** tab
   - Click **Choose File**
   - Select `database_import.sql` from your project
   - Click **Go** at the bottom
   - Wait for "Import has been successfully finished"

3. **Verify Data**
   - Click on `professionals` table
   - You should see 3 sample doctors:
     - Dr. Rakesh Zha
     - Dr. Rubina Shah
     - Sania Batra
   - Click on `admin_users` table
   - You should see admin user

### 3.3 Update Database Password Hash (Important!)

The admin password needs to be re-hashed for PHP:

1. In phpMyAdmin, go to **SQL** tab
2. Run this query:
```sql
UPDATE admin_users 
SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
WHERE username = 'admin';
```
3. Click **Go**

**Admin Login Credentials:**
- Username: `admin`
- Password: `admin123`

---

## ⚙️ Step 4: Configure Environment Variables

### 4.1 Edit .env File

1. **Open File Manager in cPanel**
2. Navigate to: `public_html/config/`
3. Find `.env` file
4. Right-click → **Edit**

5. **Update These Critical Values:**

```env
# Database Configuration
DB_TYPE=mysql
DB_HOST=localhost
DB_USER=u913267094_telecaredev
DB_PASS=YOUR_ACTUAL_DATABASE_PASSWORD_HERE
DB_NAME=u913267094_telecaredev

# Application URL
APP_URL=https://mykitchenfarm.com
APP_ENV=production
APP_DEBUG=false

# JWT Secret (Generate random string - minimum 32 characters)
JWT_SECRET=your_random_secret_key_here_min_32_chars
```

6. **Click Save Changes**

### 4.2 Generate JWT Secret

To generate a secure JWT secret:
1. Visit: https://www.random.org/strings/?num=1&len=32&digits=on&upperalpha=on&loweralpha=on
2. Copy the generated string
3. Paste it in `.env` file as `JWT_SECRET`

---

## 🔐 Step 5: Verify .htaccess Configuration

1. **Check .htaccess in public_html**
   - Open `.htaccess` file in root directory
   - Ensure it contains proper rewrite rules

2. **If .htaccess is missing or broken, use this:**

```apache
# Enable URL Rewriting
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Security
    RewriteRule ^\.(?!well-known/) - [F]
    RewriteRule ^config/ - [F,L]
    
    # API Routes (to api_index.php)
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^api/(.*)$ api_index.php [QSA,L]
    
    # Frontend Routes (to index.html)
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/api/
    RewriteCond %{REQUEST_URI} !^/uploads/
    RewriteRule ^(?!api/|uploads/) index.html [L]
</IfModule>

# PHP Settings
<IfModule mod_php.c>
    php_value upload_max_filesize 50M
    php_value post_max_size 50M
    php_value memory_limit 256M
    php_value max_execution_time 300
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Disable Directory Browsing
Options -Indexes
```

---

## 🔒 Step 6: Enable SSL (HTTPS)

### 6.1 Activate Free SSL

1. **In Hostinger cPanel**
   - Go to: **Security** → **SSL**
   - Select your domain: `mykitchenfarm.com`
   - Click **Install SSL Certificate**
   - Choose **Free SSL** (Let's Encrypt)
   - Wait 5-15 minutes for activation

### 6.2 Force HTTPS (Add to .htaccess)

Add this at the TOP of `.htaccess` file:

```apache
# Force HTTPS
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

---

## 🧪 Step 7: Test Your Website

### 7.1 Test Homepage
1. Visit: https://mykitchenfarm.com
2. Should see: TeleCareZone landing page with 3 expert cards

### 7.2 Test API
1. Visit: https://mykitchenfarm.com/api
2. Should see JSON response:
```json
{
  "message": "TeleCareZone API - PHP Backend",
  "version": "2.0.0",
  "status": "operational",
  "database": "MySQL"
}
```

### 7.3 Test Admin Login
1. Visit: https://mykitchenfarm.com/admin/login
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Should redirect to admin dashboard

### 7.4 Test Doctor Pages (Path-based routing)
1. Visit: https://mykitchenfarm.com/doctor/rakeshzha
2. Should show: Dr. Rakesh Zha's landing page
3. Visit: https://mykitchenfarm.com/doctor/rubinashah
4. Visit: https://mykitchenfarm.com/doctor/saniabatra

---

## 🐛 Troubleshooting

### Issue 1: "500 Internal Server Error"

**Solution A: Check PHP Version**
1. In cPanel → **PHP Configuration**
2. Select PHP **8.0 or higher**
3. Click **Save**

**Solution B: Check Error Logs**
1. cPanel → **Errors** → **Error Log**
2. Look for the latest error message
3. Common fix: Check file permissions (folders: 755, files: 644)

### Issue 2: "Database Connection Failed"

**Solution:**
1. Verify `.env` file has correct database password
2. Check if database user has all privileges:
   ```sql
   GRANT ALL PRIVILEGES ON u913267094_telecaredev.* 
   TO 'u913267094_telecaredev'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Issue 3: "Page Not Found" for React Routes

**Solution:**
1. Ensure `.htaccess` is in `public_html/` root
2. Check if `mod_rewrite` is enabled (contact Hostinger support)
3. Verify `index.html` exists in root directory

### Issue 4: Admin Login Returns "Invalid Credentials"

**Solution:**
Run this SQL in phpMyAdmin:
```sql
UPDATE admin_users 
SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
WHERE username = 'admin';
```

### Issue 5: File Upload Fails

**Solution:**
1. Check `uploads/` folder permissions: 755
2. Create subfolders if missing:
   ```
   uploads/profiles/
   uploads/videos/
   uploads/documents/
   ```
3. All should have 755 permissions

---

## 📧 Step 8: Configure Email (Optional - After Deployment)

### Hostinger Email Setup

1. **Create Email Account**
   - cPanel → **Email Accounts**
   - Create: `noreply@mykitchenfarm.com`
   - Set password

2. **Update .env File**
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@mykitchenfarm.com
SMTP_PASS=your_email_password
SMTP_FROM=noreply@mykitchenfarm.com
SMTP_FROM_NAME=TeleCareZone
```

---

## 📱 Step 9: Configure WhatsApp/SMS (Optional - Later)

### Fast2SMS Setup

1. **Sign up**: https://www.fast2sms.com/
2. **Get API Key** from dashboard
3. **Update .env**:
```env
FAST2SMS_API_KEY=your_api_key_here
```

### WhatsApp Business API

1. Sign up for WhatsApp Business API
2. Get credentials
3. Update `.env` with `WHATSAPP_API_KEY`

---

## 🎥 Step 10: Configure Google Meet (Optional - Later)

### Google OAuth Setup

1. **Go to**: https://console.cloud.google.com/
2. **Create Project** → "TeleCareZone"
3. **Enable** Google Calendar API
4. **Create OAuth Credentials**
5. **Update .env**:
```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_REDIRECT_URI=https://mykitchenfarm.com/auth/google/callback
```

---

## 💳 Step 11: Configure Razorpay (Optional - Later)

### Razorpay Payment Gateway

1. **Sign up**: https://dashboard.razorpay.com/
2. **Get Keys**: Test/Live mode keys
3. **Update .env**:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
PLATFORM_FEE_PERCENT=10
```

---

## ✅ Post-Deployment Checklist

- [ ] Website loads at https://mykitchenfarm.com
- [ ] SSL certificate is active (shows padlock in browser)
- [ ] API responds at /api endpoint
- [ ] Admin login works (admin/admin123)
- [ ] 3 sample doctors visible on homepage
- [ ] Doctor pages accessible (/doctor/rakeshzha)
- [ ] Admin dashboard loads successfully
- [ ] Doctor onboarding form accessible
- [ ] Database connection working
- [ ] File uploads folder has correct permissions
- [ ] `.env` file configured with database password
- [ ] JWT_SECRET is set to random string

---

## 📞 Getting Help

### Hostinger Support
- **Live Chat**: Available 24/7 in cPanel
- **Email**: support@hostinger.com
- **Knowledge Base**: https://support.hostinger.com/

### Common Hostinger Issues

**PHP Version**: Ensure PHP 8.0+
**Memory Limit**: Increase if needed in cPanel
**Execution Time**: Increase for large uploads
**File Permissions**: 755 for folders, 644 for files

---

## 🎉 Deployment Complete!

Your TeleCareZone platform is now live at:
**https://mykitchenfarm.com**

### What Works Now:
✅ Main landing page with expert listings
✅ Admin dashboard with full functionality
✅ Doctor onboarding (27-field form)
✅ Doctor management table
✅ Analytics dashboard
✅ Leads management
✅ Database operations

### To Configure Later:
⏳ Email notifications (needs SMTP setup)
⏳ WhatsApp/SMS (needs Fast2SMS API)
⏳ Google Meet integration (needs OAuth)
⏳ Razorpay payments (needs API keys)

---

**Need help? Check the troubleshooting section or contact Hostinger support!** 🚀
