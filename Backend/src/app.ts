import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import orderRoutes from "./routes/order.routes";
import reviewRoutes from "./routes/review.routes";
import couponRoutes from "./routes/coupon.routes";
import analyticsRoutes from "./routes/analytics.routes";
import userRoutes from "./routes/user.routes";
import checkoutRoutes from "./routes/checkout.routes";
import addressRoutes from "./routes/address.routes";
import paymentRoutes from "./routes/payment.routes";

import { errorHandler } from "./middleware/error.middleware";

const app = express();

/* =========================================
   ALLOWED ORIGINS
========================================= */

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://e-commerce-pi-five-15.vercel.app",
];

/* =========================================
   CORS
========================================= */

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, mobile apps, curl, localhost, and Vercel deployment origins
      if (
        !origin ||
        ALLOWED_ORIGINS.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS policy: ${origin} is not allowed`)
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/* =========================================
   BODY PARSER
========================================= */

app.use(express.json({ limit: "16kb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(cookieParser());

/* =========================================
   HEALTH CHECK
========================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Backend API Running Successfully",
  });
});

/* =========================================
   ROUTES
========================================= */

app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/coupons", couponRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/users", userRoutes);

app.use("/api/checkout", checkoutRoutes);

app.use("/api/addresses", addressRoutes);

app.use("/api/payments", paymentRoutes);

/* =========================================
   FALLBACK ROUTE
========================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

/* =========================================
   ERROR HANDLER
========================================= */

app.use(errorHandler);

export { app };