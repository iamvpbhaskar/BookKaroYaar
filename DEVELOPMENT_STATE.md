# BookKaroYaar — Development State

> Repository continuity checkpoint. Read this file before making changes.

## Current Phase

Phase 2 — App shell and command center dashboard are implemented; Firebase’s final live authentication acceptance checks remain.

## Overall Progress

30%

## Completed

### Foundation and authentication

- React + Vite, JavaScript, MUI, Firebase Authentication, and Firestore are configured.
- Email/password signup, login, logout, password reset, Google sign-in implementation, browser-local auth persistence, protected routes, and `users/{uid}` profile bootstrap are implemented.
- Auth uses one `onAuthStateChanged` listener via `AuthProvider`; UI components use separated auth/profile services.
- Google popup fix: `initializeAuth` includes `browserPopupRedirectResolver`, allowing `signInWithPopup` to initialize. Friendly configuration, domain, popup, cancellation, and network errors are shown in the UI.

### Module 14 — Public experience / landing page

- Public route `/` is implemented through `src/features/landing/pages/LandingPage.jsx` and `src/features/landing/landing.css`.
- The compact public experience contains a product-poster hero, group-chat chaos story, plan-to-done story, closing CTA, mobile navigation drawer, and editorial footer.
- `/` preserves existing auth behavior: public visitors are directed to `/signup` and `/login`; authenticated visitors see “My plans” and CTAs route to `/app`.
- Existing auth routes remain unchanged: `/login`, `/signup`, `/forgot-password`, and protected `/app/*`.

### Mobile art direction refinement

- Desktop remains an expressive editorial poster; tablet is a deliberate one-column editorial composition.
- Mobile is curated as an editorial comic strip, not a squeezed desktop: the hero retains one main plan card, one vote sticker, and one scribble; extra booking/balance cards are hidden.
- The problem section uses three clearly staggered chaos notes; the story retains three process beats and one calm product fragment.
- The closing CTA has more vertical space and a simplified burst. The footer retains brand personality while gaining stronger hierarchy and breathing room.
- CSS breakpoints at `<=850px` and `<=520px` intentionally control composition, focal points, typography, decor, and spacing. No landing markup or Firebase/auth behavior was changed for this refinement.

### Module 02 — App shell and command center dashboard

- Replaced the temporary protected-home placeholder with a protected app shell and dashboard at `/app`.
- Added responsive desktop sidebar, tablet/mobile MUI Drawer navigation, compact top bar, active navigation state, user menu, and logout access.
- Added navigation routes for future protected modules: `/app/plans`, `/app/groups`, `/app/bookings`, `/app/expenses`, `/app/notifications`, and `/app/settings`. They are transparent “on the way” surfaces, not fabricated module implementations.
- Added an empty-first command center: first-plan context, the people-to-done product loop, an attention explanation, and group-pulse framing. This explains what the dashboard will surface without false plan, money, booking, or activity metrics.
- Added profile-scoped dashboard service/hook flow: `DashboardPage → useDashboard → dashboardService → Firestore`. It reads the existing `users/{uid}` profile, supplies loading/error/retry/empty states, and does not introduce plan/group/expense schema ahead of their modules.
- Added a transparent Start a Plan entry dialog that lets a user choose an intent and clearly communicates that full plan creation belongs to Module 05.
- Added responsive dashboard treatments: multi-surface command center desktop, simplified tablet composition, and single-focus stacked mobile cards with drawer navigation.

## Files Changed for Module 02

- `src/App.jsx`
- `src/layout/AppShell.jsx`
- `src/layout/FutureModulePage.jsx`
- `src/layout/appShell.css`
- `src/features/dashboard/pages/DashboardPage.jsx`
- `src/features/dashboard/hooks/useDashboard.js`
- `src/features/dashboard/dashboard.css`
- `src/services/dashboard/dashboardService.js`
- `DEVELOPMENT_STATE.md`

## Files Changed for Module 14

- `src/App.jsx`
- `src/features/landing/pages/LandingPage.jsx`
- `src/features/landing/landing.css`
- `DEVELOPMENT_STATE.md`

## Verification

- `npm.cmd run lint` passes after the mobile refinement.
- `npm.cmd run build` passes after the mobile refinement.
- Vite starts successfully with `npm.cmd run dev -- --host 127.0.0.1 --port 5174` (it selected an available local port when requested ports were occupied).
- Mobile, tablet, and desktop CSS rules were reviewed against Module 14 and the UI reference. Mobile rules target 360px, 390px, and 430px with single-focus layouts and no deliberate viewport-overflow techniques.
- Module 02 verification: `npm.cmd run lint` passes; `npm.cmd run build` passes; Vite serves `/`, `/login`, `/signup`, `/app`, and `/app/groups` with HTTP 200 SPA shells.
- Protected routing remains implemented through the existing `ProtectedRoute`; unauthenticated client navigation to `/app/*` redirects to `/login`, while authenticated users receive the app shell and dashboard.

## Known Issues / Limitations

- A complete authenticated Google browser session cannot be performed in this environment: headless Chrome blocks account-selection popups and no approved Google account is available. Real-browser checks still need to confirm successful Google selection, `/app` navigation, Firebase Auth recognition, and Firestore profile write.
- The Vite visual-debug process reported an outdated optimized dependency after hot reload; restarting Vite resolves this development-server cache condition. Build and lint are clean.

## Next Task

Complete live Firebase authentication acceptance checks: email signup/login/logout, persistence refresh, password reset delivery, Google sign-in, protected-route behavior, and `users/{uid}` Firestore profile creation/update. Then implement Module 03 — Groups and Members, which will supply the first real group data to the command center.

## Constraints

- React + Vite + JavaScript only. No TypeScript, Next.js, or extra UI/animation libraries.
- MUI is primary. Do not commit `.env` or secrets.
- Preserve the BookKaroYaar navy/charcoal/peach/pink/cream visual system and service-based Firebase architecture.

## Last Updated

2026-09-13
