
import React from "react"; // Explicitly import React
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import HealthMetrics from "./pages/HealthMetrics";
import Medications from "./pages/Medications";
import Appointments from "./pages/Appointments";
import DoctorSearch from "./pages/DoctorSearch";
import BookAppointment from "./pages/BookAppointment";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import DashboardLayout from "./components/DashboardLayout";
import Welcome from "./pages/Welcome";
import { DoctorSearchProvider } from "./components/DoctorSearchContext";
import './App.css'; // Ensure CSS is imported

// Create a new QueryClient instance outside of component render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DoctorSearchProvider>
            <div className="responsive-container">
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/home" element={<Index />} />
                
                {/* Doctor Search and Booking Routes */}
                <Route path="/doctor-search" element={<DoctorSearch />} />
                <Route path="/book-appointment" element={<BookAppointment />} />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard" element={
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                } />
                <Route path="/metrics" element={
                  <DashboardLayout>
                    <HealthMetrics />
                  </DashboardLayout>
                } />
                <Route path="/medications" element={
                  <DashboardLayout>
                    <Medications />
                  </DashboardLayout>
                } />
                <Route path="/appointments" element={
                  <DashboardLayout>
                    <Appointments />
                  </DashboardLayout>
                } />
                <Route path="/profile" element={
                  <DashboardLayout>
                    <Profile />
                  </DashboardLayout>
                } />
                <Route path="/settings" element={
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </DoctorSearchProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
