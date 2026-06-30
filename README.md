# Sulfo Rwanda — E-Commerce Platform

A complete, production-ready e-commerce website built for **Sulfo Rwanda Industries** — showcasing their full product catalog (laundry soap, toilet soap, body care, NIL drinking water, and more) with online ordering, cart, checkout, and a full admin dashboard.

Built by **GIVA TECH Ltd** as a custom showcase / sales demo.

## ✨ Features

- **Storefront**: Hero, categories, best sellers, brand showcase, full product catalog with search/filter/sort
- **Product pages**: Image gallery, ratings, stock status, related products
- **Cart & Checkout**: Persistent cart (localStorage), coupon codes, 3-step checkout, MTN MoMo / Card / Cash on Delivery
- **Authentication**: JWT-based register/login/logout, secure HTTP-only cookies
- **Order tracking**: Customer order history with live status progress bar
- **Admin Dashboard**: Stats overview, product CRUD, order management with status updates
- **Fully responsive**: Mobile, tablet, desktop
- **100% Sulfo branding**: Real product data, real images, real brand colors (deep green + gold)

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: JSON file-based storage (`lowdb`-style, zero external dependencies — perfect for showcase/demo deployment)
- **Auth**: JWT (jose) + bcrypt password hashing
- **Icons**: lucide-react

## 🚀 Local Development

```bash
npm install
npm run dev
```
Visit http://localhost:3000

**Demo admin login:** `admin@sulfo.rw` / `admin123`

## 📦 Deploy to Render (Showcase)

1. Push this repo to GitHub
2. On Render: New → Web Service → connect repo
3. Render auto-detects `render.yaml` — or set manually:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add environment variable `JWT_SECRET` (or let Render auto-generate via render.yaml)
5. Deploy — done in ~3 minutes

⚠️ **Note on the demo database**: This build uses a JSON file at `/tmp/sulfo-db.json` for zero-config showcase deployment. On Render's free tier, the filesystem resets on every restart/redeploy — perfect for a clean demo, but **not for production**. See "Going to Production" below.

## 🏭 Going to Production (after Sulfo purchase)

Before deploying to Sulfo's own domain with real customer data:

1. **Swap the database**: Replace `src/lib/db.js` with a real database (PostgreSQL via Railway/Supabase, or MongoDB Atlas). The function signatures are already structured for an easy swap.
2. **Real payment integration**: Replace the simulated MoMo flow with MTN MoMo Open API or Flutterwave/Paypack for real transaction processing.
3. **Email notifications**: Add order confirmation emails (Resend, SendGrid).
4. **Image hosting**: Move product images from `sulforwanda.com` references to a CDN (Cloudinary/S3) under Sulfo's control.
5. **Custom domain**: Point `shop.sulfo.rw` or `sulfo.rw` to the new deployment.
6. **Admin accounts**: Create real admin accounts for Sulfo staff; remove/change the demo admin password.

## 📂 Project Structure

```
sulfo-shop/
├── src/
│   ├── app/              # Pages & API routes (Next.js App Router)
│   │   ├── api/           # Backend endpoints
│   │   ├── products/      # Product listing & detail
│   │   ├── cart/ checkout/ orders/ wishlist/
│   │   ├── auth/          # Login & register
│   │   └── admin/         # Admin dashboard, products, orders
│   ├── components/        # Navbar, Footer, ProductCard, CartDrawer
│   ├── context/           # Cart, Auth, Toast state
│   └── lib/                # db.js (data layer), auth.js, products-data.js (seed data)
├── render.yaml             # One-click Render deployment config
└── package.json
```

## 📞 About This Demo

This is a fully functional showcase built with real Sulfo Rwanda product data, brand colors, and imagery — built to demonstrate exactly what Sulfo's customers would experience shopping online.

Built by GIVA TECH Ltd · Kigali, Rwanda
