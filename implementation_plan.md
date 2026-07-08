# Manpower Recruitment & CRM Management System — Implementation Plan

## Background

Build a full-stack **Manpower Recruitment and CRM Management System** on the existing Next.js 16 + Tailwind CSS v4 + TypeScript workspace at `d:\crm`. The system manages the complete recruitment lifecycle — from receiving client requirements to candidate placement — across 10 user roles.

The existing workspace is a freshly scaffolded Next.js 16 app (App Router, React 19, Tailwind v4, TypeScript). We will build everything incrementally within this codebase.

---

## User Review Required

> [!IMPORTANT]
> **Database choice**: The plan uses an **in-memory JSON-file data store** for Phase 1-3 (rapid prototyping) and introduces a real database (MySQL or PostgreSQL via Prisma ORM) in Phase 4. This lets us ship a working UI quickly. Do you want us to start with a real database from Phase 1 instead?

> [!IMPORTANT]
> **Authentication**: Phase 1 uses a simple JWT cookie-based auth with `jose` (no external auth provider). Phase 4 can upgrade to NextAuth.js / Auth.js. Is this acceptable?

> [!WARNING]
> **Scope**: This is a very large system (7 functional modules, 10 role-specific dashboards, 13+ database tables). The plan is split into **6 phases**. Each phase delivers a shippable, testable increment. We will build Phase 1 first, verify it, and proceed to the next phase after your approval.

---

## Open Questions

> [!IMPORTANT]
> 1. **Tailwind CSS version**: The project already has Tailwind CSS v4 installed. Should we continue with Tailwind v4 (as installed), or switch to vanilla CSS?
> 2. **Email notifications**: Should we implement actual email sending (via Nodemailer/Resend) or mock notifications in the UI for now?
> 3. **File uploads**: Should resume uploads go to local disk storage or a cloud service (S3/Cloudinary)?
> 4. **Deployment target**: Vercel, self-hosted Node.js, or Docker? This affects the backend architecture.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                    Next.js 16 App                    │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  App Router  │  │ Route Handler│  │  Server    │  │
│  │  (Pages/     │  │  API Layer   │  │  Actions   │  │
│  │   Layouts)   │  │  /app/api/*  │  │  (mutate)  │  │
│  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘  │
│         │                 │                │         │
│  ┌──────┴─────────────────┴────────────────┴──────┐  │
│  │           Business Logic / Services            │  │
│  │         (lib/services/*.ts)                    │  │
│  └──────────────────────┬─────────────────────────┘  │
│                         │                            │
│  ┌──────────────────────┴─────────────────────────┐  │
│  │    Data Layer (Phase 1-3: JSON file store)     │  │
│  │    (Phase 4+: Prisma ORM → MySQL/PostgreSQL)   │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │   Auth Layer: JWT + RBAC Middleware            │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## Phase 1 — Foundation & Authentication (Week 1)

Core infrastructure: design system, layout shell, authentication, and role-based access control.

### Design System & Global Styles

#### [MODIFY] [globals.css](file:///d:/crm/app/globals.css)
- Define CSS custom properties for a premium dark/light theme palette (slate/indigo/violet accent scheme)
- Typography scale using Inter font (Google Fonts)
- Glassmorphism utilities, card styles, gradient backgrounds
- Animation keyframes for micro-interactions (fade-in, slide-up, pulse)
- Responsive breakpoints

#### [MODIFY] [layout.tsx](file:///d:/crm/app/layout.tsx)
- Update metadata (title, description)
- Import Inter font from `next/font/google`
- Wrap children with `AuthProvider` context

---

### Authentication System

#### [NEW] `lib/auth.ts`
- JWT token creation/verification using `jose` library
- Password hashing with `bcryptjs`
- Session cookie management (httpOnly, secure)
- `getCurrentUser()` helper for server components

#### [NEW] `lib/types.ts`
- TypeScript interfaces/types for all entities: `User`, `Role`, `Client`, `Candidate`, `JobRequirement`, `Interview`, `Placement`, `Employee`, etc.
- Enum for roles: `SuperAdmin | ITAdmin | Admin | CRMConsultant | Recruiter | Interviewer | HR | Client | Developer | Tester`
- Enum for statuses: `RequirementStatus`, `CandidateStatus`, `InterviewStatus`, `PlacementStatus`

#### [NEW] `lib/rbac.ts`
- Role-permission matrix
- `hasPermission(role, module, action)` utility
- Route-level access control configuration
- Sidebar menu items per role

#### [NEW] `middleware.ts`
- Next.js middleware for route protection
- Redirect unauthenticated users to `/login`
- Role-based route guarding (e.g., `/admin/*` only for Admin+)

#### [NEW] `lib/data/store.ts`
- JSON-file based data store (reads/writes to `data/*.json`)
- CRUD operations for all entities
- Seed data with demo users for each role

#### [NEW] `data/seed.json`
- Pre-populated demo data: 10 users (one per role), 5 clients, 10 candidates, 5 job requirements, sample interviews and placements

---

### Auth Pages

#### [MODIFY] [page.tsx](file:///d:/crm/app/page.tsx)
- Redirect to `/dashboard` if authenticated, else to `/login`

#### [NEW] `app/login/page.tsx`
- Premium login page with glassmorphism card
- Email/password form
- Role indicator after login
- Animated background gradient

#### [NEW] `app/api/auth/login/route.ts`
- POST: Validate credentials, return JWT cookie

#### [NEW] `app/api/auth/logout/route.ts`
- POST: Clear JWT cookie

#### [NEW] `app/api/auth/me/route.ts`
- GET: Return current authenticated user

---

### Dashboard Shell Layout

#### [NEW] `app/(dashboard)/layout.tsx`
- Authenticated layout with sidebar + topbar + content area
- Route group `(dashboard)` wrapping all authenticated pages

#### [NEW] `components/Sidebar.tsx` (Client Component)
- Collapsible sidebar with role-based menu items
- Icons for each menu section
- Active route indicator with animated highlight
- Mobile responsive (drawer mode)

#### [NEW] `components/Topbar.tsx` (Client Component)
- User avatar + name + role badge
- Notification bell (placeholder)
- Search bar (global search placeholder)
- Logout button

#### [NEW] `components/ui/Card.tsx`
- Reusable glass-effect card component

#### [NEW] `components/ui/Button.tsx`
- Styled button variants (primary, secondary, danger, ghost)

#### [NEW] `components/ui/Modal.tsx`
- Animated modal/dialog component

#### [NEW] `components/ui/Table.tsx`
- Data table with sorting, pagination, search

#### [NEW] `components/ui/Badge.tsx`
- Status badge component (color-coded)

#### [NEW] `components/ui/Input.tsx`
- Styled form input components

#### [NEW] `context/AuthContext.tsx` (Client Component)
- React context for auth state
- `useAuth()` hook

---

### Dashboard Home Page

#### [NEW] `app/(dashboard)/dashboard/page.tsx`
- Role-aware dashboard with KPI cards
- Animated counters
- Recent activity feed
- Quick action buttons
- Charts placeholder (bar/pie for recruitment metrics)

---

## Phase 2 — Core Modules: Clients, Jobs, Candidates (Week 2)

### Client Management

#### [NEW] `app/(dashboard)/clients/page.tsx`
- Client list with search, filter, pagination
- Add Client button → modal form

#### [NEW] `app/(dashboard)/clients/[id]/page.tsx`
- Client detail view: contact info, history, requirements, documents

#### [NEW] `app/api/clients/route.ts`
- GET: List clients (with filters) | POST: Create client

#### [NEW] `app/api/clients/[id]/route.ts`
- GET: Single client | PUT: Update | DELETE: Remove

#### [NEW] `lib/services/clientService.ts`
- Business logic for client CRUD

---

### Job Requirement Management

#### [NEW] `app/(dashboard)/requirements/page.tsx`
- Requirements list with status filters (Open, In Progress, Closed)
- Create requirement form

#### [NEW] `app/(dashboard)/requirements/[id]/page.tsx`
- Requirement detail: description, assigned recruiters, candidate pipeline, status timeline

#### [NEW] `app/api/requirements/route.ts`
- GET/POST for job requirements

#### [NEW] `app/api/requirements/[id]/route.ts`
- GET/PUT/DELETE for single requirement

#### [NEW] `lib/services/requirementService.ts`
- Assignment of recruiters, status transitions

---

### Candidate Management

#### [NEW] `app/(dashboard)/candidates/page.tsx`
- Candidate list with skill-based search/filter
- Resume upload area

#### [NEW] `app/(dashboard)/candidates/[id]/page.tsx`
- Candidate profile: personal info, skills, experience, education, resume viewer, status history

#### [NEW] `app/api/candidates/route.ts`
- GET/POST for candidates

#### [NEW] `app/api/candidates/[id]/route.ts`
- GET/PUT/DELETE for single candidate

#### [NEW] `lib/services/candidateService.ts`
- Candidate status workflow, resume management

---

## Phase 3 — Interview, Placement, Recruiter/HR Workflows (Week 3)

### Interview Management

#### [NEW] `app/(dashboard)/interviews/page.tsx`
- Interview schedule calendar view + list view
- Schedule interview form

#### [NEW] `app/(dashboard)/interviews/[id]/page.tsx`
- Interview detail: candidate info, interviewer, feedback, status

#### [NEW] `app/api/interviews/route.ts` & `[id]/route.ts`

#### [NEW] `lib/services/interviewService.ts`

---

### Placement Management

#### [NEW] `app/(dashboard)/placements/page.tsx`
- Placement pipeline: Offer → Joining → Onboarded

#### [NEW] `app/(dashboard)/placements/[id]/page.tsx`
- Placement detail: offer letter, salary, joining date, status

#### [NEW] `app/api/placements/route.ts` & `[id]/route.ts`

#### [NEW] `lib/services/placementService.ts`

---

### Recruiter Workflow Page

#### [NEW] `app/(dashboard)/recruiter/page.tsx`
- My assigned requirements
- Candidate search + shortlist
- Recruitment progress tracker

---

### Interviewer Page

#### [NEW] `app/(dashboard)/interviewer/page.tsx`
- My assigned interviews
- Submit feedback form
- Recommend selection/rejection

---

### HR Page

#### [NEW] `app/(dashboard)/hr/page.tsx`
- Selected candidates queue
- Offer letter generation
- Onboarding checklist
- Document verification

---

## Phase 4 — Admin Panels & Reports (Week 4)

### Admin Dashboard

#### [NEW] `app/(dashboard)/admin/page.tsx`
- User management (CRUD users, assign roles)
- System-wide metrics
- Client/Recruiter management shortcuts

---

### IT Admin Dashboard

#### [NEW] `app/(dashboard)/it-admin/page.tsx`
- System health monitoring (mock)
- User access control
- Audit log viewer
- Security settings

---

### Super Admin Dashboard

#### [NEW] `app/(dashboard)/super-admin/page.tsx`
- Full system access
- Company settings
- Permission matrix editor
- Master data management

---

### Client Portal

#### [NEW] `app/(dashboard)/client-portal/page.tsx`
- Raise manpower request
- Track requirement status
- View candidate profiles
- Approve/reject candidates

---

### Developer Page

#### [NEW] `app/(dashboard)/developer/page.tsx`
- API documentation viewer
- Version management
- Deployment logs (mock)

---

### Testing Page

#### [NEW] `app/(dashboard)/testing/page.tsx`
- Test case management
- Bug reporting interface
- Test reports

---

### Reports & Analytics

#### [NEW] `app/(dashboard)/reports/page.tsx`
- Daily/Weekly/Monthly report generation
- Client report, Recruiter report, Placement report
- Charts & data visualizations (using native SVG or a lightweight charting lib)
- Export to CSV/PDF placeholder

#### [NEW] `lib/services/reportService.ts`

---

## Phase 5 — Database Migration (Week 5)

#### [NEW] `prisma/schema.prisma`
- Full database schema: Users, Roles, Clients, JobRequirements, Candidates, Recruiters, Interviewers, Interviews, Placements, Employees, Reports, Notifications, AuditLogs

#### [MODIFY] `lib/data/store.ts`
- Replace JSON file store with Prisma client queries

#### [NEW] `prisma/seed.ts`
- Database seeder script

---

## Phase 6 — Polish, Notifications & Future-Ready (Week 6)

- Email notification integration (Nodemailer/Resend)
- Real-time notifications (polling or WebSocket)
- Advanced search with full-text search
- Mobile responsiveness audit
- Accessibility (a11y) audit
- Performance optimization
- Audit log system
- Settings page (user profile, password change)

---

## Proposed Folder Structure

```
d:\crm\
├── app/
│   ├── globals.css
│   ├── layout.tsx                    # Root layout (fonts, auth provider)
│   ├── page.tsx                      # Redirect → /login or /dashboard
│   ├── login/
│   │   └── page.tsx                  # Login page
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Sidebar + Topbar shell
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Role-aware home dashboard
│   │   ├── clients/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── requirements/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── candidates/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── interviews/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── placements/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── recruiter/page.tsx
│   │   ├── interviewer/page.tsx
│   │   ├── hr/page.tsx
│   │   ├── admin/page.tsx
│   │   ├── it-admin/page.tsx
│   │   ├── super-admin/page.tsx
│   │   ├── client-portal/page.tsx
│   │   ├── developer/page.tsx
│   │   ├── testing/page.tsx
│   │   ├── reports/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   └── me/route.ts
│       ├── clients/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── requirements/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── candidates/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── interviews/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── placements/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── users/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       └── reports/route.ts
├── components/
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Select.tsx
│       ├── Table.tsx
│       └── Textarea.tsx
├── context/
│   └── AuthContext.tsx
├── lib/
│   ├── auth.ts
│   ├── rbac.ts
│   ├── types.ts
│   ├── data/
│   │   └── store.ts
│   └── services/
│       ├── candidateService.ts
│       ├── clientService.ts
│       ├── interviewService.ts
│       ├── placementService.ts
│       ├── reportService.ts
│       ├── requirementService.ts
│       └── userService.ts
├── data/
│   └── seed.json
├── middleware.ts
└── public/
```

---

## Dependencies to Install

| Package | Purpose |
|---------|---------|
| `jose` | JWT token creation/verification (Edge-compatible) |
| `bcryptjs` | Password hashing |
| `@types/bcryptjs` | TypeScript types |
| `uuid` | Generate unique IDs |

Later phases:
| Package | Purpose |
|---------|---------|
| `prisma` + `@prisma/client` | Database ORM (Phase 5) |
| `recharts` or `chart.js` | Charts for reports (Phase 4) |
| `nodemailer` | Email notifications (Phase 6) |

---

## Verification Plan

### Automated Tests
- `npm run build` — Ensure the app compiles with no TypeScript errors
- `npm run dev` — Verify all routes load and render correctly

### Manual Verification
- **Login flow**: Log in with each of the 10 demo roles, verify correct dashboard/sidebar
- **CRUD operations**: Create, read, update, delete for clients, candidates, requirements
- **Role access**: Verify unauthorized routes redirect appropriately
- **Responsive design**: Test on mobile/tablet viewport sizes
- **Visual quality**: Verify glassmorphism effects, animations, and premium look

---

## Execution Approach

I will build **Phase 1** first (foundation, auth, layout shell, dashboard). After you verify it works, we proceed to Phase 2, and so on. Each phase is independently shippable.

**Ready to begin with Phase 1?**
