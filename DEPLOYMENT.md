# 🚀 Vasavi PolyPacks Deployment Guide

This document explains how to deploy the Vasavi PolyPacks B2B portal (consisting of the Next.js Frontend and Express/Prisma Backend) to **Vercel** as a multi-service monorepo.

---

## 🛠️ Multi-Service Architecture Configuration

Vercel supports deploying multiple services from a single monorepo using a root-level `vercel.json` configuration file. We have created this file with the following specifications:

```json
{
  "experimentalServices": {
    "frontend": {
      "root": "frontend",
      "routePrefix": "/",
      "framework": "nextjs"
    },
    "backend": {
      "root": "backend",
      "routePrefix": "/_/backend"
    }
  }
}
```

This configuration routes:
- All main traffic to the **Next.js Frontend** at `/`
- All API and server requests to the **Express Backend** at `/_/backend`

---

## 🔑 Environment Variables Setup

Configure the following environment variables in your Vercel Project Settings:

### 1. Express Backend (`backend`)
Configure these under the backend environment scope:

| Variable | Description | Example / Recommended Value |
|----------|-------------|----------------------------|
| `DATABASE_URL` | The connection URL for your database. | `postgresql://user:pass@host:port/db?schema=public` (Recommended for production. You can use PostgreSQL or MySQL by changing the provider in `prisma/schema.prisma`). |
| `JWT_SECRET` | Secret key used to sign and verify user authentication tokens. | A strong random string (e.g. `your_production_secret_key_2026`). |
| `CORS_ORIGIN` | Allowed origin for frontend requests. | `https://your-domain.vercel.app` (Your production frontend URL). |
| `TELEGRAM_BOT_TOKEN` | Token for the Telegram bot to send quotation notifications. | `8988632518:AAEfNjCRLCzFsHJn6eTeGfjGoftNY-MfW4s` |
| `TELEGRAM_CHAT_ID` | The ID of the Telegram group/channel/chat where messages should go. | `7359344563` |

### 2. Next.js Frontend (`frontend`)
Configure these under the frontend environment scope:

| Variable | Description | Recommended Value |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_URL` | Base API URL pointing to the backend routing prefix. | `/api` (or `/` if deploying combined, otherwise `https://your-domain.vercel.app/_/backend` in production). |

---

## 🗄️ Database Setup & Migrations

If you are using PostgreSQL, MySQL, or another production database:

1. **Schema Sync**: Change the `provider` in `vasavipolypacks/backend/prisma/schema.prisma` from `"sqlite"` to your chosen provider (e.g. `"postgresql"`).
2. **Apply Migrations**: During deployment, Vercel or your CI/CD runner should run:
   ```bash
   npx prisma migrate deploy
   ```
3. **Database Seeding**: To seed the initial roles and credentials (including admin accounts), run:
   ```bash
   npx ts-node prisma/seed.ts
   ```

### 👥 Default Seed Accounts:
- 🛡️ **Primary Admin**: `admin@vasavipolypacks.com` / Password: `admin123`
- 🛡️ **Co-Admin**: `bhargavi@vasavipolypacks.com` / Password: `tikka`
- 👤 **B2B Test Customer**: `buyer@industrialgrain.com` / Password: `customer123`

---

## ⚡ Deployment Steps on Vercel Dashboard

1. Go to the **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click **Add New** ➔ **Project**.
3. Import your `Vasavi-PolyPacks` repository.
4. Vercel will automatically read the root `vercel.json` file and guide you through multi-service setup.
5. Provide the environment variables listed above under the respective service configs.
6. Click **Deploy**! Vercel will deploy the Next.js app and Express API under a single unified domain!
