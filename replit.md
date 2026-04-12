# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Gold Palace Jewelry (`artifacts/gold-palace`)
- **Type**: react-vite (presentation-first, no backend)
- **Preview path**: `/`
- **Description**: Luxury Indian gold and diamond jewelry e-commerce website
- **Features**:
  - Hero section with promotional banner (full-bleed luxury photography)
  - Product category navigation (Rings, Earrings, Mangalsutra, Necklace, Bracelet, Chain, Pendant)
  - New Arrivals product grid (22K gold items)
  - Trending Diamonds sale grid (with original + discounted prices)
  - Trust badges (Heritage, Craftsmanship, Authenticity)
  - Newsletter signup
  - Social media footer
  - Fixed navbar with scroll effect
  - Framer Motion animations
- **Fonts**: Playfair Display (serif headings) + Lato (body)
- **Color palette**: Deep warm gold, cream ivory backgrounds, rich charcoal text
