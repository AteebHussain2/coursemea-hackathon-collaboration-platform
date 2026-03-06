# ❓ Day 1 – Questions & Clarifications

> **Hackathon Day 1** | CourseMea 2026  
> Focus: Capturing all open questions from the Day 1 mentoring session and proposing answers.

---

## 📋 How to Use This Document

- **Open questions** (❓) — Raised during Day 1, need mentor/team answer before we proceed
- **Resolved questions** (✅) — Already answered; documented for team reference
- **Assumptions made** (⚠️) — We proceeded with a best-guess assumption

---

## ✅ Resolved Questions

### Q1: What is the primary focus of this hackathon — features or code quality?
> **Answer:** Both, but **working features take priority**. The Day 15 presentation requires a live demo of all 7 core modules. Code quality is evaluated but a clean working app matters more than perfect architecture.

---

### Q2: Are we building a real-time app or request-response?
> **Answer:** Request-response (REST API). Real-time WebSocket/Socket.io is **out of scope**. The activity feed and notifications will use polling or be triggered server-side via scheduled jobs.

---

### Q3: Which database — SQL or NoSQL?
> **Answer:** **MongoDB** as stated in the requirement. Mongoose ODM will be used for schema definition and validation.

---

### Q4: Is deployment required on Day 15?
> **Answer:** Yes, the app must be **live and accessible** via a URL for the Day 15 demo. We'll use MongoDB Atlas + Render (backend) + Vercel (frontend) for free-tier hosting.

---

### Q5: Do we need unit tests?
> **Answer:** Yes, **basic functional and security testing** is required on Day 14. We'll test critical API endpoints using Postman and write at least a few Jest unit tests for the backend.

---

### Q6: Can we use third-party UI component libraries?
> **Answer (Assumption ⚠️):** We'll primarily use **Tailwind CSS** as specified. We may use headless component libraries (e.g., Headless UI, Radix UI) but will avoid heavy UI kits (MUI, Ant Design) to keep control of the design system.

---

## ❓ Open Questions (To Be Resolved)

### Q7: File storage — local vs cloud?
> **Question:** Should uploaded files be stored locally (Multer disk storage) or in a cloud service (Cloudinary, AWS S3)?  
> **Proposed Answer:** Start with **local Multer storage** during development. Migrate to **Cloudinary** (free tier) before Day 15 deployment.  
> **Status:** ⚠️ Assumption made — to be confirmed with mentor

---

### Q8: Email notifications — are they required for the demo?
> **Question:** Do deadline reminders and invite emails need to actually send, or is the UI notification enough?  
> **Proposed Answer:** In-app notifications are sufficient for 14 days. We'll integrate **Nodemailer with Gmail SMTP** on Day 12 if time allows.  
> **Status:** ❓ Confirm with mentor

---

### Q9: What does "role management" mean in Workspace Management?
> **Question:** Are roles (Admin, Member, Guest) fixed per workspace, or can roles be customized?  
> **Proposed Answer:** Fixed set of 3 roles per the hackathon description. No custom role creation needed.  
> **Status:** ✅ Resolved — confirmed fixed roles

---

### Q10: Is Redux mandatory or optional?
> **Question:** The hackathon brief says "Redux (optional)" — should we include it?  
> **Proposed Answer:** We will use **React Context API** throughout. If state complexity grows (e.g., workspace switching), we'll add Redux Toolkit in Day 13.  
> **Status:** ⚠️ Assumption made — team decision

---

### Q11: What is the evaluation criteria for Day 15?
> **Question:** How is the final project scored? Is there a rubric?  
> **Proposed Answer:** Based on the PDF: functionality, UI quality, code structure, and presentation quality.  
> **Status:** ❓ Ask mentor for official scoring rubric

---

### Q12: Can we use AI tools (GitHub Copilot, ChatGPT) during development?
> **Question:** Is AI-assisted coding allowed in the hackathon?  
> **Status:** ❓ Confirm with CourseMea mentor

---

## ⚠️ Key Assumptions Summary

| # | Assumption | Impact if Wrong |
|---|---|---|
| 1 | Context API is sufficient (no Redux required) | Refactor state management — moderate effort |
| 2 | Local file storage first, Cloudinary on Day 12 | May need to set up Cloudinary earlier |
| 3 | No real-time features needed (polling is fine) | Would need Socket.io setup — high effort |
| 4 | Free-tier deployment is acceptable for demo | May need paid tier if limits hit |
| 5 | Nodemailer + Gmail SMTP for emails | May need SendGrid/Mailgun for reliability |

---

## 📝 Day 1 Action Items

| Action | Owner | Due |
|---|---|---|
| Get official Day 15 evaluation rubric from mentor | Team Lead | End of Day 1 |
| Confirm email notification requirements | Backend Dev | End of Day 1 |
| Confirm AI tool usage policy | Team Lead | End of Day 1 |
| Set up GitHub repository (will be done Day 5) | Team Lead | Day 5 |
| Prepare reference platforms to study (Day 2 task) | All members | Day 2 |
