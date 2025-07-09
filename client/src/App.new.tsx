import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense, useState, useEffect } from 'react';
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MenuAdaptivityProvider } from "@/contexts/MenuAdaptivityContext";
import AdaptiveMenuSuggestions from "@/components/AdaptiveMenuSuggestions";
import NavigationGuideBot from "@/components/NavigationGuideBot";
import CompanyGoals from "@/components/CompanyGoals";

// Load essential components directly 
import NotFound from "@/pages/not-found";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import WorldClassNavigation from "@/components/WorldClassNavigation";
import SaasLayout from "@/components/SaasLayout";
import TemplatePage from "@/pages/TemplatePage";
import MobileNavigation from "@/components/MobileNavigation";

// Lazy load all pages to improve initial load time
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const EnhancedDashboard = lazy(() => import("@/pages/EnhancedDashboard"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const ToolDetails = lazy(() => import("@/pages/ToolDetails"));
const GenerateSOP = lazy(() => import("@/pages/GenerateSOP"));
const CostAnalysis = lazy(() => import("@/pages/CostAnalysis"));
const CostOverview = lazy(() => import("@/pages/CostOverview"));
const SOPDetail = lazy(() => import("@/pages/SOPDetail"));
const Meetings = lazy(() => import("@/pages/Meetings"));
const WhatsAppSettings = lazy(() => import("@/pages/WhatsAppSettings"));
const CategoriesOverview = lazy(() => import("@/pages/CategoriesOverview"));
const DepartmentAutomation = lazy(() => import("@/pages/DepartmentAutomation"));
const OrganizationChart = lazy(() => import("@/pages/OrganizationChart"));
const FinancialHealth = lazy(() => import("@/pages/FinancialHealth"));
const BusinessOperations = lazy(() => import("@/pages/BusinessOperations"));
const SocialMediaDashboard = lazy(() => import("@/pages/SocialMediaDashboard"));
const CustomerService = lazy(() => import("@/pages/CustomerService"));
const AdvancedAI = lazy(() => import("@/pages/AdvancedAI"));
const EntityDashboards = lazy(() => import("@/pages/EntityDashboards"));
const ClientManagement = lazy(() => import("@/pages/ClientManagement"));
const InventoryManagement = lazy(() => import("@/pages/InventoryManagement"));
const AdvertisingManagement = lazy(() => import("@/pages/AdvertisingManagement"));
const BusinessStrategy = lazy(() => import("@/pages/BusinessStrategy"));
const BusinessForecast = lazy(() => import("@/pages/BusinessForecast"));
const OperatingSystem = lazy(() => import("@/pages/OperatingSystem"));
const WorldClassDashboard = lazy(() => import("@/pages/WorldClassDashboard"));
const FomscDashboard = lazy(() => import("@/pages/FomscDashboard"));
const PasswordVault = lazy(() => import("@/pages/PasswordVault"));
const WorkflowSuggestions = lazy(() => import("@/pages/WorkflowSuggestions"));
const BrandAssets = lazy(() => import("@/pages/BrandAssets"));
const TrainingAcademy = lazy(() => import("@/pages/TrainingAcademy"));
const PartnerInvestorPortal = lazy(() => import("@/pages/PartnerInvestorPortal"));
const BusinessValuation = lazy(() => import("@/pages/BusinessValuation"));
const ProfitLoss = lazy(() => import("@/pages/ProfitLoss"));
const CustomerFeedback = lazy(() => import("@/pages/CustomerFeedback"));
const CustomerSegments = lazy(() => import("@/pages/CustomerSegments"));

function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the screen is mobile sized on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    checkMobile();
    
    // Set up listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Mobile navigation for small screens */}
      {isMobile && <MobileNavigation />}
      
      {/* Main content */}
      <div className={isMobile ? "pt-16" : ""}>
        {children}
      </div>
      
      <Toaster />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/enhanced-dashboard">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <EnhancedDashboard />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/world-class-dashboard">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <WorldClassDashboard />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/fomsc-dashboard">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <FomscDashboard />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/business-operations">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <BusinessOperations />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/business-strategy">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <BusinessStrategy />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/client-management">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <ClientManagement />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/categories">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <CategoriesOverview />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/customer-service">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <CustomerService />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/customer-feedback">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <CustomerFeedback />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/customer-segments">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <CustomerSegments />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/category/:slug">
        {(params) => (
          <SaasLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <CategoryPage slug={params.slug} />
            </Suspense>
          </SaasLayout>
        )}
      </Route>
      <Route path="/tool/:id">
        {(params) => (
          <SaasLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <ToolDetails id={parseInt(params.id)} />
            </Suspense>
          </SaasLayout>
        )}
      </Route>
      <Route path="/generate-sop">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <GenerateSOP />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/sop-detail">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <SOPDetail />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/meetings">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Meetings />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/whatsapp-settings">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <WhatsAppSettings />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/cost-analysis">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <CostAnalysis />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/cost-overview">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <CostOverview />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/department-automation">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <DepartmentAutomation />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/organization-chart">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <OrganizationChart />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/financial-health">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <FinancialHealth />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/social-media-dashboard">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <SocialMediaDashboard />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/advanced-ai">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <AdvancedAI />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/entity-dashboards">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <EntityDashboards />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/inventory-management">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <InventoryManagement />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/advertising-management">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <AdvertisingManagement />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/business-forecast">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <BusinessForecast />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/operating-system">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <OperatingSystem />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/password-vault">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <PasswordVault />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/workflow-suggestions">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <WorkflowSuggestions />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/brand-assets">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <BrandAssets />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/training-academy">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <TrainingAcademy />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/partner-portal">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <PartnerInvestorPortal />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/business-valuation">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <BusinessValuation />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/profit-loss">
        <SaasLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <ProfitLoss />
          </Suspense>
        </SaasLayout>
      </Route>
      <Route path="/template/:name">
        {(params) => (
          <SaasLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <TemplatePage name={params.name} />
            </Suspense>
          </SaasLayout>
        )}
      </Route>
      <Route path="/enhanced-navigation">
        <Suspense fallback={<div>Loading...</div>}>
          <EnhancedNavigation />
        </Suspense>
      </Route>
      <Route path="/world-class-navigation">
        <Suspense fallback={<div>Loading...</div>}>
          <WorldClassNavigation />
        </Suspense>
      </Route>
      <Route>
        <SaasLayout>
          <NotFound />
        </SaasLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MenuAdaptivityProvider>
          <AppLayout>
            <Router />
          </AppLayout>
        </MenuAdaptivityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;