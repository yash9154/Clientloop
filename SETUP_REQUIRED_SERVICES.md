# ClientLoop - Required APIs & Services Setup Guide

## 📌 SERVICES YOU NEED TO SET UP

### 1. **CLOUDINARY** - File Storage & Upload ✅ (You have this)
**What it is:** Cloud storage for uploaded files (mockups, PDFs, deliverables)
**Cost:** FREE - 25GB storage, unlimited bandwidth
**Setup:**
- You already created account - just add credentials to server/.env
- Get Cloud Name, API Key, API Secret from dashboard

**Your Cloudinary Credentials (from dashboard):**
```
CLOUDINARY_CLOUD_NAME=? (your dashboard shows this)
CLOUDINARY_API_KEY=?
CLOUDINARY_API_SECRET=?
```

---

### 2. **GOOGLE CLOUD** - OAuth 2.0 Login
**What it is:** One-click "Login with Google" button
**Cost:** FREE
**Setup Steps:**
1. Go to https://console.cloud.google.com
2. Create new project: "ClientLoop"
3. Search for "OAuth 2.0" and enable it
4. Go to "Credentials" → Click "Create Credentials" → "OAuth Client ID"
5. Select "Web application"
6. Add authorized URIs:
   - **Authorized JavaScript origins:** http://localhost:3000 (dev), https://yourdomain.com (production)
   - **Authorized redirect URIs:** http://localhost:3000 (dev), https://yourdomain.com/callback (production)
7. Copy the Client ID and add to .env files

**Result:**
```
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

### 3. **EMAIL SERVICE** - Send Login Credentials & Password Reset ⭐ NEW REQUIRED
**What it is:** Service to send emails to clients when their account is created and for password reset
**Free Options:**
- **Resend.io** (Recommended for React devs) - FREE 100/month emails
- **SendGrid** - FREE 100/month emails  
- **Mailgun** - FREE 2,000/month emails (best)
- **Gmail SMTP** - FREE but limited (not recommended for production)

**Recommended: Resend or Mailgun**

```
For Resend (https://resend.com):
  RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx

For Mailgun (https://mailgun.com) - RECOMMENDED:
  MAILGUN_API_KEY=your-api-key
  MAILGUN_DOMAIN=mail.yourdomain.com
  MAILGUN_FROM_EMAIL=noreply@yourdomain.com

For SendGrid:
  SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxx
```

---

### 4. **MONGODB ATLAS** - Database ✅ (You have this)
**What it is:** Cloud MongoDB database
**Cost:** FREE - 512MB, 3 shared nodes
**Your Connection:**
```
MONGODB_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/clientloop
```
**⚠️ IMPORTANT:** Change your password NOW - it's exposed in your code!

---

### 5. **STRIPE** (Optional for Now - for Billing Feature)
**What it is:** Payment processing for subscriptions
**Cost:** FREE (no setup fee, pays when you process payments)
**Setup:** https://stripe.com
```
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxx
```
**Note:** Can implement later - not critical for MVP

---

### 6. **SENTRY** (Optional - Error Tracking)
**What it is:** Catches errors and shows you what went wrong in production
**Cost:** FREE tier available
```
VITE_SENTRY_DSN=https://xxxxxxxx@xxxxxxx.ingest.sentry.io/xxxxxxxx
```
**Note:** Nice to have, not critical

---

## 🎯 MINIMUM SETUP FOR WORKING APP

**Must have (to make app functional):**
1. ✅ Cloudinary (you have) - for file uploads
2. ✅ MongoDB (you have) - for database
3. ⭐ **NEW: Email Service** (Mailgun recommended) - for client notifications
4. Google OAuth - for login feature

**Can add later:**
- Stripe (for paid plans)
- Sentry (for error tracking)
- logging services

---

## 🚀 QUICK SETUP CHECKLIST

- [ ] Cloudinary: Get credentials and add to server/.env
- [ ] Google OAuth: Create app, get Client ID/Secret
- [ ] Email Service: Choose Mailgun/Resend, get API key
- [ ] Remove database password from .env - add to .gitignore
- [ ] Generate strong JWT_SECRET
- [ ] Add all to .env files before starting server

---

## 💾 COMPLETE .ENV TEMPLATE

See `.env.example` files updated in this commit.
