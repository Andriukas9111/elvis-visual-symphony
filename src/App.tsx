
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimationProvider } from "./contexts/AnimationContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { queryClient } from "./hooks/useSupabase";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import CustomCursor from "./components/CustomCursor";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Download from "./pages/Download";
import BeforeAfterShowcase from "./pages/BeforeAfterShowcase";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import AuthGuard from "./components/AuthGuard";
import AdminAuthGuard from "./components/AdminAuthGuard";
import "./index.css";

// ScrollToTop component to reset scroll position on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const AppRoutes = () => (
  <AnimatePresence mode="wait">
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/before-after" element={<BeforeAfterShowcase />} />
      <Route path="/product/:slug" element={<ProductPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/download" element={<Download />} />
      <Route path="/dashboard" element={
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      } />
      <Route path="/admin" element={
        <AdminAuthGuard>
          <AdminPanel />
        </AdminAuthGuard>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AnimatePresence>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AnimationProvider>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <CustomCursor />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </AnimationProvider>
  </QueryClientProvider>
);

export default App;
