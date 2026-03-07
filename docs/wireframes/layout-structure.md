# 🏗️ Layout Structure & Wireframes (Day 4)

> **CourseMea Hackathon 2026**  
> Focus: Defining the grid structures, navigation hierarchy, and page compositions.

---

## 1. Global Application Layout (Authenticated Shell)

Once logged in, the user sees the **App Shell**. This layout wraps everything except auth pages.

### Structure: Sidebar + Main Content Area

```text
+-----------------------------------------------------------+
|  [Logo] Collaboration Platform        [Search] [Bell] [A] |  <-- Top Navbar (Fixed, h-16)
|-----------------------------------------------------------|
|          |                                                |
| Workspace|   [Breadcrumbs: Workspace Name / Dashboard]    |
| Switcher |                                                |
|          |   +----------------------------------------+   |
|   ---    |   |                                        |   |
| MENU     |   |                                        |   |
| Dashboard|   |                                        |   |
| Projects |   |         MAIN CONTENT AREA              |   |
| Members  |   |         (Scrollable, bg-surface-50)    |   |
| Settings |   |                                        |   |
|          |   |                                        |   |
|   ---    |   +----------------------------------------+   |
| [Logout] |                                                |
+-----------------------------------------------------------+
  ^ Sidebar (Fixed width: w-64, hidden on mobile)
```

**Responsive Behavior:**
- **Mobile (< 768px):** Sidebar is hidden. A hamburger menu appears in the Top Navbar to slide out the sidebar.
- **Desktop (>= 768px):** Sidebar is permanently pinned to the left.

---

## 2. Page Compositions

### 2.1 Kanban Board View (`/workspaces/:wId/projects/:pId`)

The core productivity view. Scrolls horizontally if there are many columns (though we have fixed 4).

```text
[ Project Title ]  [+ New Task Btn]  [Filter Dropdown]  [Avatar Stack]

+-------------+  +-------------+  +-------------+  +-------------+
| TO DO  (3)  |  | IN PROGRESS |  | IN REVIEW   |  | DONE        |
+-------------+  +-------------+  +-------------+  +-------------+
| Task Card   |  | Task Card   |  | Task Card   |  | Task Card   |
| - Priority  |  | - Priority  |  | - Priority  |  | - Due Date  |
| - Due Date  |  | - Due Date  |  | - Comments  |  |             |
| - Assignee  |  | - Avatar    |  |             |  |             |
+-------------+  +-------------+  +-------------+  +-------------+
| Task Card   |  | Task Card   |
+-------------+  +-------------+
| + Add Task  |  | + Add Task  |
+-------------+  +-------------+
```

---

### 2.2 Task Detail Modal (Slide-over or Centered Modal)

When a task card is clicked, it opens without leaving the board context.

```text
+-----------------------------------------------------------+
| [ ] Mark Complete                             [X] Close   |
|-----------------------------------------------------------|
| Title: [ Editable Title Input ]                | Details  |
|                                                | -------- |
| Description:                                   | Status:  |
| [ Rich text or textarea for description... ]   | [To Do]  |
|                                                |          |
| Sub-tasks (2/3):                               | Priority:|
| [x] Write tests                                | [High]   |
| [x] Setup DB                                   |          |
| [ ] Add indexing                               | Assignee:|
| + Add sub-task                                 | [Avatar] |
|                                                |          |
| Attachments:                                   | Due Date:|
| [schema.pdf] [UI_mockup.png] [+ Upload]        | [Oct 12] |
|                                                |          |
| Activity & Comments:                           |          |
| [Avatar] Ateeb: "I'll take this one."          |          |
|          Oct 10 at 2:00 PM                     |          |
|                                                |          |
| [ Text input: Write a comment... ]  [Post]     |          |
+-----------------------------------------------------------+
```

---

### 2.3 Dashboard View (`/dashboard`)

The default view after login. A grid of widgets.

```text
[ Welcome Back, Ateeb 👋 ]                           [Today's Date]

+---------------------------------------------------------------+
|                      QUICK STATS ROW                          |
|  [ Total Tasks: 42 ]  [ Completed: 12 ]  [ Overdue: 3 🔴 ]    |
+---------------------------------------------------------------+

+-----------------------------------+---------------------------+
|  MY UPCOMING TASKS                |  TEAM PROGRESS (CHART)    |
|                                   |                           |
|  [ ] Fix login bug (Tomorrow)     |      ___                  |
|  [ ] Write docs    (In 2 days)    |     /   \   [ Pie Chart ] |
|  [ ] Deploy DB     (In 3 days)    |    |     |                |
|                                   |     \___/                 |
+-----------------------------------+---------------------------+

+---------------------------------------------------------------+
|  RECENT ACTIVITY FEED                                         |
|  - Sarah completed "Setup React Router" (10 mins ago)         |
|  - John uploaded "logo.png" to Project Beta (1 hr ago)        |
+---------------------------------------------------------------+
```

---

## 3. Modals & Side Panels

To avoid navigating away from context, we will use Modals (Dialogs) for forms:
1. **Create Workspace Modal:** Simple input for Name + optional description.
2. **Invite Members Modal:** Text area for comma-separated emails + Dropdown for role selection.
3. **Create Project Modal:** Native date picker for deadline.
4. **Delete Confirmation** `Are you sure? This action cannot be undone. [Cancel] [Delete]`

---

## 4. UI/UX "Tricks" to Look Professional

- **Glassmorphism:** Slight semi-transparent blurs on sticky navbars (`bg-white/80 backdrop-blur-md`).
- **Focus States:** Every input will have a clear, branded focus ring so keyboard navigation is obvious.
- **Tooltips:** Hovering over avatars or icon-only buttons will show a small tooltip.
- **Transitions:** `transition-all duration-200` on buttons and cards so hover effects feel smooth, not jarring.
