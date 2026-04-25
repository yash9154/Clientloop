# ClientLoop

**Agency–Client Portal** — Manage clients, track projects, post updates, collect approvals, and share files in one clean platform.

Replaces scattered WhatsApp messages, email threads, and Drive links with a structured, role-based portal for agencies and their clients.

---

## What It Does

**Agency side:**  
Create and manage clients → organize projects → post progress updates with file attachments → request client approvals → write internal notes → get notified on all activity.

**Client side:**  
Log in with provided credentials → view project updates → approve or request changes on deliverables → comment → get email alerts.

---

## Tech Stack

**Frontend:** React 18, Vite 7, React Router 6, Context API, Vanilla CSS, Lucide React  
**Backend:** Node.js, Express.js 4, MongoDB + Mongoose 8  
**Auth:** JWT + Bcryptjs  
**Files:** Multer + Cloudinary CDN  
**Email:** Nodemailer (SMTP)  
**Security:** Helmet, CORS, express-rate-limit, Zod validation

---

## Modules

| Module | Description |
|--------|-------------|
| Authentication | Agency signup/login, client portal login, JWT sessions, profile & password settings |
| Client Management | CRUD clients, auto-create client portal accounts, follow-up date reminders |
| Project Management | Create projects per client, track status (in-progress / review / completed) |
| Updates & Approvals | Post updates with files, request client approval, track approval lifecycle |
| Comments | Bidirectional comments (agency + client) on each update |
| File Upload | Cloudinary CDN — images, videos, PDFs, Office docs, archives (up to 50MB/file) |
| Notes / Timeline | Client-level activity log — calls, emails, meetings, follow-ups |
| In-App Notifications | Notification bell for both agency and client; mark as read |
| Email Notifications | Welcome email, update alerts, approval/changes emails via Nodemailer |
| Dashboard Stats | Total clients, active clients, leads, overdue follow-ups |
| Settings | Update profile name/company, change password |

---

## Project Structure

```
clientloop/
├── src/                          # Frontend (React + Vite)
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── auth/                 # Login, Signup, ClientLogin
│   │   ├── agency/               # Dashboard, Clients, ClientDetail, ProjectDetail, Settings
│   │   └── client/               # ClientDashboard, ClientProjectView
│   ├── layouts/                  # AgencyLayout (sidebar + nav), ClientLayout
│   ├── context/                  # AuthContext, DataContext
│   ├── api/                      # fetch wrappers for all API calls
│   ├── index.css                 # Design system (CSS variables, tokens)
│   └── components.css            # Shared component styles
│
├── server/                       # Backend (Express + MongoDB)
│   └── src/
│       ├── index.js              # Server entry, all routes mounted here
│       ├── controllers/          # authController, clientController, projectController,
│       │                         # updateController, commentController, noteController,
│       │                         # notificationController
│       ├── models/               # User, Client, Project, Update, Note, Comment, Notification
│       ├── routes/               # Route files per resource
│       ├── middleware/           # auth.js (protect, requireAgency, requireClient), errorHandler
│       ├── utils/                # cloudinary.js, Emailservice.js, generateToken.js, validationSchemas.js
│       └── config/db.js          # MongoDB connection
│
├── index.html
├── vite.config.js
├── .env.example
└── package.json
```

---

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- SMTP credentials (Gmail app password, Mailtrap, etc.)

### 1. Install

```bash
git clone https://github.com/yash9154/Clientloop.git
cd clientloop

npm install          # frontend deps

cd server
npm install          # backend deps
cd ..
```

### 2. Configure

**Frontend** — create `.env` in root:
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend** — create `.env` inside `server/`:
```env
PORT=5000
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="ClientLoop <noreply@clientloop.app>"
```

### 3. Run

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
npm run dev
```

Open `http://localhost:5173`

### 4. Seed (optional)
```bash
cd server && npm run seed
```

---

## API Overview

All routes prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

| Resource | Routes |
|----------|--------|
| Auth | `POST /auth/signup` · `POST /auth/login` · `GET /auth/me` · `PUT /auth/profile` · `PUT /auth/password` |
| Clients | `GET/POST /clients` · `GET/PUT/DELETE /clients/:id` |
| Projects | `GET /projects/my-projects` · `GET/POST /projects` · `GET/PUT/DELETE /projects/:id` |
| Updates | `GET/POST /updates` · `PUT /updates/:id/approve` · `PUT /updates/:id/request-changes` |
| Comments | `GET /comments/:updateId` · `POST/DELETE /comments` |
| Notes | `GET /notes/client/:clientId` · `POST/DELETE /notes` |
| Notifications | `GET /notifications` · `PUT /notifications/:id/read` · `PUT /notifications/read-all` |

---

## Two User Roles

| | Agency | Client |
|---|--------|--------|
| Login URL | `/login` | `/client-login` |
| Creates account via | `/signup` | Auto-created when agency adds a client |
| Access | Full dashboard | Read-only project portal |
| Can post updates | ✅ | ❌ |
| Can approve updates | ❌ | ✅ |
| Can post comments | ✅ | ✅ |

---

## License

MIT
