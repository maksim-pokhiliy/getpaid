# CLAUDE.md - Development Guidelines for Invox

This file provides guidance for Claude Code when working on the Invox project.

## Project Overview

Invox is an invoice management MVP built with Next.js, MUI, Prisma, and NextAuth.

## Architecture Rules (DO NOT BREAK)

### Layer Boundaries

1. **UI Layer** (`/src/app`, `/src/components`)
   - NEVER import Prisma directly
   - NEVER contain business logic
   - Call API endpoints via React Query
   - Use Zod schemas from `/src/shared/schemas`

2. **API Layer** (`/src/app/api/*`)
   - Route handlers only
   - Call server services for business logic
   - Validate inputs with Zod schemas
   - Use `requireUser()` for authenticated endpoints
   - Return standardized error format: `{ error: { code, message } }`

3. **Service Layer** (`/src/server/*`)
   - Business logic lives here
   - Direct Prisma access allowed
   - Services are organized by domain (invoices, clients, etc.)

4. **Shared Layer** (`/src/shared/*`)
   - Zod schemas (single source of truth for validation)
   - Shared types
   - Utility functions

### Authentication

- Always use NextAuth (Auth.js)
- Protected routes must call `requireUser()`
- Session user includes `id` and `email`
- JWT strategy with database user lookup

### Public vs Internal IDs

- Public pages use `publicId` (nanoid)
- NEVER expose internal `id` to public URLs
- Internal routes can use `id`

## Common Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm typecheck    # TypeScript checking
pnpm format       # Format with Prettier
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Prisma Studio
pnpm followups:run # Run follow-up jobs
```

## File Conventions

- Server code: `/src/server/{domain}/index.ts`
- API routes: `/src/app/api/{resource}/route.ts`
- Pages: `/src/app/{path}/page.tsx`
- Schemas: `/src/shared/schemas/{domain}.ts`

## Code Style

- Use TypeScript strict mode
- Prefer named exports
- Use Zod for all validation
- Handle errors explicitly
- Use early returns for error cases

## Testing API Endpoints

When testing locally, you can use curl:

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get invoices (authenticated)
curl http://localhost:3000/api/invoices \
  -H "Cookie: <session-cookie>"
```

## Database Operations

```bash
# View database
pnpm db:studio

# Reset database (dev only)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name <name>
```

## Adding New Features

1. Define Zod schema in `/src/shared/schemas/`
2. Create service in `/src/server/{domain}/`
3. Add API route in `/src/app/api/`
4. Build UI component
5. Connect with React Query

## Invoice Status Flow

```
DRAFT -> SENT (on send)
SENT -> VIEWED (on first view)
VIEWED/SENT -> OVERDUE (computed if dueDate < now)
Any -> PAID (via Stripe webhook or manual)
```

## Error Handling

API responses follow this format:

```typescript
// Success
{ data: {...} }

// Error
{
  error: {
    code: "ERROR_CODE",
    message: "Human readable message"
  }
}
```

Common error codes:
- `VALIDATION_ERROR` - Invalid input
- `UNAUTHORIZED` - Not authenticated
- `NOT_FOUND` - Resource not found
- `INTERNAL_ERROR` - Server error
