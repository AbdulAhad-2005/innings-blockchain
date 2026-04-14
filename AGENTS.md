# AI Agent Context & Guidelines for Innings Blockchain

Hello fellow AI Agent! This file contains critical project-wide context, architectural constraints, and coding standards specifically tailored for this repository. Please read this thoroughly before generating code or modifying the project structure.

## 1. Project Overview & Architecture
**Innings Blockchain** a web3-enabled platform managing campaigns, quizzes, and blockchain-based rewards.

### Core Stack Requirements:
- **Frontend / API:** Next.js 16+, React 19, TypeScript, Tailwind CSS v4.
- **Backend / Database:** Next.js API Routes (REST/GraphQL), MongoDB (Mongoose).
- **Blockchain / Smart Contracts:** Solidity, Truffle (contracts live in the `truffle/` folder).

### Applications / Frontend Rules
We are operating a Next.js Monorepo structure containing three primary frontends:
1. **User App:** For end-users to take quizzes, watch matches, and claim rewards. Must feel Gamified and Premium.
2. **Brand Dashboard:** For brands to manage campaigns. Needs a clean, data-rich SaaS layout.
3. **Admin Panel:** For system administrators.

**Agent Action Items for UI:**
- Prioritize visual excellence. Web3 user schemas require dynamic styling, dark modes, gradients, and micro-animations. Avoid basic generic styling.
- Ensure responsive layouts and strict usage of Tailwind CSS v4 conventions (`@tailwindcss/postcss`).

### Backend Services & API Flow
The application logic is split into key Next.js API route services:
- `Auth Service`: Users Collection.
- `Campaign Service`: Brands Collection. Communicates with Blockchain Service.
- `Quiz Service`: Quizzes/Answers Collections. Hooks into the AI Quiz Generator.
- `Reward Service`: Rewards Collection.
- `Match Service`: Matches Collection.
- **Internal Workers:** `Oracle Listener` (Chainlink data) and `Blockchain Service` (transactions).

## 2. Codebase Structure
- `/platform`: Holds the Next.js web application code. If restructuring for a strict monorepo (e.g. Turborepo), place respective apps inside `platform/apps/` and shared packages inside `platform/packages/`.
- `/truffle`: Holds all Solidity smart contracts, migrations, and blockchain boilerplate.

## 3. Strict Coding Conventions for Agents

### Next.js & React
- *CRITICAL:* We are using the **App Router** (`app/` directory). Do not use the `pages/` directory unless strictly migrating old components.
- Rely on React 19 patterns.
- Do not assume `next/dist/docs/` has all the answers, but reference modern documentation before implementing esoteric features.
- Keep Client Components (`"use client"`) as deep in the tree as possible. Default to Server Components.

### TypeScript
- Enforce strict typing. Do not default to `any` or `// @ts-ignore`.
- Define robust interfaces for MongoDB Models and API response data.
- Organize types into easily importable files or a shared `packages/types` structure.

### Blockchain integration (Web3)
- Use standard libraries like `ethers.js` or `viem` for client interactions.
- Smart Contracts must use correct standard templates (OpenZeppelin) where applicable, to prioritize security when handling user rewards or transactions. 
- Ensure all environment variables handling private keys or RPC URLs are correctly parsed and never committed into the repository.

## 4. Final Reminders
- Always review the root `README.md` for architecture visualization.
- Use atomic commits and keep components completely reusable.
- If unsure about design styles or application structure, ASK the user first before generating large monolithic components.
