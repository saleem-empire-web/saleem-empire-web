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
- **Frontend**: React + Vite + Tailwind CSS v4

## Application

**Cloud Nine Smoke Shop** — A bilingual (English/Arabic) e-commerce store for premium smoke shop products targeting the USA market.

### Features
- Bilingual support (English LTR / Arabic RTL) with language toggle
- Product catalog with category filtering, search, and grid view
- Product detail pages with ratings, reviews, and related products
- Client-side shopping cart with localStorage persistence
- Categories: Glass Pipes, Vaporizers, Rolling Papers, Accessories, Hookahs
- Dark moody theme with amber/gold accents (Playfair Display + Inter fonts)
- AI-generated product/category images served from `artifacts/smoke-shop/public/images/` (20 total: 5 category + 15 product images)

### Architecture
- **Frontend**: React + Vite at `/` (artifacts/smoke-shop)
- **Backend**: Express API at `/api` (artifacts/api-server)
- **Database**: PostgreSQL with Drizzle ORM (categories + products tables)
- **i18n**: Custom React context with `useLanguage()` hook, RTL support via `dir` attribute
- **Cart**: Client-side React context with `useCart()` hook, persisted to localStorage

### Database Tables
- `categories` — id, name, name_ar, description, description_ar, image_url
- `products` — id, name, name_ar, description, description_ar, price, compare_at_price, image_url, category_id, featured, in_stock, rating, review_count

### API Endpoints
- `GET /api/products` — List with filters (categoryId, featured, search, minPrice, maxPrice)
- `GET /api/products/:id` — Single product detail
- `GET /api/products/featured` — Featured products
- `GET /api/products/new-arrivals` — Newest products
- `GET /api/products/best-sellers` — Most reviewed products
- `GET /api/categories` — All categories with product counts
- `GET /api/categories/:id` — Category with its products
- `GET /api/store/summary` — Store stats

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
