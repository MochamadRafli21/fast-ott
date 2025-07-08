# 🎬 Fast OTT App

A fullstack video streaming platform with user & admin roles, built with:

- **Frontend:** Next.js, TailwindCSS, ShadCN, TanStack Query, React Hook Form, Zod
- **Backend:** Node.js (Express), Bun, PostgreSQL, Prisma, Cloudinary
- **Auth:** JWT with Auth Context
- **Monorepo:** Bun-powered monorepo with `apps/client`, `apps/server`, `packages/types`
- **Extras:** Cloudinary, React Player

---

## 📁 Folder Structure

apps/
├── client/ # Next.js 15 frontend (user + admin UI)
├── server/ # Express API with Prisma & Cloudinary
packages/
├── types/ # Shared Zod schemas & types

## 🚀 Getting Started

### 1. Install dependencies

```bash
bun install

### 2. Setup Environment
Create .env files in:

app/server/.env:

DATABASE_URL=postgresql://...
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...


app/client/.env

NEXT_PUBLIC_API_URL=http://localhost:3001

### 3. Setup DB
bun run db:push     # Prisma push
bun run db:generate # Generate client

### Start Environment
bun run dev
```
