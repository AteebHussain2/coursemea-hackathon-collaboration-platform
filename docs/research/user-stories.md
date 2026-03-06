# 📖 User Stories – Smart Productivity & Collaboration Platform

> **Day 2** | CourseMea Hackathon 2026  
> Format: `As a [role], I want to [action], so that [benefit].`  
> Acceptance Criteria define when a story is done.

---

## Module 1 – Authentication

### US-1.1: User Registration
> **As a** new user, **I want to** register with my name, email, and password,  
> **so that** I can create an account and access the platform.

**Acceptance Criteria:**
- [ ] Form validates name (required), email (valid format), password (min 8 chars, 1 number)
- [ ] Duplicate email shows a clear error message
- [ ] On success, user is redirected to dashboard / workspace setup
- [ ] Password is stored as a bcrypt hash (never plain text)

---

### US-1.2: User Login
> **As a** registered user, **I want to** log in with my email and password,  
> **so that** I can securely access my workspaces and tasks.

**Acceptance Criteria:**
- [ ] Incorrect credentials show a generic error (no enumeration of which field is wrong)
- [ ] On success, JWT access token is stored in memory; refresh token in httpOnly cookie
- [ ] User is redirected to their dashboard

---

### US-1.3: User Logout
> **As a** logged-in user, **I want to** log out,  
> **so that** my session is ended and my data stays secure.

**Acceptance Criteria:**
- [ ] Refresh token is invalidated on the server
- [ ] User is redirected to the login page
- [ ] Protected routes are no longer accessible after logout

---

### US-1.4: View & Edit Profile
> **As a** user, **I want to** view and update my profile (name, bio, avatar),  
> **so that** my teammates can identify me easily.

**Acceptance Criteria:**
- [ ] Profile shows name, email, bio, avatar (default placeholder if no avatar)
- [ ] User can update name and bio
- [ ] Changes are saved and visible immediately

---

## Module 2 – Workspace Management

### US-2.1: Create Workspace
> **As a** user, **I want to** create a workspace with a name and description,  
> **so that** I can set up a space for my team to collaborate.

**Acceptance Criteria:**
- [ ] Workspace name is required; description is optional
- [ ] Creator is automatically assigned the Admin role
- [ ] New workspace appears in the sidebar / workspace switcher

---

### US-2.2: Invite Team Members
> **As a** Workspace Admin, **I want to** invite members by email,  
> **so that** my team can join and start collaborating.

**Acceptance Criteria:**
- [ ] Admin enters one or more email addresses
- [ ] Invited user receives an invitation (in-app notification or email)
- [ ] Invited user can accept or decline
- [ ] On accept, user appears in workspace members list with Member role

---

### US-2.3: Manage Member Roles
> **As a** Workspace Admin, **I want to** assign roles (Admin/Member/Guest) to members,  
> **so that** I can control what each person can do.

**Acceptance Criteria:**
- [ ] Admin can change any member's role from the workspace settings
- [ ] Guest users can only view; they cannot create tasks or projects
- [ ] An Admin cannot demote the last Admin of a workspace

---

## Module 3 – Project Management

### US-3.1: Create Project
> **As a** Workspace Admin or Member, **I want to** create a project with a name, description, and deadline,  
> **so that** our work is organized into trackable units.

**Acceptance Criteria:**
- [ ] Project name is required; deadline is a valid future date
- [ ] Project status defaults to "Active"
- [ ] Creator is listed as project owner

---

### US-3.2: Track Project Status
> **As an** Admin, **I want to** update a project's status (Active / On Hold / Completed / Archived),  
> **so that** the team always knows the current state of each initiative.

**Acceptance Criteria:**
- [ ] Status badge is visible on the project card and detail page
- [ ] Archived projects are hidden from the main list but accessible via filter
- [ ] Status changes are logged in the activity feed

---

## Module 4 – Task Management

### US-4.1: Create Task
> **As a** project member, **I want to** create a task with a title, assignee, due date, and priority,  
> **so that** work is clearly defined and ownership is established.

**Acceptance Criteria:**
- [ ] Title and assignee are required; description is optional
- [ ] Priority defaults to "Medium" if not set
- [ ] Task appears on the Kanban board in the "To Do" column

---

### US-4.2: Move Task on Kanban Board
> **As a** task assignee, **I want to** drag or update the status of my task,  
> **so that** the board reflects the real-time progress of our work.

**Acceptance Criteria:**
- [ ] Task can be moved between: To Do → In Progress → In Review → Done
- [ ] Status change is saved immediately
- [ ] Status change is logged in the task's activity log

---

### US-4.3: Add Sub-tasks
> **As a** task owner, **I want to** add checklist items within a task,  
> **so that** I can break down complex work into smaller steps.

**Acceptance Criteria:**
- [ ] Each sub-task has a label and a checked/unchecked state
- [ ] Sub-task completion count is shown on the task card (e.g., "3/5 done")
- [ ] Sub-tasks can be added, renamed, checked, and deleted

---

### US-4.4: Filter Tasks
> **As a** team member, **I want to** filter tasks by status, priority, or assignee,  
> **so that** I can focus on what's relevant to me.

**Acceptance Criteria:**
- [ ] Filter controls are visible above the Kanban board
- [ ] Multiple filters can be applied simultaneously
- [ ] Filtered view updates the board in real-time without a page reload

---

## Module 5 – Collaboration

### US-5.1: Comment on Task
> **As a** team member, **I want to** add comments to a task,  
> **so that** I can discuss details and blockers without leaving the platform.

**Acceptance Criteria:**
- [ ] Comment box is visible on the task detail page
- [ ] Comments show author name, avatar, and timestamp
- [ ] Author can edit or delete their own comment

---

### US-5.2: View Activity Log
> **As a** project member, **I want to** see a chronological activity feed for a project,  
> **so that** I always know what happened without asking teammates.

**Acceptance Criteria:**
- [ ] Every key action is logged: task created, status changed, comment added, file uploaded
- [ ] Each entry shows: who, what action, on which item, and when
- [ ] Newest events appear at the top

---

## Module 6 – Dashboard

### US-6.1: Personal Dashboard
> **As a** logged-in user, **I want to** see my dashboard immediately after login,  
> **so that** I know at a glance what tasks I need to work on today.

**Acceptance Criteria:**
- [ ] Shows: tasks assigned to me (grouped by status), upcoming deadlines in next 7 days, overdue tasks
- [ ] Clicking a task navigates directly to the task detail page
- [ ] Dashboard data is workspace-specific

---

### US-6.2: Team Analytics
> **As an** Admin, **I want to** see team performance charts on the dashboard,  
> **so that** I can identify bottlenecks and track velocity.

**Acceptance Criteria:**
- [ ] Pie chart: task distribution by status (To Do / In Progress / In Review / Done)
- [ ] Bar chart: tasks completed per team member
- [ ] Stats: total tasks, completed this week, overdue count

---

## Module 7 – File Uploads

### US-7.1: Attach File to Task
> **As a** team member, **I want to** attach files to a task,  
> **so that** all relevant documents are contained in one place.

**Acceptance Criteria:**
- [ ] Supported formats: PDF, DOCX, XLSX, PNG, JPG (max 10 MB)
- [ ] Uploaded files are listed on the task detail page with filename, size, uploader, and date
- [ ] Any project member can download; only the uploader or Admin can delete

---

### US-7.2: In-App Notifications
> **As a** user, **I want to** receive in-app notifications for key events,  
> **so that** I don't miss important updates.

**Acceptance Criteria:**
- [ ] Notification bell in the navbar shows unread count badge
- [ ] Events that trigger notifications: task assigned to me, comment on my task, approaching deadline (24h)
- [ ] Clicking a notification takes me to the relevant task or project
- [ ] User can mark individual notifications or all notifications as read
