# SmartClass — Smart Classroom Management System
## Implementation Plan (SIH1625)

**Tagline**: "From Classroom Management to Classroom Intelligence."

---

## Project Status

The workspace at `b:\sih` is **completely empty**. We are starting from scratch.

---

## Architecture Overview

```
b:\sih\
├── frontend/          ← React + Vite + Tailwind + shadcn/ui
└── backend/           ← Python + FastAPI + SQLAlchemy + PostgreSQL
```

### Frontend Stack
- React 18 + Vite
- Tailwind CSS v3
- shadcn/ui components
- React Router v6
- Recharts (data visualization)
- Framer Motion (animations)
- Lucide React (icons)
- React Query (server state)

### Backend Stack
- Python 3.11+
- FastAPI
- SQLAlchemy (ORM)
- PostgreSQL (primary database)
- Pydantic v2
- python-jose (JWT)
- passlib + bcrypt (password hashing)
- scikit-learn (ML predictions)
- Alembic (migrations)

---

## Open Questions

> [!IMPORTANT]
> **PostgreSQL Setup**: Does your machine have PostgreSQL installed? If not, we can use SQLite for the prototype (easier setup, same SQL logic) or Docker. Please confirm your preference.

> [!IMPORTANT]
> **Python Version**: Which Python version is available on your machine?

> [!NOTE]
> **Demo Mode**: For the hackathon prototype, the frontend will use realistic mock/seed data that is served from the backend. The intelligence features (classroom health, risk detection) will be calculated from this data — not randomly generated.

---

## Phase Plan

| Phase | What | Status |
|-------|------|--------|
| 1 | Project scaffolding (frontend + backend structure) | 🔲 |
| 2 | Authentication system (JWT + roles) | 🔲 |
| 3 | Database models + seed data | 🔲 |
| 4 | Core dashboards (Admin, Teacher, Student) | 🔲 |
| 5 | Smart Attendance + QR concept | 🔲 |
| 6 | Assignment Intelligence | 🔲 |
| 7 | Performance Analytics | 🔲 |
| 8 | Timetable + Room Management | 🔲 |
| 9 | Classroom Health Score engine | 🔲 |
| 10 | Early Warning System | 🔲 |
| 11 | AI Classroom Assistant (rule-based) | 🔲 |
| 12 | Notifications | 🔲 |
| 13 | UI Polish + responsive design | 🔲 |

---

## Phase 1 — Project Scaffolding

### Frontend

#### [NEW] frontend/ (Vite React app)
- Initialize with `npx create-vite@latest` using React + JavaScript template
- Install all required dependencies in one step
- Configure Tailwind CSS v3
- Initialize shadcn/ui
- Set up folder structure: `src/components`, `src/layouts`, `src/pages`, `src/services`, `src/hooks`, `src/utils`, `src/data`, `src/types`
- Set up React Router
- Create base layout with sidebar navigation
- Create placeholder pages for all routes

#### [NEW] frontend/src/layouts/AppLayout.jsx
- Sidebar (desktop) + mobile hamburger menu
- Role-aware navigation links
- User profile in sidebar footer

#### [NEW] frontend/src/layouts/AuthLayout.jsx
- Centered card layout for login/register

#### [NEW] frontend/.env.example
```
VITE_API_BASE_URL=http://localhost:8000
```

### Backend

#### [NEW] backend/ (FastAPI app)
- Create project with proper folder structure
- Set up `requirements.txt`
- Create `main.py` with CORS configured
- Set up environment variables with `python-dotenv`

#### [NEW] backend/app/main.py
- FastAPI app instance
- CORS middleware
- Router includes (auth, students, teachers, classes, etc.)
- Health check endpoint

#### [NEW] backend/.env.example
```
DATABASE_URL=postgresql://user:pass@localhost/smartclass
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## Proposed File Structure (Full)

### Frontend
```
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── ui/           ← shadcn components
    │   ├── common/       ← shared components (StatCard, Badge, etc.)
    │   ├── charts/       ← Recharts wrappers
    │   ├── attendance/
    │   ├── assignments/
    │   ├── timetable/
    │   └── rooms/
    ├── layouts/
    │   ├── AppLayout.jsx
    │   └── AuthLayout.jsx
    ├── pages/
    │   ├── auth/
    │   │   └── LoginPage.jsx
    │   ├── admin/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── ClassManagement.jsx
    │   │   ├── RoomManagement.jsx
    │   │   ├── TimetableManagement.jsx
    │   │   └── UserManagement.jsx
    │   ├── teacher/
    │   │   ├── TeacherDashboard.jsx
    │   │   ├── AttendancePage.jsx
    │   │   ├── AssignmentsPage.jsx
    │   │   └── StudentRiskPage.jsx
    │   └── student/
    │       ├── StudentDashboard.jsx
    │       ├── MyAttendance.jsx
    │       ├── MyAssignments.jsx
    │       └── MyPerformance.jsx
    ├── services/
    │   ├── api.js          ← axios instance + interceptors
    │   ├── authService.js
    │   ├── analyticsService.js
    │   └── aiAssistant.js
    ├── hooks/
    │   ├── useAuth.js
    │   └── useToast.js
    ├── utils/
    │   ├── healthScore.js  ← classroom health algorithm
    │   ├── riskScore.js    ← student risk algorithm
    │   └── formatters.js
    ├── data/
    │   └── mockData.js     ← seed data (used in demo mode)
    ├── types/
    │   └── index.js
    └── assets/
```

### Backend
```
backend/
├── requirements.txt
├── .env.example
├── alembic.ini
└── app/
    ├── main.py
    ├── core/
    │   ├── config.py
    │   └── security.py
    ├── database/
    │   ├── connection.py
    │   └── base.py
    ├── models/
    │   ├── user.py
    │   ├── student.py
    │   ├── teacher.py
    │   ├── classroom.py
    │   ├── subject.py
    │   ├── attendance.py
    │   ├── assignment.py
    │   ├── room.py
    │   ├── timetable.py
    │   ├── analytics.py
    │   └── notification.py
    ├── schemas/
    │   ├── auth.py
    │   ├── student.py
    │   ├── attendance.py
    │   └── analytics.py
    ├── api/
    │   ├── deps.py         ← auth dependencies
    │   └── routes/
    │       ├── auth.py
    │       ├── students.py
    │       ├── teachers.py
    │       ├── classes.py
    │       ├── attendance.py
    │       ├── assignments.py
    │       ├── timetable.py
    │       ├── rooms.py
    │       ├── analytics.py
    │       ├── ai_assistant.py
    │       └── notifications.py
    ├── services/
    │   ├── auth_service.py
    │   ├── attendance_service.py
    │   ├── analytics_service.py
    │   ├── health_score_service.py
    │   ├── risk_service.py
    │   └── ai_service.py
    ├── repositories/
    │   ├── user_repo.py
    │   ├── attendance_repo.py
    │   └── analytics_repo.py
    ├── ml/
    │   ├── predictor.py
    │   └── fallback.py
    └── utils/
        ├── seed_data.py
        └── helpers.py
```

---

## Verification Plan

### Phase 1 Verification
- `npm run dev` in `frontend/` starts without errors
- `uvicorn app.main:app --reload` in `backend/` starts without errors
- Health check endpoint responds: `GET /health → { status: "ok" }`
- Frontend renders login page with correct styling
- No console errors

### Manual Verification
- Login page visually matches SaaS quality standards
- Sidebar navigation renders correctly
- Mobile menu works on smaller viewports
