# Innings Blockchain Developer Handoff

Last updated: 2026-04-15

## 1) Directory and Redundancy Decision

### platform/app vs platform/apps
- `platform/app` is NOT redundant.
- `platform/apps` is NOT redundant.

Reason:
- `platform/app/api/**` is the shared backend route source.
- `platform/apps/user/app/api/**` contains wrapper routes that re-export handlers from `@platform/app/api/**`.
- If `platform/app` is removed, user app API wrappers break.
- `platform/apps/*` are the three runnable frontends (`user`, `brand`, `admin`).

### Redundant directory removed
- Removed duplicate Swagger UI page:
  - deleted `platform/app/api-docs/page.tsx`
- Kept canonical docs page:
  - `platform/app/docs/page.tsx` (serves Swagger UI for `/api/docs`)

## 2) What Is Done

### Integration architecture
- User app is now the primary runtime host for backend APIs via wrapper routes.
- Brand and Admin apps are frontend-only runtimes that proxy `/api/*` requests to backend host.
- Default expected local ports:
  - User app: 3000
  - Brand app: 3001
  - Admin app: 3002

### Backend/API work completed
- Added and/or fixed key endpoints used by UI:
  - `GET /api/public/matches`
  - `GET /api/public/quizzes`
  - `GET /api/public/quizzes/[id]/questions`
  - `GET /api/admin/brands`
  - `GET /api/admin/customers`
  - `GET /api/admin/campaigns`
  - `GET/POST /api/brands/campaigns`
  - `PATCH /api/brands/campaigns/[id]/status`
  - Reward and auth endpoints exposed through user app wrappers
- Removed invalid extra export from `platform/app/api/public/quizzes/route.ts`.

### Frontend integration completed
- User app pages wired to APIs and auth token flow:
  - login/signup/profile/matches/quizzes/rewards/dashboard
- Brand app:
  - login/signup/dashboard/campaigns wired to backend APIs
  - route-link fixes applied for App Router route groups
  - API client + token helper implemented
- Admin app:
  - login/dashboard/users/brands/campaigns wired to backend APIs
  - route-link fixes applied for App Router route groups
  - API client + token helper implemented

### Configuration and quality completed
- Workspace scripts normalized in `platform/package.json`:
  - `dev`, `dev:user`, `dev:brand`, `dev:admin`
  - `build:user`, `build:brand`, `build:admin`
  - `lint:user`, `lint:brand`, `lint:admin`
- Fixed strict TypeScript/lint issues in app pages and shared UI components.
- Fixed deprecated tsconfig option in brand/admin apps (`baseUrl` removal).
- Cleaned `.gitignore` noise and corrected uploads ignore path to `platform/public/uploads`.

### Validation status
- Lint passes:
  - `npm run lint:user`
  - `npm run lint:brand`
  - `npm run lint:admin`
- Build passes:
  - `npm run build:user`
  - `npm run build:brand`
  - `npm run build:admin`
- Current editor diagnostics: no errors.

## 3) API Surface (Active Through User App)

Current wrapper-exposed routes under `platform/apps/user/app/api/**` include:

### Auth
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/me`
- `/api/auth/register`

### Public
- `/api/public/matches`
- `/api/public/quizzes`
- `/api/public/quizzes/[id]/questions`

### Rewards and customer actions
- `/api/rewards`
- `/api/rewards/[id]`
- `/api/rewards/redeem`
- `/api/rewards/win`
- `/api/customer/quizzes/questions/[id]/answer`
- `/api/customer/rewards/[id]/redeem`

### Brand
- `/api/brands/campaigns`
- `/api/brands/campaigns/[id]/status`
- `/api/brands/[id]/badge`
- `/api/brands/quizzes`
- `/api/brands/quizzes/[id]/ads`
- `/api/brands/quizzes/[id]/questions`

### Admin
- `/api/admin/brands`
- `/api/admin/brands/[id]/verify`
- `/api/admin/customers`
- `/api/admin/campaigns`
- `/api/admin/matches`
- `/api/admin/matches/[id]`
- `/api/admin/teams`
- `/api/admin/teams/[id]`
- `/api/admin/questions/[id]`
- `/api/admin/quizzes/[id]/status`

### Docs
- `/api/docs`
- Swagger UI page at `/docs`

## 4) Frontend Page Status Matrix

### User app (`platform/apps/user`)
- Integrated and data-backed:
  - `/login`, `/signup`, `/profile`, `/matches`, `/quizzes`, `/rewards`, `/app`
- Remaining UX/feature work:
  - richer empty/error states, pagination/filtering, auth refresh logic hardening.

### Brand app (`platform/apps/brand`)
- Integrated and data-backed:
  - `/login`, `/signup`, `/` (dashboard), `/campaigns`
- Mostly static/mock UI (needs backend wiring):
  - `/analytics`, `/rewards`, `/settings`
- Action buttons currently UI-only in places (for example approve/process/edit flows).

### Admin app (`platform/apps/admin`)
- Integrated and data-backed:
  - `/login`, `/dashboard`, `/users`, `/brands`, `/campaigns`
- Mostly static/mock UI (needs backend wiring):
  - `/settings`
- Moderation actions (buttons) need mutation endpoints and optimistic updates.

## 5) Truffle + Blockchain Status

## Contracts in `truffle/contracts`
- `RewardProof.sol`
- `RewardAuthenticitySBT.sol`
- `BrandCommitmentProof.sol`
- `BrandVerificationBadge.sol`

### Truffle config summary
- File: `truffle/truffle-config.js`
- Network: `wirefluid`
- Default RPC: `https://evm.wirefluid.com`
- Default chain id: `92533`
- Signer keys expected from env:
  - `WIREFLUID_PRIVATE_KEY` or `WIREFLUID_PRIVATE_KEYS`

### Backend on-chain service wiring
- File: `platform/services/blockchainService.ts`
- Uses ethers + env-driven contract addresses:
  - `REWARD_PROOF_ADDRESS`
  - `REWARD_SBT_ADDRESS`
  - `BRAND_COMMITMENT_ADDRESS`
  - `BRAND_VERIFICATION_BADGE_ADDRESS`
- Signing key resolution order:
  - `BACKEND_SIGNER_PRIVATE_KEY`
  - fallback `WIREFLUID_PRIVATE_KEY`
  - fallback first key from `WIREFLUID_PRIVATE_KEYS`
- Chain safety check enforced via `WIREFLUID_CHAIN_ID`.

### Brand verification flow
- File: `platform/services/brandVerificationService.ts`
- Issuing and revoking verification badges updates:
  - on-chain state
  - Mongo brand fields
  - transaction ledger records

### Campaign commitment flow
- File: `platform/services/campaignService.ts`
- Campaign creation:
  - validates brand/match/budget/time
  - computes metadata hash
  - writes commitment on-chain
  - persists quiz campaign linkage (`blockchainCampaignId`, tx hash, proof address)
- Campaign status updates:
  - complete/cancel on-chain
  - cancel path refunds brand balance in DB

## 6) Doppler Notes

You confirmed truffle variables were added in Doppler.

Recommended minimum Doppler keys for end-to-end chain operations:
- `WIREFLUID_RPC_URL`
- `WIREFLUID_CHAIN_ID`
- `WIREFLUID_PRIVATE_KEY` (or `WIREFLUID_PRIVATE_KEYS`)
- `BACKEND_SIGNER_PRIVATE_KEY` (preferred explicit backend signer)
- `REWARD_PROOF_ADDRESS`
- `REWARD_SBT_ADDRESS`
- `BRAND_COMMITMENT_ADDRESS`
- `BRAND_VERIFICATION_BADGE_ADDRESS`
- `MONGODB_URL`
- `JWT_SECRET`
- `BACKEND_URL`

For truffle deployment role overrides (optional but recommended):
- `CONTRACT_ADMIN_ADDRESS`
- `REWARD_PROOF_RECORDER`
- `REWARD_NFT_MINTER`
- `CAMPAIGN_MANAGER`
- `BRAND_VERIFIER`

## 7) Remaining Work (Priority Order)

1. Complete brand app backend integration for static pages:
- `/analytics`
- `/rewards`
- `/settings`

2. Complete admin settings backend integration:
- persist platform config and health checks from real services.

3. Implement mutation endpoints + UI actions:
- admin moderate campaign
- admin approve/revoke brand from UI actions
- brand reward claim processing actions

4. Add stronger integration tests:
- auth role-based endpoint access
- campaign lifecycle (create -> complete/cancel)
- reward win + redeem + optional NFT mint paths

5. Final cleanup before merge:
- split large changes into logical commits (api, frontend wiring, blockchain, docs)
- ensure generated/noise files are excluded from commit if not intended.

## 8) Suggested Runbook for Devs

From `platform/`:
- `npm install`
- `npm run dev:user`
- `npm run dev:brand`
- `npm run dev:admin`

From `truffle/`:
- `npm install`
- `npm run compile`
- `npm test`
- `npm run migrate:wirefluid:reset` (only when env is set and deployment is intended)

Swagger:
- open `http://localhost:3000/docs`

---
If you are picking this up next, start with section 7 item 1 and wire brand rewards page to real reward/claim endpoints first.
