# ✅ Finalized Feature List

> **Day 2** | CourseMea Hackathon 2026  
> Prioritized by: **Must Have → Should Have → Nice to Have**  
> Based on hackathon requirements + competitive research (Trello, Notion, ClickUp)

---

## Priority Legend

| Label | Meaning |
|---|---|
| 🔴 **P0 – Must Have** | Core functionality; demo fails without it |
| 🟡 **P1 – Should Have** | Important; expected for a professional product |
| 🟢 **P2 – Nice to Have** | Polish; add only if time allows after P0+P1 |

---

## Module 1 – Authentication & User Management

| # | Feature | Priority | Day |
|---|---|---|---|
| 1.1 | User registration (name, email, password) | 🔴 P0 | Day 6 |
| 1.2 | Email/password login with JWT | 🔴 P0 | Day 6 |
| 1.3 | JWT access token + refresh token | 🔴 P0 | Day 6 |
| 1.4 | Protected routes (auth middleware) | 🔴 P0 | Day 6 |
| 1.5 | User profile (view & edit: name, bio, avatar URL) | 🟡 P1 | Day 6 |
| 1.6 | Password change (current → new password) | 🟡 P1 | Day 6 |
| 1.7 | Logout (invalidate refresh token) | 🔴 P0 | Day 6 |
| 1.8 | Forgot password / reset via email | 🟢 P2 | Day 12 |

---

## Module 2 – Workspace Management

| # | Feature | Priority | Day |
|---|---|---|---|
| 2.1 | Create a workspace (name, description, logo URL) | 🔴 P0 | Day 7 |
| 2.2 | List workspaces for current user | 🔴 P0 | Day 7 |
| 2.3 | Invite members by email to workspace | 🔴 P0 | Day 7 |
| 2.4 | Accept/decline workspace invitation | 🟡 P1 | Day 7 |
| 2.5 | Assign member roles: Admin / Member / Guest | 🔴 P0 | Day 7 |
| 2.6 | Remove a member from workspace | 🟡 P1 | Day 7 |
| 2.7 | Leave a workspace | 🟡 P1 | Day 7 |
| 2.8 | Edit workspace settings (name, description) | 🟡 P1 | Day 7 |
| 2.9 | Delete workspace (Admin only) | 🟡 P1 | Day 7 |
| 2.10 | Shareable invite link for workspace | 🟢 P2 | Day 12 |

---

## Module 3 – Project Management

| # | Feature | Priority | Day |
|---|---|---|---|
| 3.1 | Create project (name, description, deadline) | 🔴 P0 | Day 8 |
| 3.2 | List projects in a workspace | 🔴 P0 | Day 8 |
| 3.3 | View project details | 🔴 P0 | Day 8 |
| 3.4 | Edit project (name, description, deadline) | 🔴 P0 | Day 8 |
| 3.5 | Delete project | 🔴 P0 | Day 8 |
| 3.6 | Project status: Active / On Hold / Completed / Archived | 🟡 P1 | Day 8 |
| 3.7 | Assign members to a project | 🟡 P1 | Day 8 |
| 3.8 | Project progress indicator (% tasks completed) | 🟡 P1 | Day 8 |

---

## Module 4 – Task Management

| # | Feature | Priority | Day |
|---|---|---|---|
| 4.1 | Create task (title, description, assignee, due date) | 🔴 P0 | Day 9 |
| 4.2 | List tasks in a project (Kanban view) | 🔴 P0 | Day 9 |
| 4.3 | Task status: To Do / In Progress / In Review / Done | 🔴 P0 | Day 9 |
| 4.4 | Task priority: Low / Medium / High / Critical | 🔴 P0 | Day 9 |
| 4.5 | Edit task details | 🔴 P0 | Day 9 |
| 4.6 | Delete task | 🔴 P0 | Day 9 |
| 4.7 | Move task between status columns | 🔴 P0 | Day 9 |
| 4.8 | Sub-tasks / checklist items within a task | 🟡 P1 | Day 9 |
| 4.9 | Filter tasks by assignee, priority, status | 🟡 P1 | Day 9 |
| 4.10 | Task due date in-app reminder (badge/notification) | 🟡 P1 | Day 12 |
| 4.11 | Email reminder 24h before due date | 🟢 P2 | Day 12 |
| 4.12 | Duplicate a task | 🟢 P2 | Day 13 |

---

## Module 5 – Collaboration & Communication

| # | Feature | Priority | Day |
|---|---|---|---|
| 5.1 | Add comments on a task | 🔴 P0 | Day 10 |
| 5.2 | View all comments on a task (chronological) | 🔴 P0 | Day 10 |
| 5.3 | Edit / delete own comment | 🟡 P1 | Day 10 |
| 5.4 | Workspace-wide announcements (Admin posts) | 🟡 P1 | Day 10 |
| 5.5 | Activity log per project (who did what, when) | 🔴 P0 | Day 10 |
| 5.6 | Activity log per task | 🟡 P1 | Day 10 |
| 5.7 | @mention members in comments (basic, no real-time) | 🟢 P2 | Day 13 |

---

## Module 6 – Productivity Dashboard

| # | Feature | Priority | Day |
|---|---|---|---|
| 6.1 | Personal dashboard: my tasks, upcoming deadlines | 🔴 P0 | Day 11 |
| 6.2 | Project overview card (name, status, progress %) | 🔴 P0 | Day 11 |
| 6.3 | Task status distribution chart (Pie chart) | 🟡 P1 | Day 11 |
| 6.4 | Team task completion over time (Bar/Line chart) | 🟡 P1 | Day 11 |
| 6.5 | Overdue tasks list | 🔴 P0 | Day 11 |
| 6.6 | Member performance: tasks completed per person | 🟡 P1 | Day 11 |
| 6.7 | Workspace-level stats (total projects, tasks, members) | 🟡 P1 | Day 11 |

---

## Module 7 – File Uploads & Notifications

| # | Feature | Priority | Day |
|---|---|---|---|
| 7.1 | Attach files to a task (upload from device) | 🔴 P0 | Day 12 |
| 7.2 | Attach files to a project | 🟡 P1 | Day 12 |
| 7.3 | View/download attached files | 🔴 P0 | Day 12 |
| 7.4 | Delete own attached file | 🟡 P1 | Day 12 |
| 7.5 | In-app notification bell (count badge) | 🟡 P1 | Day 12 |
| 7.6 | Notification list: task assigned, comment added, deadline | 🟡 P1 | Day 12 |
| 7.7 | Mark notifications as read | 🟡 P1 | Day 12 |
| 7.8 | Email notification (task assigned, deadline reminder) | 🟢 P2 | Day 12 |

---

## Summary Count

| Priority | Features | Target |
|---|---|---|
| 🔴 P0 – Must Have | 28 features | 100% by Day 14 |
| 🟡 P1 – Should Have | 24 features | 90%+ by Day 14 |
| 🟢 P2 – Nice to Have | 6 features | Best effort in Day 13 |
| **Total** | **58 features** | |
