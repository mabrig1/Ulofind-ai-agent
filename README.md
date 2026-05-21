# UloFind

**Find Housing & Shops in Nsukka** — verified listings near the University of Nigeria Nsukka (UNN), with Ada AI fraud detection built in.

## What it does

| Feature | Description |
|---|---|
| Housing listings | Rooms, self-contained, flats, apartments near UNN |
| Campus shops | SUB, hostel areas, library axis, faculty canteens |
| Town shops | Ogige Market, University Road, Hilltop, Int'l Market |
| Ada Fraud Detector | AI-powered fraud check using Anthropic Claude |
| Photo uploads | Cloudinary-backed image storage |
| Lead capture | Inquiry emails via Resend + WhatsApp deep links |

---

## Tech stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: MongoDB via Mongoose
- **File storage**: Cloudinary
- **AI**: Anthropic Claude (`claude-sonnet-4-20250514`)
- **Email**: Resend
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

---

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/mabrig1/ulofind-ai-agent.git
cd ulofind-ai-agent
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in every value in `.env.local` (see guide below).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Seed sample data (optional)

```bash
npm run seed
```

This inserts 10 realistic Nsukka listings. Safe to run once — skips if data already exists.

---

## Environment variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string from [MongoDB Atlas](https://cloud.mongodb.com) → Connect → Drivers |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name (Dashboard → Account Details) |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ANTHROPIC_API_KEY` | Anthropic API key from [console.anthropic.com](https://console.anthropic.com) |
| `RESEND_API_KEY` | Resend API key from [resend.com/api-keys](https://resend.com/api-keys) |
| `ADMIN_EMAIL` | Email address for admin notifications |
| `NEXT_PUBLIC_SITE_URL` | Full public URL (e.g. `https://ulofind.fintigen.com`) |

---

## Deployment to Vercel

### Step 1 — Push to GitHub

```bash
git add -A
git commit -m "ready for deployment"
git push origin main
```

### Step 2 — Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository** and select `ulofind-ai-agent`
3. Vercel auto-detects Next.js — leave Framework as **Next.js**

### Step 3 — Add environment variables

In the Vercel project dashboard → **Settings → Environment Variables**, add every key from `.env.example`:

```
MONGODB_URI
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
ANTHROPIC_API_KEY
RESEND_API_KEY
ADMIN_EMAIL
NEXT_PUBLIC_SITE_URL
```

Set `NEXT_PUBLIC_SITE_URL` to `https://ulofind.fintigen.com`.

### Step 4 — Add custom domain

1. In Vercel dashboard → **Settings → Domains**
2. Click **Add** and enter `ulofind.fintigen.com`
3. Vercel provides a CNAME target (e.g. `cname.vercel-dns.com`)
4. In your domain registrar (wherever `fintigen.com` is managed), add:

```
Type:  CNAME
Name:  ulofind
Value: cname.vercel-dns.com
TTL:   Auto
```

5. Wait for DNS propagation (5 min – 48 hrs). Vercel auto-issues SSL.

### Step 5 — Deploy

Click **Deploy**. Subsequent pushes to `main` auto-deploy.

> **Note**: `next.config.mjs` includes `output: 'standalone'` which is also useful for Docker/self-hosted deployments.

---

## Project structure

```
app/
  (public)/           ← Public-facing pages (Navbar + Footer layout)
    page.tsx          ← Homepage
    housing/          ← Browse housing with filters
    shops/            ← Campus & town shop tabs
    post/             ← 3-step listing submission form
    verify/           ← Ada AI fraud detector
    listing/[id]/     ← Single listing detail + lead form
  (admin)/dashboard/  ← Agent/admin dashboard
  api/
    listings/         ← GET (filtered + paginated) + POST
    listings/[id]/    ← GET (view count) + PATCH + DELETE
    verify/           ← Ada fraud check via Anthropic
    upload/           ← Cloudinary file upload
    leads/            ← Lead capture + email notification

components/
  Navbar.tsx          ← Sticky nav with hamburger menu
  Footer.tsx          ← Green footer
  ListingCard.tsx     ← Photo card with WhatsApp button
  HomeSearch.tsx      ← Floating search bar
  UploadZone.tsx      ← react-dropzone wrapper
  FraudReport.tsx     ← Ada report UI (risk badge, flags, score ring)

lib/           mongodb.ts · cloudinary.ts · resend.ts
models/        Listing.ts · Lead.ts · FraudReport.ts
scripts/       seed.ts — 10 sample Nsukka listings
```

---

## API reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/listings` | List listings — params: `category`, `nearUNN`, `campusZone`, `townArea`, `housingType`, `minPrice`, `maxPrice`, `featured`, `page` |
| POST | `/api/listings` | Create listing |
| GET | `/api/listings/:id` | Get listing + increment views |
| PATCH | `/api/listings/:id` | Update listing |
| DELETE | `/api/listings/:id` | Delete listing |
| POST | `/api/verify` | Run Ada fraud check |
| POST | `/api/upload` | Upload file to Cloudinary |
| POST | `/api/leads` | Submit buyer inquiry |

---

## License

MIT — built for Nsukka students and residents.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
