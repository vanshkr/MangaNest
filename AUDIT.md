# MangaNest — Full Codebase Audit & Roadmap Reference

## Context
This is a single, detailed reference document covering: what the project is, its architecture, how to verify each API endpoint, what's missing/broken, what to build next, and production-readiness gaps — cross-referenced against the project's own `.md` files (TASK1/2/3) — so that follow-up work can be planned and tackled feature-by-feature. This document is the reference; each numbered gap/feature below can become its own focused implementation task.

This is based on three parallel deep-dive audits (structure & docs, backend, frontend) run against the full repo on 2026-09-02.

---

## 1. What the project is

**MangaNest** is a manga discovery + reading web app with a social "watch-party for manga" twist:
- Browse/search/read manga sourced live from the **MangaDex public API** (no local manga catalog — everything is a live proxy).
- User accounts (register/login/JWT) for personalization.
- **"Reading Rooms"** — the standout feature: create a room, invite others via link/code, and read a chapter together in real time (synced page position, host controls, live chat, reactions, typing indicators) via Socket.IO.

Stack: React 19 + Vite 7 client (Tailwind v4, shadcn/radix UI, TanStack Query, React Router v7, Socket.IO client, Sentry) talking to a Node/Express 5 + Socket.IO server backed by PostgreSQL (raw SQL via `pg`, no ORM). No monorepo tooling — `client/` and `server/` are two independently-managed pnpm packages; a stray root `package.json` duplicates some server deps and appears to be a leftover artifact, not a real workspace root.

---

## 2. Architecture

```
client/ (React 19 + Vite)              server/ (Express 5 + Socket.IO)
 ├─ pages/          → routes/screens    ├─ routes/        → authRoutes, mangaRoutes, roomRoutes
 ├─ components/     → shared UI + ui/   ├─ controllers/   → authController, mangaController, roomController
 ├─ contexts/       → Auth/Socket/Room/ ├─ services/      → authService, mangaService (MangaDex proxy), roomService
 │                    Favorites/Theme   ├─ models/        → Repository classes (raw SQL): User, Room, RoomParticipant, RoomMessage
 ├─ hooks/          → useMangaQueries   ├─ middleware/    → auth.js (JWT), asyncHandler.js
 │                    (TanStack Query)  ├─ sockets/       → roomHandlers.js (Socket.IO events)
 ├─ api/            → auth.js, room.js  ├─ config/        → database.js (pg Pool), socket.js (Socket.IO + JWT auth)
 └─ config/api.js   → manga endpoints   └─ database/      → migrations/001_initial_schema.sql, runMigrations.js
```

**Key architectural facts:**
- No ORM — hand-written SQL + a custom repository layer + a naive migration runner (no migration-tracking table).
- Manga/chapter content is **never persisted locally** — `mangaService.js` proxies MangaDex live on every request; the `rooms` table only stores external `manga_id`/`chapter_id` as opaque strings.
- Auth: JWT access (7d) + refresh (30d) tokens, bcrypt password hashing, stored client-side in `localStorage`. No token revocation/blacklist — logout is a client-only no-op.
- Real-time: single Socket.IO namespace, JWT-authenticated handshake, used only for reading rooms (join/leave, page sync, chat, reactions, typing, presence). REST controllers emit socket events after DB writes via a module-level singleton (`getSocketInstance`) — tight coupling, no message queue.
- No RBAC/admin domain at all — only ad hoc "is this user the room host" checks scattered in `roomService.js`.
- No file/image uploads — all images are MangaDex-hosted URLs.
- No caching layer (Redis etc.) — every manga page load hits MangaDex directly.

---

## 3. Full API surface (for endpoint-by-endpoint verification)

Base URL: `http://localhost:3000` (dev). All responses except `/api/manga/*` use envelope `{success, message, data}`.

### `/api/auth` (public unless noted)
| Method | Path | Auth | Verify by |
|---|---|---|---|
| POST | `/register` | public | POST `{username, email, password (8+, upper/lower/digit/special), avatarUrl?}` → expect 201 + `{user, accessToken, refreshToken}` |
| POST | `/login` | public | POST `{email, password}` → 200 + token pair; wrong password → 401 |
| POST | `/refresh` | public | POST `{refreshToken}` → new token pair; invalid → 401 |
| GET | `/me` | Bearer | expect current user; no/expired token → 401 |
| PATCH | `/profile` | Bearer | update `username`/`email`/`avatarUrl`, confirm persisted via `/me` |
| POST | `/change-password` | Bearer | `{currentPassword, newPassword}`; wrong current → 401/400 |
| POST | `/logout` | Bearer | 200, but **note: token stays valid until expiry** — verify this is expected, not a bug in your test |

### `/api/manga` (all public, no auth)
`/search?query=`, `/browse?status[]&contentRating[]&demographic[]&year&sortBy&limit&page`, `/trending?limit&monthsAgo`, `/collections`, `/top-airing`, `/most-popular`, `/hidden-gems`, `/recently-completed`, `/latest-releases`, `/:mangaId`, `/chapters/:chapterId`.
- Verify each returns live MangaDex-shaped data (or empty `{}`/`[]` on upstream failure — **services swallow errors rather than propagating 5xx**, so a 200-with-empty-body from these routes may mean MangaDex is unreachable, not that there's no data — check server logs, not just the HTTP status, when verifying).

### `/api/rooms` (all require Bearer auth — `router.use(authenticate)`)
Full CRUD (`POST /`, `GET /public`, `GET /my-rooms`, `GET /:roomId`, `PATCH /:roomId`, `DELETE /:roomId`) + `POST /:roomId/join`, `POST /join/:inviteCode`, `POST /:roomId/leave`, `POST /:roomId/kick/:userId`, `POST /:roomId/transfer-host`, `PATCH /:roomId/page`, `POST /:roomId/messages`, `GET /:roomId/messages`, `POST /:roomId/regenerate-invite`.
- Verify host-only actions (kick/close/settings/transfer/regenerate-invite) 403 for non-hosts.
- Verify `transfer-host` **specifically under concurrent load** — see F9 below (transaction bug).
- Verify Socket.IO events fire alongside each REST mutation (`user:joined`, `page:changed`, `message:new`, etc.) — connect two socket clients and watch for cross-emission.

### Socket.IO (`ws://localhost:3000`, JWT via `auth.token` or `?token=`)
Client→server: `room:join`, `room:leave`, `page:change`, `message:send`, `reaction:send`, `typing:start/stop`, `presence:update`, `ping`.
Server→client: `user:joined/left/kicked`, `host:transferred`, `room:updated/closed`, `page:changed`, `message:new`, `participant:entered/exited/disconnected`, `reaction:received`, `user:typing/stopped-typing/active`.
- Verify by opening two browser sessions in the same room and confirming page-sync and chat propagate live.

**General verification approach:** no automated tests exist (0% coverage, confirmed — no Jest/Vitest/Mocha/Cypress/Playwright anywhere). Until tests are added, verification must be manual (Postman, per `.vscode/settings.json` showing Postman extension use) or via a new smoke-test suite (see Gap list).

---

## 4. What the project's own docs say (vs. reality)

Only 4 markdown files exist; no root README, no ARCHITECTURE/CHANGELOG/ROADMAP/CONTRIBUTING/LICENSE, no `docs/` folder.

- **`TASK1_COMPLETED.md`** (2025-11-12): claims env-based config + centralized API client + error/loading states were added. **Reality mismatch**: claims `.env`/`.env.example` were created in both `client/` and `server/`, but only `server/.env.example` actually exists on disk (unreadable by sandbox, existence otherwise unconfirmed for client) — worth manually confirming which env files really exist before onboarding anyone new.
- **`TASK2_CHAPTER_READER_GUIDE.md`** (2025-11-12): claims the chapter reader (`MangaView.jsx`) is a fully-built ~900-line feature (single/multi-page mode, fullscreen, RTL/LTR, progress persistence, keyboard shortcuts). **Reality: false** — `MangaView.jsx` is currently a 3-line stub (`<div>MangaView</div>`). This is the single biggest doc/reality gap in the repo — either the work was reverted, lost, or the doc describes a version that was never committed here.
- **`TASK3_TANSTACK_QUERY_MIGRATION.md`** (2025-11-12): claims 9 pages/components were migrated to TanStack Query hooks. **Reality: mostly true** — `hooks/useMangaQueries.js` exists with the documented hooks and is used for manga-list pages. Confirmed accurate.
- Doc-stated but explicitly unbuilt ("Future Enhancements" sections, self-admitted): favorites/bookmarks synced via API (favorites is currently localStorage-only via `FavoritesContext`), infinite scroll on browse, double-page spread reader mode, zoom controls, offline download, reading stats, cross-device progress sync, comments/annotations on pages, auto-advance slideshow, night-mode filter, touch/swipe gestures.
- Doc-stated unchecked QA items: "User testing completed", "Performance optimization verified", "Documentation reviewed" — all still open per TASK2's own checklist.

**Where we actually stand vs. the docs' claimed state:** the docs describe a more complete app than exists. Treat TASK2 in particular as aspirational/stale, not current truth — the reader must be rebuilt from scratch, not "enhanced."

---

## 5. Critical bugs — app is currently broken in several places

These are not "missing features," they are things that will crash or fail to build right now:

| # | Severity | Issue | Location |
|---|---|---|---|
| F1 | **Critical** | Chapter reader is an unimplemented 3-line stub — core "read a manga" feature doesn't exist | `client/src/pages/MangaView.jsx:36-38` |
| F2 | **Critical** | `MangaDetail.jsx` throws at render: uses `useEffect` without importing it, references ~10 undeclared state vars/handlers (`mangaDetails`, `isLoading`, `handleStartReading`, etc.), calls `isFavorite`/`toggleFavorite` without importing `useFavorites` | `client/src/pages/MangaDetail.jsx:1,29,76-211` |
| F3 | **Critical** | `Favorites.jsx` and `MangaBrowse.jsx` import a `MangaCard` component that doesn't exist anywhere in the repo — both pages fail to resolve | `client/src/pages/Favorites.jsx:2`, `MangaBrowse.jsx:4` |
| F4 | **Critical** | `Room.jsx` and `RoomCreate.jsx` import `ui/switch` which was never created — the entire Read2gether UI can't render | `client/src/pages/Room.jsx:27`, `RoomCreate.jsx:14` |
| F5 | High | `Register.jsx` calls `register(username, email, password, avatarUrl)` (4 args) but `AuthContext.register` expects one `userData` object — registration is broken end-to-end | `Register.jsx:76-81` vs `AuthContext.jsx:81` |
| F6 | High | `ErrorBoundary.jsx` uses `process.env.NODE_ENV` in a Vite app (should be `import.meta.env.DEV`) — throws `ReferenceError` inside the error boundary itself, masking the real error | `ErrorBoundary.jsx:63` |
| F7 | High | REST API CORS is fully open (`cors()` with no options, reflects any origin) while Socket.IO correctly restricts to `CLIENT_URL` — inconsistent, insecure | `server/src/index.js:17` |
| F8 | Medium | `/profile/settings` is linked from Header/UserProfileMenu but no such route exists in `App.jsx` — dead link → 404 | `Header.jsx:235`, `UserProfileMenu.jsx:115` |
| F9 | Medium | `RoomParticipantRepository.transferHost` runs `BEGIN`/`COMMIT`/`ROLLBACK` through the shared pooled `query()` helper instead of a dedicated client — pg.Pool may hand out different connections per call, so this "transaction" isn't actually atomic | `server/src/models/RoomParticipant.js:131-157` |
| F10 | Low | `TopManga.jsx` is a dead stub component, exported but unused | `components/TopManga.jsx` |
| F11 | Low | Hero carousel data is hardcoded (`constants/heroSectionManga.js`), and its "Read Now"/"Add to List" CTAs have no `onClick` | `HeroSection.jsx:118-131` |
| F12 | Low | Debug `console.log`/emoji logging shipped unguarded to production | `SocketContext.jsx`, `RoomContext.jsx`, `MangaDetail.jsx:36` |

**Recommendation:** fix F1–F6 first — they block the core user journeys (read a chapter, view manga detail, browse, favorite, register, co-read). Everything else in this document assumes these are addressed first.

---

## 6. Production-readiness gaps

- **Zero automated tests** — no Jest/Vitest/Mocha/Cypress/Playwright anywhere, 0% coverage on client or server. No CI (no `.github/workflows`, nothing else either).
- **No centralized Express error-handling middleware** — errors rely on manual try/catch per controller; manga controller has none (relies on service-layer swallowing).
- **No rate limiting, no `helmet`** — auth endpoints (register/login) have no brute-force protection, no security headers (CSP/HSTS/etc).
- **No token revocation** — JWT logout is client-only; a stolen token remains valid until natural expiry (7d access / 30d refresh).
- **JWTs in `localStorage`** — XSS-exploitable token theft surface; no httpOnly cookie option implemented.
- **No Docker/docker-compose, no deployment config of any kind** — server config has hardcoded local-dev DB fallbacks (`postgres`/`postgres`), no staging/prod environment definitions exist in-repo.
- **No logging framework** (winston/pino/morgan) — only ad hoc `console.log`.
- **No migration-tracking table** — `runMigrations.js` re-runs all `.sql` files with no idempotency guard beyond `CREATE TABLE IF NOT EXISTS`; unsafe for iterative schema changes.
- **Sentry config not finalized for production** — `sendDefaultPii: true` + `tracesSampleRate: 1.0` (100% sampling) + a placeholder `tracePropagationTargets: ['https://yourserver.io/api']` string left in `main.jsx` — needs review before shipping.
- **No caching/rate-limit protection against MangaDex** — every page load proxies MangaDex live with no local cache; a traffic spike or MangaDex outage directly degrades the app with no fallback.

---

## 7. Feature gaps / what's missing vs. a complete product

Beyond fixing the critical bugs, these are absent features worth considering (roughly ordered by value):
1. **A working chapter reader** (rebuild from scratch — the TASK2 doc's described feature set is a good spec: single/multi-page mode, progress persistence, fullscreen, RTL/LTR toggle, keyboard nav).
2. **Server-synced favorites/bookmarks** — currently client-only via localStorage; no DB table, no API for it.
3. **Infinite scroll on browse/search** (TanStack Query `useInfiniteQuery` was already scoped as future work in TASK3).
4. **User profile/settings page** — routes are linked but don't exist.
5. **Reviews/ratings** — explicitly stubbed "Coming Soon" in `MangaDetail.jsx`.
6. **Cross-device reading progress sync** (currently localStorage-only, per-device).
7. **Notifications** — bell icon and nav link exist with no backend/handler at all.
8. **Random manga / discovery shuffle** — nav link exists (`href="#"`), unimplemented.
9. **Admin/moderation tooling** — no admin domain exists at all (user management, room moderation, content flags).
10. **Search debounce** — minor UX/perf polish on live search.

---

## 8. Suggested order of attack

Given the scope, tackling in this order minimizes wasted effort (fix foundations before building on top of them):

1. **Fix critical breakage (F1–F6)** — restores core user journeys (browse, view detail, favorite, register, read, co-read UI rendering).
2. **Harden security basics (F7, JWT storage, rate limiting, helmet, CORS lockdown)** — cheap, high-value, should precede any public exposure.
3. **Add a minimal automated test layer** (smoke tests per endpoint from §3, plus a couple of critical-path frontend tests) so future fixes don't silently regress.
4. **Rebuild the chapter reader** as a proper feature (biggest single missing capability).
5. **Server-sync favorites**, add profile/settings page, close remaining dead links (F8, F10, F11).
6. **Production hardening**: logging framework, centralized error middleware, migration tracking, Sentry config review, Docker/deploy config.
7. **New features**: infinite scroll, reviews, notifications, admin tooling, cross-device progress sync.

Each numbered item above (F1–F12, and each §7 feature) can become its own focused implementation task when ready to start — this document is the map for picking what to tackle next.
