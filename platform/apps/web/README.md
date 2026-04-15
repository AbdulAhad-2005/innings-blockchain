# Innings Web Platform

The unified Next.js frontend for the Innings Blockchain platform. This single app serves three user roles: Customers, Brands, and Admins.

## Architecture

### Role-Based Routing

```
/                    → Landing page (public)
/login               → Unified login (select role)
/signup              → Unified signup (select role)
/user/*              → Customer dashboard (matches, quizzes, rewards, profile)
/brand/*             → Brand dashboard (campaigns, analytics, rewards, settings)
/admin/*             → Admin panel (users, brands, campaigns, settings)
```

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (neobrutalism themed)
- **Animations**: Framer Motion + AutoAnimate
- **Database**: MongoDB with Mongoose

### Design System: Neobrutalism

- **Colors**: Green `#00B852` (primary), Yellow `#FFD700` (accent), Blue `#0066FF` (secondary)
- **Typography**: Space Grotesk (display), Inter (body)
- **Style**: Bold 3px black borders, 4px offset shadows, sharp corners

## Getting Started

1. **Install dependencies**:
   ```bash
   cd platform
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   # Edit .env.local with your MongoDB URI and JWT secret
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

## Project Structure

```
apps/web/
├── app/
│   ├── (app)/            # Protected dashboard routes
│   │   ├── user/         # Customer dashboard
│   │   ├── brand/        # Brand dashboard
│   │   └── admin/        # Admin panel
│   ├── (auth)/           # Auth pages
│   ├── api/              # API routes
│   └── models/           # Mongoose models
├── components/
│   ├── animations/       # Animation components
│   └── ui/               # shadcn components
├── lib/                  # Utilities
└── styles/               # Global styles
```

## Key Components

### Animation Components (`components/animations/`)
- `FadeIn` - Fade + translate animation
- `SlideUp` - Slide up reveal
- `StaggerChildren` - Staggered children animation
- `AnimatedContainer` - Auto-animate for lists
- `ParallaxHero` - Scroll-linked parallax

### Neo Components (`components/ui/`)
All shadcn components styled with neobrutalism:
- `neo-card` - Card with offset shadow
- `neo-btn` - Button with press effect
- `neo-input` - Input with focus ring
- `neo-badge` - Badge with border

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` or `MONGODB_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT tokens |
| `BLOCKCHAIN_RPC_URL` | Blockchain RPC (optional) |
| `CONTRACT_ADDRESS` | Smart contract (optional) |

## API Routes

### Public
- `GET /api/public/matches` - List matches
- `GET /api/public/quizzes` - List quizzes

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

## License

MIT
