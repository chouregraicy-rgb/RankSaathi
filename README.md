# VidyaSaathi — Setup Guide

AI-powered NEET & JEE preparation platform built with Next.js 15, Supabase, and OpenRouter.

---

## Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, ShadCN UI, Recharts, Framer Motion
- **Backend**: Supabase (Auth + Database + RLS), Next.js API Routes
- **AI**: OpenRouter → `google/gemini-flash-1.5` (fast, cheap, multimodal)
- **Deploy**: Render (Singapore region for India)

---

## Prerequisites

- Node.js 20+
- A Supabase project (free tier works)
- An OpenRouter account & API key
- A Render account

---

## Step 1 — Clone & Install

```bash
git clone <your-repo-url>
cd VidyaSaathi
npm install
```

---

## Step 2 — Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
OPENROUTER_API_KEY=sk-or-v1-YOUR_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Where to find keys:
- **Supabase keys**: `supabase.com/dashboard` → Your Project → Settings → API
- **OpenRouter key**: `openrouter.ai/keys`

---

## Step 3 — Set Up Supabase Database

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → SQL Editor
2. Click **New Query**
3. Paste the entire contents of `supabase_schema.sql`
4. Click **Run**

This creates all 16 tables, indexes, RLS policies, and seed data.

### Enable Authentication Providers

In Supabase Dashboard → Authentication → Providers:

1. **Email**: Already enabled by default ✓
2. **Phone (OTP)**:
   - Enable Phone provider
   - Configure Twilio (or use Supabase's built-in for testing)
3. **Google OAuth**:
   - Enable Google provider
   - Create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com)
   - Add authorized redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

### Set Auth Redirect URLs (for production)

Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: `https://rank-saathi.onrender.com`
- **Redirect URLs**: `https://rank-saathi.onrender.com/auth/callback`

---

## Step 4 — Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Test accounts:
1. Go to `/auth` → Create a student account via Email
2. Go to `/auth?role=parent` → Create a parent account
3. For admin: Manually update `role` in Supabase `users` table to `admin`

---

## Step 5 — Deploy to Render

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → **New Web Service**
3. Connect your GitHub repository
4. Render auto-detects `render.yaml` — review and confirm
5. Set environment variables in Render Dashboard → Environment tab:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   OPENROUTER_API_KEY
   NEXT_PUBLIC_APP_URL = https://rank-saathi.onrender.com (your actual URL)
   ```
6. Click **Deploy**

First build takes ~3 minutes. Subsequent deploys are faster.

### After deploy:
- Update Supabase Auth **Site URL** and **Redirect URLs** to your Render URL
- Update `NEXT_PUBLIC_APP_URL` in Render to your actual URL
- Redeploy once more

---

## PWA Icons

Generate icons at [pwa-asset-generator](https://github.com/elegantapp/pwa-asset-generator) or [realfavicongenerator.net](https://realfavicongenerator.net):

```bash
npx pwa-asset-generator your-logo.png public/icons --background "#2b7fff" --padding "10%"
```

Place the generated files in `/public/icons/`.

---

## Feature Overview

| Feature | Student | Parent | Admin |
|---------|---------|--------|-------|
| Dashboard | ✅ | ✅ | ✅ |
| AI Doubt Solver | ✅ | — | — |
| Tests (MCQ/Integer/AR) | ✅ | — | Create ✅ |
| Smart Revision | ✅ | — | — |
| Analytics | ✅ | View ✅ | — |
| Schedule | ✅ | — | — |
| Geo Tracking | — | ✅ | — |
| Mood Tracking | ✅ | View ✅ | — |
| Alerts | — | ✅ | — |
| User Management | — | — | ✅ |
| Question Bank | — | — | ✅ |
| Syllabus Management | — | — | ✅ |

---

## AI Model

`google/gemini-flash-1.5` via OpenRouter:
- ~$0.075 per 1M input tokens
- ~$0.30 per 1M output tokens
- Supports image input (for doubt solver photo upload)
- Very fast response times

---

## Cost Estimate (Per Month)

| Service | Cost |
|---------|------|
| Render Starter | $7/mo |
| Supabase Free tier | $0 (up to 500MB DB, 2GB bandwidth) |
| OpenRouter AI (1000 doubts/day × 30 days) | ~$9/mo |
| **Total** | **~$16/mo** |

Supabase Pro at $25/mo for production scale.

---

## Troubleshooting

**"Invalid JWT" errors**: Ensure `SUPABASE_SERVICE_ROLE_KEY` is set correctly  
**Google OAuth fails**: Check redirect URLs match exactly in both Supabase and Google Console  
**AI not responding**: Verify `OPENROUTER_API_KEY` starts with `sk-or-v1-`  
**Build fails on Render**: Ensure `output: "standalone"` in `next.config.js` ✓ (already set)  
**PWA not installing**: Icons in `/public/icons/` are required; generate them first  

---

## License

Private project — do not redistribute.

