# 📐 Day 1 – Project Scope Definition

> **Hackathon Day 1** | CourseMea 2026  
> Focus: Clearly defining what we *will* and *will not* build in 15 days.

---

## 🎯 Project Goals

1. **Build a fully functional MERN-stack collaboration platform** shippable in 15 days
2. **Demonstrate professional-grade engineering practices**: clean code, Git workflow, RESTful APIs, JWT auth
3. **Deliver real value**: a platform that real teams could actually use to manage work
4. **Present confidently on Day 15**: live demo, code walkthrough, architecture explanation

---

## ✅ In Scope (We WILL Build This)

### 🔐 Module 1 – Authentication & User Management
- [x] Email/password registration with validation
- [x] JWT-based login (access token + refresh token)
- [x] Protected routes (role-based access control)
- [x] User profile: avatar, name, bio, timezone
- [x] Password change functionality

### 🏢 Module 2 – Workspace Management
- [x] Create a named workspace
- [x] Generate invite link or invite by email
- [x] Role assignment: Admin, Member, Guest
- [x] Leave or remove members from workspace
- [x] Workspace settings (name, logo, description)

### 📋 Module 3 – Project Management
- [x] Create / Read / Update / Delete (CRUD) projects
- [x] Project statuses: Active, On Hold, Completed, Archived
- [x] Project description, deadline, assigned members

### ✅ Module 4 – Task Management
- [x] Full CRUD for tasks within a project
- [x] Assign tasks to specific members
- [x] Priority levels: Low / Medium / High / Critical
- [x] Task statuses: To Do / In Progress / In Review / Done
- [x] Due dates with 24-hour email/in-app reminders
- [x] Sub-tasks (checklist items inside a task)

### 💬 Module 5 – Collaboration & Communication
- [x] Task-level comments (text)
- [x] Workspace-wide announcements
- [x] Activity log (who did what, when — per project and per task)

### 📊 Module 6 – Productivity Dashboard
- [x] Personal dashboard: tasks assigned to me, upcoming deadlines
- [x] Team dashboard: overall project progress, member performance charts
- [x] Visual stats: bar charts, pie charts, completion rates

### 📎 Module 7 – File Uploads
- [x] Attach files to tasks or projects (PDF, DOCX, images)
- [x] Max 10 MB per file; secure storage
- [x] View/download/delete uploaded files

---

## ❌ Out of Scope (We Will NOT Build This in 15 Days)

| Feature | Reason |
|---|---|
| Native mobile app (iOS/Android) | Requires React Native + separate timeline |
| Real-time chat (WebSocket/Socket.io) | Complex infrastructure; not required by brief |
| AI-powered task suggestions | Out of scope per hackathon requirements |
| Payment / subscription system | Not mentioned in requirements |
| Calendar integration (Google/Outlook) | Third-party OAuth complexity |
| Video/audio conferencing | Requires WebRTC; separate expertise |
| Multi-language (i18n) support | Adds significant overhead |
| Automated CI/CD pipeline | Nice to have but not in 15-day plan |
| Dark mode | Can be added in Day 13 polish if time allows |

---

## 📏 Definition of Done (DoD)

A feature is considered **complete** when:
1. ✅ The backend API endpoint is implemented and tested in Postman
2. ✅ The frontend UI is connected and functional (no hardcoded data)
3. ✅ The feature works end-to-end (create, read, update, delete as applicable)
4. ✅ Basic input validation and error messages are in place
5. ✅ The code is committed to GitHub with a meaningful commit message

---

## 📊 Effort Estimation

| Module | Estimated Days | Assigned Days |
|---|---|---|
| Authentication | 1 day | Day 6 |
| Workspace Management | 1 day | Day 7 |
| Project Management | 1 day | Day 8 |
| Task Management | 1 day | Day 9 |
| Collaboration Features | 1 day | Day 10 |
| Dashboard | 1 day | Day 11 |
| File Uploads & Notifications | 1 day | Day 12 |
| UI Polish & Responsiveness | 1 day | Day 13 |
| Testing & Bug Fixing | 1 day | Day 14 |
| **Total** | **9 dev days** | Days 6–14 |
