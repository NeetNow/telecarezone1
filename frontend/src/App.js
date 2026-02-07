import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Main pages */}
          <Route path="/" element={<MainLanding />} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/join-expert" element={<JoinExpert />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          
          {/* Payment & Confirmation */}
          <Route path="/payment/:appointmentId" element={<PaymentPage />} />
          <Route path="/confirmation/:appointmentId" element={<ConfirmationPage />} />
          
          {/* Professional landing pages - Path based routing */}
          {/* Example: /priya-sharma or /rajesh-kumar */}
          <Route path="/:professionalSlug" element={<DoctorLanding />} />
          <Route path="/:professionalSlug/book" element={<BookAppointment />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;
