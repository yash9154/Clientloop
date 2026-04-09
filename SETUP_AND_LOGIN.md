# 🚀 ClientLoop - Setup & Login Guide

## ⚙️ Prerequisites

- **Node.js v18+** - [Download](https://nodejs.org/)
- **MongoDB** - [Local installation](https://docs.mongodb.com/manual/installation/) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn**

---

## 📦 Installation & Setup

### 1. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd ..
npm install
```

### 2. Configure Environment Variables

#### Backend (.env)
Create `.env` file in `server/` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/clientloop

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth (Optional - for Google login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary (Optional - for file uploads)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Service (Optional - for email notifications)
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain

# Client URL
CLIENT_URL=http://localhost:3000
```

#### Frontend (.env or .env.local)
Create `.env` (or `.env.local`) in root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxx
```

---

## 🗄️ Database Setup

### Option 1: Local MongoDB
```bash
# Start MongoDB service
# On Windows: mongod from MongoDB installation
# On Mac: brew services start mongodb-community
# On Linux: sudo systemctl start mongod
```

### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/clientloop`
4. Update `MONGODB_URI` in `.env`

---

## 🌱 Seed Demo Data

After database is running:

```bash
cd server
npm run seed
```

This creates:
- ✅ **Agency User**: demo@agency.com / Demo@123456
- ✅ **Client User**: client@demo.com / Demo@123456
- ✅ **3 Demo Projects**: Website Redesign, Mobile App, SEO Optimization
- ✅ **Demo Client Company**: Acme Corporation

**Output:**
```
✓ Connected to MongoDB
✓ Cleared previous demo data
✓ Created agency user: demo@agency.com / password: Demo@123456
✓ Created client user: client@demo.com / password: Demo@123456
✓ Created demo client: Acme Corporation
✓ Created project 1: Website Redesign
✓ Created project 2: Mobile App Development
✓ Created project 3: SEO Optimization (completed)

✅ Database seeding complete!
```

---

## 🚀 Start Application

### Terminal 1: Backend Server

```bash
cd server
npm run dev
```

**Expected Output:**
```
✓ Connected to MongoDB
🚀 Server running on http://localhost:5000
✓ Rate limiting enabled
```

### Terminal 2: Frontend Development Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v7.3.1 ready in 245 ms

➜  local:   http://localhost:3000/
```

---

## 🔐 Login Credentials

### Agency Staff Account
| Field | Value |
|-------|-------|
| **Email** | demo@agency.com |
| **Password** | Demo@123456 |
| **Role** | Agency |
| **Access** | Dashboard, Clients, Projects, Billing |

### Client Account
| Field | Value |
|-------|-------|
| **Email** | client@demo.com |
| **Password** | Demo@123456 |
| **Role** | Client |
| **Access** | View projects, Updates, Comments |

---

## ✅ Testing Login Flow

### 1. Navigate to Login Page
```
http://localhost:3000/login
```

### 2. Try Agency Login
- **Email:** demo@agency.com
- **Password:** Demo@123456
- **Result:** Redirects to `/dashboard` showing projects

### 3. Try Client Login
- Click "Sign in as Client" link
- **Email:** client@demo.com
- **Password:** Demo@123456
- **Result:** Redirects to `/client/projects` showing assigned projects

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"
**Solution:**
1. Make sure backend is running on port 5000
2. Check backend console for errors
3. Verify `MONGODB_URI` is correct
4. Try: `curl http://localhost:5000/api/auth/me`

### Issue: "Invalid email or password"
**Solution:**
1. Run seed script: `npm run seed` in server folder
2. Verify database contains demo users: `db.users.find({ email: "demo@agency.com" })`
3. Check password hasn't been changed

### Issue: "MongoDB connection error"
**Solution:**
1. Ensure MongoDB is running locally or Atlas connection is active
2. Test MongoDB connection:
   ```bash
   mongosh "mongodb://localhost:27017"
   # or
   mongosh "mongodb+srv://..."
   ```
3. Update `MONGODB_URI` in `.env`

### Issue: CORS Error in Console
**Solution:**
1. Check `CLIENT_URL` in backend `.env` matches your frontend URL
2. Ensure backend has CORS middleware enabled
3. Restart backend server

### Issue: Port 5000 already in use
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process or change PORT in .env
PORT=5001
```

---

## 📊 Demo Data Overview

### Projects Created
1. **Website Redesign** - 65% complete, 5 updates, in-progress
2. **Mobile App Development** - 15% complete, 3 updates, planning
3. **SEO Optimization** - 100% complete, 8 updates, completed

### Client (Company)
- **Name:** Acme Corporation
- **Email:** contact@acme.com
- **Contact:** John Smith
- **Industry:** Technology
- **Status:** Active

---

## 🔧 Development Commands

```bash
# Backend
cd server
npm run dev          # Start with auto-reload
npm run seed         # Seed demo data
npm run migrate      # Migrate passwords (if needed)
npm start            # Production start

# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Project details
- `PUT /api/projects/:id` - Update project

### Updates
- `POST /api/updates` - Create update
- `GET /api/projects/:id/updates` - Project updates
- `PUT /api/updates/:id/approve` - Approve update
- `PUT /api/updates/:id/request-changes` - Request changes

---

## 🎯 Next Steps

1. ✅ Start backend: `npm run dev`
2. ✅ Seed data: `npm run seed`
3. ✅ Start frontend: `npm run dev`
4. ✅ Login with demo credentials
5. ✅ View projects and test workflows

For detailed documentation, see [README.md](README.md)

---

<p align="center">
  <strong>Need help?</strong> Check the troubleshooting section above or review the console logs.
</p>
