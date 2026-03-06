# 🛠️ Day 1 – Technology Stack Decisions

> **Hackathon Day 1** | CourseMea 2026  
> Focus: Finalizing the tech stack with clear rationale for each choice.

---

## 📦 Core Stack — MERN

| Layer | Technology | Version (target) | Why? |
|---|---|---|---|
| **Frontend** | React.js | v18+ | Component-based, huge ecosystem, industry standard |
| **Backend** | Node.js + Express.js | Node 20 LTS | JavaScript everywhere, fast non-blocking I/O |
| **Database** | MongoDB + Mongoose | MongoDB 7 | Flexible schemas fit our dynamic project/task structure |
| **Auth** | JSON Web Tokens (JWT) | — | Stateless, scalable, industry standard for REST APIs |

---

## 🎨 Frontend Stack

| Technology | Purpose | Why Chosen |
|---|---|---|
| **React.js 18** | UI framework | Reusable components, virtual DOM, React Hooks |
| **Tailwind CSS v3** | Styling | Utility-first, rapid prototyping, highly customizable |
| **React Router v6** | Client-side routing | Declarative routing, nested routes support |
| **Axios** | HTTP client | Clean API, interceptors for auth headers, better than fetch for complex apps |
| **React Context API** | State management | Sufficient for our scale; Redux only if needed |
| **Recharts** | Dashboard charts | Lightweight React-native charting library |
| **React Hot Toast** | Notifications | Beautiful, accessible toast notifications |
| **React Hook Form** | Form management | Minimal re-renders, built-in validation |

---

## ⚙️ Backend Stack

| Technology | Purpose | Why Chosen |
|---|---|---|
| **Node.js 20 LTS** | Runtime | Non-blocking I/O, JavaScript full-stack |
| **Express.js 4** | Web framework | Minimal, flexible, huge middleware ecosystem |
| **Mongoose 8** | MongoDB ODM | Schema validation, middleware, easy relations |
| **jsonwebtoken** | Auth tokens | Sign and verify JWT access + refresh tokens |
| **bcryptjs** | Password hashing | Industry standard for secure password storage |
| **Multer** | File uploads | Multipart form data handling for file attachments |
| **cors** | Cross-origin | Allow React frontend to call Express backend |
| **dotenv** | Environment variables | Keep secrets out of source code |
| **express-validator** | Input validation | Sanitize and validate request bodies |
| **nodemailer** | Email notifications | Send deadline reminders and invite emails |

---

## 🗄️ Database Design Philosophy

**Why MongoDB?**
- Our data model has **variable-depth nesting** (workspaces → projects → tasks → sub-tasks → comments)
- Teams/workspaces have different field requirements — MongoDB's flexible schema is ideal
- JSON-native documents match our API response format directly
- Horizontal scaling is built-in if the platform grows

**Key Collections (to be detailed on Day 3):**
```
users          → profiles, auth credentials
workspaces     → team spaces, member roles
projects       → project metadata, status
tasks          → assignments, priorities, deadlines, sub-tasks
comments       → attached to tasks
notifications  → in-app alerts
files          → uploaded file metadata
activityLogs   → audit trail of all actions
```

---

## 🔧 Developer Tools

| Tool | Purpose |
|---|---|
| **VS Code** | Primary IDE |
| **Git + GitHub** | Version control and collaboration |
| **Postman** | API testing and documentation |
| **MongoDB Compass** | GUI for database inspection during development |
| **draw.io / Excalidraw** | System design and flow diagrams (Day 3) |
| **Figma** | UI wireframes and mockups (Day 4) |
| **npm** | Package manager |

---

## 🚀 Deployment Stack *(Day 14/15)*

| Service | Purpose |
|---|---|
| **Render / Railway** | Backend hosting (free tier, Node.js) |
| **Vercel / Netlify** | Frontend hosting (free tier, React) |
| **MongoDB Atlas** | Cloud database (free M0 cluster) |
| **Cloudinary** | File/image storage (if not using local Multer storage) |

---

## ⚠️ Key Decisions & Trade-offs

| Decision | Rationale |
|---|---|
| **Context API over Redux** | Our team size and app complexity don't warrant Redux overhead; can migrate if needed |
| **REST API over GraphQL** | Simpler to implement in 15 days; REST is sufficient for our endpoints |
| **Local file storage → Cloudinary** | Start with local Multer storage; migrate to Cloudinary on Day 12 |
| **No real-time WebSocket** | Socket.io adds significant complexity; activity feed is polled instead |
| **MongoDB over PostgreSQL** | Flexible schema suits our rapidly evolving data model during development |
