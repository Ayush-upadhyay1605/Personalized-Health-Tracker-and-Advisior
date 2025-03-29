import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
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
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SonnerToaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/doctor-search" element={<DoctorSearch />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/metrics"
          element={
            <DashboardLayout>
              <HealthMetrics />
            </DashboardLayout>
          }
        />
        <Route
          path="/medications"
          element={
            <DashboardLayout>
              <Medications />
            </DashboardLayout>
          }
        />
        <Route
          path="/appointments"
          element={
            <DashboardLayout>
              <Appointments />
            </DashboardLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
