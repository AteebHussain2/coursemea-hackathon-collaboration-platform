# 🎨 UI/UX Design System (Day 4)

> **CourseMea Hackathon 2026**
> Styling: **Tailwind CSS v3**
> Aesthetic: **Clean, Modern SaaS (similar to Linear or Notion)**

---

## 1. Color Palette

Our application will use a clean, neutral base with a vibrant primary color to focus user attention on interactive elements.

```js
// tailwind.config.js (Planned Extension)
theme: {
  extend: {
    colors: {
      brand: {
        50: '#f0fdf4',
        100: '#dcfce7',
        500: '#22c55e', // Primary Green (Buttons, Links)
        600: '#16a34a', // Hover state
        900: '#14532d',
      },
      surface: {
        50: '#f8fafc',  // Main background
        100: '#f1f5f9', // Sidebar background
        white: '#ffffff',// Card background
      },
      content: {
        primary: '#0f172a',   // Main text
        secondary: '#64748b', // Subtitles, timestamps
        muted: '#cbd5e1',     // Disabled text, borders
      },
      status: {
        info: '#3b82f6',      // Blue (In Progress)
        success: '#22c55e',   // Green (Done)
        warning: '#f59e0b',   // Yellow/Orange (In Review)
        danger: '#ef4444',    // Red (Overdue, Delete)
      }
    }
  }
}
```

---

## 2. Typography

We will use a clean sans-serif font standard in modern web applications.
- **Primary Font:** Inter (via Google Fonts)
- **Headings:** Bold, tight tracking
- **Body:** Regular weight, readable line height

```js
// tailwind.config.js
fontFamily: {
  sans: ['Inter', 'sans-serif'],
}
```

### Type Scale Hierarchy
- `text-3xl font-bold`: Main Page Titles (e.g., "Dashboard")
- `text-xl font-semibold`: Section Headers / Modal Titles
- `text-base font-medium`: Form Labels, Buttons, Navigation Links
- `text-sm text-content-secondary`: Timestamps, helper text, card subtitles

---

## 3. Component Specifications

### 3.1 Buttons
All buttons will have slight rounding (`rounded-md`) and smooth transitions.
- **Primary:** `bg-brand-500 text-white hover:bg-brand-600 transition-colors`
- **Secondary:** `bg-white border border-content-muted text-content-primary hover:bg-surface-50`
- **Danger:** `bg-red-50 text-status-danger hover:bg-red-100` (Used for deletes)

### 3.2 Cards & Containers
Used for Projects, Tasks, and Dashboard widgets.
- **Style:** `bg-white rounded-lg border border-content-muted shadow-sm`
- **Hover state (if clickable):** `hover:shadow-md hover:border-brand-500 transition-all`

### 3.3 Inputs & Forms
- **Input Field:** `block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm`
- **Error State:** `border-status-danger focus:border-status-danger focus:ring-status-danger`
- **Validation Message:** `text-sm text-status-danger mt-1`

### 3.4 Badges (Priority & Status)
- **Priority Critical:** `bg-red-100 text-red-800 rounded-full px-2.5 py-0.5 text-xs font-medium`
- **Priority High:** `bg-orange-100 text-orange-800 ...`
- **Priority Medium:** `bg-blue-100 text-blue-800 ...`
- **Priority Low:** `bg-gray-100 text-gray-800 ...`

---

## 4. Spacing & Layout Tokens

We stick strictly to Tailwind's default spacing scale (4 point system).
- **Page Paddings:** `px-4 sm:px-6 lg:px-8` (Responsive)
- **Section Gaps:** `gap-6` or `gap-8` (Grid layouts)
- **Card Padding:** `p-4` or `p-6` depending on card density

---

## 5. UI/UX Principles for Development

1. **Empty States:** Every list (projects, tasks, workspaces) must have a stylized empty state with a call-to-action button (e.g., "No projects yet. + Create your first project").
2. **Loading States:** Use skeleton loaders instead of full-screen spinners to make the app feel faster.
3. **Feedback:** Every mutation (create, update, delete) must return visual feedback (a Toast notification via `react-hot-toast`).
4. **Destructive Actions:** Any deletion must have a confirmation modal. "Are you sure you want to delete this project?"
