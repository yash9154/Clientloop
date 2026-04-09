# 🎯 CLIENT LOOP - Professional Client Portal for Agencies

<div align="center">
  <strong>B2B SaaS Platform for Client Communication & Approval Workflows</strong>
  <br>
  <p>Share updates, manage approvals, and collaborate with clients in one professional portal</p>
  
  [Features](#features) • [Tech Stack](#-tech-stack) • [Modules](#-modules) • [Quick Start](#-quick-start) • [API](#-api-reference) • [Docs](#-documentation)
</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#-tech-stack)
- [Modules](#-modules)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [System Architecture](#-system-architecture)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support--community)

---

## 🎨 Overview

**ClientLoop** is a B2B SaaS web application that simplifies how agencies, freelancers, and consultants communicate with their clients. Instead of scattered WhatsApp messages, email chains, and Google Drive links, ClientLoop provides **one professional, organized portal** for:

- 📝 **Project Updates** - Share progress with rich formatting and attachments
- ✅ **Approval Workflows** - Request approvals and track status in real-time
- 📁 **File Sharing** - Upload and share deliverables securely
- 💬 **Comments** - Contextual feedback and discussions
- 🔔 **Notifications** - Real-time alerts for approvals and updates

### The Problem

Agencies currently face:
- ❌ Communication scattered across WhatsApp, Email, Google Drive
- ❌ Confusion about project status and who approved what
- ❌ Poor client experience (no professional interface)
- ❌ Insecure file sharing practices
- ❌ No accountability or audit trail

### The Solution

ClientLoop provides **one clean, focused platform** for client communication:
- ✅ Professional client portal
- ✅ Clear approval workflows
- ✅ Complete audit trail
- ✅ Secure file management
- ✅ Real-time notifications
- ✅ Mobile-optimized interface

### Target Users

| User Type | Use Case |
|-----------|----------|
| 📱 **Digital Agencies** | Share designs, get approvals on mockups |
| 📊 **Marketing Agencies** | Deliver reports and campaign assets |
| 💻 **Web Development Shops** | Show progress, get feedback on builds |
| 🎨 **Freelance Designers** | Professional client presentation |
| 📋 **Business Consultants** | Share deliverables, collect feedback |

---

## ✨ Features

### 🔐 Authentication & Security
- ✓ Email + Password registration & login
- ✓ Google OAuth 2.0 integration
- ✓ JWT-based secure sessions
- ✓ Password strength validation (8+ chars, mixed case, numbers, special chars)
- ✓ Password reset via email
- ✓ Role-based access control (Agency vs Client)
- ✓ Secure password hashing (bcryptjs)

### 🏢 Agency Dashboard
- ✓ **Client Management** - Create, edit, manage client accounts
- ✓ **Project Management** - Organize work into projects with status tracking
- ✓ **Update Posting** - Share updates with rich text and file attachments
- ✓ **Approval Requests** - Mark updates requiring client approval
- ✓ **Comments** - Threaded discussions on each update
- ✓ **Activity Feed** - See all client activity in real-time
- ✓ **Notifications** - Alert center for approvals and comments
- ✓ **Statistics** - Dashboard with metrics and KPIs
- ✓ **Billing** - Subscription management and invoices

### 👥 Client Portal
- ✓ **Simple Timeline** - Chronological view of project updates
- ✓ **File Downloads** - Secure access to shared files
- ✓ **One-Click Approvals** - Approve or request changes instantly
- ✓ **Comments** - Leave feedback on specific updates
- ✓ **Mobile Friendly** - Optimized for all devices
- ✓ **Distraction-Free** - No unnecessary features or navigation

### 💳 Billing & Subscriptions
- ✓ **Free Tier** - 1 client, basic features
- ✓ **Starter Plan** - $19/month, up to 5 clients
- ✓ **Agency Plan** - $49/month, unlimited clients
- ✓ **Stripe Integration** - Secure payment processing
- ✓ **Invoice Management** - Download past invoices

### 🚫 Intentionally Excluded
- ❌ Internal task management
- ❌ Team chat/messaging
- ❌ Time tracking
- ❌ Calendar/scheduling
- ❌ Complex project templates
- ❌ CRM features

---

## 🛠 Tech Stack

### Frontend Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Framework** | React 18.2.0 | Component-based UI |
| **Build Tool** | Vite 7.3.1 | Lightning-fast builds (HMR) |
| **Routing** | React Router 6.20.0 | Client-side navigation |
| **State Management** | React Context API | Global auth & data state |
| **HTTP Client** | Fetch API | API communication |
| **Icons** | Lucide React 0.294.0 | Clean SVG icon library |
| **Styling** | CSS3 (Vanilla) | Custom design system |
| **Storage** | localStorage | Session persistence |

### Backend Architecture

| Layer | Technology | Purpose |
|----------|-------------|---------|
| **Runtime** | Node.js 16+ | JavaScript server |
| **Framework** | Express.js 4.21.2 | Web server & API |
| **Database** | MongoDB 8.9+ | Document-based storage |
| **ORM** | Mongoose 8.9.5 | Schema validation & queries |
| **Authentication** | JWT + Bcryptjs | Secure auth tokens |
| **File Upload** | Multer 1.4.5 | Multipart form handling |
| **Validation** | Zod 3.24.1 | Runtime schema validation |
| **Security** | Helmet 8.0.0 | HTTP security headers |
| **Security** | CORS 2.8.5 | Cross-origin policy |
| **DDoS Protection** | Rate Limit 7.5.0 | Request throttling |
| **CDN** | Cloudinary 2.5.1 | Image & file storage |

### External Services

| Service | Purpose |
|---------|---------|
| **Cloudinary** | File & image hosting (CDN) |
| **Stripe** | Payment processing |
| **Mailgun / Resend** | Email notifications (future) |
| **Google OAuth** | Social authentication |
| **MongoDB Atlas** | Managed database hosting |

### Development Tools

- **Git** - Version control
- **npm** - Package management
- **Docker** - Containerization (optional)
- **ESLint** - Code linting (recommended)
- **Prettier** - Code formatting (recommended)

---

## � Modules

ClientLoop is built with **9 core modules**, each handling specific functionality:

### 1️⃣ Authentication Module
**Purpose**: User registration, login, session management
- ✓ User registration with email validation
- ✓ Email/password login
- ✓ Google OAuth 2.0
- ✓ JWT token generation & validation
- ✓ Password strength validation
- ✓ Password reset via email

**Key Endpoints**:
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
POST   /api/auth/password
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

---

### 2️⃣ Client Management Module
**Purpose**: Manage client organizations and contacts
- ✓ Create/edit/delete clients
- ✓ Client contact information
- ✓ Client status tracking (active/inactive)
- ✓ Client-agency associations
- ✓ Auto-generate client user accounts

**Key Endpoints**:
```
GET    /api/clients              # List all clients
POST   /api/clients              # Create new client
GET    /api/clients/:id          # Get client details
PUT    /api/clients/:id          # Update client
DELETE /api/clients/:id          # Delete/archive client
GET    /api/clients/:id/projects # Get client's projects
```

---

### 3️⃣ Project Management Module
**Purpose**: Organize work into projects per client
- ✓ Create projects for clients
- ✓ Track project status (not-started, in-progress, waiting-approval, completed)
- ✓ Project descriptions and details
- ✓ Client-project associations
- ✓ Project timeline tracking

**Key Endpoints**:
```
GET    /api/projects        # List projects
POST   /api/projects        # Create project
GET    /api/projects/:id    # Get details
PUT    /api/projects/:id    # Update project
DELETE /api/projects/:id    # Delete project
GET    /api/stats/projects  # Project statistics
```

---

### 4️⃣ Updates Module
**Purpose**: Post project updates with rich content and approvals
- ✓ Create updates with title and content
- ✓ Rich text formatting support
- ✓ File attachments (images, PDFs, etc)
- ✓ Update type classification (progress, milestone, delivery)
- ✓ Approval request functionality
- ✓ Track approval status (none, pending, approved, changes-requested)
- ✓ Change request notes

**Key Endpoints**:
```
GET    /api/updates              # List updates
POST   /api/updates              # Create update
GET    /api/updates/:id          # Get update
PUT    /api/updates/:id          # Edit update
DELETE /api/updates/:id          # Delete update
PUT    /api/updates/:id/approve  # Approve update
PUT    /api/updates/:id/request-changes # Request changes
```

---

### 5️⃣ Comments Module
**Purpose**: Enable threaded discussions on updates
- ✓ Create comments on updates
- ✓ Author information tracking
- ✓ Role-based comment display (agency vs client)
- ✓ Comment editing/deletion
- ✓ Comment notifications

**Key Endpoints**:
```
GET    /api/comments?updateId=:id  # Get update comments
POST   /api/comments               # Add comment
PUT    /api/comments/:id           # Edit comment
DELETE /api/comments/:id           # Delete comment
```

---

### 6️⃣ File Upload Module
**Purpose**: Secure file upload and management via Cloudinary
- ✓ File upload to Cloudinary CDN
- ✓ File metadata storage (name, size, type)
- ✓ Secure file access
- ✓ File deletion
- ✓ Support for images, PDFs, documents

**Key Endpoints**:
```
POST   /api/upload      # Upload single file
POST   /api/uploads     # Batch upload
GET    /api/files/:id   # Get file details
DELETE /api/files/:id   # Delete file
```

---

### 7️⃣ Notifications Module
**Purpose**: Real-time and email notifications
- ✓ In-app notification display
- ✓ Email notifications (Mailgun/Resend)
- ✓ User notification preferences
- ✓ Notification read status tracking
- ✓ Notification history

**Key Endpoints**:
```
GET    /api/notifications           # Get user notifications
POST   /api/notifications           # Create notification
PUT    /api/notifications/:id/read  # Mark as read
DELETE /api/notifications/:id       # Delete notification
```

**Notification Types**:
- `update_posted` - New update posted
- `approval_requested` - Update needs approval
- `update_approved` - Update was approved
- `changes_requested` - Client requested changes
- `comment_added` - New comment on update

---

### 8️⃣ Billing Module
**Purpose**: Subscription management and payments
- ✓ Plan selection (Free, Starter, Agency)
- ✓ Stripe payment integration
- ✓ Subscription tracking
- ✓ Invoice generation
- ✓ Billing history

**Key Endpoints**:
```
GET    /api/billing/plan       # Get user plan
PUT    /api/billing/plan       # Change plan
POST   /api/billing/subscribe  # Subscribe
GET    /api/billing/invoices   # Get invoices
POST   /api/billing/webhook    # Stripe webhook
```

---

### 9️⃣ Statistics Module
**Purpose**: Analytics and metrics
- ✓ Dashboard statistics
- ✓ Project metrics
- ✓ Client metrics
- ✓ Activity analytics
- ✓ Approval tracking

**Key Endpoints**:
```
GET    /api/stats           # Overall statistics
GET    /api/stats/projects  # Project stats
GET    /api/stats/clients   # Client stats
GET    /api/stats/activity  # Activity metrics
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ & npm 8+
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for file uploads)
- Google OAuth credentials (optional)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/clientloop.git
cd clientloop
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# http://localhost:5173
```

### 3. Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your environment variables
# (MongoDB, Cloudinary, Google OAuth, etc.)

# Start server
npm run dev

# Server runs on http://localhost:5000
```

### 4. Environment Variables (.env)

**Frontend** (`root/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

**Backend** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clientloop
# Or MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/clientloop

JWT_SECRET=your-secret-jwt-key
JWT_EXPIRE=7d

GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

MAILGUN_API_KEY=your-mailgun-key
MAILGUN_DOMAIN=your-domain

STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 5. Test the Application
```bash
# Create test data
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Password123!"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Password123!"}'
```

---

## 📁 Project Structure

```
clientloop/
│
├─ 📄 Core Documentation
│  ├─ README.md                      ← You are here
│  ├─ PROJECT_REPORT.md              ← Complete academic report
│  ├─ PRESENTATION_GUIDE.md          ← Presentation slides guide
│  ├─ UML_DIAGRAMS_CODE.md          ← PlantUML diagram codes
│  ├─ QUICK_START_SETUP.md          ← Quick setup guide
│  └─ package.json                   ← Frontend dependencies
│
├─ 📁 Frontend (React + Vite)
│  └─ src/
│     ├─ pages/                      ← Page components
│     │  ├─ LandingPage.jsx         ← Marketing homepage
│     │  ├─ auth/
│     │  │  ├─ LoginPage.jsx        ← Agency login
│     │  │  ├─ SignupPage.jsx       ← Agency registration
│     │  │  └─ ClientLoginPage.jsx  ← Client portal login
│     │  ├─ agency/                 ← Agency user pages
│     │  │  ├─ Dashboard.jsx        ← Main dashboard
│     │  │  ├─ ClientsPage.jsx      ← Client management
│     │  │  ├─ ClientDetailPage.jsx ← Client profile
│     │  │  ├─ ProjectsPage.jsx     ← Project list
│     │  │  ├─ ProjectDetailPage.jsx← Project details
│     │  │  ├─ BillingPage.jsx      ← Billing management
│     │  │  └─ SettingsPage.jsx     ← Account settings
│     │  └─ client/                 ← Client user pages
│     │     ├─ ClientDashboard.jsx  ← Project list
│     │     └─ ClientProjectView.jsx← Updates timeline
│     │
│     ├─ layouts/                    ← Reusable layouts
│     │  ├─ AgencyLayout.jsx        ← Sidebar + header
│     │  └─ ClientLayout.jsx        ← Simple header only
│     │
│     ├─ context/                    ← React Context
│     │  ├─ AuthContext.jsx         ← Auth state & methods
│     │  └─ DataContext.jsx         ← Data state & CRUD
│     │
│     ├─ api/                        ← API calls
│     │  ├─ auth.js                 ← Auth requests
│     │  ├─ client.js               ← Client requests
│     │  └─ data.js                 ← Data requests
│     │
│     ├─ App.jsx                     ← Root component
│     ├─ main.jsx                    ← Entry point
│     ├─ index.css                   ← Global styles
│     └─ components.css              ← Component styles
│
├─ 📁 Backend (Express + Node.js)
│  └─ server/
│     ├─ src/
│     │  ├─ index.js                ← Server entry point
│     │  │
│     │  ├─ controllers/            ← Request handlers
│     │  │  ├─ authController.js   ← Auth logic
│     │  │  ├─ clientController.js ← Client CRUD
│     │  │  ├─ projectController.js← Project CRUD
│     │  │  ├─ updateController.js ← Update CRUD + approvals
│     │  │  ├─ commentController.js← Comment CRUD
│     │  │  ├─ notificationController.js ← Notifications
│     │  │  ├─ uploadController.js ← File uploads
│     │  │  ├─ statsController.js  ← Analytics
│     │  │  └─ billingController.js ← Billing
│     │  │
│     │  ├─ models/                ← MongoDB schemas
│     │  │  ├─ User.js             ← User schema
│     │  │  ├─ Client.js           ← Client schema
│     │  │  ├─ Project.js          ← Project schema
│     │  │  ├─ Update.js           ← Update schema
│     │  │  ├─ Comment.js          ← Comment schema
│     │  │  └─ Notification.js     ← Notification schema
│     │  │
│     │  ├─ routes/                ← API endpoints
│     │  │  ├─ auth.js
│     │  │  ├─ clients.js
│     │  │  ├─ projects.js
│     │  │  ├─ updates.js
│     │  │  ├─ comments.js
│     │  │  ├─ notifications.js
│     │  │  ├─ upload.js
│     │  │  ├─ stats.js
│     │  │  └─ billing.js
│     │  │
│     │  ├─ middleware/            ← Middleware functions
│     │  │  ├─ auth.js            ← JWT verification
│     │  │  ├─ errorHandler.js    ← Error handling
│     │  │  └─ validate.js        ← Input validation
│     │  │
│     │  ├─ utils/                 ← Utility functions
│     │  │  ├─ cloudinary.js      ← Cloudinary setup
│     │  │  ├─ emailService.js    ← Email sending
│     │  │  ├─ passwordValidator.js← Password checks
│     │  │  ├─ generateToken.js   ← JWT generation
│     │  │  └─ validationSchemas.js← Zod schemas
│     │  │
│     │  └─ config/
│     │     └─ db.js              ← MongoDB connection
│     │
│     ├─ package.json              ← Backend dependencies
│     ├─ migrate.js                ← Database migration
│     └─ .env.example              ← Environment template
│
├─ 📁 Public Assets
│  └─ public/
│     └─ favicon.svg               ← App icon
│
├─ 🔧 Configuration
│  ├─ vite.config.js               ← Vite build config
│  ├─ index.html                   ← HTML template
│  └─ .gitignore                   ← Git ignore rules

```

---

## 👥 User Roles

### Agency User (Admin / Team)

**Capabilities:**
- Create and manage multiple clients
- Create projects under each client
- Post project updates with attachments
- Request approval on deliverables
- View approval status and client responses
- Manage subscription and billing
- Access all client activity

**Dashboard Features:**
- Statistics overview (clients, projects, pending approvals)
- Recent activity feed
- Quick actions panel
- Notification center

### Client User (Viewer / Approver)

**Capabilities:**
- View only their assigned projects
- See updates in timeline format
- Download shared files
- Approve or request changes with one click
- Leave comments on updates

**Restrictions:**
- No access to internal tasks or other clients
- Cannot create projects or updates
- Simplified interface without management features

---

## 🗄 Database Schema

### Collections Overview

**6 Main Collections** with relationships and 1 Embedded Document

#### 1. Users Collection
Stores both agency and client user accounts

```javascript
{
  _id: ObjectId,
  name: String,              // Full name
  email: String,             // Unique email
  password: String,          // Hashed with bcryptjs
  role: "agency" | "client", // User role
  clientId: ObjectId,        // FK to Client (if client user)
  company: String,           // Agency/company name
  plan: "free" | "starter" | "agency",
  avatar: String,            // Profile picture URL
  googleId: String,          // Google OAuth ID
  createdAt: Date,           // Auto-set
  updatedAt: Date            // Auto-updated
}
```

**Indexes**: email (unique), role, plan

---

#### 2. Clients Collection
Client organizations managed by agencies

```javascript
{
  _id: ObjectId,
  name: String,              // Client company name
  email: String,             // Client email
  contactName: String,       // Primary contact
  phone: String,             // Phone number
  company: String,           // Organization name
  industry: String,          // Business industry
  status: "active" | "inactive",
  agencyId: ObjectId,        // FK to User (agency)
  userId: ObjectId,          // FK to User (client account)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: agencyId, {email, agencyId} (unique compound)

---

#### 3. Projects Collection
Projects assigned to clients

```javascript
{
  _id: ObjectId,
  name: String,              // Project name
  description: String,       // Project details
  status: "not-started" | "in-progress" | "waiting-approval" | "completed",
  clientId: ObjectId,        // FK to Client
  agencyId: ObjectId,        // FK to User (creator)
  clientName: String,        // Denormalized for quick access
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: clientId, agencyId, {clientId, agencyId}, status

---

#### 4. Updates Collection
Project updates with approval tracking

```javascript
{
  _id: ObjectId,
  title: String,             // Update title
  content: String,           // Update description
  type: "progress" | "milestone" | "delivery",
  projectId: ObjectId,       // FK to Project
  agencyId: ObjectId,        // FK to User (author)
  author: String,            // Author name
  requiresApproval: Boolean, // Needs client approval?
  approvalStatus: "none" | "pending" | "approved" | "changes-requested",
  approvedBy: String,        // Who approved
  approvedAt: Date,          // When approved
  changeRequestedBy: String, // Who requested changes
  changeRequestedAt: Date,   // When requested
  changeRequestNote: String, // Change feedback
  files: [
    {
      name: String,          // File name
      url: String,           // Cloudinary URL
      size: String,          // Human-readable size
      sizeBytes: Number,     // Bytes
      type: String,          // MIME type
      publicId: String,      // Cloudinary ID
      uploadedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: projectId, agencyId, approvalStatus, {projectId, createdAt}

---

#### 5. Comments Collection
Feedback on updates

```javascript
{
  _id: ObjectId,
  content: String,           // Comment text
  updateId: ObjectId,        // FK to Update
  authorId: ObjectId,        // FK to User
  authorName: String,        // Author name
  authorRole: "agency" | "client",
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: updateId, authorId, {updateId, createdAt}

---

#### 6. Notifications Collection
User notifications

```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // FK to User (recipient)
  type: String,              // Notification type
  message: String,           // Notification message
  isRead: Boolean,           // Read status
  relatedId: ObjectId,       // FK to related entity
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: userId, {userId, isRead}, createdAt

---

### Entity Relationships

```
User (1) ──── (Many) Client
User (1) ──── (Many) Project
User (1) ──── (Many) Update
User (1) ──── (Many) Comment
User (1) ──── (Many) Notification
Client (1) ──── (Many) Project
Project (1) ──── (Many) Update
Update (1) ──── (Many) Comment
Update (1) ──── (Many) File (embedded)
```

---

## 🔌 API Reference

### Authentication

```bash
# Register user
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@agency.com",
  "password": "SecurePass123!"
}

# Login
POST /api/auth/login
{
  "email": "john@agency.com",
  "password": "SecurePass123!"
}

# Get current user
GET /api/auth/me
Authorization: Bearer <token>

# Logout
POST /api/auth/logout
Authorization: Bearer <token>
```

### Clients

```bash
# List all clients
GET /api/clients
Authorization: Bearer <token>

# Create client
POST /api/clients
{
  "name": "ABC Corporation",
  "email": "contact@abc.com",
  "contactName": "Jane Smith",
  "phone": "+1-555-0123",
  "industry": "Technology"
}

# Get single client
GET /api/clients/:id

# Update client
PUT /api/clients/:id
{
  "name": "ABC Corp Inc",
  "status": "active"
}

# Delete client
DELETE /api/clients/:id
```

### Projects

```bash
# List all projects
GET /api/projects
GET /api/projects?status=in-progress

# Create project
POST /api/projects
{
  "clientId": "63f7...",
  "name": "Website Redesign",
  "description": "Complete redesign of client website"
}

# Get project details
GET /api/projects/:id

# Update project
PUT /api/projects/:id
{
  "status": "in-progress"
}

# Delete project
DELETE /api/projects/:id
```

### Updates & Approvals

```bash
# Post update
POST /api/updates
{
  "projectId": "63f7...",
  "title": "Design mockups completed",
  "content": "All 5 design mockups are ready for review",
  "type": "milestone",
  "requiresApproval": true,
  "files": [{ name, url, size }]
}

# Get project updates
GET /api/projects/:id/updates

# Approve update
PUT /api/updates/:id/approve
{
  "approvedBy": "Jane Smith"
}

# Request changes
PUT /api/updates/:id/request-changes
{
  "changeRequestNote": "Please adjust the header color to blue"
}
```

### Comments

```bash
# Add comment
POST /api/comments
{
  "updateId": "63f7...",
  "content": "Nice work! Missing the logo in header"
}

# Get update comments
GET /api/updates/:id/comments

# Delete comment
DELETE /api/comments/:id
```

### View Complete API Documentation
See [PROJECT_REPORT.md](PROJECT_REPORT.md) Section 3 for detailed API specifications.

---

## 🏗️ System Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                            │
│  (Agency Staff or Client Users)                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    HTTP/WebSocket
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    FRONTEND (React + Vite)                       │
│  ├─ AgencyLayout (Dashboard, Projects, Clients)                 │
│  ├─ ClientLayout (Project View, Updates, Comments)             │
│  ├─ React Router (Page Navigation)                              │
│  └─ Context API (AuthContext, DataContext)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    REST API (JSON)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                 BACKEND (Express.js Server)                      │
│  ├─ Routes (Auth, Clients, Projects, Updates, etc.)            │
│  ├─ Controllers (Business Logic)                                │
│  ├─ Middleware (Authentication, Validation, Error Handler)      │
│  ├─ Models (User, Client, Project, Update, Comment, etc.)      │
│  └─ Utils (Jwt, Email, Cloudinary, Password Validation)         │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌──────────┬────────┼────────┬──────────────┐
         │          │        │        │              │
    MongoDB    Cloudinary  Stripe   Mailgun    Google OAuth
    Database    (Files)  (Payments) (Email)   (Authentication)
```

### Data Flow

**User Registration & Login**:
1. User submits credentials → Frontend validates with Zod
2. Frontend sends POST request to `/api/auth/register` → Backend
3. Backend validates input, hashes password with bcryptjs
4. Backend creates User document in MongoDB
5. Backend generates JWT token using generateToken utility
6. Frontend stores JWT in localStorage + sets AuthContext
7. Frontend redirects based on user role (Agency/Client)

**Project Update Workflow**:
1. Agency staff creates update → POST `/api/updates` with files
2. Backend uploads files to Cloudinary, stores URLs in MongoDB
3. Backend creates Update document with approval status = "pending"
4. Backend sends email notification to client via Mailgun
5. Client (notifications) → Reviews update in ClientLayout
6. Client submits approval/changes → PUT `/api/updates/:id/approve` or request-changes
7. Notifications saved → Agency staff receives in-app notification
8. Stats automatically recalculated (updates posted, pending approvals, etc.)

**File Upload Process**:
1. User selects file in upload component
2. Frontend sends multipart form data to `/api/upload`
3. Middleware (multer) validates file type/size
4. Backend controller sends to Cloudinary via cloudinary utility
5. Cloudinary returns secure URL and public ID
6. Backend stores file reference in MongoDB
7. Frontend updates UI with download link

**Notification System**:
1. Database trigger (on Update.create, Comment.create, etc.)
2. Backend creates Notification document → sent: false initially
3. Backend sends email via Mailgun util
4. User receives both in-app notification + email
5. When user opens app, GET `/api/notifications` fetches all
6. Frontend displays unread count badge
7. User clicks notification → mark as read (PUT) + navigate to relevant page

### Component Hierarchy

```
App.jsx
├─ AuthContext (Global Auth State)
│  └─ Login/Signup Pages
│
├─ DataContext (Global Data State)
│  └─ Main Layouts
│     ├─ AgencyLayout
│     │  ├─ Dashboard
│     │  ├─ ClientsPage
│     │  ├─ ProjectsPage
│     │  ├─ BillingPage
│     │  └─ SettingsPage
│     │
│     └─ ClientLayout
│        ├─ ClientDashboard
│        └─ ClientProjectView
│           ├─ Updates List
│           ├─ Comments Section
│           └─ File Viewer
```

### Database Relationships

```
User (1) ──→ (Many) Clients
     └─────────→ (Many) Comments
     └─────────→ (Many) Notifications

Client (1) ──→ (Many) Projects
      └─────→ (Many) Comments

Project (1) ──→ (Many) Updates
       └───→ (Many) Comments
       └───→ (Many) Notifications

Update (1) ──→ (Many) Comments
      └───→ (Many) Files (embedded)
      └───→ (Many) Notifications
```

### Request/Response Lifecycle

```
┌────────────────────────────────────────────────────────────────┐
│ 1. CLIENT REQUEST                                              │
│    - Browser sends HTTP request with optional JWT header      │
└────────────────────┬───────────────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────────────┐
│ 2. MIDDLEWARE PROCESSING                                       │
│    ├─ CORS: Check origin                                       │
│    ├─ Auth: Verify JWT token (if required)                    │
│    ├─ Body Parser: Parse JSON                                  │
│    └─ Validate: Check request schema with Zod                 │
└────────────────────┬───────────────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────────────┐
│ 3. ROUTE HANDLER → CONTROLLER                                  │
│    - Find matching route                                       │
│    - Execute controller function                              │
│    - Access req.user (from auth middleware)                   │
└────────────────────┬───────────────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────────────┐
│ 4. BUSINESS LOGIC                                              │
│    - Database queries (Mongoose models)                        │
│    - External API calls (Cloudinary, Stripe, Mailgun)         │
│    - Calculations (stats, validations)                        │
└────────────────────┬───────────────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────────────┐
│ 5. RESPONSE GENERATION                                         │
│    ├─ Success: 200/201 with data                               │
│    └─ Error: 400/401/403/500 with error message               │
└────────────────────┬───────────────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────────────┐
│ 6. ERROR HANDLING MIDDLEWARE                                   │
│    - Catch any unhandled errors                                │
│    - Format error response                                     │
│    - Log error details                                         │
└────────────────────┬───────────────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────────────┐
│ 7. BROWSER RECEIVES RESPONSE                                   │
│    - Frontend processes JSON                                   │
│    - Updates React state                                       │
│    - Re-renders UI                                             │
│    - Shows notifications/error messages                        │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Application
VITE_APP_NAME=ClientLoop
VITE_APP_URL=http://localhost:3000

# API (for production backend)
VITE_API_URL=http://localhost:4000/api

# Authentication
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx

# Feature Flags
VITE_ENABLE_GOOGLE_AUTH=true
VITE_ENABLE_BILLING=true
```

### Backend Environment Variables (Production)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/clientloop

# Authentication
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# File Storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=clientloop-files

# Email
SENDGRID_API_KEY=your-sendgrid-key
EMAIL_FROM=noreply@clientloop.io

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect repository**
   ```bash
   npx vercel
   ```

2. **Configure environment variables** in Vercel dashboard

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t clientloop .
docker run -p 80:80 clientloop
```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

---

## � Deployment

### Frontend Deployment (Vercel)

**Option 1: Automatic Deployment with Git**

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" and select your repository
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variables (VITE_API_URL, VITE_GOOGLE_CLIENT_ID, etc.)
7. Deploy!

**Option 2: Manual Deployment**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add VITE_API_URL
vercel env add VITE_GOOGLE_CLIENT_ID
```

### Backend Deployment (Railway/Heroku/DigitalOcean)

**Option 1: Railway (Recommended)**

1. Create account on [Railway.app](https://railway.app/)
2. Create new project → Select GitHub repo
3. Add MongoDB plugin (Railway will provide DATABASE_URL)
4. Set environment variables in Railway dashboard
5. Railway auto-deploys on git push

**Option 2: Heroku**

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

**Option 3: DigitalOcean App Platform**

1. Create account on [DigitalOcean](https://digitalocean.com/)
2. Create new app → Select GitHub repo
3. Configure build command: `npm install`
4. Configure start command: `npm start`
5. Add environment variables
6. Deploy!

### Docker Deployment

**Create Dockerfile (Backend)**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
```

**Create docker-compose.yml**

```yaml
version: '3.8'

services:
  backend:
    build: ./server
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=mongodb://mongo:27017/clientloop
      - JWT_SECRET=your-secret-key
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  frontend:
    build: ./
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:4000/api

volumes:
  mongo_data:
```

**Run with Docker**

```bash
docker-compose up -d
```

### Production Checklist

- [ ] Set NODE_ENV=production on backend
- [ ] Generate strong JWT_SECRET (use `crypto.randomBytes(32).toString('hex')`)
- [ ] Enable HTTPS/SSL on all domains
- [ ] Set up MongoDB backups
- [ ] Configure CORS for production domain
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Enable rate limiting on API
- [ ] Configure email service (Mailgun/Sendgrid API keys)
- [ ] Test Stripe keys (use live keys on production)
- [ ] Set up monitoring/alerting
- [ ] Configure CDN for static files (Cloudinary already handles this)
- [ ] Enable security headers (Helmet)
- [ ] Test all authentication flows
- [ ] Set up SSL certificate renewal (Let's Encrypt)
- [ ] Configure automated backups for MongoDB

---

## 🗺️ Future Roadmap

### Phase 1 - Core Enhancements (Weeks 1-4)
**Focus: Real-time Communication & Security**
- [ ] WebSocket implementation for real-time notifications
- [ ] Two-factor authentication (2FA) with authenticator apps
- [ ] Email notifications for updates/approvals (Mailgun integration)
- [ ] Advanced file preview (PDF viewer, image gallery)
- [ ] Search functionality across projects/updates
- [ ] Activity logs and audit trails
- [ ] Bulk actions (multiple project updates)

**Estimated Impact**: ⬆️ User engagement +40%, Security score improved

### Phase 2 - White-label & Branding (Weeks 5-8)
**Focus: Enterprise Features & Customization**
- [ ] Custom logo upload and branding
- [ ] Brand color customization (theme builder)
- [ ] Custom domain support (CNAME setup)
- [ ] White-label email templates
- [ ] SSO (Single Sign-On) with SAML
- [ ] Role-based permissions (Custom roles)
- [ ] API rate limiting by plan tier

**Estimated Impact**: ⬆️ Enterprise adoption, recurring revenue

### Phase 3 - Project Management Integrations (Weeks 9-12)
**Focus: Tool Ecosystem & Workflows**
- [ ] ClickUp API integration (two-way sync)
- [ ] Notion integration (embed pages, databases)
- [ ] Jira integration (link issues, sync status)
- [ ] Slack notifications and commands
- [ ] Zapier webhooks for custom workflows
- [ ] Microsoft Teams integration
- [ ] GitHub integration (commit notifications)

**Estimated Impact**: ⬆️ Market reach, competitive advantage

### Phase 4 - AI Features (Weeks 13-16)
**Focus: Intelligent Assistance & Analytics**
- [ ] AI-generated weekly summaries (OpenAI API)
- [ ] Smart update suggestions (draft assist)
- [ ] Automated status updates (predictive)
- [ ] Sentiment analysis for feedback
- [ ] Chatbot for common questions
- [ ] Automated deadline reminders
- [ ] AI-powered report generation

**Estimated Impact**: ⬆️ User satisfaction +35%, Time saved

### Phase 5 - Mobile Apps (Weeks 17-24)
**Focus: Mobile-First & Push Notifications**
- [ ] React Native mobile app
- [ ] iOS App Store release with push notifications
- [ ] Android Play Store release
- [ ] Offline mode (local sync)
- [ ] Mobile-optimized UI/UX
- [ ] Biometric authentication (FaceID, fingerprint)
- [ ] Home screen widgets

**Estimated Impact**: ⬆️ Daily active users +60%, Mobile revenue

### Phase 6 - Analytics & Insights (Future)
**Focus: Business Intelligence**
- [ ] Advanced analytics dashboard
- [ ] Custom reports builder
- [ ] Data export (CSV, PDF)
- [ ] Predictive analytics (project completion dates)
- [ ] Team productivity metrics
- [ ] Client satisfaction surveys
- [ ] Benchmarking (industry comparisons)

---

## 💰 Pricing Strategy

### Current (Free)
- All features included
- Unlimited projects & clients
- Perfect for agencies testing the platform

### Planned Tiers

**Starter** - $29/month
- Up to 5 clients
- Up to 20 projects
- Email support

**Professional** - $99/month
- Unlimited clients & projects
- Custom branding (Phase 2)
- Priority support
- Advanced analytics (Phase 6)

**Enterprise** - Custom pricing
- White-label solution
- SSO/SAML (Phase 2)
- Dedicated support
- Custom integrations (Phase 3)
- SLA guarantee

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/clientloop.git
   cd clientloop
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and test thoroughly

4. **Commit with meaningful messages**
   ```bash
   git commit -m "feat: add real-time notifications"
   ```

5. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** to the main repository

### Development Guidelines

#### Code Style

- **Frontend (React)**
  - Use functional components with hooks
  - Follow React naming conventions (PascalCase for components)
  - Keep components small and reusable
  - Use prop-types or TypeScript
  - One component per file

- **Backend (Express)**
  - Use async/await instead of callbacks
  - Follow MVC pattern (Models, Controllers, Routes)
  - Keep business logic in controllers
  - Use descriptive variable names
  - Add error handling for all operations

#### Formatting & Linting

```bash
# Format code with Prettier
npm run format

# Run ESLint
npm run lint

# Format + lint (both)
npm run lint:fix
```

#### Git Workflow

```bash
# Sync with upstream
git fetch upstream
git rebase upstream/main

# Keep branch updated
git pull origin main

# Squash commits before PR (if needed)
git rebase -i HEAD~3
```

#### Commit Message Convention

```
type(scope): description

# Examples:
feat(auth): add two-factor authentication
fix(update): resolve file upload validation error
docs(readme): update deployment instructions
style(components): format component files
refactor(api): reorganize route handlers
test(auth): add login test cases
chore(deps): update dependencies
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Maintenance

### Pull Request Process

1. Update [ISSUES_AND_TASKS.md](ISSUES_AND_TASKS.md) with PR details
2. Ensure all tests pass: `npm run test`
3. Update documentation if needed
4. Link related issues in PR description
5. Request review from maintainers
6. Address review feedback promptly

### Testing

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- auth.test.js

# Test with coverage
npm run test:coverage

# Watch mode (re-run on changes)
npm run test:watch
```

### Documentation

When adding new features, update:
- Code comments for complex logic
- [README.md](README.md) with new features/modules
- [PROJECT_REPORT.md](PROJECT_REPORT.md) if major changes
- [API Reference](#-api-reference) for new endpoints
- Inline JSDoc comments for functions

### Reporting Issues

Found a bug? Create an issue:

1. Check if issue already exists
2. Provide clear description
3. Include steps to reproduce
4. Attach screenshots if applicable
5. List your environment (OS, Node version, npm version)

**Issue Template:**

```markdown
## Description
Brief description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happened

## Environment
- OS: Windows/Mac/Linux
- Node: v18.0.0
- npm: v9.0.0
```

### Code Review

All contributions go through code review. During review:
- Ensure code quality and best practices
- Check for security vulnerabilities
- Verify tests are included
- Validate documentation updates
- Provide constructive feedback

### Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

---

## 🏆 Attribution

Thank you to all contributors who have helped make ClientLoop better!



---

## 📚 Additional Resources

### Learning Materials
- [React Vite Documentation](https://vitejs.dev/)
- [Express.js Official Guide](https://expressjs.com/)
- [MongoDB University Courses](https://university.mongodb.com/)
- [JWT.io - JWT Introduction](https://jwt.io/introduction)
- [Cloudinary API Documentation](https://cloudinary.com/documentation)
- [Stripe API Documentation](https://stripe.com/docs/api)

### Related Projects
- [Vite](https://vitejs.dev/) - Frontend build tool
- [Express](https://expressjs.com/) - Backend framework
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM
- [Cloudinary](https://cloudinary.com/) - File management CDN
- [Stripe](https://stripe.com/) - Payment processing

### Community
- [GitHub Discussions](https://github.com/YOUR_REPO/discussions)
- [Stack Overflow tagged #clientloop](https://stackoverflow.com/)
- [Reddit r/webdev](https://reddit.com/r/webdev)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
You are free to:
- ✅ Use commercially
- ✅ Modify the code
- ✅ Distribute copies
- ✅ Use privately

You must:
- 📋 Include original license and copyright notice
- 📋 Include a copy of the MIT License

You cannot:
- ❌ Hold the authors liable

---

## 🆘 Support & Community

### Getting Help

**For Bug Reports**: [Create an Issue on GitHub](https://github.com/YOUR_REPO/issues/new)

**For Questions**: 
- Post in [GitHub Discussions](https://github.com/YOUR_REPO/discussions)
- Email: support@clientloop.io
- Discord: [Join our Discord server](https://discord.gg/YOUR_INVITE)
- Twitter: [@clientloop](https://twitter.com/clientloop)

### Documentation
- 📖 [Full Project Report](PROJECT_REPORT.md)
- 🎨 [UML Diagrams Documentation](UML_DIAGRAMS_CODE.md)
- 📊 [Presentation Guide](PRESENTATION_GUIDE.md)
- ✅ [Setup Requirements](SETUP_REQUIRED_SERVICES.md)
- 🚀 [Quick Start Guide](QUICK_START_SETUP.md)

### Response Times
- **Critical Bugs**: 24 hours
- **Feature Requests**: 48-72 hours  
- **General Questions**: 3-5 business days

---

## 🎯 Project Stats

| Metric | Value |
|--------|-------|
| **Lines of Code** | 4,000+ |
| **API Endpoints** | 30+ |
| **Database Collections** | 6 |
| **Frontend Components** | 15+ |
| **Backend Modules** | 9 |
| **Test Coverage** | Coming soon |
| **Documentation** | 100% |

---

## 🌟 Features Highlight

**For Agencies:**
- 📊 Professional client dashboard with real-time updates
- 📁 Secure file sharing and version control
- ✅ Approval workflows with status tracking
- 💰 Stripe billing integration for subscription management
- 📧 Email notifications and reminders
- 📈 Project analytics and statistics

**For Clients:**
- 💬 Clean, distraction-free interface
- 📝 View project updates and deliverables
- ✓ Approve or request changes
- 📌 Comment threads for feedback
- 🔔 Real-time notifications
- 📱 Responsive mobile design

---

## 🚀 Quick Links

[GitHub Repository](https://github.com/YOUR_REPO) • [Live Demo](https://clientloop.io) • [Report Bug](https://github.com/YOUR_REPO/issues) • [Request Feature](https://github.com/YOUR_REPO/discussions) • [Changelog](CHANGELOG.md)

---

<div align="center">

### Made with ❤️ by the ClientLoop Team

**Building better client communication, one update at a time.**

[⭐ Star us on GitHub](https://github.com/YOUR_REPO) • [🐦 Follow on Twitter](https://twitter.com/clientloop) • [💬 Join Discord](https://discord.gg/YOUR_INVITE)

*Last updated: January 2025 | Version 1.0.0*

</div>
