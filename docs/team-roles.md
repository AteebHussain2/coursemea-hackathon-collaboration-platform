# 👥 Day 1 – Team Formation & Role Assignments

> **Hackathon Day 1** | CourseMea 2026  
> Focus: Organizing the team structure and defining responsibilities for 15 days.

---

## 🧩 Team Structure

> *(Update this section with actual team member names)*

| # | Name | Role | Primary Focus |
|---|---|---|---|
| 1 | *Ateeb Hussain* | **Full Stack Lead / Project Manager** | Architecture, final decisions, Day 15 presentation |
| 2 | *Ateeb Hussain* | **Backend Developer** | Node.js, Express APIs, MongoDB, JWT Auth |
| 3 | *Ateeb Hussain* | **Frontend Developer** | React.js, UI components, Tailwind CSS |
| 4 | *Ateeb Hussain* | **Full Stack Developer** | Dashboard, File Uploads, Testing |
| 5 | *Ateeb Hussain* | **UI/UX Designer + Frontend** | Wireframes, Design System, Responsiveness |

---

## 🎭 Roles & Responsibilities

### 🟥 Full Stack Lead / Project Manager
**Day-to-day responsibilities:**
- Oversee overall architecture decisions
- Ensure daily Git commits and branching discipline
- Coordinate between frontend and backend developers
- Conduct daily stand-ups (15 min, every morning)
- Lead the Day 15 demo and presentation

**Owns:**
- `README.md`, `Day-1/` documentation
- Final code review before commits to `main`

---

### 🟦 Backend Developer
**Day-to-day responsibilities:**
- Set up Express.js server and MongoDB connection
- Design and implement all REST API endpoints
- Implement JWT authentication and middleware
- Write and document API contracts (Postman collections)
- Handle data validation and error handling

**Owns:**
- `/backend/` directory
- Database schema design (Day 3)
- All API routes, controllers, models, middleware

---

### 🟩 Frontend Developer
**Day-to-day responsibilities:**
- Build React component library
- Connect frontend to backend APIs using Axios/Fetch
- Implement state management with Context API or Redux
- Create responsive layouts with Tailwind CSS
- Handle form validation and user feedback (toasts, loaders)

**Owns:**
- `/frontend/src/components/` directory
- Routing (`react-router-dom`)
- Forms and auth flow pages

---

### 🟨 Full Stack Developer (Dashboard & Features)
**Day-to-day responsibilities:**
- Implement both backend and frontend for Dashboard module
- Handle file upload API (Multer) and frontend integration
- Write test cases and perform bug fixes on Day 14
- Support both backend and frontend teams as needed

**Owns:**
- Dashboard module (Day 11)
- File upload system (Day 12)
- Testing & QA (Day 14)

---

### 🟪 UI/UX Designer + Frontend
**Day-to-day responsibilities:**
- Create all wireframes on Day 4 (using Figma or draw.io)
- Define color palette, typography, spacing system
- Implement design system in Tailwind CSS config
- Polish animations, transitions, and mobile responsiveness (Day 13)
- Ensure the app looks professional for the final demo

**Owns:**
- `/frontend/src/pages/` directory
- `tailwind.config.js` design tokens
- All wireframes and mockups

---

## 📆 Daily Team Workflow

```
┌──────────────────────────────────────────────────┐
│  🌅 MORNING (9:00 AM)   │  Daily Stand-up (15 min)  │
│  ❓ What did I do yesterday?                       │
│  🎯 What will I do today?                         │
│  🚧 Any blockers?                                 │
├──────────────────────────────────────────────────┤
│  💻 WORK SESSION        │  Hands-on development    │
│  Each member works on their assigned module       │
│  Git commits: minimum 2 commits per person/day    │
├──────────────────────────────────────────────────┤
│  🌇 EVENING (5:00 PM)   │  Daily Push + Review     │
│  Push code to GitHub                              │
│  Update task checklist                            │
│  Inform lead of progress/blockers                 │
└──────────────────────────────────────────────────┘
```

---

## 🌿 Git Branching Strategy

```
main          ← Production-ready code only (merge after review)
├── develop   ← Active development branch
│   ├── feature/auth          ← Authentication (Day 6)
│   ├── feature/workspace     ← Workspaces (Day 7)
│   ├── feature/projects      ← Projects (Day 8)
│   ├── feature/tasks         ← Tasks (Day 9)
│   ├── feature/collaboration ← Comments & Announcements (Day 10)
│   ├── feature/dashboard     ← Dashboard (Day 11)
│   └── feature/file-uploads  ← File Uploads (Day 12)
```

**Commit conventions:**
```
feat: add user registration endpoint
fix: resolve JWT expiry bug
docs: update API documentation
style: format dashboard component
test: add task management unit tests
```

---

## 📌 Ground Rules

1. **No direct pushes to `main`** — all merges go through a PR
2. **Daily commits are mandatory** — no "I'll push everything at the end"
3. **Ask early, ask often** — don't stay blocked for more than 30 minutes without flagging it
4. **Respect the scope** — do not start new features before core features are done
5. **Document as you go** — update API docs and comments alongside code
