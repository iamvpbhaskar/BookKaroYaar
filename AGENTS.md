# BookKaroYaar Development Rules

## Stack

- React.js
- JavaScript only
- Vite
- Firebase
- Firestore
- Firebase Authentication
- Firebase Storage
- Firebase Cloud Functions
- Material UI (MUI)
- Tailwind CSS utilities where useful

## Hard restrictions

- DO NOT use TypeScript.
- DO NOT use Next.js.
- DO NOT introduce another UI library without explicit approval.
- DO NOT create arbitrary product behavior not defined in resources.
- DO NOT redesign the product independently.

## Source of truth

Functional requirements:
resources/product-spec/

Visual requirements:
resources/design/

Architecture:
resources/product-spec/00-master-architecture.pdf

Design:
resources/design/BookKaroyar_UI_Design_Reference_v2.pdf

## Product principle

Plan together.
Book together.
Split effortlessly.

The application is a collaborative planning layer around
trips, movies, dinners, activities, bookings and shared expenses.

## Before implementing a feature

1. Read the relevant product-spec PDF.
2. Read relevant UI design reference sections.
3. Follow existing architecture.
4. Reuse existing components and services.
5. Do not invent new patterns unless necessary.

## UI rules

Avoid:
- generic blue SaaS dashboards
- excessive white cards
- giant empty whitespace
- random gradients
- inconsistent border radius
- unrelated colors

Prefer:
- dark navy foundation
- warm peach accents
- editorial imagery
- strong typography
- layered surfaces
- contextual cards
- smooth interactions
- responsive behavior