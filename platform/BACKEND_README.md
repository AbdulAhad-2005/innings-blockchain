# Innings Blockchain Platform — Backend README

This document describes all logical flows implemented in the backend API and the routes used to execute them. All protected routes require a `Authorization: Bearer <token>` header unless stated otherwise.

---

## 🔑 Authentication Flow

All users (Admin, Brand, Customer) share a unified auth API. The `role` field in each request determines which user collection is used.

### 1. Register
**`POST /api/auth/register`**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "customer",
  "walletAddress": "0xABC123"
}
```
- `role`: `"admin"` | `"customer"` | `"brand"`
- `walletAddress` is required when `role` is `"customer"`

### 2. Login
**`POST /api/auth/login`**
```json
{
  "email": "john@example.com",
  "password": "secret123",
  "role": "customer"
}
```
Returns a JWT token (7-day expiry). Use this token in all subsequent requests as:
```
Authorization: Bearer <token>
```

### 3. Get Current User Profile
**`GET /api/auth/me`** _(any authenticated user)_

### 4. Logout
**`POST /api/auth/logout`**
Stateless. The client should discard the JWT token.

---

## 🏏 Match & Team Management _(Admin only)_

### Teams

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/admin/teams` | List all teams |
| `POST` | `/api/admin/teams` | Register a new team |
| `GET` | `/api/admin/teams/:id` | Get team details |
| `PUT` | `/api/admin/teams/:id` | Update team details |
| `DELETE` | `/api/admin/teams/:id` | Delete a team |

**Create Team Body:**
```json
{
  "name": "Mumbai Indians",
  "abbreviation": "MI",
  "logoUrl": "/uploads/teams/mi.png",
  "description": "..."
}
```
> `abbreviation` must be unique and is stored in uppercase.

### Matches

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/admin/matches` | List all matches (with team details populated) |
| `POST` | `/api/admin/matches` | Create a match (overlap validation applied) |
| `GET` | `/api/admin/matches/:id` | Get match details |
| `PUT` | `/api/admin/matches/:id` | Update match |
| `DELETE` | `/api/admin/matches/:id` | Delete a match |

**Create Match Body:**
```json
{
  "teamA": "<Team ObjectId>",
  "teamB": "<Team ObjectId>",
  "startTime": "2026-05-20T19:00:00Z",
  "endTime": "2026-05-20T23:00:00Z"
}
```
> The system prevents scheduling the same team in overlapping time windows (±4 hours). `endTime` is used to determine quiz availability windows.

---

## 🎁 Rewards Flow

### Creating and Managing Rewards _(Brand or Admin)_

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/rewards` | List all rewards (supports `?mine=true` filter) |
| `POST` | `/api/rewards` | Create a reward (multipart/form-data with image) |
| `GET` | `/api/rewards/:id` | Get reward details |
| `PUT` | `/api/rewards/:id` | Update reward (creator or admin only) |
| `DELETE` | `/api/rewards/:id` | Delete reward and image (creator or admin only) |

**Create Reward Form Fields (`multipart/form-data`):**
```
points       → (integer, min 1)
startDate    → ISO datetime string
expirationDate → ISO datetime string
description  → string (optional)
image        → file upload
```
> Images are stored in `public/uploads/rewards/` with a SHA-256 based hashed filename. All URLs returned by the API are absolute (`BACKEND_URL` prefixed).

**Filtering:**
- `GET /api/rewards?mine=true` — Returns only rewards created by the current user (Brands/Admins only).

---

## 🧠 Quiz Bidding & Participation Flow

### Complete Lifecycle

```
Brand submits bid
       ↓
Admin approves or rejects
       ↓
Brand uploads ads + adds questions (only after approval)
       ↓
Match ends → 1-hour quiz window opens
       ↓
Customers submit answers
       ↓
Correct answer → +1 credit awarded
       ↓
Customer redeems credits for a reward
```

---

### Step 1: Brand Submits a Quiz Bid

**`POST /api/brands/quizzes`** _(Brand only)_
```json
{
  "matchId": "<Match ObjectId>",
  "budget": 5000,
  "startTime": "2026-05-20T23:00:00Z",
  "endTime": "2026-05-21T00:00:00Z"
}
```
> Bid starts in `bid_pending` status.

**`GET /api/brands/quizzes`** _(Brand only)_
Lists all bids submitted by the authenticated brand.

---

### Step 2: Admin Approves or Rejects

**`PATCH /api/admin/quizzes/:id/status`** _(Admin only)_
```json
{
  "status": "approved"
}
```
> `status` can be `"approved"` or `"rejected"`.

---

### Step 3: Brand Uploads Ad Images & Questions (post-approval only)

**Upload Ads:**
**`POST /api/brands/quizzes/:id/ads`** _(Brand only, multipart/form-data)_
- Field name: `images` (supports multiple, max 10)
- Files stored in `public/uploads/ads/`

**Add Questions:**

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/brands/quizzes/:id/questions` | List questions for own quiz |
| `POST` | `/api/brands/quizzes/:id/questions` | Add a question |

**Question Body:**
```json
{
  "questionText": "Which team scored the most runs?",
  "correctAnswer": "Mumbai Indians"
}
```

---

### Step 4: Admin Question Management

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/admin/questions/:id` | List questions for any quiz |
| `PUT` | `/api/admin/questions/:id` | Update any question |
| `DELETE` | `/api/admin/questions/:id` | Delete any question |

---

### Step 5: Public Quiz Discovery

**`GET /api/public/quizzes`** _(No auth required)_
Returns all approved quizzes across all brands.

---

### Step 6: Customer Submits an Answer

**`POST /api/customer/quizzes/questions/:id/answer`** _(Customer only)_
```json
{
  "answer": "Mumbai Indians"
}
```

**Rules:**
- A customer can only attempt each question **once** (enforced at the database level).
- The quiz is only accessible **within 1 hour of `match.endTime`**. Submissions outside this window are rejected.
- Answers are compared using **semantic similarity** (`string-similarity` library, Dice coefficient algorithm) with an **85% threshold**.
- A correct answer awards **+1 point** to the customer's account.

**Response:**
```json
{
  "isCorrect": true,
  "similarity": 0.94
}
```

---

### Step 7: Customer Redeems Points for a Reward

**`POST /api/customer/rewards/:id/redeem`** _(Customer only)_

**Rules:**
- Customer must have **points ≥ reward's required points**.
- Points are **atomically deducted** upon redemption.
- A `RewardRedemption` record is created to track the history.

---

## 🖼️ Image Handling

| Upload Type | Storage Path | URL Format |
|---|---|---|
| Reward images | `public/uploads/rewards/` | `{BACKEND_URL}/uploads/rewards/<hash>.ext` |
| Team logos | `public/uploads/teams/` | `{BACKEND_URL}/uploads/teams/<hash>.ext` |
| Quiz ad images | `public/uploads/ads/` | `{BACKEND_URL}/uploads/ads/<hash>.ext` |

- **Database**: Only relative paths (e.g., `/uploads/rewards/abc123.png`) are stored.
- **API Responses**: All image URLs are prefixed with `BACKEND_URL` before being returned to the frontend.
- **File Cleanup**: Image files are automatically deleted from disk when a reward is deleted or its image is replaced.

---

## 🛡️ Role-Based Access Control Summary

| Endpoint Group | Admin | Brand | Customer | Public |
|---|:---:|:---:|:---:|:---:|
| Auth (`/api/auth/*`) | ✅ | ✅ | ✅ | ✅ |
| Match & Team management | ✅ | ❌ | ❌ | ❌ |
| Create/manage rewards | ✅ | ✅ | ❌ | ❌ |
| Read rewards | ✅ | ✅ | ✅ | ❌ |
| Submit quiz bids | ❌ | ✅ | ❌ | ❌ |
| Approve/reject bids | ✅ | ❌ | ❌ | ❌ |
| Manage own quiz content | ❌ | ✅ | ❌ | ❌ |
| Manage all quiz content | ✅ | ❌ | ❌ | ❌ |
| Browse public quizzes | ❌ | ❌ | ❌ | ✅ |
| Answer quiz questions | ❌ | ❌ | ✅ | ❌ |
| Redeem rewards | ❌ | ❌ | ✅ | ❌ |

---

## ⚙️ Environment Variables

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017/innings` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `my-super-secret-key` |
| `BACKEND_URL` | Base URL of the running API server | `http://localhost:3000` |

---

## 📖 Interactive API Docs

The full API is documented via Swagger UI and is accessible at:
```
http://localhost:3000/docs
```
After logging in, use the **Authorize** button to paste your JWT token and test all protected routes directly from the browser.
