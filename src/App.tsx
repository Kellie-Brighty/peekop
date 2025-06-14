import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import OTPVerification from "./pages/auth/OTPVerification";
import Dashboard from "./pages/dashboard/Dashboard";
import RiderDashboard from "./pages/rider/RiderDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import { useEffect } from "react";
import "./styles/globals.css"; // Import global styles

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected Route Wrapper
const ProtectedRoute = ({
  children,
  requiredAccountType,
}: {
  children: React.ReactNode;
  requiredAccountType?: "user" | "rider";
}) => {
  // Check if authenticated
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If account type is specified, check if it matches
  if (requiredAccountType) {
    const accountType = localStorage.getItem("accountType");
    if (accountType !== requiredAccountType) {
      // Redirect to appropriate dashboard
      const redirectTo =
        accountType === "rider" ? "/rider-dashboard" : "/dashboard";
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <>{children}</>;
};

// Auth Route Wrapper (redirects to dashboard if already authenticated)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const location = useLocation();
  const accountType = localStorage.getItem("accountType");
  const from =
    location.state?.from?.pathname ||
    (accountType === "rider" ? "/rider-dashboard" : "/dashboard");

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

// Admin Protected Route Wrapper
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const adminUser = localStorage.getItem("adminUser");
  const location = useLocation();

  if (!adminUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Admin Auth Route Wrapper (redirects to admin dashboard if already authenticated)
const AdminAuthRoute = ({ children }: { children: React.ReactNode }) => {
  const adminUser = localStorage.getItem("adminUser");
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/dashboard";

  if (adminUser) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <AuthRoute>
                <SignIn />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <SignUp />
              </AuthRoute>
            }
          />
          <Route
            path="/verify"
            element={
              <AuthRoute>
                <OTPVerification />
              </AuthRoute>
            }
          />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredAccountType="user">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Rider Routes */}
          <Route
            path="/rider-dashboard"
            element={
              <ProtectedRoute requiredAccountType="rider">
                <RiderDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/login"
            element={
              <AdminAuthRoute>
                <AdminLogin />
              </AdminAuthRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

export default App;
