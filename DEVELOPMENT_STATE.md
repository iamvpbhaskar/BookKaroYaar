# BookKaroYaar — Development State

> Repository continuity checkpoint. Read this file before making changes.

## Typography V3 — 2026-09-15

V3 re-art-directed the type hierarchy around deliberate volume rather than applying the expressive display voice to every heading. The audit used the Runable website as a discipline reference only; BookKaroYaar’s design PDF and product intent remain the source of truth.

### V3 semantic hierarchy

- Display: `var(--type-display)`, display family, 750; reserved for the landing hero, poster title, and exceptional editorial moments.
- Hero/page title: `var(--type-page)`, UI family, 700; used by dashboard, groups, plans, auth, and future-module page titles.
- Plan title: `var(--type-plan-title)`, display family, 750; used only by the contextual plan hero and bounded to an intentional reading width.
- Section heading: `var(--type-section)`, UI family, 650; used by overview, itinerary, members, and dashboard sections.
- Card heading: `var(--type-card)` / `var(--type-card-sm)`, UI family, 650/600; used by plan/group cards and compact contextual surfaces.
- Body large/body: `1.125rem` / `1rem`, UI family, 400/500; used for explanations and product copy.
- Metadata: `.875rem` / `.75rem`, UI family, 400/500; used for dates, locations, roles, and plan facts.
- Label: `.6875rem`, UI family, 600, `.1em` tracking; used for eyebrows, tabs context, and compact uppercase labels.
- Button/control: `.875rem`, UI family, 600, zero tracking; used for navigation, actions, tabs, and form controls.

### V3 responsive rules and normalized surfaces

- Landing retains the strongest display treatment and editorial line breaks.
- Plan detail has one dominant bounded title; Overview, Itinerary, Members, tabs, metadata, and actions step down visibly.
- Dashboard and groups keep their existing composition but use UI-sans page/section/card hierarchy instead of repeated display headings.
- Auth and invite surfaces use one clear title with compact labels and quieter explanatory copy.
- At mobile widths, page titles use controlled `clamp()` values and tighter heading leading; section/card levels do not scale into hero sizes.
- No colors, layout structure, routing, Firebase logic, schema, or product behavior changed. Typography V3 is centralized in `theme.js`, `index.css`, and `typography.css`.

## Module 05 Responsive Visual Acceptance — 2026-09-15

Visual QA covered the plans list, plan detail, plan/edit dialogs, itinerary tab and add dialog, group detail with the real Goa Roadtrip plan, and dashboard with the real upcoming plan.

| Requested viewport | Result | Main observation |
| --- | --- | --- |
| 360x800 | PASS | Plans list kept one focal title, touch-sized CTA, readable real plan card, and no overflow. Browser harness observed a scaled CSS viewport. |
| 390x844 | PASS | Dashboard, group plan surface, and itinerary dialog remained readable with reachable actions and no overflow. |
| 430x932 | PASS | Mobile composition preserved the title/body/metadata descent and compact navigation. |
| 768x1024 | PASS | Tablet plans surface re-composed without horizontal overflow. |
| 834x1112 | PASS | Tablet spacing and card hierarchy remained stable. |
| 1280x900 | PASS | Plans list and plan detail maintained one dominant title with quieter tabs, facts, and actions. |
| 1440x900 | PASS | Plan hero title line grouping was corrected to keep the trip name together without clipping. |

The browser harness reported scaled viewport dimensions (for example, requested 390px observed as 488px CSS width), so exact raw CSS screenshots at 360/390/430 were not available through that harness. The responsive CSS breakpoints and overflow checks were still exercised across all requested cases. No layout fixes were needed beyond the targeted plan-title measure/scale adjustment. Historical HMR/Firestore connection-abort messages were present in the long-lived browser console; no new typography runtime or layout errors were introduced by V3.

### Typography V3 final verification

- `npm.cmd run lint` passed.
- `npm.cmd run build` passed; only the existing Vite large-chunk warning remains.
- `git diff --check` passed.
- Typography V3 and responsive visual QA are complete for Module 05.
- No Module 06 work has started.

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

## Module 04 — Shareable Invite Links (completed and live-verified)

- Added secure shareable group invite links at `/join/:inviteCode`, with safe public preview, active-link reuse, copy/share controls, revocation, expiry, invalid-link, and already-member states.
- Invite records in `inviteLinks/{inviteCode}` contain a group reference and safe public snapshot fields. The join flow atomically creates `groups/{groupId}/members/{uid}` once with `role: 'member'`, stores the invite ID, increments uses, and redirects to group detail.
- Firestore rules preserve group and roster protection while allowing active public invite previews and a recipient’s own membership-path `get` before that membership exists. Collection-group discovery remains stored-UID constrained.
- Live browser verification was completed with real Account A (owner) and Account B (recipient): invite creation, public preview, cross-account authentication and join, persisted membership, roster update, refresh persistence, and already-member behavior all succeeded.

### Recent UX refinements

- Refined invite-page spacing, responsive title scale, and CTA/auth separation.
- Desktop sidebar is collapsed by default with an accessible expand/collapse control; tablet/mobile drawer behavior is unchanged.
- Login and signup now put Google authentication first, followed by an email divider. Login includes an accessible password show/hide control.

### Verification

- `npm.cmd run lint` passes.
- `npm.cmd run build` passes.
- `git diff --check` passes.

### Exact next unfinished module

Module 05 — Plans, Trips & Itinerary. Do not start automatically.

## Module 05 — Plans, Trips & Itinerary (implemented; live Firebase browser acceptance pending)

- Added the real `/app/plans` list and `/app/plans/:planId` contextual workspace.
- Added intent-first creation for exactly trip, movie, dinner, event, and other, with required title/type validation, group selection, dates, location, description, cover, and real group-member selection.
- Added realtime plan, plan-member, and itinerary listeners with loading, empty, error, future-module, and responsive states.
- Added plan editing, draft/active/completed/cancelled lifecycle controls, history preservation, participant add/remove, itinerary add/edit/delete, and persisted move-up/move-down ordering.
- Added group-detail plan surface through the integrated group workspace and dashboard upcoming-plan pulse using real plan data.

### Module 05 schema

- `groups/{groupId}/plans/{planId}`: `title`, `type`, `description`, `startAt`, `endAt`, `location`, `coverImageUrl`, `status`, `createdBy`, `createdAt`, `updatedAt`.
- `groups/{groupId}/plans/{planId}/members/{uid}`: `uid`, `joinedAt`, `role`, `displayNameSnapshot`.
- `groups/{groupId}/plans/{planId}/itinerary/{itemId}`: `title`, `type`, `startAt`, `endAt`, `location`, `notes`, `order`, `createdBy`.

### Module 05 permissions and security

- Firestore rules require authenticated parent-group membership for plan reads.
- Plan creation requires the authenticated creator to be a parent-group member and use an allowed type/status.
- Organizers and parent-group owners/admins can edit plans, lifecycle state, members, and itinerary; organizer membership is controlled by the plan creator.
- Plan participants must already exist as parent-group members; organizer assignment cannot be injected by a client.
- Collection-group membership discovery filters documents by path depth so nested plan members cannot appear as parent groups in dashboard/group queries.
- Rules compiled and deployed successfully with `firebase.cmd deploy --only firestore:rules --non-interactive`.

### Module 05 routes and verification

- Routes: `/app/plans`, `/app/plans/:planId`, and group detail surfaces real plans without duplicating plan data.
- `npm.cmd run lint` passes.
- `npm.cmd run build` passes; Vite reports only the existing large-chunk warning.
- `git diff --check` passes.
- Local Vite server starts on `http://127.0.0.1:5181`.
- Real-browser authenticated verification remains pending because the available Playwright browser executable is not installed in this environment. Firebase live create/member/itinerary/lifecycle and cross-account denial checks therefore remain unverified here.

### Remaining limitations and exact next module

- Browser acceptance with the real `Goa Roadtrip` group, second account, responsive screenshots, and console-error review must be completed in an environment with browser tooling and authenticated Firebase access.
- Bookings, Expenses, Polls, Activity, Notifications, and Settlement remain future modules; their plan tabs are explicit incomplete states.
- Exact next module: Module 06 — Booking Management.

## Create Plan Trace Fix — 2026-09-15

- Root cause found in the client handoff: `PlanFormDialog` loaded the selected parent-group roster through `useGroupDetail(groupId)`, but `PlansPage` passed `members={[]}` and the submit handler built `selectedMembers` from that empty prop. Selected real participants were therefore silently dropped before `createPlan()`.
- Fixed submission to derive selected participants from the loaded selected-group roster. The organizer is still written separately exactly once, and participant writes are deduplicated by UID without changing display-name behavior.
- Added explicit validation for title, type, selected group, authenticated-user membership in that group, invalid dates, and `endAt < startAt`.
- Added development-only trace points for submit start, validated payload, `createPlan` call, Firestore batch start/failure/success, and navigation destination. Firebase errors now expose their exact error code in the dialog during development.
- Firestore rules were not weakened. Participant creation remains limited to UIDs that already exist in the selected parent group; organizer assignment remains controlled by the authenticated creator.
- `npm.cmd run lint`, `npm.cmd run build`, and `git diff --check` pass.
- A live Goa Roadtrip write could not be executed in this takeover environment because the integrated browser had no authenticated Firebase session. No claim is made that the live batch error code was observed here; the next acceptance run should use the development console trace with the existing authenticated account.

## Create Plan Form Event Fix — 2026-09-15

- Root cause was isolated to the client event boundary: the create action relied on implicit ancestry from `DialogActions` inside `DialogContent component="form"`, and there was no click diagnostic on the button itself. That made the pre-Firestore failure indistinguishable in the browser console.
- Rebuilt only `PlanDialogs.jsx` around an explicit form boundary: `<Box component="form" id="create-plan-form" onSubmit={submit}>`, with the Create plan button explicitly using `type="submit" form="create-plan-form"`.
- Intent buttons and Cancel are explicitly `type="button"`, preventing accidental submits from unrelated controls.
- Added development-only diagnostics in order: Create plan click, form submit, validation started, validation passed, calling `createPlan`, and existing Firestore/navigation diagnostics.
- No Firestore rules, schema, member display logic, or database data were changed.
- `npm.cmd run lint`, `npm.cmd run build`, and `git diff --check` pass.
- Live authenticated browser confirmation remains pending because the shared browser page with the Firebase session was not available to the agent; use the new `[Plan Debug]` logs to confirm click and submit before evaluating any Firebase behavior.

## Plan Edit Auth and React Warning Fix — 2026-09-15

- Root cause: `PlanDetailPage` obtained the authenticated `user` from `AuthContext`, but the edit `PlanFormDialog` invocation did not pass `currentUserUid`. Create passed the UID; edit received `undefined` and failed membership validation before `updatePlan()`.
- Fix: `PlanFormDialog` now reads the existing `AuthContext` and resolves `currentUserUid || authUser.uid`, with separate messages for an unavailable session versus an authenticated non-member. No duplicate auth state was introduced.
- React fixes: plan dialogs now use MUI `slotProps.inputLabel` and `slotProps.paper` instead of leaking `InputLabelProps`/`PaperProps`; plan-detail avatars render as `span` elements so Avatar nodes are not nested inside Typography paragraph elements.
- `npm.cmd run lint`, `npm.cmd run build`, and `git diff --check` pass. No security rules or schemas changed.
- Remaining limitation: the existing authenticated owner browser flow was not executable from this agent session, so the final live edit/update/refresh persistence check remains pending. The edit boundary logs the current user and UID in development for that run.

## Itinerary Submission Fix — 2026-09-15

- Root cause 1: `ItineraryDialog` relied on the implicit `DialogContent component="form"`/`DialogActions` structure and had no Save-button diagnostic. The explicit itinerary form boundary now uses `id="itinerary-item-form"`, `onSubmit`, and a Save button with `type="submit" form="itinerary-item-form"`.
- Root cause 2 found during live edit verification: the itinerary dialog remained mounted when switching between Add and Edit, so its state retained the previous new-item values and dropped the existing `item.id`. Editing therefore created a second item instead of updating the existing document. The dialog now resets from `initialValues` when opened or when the target item changes.
- Added development-only trace points for Save click, form submit, validation, parent callback, Firestore start/error/success, realtime refresh, and exact Firebase error code/message.
- Live authenticated verification: Save item created/loaded an itinerary item and the realtime count changed; editing `flight` to `flight updated` kept the count at one and updated the existing item; reopening the plan URL refreshed successfully with `flight updated` persisted.
- No date validation, parent plan dates, Firestore rules, schema, groups, or invites were changed.
- `npm.cmd run lint`, `npm.cmd run build`, and `git diff --check` pass. Remaining limitation: the live console log sequence and generated Firestore item ID were observed in the authenticated browser but are not captured in repository artifacts; the development diagnostics remain available for repeat testing.

## Module 05 Final Live Acceptance — 2026-09-15

Module 05 is complete and live-verified with the existing authenticated owner account and the real Goa Roadtrip group.

- Create Plan: verified.
- Edit Plan: verified; updated plan details persisted after refresh.
- Participants: verified; organizer and selected group participants remained intact.
- Itinerary create/edit/delete: verified.
- Itinerary reorder: verified; Firestore order persisted after refresh.
- Plan lifecycle: verified across the implemented lifecycle controls.
- Dashboard integration: verified with real plan context.
- Group integration: verified with real plans surfaced in group context.
- Responsive plan workspace and dialog behavior: verified in the live browser session.

Final checks:

- `npm.cmd run lint` passed.
- `npm.cmd run build` passed; only the existing Vite large-chunk warning remains.
- `git diff --check` passed.

Bookings, Expenses, Polls, Activity, Notifications, and Settlement remain future modules. Exact next module: Module 06 — Booking Management.

## Typography V2 — 2026-09-15

Typography was audited across landing, auth, dashboard, app shell, groups/members, invites, plans, and itinerary against `BookKaroyar_UI_Design_Reference_v2.pdf` and the product intent.

### Typography tokens

- Display family: `"Arial Narrow", "Avenir Next Condensed", Inter, sans-serif`; used for hero headlines, page titles, contextual plan identity, and editorial section anchors. This preserves the product's expressive personality without forcing display treatment onto every UI string.
- UI family: `Inter, ui-sans-serif, system-ui, sans-serif`; used for navigation, controls, forms, metadata, body copy, status labels, and supporting descriptions.
- Weights: 400 regular body, 500 emphasized/supporting text, 600 controls and actionable UI, 700 section labels and compact headings, 800 display/page hierarchy, 900 brand/rare poster emphasis.
- Scale: display-xl `clamp(4rem, 8.6vw, 8.9rem)`, display-lg `clamp(2.65rem, 5.5vw, 4.75rem)`, display-md `clamp(1.75rem, 3.4vw, 2.8rem)`, display-sm `clamp(1.35rem, 2.2vw, 1.85rem)`, body-lg `1.125rem`, body-md `1rem`, body-sm `.875rem`, caption `.75rem`, label `.6875rem`.
- Line heights: display `.98`, tight `1.2`, body `1.55`.
- Tracking: display and UI text use `0`; compact labels use `.1em` for scanability. The previous negative tracking values are no longer part of the shared system.

### MUI mapping and usage

- `h1`/`h2`: display-xl/display-lg, 800, display leading.
- `h3`/`h4`: display-md/display-sm, 700, tight leading.
- `body1`/`body2`: body-md/body-sm, 400, body leading.
- `subtitle1`/`subtitle2`: body-lg/body-sm, 500/600.
- `button`: body-sm, 600, UI tracking.
- `caption`/`overline`: caption/label, 500/700, compact label tracking.
- Typography V2 is implemented in `src/theme.js`, `src/index.css`, and `src/typography.css`. It changes type treatment only; palette, layout, product behavior, and module boundaries remain unchanged.

### Historical next-module checkpoint
Module 04 — Shareable Invite Links.
