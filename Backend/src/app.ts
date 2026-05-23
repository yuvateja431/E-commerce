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

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://e-commerce-pi-five-15.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: Origin ${origin} is not allowed`), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight OPTIONS requests for all routes (Express 5 wildcard syntax)
app.options("/*", cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes
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

// Checkout routes
app.use("/api", checkoutRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/checkout", orderRoutes);

app.post('/api/orders/checkout', async (req, res) => {
  // Simple stub to ensure endpoint exists
  res.status(201).json({ message: 'Order checkout stub (fallback)' });
});
export { app };
