# BookKaroYaar — Architecture & Product Decisions

> This file records important decisions made during development.
> Agents must respect these decisions unless they are explicitly changed.

---

# 001 — Frontend Framework

## Decision

Use React.js with Vite.

## Reason

The project is intended to be a modern React application with a lightweight frontend build setup.

## Locked

- React
- Vite

## Not Allowed

- Next.js
- Angular
- Vue
- Remix

---

# 002 — Programming Language

## Decision

Use plain JavaScript.

## Reason

The project intentionally does not use TypeScript.

## Locked

JavaScript only.

## Not Allowed

- TypeScript
- `.ts`
- `.tsx`

Do not migrate existing JavaScript files to TypeScript.

---

# 003 — Backend Platform

## Decision

Use Firebase.

Firebase will provide:

- Authentication
- Firestore
- Storage
- Cloud Functions
- Realtime capabilities where required

## Reason

The application benefits from managed backend infrastructure and realtime collaborative functionality.

---

# 004 — Authentication

## Decision

Use Firebase Authentication.

Initial authentication methods:

- Email/password
- Google sign-in

Authentication state should be maintained using Firebase Auth state listeners.

---

# 005 — Database

## Decision

Use Cloud Firestore.

Firestore will be the primary persistent database for:

- users
- groups
- memberships
- plans
- activities
- bookings
- expenses
- polls
- notifications
- settlements

The exact production schema must follow the relevant product specification and Firebase security specification.

---

# 006 — Firebase Security

## Decision

Frontend checks are NOT the security boundary.

Firestore Security Rules must enforce access control.

A user must not gain access to another user's or group's data merely by manipulating the frontend.

---

# 007 — Firebase Configuration

## Decision

Firebase web configuration is loaded through environment variables.

Required variables:

- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

Environment secrets must not be committed.

---

# 008 — UI Component Library

## Decision

Material UI (MUI) is the primary UI component library.

## Reason

MUI provides a strong, consistent component system for:

- forms
- dialogs
- menus
- buttons
- navigation
- tables
- responsive controls
- feedback states

Custom styling should be layered on top to achieve the BookKaroYaar visual identity.

---

# 009 — Tailwind

## Decision

Tailwind is optional and secondary.

Do not introduce Tailwind everywhere merely because it is available.

Use MUI and existing styling patterns first.

Only introduce Tailwind utilities where they genuinely simplify layout or utility styling.

---

# 010 — Visual Identity

## Decision

BookKaroYaar must have a premium SaaS visual identity.

The product should NOT resemble a generic beginner CRUD dashboard.

Primary visual direction:

- dark navy
- charcoal
- peach
- soft pink
- cream
- restrained white
- editorial imagery
- strong typography
- layered surfaces
- premium rounded cards
- smooth motion

Primary visual source:

`resources/design/BookKaroyar_UI_Design_Reference_v2.pdf`

---

# 011 — Product Positioning

## Decision

BookKaroYaar is not primarily a generic booking website.

It is a collaborative planning layer around group activities.

Core concept:

Plan together.
Book together.
Split effortlessly.

The product connects:

Group
→ Plan
→ Activity / Booking
→ Expense
→ Split
→ Settlement

---

# 012 — Groups

## Decision

Groups are a central domain concept.

A group can contain multiple members and multiple plans.

Minimum roles:

- OWNER
- ADMIN
- MEMBER

Exact permissions must follow the Groups specification.

---

# 013 — Shareable Invites

## Decision

Groups/plans can use shareable invite links.

Invite links should be treated as controlled access mechanisms.

# 014 — Nested Membership Discovery

## Decision

Keep the specified `members` subcollection name for both groups and plans, but restrict collection-group membership discovery to documents at the parent-group path depth.

## Reason

The product schema intentionally nests plan membership under plans. Without path-depth filtering, dashboard and group discovery queries would mistake plan participants for top-level group memberships.

Potential properties include:

- token/code
- creator
- target group or plan
- expiration
- revoked state

Security validation must happen server-side or through appropriate Firebase Security Rules/Cloud Functions.

---

# 014 — Expenses

## Decision

Expenses are first-class application entities.

Supported split types should include:

- Equal
- Percentage
- Custom

The application must calculate participant shares consistently and avoid floating-point inconsistencies where money calculations are involved.

---

# 015 — Settlement

## Decision

The application should calculate net balances and provide a simplified settlement view.

Settlement should make it clear:

- who owes whom
- amount
- settlement status
- outstanding amount

Any settlement algorithm must be deterministic and testable.

---

# 016 — Realtime Collaboration

## Decision

Realtime functionality should be used where it improves collaboration.

Examples:

- group membership
- expense changes
- polls
- activity feed
- notifications
- plan updates

Do not add realtime listeners to data that does not benefit from realtime behavior.

---

# 017 — Data Access Architecture

## Decision

UI components should not contain scattered raw Firestore operations.

Preferred flow:

Component
→ Hook
→ Service
→ Firebase

Example:

ExpenseForm
→ useExpenses()
→ expenseService.js
→ Firestore

---

# 018 — Responsive Design

## Decision

The application is designed for:

- mobile
- tablet
- desktop

Responsive behavior should be intentionally designed rather than simply shrinking desktop layouts.

Refer to the UI design reference.

---

# 019 — UX States

## Decision

Major user-facing operations must provide appropriate:

- loading
- empty
- error
- success
- disabled
- optimistic
- retry

states.

A feature is not considered complete merely because the happy-path CRUD operation works.

---

# 020 — Optimistic Updates

## Decision

Optimistic UI should be used selectively for low-risk interactions where immediate visual feedback improves UX.

Examples:

- voting
- toggling small UI state
- marking an item complete
- settling where the operation can safely be rolled back

The UI must handle failed operations correctly.

---

# 021 — Agent Continuity

## Decision

The project must remain understandable even if the coding agent changes.

Continuity must NOT depend on:

- chat history
- agent memory
- account/email
- a specific AI provider
- a specific coding session

The repository itself must contain enough information to resume development.

Continuity files:

- AGENTS.md
- DEVELOPMENT_STATE.md
- DECISIONS.md
- resources/product-spec/*
- resources/design/*

---

# 022 — Development Method

## Decision

Development will happen module-by-module.

Preferred sequence:

1. Foundation
2. Authentication
3. App shell
4. Dashboard
5. Groups
6. Invite links
7. Plans
8. Itinerary
9. Bookings
10. Expenses
11. Settlement
12. Polls
13. Activity / Notifications
14. Final responsive polish
15. Testing / deployment

Do not build random modules out of sequence without a clear dependency reason.

---

# 023 — Git Safety

## Decision

Stable milestones should be committed.

Example commit style:

feat(auth): implement firebase authentication

feat(groups): implement group creation and membership

feat(expenses): implement expense splitting

fix(invites): validate expired invite links

Do not commit `.env` or credentials.

---

# 024 — Documentation Rule

## Decision

Important architectural decisions must be recorded here.

If implementation requires a major deviation from this file, the agent must update this document before proceeding.

Never silently change the architecture.

---

# 025 — Current Project State

At the time this document was created:

- React + Vite is working
- JavaScript is being used
- Firebase SDK is installed
- Firebase Web App is configured
- Firebase Auth is enabled
- Firestore is created
- Firebase Auth connection has been smoke-tested
- Authentication UI has not yet been implemented

The next milestone is the Authentication module.

---

# Decision Change Procedure

If an existing decision needs to change:

1. Identify the decision number.
2. Explain why it needs to change.
3. Record the old decision.
4. Record the new decision.
5. Update affected specifications if necessary.
6. Update DEVELOPMENT_STATE.md.
7. Only then modify the implementation.

Do not silently override architecture decisions.