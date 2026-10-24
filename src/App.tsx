import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar, Footer } from '@/src/components/Navigation';
import { AIChatWidget } from '@/src/components/AIChatWidget';
import { Home } from '@/src/pages/Home';
import { RoomPage } from '@/src/pages/Room';
import { Cart } from '@/src/pages/Cart';
import { AdminDashboard } from '@/src/pages/AdminDashboard';
import { ThemeCustomization } from '@/src/pages/ThemeCustomization';
import { CheckoutAndTracking } from '@/src/pages/CheckoutAndTracking';
import { Feedback } from '@/src/pages/Feedback';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { LanguageProvider } from '@/src/context/LanguageContext';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { CartProvider } from '@/src/context/CartContext';
import { WishlistProvider } from '@/src/context/WishlistContext';
import { Navigate } from 'react-router-dom';
import { playSound } from '@/src/lib/utils';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center text-primary font-mono text-[10px] uppercase tracking-[0.4em]">Establishing Neural Link...</div>;
  return isAdmin ? children : <Navigate to="/" />;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center text-primary font-mono text-[10px] uppercase tracking-[0.4em]">Scanning Neural Signature...</div>;
  return user ? children : <Navigate to="/login" />;
};
import { AIConsultant } from '@/src/pages/AIConsultant';
import { Profile } from '@/src/pages/Profile';
import { OrderHistory } from '@/src/pages/OrderHistory';
import { Invoice } from '@/src/pages/Invoice';
import { WorkflowAutomation } from '@/src/pages/WorkflowAutomation';
import { Wishlist } from '@/src/pages/Wishlist';
import { CustomerCare } from '@/src/pages/CustomerCare';
import { Login } from '@/src/pages/Login';
import { SignUp } from '@/src/pages/SignUp';
import { ForgotPassword } from '@/src/pages/ForgotPassword';
import { NeuralBackground } from '@/src/components/NeuralBackground';

const AnimatedRoutes = () => {
  const location = useLocation();

  React.useEffect(() => {
    playSound('transition');
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
        transition={{ 
          duration: 0.4, 
          ease: [0.22, 1, 0.36, 1] 
        }}
      >
        {/* Shutter Effect Overlay */}
        <motion.div 
          initial={{ top: '-100%' }}
          animate={{ top: '100%' }}
          transition={{ duration: 0.4, ease: "linear" }}
          className="fixed left-0 right-0 h-[2px] bg-primary/30 z-[100] pointer-events-none blur-sm"
        />
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<RoomPage />} />
          <Route path="/rooms/:roomId" element={<RoomPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route path="/checkout" element={<CheckoutAndTracking />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/ai-consultant" element={<AIConsultant />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/invoice/:orderId" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
          <Route path="/automations" element={<ProtectedRoute><WorkflowAutomation /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/support" element={<CustomerCare />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route 
            path="/theme" 
            element={
              <AdminRoute>
                <ThemeCustomization />
              </AdminRoute>
            } 
          />
          
          <Route path="/customer-service" element={<div className="pt-40 text-center"><h1 className="text-4xl text-white italic">Help Center</h1><p className="text-gray-500 mt-4 tracking-widest uppercase text-xs">Direct support nodes active in Admin Console.</p></div>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <WishlistProvider>
              <ThemeProvider>
              <div className="min-h-screen bg-transparent text-white font-sans selection:bg-primary/30 selection:text-primary relative overflow-x-hidden">
                <NeuralBackground />
                <Navbar />
                <AIChatWidget />
                <main className="pb-20 relative z-10">
                  <AnimatedRoutes />
                </main>
                <Footer />
              </div>
            </ThemeProvider>
          </WishlistProvider>
        </CartProvider>
      </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}
