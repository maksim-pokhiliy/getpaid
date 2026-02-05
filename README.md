# Invox - Invoice Management MVP

A SaaS MVP for invoice management: create, send, track, and get paid.

## Features

- User authentication (sign up, sign in)
- Sender profile onboarding
- Client management
- Invoice creation with line items
- Send invoices via email
- Public invoice viewing
- View tracking (when client opens invoice)
- Automated follow-up reminders
- Manual payment recording (bank transfer, cash, etc.)
- Partial payment support
- Light/dark theme

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** MUI (Material UI)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth (Auth.js)
- **Forms:** React Hook Form + Zod validation
- **Data Fetching:** React Query
- **Email:** Resend

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL database
- Resend account (for email)

## Setup

### 1. Clone and install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/invox"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="re_your_api_key"
EMAIL_FROM="invoices@yourdomain.com"
APP_URL="http://localhost:3000"
```

### 3. Setup database

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Or push schema directly (dev)
pnpm db:push
```

### 4. Start development server

```bash
pnpm dev
```

Visit http://localhost:3000

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm followups:run` | Process pending follow-up jobs |

## Running Follow-ups

The follow-up system sends reminder emails for unpaid invoices. Run the script manually or set up a cron job:

```bash
# Run once
pnpm followups:run

# Cron example (every hour)
0 * * * * cd /path/to/invox && pnpm followups:run
```

## Project Structure

```
src/
├── app/                    # Next.js routes and pages
│   ├── api/               # API route handlers
│   ├── app/               # Authenticated app pages
│   ├── auth/              # Auth pages (sign-in, sign-up)
│   └── i/[publicId]/      # Public invoice page
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   └── theme/            # Theme configuration
├── server/               # Server-side code
│   ├── auth/             # Auth configuration
│   ├── clients/          # Client service
│   ├── db/               # Prisma client
│   ├── email/            # Email service
│   ├── followups/        # Follow-up service
│   ├── invoices/         # Invoice service
│   └── sender-profile/   # Sender profile service
└── shared/               # Shared code
    └── schemas/          # Zod validation schemas
```

## Architecture Rules

- UI components never import Prisma directly
- Route handlers call server services only
- React Query hooks call API endpoints
- All inputs validated with Zod schemas
- Public pages use `publicId`, never internal `id`

## License

Private - All rights reserved
