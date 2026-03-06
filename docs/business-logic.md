# 📘 Day 1 – Business Logic & Problem Understanding

> **Hackathon Day 1** | CourseMea 2026  
> Focus: Understanding the *why*, *who*, and *what* before writing any code.

---

## 🔍 The Problem

Modern teams — whether remote, hybrid, or on-site — struggle with **fragmented workflows**:
- Tasks are scattered across WhatsApp, email, and spreadsheets
- There's no single source of truth for project progress
- Team members duplicate work or miss deadlines due to poor visibility
- Communication and task tracking are disconnected from each other

**Our solution:** A unified platform where teams manage everything — projects, tasks, communication, and analytics — in one place.

---

## 👥 Key Actors (User Types)

| Actor | Description | Key Abilities |
|---|---|---|
| **Super Admin** | Platform owner / CourseMea administrator | Manage all workspaces, users, billing |
| **Workspace Admin** | Creator of a workspace (team lead) | Invite members, create projects, manage roles |
| **Member** | Regular team member | View/edit assigned tasks, comment, upload files |
| **Guest** | External collaborator with limited access | View-only access to specific projects |

---

## 🔄 Core User Journeys

### 1. Onboarding Journey
```
Register → Verify Email → Create/Join Workspace → Set Up Profile → Explore Dashboard
```

### 2. Project Creation Journey
```
Workspace Admin → Create Project → Set Description & Deadline → Assign Members → Project is Live
```

### 3. Task Management Journey
```
Admin/Member → Create Task → Assign to Member → Set Priority & Due Date → Track Progress → Mark Complete
```

### 4. Collaboration Journey
```
Member → Open Task → Add Comment → Upload Attachment → Team gets Notified → Activity Logged
```

### 5. Dashboard & Reporting Journey
```
Admin → View Dashboard → See Team Performance → Filter by Project/Member → Export/Share Report
```

---

## ⚙️ Business Rules

### Authentication & Authorization
- Users must verify their email before accessing the platform
- JWT tokens expire after **24 hours**; refresh tokens last **7 days**
- Passwords must be at least **8 characters** with at least 1 number and 1 special character
- A user can belong to **multiple workspaces**

### Workspace Rules
- Only a **Workspace Admin** can invite or remove members
- Each workspace has its own set of projects and members
- A user can create up to **3 workspaces** on the free tier

### Project Rules
- Projects belong to exactly one workspace
- A project can be **Active**, **On Hold**, **Completed**, or **Archived**
- Only Admin or Project Lead can change project status

### Task Rules
- Every task must have: a **title**, **assignee**, and **due date**
- Task priority levels: **Low**, **Medium**, **High**, **Critical**
- Task statuses: **To Do** → **In Progress** → **In Review** → **Done**
- Tasks can have **sub-tasks** (checklist items)
- Due date reminders are sent **24 hours** before deadline

### Communication Rules
- Comments are tied to specific tasks
- Announcements are workspace-wide or project-wide
- All actions (task updates, comments, file uploads) are logged in the **Activity Feed**

### File Upload Rules
- Supported formats: PDF, DOCX, XLSX, PNG, JPG, MP4
- Max file size: **10 MB per file**
- Files are stored securely and linked to their parent task or project

---

## 💡 Value Proposition

| Without Our Platform | With Our Platform |
|---|---|
| Chaotic task tracking via spreadsheets | Centralized task board with priorities & deadlines |
| No real-time updates | Live activity feed and notifications |
| No performance visibility | Analytics dashboard with charts |
| File attachments lost in email chains | Files attached directly to tasks |
| Team communication scattered | Integrated comments and announcements |
