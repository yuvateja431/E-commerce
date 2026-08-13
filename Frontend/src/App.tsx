import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "react-hot-toast";

// Layouts
import { CustomerLayout } from "./layouts/CustomerLayout";
import { AdminLayout } from "./layouts/AdminLayout";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";

// Customer Pages
import { HomePage } from "./pages/customer/HomePage";
import { ProductsPage } from "./pages/customer/ProductsPage";
import { ProductDetailsPage } from "./pages/customer/ProductDetailsPage";
import { CartPage } from "./pages/customer/CartPage";
import { WishlistPage } from "./pages/customer/WishlistPage";
import { CheckoutPage } from "./pages/customer/CheckoutPage";
import { OrderHistoryPage } from "./pages/customer/OrderHistoryPage";

// Admin Pages
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminProductsPage } from "./pages/admin/Products";
import { AdminCategoriesPage } from "./pages/admin/Categories";
import { AdminOrdersPage } from "./pages/admin/Orders";
import { AdminUsersPage } from "./pages/admin/Users";
import { CouponsPage } from "./pages/admin/CouponsPage";
import { CouponFormPage } from "./pages/admin/CouponFormPage";
import { CouponDetailsPage } from "./pages/admin/CouponDetailsPage";
import { AdminInventoryPage } from "./pages/admin/Inventory";
import { AdminSettingsPage } from "./pages/admin/Settings";
import { AdminAnalyticsPage } from "./pages/admin/Analytics";

// Components
import { ProtectedRoute } from "./components/ProtectedRoute";
import type { Role } from "./types"; // Assuming Role enum is available

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Customer Storefront Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <CheckoutPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="coupons/create" element={<CouponFormPage />} />
          <Route path="coupons/:id/edit" element={<CouponFormPage />} />
          <Route path="coupons/:id" element={<CouponDetailsPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
        </Route>

        {/* Redirects */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
