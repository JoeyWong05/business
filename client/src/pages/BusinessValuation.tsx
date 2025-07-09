import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import MainLayout from "@/components/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  BarChart,
  BarChart2,
  BarChart3,
  Building,
  Calculator,
  Calendar,
  ChevronDown,
  ChevronsUpDown,
  Clock,
  DollarSign,
  Download,
  FileDown,
  FileText,
  Filter,
  History,
  Info,
  LineChart,
  List,
  MoreHorizontal,
  Pencil,
  PieChart,
  Plus,
  Printer,
  RefreshCcw,
  Save,
  Search,
  Settings,
  Share2,
  Sliders,
  TrendingUp,
  Undo2,
} from "lucide-react";
import { useDemoMode } from "@/contexts/DemoModeContext";

// Types
interface ValuationMetric {
  id: number;
  name: string;
  value: number;
  weight: number;
  industry: string;
  description: string;
  benchmark: number;
  trend: "up" | "down" | "stable";
  lastUpdated: string;
}

interface BusinessEntity {
  id: number;
  name: string;
  industry: string;
  founded: string;
  employees: number;
  revenue: number;
  profitMargin: number;
  growthRate: number;
  location: string;
}

interface ValuationMethod {
  id: number;
  name: string;
  description: string;
  result: number;
  confidence: number;
  applicability: number;
  industry: string;
  lastCalculated: string;
}

interface ComparableCompany {
  id: number;
  name: string;
  industry: string;
  revenue: number;
  revenueMultiple: number;
  ebitdaMultiple: number;
  marketCap?: number;
  peRatio?: number;
  evToEbitda?: number;
  netIncome: number;
}

interface FinancialProjection {
  year: number;
  revenue: number;
  expenses: number;
  ebitda: number;
  netIncome: number;
  cashFlow: number;
  growthRate: number;
  discountFactor: number;
  presentValue: number;
}

interface ValuationHistory {
  id: number;
  date: string;
  value: number;
  method: string;
  analyst: string;
  notes?: string;
}

// Formatter functions
const formatCurrency = (value: number | undefined): string => {
  if (!value && value !== 0) return "N/A";

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  } else {
    return `$${value.toFixed(2)}`;
  }
};

const formatPercentage = (value: number | undefined): string => {
  if (!value && value !== 0) return "N/A";
  return `${(value * 100).toFixed(1)}%`;
};

// Component for Data Card
const MetricCard: React.FC<{
  title: string;
  value: string;
  change?: { value: number; isPositive: boolean };
  subtitle?: string;
  icon?: React.ReactNode;
}> = ({ title, value, change, subtitle, icon }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {change && (
              <div
                className={`flex items-center text-xs ${
                  change.isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {change.isPositive ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {formatPercentage(Math.abs(change.value))}
              </div>
            )}
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {icon && <div className="h-8 w-8 text-muted-foreground">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for Valuation Method Card
const ValuationMethodCard: React.FC<{
  method: ValuationMethod;
  onSelect: () => void;
  isSelected: boolean;
}> = ({ method, onSelect, isSelected }) => {
  return (
    <Card
      className={`cursor-pointer hover:border-primary/70 transition-colors ${
        isSelected ? "border-primary bg-primary/5" : ""
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>{method.name}</span>
          <Badge
            className={
              method.confidence >= 0.7
                ? "bg-green-500"
                : method.confidence >= 0.4
                ? "bg-amber-500"
                : "bg-red-500"
            }
          >
            {Math.round(method.confidence * 100)}% Confidence
          </Badge>
        </CardTitle>
        <CardDescription className="line-clamp-2">{method.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Valuation:</span>
            <span className="font-bold">{formatCurrency(method.result)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Applicability:</span>
            <div className="flex items-center">
              <Progress value={method.applicability * 100} className="h-2 w-20 mr-2" />
              <span className="text-sm">{Math.round(method.applicability * 100)}%</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Last Updated:</span>
            <span className="text-sm">{new Date(method.lastCalculated).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for Comparable Company Row
const ComparableCompanyRow: React.FC<{ company: ComparableCompany }> = ({ company }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{company.name}</TableCell>
      <TableCell>{formatCurrency(company.revenue)}</TableCell>
      <TableCell>
        {company.revenueMultiple ? `${company.revenueMultiple.toFixed(1)}x` : "N/A"}
      </TableCell>
      <TableCell>
        {company.ebitdaMultiple ? `${company.ebitdaMultiple.toFixed(1)}x` : "N/A"}
      </TableCell>
      <TableCell>{company.peRatio ? `${company.peRatio.toFixed(1)}x` : "N/A"}</TableCell>
      <TableCell>{formatCurrency(company.netIncome)}</TableCell>
    </TableRow>
  );
};

// Main Business Valuation Component
export default function BusinessValuation() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedBusinessEntity, setSelectedBusinessEntity] = useState<number>(1); // Default to first entity
  const [selectedValuationMethod, setSelectedValuationMethod] = useState<number | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const { demoMode } = useDemoMode();

  // Fetch data from API
  const { data: entitiesData, isLoading: isLoadingEntities } = useQuery({
    queryKey: ["/api/business-entities"],
    queryFn: () => apiRequest("/api/business-entities"),
  });

  const { data: metricsData, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["/api/valuation-metrics", selectedBusinessEntity],
    queryFn: () => apiRequest(`/api/valuation-metrics?entityId=${selectedBusinessEntity}`),
  });

  const { data: methodsData, isLoading: isLoadingMethods } = useQuery({
    queryKey: ["/api/valuation-methods", selectedBusinessEntity],
    queryFn: () => apiRequest(`/api/valuation-methods?entityId=${selectedBusinessEntity}`),
  });

  const { data: comparablesData, isLoading: isLoadingComparables } = useQuery({
    queryKey: ["/api/comparable-companies", selectedBusinessEntity],
    queryFn: () => apiRequest(`/api/comparable-companies?entityId=${selectedBusinessEntity}`),
  });

  const { data: projectionsData, isLoading: isLoadingProjections } = useQuery({
    queryKey: ["/api/financial-projections", selectedBusinessEntity],
    queryFn: () => apiRequest(`/api/financial-projections?entityId=${selectedBusinessEntity}`),
  });

  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["/api/valuation-history", selectedBusinessEntity],
    queryFn: () => apiRequest(`/api/valuation-history?entityId=${selectedBusinessEntity}`),
  });

  // Mock default data for demo mode
  const defaultBusinessEntities: BusinessEntity[] = demoMode
    ? [
        {
          id: 1,
          name: "Digital Merch Pros",
          industry: "E-commerce",
          founded: "2020-03-15",
          employees: 42,
          revenue: 4750000,
          profitMargin: 0.18,
          growthRate: 0.32,
          location: "Austin, TX",
        },
        {
          id: 2,
          name: "Mystery Hype",
          industry: "Retail",
          founded: "2021-06-22",
          employees: 28,
          revenue: 2100000,
          profitMargin: 0.14,
          growthRate: 0.45,
          location: "Austin, TX",
        },
        {
          id: 3,
          name: "Lone Star Custom Clothing",
          industry: "Manufacturing",
          founded: "2019-01-10",
          employees: 35,
          revenue: 3250000,
          profitMargin: 0.22,
          growthRate: 0.18,
          location: "Austin, TX",
        },
        {
          id: 4,
          name: "Alcoeaze",
          industry: "Beverage",
          founded: "2022-04-05",
          employees: 12,
          revenue: 950000,
          profitMargin: 0.26,
          growthRate: 0.65,
          location: "Austin, TX",
        },
        {
          id: 5,
          name: "Hide Cafe Bars",
          industry: "Hospitality",
          founded: "2021-11-30",
          employees: 18,
          revenue: 1200000,
          profitMargin: 0.15,
          growthRate: 0.28,
          location: "Austin, TX",
        },
      ]
    : [];

  const defaultMetrics: ValuationMetric[] = demoMode
    ? [
        {
          id: 1,
          name: "Revenue Growth Rate",
          value: 0.32,
          weight: 0.2,
          industry: "E-commerce",
          description: "Annual growth rate of company revenue",
          benchmark: 0.25,
          trend: "up",
          lastUpdated: "2025-03-10T12:00:00Z",
        },
        {
          id: 2,
          name: "EBITDA Margin",
          value: 0.22,
          weight: 0.15,
          industry: "E-commerce",
          description:
            "Earnings before interest, taxes, depreciation and amortization, as a percentage of revenue",
          benchmark: 0.18,
          trend: "up",
          lastUpdated: "2025-03-10T12:00:00Z",
        },
        {
          id: 3,
          name: "Customer Acquisition Cost (CAC)",
          value: 85,
          weight: 0.1,
          industry: "E-commerce",
          description: "Average cost to acquire a new customer",
          benchmark: 95,
          trend: "down",
          lastUpdated: "2025-03-10T12:00:00Z",
        },
        {
          id: 4,
          name: "Customer Lifetime Value (CLV)",
          value: 450,
          weight: 0.15,
          industry: "E-commerce",
          description:
            "Average revenue generated by a customer during their relationship with the company",
          benchmark: 400,
          trend: "up",
          lastUpdated: "2025-03-10T12:00:00Z",
        },
        {
          id: 5,
          name: "Churn Rate",
          value: 0.08,
          weight: 0.1,
          industry: "E-commerce",
          description: "Rate at which customers stop doing business with the company",
          benchmark: 0.1,
          trend: "down",
          lastUpdated: "2025-03-10T12:00:00Z",
        },
        {
          id: 6,
          name: "Net Promoter Score (NPS)",
          value: 65,
          weight: 0.05,
          industry: "E-commerce",
          description: "Measure of customer satisfaction and loyalty",
          benchmark: 55,
          trend: "up",
          lastUpdated: "2025-03-10T12:00:00Z",
        },
        {
          id: 7,
          name: "Operating Cash Flow",
          value: 0.15,
          weight: 0.15,
          industry: "E-commerce",
          description: "Cash flow from business operations as a percentage of revenue",
          benchmark: 0.12,
          trend: "up",
          lastUpdated: "2025-03-10T12:00:00Z",
        },
        {
          id: 8,
          name: "Return on Assets (ROA)",
          value: 0.18,
          weight: 0.1,
          industry: "E-commerce",
          description: "Net income as a percentage of total assets",
          benchmark: 0.15,
          trend: "up",
          lastUpdated: "2025-03-10T12:00:00Z",
        },
      ]
    : [];

  const defaultMethods: ValuationMethod[] = demoMode
    ? [
        {
          id: 1,
          name: "Discounted Cash Flow (DCF)",
          description:
            "Valuation method that uses future free cash flow projections and discounts them to derive present value",
          result: 18500000,
          confidence: 0.85,
          applicability: 0.9,
          industry: "E-commerce",
          lastCalculated: "2025-03-10T12:00:00Z",
        },
        {
          id: 2,
          name: "Comparable Company Analysis",
          description:
            "Valuation based on similar companies in the same industry using various multiples",
          result: 21750000,
          confidence: 0.75,
          applicability: 0.85,
          industry: "E-commerce",
          lastCalculated: "2025-03-10T12:00:00Z",
        },
        {
          id: 3,
          name: "Revenue Multiple",
          description: "Valuation based on a multiple of the company's revenue",
          result: 23750000,
          confidence: 0.65,
          applicability: 0.7,
          industry: "E-commerce",
          lastCalculated: "2025-03-10T12:00:00Z",
        },
        {
          id: 4,
          name: "EBITDA Multiple",
          description: "Valuation based on a multiple of the company's EBITDA",
          result: 19800000,
          confidence: 0.7,
          applicability: 0.8,
          industry: "E-commerce",
          lastCalculated: "2025-03-10T12:00:00Z",
        },
        {
          id: 5,
          name: "Book Value",
          description: "Valuation based on the company's total assets minus total liabilities",
          result: 12450000,
          confidence: 0.4,
          applicability: 0.5,
          industry: "E-commerce",
          lastCalculated: "2025-03-10T12:00:00Z",
        },
      ]
    : [];

  const defaultComparables: ComparableCompany[] = demoMode
    ? [
        {
          id: 1,
          name: "E-Merch Direct",
          industry: "E-commerce",
          revenue: 8500000,
          revenueMultiple: 5.2,
          ebitdaMultiple: 12.5,
          marketCap: 44200000,
          peRatio: 18.5,
          evToEbitda: 11.8,
          netIncome: 2200000,
        },
        {
          id: 2,
          name: "Custom Swag Co",
          industry: "E-commerce",
          revenue: 5700000,
          revenueMultiple: 4.8,
          ebitdaMultiple: 11.2,
          marketCap: 27360000,
          peRatio: 16.8,
          evToEbitda: 10.5,
          netIncome: 1600000,
        },
        {
          id: 3,
          name: "Merch Matters",
          industry: "E-commerce",
          revenue: 3800000,
          revenueMultiple: 4.5,
          ebitdaMultiple: 10.8,
          marketCap: 17100000,
          peRatio: 15.2,
          evToEbitda: 9.8,
          netIncome: 950000,
        },
        {
          id: 4,
          name: "Promo Goods Inc",
          industry: "E-commerce",
          revenue: 6200000,
          revenueMultiple: 4.9,
          ebitdaMultiple: 11.5,
          marketCap: 30380000,
          peRatio: 17.2,
          evToEbitda: 10.9,
          netIncome: 1750000,
        },
        {
          id: 5,
          name: "Brand Swag Solutions",
          industry: "E-commerce",
          revenue: 4100000,
          revenueMultiple: 4.6,
          ebitdaMultiple: 11.0,
          marketCap: 18860000,
          peRatio: 16.4,
          evToEbitda: 10.2,
          netIncome: 1150000,
        },
      ]
    : [];

  const defaultProjections: FinancialProjection[] = demoMode
    ? [
        {
          year: 2025,
          revenue: 4750000,
          expenses: 3800000,
          ebitda: 1045000,
          netIncome: 855000,
          cashFlow: 950000,
          growthRate: 0.32,
          discountFactor: 1,
          presentValue: 950000,
        },
        {
          year: 2026,
          revenue: 6270000,
          expenses: 4954800,
          ebitda: 1379400,
          netIncome: 1128600,
          cashFlow: 1254000,
          growthRate: 0.28,
          discountFactor: 0.87,
          presentValue: 1090980,
        },
        {
          year: 2027,
          revenue: 8025600,
          expenses: 6263808,
          ebitda: 1765632,
          netIncome: 1444848,
          cashFlow: 1605120,
          growthRate: 0.25,
          discountFactor: 0.756,
          presentValue: 1213471,
        },
        {
          year: 2028,
          revenue: 10032000,
          expenses: 7860000,
          ebitda: 2207040,
          netIncome: 1806060,
          cashFlow: 2006400,
          growthRate: 0.22,
          discountFactor: 0.658,
          presentValue: 1320211,
        },
        {
          year: 2029,
          revenue: 12238040,
          expenses: 9497220,
          ebitda: 2692368.8,
          netIncome: 2203792,
          cashFlow: 2447608,
          growthRate: 0.18,
          discountFactor: 0.572,
          presentValue: 1400031,
        },
      ]
    : [];

  const defaultHistory: ValuationHistory[] = demoMode
    ? [
        {
          id: 1,
          date: "2025-03-10T12:00:00Z",
          value: 20650000,
          method: "Weighted Average",
          analyst: "Michael Chen",
          notes: "Quarterly valuation update with latest financial data",
        },
        {
          id: 2,
          date: "2024-12-15T12:00:00Z",
          value: 18900000,
          method: "Weighted Average",
          analyst: "Michael Chen",
          notes: "Year-end valuation assessment",
        },
        {
          id: 3,
          date: "2024-09-20T12:00:00Z",
          value: 16500000,
          method: "Weighted Average",
          analyst: "Sarah Johnson",
          notes: "Quarterly valuation with updated growth projections",
        },
        {
          id: 4,
          date: "2024-06-05T12:00:00Z",
          value: 14800000,
          method: "Weighted Average",
          analyst: "Sarah Johnson",
          notes: "Mid-year valuation review",
        },
        {
          id: 5,
          date: "2024-03-18T12:00:00Z",
          value: 12500000,
          method: "Weighted Average",
          analyst: "Michael Chen",
          notes: "First quarter valuation assessment",
        },
      ]
    : [];

  // Process data
  const businessEntities = entitiesData?.entities || defaultBusinessEntities;
  const metrics = metricsData?.metrics || defaultMetrics;
  const methods = methodsData?.methods || defaultMethods;
  const comparables = comparablesData?.comparables || defaultComparables;
  const projections = projectionsData?.projections || defaultProjections;
  const history = historyData?.history || defaultHistory;

  // Get the currently selected business entity
  const selectedEntity = businessEntities.find((entity) => entity.id === selectedBusinessEntity);

  // If no method is selected, default to the highest confidence method
  if (selectedValuationMethod === null && methods.length > 0) {
    setSelectedValuationMethod(methods.sort((a, b) => b.confidence - a.confidence)[0].id);
  }

  // Calculate the weighted average valuation
  const weightedAverageValuation =
    methods.reduce((sum, method) => {
      return sum + method.result * method.confidence * method.applicability;
    }, 0) / methods.reduce((sum, method) => sum + method.confidence * method.applicability, 0);

  // Calculate valuation change percentage from previous valuation
  const previousValuation = history.length > 1 ? history[1].value : 0;
  const currentValuation = history.length > 0 ? history[0].value : 0;
  const valuationChange = previousValuation
    ? (currentValuation - previousValuation) / previousValuation
    : 0;

  // Get the previous year's revenue for growth calculation
  const previousYearRevenue = selectedEntity
    ? selectedEntity.revenue / (1 + selectedEntity.growthRate)
    : 0;

  return (
    <MainLayout>
      <div className="container py-6 max-w-7xl">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Business Valuation</h1>
            <p className="text-muted-foreground">
              Analyze and track the value of your business using multiple valuation methods
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <Select
              value={selectedBusinessEntity.toString()}
              onValueChange={(value) => setSelectedBusinessEntity(parseInt(value))}
            >
              <SelectTrigger className="w-full md:w-[250px]">
                <Building className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select business entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Business Entities</SelectLabel>
                  {businessEntities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-1" />
                Valuation History
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export Report
              </Button>
              <Button variant="default" size="sm">
                <RefreshCcw className="h-4 w-4 mr-1" />
                Update Valuation
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="dashboard" className="flex items-center gap-1">
                <PieChart className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="methods" className="flex items-center gap-1">
                <Calculator className="h-4 w-4" />
                <span>Valuation Methods</span>
              </TabsTrigger>
              <TabsTrigger value="comparables" className="flex items-center gap-1">
                <BarChart2 className="h-4 w-4" />
                <span>Comparable Companies</span>
              </TabsTrigger>
              <TabsTrigger value="projections" className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>Financial Projections</span>
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              {selectedEntity && (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{selectedEntity.name}</CardTitle>
                        <CardDescription>
                          {selectedEntity.industry} | Founded{" "}
                          {new Date(selectedEntity.founded).toLocaleDateString()} |{" "}
                          {selectedEntity.employees} Employees
                        </CardDescription>
                      </div>
                      <Badge className="text-base px-3 py-1 h-auto">
                        Valuation: {formatCurrency(weightedAverageValuation)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                      <MetricCard
                        title="Annual Revenue"
                        value={formatCurrency(selectedEntity.revenue)}
                        change={{
                          value: previousYearRevenue
                            ? (selectedEntity.revenue - previousYearRevenue) / previousYearRevenue
                            : 0,
                          isPositive: true,
                        }}
                        icon={<DollarSign className="h-8 w-8" />}
                      />
                      <MetricCard
                        title="Profit Margin"
                        value={formatPercentage(selectedEntity.profitMargin)}
                        change={{
                          value: 0.02,
                          isPositive: true,
                        }}
                        icon={<BarChart className="h-8 w-8" />}
                      />
                      <MetricCard
                        title="Growth Rate"
                        value={formatPercentage(selectedEntity.growthRate)}
                        change={{
                          value: 0.04,
                          isPositive: true,
                        }}
                        icon={<TrendingUp className="h-8 w-8" />}
                      />
                      <MetricCard
                        title="Revenue Per Employee"
                        value={formatCurrency(selectedEntity.revenue / selectedEntity.employees)}
                        change={{
                          value: 0.05,
                          isPositive: true,
                        }}
                        icon={<BarChart3 className="h-8 w-8" />}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                        <CardHeader>
                          <CardTitle className="text-lg">Valuation History</CardTitle>
                          <CardDescription>Valuation trend over the past year</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {isLoadingHistory ? (
                            <div className="space-y-2">
                              <Skeleton className="h-[200px] w-full" />
                            </div>
                          ) : (
                            <>
                              <div className="h-[200px] flex items-end space-x-2">
                                {history
                                  .slice()
                                  .reverse()
                                  .map((item, index) => {
                                    const maxVal = Math.max(...history.map((h) => h.value));
                                    const heightPercentage = (item.value / maxVal) * 100;
                                    return (
                                      <div
                                        key={item.id}
                                        className="flex-1 flex flex-col items-center"
                                      >
                                        <div
                                          className="w-full bg-primary/90 rounded-t-sm"
                                          style={{ height: `${heightPercentage}%` }}
                                        ></div>
                                        <div className="text-xs text-muted-foreground mt-1 w-full text-center truncate">
                                          {new Date(item.date).toLocaleDateString(undefined, {
                                            month: "short",
                                            year: "numeric",
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                              <div className="mt-4">
                                <div className="flex justify-between text-sm">
                                  <div>
                                    <p className="font-medium">Current Valuation</p>
                                    <p className="text-xl font-bold">
                                      {formatCurrency(history[0]?.value || 0)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">Change (1 Year)</p>
                                    <p
                                      className={`text-xl font-bold ${
                                        valuationChange >= 0 ? "text-green-500" : "text-red-500"
                                      }`}
                                    >
                                      {valuationChange >= 0 ? "+" : ""}
                                      {formatPercentage(valuationChange)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="col-span-1 md:col-span-2">
                        <CardHeader>
                          <CardTitle className="text-lg">Valuation Metrics</CardTitle>
                          <CardDescription>
                            Key metrics affecting business valuation
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {isLoadingMetrics ? (
                            <div className="space-y-2">
                              {Array(4)
                                .fill(0)
                                .map((_, i) => (
                                  <Skeleton key={i} className="h-8 w-full" />
                                ))}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {metrics.slice(0, 4).map((metric) => {
                                const isBetterThanBenchmark =
                                  metric.name.includes("Cost") || metric.name.includes("Churn")
                                    ? metric.value < metric.benchmark
                                    : metric.value > metric.benchmark;

                                return (
                                  <div key={metric.id} className="space-y-1">
                                    <div className="flex justify-between">
                                      <div className="flex items-center">
                                        <span className="font-medium">{metric.name}</span>
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <span>
                                                <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p className="max-w-xs">{metric.description}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium">
                                          {metric.name.includes("Rate") ||
                                          metric.name.includes("Margin") ||
                                          metric.name.includes("ROA") ||
                                          metric.name.includes("Cash Flow")
                                            ? formatPercentage(metric.value)
                                            : metric.name.includes("Cost") ||
                                              metric.name.includes("Value")
                                            ? formatCurrency(metric.value)
                                            : metric.value}
                                        </span>
                                        <span
                                          className={`text-xs ${
                                            isBetterThanBenchmark
                                              ? "text-green-500"
                                              : "text-red-500"
                                          }`}
                                        >
                                          {isBetterThanBenchmark ? (
                                            <ArrowUp className="h-3 w-3" />
                                          ) : (
                                            <ArrowDown className="h-3 w-3" />
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Progress
                                        value={
                                          isBetterThanBenchmark
                                            ? (metric.value / (metric.benchmark * 1.5)) * 100
                                            : (metric.benchmark / (metric.value * 1.5)) * 100
                                        }
                                        className="h-2"
                                      />
                                      <span className="text-xs text-muted-foreground">
                                        Benchmark:{" "}
                                        {metric.name.includes("Rate") ||
                                        metric.name.includes("Margin") ||
                                        metric.name.includes("ROA") ||
                                        metric.name.includes("Cash Flow")
                                          ? formatPercentage(metric.benchmark)
                                          : metric.name.includes("Cost") ||
                                            metric.name.includes("Value")
                                          ? formatCurrency(metric.benchmark)
                                          : metric.benchmark}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}

                              <Button variant="outline" size="sm" className="w-full">
                                View All Metrics
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Valuation Methods</CardTitle>
                    <CardDescription>Different approaches to valuing your business</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingMethods ? (
                      <div className="space-y-4">
                        {Array(3)
                          .fill(0)
                          .map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full" />
                          ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {methods.slice(0, 3).map((method) => (
                          <div
                            key={method.id}
                            className="flex justify-between items-center p-3 border rounded-md"
                          >
                            <div className="space-y-1">
                              <div className="font-medium">{method.name}</div>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  className={
                                    method.confidence >= 0.7
                                      ? "bg-green-500"
                                      : method.confidence >= 0.4
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                  }
                                >
                                  {Math.round(method.confidence * 100)}% Confidence
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {Math.round(method.applicability * 100)}% Applicable
                                </span>
                              </div>
                            </div>
                            <div className="text-lg font-bold">{formatCurrency(method.result)}</div>
                          </div>
                        ))}

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setActiveTab("methods")}
                        >
                          View All Methods
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Comparable Companies</CardTitle>
                    <CardDescription>
                      Similar businesses used for market-based valuation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingComparables ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Skeleton key={i} className="h-6 w-full mt-2" />
                          ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="overflow-x-auto -mx-6">
                          <Table className="w-full">
                            <TableHeader>
                              <TableRow>
                                <TableHead>Company</TableHead>
                                <TableHead className="text-right">Revenue</TableHead>
                                <TableHead className="text-right">Rev Multiple</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {comparables.slice(0, 3).map((company) => (
                                <TableRow key={company.id}>
                                  <TableCell className="font-medium">{company.name}</TableCell>
                                  <TableCell className="text-right">
                                    {formatCurrency(company.revenue)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {company.revenueMultiple
                                      ? `${company.revenueMultiple.toFixed(1)}x`
                                      : "N/A"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setActiveTab("comparables")}
                        >
                          View All Comparables
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Valuation Methods Tab */}
            <TabsContent value="methods" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Valuation Methods</CardTitle>
                      <CardDescription>
                        Select a valuation method to view detailed calculations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingMethods ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Array(4)
                            .fill(0)
                            .map((_, i) => (
                              <Skeleton key={i} className="h-[180px] w-full" />
                            ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {methods.map((method) => (
                            <ValuationMethodCard
                              key={method.id}
                              method={method}
                              onSelect={() => setSelectedValuationMethod(method.id)}
                              isSelected={selectedValuationMethod === method.id}
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Weighted Average Valuation</CardTitle>
                      <CardDescription>
                        Combined valuation based on multiple methods
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex flex-col items-center">
                          <div className="text-3xl font-bold mb-2">
                            {formatCurrency(weightedAverageValuation)}
                          </div>
                          <div
                            className={`flex items-center text-sm ${
                              valuationChange >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {valuationChange >= 0 ? (
                              <ArrowUp className="h-4 w-4 mr-1" />
                            ) : (
                              <ArrowDown className="h-4 w-4 mr-1" />
                            )}
                            {formatPercentage(Math.abs(valuationChange))} from previous valuation
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Method Weights</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                              className="h-8 px-2 text-xs"
                            >
                              {showAdvancedSettings ? "Hide" : "Show"} Advanced Settings
                            </Button>
                          </div>

                          {showAdvancedSettings && (
                            <div className="space-y-3 pt-2">
                              {methods.map((method) => (
                                <div key={method.id} className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <Label htmlFor={`weight-${method.id}`} className="text-xs">
                                      {method.name}
                                    </Label>
                                    <span className="text-xs">
                                      {method.confidence && method.applicability
                                        ? (method.confidence * method.applicability).toFixed(2)
                                        : "0.00"}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Slider
                                      id={`weight-${method.id}`}
                                      defaultValue={[method.confidence * 100]}
                                      max={100}
                                      step={1}
                                      className="flex-1"
                                    />
                                    <Input
                                      type="number"
                                      className="w-16 h-7 text-xs"
                                      value={Math.round(method.confidence * 100)}
                                      onChange={() => {}}
                                    />
                                  </div>
                                </div>
                              ))}

                              <div className="pt-2">
                                <Button size="sm" className="w-full">
                                  Apply Weights
                                </Button>
                              </div>
                            </div>
                          )}

                          {!showAdvancedSettings && (
                            <div className="space-y-2 pt-2">
                              {methods.map((method) => (
                                <div key={method.id} className="flex justify-between items-center">
                                  <span className="text-sm">{method.name}</span>
                                  <Badge variant="outline">
                                    {method.confidence && method.applicability
                                      ? (method.confidence * method.applicability).toFixed(2)
                                      : "0.00"}{" "}
                                    Weight
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Calculation Details</h3>

                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Date Calculated:</span>
                              <span>{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Methods Used:</span>
                              <span>{methods.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Confidence Level:</span>
                              <span
                                className={
                                  methods.length > 0
                                    ? methods.reduce((sum, m) => sum + m.confidence, 0) /
                                        methods.length >=
                                      0.7
                                      ? "text-green-500"
                                      : "text-amber-500"
                                    : ""
                                }
                              >
                                {methods.length > 0
                                  ? `${Math.round(
                                      (methods.reduce((sum, m) => sum + m.confidence, 0) /
                                        methods.length) *
                                        100
                                    )}%`
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button variant="outline" size="sm" className="w-full">
                          <FileDown className="h-4 w-4 mr-1" />
                          Export Valuation Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Method Details */}
              {selectedValuationMethod !== null && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {methods.find((m) => m.id === selectedValuationMethod)?.name} Details
                    </CardTitle>
                    <CardDescription>
                      {methods.find((m) => m.id === selectedValuationMethod)?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Valuation Result</h3>
                          <div className="text-3xl font-bold">
                            {formatCurrency(
                              methods.find((m) => m.id === selectedValuationMethod)?.result || 0
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">Key Metrics Used</h3>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Revenue:</span>
                              <span>{formatCurrency(selectedEntity?.revenue || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">EBITDA:</span>
                              <span>{formatCurrency((selectedEntity?.revenue || 0) * 0.22)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Growth Rate:</span>
                              <span>{formatPercentage(selectedEntity?.growthRate || 0)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">Applied Multipliers</h3>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Revenue Multiple:</span>
                              <span>5.0x</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">EBITDA Multiple:</span>
                              <span>12.5x</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Discount Rate:</span>
                              <span>15.0%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium mb-3">Calculation Steps</h3>
                          <div className="space-y-2">
                            <div className="p-3 border rounded-md">
                              <h4 className="text-sm font-medium">1. Base Calculation</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {selectedValuationMethod === 1
                                  ? "Sum of discounted projected future cash flows plus terminal value."
                                  : selectedValuationMethod === 2
                                  ? "Average of comparable company valuation multiples applied to revenue and EBITDA."
                                  : selectedValuationMethod === 3
                                  ? "Current annual revenue multiplied by industry-standard revenue multiple."
                                  : selectedValuationMethod === 4
                                  ? "Current annual EBITDA multiplied by industry-standard EBITDA multiple."
                                  : "Total assets minus total liabilities, adjusted for market value of assets."}
                              </p>
                            </div>

                            <div className="p-3 border rounded-md">
                              <h4 className="text-sm font-medium">2. Risk Adjustments</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {selectedValuationMethod === 1
                                  ? "Applied discount rate based on business risk profile and growth stability."
                                  : selectedValuationMethod === 2
                                  ? "Adjusted comparable multiples based on business size, growth rate, and profit margins."
                                  : "Applied size, liquidity, and industry risk discounts to standard multiples."}
                              </p>
                            </div>

                            <div className="p-3 border rounded-md">
                              <h4 className="text-sm font-medium">3. Final Calculation</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {selectedValuationMethod === 1
                                  ? "Sum of 5-year discounted cash flows plus terminal value calculation."
                                  : selectedValuationMethod === 2
                                  ? "Weighted average of revenue-based and EBITDA-based valuations."
                                  : selectedValuationMethod === 3
                                  ? `${formatCurrency(
                                      selectedEntity?.revenue || 0
                                    )} × 5.0 = ${formatCurrency(
                                      (selectedEntity?.revenue || 0) * 5
                                    )}`
                                  : selectedValuationMethod === 4
                                  ? `${formatCurrency(
                                      (selectedEntity?.revenue || 0) * 0.22
                                    )} × 12.5 = ${formatCurrency(
                                      (selectedEntity?.revenue || 0) * 0.22 * 12.5
                                    )}`
                                  : "Total adjusted asset value minus liabilities with control premium added."}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-3">
                            Methodology Strengths & Weaknesses
                          </h3>
                          <div className="p-3 border rounded-md space-y-3">
                            <div>
                              <h4 className="text-sm font-medium flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                Strengths
                              </h4>
                              <ul className="text-xs text-muted-foreground mt-1 ml-4 list-disc space-y-1">
                                {selectedValuationMethod === 1 ? (
                                  <>
                                    <li>Considers future growth potential and cash flows</li>
                                    <li>Accounts for the time value of money</li>
                                    <li>Industry standard for growth companies</li>
                                    <li>Highly customizable to business specifics</li>
                                  </>
                                ) : selectedValuationMethod === 2 ? (
                                  <>
                                    <li>Based on actual market valuations</li>
                                    <li>Easy to understand and communicate</li>
                                    <li>Accounts for industry-specific factors</li>
                                    <li>Less reliant on projections and assumptions</li>
                                  </>
                                ) : selectedValuationMethod === 3 ? (
                                  <>
                                    <li>Simple and straightforward calculation</li>
                                    <li>Based on reliable revenue figures</li>
                                    <li>Useful for early-stage companies</li>
                                    <li>Industry-specific benchmarks available</li>
                                  </>
                                ) : selectedValuationMethod === 4 ? (
                                  <>
                                    <li>Focuses on earnings power, not just revenue</li>
                                    <li>Accounts for operational efficiency</li>
                                    <li>Standard method for mature businesses</li>
                                    <li>Less affected by accounting differences</li>
                                  </>
                                ) : (
                                  <>
                                    <li>Based on tangible, verifiable assets</li>
                                    <li>Less reliant on projections</li>
                                    <li>Useful for asset-heavy businesses</li>
                                    <li>Clear valuation floor</li>
                                  </>
                                )}
                              </ul>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium flex items-center">
                                <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                                Weaknesses
                              </h4>
                              <ul className="text-xs text-muted-foreground mt-1 ml-4 list-disc space-y-1">
                                {selectedValuationMethod === 1 ? (
                                  <>
                                    <li>Highly sensitive to assumptions and projections</li>
                                    <li>Requires detailed future forecasts</li>
                                    <li>Discount rate determination is subjective</li>
                                    <li>Complex calculations can obscure key factors</li>
                                  </>
                                ) : selectedValuationMethod === 2 ? (
                                  <>
                                    <li>Requires truly comparable companies</li>
                                    <li>Market conditions can skew multiples</li>
                                    <li>May not fully capture unique business attributes</li>
                                    <li>Limited by available public company data</li>
                                  </>
                                ) : selectedValuationMethod === 3 ? (
                                  <>
                                    <li>Ignores profitability and costs</li>
                                    <li>Doesn't account for debt levels</li>
                                    <li>Same multiple applied to different quality revenues</li>
                                    <li>Can overvalue high-revenue, low-profit businesses</li>
                                  </>
                                ) : selectedValuationMethod === 4 ? (
                                  <>
                                    <li>Can be manipulated by accounting practices</li>
                                    <li>May not reflect future growth potential</li>
                                    <li>Affected by one-time expenses or gains</li>
                                    <li>Doesn't account for capital expenditure requirements</li>
                                  </>
                                ) : (
                                  <>
                                    <li>Ignores intangible assets and goodwill</li>
                                    <li>Doesn't account for future earning potential</li>
                                    <li>Book values may differ from market values</li>
                                    <li>Undervalues asset-light, high-growth businesses</li>
                                  </>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Comparable Companies Tab */}
            <TabsContent value="comparables" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                    <div>
                      <CardTitle className="text-lg">Comparable Companies Analysis</CardTitle>
                      <CardDescription>
                        Market-based valuation using similar companies in your industry
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Company
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingComparables ? (
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-full" />
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="overflow-x-auto -mx-6">
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Company</TableHead>
                              <TableHead className="text-right">Revenue</TableHead>
                              <TableHead className="text-right">Revenue Multiple</TableHead>
                              <TableHead className="text-right">EBITDA Multiple</TableHead>
                              <TableHead className="text-right">P/E Ratio</TableHead>
                              <TableHead className="text-right">Net Income</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {comparables.map((company) => (
                              <ComparableCompanyRow key={company.id} company={company} />
                            ))}
                            {/* Add your business for comparison */}
                            <TableRow className="bg-primary/5 border-primary">
                              <TableCell className="font-medium">
                                {selectedEntity?.name || "Your Business"}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(selectedEntity?.revenue || 0)}
                              </TableCell>
                              <TableCell className="text-right">
                                {(
                                  weightedAverageValuation / (selectedEntity?.revenue || 1)
                                ).toFixed(1)}
                                x
                              </TableCell>
                              <TableCell className="text-right">
                                {(
                                  weightedAverageValuation /
                                  ((selectedEntity?.revenue || 0) * 0.22)
                                ).toFixed(1)}
                                x
                              </TableCell>
                              <TableCell className="text-right">
                                {(
                                  weightedAverageValuation /
                                  ((selectedEntity?.revenue || 0) * selectedEntity?.profitMargin)
                                ).toFixed(1)}
                                x
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(
                                  (selectedEntity?.revenue || 0) *
                                    (selectedEntity?.profitMargin || 0)
                                )}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              Average Revenue Multiple
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {(
                                comparables.reduce((sum, comp) => sum + comp.revenueMultiple, 0) /
                                comparables.length
                              ).toFixed(1)}
                              x
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Industry standard: 4.5x - 5.5x
                            </p>
                            <div className="mt-2">
                              <div className="text-sm font-medium">Your Implied Valuation:</div>
                              <div className="text-xl font-bold">
                                {formatCurrency(
                                  (selectedEntity?.revenue || 0) *
                                    (comparables.reduce(
                                      (sum, comp) => sum + comp.revenueMultiple,
                                      0
                                    ) /
                                      comparables.length)
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              Average EBITDA Multiple
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {(
                                comparables.reduce((sum, comp) => sum + comp.ebitdaMultiple, 0) /
                                comparables.length
                              ).toFixed(1)}
                              x
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Industry standard: 10.5x - 13.5x
                            </p>
                            <div className="mt-2">
                              <div className="text-sm font-medium">Your Implied Valuation:</div>
                              <div className="text-xl font-bold">
                                {formatCurrency(
                                  (selectedEntity?.revenue || 0) *
                                    0.22 *
                                    (comparables.reduce(
                                      (sum, comp) => sum + comp.ebitdaMultiple,
                                      0
                                    ) /
                                      comparables.length)
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              Premium/Discount Analysis
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Revenue Multiple:</span>
                                <Badge
                                  className={
                                    weightedAverageValuation / (selectedEntity?.revenue || 1) >
                                    comparables.reduce(
                                      (sum, comp) => sum + comp.revenueMultiple,
                                      0
                                    ) /
                                      comparables.length
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }
                                >
                                  {(
                                    (weightedAverageValuation /
                                      (selectedEntity?.revenue || 1) /
                                      (comparables.reduce(
                                        (sum, comp) => sum + comp.revenueMultiple,
                                        0
                                      ) /
                                        comparables.length) -
                                      1) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </Badge>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-sm">EBITDA Multiple:</span>
                                <Badge
                                  className={
                                    weightedAverageValuation /
                                      ((selectedEntity?.revenue || 0) * 0.22) >
                                    comparables.reduce(
                                      (sum, comp) => sum + comp.ebitdaMultiple,
                                      0
                                    ) /
                                      comparables.length
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }
                                >
                                  {(
                                    (weightedAverageValuation /
                                      ((selectedEntity?.revenue || 0) * 0.22) /
                                      (comparables.reduce(
                                        (sum, comp) => sum + comp.ebitdaMultiple,
                                        0
                                      ) /
                                        comparables.length) -
                                      1) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </Badge>
                              </div>

                              <Separator className="my-2" />

                              <div className="text-sm">Factors affecting premium/discount:</div>
                              <ul className="text-xs text-muted-foreground ml-4 list-disc space-y-1">
                                <li>Higher growth rate than peers (+15%)</li>
                                <li>Above-average profit margins (+10%)</li>
                                <li>Smaller scale than public companies (-15%)</li>
                                <li>Lower liquidity as private company (-20%)</li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Projections Tab */}
            <TabsContent value="projections" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                    <div>
                      <CardTitle className="text-lg">Financial Projections</CardTitle>
                      <CardDescription>
                        5-year projections used for discounted cash flow valuation
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Adjust Assumptions
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingProjections ? (
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-full" />
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="overflow-x-auto -mx-6">
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Year</TableHead>
                              <TableHead className="text-right">Revenue</TableHead>
                              <TableHead className="text-right">EBITDA</TableHead>
                              <TableHead className="text-right">Net Income</TableHead>
                              <TableHead className="text-right">Cash Flow</TableHead>
                              <TableHead className="text-right">Growth Rate</TableHead>
                              <TableHead className="text-right">Present Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {projections.map((projection) => (
                              <TableRow key={projection.year}>
                                <TableCell>{projection.year}</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(projection.revenue)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(projection.ebitda)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(projection.netIncome)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(projection.cashFlow)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatPercentage(projection.growthRate)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(projection.presentValue)}
                                </TableCell>
                              </TableRow>
                            ))}
                            {projections && projections.length > 0 && (
                              <TableRow className="bg-primary/5 font-medium">
                                <TableCell>Terminal Value</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(
                                    projections[projections.length - 1]?.revenue * 1.03
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(
                                    projections[projections.length - 1]?.ebitda * 1.03
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(
                                    projections[projections.length - 1]?.netIncome * 1.03
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(
                                    projections[projections.length - 1]?.cashFlow * 1.03
                                  )}
                                </TableCell>
                                <TableCell className="text-right">3.0%</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(
                                    ((projections[projections.length - 1]?.cashFlow * 1.03) /
                                      0.12) *
                                      0.5
                                  )}
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm font-medium">
                              DCF Valuation Summary
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Sum of Present Values:</span>
                                <span className="font-bold">
                                  {formatCurrency(
                                    projections.reduce((sum, p) => sum + p.presentValue, 0)
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Terminal Value (PV):</span>
                                <span className="font-bold">
                                  {formatCurrency(
                                    ((projections[projections.length - 1]?.cashFlow * 1.03) /
                                      0.12) *
                                      0.5
                                  )}
                                </span>
                              </div>
                              <Separator />
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Enterprise Value:</span>
                                <span className="font-bold">
                                  {formatCurrency(
                                    projections.reduce((sum, p) => sum + p.presentValue, 0) +
                                      ((projections[projections.length - 1]?.cashFlow * 1.03) /
                                        0.12) *
                                        0.5
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Less: Net Debt:</span>
                                <span className="font-bold">{formatCurrency(250000)}</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Equity Value:</span>
                                <span className="text-xl font-bold">
                                  {formatCurrency(
                                    projections.reduce((sum, p) => sum + p.presentValue, 0) +
                                      ((projections[projections.length - 1]?.cashFlow * 1.03) /
                                        0.12) *
                                        0.5 -
                                      250000
                                  )}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm font-medium">Key Assumptions</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Initial Growth Rate:</span>
                                <Badge variant="outline">
                                  {formatPercentage(projections[0]?.growthRate)}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Growth Rate Decay:</span>
                                <Badge variant="outline">-3.5% per year</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Terminal Growth Rate:</span>
                                <Badge variant="outline">3.0%</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">EBITDA Margin:</span>
                                <Badge variant="outline">
                                  {formatPercentage(
                                    projections[0]?.ebitda / projections[0]?.revenue
                                  )}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Discount Rate (WACC):</span>
                                <Badge variant="outline">15.0%</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Terminal Multiple:</span>
                                <Badge variant="outline">8.3x EBITDA</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Tax Rate:</span>
                                <Badge variant="outline">25.0%</Badge>
                              </div>
                              <Button variant="outline" size="sm" className="w-full mt-2">
                                <Sliders className="h-4 w-4 mr-1" />
                                Modify Assumptions
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm font-medium">
                            Sensitivity Analysis
                          </CardTitle>
                          <CardDescription>
                            How changes in key assumptions affect business valuation
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto -mx-6">
                            <Table className="w-full">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[150px]">Terminal Growth</TableHead>
                                  <TableHead className="text-center">12.0%</TableHead>
                                  <TableHead className="text-center">13.0%</TableHead>
                                  <TableHead className="text-center">14.0%</TableHead>
                                  <TableHead className="text-center">15.0%</TableHead>
                                  <TableHead className="text-center">16.0%</TableHead>
                                  <TableHead className="text-center">17.0%</TableHead>
                                  <TableHead className="text-center">18.0%</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">2.0%</TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(19_800_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(19_200_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(18_600_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(18_100_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(17_600_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(17_200_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(16_800_000)}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">2.5%</TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(20_400_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(19_700_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(19_100_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(18_500_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(18_000_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(17_500_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(17_100_000)}
                                  </TableCell>
                                </TableRow>
                                <TableRow className="bg-primary/5">
                                  <TableCell className="font-medium">3.0%</TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(21_000_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(20_300_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(19_600_000)}
                                  </TableCell>
                                  <TableCell className="text-center font-bold">
                                    {formatCurrency(19_000_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(18_400_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(17_900_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(17_400_000)}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">3.5%</TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(21_700_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(20_900_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(20_200_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(19_500_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(18_900_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(18_300_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(17_800_000)}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">4.0%</TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(22_500_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(21_600_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(20_800_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(20_100_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(19_400_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(18_800_000)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatCurrency(18_200_000)}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2 text-center">
                            Horizontal: Discount Rate (WACC) | Vertical: Terminal Growth Rate | Base
                            Case: 15.0% WACC, 3.0% Terminal Growth
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
