# 🚀 Smart Productivity & Collaboration Platform

> **CourseMea Hackathon 2026** — 15-Day Full Stack Project  
> **Stack:** MongoDB · Express.js · React.js · Node.js (MERN)

---

## 📌 Project Vision

Build a professional-grade **team collaboration and project management platform** — think Trello meets Notion meets Slack — where teams can create workspaces, manage projects, assign tasks, communicate in real-time, and track productivity through rich dashboards.

This platform aims to demonstrate mastery of full-stack development by shipping a real-world application from concept to deployment in 15 days.

---

## 🎯 Core Features

| Module | Description |
|---|---|
| 🔐 **Authentication** | JWT-based registration, login, and role-based access control |
| 🏢 **Workspace Management** | Create/join teams, invite members, manage roles |
| 📋 **Project Management** | CRUD for projects with status tracking and ownership |
| ✅ **Task Management** | Assign tasks, set due dates, priority levels, and progress tracking |
| 💬 **Collaboration** | Task comments, team announcements, and activity logs |
| 📊 **Dashboard** | Progress charts, performance analytics, and team statistics |
| 📎 **File Sharing** | Upload and attach files to tasks; deadline reminders |

---

## 🗓️ 15-Day Hackathon Plan

| Day | Focus |
|---|---|
| **Day 1** | Mentoring & Problem Understanding |
| **Day 2** | Research & Feature Planning |
| **Day 3** | System Design (DB Schema, API Structure) |
| **Day 4** | UI/UX Design & Wireframes |
| **Day 5** | Project Setup (GitHub, MERN Skeleton) |
| **Day 6** | Authentication System (JWT) |
| **Day 7** | Workspace Management |
| **Day 8** | Project Management Module |
| **Day 9** | Task Management Module |
| **Day 10** | Collaboration Features |
| **Day 11** | Productivity Dashboard |
| **Day 12** | File Uploads & Notifications |
| **Day 13** | UI Polishing & Responsiveness |
| **Day 14** | Testing & Bug Fixing |
| **Day 15** | Final Submission & Presentation |

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Redux (optional)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JSON Web Tokens (JWT)
- **Tools:** Git/GitHub, Postman, VS Code

---

## 📁 Project Structure

```
Collaboration Platform/
├── README.md
├── hackathon_details.pdf
│
├── docs/                          # All planning & documentation
│   ├── business-logic.md          # Business problem, actors, user journeys
│   ├── project-scope.md           # In/out-of-scope features, Definition of Done
│   ├── team-roles.md              # Team formation, roles, Git workflow
│   ├── tech-stack.md              # Technology choices & rationale
│   ├── questions-and-clarifications.md
│   ├── research/                  # Day 2 competitive analysis & feature list
│   │   ├── competitive-analysis.md
│   │   ├── feature-list.md
│   │   └── user-stories.md
│   ├── system-design/             # Day 3 DB schema, API structure, flow diagrams
│   └── wireframes/                # Day 4 UI wireframes & design tokens
│
├── backend/                       # Node.js + Express API
│   ├── src/
│   │   ├── config/                # DB connection, env setup
│   │   ├── controllers/           # Route handler logic
│   │   ├── middleware/            # Auth, error handling, validation
│   │   ├── models/                # Mongoose schemas
│   │   ├── routes/                # Express route definitions
│   │   └── utils/                 # Helpers, email, file upload
│   ├── .env.example
│   └── package.json
│
└── frontend/                      # React Application
    ├── src/
    │   ├── assets/                # Images, icons, fonts
    │   ├── components/            # Reusable UI components
    │   ├── context/               # React Context (global state)
    │   ├── hooks/                 # Custom React hooks
    │   ├── pages/                 # Page-level components
    │   ├── services/              # Axios API calls
    │   └── utils/                 # Helpers, constants, formatters
    ├── index.html
    └── package.json
```

---

## 👥 Team

See [`docs/team-roles.md`](./docs/team-roles.md) for team formation and role assignments.

---

*Started: March 2026 | CourseMea Batch 2026*
