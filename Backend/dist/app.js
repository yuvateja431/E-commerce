"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const wishlist_routes_1 = __importDefault(require("./routes/wishlist.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const coupon_routes_1 = __importDefault(require("./routes/coupon.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const checkout_routes_1 = __importDefault(require("./routes/checkout.routes"));
const address_routes_1 = __importDefault(require("./routes/address.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
exports.app = app;
/* =========================================
   ALLOWED ORIGINS
========================================= */
const ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://e-commerce-pi-five-15.vercel.app",
];
/* =========================================
   CORS
========================================= */
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow Postman, mobile apps, curl
        if (!origin) {
            return callback(null, true);
        }
        if (ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS policy: ${origin} is not allowed`));
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
}));
/* =========================================
   BODY PARSER
========================================= */
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: "16kb",
}));
app.use((0, cookie_parser_1.default)());
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
app.use("/api/auth", auth_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.use("/api/wishlist", wishlist_routes_1.default);
app.use("/api/orders", order_routes_1.default);
app.use("/api/reviews", review_routes_1.default);
app.use("/api/coupons", coupon_routes_1.default);
app.use("/api/analytics", analytics_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/checkout", checkout_routes_1.default);
app.use("/api/addresses", address_routes_1.default);
app.use("/api/payments", payment_routes_1.default);
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
app.use(error_middleware_1.errorHandler);
//# sourceMappingURL=app.js.map