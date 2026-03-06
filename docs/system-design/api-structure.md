# 🌐 REST API Structure – System Design (Day 3)

> **CourseMea Hackathon 2026**  
> Architecture: RESTful API via Express.js  
> Auth: Bearer Token (JWT) in Headers

This document outlines the API endpoints required to support the frontend application.

---

## Base URL
`/api/v1/`

## Response Format (Standard Wrapper)
All endpoints will return a standard JSON structure:
```json
{
  "success": true,               // or false
  "message": "Action success",   // human-readable message
  "data": { ... }                // the requested payload (null on error)
}
```

---

## 🔐 1. Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| POST | `/auth/register` | Create a new user account | ❌ |
| POST | `/auth/login` | Authenticate user, returns access token (refresh token in cookie) | ❌ |
| POST | `/auth/refresh` | Issue new access token using valid refresh token cookie | ❌ |
| POST | `/auth/logout` | Invalidate refresh token and clear cookie | ✅ |

---

## 👤 2. User Profile (`/users`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| GET | `/users/me` | Get current logged-in user's profile | ✅ |
| PUT | `/users/me` | Update name, bio, or avatar | ✅ |
| PUT | `/users/me/password` | Change password | ✅ |

---

## 🏢 3. Workspaces (`/workspaces`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| POST | `/workspaces` | Create a new workspace | ✅ |
| GET | `/workspaces` | Get all workspaces the user belongs to | ✅ |
| GET | `/workspaces/:id` | Get workspace details (requires membership) | ✅ |
| PUT | `/workspaces/:id` | Update workspace (Admin only) | ✅ |
| DELETE| `/workspaces/:id` | Delete workspace (Admin only) | ✅ |
| GET | `/workspaces/:id/members` | List all members in the workspace | ✅ |
| POST | `/workspaces/:id/invite` | Invite user by email (Admin only) | ✅ |
| PUT | `/workspaces/:id/members/:userId`| Update member role (Admin only) | ✅ |
| DELETE| `/workspaces/:id/members/:userId`| Remove member / Leave workspace | ✅ |

---

## 📋 4. Projects (`/workspaces/:workspaceId/projects`)

*Note: Projects are nested under workspaces to ensure strict access control.*

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| POST | `/.../projects` | Create a new project | ✅ |
| GET | `/.../projects` | List all projects in workspace | ✅ |
| GET | `/.../projects/:projectId` | Get detailed project info | ✅ |
| PUT | `/.../projects/:projectId` | Update project details / status | ✅ |
| DELETE| `/.../projects/:projectId` | Delete project | ✅ |

---

## ✅ 5. Tasks (`/projects/:projectId/tasks`)

*Note: Tasks are nested under projects.*

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| POST | `/.../tasks` | Create a new task in the project | ✅ |
| GET | `/.../tasks` | Get all tasks for the project Kanban board | ✅ |
| GET | `/.../tasks/:taskId` | Get task details | ✅ |
| PUT | `/.../tasks/:taskId` | Update task (assignee, description, etc.) | ✅ |
| PATCH | `/.../tasks/:taskId/status` | Update just the status (for drag-and-drop) | ✅ |
| DELETE| `/.../tasks/:taskId` | Delete task | ✅ |
| POST | `/.../tasks/:taskId/subtasks` | Add a sub-task | ✅ |
| PUT | `/.../tasks/:taskId/subtasks/:id`| Toggle sub-task status | ✅ |

---

## 💬 6. Comments (`/tasks/:taskId/comments`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| POST | `/.../comments` | Add a comment to a task | ✅ |
| GET | `/.../comments` | Get all comments for a task | ✅ |
| PUT | `/.../comments/:commentId` | Edit own comment | ✅ |
| DELETE| `/.../comments/:commentId` | Delete own comment | ✅ |

---

## 📊 7. Dashboard & Analytics (`/analytics`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| GET | `/analytics/personal` | Get my tasks (due soon, overdue) across all workspaces | ✅ |
| GET | `/analytics/workspace/:id` | Get team dashboard stats for a specific workspace | ✅ |

---

## 📎 8. File Uploads (`/files`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| POST | `/files/upload` | Upload a file (multipart/form-data) | ✅ |
| GET | `/files/target/:type/:id` | Get files attached to a Task or Project | ✅ |
| DELETE| `/files/:fileId` | Delete a file | ✅ |

---

## 🔔 9. Activity Feed / Notifications

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| GET | `/activity/workspace/:id` | Get chronological audit log for workspace | ✅ |
| GET | `/notifications` | Get unread notifications for current user | ✅ |
| PUT | `/notifications/:id/read` | Mark specific notification as read | ✅ |
| PUT | `/notifications/read-all` | Mark all notifications as read | ✅ |
