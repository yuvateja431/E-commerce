# 🛒 Full-Stack E-Commerce Platform

![Node.js](https://img.shields.io/badge/Node.js-v20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-6.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

A high-performance, enterprise-grade **Full-Stack E-Commerce Application** built with modern web technologies using standard JavaScript (ES Modules / JSX). It features a stunning customer store UI, a powerful Admin Dashboard for inventory and order management, secure JWT authentication with HttpOnly cookies, dynamic coupon engine, address book management, and Razorpay payment integration.

---

## 📸 Key Features & Capabilities

### 🛍️ Customer Experience
- **Dynamic Storefront**: Browse curated products across multiple categories with instant search, live tag filters, price range sliders, and pagination.
- **Product Details & Variants**: View high-resolution image galleries, product variants (colors/sizes), inventory availability, and customer reviews with rating distributions.
- **Cart & Wishlist**: Real-time interactive shopping cart with item quantity updates and persistent wishlist management.
- **Seamless Checkout**: Multi-step checkout with user address selection, dynamic shipping charges calculation, and coupon discount validation.
- **Integrated Payments**: Support for Razorpay payment gateway integration alongside Cash on Delivery (COD).
- **User Dashboard & Order History**: Customer profile management, saved addresses, and detailed order status timeline tracking.

### 🛡️ Admin & Store Management Panel
- **Real-Time Analytics**: Visual store metrics, total revenue, order count stats, top-selling products, and recent activity feed.
- **Product Management**: Full CRUD capabilities for products, inventory stock thresholds, image management, tags, and product variants.
- **Order Processing**: View, search, filter, and update customer order statuses (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
- **Coupon Engine**: Create and manage promo codes with fixed/percentage discounts, minimum spend thresholds, usage limits, and expiration dates.
- **User Management**: Role-based customer and staff management (`USER`, `MANAGER`, `ADMIN`).

### 🔐 Security & Backend Architecture
- **JWT Dual Token Auth**: Secure authentication utilizing Access Tokens and Refresh Tokens stored safely in HttpOnly cookies.
- **Password Hashing**: Bcrypt encryption for user credentials.
- **Database ORM**: Prisma ORM paired with PostgreSQL hosted on Supabase (with PgBouncer connection pooling).
- **Input Validation**: Schema validation using Zod and Express middleware error handling.
- **CORS & Rate Limiting**: Secure cross-origin resource sharing configured for local and production deployment environments.

---

## 🛠️ Technology Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend UI** | React 19 + JavaScript (JSX) | Modern React components with clean state management |
| **Build Tool** | Vite 8 | Lightning-fast HMR and bundling |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework with modern styling |
| **Icons & Motion** | React Icons & Framer Motion | Modern icon sets and smooth micro-animations |
| **Backend Runtime** | Node.js (v20+) & Express.js | Scalable RESTful API web server |
| **Language** | JavaScript (ES Modules) | Native ES modules with Node `--watch` support |
| **Database** | Supabase (PostgreSQL) | Cloud relational database |
| **ORM** | Prisma ORM 6.x | Schema migrations and database queries |
| **Authentication** | JWT & BcryptJS | Secure session & authentication management |
| **Payments** | Razorpay SDK | Integrated digital payments API |
| **Email Services** | Nodemailer | SMTP email delivery for auth & notifications |

---

## 📂 Project Architecture

```text
E-Commerce -Store/
├── Backend/                      # Express JavaScript REST API (Node.js ES Modules)
│   ├── prisma/                   # Prisma Schema & Database Seeding Scripts
│   │   ├── schema.prisma         # Database models & relationships
│   │   ├── seedAdmin.js          # Script to create/reset Admin credentials
│   │   └── seedProducts.js       # Database sample data seeder
│   ├── src/
│   │   ├── controllers/          # Request handlers (Auth, Products, Cart, Orders...)
│   │   ├── middleware/           # Auth, Role, Error handling & CORS middleware
│   │   ├── routes/               # API route definitions
│   │   ├── services/             # Business logic & payment service helpers
│   │   ├── validators/           # Zod schema definitions
│   │   ├── app.js                # Express application setup
│   │   └── server.js             # Server launcher on port 5000
│   ├── jsconfig.json             # JS path alias and IDE resolution config
│   ├── .env                      # Backend Environment Variables
│   └── package.json
│
├── Frontend/                     # React + JavaScript + Vite SPA
│   ├── src/
│   │   ├── components/           # Reusable UI elements (Navbar, Cards, Modals...)
│   │   ├── layouts/              # Customer & Admin Layout wrappers
│   │   ├── pages/                # Application routes (Home, Shop, Admin, Cart...)
│   │   ├── services/             # Axios/Fetch API client functions
│   │   ├── App.jsx               # Main application component & routes
│   │   └── main.jsx              # Application entry point
│   ├── jsconfig.json             # JS path alias and IDE resolution config
│   ├── vite.config.js            # Vite dev server & proxy rules (`/api` -> 5000)
│   ├── .env                      # Frontend Environment Variables
│   └── package.json
│
└── README.md                     # Project Documentation
```

---

## 🔑 Pre-Configured Credentials

For quick testing of both customer and administrative roles:

### 👑 Admin Credentials
- **Email**: `admin431@gmail.com`
- **Password**: `Admin431@`

*Alternative Admin Account*:
- **Email**: `admin@example.com`
- **Password**: `admin123`

---

## ⚙️ Environment Configuration

### Backend Setup (`Backend/.env`)
Create a `.env` file in the `Backend/` folder with the following variables:

```env
PORT=5000
NODE_ENV=development

# Database Connection (Supabase / PostgreSQL)
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASS]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# JWT Token Secrets
ACCESS_TOKEN_SECRET="your_secure_access_token_secret"
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_SECRET="your_secure_refresh_token_secret"
REFRESH_TOKEN_EXPIRY="7d"

# CORS & Origin
FRONTEND_URL="http://localhost:5173"
CORS_ORIGIN="http://localhost:5173"

# Email Services (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
FROM_NAME="E-Commerce Store"
FROM_EMAIL="your-email@gmail.com"
```

### Frontend Setup (`Frontend/.env`)
Create a `.env` file in the `Frontend/` folder:

```env
VITE_API_BASE_URL="http://localhost:5000/api"
VITE_RAZORPAY_KEY_ID="your_razorpay_key_id"
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- PostgreSQL database instance (or Supabase account)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yuvateja431/E-commerce.git
cd E-commerce
```

### 2️⃣ Backend Setup
```bash
cd Backend

# Install dependencies
npm install

# Run database migrations
npm run prisma:migrate

# Seed Admin User
node prisma/seedAdmin.js

# Start Development Server
npm run dev
```
*The backend server will start on `http://127.0.0.1:5000`.*

### 3️⃣ Frontend Setup
In a new terminal window:
```bash
cd Frontend

# Install dependencies
npm install

# Start Vite Development Server
npm run dev
```
*The frontend application will start on `http://localhost:5173`.*

---

## 📡 API Overview

All API endpoints are prefixed with `/api`.

| Module | Route | Method | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/register` | `POST` | Public | Register new customer account |
| **Auth** | `/api/auth/login` | `POST` | Public | Authenticate user & issue JWT |
| **Auth** | `/api/auth/me` | `GET` | Authenticated | Retrieve current user profile |
| **Products**| `/api/products` | `GET` | Public | Fetch product list with filters |
| **Products**| `/api/products/:id` | `GET` | Public | Get single product details |
| **Products**| `/api/products` | `POST` | Admin/Manager | Create a new product |
| **Cart** | `/api/cart` | `GET` | Authenticated | Fetch user cart items |
| **Cart** | `/api/cart/add` | `POST` | Authenticated | Add item to cart |
| **Orders** | `/api/orders` | `POST` | Authenticated | Place new customer order |
| **Orders** | `/api/orders/my-orders`| `GET` | Authenticated | Get customer order history |
| **Orders** | `/api/orders/admin` | `GET` | Admin/Manager | List all store orders |
| **Coupons**| `/api/coupons/validate`| `POST` | Authenticated | Validate promo coupon code |
| **Analytics**|`/api/analytics` | `GET` | Admin | Store dashboard performance metrics |

---

## 📦 Build for Production

### Backend Build
```bash
cd Backend
npm run build
npm start
```

### Frontend Build
```bash
cd Frontend
npm run build
```
*The production bundle will be generated in `Frontend/dist`.*

---

## 📜 License

This project is licensed under the **ISC License**. Created by [yuvateja431](https://github.com/yuvateja431).
