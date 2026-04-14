# Innings Blockchain

This project is built using a robust Next.js Monorepo architecture designed to handle campaigns, quizzes, and blockchain-based rewards securely and efficiently.

## Architecture Overview

The system is organized into several distinct layers within the monorepo: Frontend Apps, API Layer, Core Services, Database, and External Systems.

### Actors
* **Brand:** Interacts with the system to create and manage campaigns.
* **User:** Participates in quizzes, matches, and claims rewards.
* **Admin:** Oversees the platform, manages quizzes, and resolves issues.

### Apps (Frontend)
The frontend layer consists of three distinct web applications tailored for specific actors:
* **Brand Dashboard:** Interfaces with the Campaign Service and Auth Service.
* **User App:** Interfaces with the Reward Service, Auth Service, Quiz Service, and Match Service.
* **Admin Panel:** Interfaces with the Auth Service and Quiz Service.

### API Layer (Next.js API Routes)
The backend API exposes REST or GraphQL endpoints directly through Next.js API Routes:
* **Campaign Service:** Manages brand campaigns, interacts with the Brands Collection, and communicates with the Blockchain Service.
* **Reward Service:** Handles logic for claiming and distributing rewards, updating the Rewards Collection.
* **Auth Service:** Manages authentication, authorization, and data in the Users Collection.
* **Quiz Service:** Requests content from the AI Quiz Generator and handles the Quizzes Collection and Answers Collection.
* **Match Service:** Manages match-related logic, updates the Matches Collection, and sends data to the Blockchain Service.

### Core Services
Internal microservices and listeners driving specialized operations:
* **AI Quiz Generator:** Generates dynamic, automated quiz content on demand from the Quiz Service.
* **Blockchain Service:** The central node for on-chain interactions. Handles transactions and writes to the Transactions Collection and Rewards Collection, while communicating with the Blockchain Network.
* **Oracle Listener:** Listens to real-world data via Chainlink/Oracle APIs and supplies verified data to the Blockchain Service.

### Database (MongoDB)
Our NoSQL data persistence layer uses MongoDB, organized into specific collections:
* **Brands Collection**
* **Quizzes Collection**
* **Answers Collection**
* **Matches Collection**
* **Transactions Collection**
* **Rewards Collection**
* **Users Collection**

### External Systems
* **Blockchain Network:** The target network (e.g., Ethereum, Polygon) for on-chain settlement and smart contracts.
* **Chainlink / Oracle API:** External oracle providing off-chain data feeds to the Oracle Listener.