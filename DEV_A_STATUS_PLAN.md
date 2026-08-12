# 👨‍💻 Dev-A — Status & Completion Plan

> **Method:** This report was produced by reading the actual source code on disk (backend Java + frontend React), **not** by trusting earlier chat claims. Scope is **Dev-A only** — Dev-B items (live sessions, PIN/QR, WebSocket, live leaderboard, podium, gamification, exports) are deliberately excluded.
>
> **Legend:** ✅ Done & wired · 🟡 Partial · ❌ Missing / mock-only

---

## 📊 Executive summary

| Sprint | Dev-A scope | Status |
|---|---|---|
| **Sprint 1** — Foundations, Auth & Admin | US-1.1, US-1.2, US-1.3 (+ user mgmt) | ✅ **Delivered** — auth, profile, classes, et admin user management sont fonctionnels |
| **Sprint 2** — QCM & Question Bank | US-2.1, US-2.2, US-2.3 | 🟡 **Partial** — quiz shell works, **questions never save**, bank missing |
| **Sprint 3** — AI, Advanced Modes & Stats | US-3.1, US-3.2, US-3.3 | 🔴 **Barely started** — UI mockups only, no backend |

**Context de livraison :** Sprint 1 est fonctionnel pour les objectifs Dev-A. Les éléments restants sont des améliorations durs et des fonctionnalités de Sprint 2/3, notamment la persistance des questions et le banc de questions.

---

## 🏃 Sprint 1 — Foundations, Auth & Administration → ✅ Livré

### US-1.1 Authentication & Security — ✅ Done
- JWT login / register / refresh (`AuthController` → `/api/auth/*`), BCrypt hashing, role-based access (`SecurityConfig`), JWT filter, token storage + auto-refresh on 401 in `frontend/src/services/api.ts`.
- Login form correctly awaits the real API and shows errors (`AdminLogin.tsx` + `AuthWrappers.tsx`).
- **Hardening gaps to close:**
  - ❌ `/auth/register` accepts **any role** → anyone can self-register as ADMIN or ENSEIGNANT (privilege escalation). Restrict public registration to ETUDIANT.
  - 🟡 Refresh token is structurally identical to access token (no token-type claim, no rotation/revocation).
  - ❌ **No global exception handler** → every business error (wrong password, duplicate email, not found) returns **HTTP 500** instead of 400/404/409.

### US-1.2 Profile Management — ✅ Done (no photo)
- `GET/PUT /api/profile/me`, `PUT /api/profile/me/password`; API-backed `ProfilePage.tsx` is correctly routed at `/student/profile`.
- ❌ **Photo upload not implemented** — only an `avatarAnimal` string exists. US-1.2 mentions "photo". Decide: implement a real avatar/photo upload, or formally defer.

### US-1.3 Matières & Classes CRUD — ✅ Done
- **Matière**: `Nom`, `Code`, `Couleur`, `Description` — full CRUD (`/api/matieres`), admin-only writes.
- **Classe**: `Nom`, `Niveau`, `Section`, `Année` — full CRUD (`/api/classes`).
- Admin UI covers **both** subjects and classes (`admin/AdminDashboard.tsx`, routed at `/admin/classes`).

### Bonus (FEATURE_SPLIT §2) — Admin User Management — 🟡 Mostly done
- ✅ List / create / toggle-status / delete users; admin sets initial password; teacher creation with **multi-select subjects + classes** from real lists; `PUT /admin/users/{id}/teacher-assignments`.
- ❌ **Excel user import (Apache POI)** — POI is in `pom.xml` but **never used**. Not implemented.
- 🟡 No generic "edit user" endpoint (name/email/role) — only status + teacher-assignments.

**➡️ To call Sprint 1 "delivered":** add global exception handler, lock down registration role, decide on photo, (optional) Excel import.

---

## 🏃 Sprint 2 — QCM Creation & Question Bank → 🟡 Partial (critical gap)

### US-2.1 QCM (Quiz) CRUD — ✅ Mostly done
- Backend CRUD (`/api/teacher/quizzes` + `/publish`), quiz list + editor form (`QuizList.tsx`, `QuizCreate.tsx`), wired to `quizService.ts`.
- **Gaps:** ❌ no **Difficulté** field (required by US-2.1, absent on both ends); 🟡 `matiere`/`niveau` are **free text**, not linked to the real Matière/Classe entities; ❌ **no ownership check** in `QCMService.getById/update/delete` (any teacher can edit any quiz by id).

### US-2.2 Questions & Answers — ❌ **NOT FUNCTIONAL (top priority)**
- `Question` and `Reponse` entities exist, and the **question builder UI is fully built** (MCQ / True-False / Open, options, correct answer, explanation, drag-reorder in `QuizCreate.tsx`).
- **But it doesn't work end-to-end:**
  - The builder's `handleSaveDraft`/`handlePublish` send **only quiz metadata** — the `questions` array is **discarded**.
  - There is **no `QuestionController`/`QuestionService`** in the backend. `CreateQCMRequest` has no questions field.
  - `quizService.ts` declares `addQuestion/updateQuestion/deleteQuestion` pointing at `/teacher/quizzes/{id}/questions` — **those endpoints don't exist** (would 404), and nothing calls them.
  - Net effect: **every quiz is persisted with 0 questions**; answers are never written.
- ❌ Question **types** partial: enum has only `QCM`, `VRAI_FAUX`, `TEXTE_LIBRE`. No multiple-answer, image, or timed **type** (a `dureeSecondes` field exists but isn't a type).

### US-2.3 Question Bank & Imports — ❌ Missing entirely
- No categories, no search, no duplication, no Excel/Word/PDF import. No entities/endpoints/UI.

---

## 🏃 Sprint 3 — AI, Advanced Modes & Teacher Stats → 🔴 Mostly not started

### US-3.1 AI QCM Generation — ❌ Mock only
- `teacher/Documents.tsx` is a **convincing front-end simulation**: hardcoded generated questions, fake `setInterval` progress bar, "Create Quiz" just fires a toast.
- Backend has **zero**: no document parsing (PDF/Word/PPT), no LLM/Claude integration. Only placeholder enums (`SourceGenerationEnum.IA`).

### US-3.2 Advanced Quiz Modes — 🟡 Enum + listing only
- `ModeQuizEnum` has `LIVE / ENTRAINEMENT / EXAMEN / DEFI`. `GET /api/student/training` lists published ENTRAINEMENT quizzes.
- ❌ **Exam mode** (global timer, single attempt) not enforced. ❌ **Training mode** "unlimited attempts + explanations" not enforced. No attempt tracking; no quiz-taking runner (the student "Start training" button has nothing to run — and quizzes have no questions).

### US-3.3 Teacher Dashboards & Statistics — ❌ Mock only
- `teacher/Results.tsx` is **100% hardcoded** (score distribution, question analysis, leaderboard). CSV/PDF buttons just toast.
- No `/teacher/stats` endpoint. `Participation` entity exists but is **never written or queried**.

---

## ✅ Extra work already done (beyond strict sprint scope — credit)
- Teacher ↔ subjects/classes relationships; student belongs to one class; teacher page to add/remove students in owned classes.
- **Subject enrollment request/approval** workflow (student requests → teacher approves) — `SubjectEnrollmentRequest`.
- Student **desktop** dashboard + My Subjects + Training pages (replaced mobile-only shell).
- Infra fixes: nginx SPA fallback + `/api` proxy, login flow fix, QCM startup bug fix.

---

## 🎯 Recommended completion plan (in order)

### Priority 1 — Finish Sprint 1 to "delivered" (small, high-value)
1. Add `@RestControllerAdvice` global exception handler → real 400/404/409 instead of 500.
2. Restrict `/auth/register` so the public can only create ETUDIANT (no self ADMIN/ENSEIGNANT).
3. Decide **photo**: implement avatar/photo upload **or** formally defer it.
4. *(Optional)* Excel user import via POI (already on the classpath).

### Priority 2 — Make Sprint 2 real (**critical path**)
5. **US-2.2 backend:** add `Question`/`Reponse` API — `GET/POST/PUT/DELETE /api/teacher/quizzes/{id}/questions`, persist answers, keep `nombreQuestions` in sync, add teacher-ownership checks.
6. **US-2.2 frontend:** make `QuizCreate` actually **send the questions** it already builds (and add an edit path for existing quizzes). The UI is done — it just needs to POST.
7. **US-2.1 polish:** add `difficulté`; consider linking `matiere`/`niveau` to real entities.
8. **US-2.3:** Question Bank — categories, search, duplication, then Excel/Word/PDF import.

### Priority 3 — Sprint 3
9. **US-3.2:** attempt entity + Exam (single attempt, global timer) and Training (retakes + explanations) enforcement, plus a **self-paced quiz-taking runner** for training.
10. **US-3.3:** `/teacher/stats` computing success rate / hardest-easiest / distribution from real attempt data; wire `Results.tsx` to it.
11. **US-3.1:** real document parsing + Claude LLM generation; replace the `Documents.tsx` mock.

---

## ⚠️ Integration boundaries to decide (Dev-A vs Dev-B)
- **Where do "participations" come from?** Teacher stats (US-3.3) and mode enforcement (US-3.2) need attempt/score data. **Live** participation is Dev-B's engine. But a **training-mode self-paced runner** could reasonably be Dev-A's own (no WebSocket). Agree this boundary before building stats.
- **Blocker chain:** US-2.2 (questions persist) → training runner / AI-created quizzes / stats. Nothing downstream is real until questions save.
