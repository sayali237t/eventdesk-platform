# EventDesk — Event Requirement Submission Platform (V1.0)

A full-stack event requirement submission platform. The application guides event organizers through a four-step workflow to submit service requirements for **Event Planners**, **Performers**, or **Technical Crew**, validates all inputs on both the client and backend, strictly categorises records by service type, and persists documents to MongoDB.

---

## 1. Project Overview

Organizers need a clear, structured way to post event service requirements without friction:
- **Step 1 — Event Basics**: Captures event name, event type (with custom `"Other"` specification), start/end dates (with past-date prevention and automatic date-range validation), location, optional venue, and service category selection (**Planner**, **Performer**, or **Crew**).
- **Step 2 — Category Requirements**: Dynamically adapts fields to match the chosen category (`planner`, `performer`, or `crew`).
- **Step 3 — Additional Requirements**: Optional category-specific preferences, technical riders, equipment needs, and notes.
- **Step 4 — Review & Submission**: Structured summary with direct **Edit** buttons (with one-click *"Save & Return to Review"*), human-readable dates, loading states, and MongoDB reference ID confirmation.

---

## 2. Repository Structure (`frontend/` + `backend/`)

The project is cleanly divided into `frontend/` and `backend/` directories so each tier can be inspected, run, or deployed independently (e.g., Vercel for Frontend + Render/Railway for Backend) or run together from the root:

```text
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env.example
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── index.css
│       ├── types.ts
│       ├── lib/
│       │   └── api.ts
│       ├── utils/
│       │   └── formatters.ts
│       └── components/
│           ├── Header.tsx
│           ├── StepIndicator.tsx
│           ├── EventBasics.tsx
│           ├── CategoryRequirements.tsx
│           ├── AdditionalRequirements.tsx
│           ├── ReviewSubmission.tsx
│           ├── SuccessView.tsx
│           └── SubmissionsDrawer.tsx
│
├── backend/
│   ├── server.ts
│   ├── app.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── config/
│   │   └── database.ts
│   ├── models/
│   │   └── Requirement.ts
│   ├── controllers/
│   │   └── requirementController.ts
│   ├── routes/
│   │   └── requirements.ts
│   └── middleware/
│       └── errorHandler.ts
│
├── server.ts          # Unified dev/prod runner mounting backend API + frontend SPA
└── package.json       # Root convenience scripts
```

---

## 3. Key Features & Edge Cases Handled

1. **Strict Category Separation & Filtering**:
   - Backend [`sanitizeCategoryRequirements`](./backend/controllers/requirementController.ts) strictly whitelists only the fields belonging to the selected `category` (`planner`, `performer`, or `crew`) so stale fields from a previously clicked category can never pollute the database document.
   - `GET /api/requirements?category=planner|performer|crew` filters saved requirements by category.
   - The built-in **Database Records Drawer** features interactive category filter tabs (`All`, `Planner`, `Performer`, `Crew`) with live counts.
2. **Date Validation & Auto-Adjustment**:
   - Event start date (`eventDate`) blocks past dates both in the HTML date picker (`min={today}`) and in client/server validation.
   - Moving `eventDate` forward past an already-selected `endDate` automatically resets `endDate` to prevent invalid ranges.
3. **Conditional `"Other"` Specifications**:
   - Selecting `"Other"` for Event Type (Step 1), Performance Type (Step 2), Crew Type (Step 2), or Services Required (Step 3) reveals a dedicated specification input.
4. **Category Switch Protection**:
   - Switching categories in Step 1 after filling Step 2/3 fields resets stale category-specific fields, resets step progression back to Step 1, and displays a clear notice to the user.
5. **Direct "Save & Return to Review" Flow**:
   - Clicking **Edit** on any section in Step 4 allows the user to modify that step and jump directly back to Step 4 Review via **"Save & Return to Review"**.
6. **`localStorage` Draft Persistence & Demo Autofill**:
   - Form progress auto-saves to `localStorage` so page refreshes do not lose entered data, paired with a **Reset Form** button.
   - Includes a one-click **Autofill Sample** bar (`Planner` | `Performer` | `Crew`) for fast testing and video demonstrations.

---

## 4. Local Setup Instructions

### Option A: Run Unified Full-Stack Server from Root
```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Start full-stack server on http://localhost:3000
npm run dev
```

### Option B: Run Frontend and Backend Separately
```bash
# Terminal 1 — Start Express Backend (http://localhost:5000)
cd backend
npm install
npm run dev

# Terminal 2 — Start Frontend Dev Server (http://localhost:3000)
cd frontend
npm install
npm run dev
```

---

## 5. Required Environment Variables

### Backend (`backend/.env` or root `.env`)
```env
PORT=5000
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/eventdesk?retryWrites=true&w=majority"
FRONTEND_URL="http://localhost:3000"
```
*(Note: If `MONGODB_URI` is omitted, the backend automatically uses a pre-seeded in-memory store with sample Planner, Performer, and Crew records so the app can be evaluated immediately.)*

### Frontend (`frontend/.env`)
```env
# Optional: URL of the deployed backend API (for Vercel deployment)
VITE_API_URL="http://localhost:5000"
```

---

## 6. REST API Endpoints

### `POST /api/requirements`
Validates, sanitizes category-specific fields, and saves a requirement submission.

**Example Request:**
```json
{
  "eventName": "Horizon Tech & Music Festival 2027",
  "eventType": "Concert / Festival",
  "eventDate": "2027-02-15",
  "endDate": "2027-02-16",
  "location": "Mumbai",
  "venue": "Jio World Garden Arena",
  "category": "performer",
  "requirements": {
    "performanceType": "Band / Musician",
    "performanceDuration": "1–2 hours",
    "numberOfPerformers": 5,
    "soundSystemRequired": true,
    "equipmentRequirements": "4 wireless vocal mics, 6 in-ear monitors, 2 DI boxes",
    "additionalNotes": "90-minute headliner set at 8:00 PM"
  }
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Requirement submitted successfully",
  "data": {
    "id": "67bcb01a8e23f1001a4e9812",
    "requirement": { ... }
  }
}
```

### `GET /api/requirements?category=planner|performer|crew`
Returns all submitted requirements (or filtered by category), sorted newest first.

### `GET /api/requirements/:id`
Retrieves a single requirement document by its MongoDB `_id`.

### `GET /api/health`
Returns server health and active storage engine status (`mongodb` vs `in-memory-fallback`).
