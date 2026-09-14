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

## Module 03 — Groups & Members (implemented; live Firebase validation pending)

- Replaced the `/app/groups` placeholder with protected `/app/groups` and `/app/groups/:groupId` routes.
- Added `GroupPage` and group-detail experiences with real-time group, membership, and member-count listeners; loading, empty, error/retry, saving, confirmation, and responsive states are included.
- Added group CRUD, creator-as-owner membership bootstrap, group editing/deletion, member roster, direct known-UID member addition, member removal, non-owner leave, role display, and owner-led role/ownership management.
- Added the specified Firestore structure: `groups/{groupId}` and `groups/{groupId}/members/{uid}`, with lowercase persisted `owner`, `admin`, and `member` roles.
- Added `firestore.rules` and `firebase.json`. Rules require auth, limit reads to group members, restrict modifications by role, preserve immutable group identity fields, block self-promotion, and protect owner departure.
- Updated the dashboard service so the group pulse uses the authenticated user’s actual membership count. No future plan, booking, expense, settlement, poll, or notification data was introduced.

### Module 03 files

- Added: `firebase.json`, `firestore.rules`, `src/services/groups/groupService.js`, and `src/features/groups/` (constants, hooks, dialogs, pages, styles).
- Modified: `src/App.jsx`, `src/features/dashboard/pages/DashboardPage.jsx`, `src/services/dashboard/dashboardService.js`, and this state file.

### Module 03 verification

- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.
- Vite served on `http://127.0.0.1:5178`; `/app/groups` and `/app/groups/group-test` returned HTTP 200 SPA shells.
- `git diff --check` completed without whitespace errors.

### Module 03 remaining limitation

- Firestore rules have not been deployed from this environment, and there is no authenticated browser/Firebase Console session available for live create/edit/delete, authorization-denial, realtime, and record verification. Those checks must be completed after rules deployment.
- Direct member addition intentionally accepts a known Firebase user ID; shareable invites remain Module 04.

### Exact next unfinished module

Module 04 — Shareable Invite Links.

## Firestore/Groups Integration Resolution — 2026-09-14

### Exact Root Cause
The runtime error on `/app` ("We couldn’t open your command center.") and `/app/groups` ("We couldn’t load your groups.") was caused by two compounding factors:
1. **Missing Collection Group Index (Primary Engine Failure)**: In Cloud Firestore, single-field indexes are automatically maintained only for collection scope, not for collection group scope. Running `collectionGroup(db, 'members')` filtered by `where('uid', '==', uid)` requires an explicit `COLLECTION_GROUP` single-field index exemption on field `uid`. The project had zero index overrides, producing runtime error `400 FAILED_PRECONDITION: The query requires a COLLECTION_GROUP_ASC index for collection members and field uid.`
2. **Security Rules Scope for Collection Groups**: In Firestore Security Rules (v2), collection group queries do not match path-nested rules (`match /groups/{groupId}/members/{uid}`). They strictly require a top-level recursive wildcard match (`match /{path=**}/members/{uid}`). Without this, Firestore's static query validator denies collection group queries by default with `permission-denied`.

### Exact Documents Inspected
- `users/JNyiRKmN0ZaPxMCbgTV2U8CdX6J3`: profile document exists with fields `displayName`, `email`, `createdAt`, `updatedAt`, `lastLoginAt`, `onboardingComplete`, `photoURL`.
- `groups`: initially 0 documents.
- `groups/*/members`: initially 0 documents.
- Membership schema verified against `src/services/groups/groupService.js` and `03-groups-members.pdf`: each membership document has document ID = `user.uid` and contains `uid`, `role`, `joinedAt`, `displayNameSnapshot`, and `photoURLSnapshot`.

### Exact Index Requirement
Defined `firestore.indexes.json` with a single-field override for collection group `members` on field `uid` (`queryScope: "COLLECTION_GROUP"`, `order: "ASCENDING"`), and linked it in `firebase.json`.

### Exact Rule Requirement
Updated `firestore.rules` with a narrow top-level recursive collection group read rule:
```javascript
match /{path=**}/members/{uid} {
  allow read: if signedIn() && resource.data.uid == request.auth.uid;
}
```
This enables users to discover only their own membership records across groups. All other roster reads continue to require group membership (`member(groupId)`), and group document reads/writes retain strict owner/admin/member authorization.

### Exact Deployment Result
1. **Indexes**: `firebase.cmd deploy --only firestore:indexes --non-interactive` deployed `firestore.indexes.json` successfully to project `bookkaroyaar`. Verified index state via Google Cloud Firestore Admin REST API transitioned to `READY`.
2. **Rules**: `firebase.cmd deploy --only firestore:rules --non-interactive` compiled and released `firestore.rules` to `cloud.firestore`.
3. **REST Query Validation**: Direct query to `runQuery` with `where uid == JNyiRKmN0ZaPxMCbgTV2U8CdX6J3` returned HTTP 200 OK.

### Actual Browser Verification
Verified end-to-end in real browser session authenticated as `Ved Prakash Bhaskar (iamved99@gmail.com)`:
1. Navigated to `/app`: command center loaded successfully with zero Firestore errors; rendered personalized welcome and empty state.
2. Navigated to `/app/groups`: loaded clean "No groups yet. Let’s change that." empty state with zero Firestore error banners.
3. Created test group "Goa Roadtrip" (description: "Trip to Goa with friends", cover image URL provided) via dialog; explicit `onClick` on submit button ensures cross-browser form submission.
4. Firestore write succeeded (`groups/dX0bffoqEkphaLvj4AMt` and `groups/dX0bffoqEkphaLvj4AMt/members/JNyiRKmN0ZaPxMCbgTV2U8CdX6J3`).
5. App dynamically navigated to `/app/groups/dX0bffoqEkphaLvj4AMt`: group detail rendered with group title, description, and creator member with role `Owner`.
6. Browser refresh on `/app/groups/dX0bffoqEkphaLvj4AMt`: reloaded group detail from Firestore with complete persistence.
7. Navigated back to `/app/groups`: rendered group card "Goa Roadtrip" showing `1 member · Owner`.
8. Navigated back to `/app`: command center Group Pulse section correctly updated from 0 to `1 group ready for a plan.`
9. Recorded browser interaction artifacts saved to `.system_generated`.

### Remaining Limitations
- A second authenticated account is not yet configured in this environment to test cross-user member addition and non-member group access denial in the live browser (already protected and enforced by Firestore Security Rules).
- Shareable invite links remain the scope of Module 04.

## Groups → Members UX Refinement — 2026-09-14

- **Removed Internal Identifiers**: Completely eliminated the temporary "Bring in a teammate" form that required raw Firebase user IDs (UIDs) and display names.
- **Removed Raw UID Exposure in Roster**: Member rows now display `displayNameSnapshot` and the human-readable role label (`Owner`, `Admin`, `Member`) instead of leaking raw database UIDs (`member.uid`) to the user interface.
- **Added "Invite people" CTA**:
  - Replaced the direct UID input area with a clean editorial CTA card (`.invite-cta-card`) in the Members tab.
  - Added an "Invite people" button in the Members section header for owners and admins.
  - Added an `InviteDialog` clearly communicating that shareable invite links, token expiration, and one-tap onboarding are arriving in Module 04.
- **Preserved Real Architecture**:
  - Real membership documents in `groups/{groupId}/members/{uid}` are preserved.
  - `OWNER`, `ADMIN`, `MEMBER` roles and permission rules remain strictly enforced.
  - No fake or display-only member records were introduced.
- **Verification**:
  - `npm.cmd run lint` passed with 0 errors.
  - `npm.cmd run build` passed with 0 errors.
  - `git diff --check` passed with 0 formatting issues.
  - Browser subagent verified on live group "Goa Roadtrip": UID inputs are completely gone, member row displays clean role labels, CTA button opens the Module 04 invite dialog, and dialog closes cleanly.

### Exact Next Unfinished Module
Module 04 — Shareable Invite Links.
