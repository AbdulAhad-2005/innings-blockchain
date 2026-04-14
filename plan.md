# Continuation Plan (Next Session)

## Goal
Move from branded skeleton to production-quality user app using shadcn-heavy composition, while keeping user flows blockchain-agnostic.

## Phase 1: Stabilize Repo State (Quick)
1. Decide whether to keep or clean generated artifacts before committing:
   - `platform/apps/user/.next/`
2. Confirm `.gitignore` covers build artifacts and local tooling folders.
3. Run:
   - `npm run lint:user`
   - `npm run build:user`

## Phase 2: Initialize shadcn in `apps/user`
1. Run in `platform/apps/user`:
   - `npx shadcn@latest init -d --base radix`
2. Confirm generated:
   - `components.json`
   - `lib/utils.ts`
   - `components/ui/*` base structure
3. Keep aliases aligned with current app (`@/*`).

## Phase 3: Pull Premium shadcn Blocks/Components
1. Install starter blocks:
   - `npx shadcn@latest add @shadcn/login-04 @shadcn/sidebar-04 @shadcn/dashboard-01`
2. Add required primitives for deeper UI:
   - `button`, `card`, `input`, `badge`, `tabs`, `dialog`, `drawer`, `sheet`, `dropdown-menu`, `table`, `skeleton`, `progress`, `tooltip`
3. Replace temporary handcrafted sections page-by-page with adapted shadcn components.

## Phase 4: Product Screen Refinement (User App)
1. `/(auth)`:
   - Production auth forms, validation, errors, loading states.
2. `/app`:
   - Real dashboard cards + activity timeline.
3. `/matches`:
   - Featured/live/upcoming sections, responsive cards.
4. `/quizzes`:
   - Quiz list + round detail shell, timer visual patterns.
5. `/rewards`:
   - Progress tiers, claims status timeline, history table.
6. `/profile`:
   - Profile settings, preferences, activity summary.

## Phase 5: Backend Contract Integration
1. Align route-by-route API contract with backend developer:
   - auth endpoints
   - matches feed
   - quizzes and submissions
   - rewards status/history
2. Add typed API client layer (`types` + `fetch` wrappers).
3. Add optimistic/loading/error states consistently.

## Phase 6: Quality & UX Finish
1. Accessibility pass:
   - keyboard nav
   - visible focus states
   - ARIA labels
2. Performance pass:
   - image strategy
   - route-level skeletons
3. Final polish:
   - animation timing consistency
   - typography rhythm
   - mobile layout stress test

## Open Decisions Needed Later
1. Final color token map approval from logo palette.
2. Final copy tone and microcopy style.
3. Post-login landing preference (home vs matches vs quizzes).
4. Which features are MVP vs phase-2.

---

# Frontend Scope (From Repo Docs)

## 1. User App
- Landing / onboarding
- Auth flow
- Match discovery / live or upcoming match views
- Quiz participation flow
- Rewards / claim flow
- Wallet connection and transaction states
- Profile, history, reward status
- Premium, gamified UI system

## 2. Brand Dashboard
- Brand auth
- Campaign list / create / edit / detail screens
- Quiz assignment or campaign-linked engagement setup
- Reward/campaign analytics
- Transaction / distribution status
- Clean SaaS dashboard layout

## 3. Admin Panel
- Admin auth
- User / brand / campaign oversight
- Quiz moderation / management
- Reward issue resolution
- Match / system monitoring surfaces

## 4. Shared Frontend Foundation
- App architecture: decide whether to keep one app or split into platform/apps/...
- Shared UI kit and design tokens
- Navigation patterns for all 3 products
- API client layer
- Auth/session handling
- Wallet integration strategy
- Error/loading/empty states
- Mobile responsiveness
- Accessibility baseline
- Testing setup for frontend
- Real metadata, branding, assets, favicon, fonts

---

# Decisions Needed Before Frontend Implementation

## 1. Structure
- One Next app with route groups for all roles
- Proper monorepo split into 3 apps inside platform/apps/

## 2. First App Priority
- User App
- Brand Dashboard
- Admin Panel

## 3. Designs Available?
- Figma
- Wireframes
- Screenshots
- Brand guidelines

## 4. Auth Model
- Email/password
- OTP
- Social login
- Wallet-first
- Role-based access rules

## 5. Wallet/Web3 Requirements
- ethers or viem
- Target chain
- Supported wallets
- What actions are actually on-chain

## 6. Backend Contract
- Existing API routes/specs
- Response shapes
- Auth/session format

## 7. Product Priorities
- MVP screens needed first
- Deadlines
- Which flows must be demo-ready earliest
