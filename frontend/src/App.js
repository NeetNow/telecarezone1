import { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Import pages
import MainLanding from "@/pages/MainLanding";
import JoinExpert from "@/pages/JoinExpert";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import DoctorLanding from "@/pages/DoctorLanding";
import BookAppointment from "@/pages/BookAppointment";
import PaymentPage from "@/pages/PaymentPage";
import ConfirmationPage from "@/pages/ConfirmationPage";
import About from "@/pages/About";
import Blogs from "@/pages/Blogs";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AppContent() {
  const location = useLocation();
  const [subdomain, setSubdomain] = useState(null);

  useEffect(() => {
    // Detect subdomain from hostname
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    // Check if subdomain exists (e.g., doctorname.mykitchenfarm.com)
    // But skip common subdomains like 'www', 'preview', 'localhost' and preview URLs
    const skipSubdomains = ['www', 'preview', 'localhost'];
    const potentialSubdomain = parts[0];
    
    // Skip if it's a preview URL (contains 'preview.mykitchenfarm.com')
    const isPreviewDomain = hostname.includes('www.mykitchenfarm.com');
    
    if (parts.length > 2 && !skipSubdomains.includes(potentialSubdomain) && !isPreviewDomain) {
      setSubdomain(potentialSubdomain);
    } else {
      setSubdomain(null);
    }
  }, []);

  // Show subdomain routes if subdomain detected
  if (subdomain) {
    return (
      <>
        <Routes>
          <Route path="/" element={<DoctorLanding subdomain={subdomain} />} />
          <Route path="/book" element={<BookAppointment subdomain={subdomain} />} />
          <Route path="/payment/:appointmentId" element={<PaymentPage />} />
          <Route path="/confirmation/:appointmentId" element={<ConfirmationPage />} />
        </Routes>
        <Toaster position="top-right" />
      </>
    );
  }

  // Main domain routes
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLanding />} />
        <Route path="/doctor/:subdomain" element={<DoctorLanding />} />
        <Route path="/doctor/:subdomain/book" element={<BookAppointment />} />
        <Route path="/join-expert" element={<JoinExpert />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/payment/:appointmentId" element={<PaymentPage />} />
        <Route path="/confirmation/:appointmentId" element={<ConfirmationPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

export default App;
