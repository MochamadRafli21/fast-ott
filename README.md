# 🎬 Fast OTT App

A fullstack mini OTT (Over-The-Top) video streaming platform that allows users to **watch videos**, while **admins can manage** uploaded content.

---

## ✨ Features

### 👤 Authentication
- JWT-based login for Admin
- Shared auth context for user session state
- Authorization header injected automatically

### 🎥 Video Streaming
- Public-facing video list & watch page (with React Player)
- Upload thumbnail & video to Cloudinary
- Support for "Published" and "Draft" video status

### 🛠 Admin Dashboard
- Manage video entries in table format
- Add/Edit/Delete videos
- Upload via drag/drop or file input
- Server-side video validation

---

## 📁 Folder Structure


```pgsql
apps/
├── client/ # Next.js 15 frontend (user + admin UI)
├── server/ # Express API with Prisma & Cloudinary
packages/
├── types/ # Shared Zod schemas & types
```



## 🚀 Getting Started

### 1. Install dependencies

```bash
bun install
```

---
### 2. Setup Environment
Create .env files in:

app/server/.env:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

app/client/.env
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```
### 3. Setup DB
```bash
bun run db:push     # Prisma push
bun run db:generate # Generate client
```
### Start Environment
```bash
bun run dev
```

### 📌 Assumptions
- Admin login is required for any video management actions
- Token is stored in cookies and managed through AuthProvider
- No email verification / password reset functionality implemented
- Uploads go directly to Cloudinary via server-side signed requests
- No video transcoding or chunked upload yet

### 💡 Improvements (Bonus)
🧪 Validation using Zod schema across both frontend and backend
🔐 Secure token storage using SameSite=Strict and cookie
📦 Monorepo setup for scalable development
🚀 Deployment-ready with Railway (backend) and Vercel (frontend)

### 🛠 Tech Stack

| Layer     | Tech Stack                                                            |
| --------- | --------------------------------------------------------------------- |
| Frontend  | Next.js 15, TailwindCSS, ShadCN, React Hook Form, Zod, TanStack Query |
| Backend   | Node.js (Express), Bun runtime, PostgreSQL, Prisma ORM                |
| Auth      | JWT, Auth Context Provider                                            |
| Media     | Cloudinary (thumbnail & video)                                        |
| Dev Tools | Bun (monorepo), Railway, Vercel                                       |



