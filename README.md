# EventDesk — Event Requirement Submission Platform

A full-stack event requirement submission platform that guides event organizers through a structured four-step workflow to post service requirements for **Event Planners**, **Performers**, or **Technical Crew**. The application adapts form fields dynamically by category, validates inputs on both client and server, strictly categorises documents by service type, and persists records to MongoDB Atlas.

---

## Live Links

- **Live Frontend Application (Vercel):** [https://eventdesk-platform.vercel.app/](https://eventdesk-platform.vercel.app/)
- **Live Backend API (Render):** [https://eventdesk-platform.onrender.com](https://eventdesk-platform.onrender.com)
- **API Health & Storage Check:** [https://eventdesk-platform.onrender.com/api/health](https://eventdesk-platform.onrender.com/api/health)
- **GitHub Repository:** [https://github.com/sayali237t/eventdesk-platform](https://github.com/sayali237t/eventdesk-platform)

---

## 1. Project Overview

Organizers planning an event often need to submit structured service requirements across different disciplines without creating an account or navigating complex dashboards. **EventDesk** provides a linear, four-step requirement posting workflow:

1. **Step 1 — Event Basics:** Captures common event metadata—Event Name, Event Type (with custom `"Other"` specification), Start Date, optional End Date, Location/City, optional Venue, and the primary Requirement Category (**Planner**, **Performer**, or **Crew**).
2. **Step 2 — Category Requirements:** Dynamically surfaces essential questions tailored to the selected category:
   - **Planner:** Expected Attendees & Estimated Budget Range (plus optional Event Duration).
   - **Performer:** Performance Type (with custom `"Other"` specification), Performance Duration, and optional Number of Performers.
   - **Crew:** Crew Discipline (with custom `"Other"` specification), optional Number of People Required, and Working Shift Duration.
3. **Step 3 — Additional Requirements:** Collects optional supplementary details relevant to the chosen category (multi-select coordination services, event theme, venue sound system toggle, equipment riders, specific technical skills, and notes).
4. **Step 4 — Review & Submit:** Displays a structured summary organized into three cards (**Event Basics**, **Category Requirements**, and **Additional Requirements**), each with a direct **Edit** button, before submitting to the Express + MongoDB backend and returning a confirmation screen with a unique Reference ID.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite |
| **Backend** | Node.js, Express.js, TypeScript (`tsx`) |
| **Database** | MongoDB Atlas with Mongoose ODM (plus automatic in-memory fallback for zero-config local evaluation) |
| **Deployment** | Vercel (Frontend) + Render (Backend Web Service) + MongoDB Atlas (Cloud Database) |

---

## 3. Application Architecture & Repository Structure

The repository is cleanly divided into standalone [`frontend/`](./frontend) and [`backend/`](./backend) directories so each tier can be developed, tested, and deployed independently (or run together via the root convenience server):

```text
eventdesk-platform/
├── frontend/                        # Standalone React + Vite Frontend (Deployed on Vercel)
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env.example
│   └── src/
│       ├── App.tsx                  # Multi-step state orchestration, validation & draft persistence
│       ├── main.tsx
│       ├── index.css
│       ├── types.ts                 # Shared TypeScript interfaces
│       ├── lib/
│       │   └── api.ts               # REST API client (POST & GET /api/requirements, /api/health)
│       ├── utils/
│       │   └── formatters.ts        # Date range formatting, past-date helpers & sample presets
│       └── components/
│           ├── Header.tsx           # Brand header, live DB status badge & records drawer trigger
│           ├── StepIndicator.tsx    # 4-step animated progress bar
│           ├── EventBasics.tsx      # Step 1: Common event details & category cards
│           ├── CategoryRequirements.tsx   # Step 2: Category-specific required fields
│           ├── AdditionalRequirements.tsx # Step 3: Optional category preferences & riders
│           ├── ReviewSubmission.tsx # Step 4: Categorised summary with section Edit buttons
│           ├── SuccessView.tsx      # Confirmation screen with Reference ID copy
│           └── SubmissionsDrawer.tsx      # Live MongoDB record inspector with category filter tabs
│
├── backend/                         # Standalone Express + Mongoose API (Deployed on Render)
│   ├── server.ts                    # Backend entry point
│   ├── app.ts                       # Express app configuration & route mounting
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── config/
│   │   └── database.ts              # MongoDB Atlas connection & initial sample upsert
│   ├── models/
│   │   └── Requirement.ts           # Mongoose schema for the `requirements` collection
│   ├── controllers/
│   │   └── requirementController.ts # Payload validation, category field whitelisting & handlers
│   ├── routes/
│   │   └── requirements.ts          # REST routes (/api/requirements)
│   └── middleware/
│       └── errorHandler.ts          # CORS & global error handling middleware
│
├── server.ts                        # Unified local runner mounting both backend & frontend
└── package.json                     # Root convenience scripts
```

---

## 4. Key Engineering Decisions, Edge Cases & Validation

| Scenario / Edge Case | How It Is Handled |
|---|---|
| **Strict Category Data Isolation** | Both the frontend API client (`submitRequirement`) and backend controller (`sanitizeCategoryRequirements`) strictly whitelist only the fields belonging to the selected `category` (`planner`, `performer`, or `crew`). Stale fields from a previously selected category can never pollute the saved MongoDB document. |
| **Category Switching Mid-Form** | If a user fills out Step 2/3 fields and then returns to Step 1 and changes the category, category-specific fields are reset, `maxAccessibleStep` resets to Step 1, and a subtle notice informs the user. Shared Step 1 event details remain intact. |
| **Past Date Prevention & Date Range Integrity** | `eventDate` blocks past dates via `min={today}` in the date picker and server-side validation. If a user moves `eventDate` forward past an already-selected `endDate`, `endDate` is automatically cleared. |
| **Conditional `"Other"` Specifications** | Selecting `"Other"` in Event Type (Step 1), Performance Type (Step 2), Crew Discipline (Step 2), or Services Required (Step 3) dynamically reveals a dedicated specification input that is validated and persisted. |
| **Direct *"Save & Return to Review"* Navigation** | Clicking **Edit** on any card in Step 4 (Review) lets the user modify that section and click **"Save & Return to Review"** to jump straight back to Step 4 without having to click through intermediate steps again. |
| **Accidental Page Refresh** | Form progress and active step are automatically saved to `localStorage` (`eventdesk_requirement_draft_v1`) and cleared upon successful submission or when clicking **Reset Form**. |
| **Duplicate Submissions** | The **Submit Requirement** button enters a disabled loading state (`Saving Requirement...`) while the network request is in flight. |
| **Categorised Database Inspection** | The slide-over **Database Records** drawer queries `GET /api/requirements` and provides interactive filter tabs (`All`, `Planner`, `Performer`, `Crew`) with live counts and raw MongoDB JSON inspection. |

---

## 5. Database Structure (MongoDB Schema)

All submissions are stored in a single `requirements` collection in MongoDB, indexed by `category` (`planner`, `performer`, or `crew`), with common event metadata at the top level and category-specific fields nested inside `requirements`:

```json
{
  "_id": "67bcb01a8e23f1001a4e9812",
  "eventName": "Nexus Annual Tech & Cultural Fest",
  "eventType": "College Event",
  "customEventType": "",
  "eventDate": "2027-02-15",
  "endDate": "2027-02-16",
  "location": "Pune",
  "venue": "Main Open Air Amphitheatre",
  "category": "performer",
  "requirements": {
    "performanceType": "Band / Musician",
    "performanceDuration": "1–2 hours",
    "numberOfPerformers": 5,
    "soundSystemRequired": true,
    "equipmentRequirements": "4 wireless microphones, stage monitors, 2 DI boxes, and drum riser",
    "additionalNotes": "Sound check scheduled 2 hours before the headliner slot."
  },
  "createdAt": "2026-10-25T12:00:00.000Z"
}
```

---

## 6. REST API Endpoints

### 1. `POST /api/requirements`
Validates common and category-specific fields, strips any unrelated category keys, and saves the requirement to MongoDB.

- **Success Response (`201 Created`):**
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
- **Validation Error (`400 Bad Request`):**
  ```json
  {
    "success": false,
    "message": "Expected attendees must be a positive number."
  }
  ```

### 2. `GET /api/requirements`
Returns submitted requirements sorted by `createdAt` descending. Supports optional category filtering:
- `GET /api/requirements` — All requirements
- `GET /api/requirements?category=planner` — Only Planner requirements
- `GET /api/requirements?category=performer` — Only Performer requirements
- `GET /api/requirements?category=crew` — Only Crew requirements

### 3. `GET /api/requirements/:id`
Retrieves a single requirement document by its MongoDB `_id`.

### 4. `GET /api/health`
Returns server health, active storage mode (`mongodb` vs `in-memory-fallback`), and total document count.

---

## 7. Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### Option A: Run Unified Full-Stack Server from Root
```bash
# 1. Clone the repository and install dependencies
git clone https://github.com/sayali237t/eventdesk-platform.git
cd eventdesk-platform
npm install

# 2. Configure environment variables
cp .env.example .env

# 3. Start the full-stack server on http://localhost:3000
npm run dev
```

### Option B: Run Frontend and Backend Separately
```bash
# Terminal 1 — Start Express Backend (http://localhost:5000)
cd backend
npm install
cp .env.example .env
npm run dev

# Terminal 2 — Start React Frontend (http://localhost:3000)
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## 8. Environment Variables

### Backend (`backend/.env` or root `.env`)
```env
PORT=5000
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/eventdesk?retryWrites=true&w=majority"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL="http://localhost:5000"
```

---

## 9. Known Limitations & Future Improvements

- **Current V1 Scope:** Intentionally excludes user authentication, file uploads, payment processing, and vendor matching dashboards to keep the requirement submission flow fast and frictionless.
- **Future Improvements:**
  - Magic-link email confirmation allowing organizers to edit or track their submitted requirement status.
  - PDF export of the submitted event requirement brief and technical rider.
  - Rate limiting and CAPTCHA protection on `POST /api/requirements` for public production traffic.
  - Pagination and search filters on `GET /api/requirements`.

---

## 10. AI Assistance Disclosure

AI developer tools were used during development to assist with TypeScript interface scaffolding, UI component styling refinement, and documentation formatting. All form state transitions, two-tier validation rules, category sanitization logic, and MongoDB integration were reviewed and verified end-to-end.
