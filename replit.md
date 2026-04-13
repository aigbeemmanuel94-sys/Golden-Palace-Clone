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
- **Auth**: express-session + bcryptjs (server-side sessions, stored in PostgreSQL)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Artifacts

### Gold Palace Jewelry (`artifacts/gold-palace`)
- **Type**: react-vite (full-stack with backend)
- **Preview path**: `/`
- **API path**: `/api`
- **Description**: Luxury Indian gold and diamond jewelry e-commerce website

### Features
- Full user authentication (register with email/password, login, logout)
- Email addresses stored securely in PostgreSQL (bcrypt hashed passwords)
- Product listings from DB (new arrivals + trending with sale prices)
- Category navigation (Rings, Earrings, Mangalsutra, Necklace, Bracelet, Chain, Pendant)
- Cart system (add/update/remove items, per user)
- Newsletter subscription (stored email addresses)
- Session-based auth (30-day cookies)

### Pages
- `/` — Home (hero, categories, new arrivals, trending, trust badges, newsletter)
- `/login` — Login form
- `/register` — Register form (first name, last name, email, password)
- `/account` — My Account (profile edit, order history, wishlist, settings tabs)
- `/category/:slug` — Category product grid (rings, earrings, mangalsutra, necklace, bracelet, chain, pendant)
- `/about` — Our Story heritage page
- `/craftsmanship` — Master Craftsmanship page (6-step atelier process)
- `/contact`, `/shipping`, `/faq`, `/size-guide`, `/jewelry-care`, `/materials` — Customer care & info pages
- `/blog`, `/press` — Editorial pages
- `/privacy`, `/terms` — Legal pages

### Admin Dashboard
- URL: `/admin` — protected, redirects non-admin users to homepage
- Admin credentials: `admin@goldpalace.com` / `goldpalace@admin2024`
- Tabs: Overview stats, Users list, Orders & transactions, Activity log, Newsletter subscribers
- Activity is logged automatically on every login, signup, logout, and failed login attempt

### Database Tables
- `users` — id, email, password_hash, first_name, last_name, is_admin, created_at
- `categories` — id, name, slug, image_url
- `products` — id, name, description, price, original_price, image_url, category, is_new_arrival, is_trending, badge, weight
- `cart_items` — id, user_id, product_id, quantity
- `newsletter_subscribers` — id, email, created_at
- `activity_logs` — id, user_id, action, metadata (jsonb), ip_address, user_agent, created_at
- `orders` — id, user_id, guest_email, status, items (jsonb), subtotal, shipping_cost, total, shipping_address (jsonb), payment_method, transaction_id, created_at, updated_at
- `session` — express-session PostgreSQL store

### API Endpoints
- `POST /api/auth/register` — creates user, starts session
- `POST /api/auth/login` — authenticates, starts session
- `POST /api/auth/logout` — destroys session
- `GET /api/auth/me` — returns current user
- `GET /api/products?isNewArrival=true&isTrending=true` — list products
- `GET /api/products/:id` — get single product
- `GET /api/categories` — list categories
- `GET /api/cart` — get cart (auth required)
- `POST /api/cart/items` — add to cart (auth required)
- `PATCH /api/cart/items/:id` — update quantity (auth required)
- `DELETE /api/cart/items/:id` — remove from cart (auth required)
- `POST /api/newsletter/subscribe` — subscribe email

### Design
- **Fonts**: Playfair Display (serif headings) + Lato (body)
- **Color palette**: Deep warm gold (#C9A84C), cream ivory backgrounds, rich charcoal text
- **Animations**: Framer Motion scroll reveals, product card hover effects
