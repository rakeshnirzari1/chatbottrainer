import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { Checkout } from './pages/Checkout';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    // Scroll immediately
    scrollToTop();
    
    // Schedule additional scrolls to ensure it works
    requestAnimationFrame(scrollToTop);
    const timer1 = setTimeout(scrollToTop, 0);
    const timer2 = setTimeout(scrollToTop, 100);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname]);

  return null;
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
