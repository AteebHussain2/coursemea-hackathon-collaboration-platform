# 🛤️ Application Flow & User Journeys – System Design (Day 3)

> **CourseMea Hackathon 2026**  
> Focus: Visualizing how users navigate the platform and how data moves through the system.

---

## 1. Primary Authentication Flow

This diagram shows how a user enters the platform, gets authenticated via JWT, and lands on the dashboard.

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Enters Email & Password
    Frontend->>Backend: POST /auth/login
    Backend->>Database: Find User & Check Password Hash
    
    alt Invalid Credentials
        Database-->>Backend: User not found / Wrong hash
        Backend-->>Frontend: 401 Unauthorized
        Frontend-->>User: Show Error Message
    else Valid Credentials
        Database-->>Backend: User Record
        Backend->>Backend: Generate Access Token (JWT)
        Backend->>Backend: Generate Refresh Token (JWT)
        Backend-->>Frontend: 200 OK + Access Token (Body) + Refresh Token (HttpOnly Cookie)
        Frontend->>Frontend: Store Access Token in Memory/Context
        Frontend->>Frontend: Redirect to /dashboard
        Frontend-->>User: Show Personal Dashboard
    end
```

---

## 2. Token Refresh Flow (Silent Auth)

Because access tokens expire quickly (e.g., 15 mins) for security, the frontend automatically requests a new one using the HttpOnly refresh token cookie.

```mermaid
sequenceDiagram
    participant Frontend
    participant Backend
    participant Database

    Frontend->>Backend: API Request (GET /workspaces) + Access Token
    
    alt Token Expired
        Backend-->>Frontend: 401 Token Expired
        Frontend->>Backend: POST /auth/refresh (sends HttpOnly Cookie)
        
        alt Refresh Token Valid
            Backend->>Database: Verify Token against blacklists/user
            Database-->>Backend: Valid
            Backend->>Backend: Generate NEW Access Token
            Backend-->>Frontend: 200 OK + New Access Token
            Frontend->>Frontend: Update Token in Memory
            Frontend->>Backend: Retry Original Request (GET /workspaces)
            Backend-->>Frontend: 200 OK + Data
        else Refresh Token Invalid/Expired
            Backend-->>Frontend: 403 Forbidden
            Frontend->>Frontend: Clear State & Redirect to /login
        end
    else Token Valid
        Backend-->>Frontend: 200 OK + Data
    end
```

---

## 3. Workspace & Project Creation Flow

The core journey for a Team Lead setting up the environment.

```mermaid
flowchart TD
    A[User Dashboard] -->|Clicks 'New Workspace'| B(Create Workspace Modal)
    B --> C{Submit API Call}
    C -->|Success| D[Workspace View]
    C -->|Error| E[Show Toast Error]
    
    D --> F[Invite Members]
    D --> G[Create Project]
    
    F --> H(Enter Emails)
    H --> I[Send Invites via Email/Notification]
    
    G --> J(Set Name, Desc, Deadline)
    J --> K{Submit API Call}
    K -->|Success| L[Project Kanban Board]
    K -->|Error| M[Show Toast Error]
```

---

## 4. Task Lifecycle Flow

How a standard task moves through the system from creation to completion.

```mermaid
stateDiagram-v2
    [*] --> ToDo : Task Created by Member
    
    ToDo --> InProgress : Assignee starts working (Drag & Drop)
    InProgress --> ToDo : Blocked / Moved back
    
    InProgress --> InReview : Assignee finishes draft
    InReview --> InProgress : Revisions requested
    
    InReview --> Done : Approved by Creator/Admin
    Done --> [*]
    
    state "Task Attached Actions" as TAA {
        AddComment
        UploadFile
        UpdateSubtasks
        ChangePriority
    }
```

---

## 5. Screen Navigation Map

How the React frontend routes are connected.

```text
/ (Landing Page)
├── /login 
├── /register 
└── /dashboard (Protected)
    │
    ├── /profile                  (User settings & pwd change)
    │
    ├── /workspaces/:id           (Workspace Overview & Members)
    │   ├── /settings             (Admin only)
    │   └── /projects             (List of projects)
    │       └── /:projectId       (Kanban Board View)
    │           └── /tasks/:taskId (Task Modal/Detail Panel)
    │
    └── /analytics                (Platform-wide charts)
```

---

## 6. Real-time / Polling Strategy

Since WebSocket (Socket.io) is out of scope for this 15-day hackathon, we will simulate real-time collaboration using a strategic polling approach in specific views:

1. **Kanban Board (`/projects/:projectId`)**: Poll `GET /tasks` every 30 seconds to catch status changes made by teammates.
2. **Task Modal (`/tasks/:taskId`)**: Poll `GET /comments` every 15 seconds while the modal is open to simulate live chat.
3. **Dashboard**: Trigger fetch only on mount (no polling needed).
4. **Activity Feed**: Trigger fetch on mount, push local actions optimistically to the top of the list.
