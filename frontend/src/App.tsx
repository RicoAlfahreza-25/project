import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { ProductsAdd } from "./pages/ProductsAdd";
import { ProductsSettings } from "./pages/ProductsSettings";
import { UserAccessRights } from "./pages/UserAccessRights";
import { ManagementBranches } from "./pages/ManagementBranches";
import { SettingsTopUp } from "./pages/SettingsTopUp";
import { SettingsPKA } from "./pages/SettingsPKA";
import { ManagementPaymentOffices } from "./pages/ManagementPaymentOffices";
import { BranchDashboard } from "./pages/BranchDashboard";
import { BranchMembers } from "./pages/BranchMembers";
import BranchLoans from "./pages/BranchLoans";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/branch-dashboard" element={<BranchDashboard />} />
          <Route path="/branch/members" element={<BranchMembers />} />
          <Route path="/branch/loans" element={<BranchLoans />} />
          <Route path="/products/add" element={<ProductsAdd />} />
          <Route path="/products/settings" element={<ProductsSettings />} />
          <Route path="/settings/pka" element={<SettingsPKA />} />
          <Route path="/settings/topup" element={<SettingsTopUp />} />
          <Route path="/users/access" element={<UserAccessRights />} />
          <Route path="/management/branches" element={<ManagementBranches />} />
          <Route path="/management/payment-offices" element={<ManagementPaymentOffices />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
