import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DownloadCloud, FileText, BarChart2, Users, PieChart, Bell, Calendar, FileImage, ChevronDown, MoreHorizontal, Info, HelpCircle, Download, Share, Plus, Mail, Printer, Eye, Bookmark, BookmarkCheck, MessageSquare, Lock, Unlock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { PartnerDashboard } from "@/components/partner-portal/PartnerDashboard";
import { MonthlyReports } from "@/components/partner-portal/MonthlyReports";
import { CapTable } from "@/components/partner-portal/CapTable";
import { Announcements } from "@/components/partner-portal/Announcements";
import { AssetsLibrary } from "@/components/partner-portal/AssetsLibrary";

// Company branding colors for each business entity
const COMPANY_BRANDING = {
  'dmp': {
    name: 'Digital Merch Pros',
    logo: '/logos/dmp-logo.png',
    logoFallback: 'DMP',
    primaryColor: '#4f46e5', // Indigo
    secondaryColor: '#9333ea', // Purple
    gradient: 'from-indigo-600 to-purple-600'
  },
  'mystery-hype': {
    name: 'Mystery Hype',
    logo: '/logos/mystery-hype-logo.png',
    logoFallback: 'MH',
    primaryColor: '#f97316', // Orange
    secondaryColor: '#ec4899', // Pink
    gradient: 'from-orange-500 to-pink-500'
  },
  'lonestar': {
    name: 'Lone Star Custom Clothing',
    logo: '/logos/lonestar-logo.png',
    logoFallback: 'LS',
    primaryColor: '#0f766e', // Teal
    secondaryColor: '#ca8a04', // Yellow
    gradient: 'from-teal-600 to-yellow-600' 
  },
  'alcoease': {
    name: 'Alcoeaze',
    logo: '/logos/alcoease-logo.png',
    logoFallback: 'AE',
    primaryColor: '#0284c7', // Sky
    secondaryColor: '#2563eb', // Blue
    gradient: 'from-sky-500 to-blue-600'
  },
  'hide-cafe': {
    name: 'Hide Cafe Bars',
    logo: '/logos/hide-cafe-logo.png',
    logoFallback: 'HC',
    primaryColor: '#a21caf', // Fuchsia
    secondaryColor: '#7c3aed', // Violet
    gradient: 'from-fuchsia-600 to-violet-600'
  }
};

type CompanyId = keyof typeof COMPANY_BRANDING;

export default function PartnerPortal() {
  const [selectedCompany, setSelectedCompany] = useState<CompanyId>('dmp');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1),
    to: new Date()
  });
  const { theme } = useTheme();
  
  const companyBranding = COMPANY_BRANDING[selectedCompany];
  
  // Handle company change
  const handleCompanyChange = (value: CompanyId) => {
    setSelectedCompany(value);
  };
  
  // Export digest
  const handleExportDigest = () => {
    // In a real implementation, this would generate a PDF with all relevant data
    // Logger removed for performance optimization
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Portal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div className="flex items-center gap-4">
          <div className={`relative h-14 w-14 overflow-hidden rounded-md bg-gradient-to-br ${companyBranding.gradient}`}>
            <Avatar className="h-14 w-14">
              <AvatarImage src={companyBranding.logo} alt={companyBranding.name} />
              <AvatarFallback>{companyBranding.logoFallback}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{companyBranding.name}</h1>
            <p className="text-muted-foreground">Partner & Investor Portal</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedCompany} onValueChange={handleCompanyChange}>
            <SelectTrigger className="min-w-[240px]">
              <SelectValue placeholder="Select Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dmp">Digital Merch Pros</SelectItem>
              <SelectItem value="mystery-hype">Mystery Hype</SelectItem>
              <SelectItem value="lonestar">Lone Star Custom Clothing</SelectItem>
              <SelectItem value="alcoease">Alcoeaze</SelectItem>
              <SelectItem value="hide-cafe">Hide Cafe Bars</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <DownloadCloud className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportDigest} className="cursor-pointer">
                <Download className="mr-2 h-4 w-4" />
                <span>Download Digest PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Mail className="mr-2 h-4 w-4" />
                <span>Email to All Partners</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Printer className="mr-2 h-4 w-4" />
                <span>Print Report</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Welcome Banner */}
      <Card className="mb-8 bg-gradient-to-r from-muted/50 via-muted to-muted/50 border-none overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl font-bold mb-2">Welcome to Your Partner Portal</h2>
              <p className="text-muted-foreground max-w-3xl">
                Access business insights, reports, equity information, and company assets for {companyBranding.name}. This secure portal provides you with real-time data and important updates.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-background border-none">
                <Lock className="h-3.5 w-3.5 mr-1" /> 
                Secure Access
              </Badge>
              <Badge variant="outline" className="bg-background border-none">
                <Bell className="h-3.5 w-3.5 mr-1" /> 
                3 New Updates
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Date Range Picker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium mb-1">Data Range</h3>
          <p className="text-sm text-muted-foreground">Select a time period for the displayed metrics</p>
        </div>
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      </div>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="capTable" className="gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Cap Table</span>
          </TabsTrigger>
          <TabsTrigger value="announcements" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Updates</span>
          </TabsTrigger>
          <TabsTrigger value="assets" className="gap-2">
            <FileImage className="h-4 w-4" />
            <span className="hidden sm:inline">Assets</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <PartnerDashboard 
            companyId={selectedCompany} 
            dateRange={dateRange} 
            companyBranding={companyBranding} 
          />
        </TabsContent>
        
        {/* Monthly Reports Tab */}
        <TabsContent value="reports">
          <MonthlyReports 
            companyId={selectedCompany} 
            companyBranding={companyBranding} 
          />
        </TabsContent>
        
        {/* Cap Table Tab */}
        <TabsContent value="capTable">
          <CapTable 
            companyId={selectedCompany} 
            companyBranding={companyBranding} 
          />
        </TabsContent>
        
        {/* Announcements Tab */}
        <TabsContent value="announcements">
          <Announcements 
            companyId={selectedCompany} 
            companyBranding={companyBranding} 
          />
        </TabsContent>
        
        {/* Assets & Docs Tab */}
        <TabsContent value="assets">
          <AssetsLibrary 
            companyId={selectedCompany} 
            companyBranding={companyBranding} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}