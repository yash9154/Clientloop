# 🎯 ClientLoop

**B2B SaaS Client Portal for Agencies** — Share updates, manage approvals, and collaborate with clients in one professional portal.

---

## 📖 What Is ClientLoop?

ClientLoop replaces scattered WhatsApp messages, email chains, and Google Drive links with **one clean portal** for agency-client communication:

- **Project Updates** — Post progress with rich text and file attachments
- **Approval Workflows** — Request and track client approvals in real-time
- **File Sharing** — Upload deliverables via Cloudinary CDN
- **Comments** — Contextual feedback on each update
- **Notifications** — In-app alerts for approvals and activity
- **Billing** — Stripe-powered subscription plans (Free / Starter / Agency)

**Two user roles:**
| Role | Access |
|------|--------|
| **Agency** | Full dashboard — manage clients, projects, updates, billing |
| **Client** | Read-only portal — view updates, approve/reject, comment |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | Component-based UI |
| Vite 7 | Dev server & build tool |
| React Router 6 | Client-side routing |
| Context API | Global state (Auth + Data) |
| Lucide React | Icon library |
| Vanilla CSS | Custom design system |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js 16+ | JavaScript runtime |
| Express.js 4 | REST API framework |
| MongoDB + Mongoose | Database & ODM |
| JWT + Bcryptjs | Authentication |
| Multer | File upload middleware |
| Zod | Request validation |
| Cloudinary | File/image CDN |
| Helmet + CORS | Security |
| express-rate-limit | DDoS protection |

### External Services
- **MongoDB Atlas** — Managed database
- **Cloudinary** — File & image hosting
- **Stripe** — Payment processing
- **Google OAuth** — Social login

---

## 📦 Modules

| # | Module | Description |
|---|--------|-------------|
| 1 | **Authentication** | Register, login (email + Google OAuth), JWT sessions, password reset |
| 2 | **Client Management** | CRUD clients, auto-generate client user accounts |
| 3 | **Project Management** | Create projects per client, track status |
| 4 | **Updates** | Post updates with files, request approvals, track approval status |
| 5 | **Comments** | Threaded discussions on updates |
| 6 | **File Upload** | Upload to Cloudinary, store metadata |
| 7 | **Notifications** | In-app notification system with read/unread tracking |
| 8 | **Billing** | Stripe subscriptions (Free / Starter / Agency plans) |
| 9 | **Statistics** | Dashboard analytics and metrics |

---

## 📁 Project Structure

```
clientloop/
├── src/                        # Frontend (React + Vite)
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── auth/               # Login, Signup, ClientLogin
│   │   ├── agency/             # Dashboard, Clients, Projects, Billing, Settings
│   │   └── client/             # ClientDashboard, ClientProjectView
│   ├── layouts/                # AgencyLayout, ClientLayout
│   ├── context/                # AuthContext, DataContext
│   ├── api/                    # API call functions
│   ├── App.jsx                 # Root component + routing
│   ├── main.jsx                # Entry point
│   ├── index.css               # Global styles
│   └── components.css          # Component styles
│
├── server/                     # Backend (Express + MongoDB)
│   └── src/
│       ├── index.js            # Server entry point
│       ├── controllers/        # Auth, Client, Project, Update, Comment, etc.
│       ├── models/             # User, Client, Project, Update, Comment, Notification
│       ├── routes/             # API route definitions
│       ├── middleware/         # Auth, validation, error handler
│       ├── utils/              # Cloudinary, email, JWT, Zod schemas
│       └── config/db.js        # MongoDB connection
│
├── public/                     # Static assets
├── index.html                  # HTML entry
├── vite.config.js              # Vite config
├── .env.example                # Environment template
├── .gitignore
└── package.json                # Frontend dependencies
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 16+** & npm
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Cloudinary** account ([cloudinary.com](https://cloudinary.com))
- **Google OAuth** credentials (optional, for social login)

### 1. Clone & Install

```bash
git clone https://github.com/yash9154/Clientloop.git
cd clientloop

# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment

**Frontend** — copy `.env.example` to `.env` in root:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ClientLoop
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

**Backend** — copy `server/.env.example` to `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clientloop
JWT_SECRET=your-secret-jwt-key
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Run

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
npm run dev
```

Open **http://localhost:5173** in your browser.

### 4. Seed Data (Optional)
```bash
cd server
npm run seed
```

---

## 🔌 API Overview

All endpoints prefixed with `/api`. Auth routes are public; others require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new agency user |
| POST | `/auth/login` | Login (returns JWT) |
| GET | `/auth/me` | Get current user |
| GET/POST | `/clients` | List / Create clients |
| GET/PUT/DELETE | `/clients/:id` | Client CRUD |
| GET/POST | `/projects` | List / Create projects |
| GET/PUT/DELETE | `/projects/:id` | Project CRUD |
| GET/POST | `/updates` | List / Create updates |
| PUT | `/updates/:id/approve` | Approve update |
| PUT | `/updates/:id/request-changes` | Request changes |
| GET/POST | `/comments` | List / Add comments |
| POST | `/upload` | Upload file to Cloudinary |
| GET | `/notifications` | Get user notifications |
| GET | `/stats` | Dashboard statistics |
| GET/PUT | `/billing/plan` | Billing & subscription |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  <strong>Made with ❤️ by the ClientLoop Team</strong>
</div>
