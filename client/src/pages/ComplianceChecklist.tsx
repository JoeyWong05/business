import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useDemoMode } from "@/contexts/DemoModeContext";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Search,
  Shield,
  FileBadge,
  FileText,
  Building,
  Users,
  CreditCard,
  DollarSign,
  GraduationCap,
  Scale,
  AlertTriangle,
  BarChart,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Plus,
  Info,
  CheckSquare
} from "lucide-react";

// Types for compliance items
interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  entity: string;
  status: 'complete' | 'pending' | 'overdue' | 'not-applicable';
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  lastUpdated: string;
  nextAction?: string;
  notes?: string;
}

export default function ComplianceChecklist() {
  const { demoMode } = useDemoMode();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEntity, setSelectedEntity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Demo data for compliance checklist
  const demoComplianceItems: ComplianceItem[] = [
    {
      id: "comp-001",
      title: "Annual Report Filing",
      description: "Submit annual report to the Secretary of State",
      category: "state-compliance",
      dueDate: "2024-04-15",
      entity: "Digital Merch Pros",
      status: "pending",
      priority: "high",
      assignedTo: "John Smith",
      lastUpdated: "2024-03-10",
      nextAction: "Prepare financial statements for report",
      notes: "Annual fee of $50 required with filing"
    },
    {
      id: "comp-002",
      title: "Business License Renewal",
      description: "Renew local business license for primary location",
      category: "licenses",
      dueDate: "2024-05-31",
      entity: "Digital Merch Pros",
      status: "pending",
      priority: "high",
      assignedTo: "Sarah Johnson",
      lastUpdated: "2024-03-05",
      nextAction: "Submit renewal application"
    },
    {
      id: "comp-003",
      title: "Federal Income Tax Filing",
      description: "File federal income tax return",
      category: "taxation",
      dueDate: "2024-04-15",
      entity: "Digital Merch Pros",
      status: "pending",
      priority: "high",
      assignedTo: "Alex Wong",
      lastUpdated: "2024-03-12",
      nextAction: "Finalize tax return with accountant"
    },
    {
      id: "comp-004",
      title: "State Income Tax Filing",
      description: "File state income tax return",
      category: "taxation",
      dueDate: "2024-04-15",
      entity: "Digital Merch Pros",
      status: "pending",
      priority: "high",
      assignedTo: "Alex Wong",
      lastUpdated: "2024-03-12"
    },
    {
      id: "comp-005",
      title: "Quarterly Sales Tax Filing",
      description: "Submit Q1 sales tax collection report",
      category: "taxation",
      dueDate: "2024-04-30",
      entity: "Digital Merch Pros",
      status: "pending",
      priority: "medium",
      assignedTo: "Alex Wong",
      lastUpdated: "2024-03-08",
      nextAction: "Finalize sales figures for Q1"
    },
    {
      id: "comp-006",
      title: "Employment Eligibility Verification (I-9)",
      description: "Verify employment eligibility for all new hires",
      category: "employment",
      dueDate: "2024-03-15",
      entity: "Digital Merch Pros",
      status: "complete",
      priority: "medium",
      assignedTo: "Maria Garcia",
      lastUpdated: "2024-03-15",
      notes: "Completed for all Q1 new hires"
    },
    {
      id: "comp-007",
      title: "Workers' Compensation Insurance",
      description: "Maintain active workers' compensation insurance policy",
      category: "insurance",
      dueDate: "2024-06-30",
      entity: "Digital Merch Pros",
      status: "complete",
      priority: "medium",
      assignedTo: "Sarah Johnson",
      lastUpdated: "2024-01-05",
      notes: "Policy renewed through June 2024"
    },
    {
      id: "comp-008",
      title: "Privacy Policy Update",
      description: "Review and update website privacy policy",
      category: "privacy",
      dueDate: "2024-02-28",
      entity: "Digital Merch Pros",
      status: "overdue",
      priority: "medium",
      assignedTo: "Michael Lee",
      lastUpdated: "2024-01-20",
      nextAction: "Complete legal review of updated policy"
    },
    {
      id: "comp-009",
      title: "Data Breach Response Plan",
      description: "Develop and document data breach response procedures",
      category: "privacy",
      dueDate: "2024-04-30",
      entity: "Digital Merch Pros",
      status: "pending",
      priority: "high",
      assignedTo: "Michael Lee",
      lastUpdated: "2024-03-01",
      nextAction: "Draft initial plan for review"
    },
    {
      id: "comp-010",
      title: "Health & Safety Compliance Review",
      description: "Conduct quarterly workplace safety assessment",
      category: "workplace-safety",
      dueDate: "2024-03-31",
      entity: "Digital Merch Pros",
      status: "complete",
      priority: "medium",
      assignedTo: "Maria Garcia",
      lastUpdated: "2024-03-25",
      notes: "All safety equipment and procedures up to date"
    },
    {
      id: "comp-011",
      title: "ADA Compliance Audit",
      description: "Audit website and physical locations for ADA compliance",
      category: "accessibility",
      dueDate: "2024-05-15",
      entity: "Digital Merch Pros",
      status: "pending",
      priority: "medium",
      assignedTo: "Michael Lee",
      lastUpdated: "2024-02-15",
      nextAction: "Schedule website accessibility assessment"
    },
    {
      id: "comp-012",
      title: "Foreign Qualification Renewal",
      description: "Renew foreign qualification in Texas",
      category: "state-compliance",
      dueDate: "2024-07-31",
      entity: "Mystery Hype",
      status: "pending",
      priority: "medium",
      assignedTo: "John Smith",
      lastUpdated: "2024-03-10"
    },
    {
      id: "comp-013",
      title: "Cybersecurity Policy Review",
      description: "Annual review of cybersecurity policies and procedures",
      category: "data-security",
      dueDate: "2024-04-30",
      entity: "Digital Merch Pros",
      status: "pending",
      priority: "high",
      assignedTo: "Michael Lee",
      lastUpdated: "2024-03-15",
      nextAction: "Schedule security assessment with IT vendor"
    },
    {
      id: "comp-014",
      title: "Trademark Renewal",
      description: "Renew primary trademark registration",
      category: "intellectual-property",
      dueDate: "2024-08-15",
      entity: "Mystery Hype",
      status: "pending",
      priority: "low",
      assignedTo: "John Smith",
      lastUpdated: "2024-02-28"
    },
    {
      id: "comp-015",
      title: "Sexual Harassment Training",
      description: "Conduct annual sexual harassment prevention training",
      category: "employment",
      dueDate: "2024-06-30",
      entity: "Digital Merch Pros",
      status: "pending",
      priority: "medium",
      assignedTo: "Maria Garcia",
      lastUpdated: "2024-03-01",
      nextAction: "Schedule training sessions for all departments"
    },
  ];

  // Categories for the filter select
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "state-compliance", label: "State Compliance" },
    { value: "licenses", label: "Licenses & Permits" },
    { value: "taxation", label: "Taxation" },
    { value: "employment", label: "Employment" },
    { value: "insurance", label: "Insurance" },
    { value: "privacy", label: "Privacy & Data" },
    { value: "workplace-safety", label: "Workplace Safety" },
    { value: "accessibility", label: "Accessibility" },
    { value: "data-security", label: "Data Security" },
    { value: "intellectual-property", label: "Intellectual Property" }
  ];

  // Business entities
  const entities = [
    { value: "all", label: "All Entities" },
    { value: "Digital Merch Pros", label: "Digital Merch Pros" },
    { value: "Mystery Hype", label: "Mystery Hype" },
    { value: "Lone Star Custom Clothing", label: "Lone Star Custom Clothing" },
    { value: "Alcoeaze", label: "Alcoeaze" },
    { value: "Hide Cafe Bars", label: "Hide Cafe Bars" }
  ];

  // Status options
  const statuses = [
    { value: "all", label: "All Statuses" },
    { value: "complete", label: "Complete" },
    { value: "pending", label: "Pending" },
    { value: "overdue", label: "Overdue" },
    { value: "not-applicable", label: "Not Applicable" }
  ];

  // Priority options
  const priorities = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
  ];

  // Filter compliance items based on selected filters and search query
  const filteredComplianceItems = demoComplianceItems.filter(item => {
    // Filter by category
    if (selectedCategory !== "all" && item.category !== selectedCategory) {
      return false;
    }
    
    // Filter by entity
    if (selectedEntity !== "all" && item.entity !== selectedEntity) {
      return false;
    }
    
    // Filter by status
    if (selectedStatus !== "all" && item.status !== selectedStatus) {
      return false;
    }
    
    // Filter by priority
    if (selectedPriority !== "all" && item.priority !== selectedPriority) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Calculate compliance statistics
  const totalItems = demoComplianceItems.length;
  const completedItems = demoComplianceItems.filter(item => item.status === 'complete').length;
  const pendingItems = demoComplianceItems.filter(item => item.status === 'pending').length;
  const overdueItems = demoComplianceItems.filter(item => item.status === 'overdue').length;
  const complianceRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  // Count items by category for the dashboard
  const itemsByCategory = categories.reduce((acc, category) => {
    if (category.value !== 'all') {
      acc[category.value] = demoComplianceItems.filter(item => item.category === category.value).length;
    }
    return acc;
  }, {} as Record<string, number>);

  // Count items by priority
  const highPriorityItems = demoComplianceItems.filter(item => item.priority === 'high').length;
  const mediumPriorityItems = demoComplianceItems.filter(item => item.priority === 'medium').length;
  const lowPriorityItems = demoComplianceItems.filter(item => item.priority === 'low').length;

  // Count items by due date proximity
  const today = new Date();
  const next30Days = new Date(today);
  next30Days.setDate(today.getDate() + 30);
  const next60Days = new Date(today);
  next60Days.setDate(today.getDate() + 60);

  const dueSoon = demoComplianceItems.filter(item => {
    const dueDate = new Date(item.dueDate);
    return item.status !== 'complete' && dueDate <= next30Days && dueDate >= today;
  }).length;

  const toggleItemExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'not-applicable':
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'state-compliance':
        return <Building className="h-5 w-5" />;
      case 'licenses':
        return <FileBadge className="h-5 w-5" />;
      case 'taxation':
        return <DollarSign className="h-5 w-5" />;
      case 'employment':
        return <Users className="h-5 w-5" />;
      case 'insurance':
        return <Shield className="h-5 w-5" />;
      case 'privacy':
        return <FileText className="h-5 w-5" />;
      case 'workplace-safety':
        return <AlertTriangle className="h-5 w-5" />;
      case 'accessibility':
        return <GraduationCap className="h-5 w-5" />;
      case 'data-security':
        return <Shield className="h-5 w-5" />;
      case 'intellectual-property':
        return <Scale className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <MainLayout
      title="Compliance Checklist"
      description="Track and manage your business compliance requirements and deadlines."
    >
      <div className="flex flex-col gap-6">
        {/* Header & Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Compliance Management
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Track, manage and stay compliant with all business requirements
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Compliance Item
            </Button>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Status
            </Button>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="checklist">Compliance Checklist</TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Overall Compliance Status */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Overall Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold mb-2">{Math.round(complianceRate)}%</div>
                    <Progress value={complianceRate} className="h-2 w-full mb-2" />
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {completedItems} of {totalItems} items complete
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Items by Status */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Compliance Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Complete</span>
                      </div>
                      <span className="font-medium">{completedItems}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-amber-500 mr-2" />
                        <span className="text-sm">Pending</span>
                      </div>
                      <span className="font-medium">{pendingItems}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-sm">Overdue</span>
                      </div>
                      <span className="font-medium">{overdueItems}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Priority Breakdown */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Priority Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Badge className="bg-red-100 text-red-800 mr-2">High</Badge>
                        <span className="text-sm">Priority</span>
                      </div>
                      <span className="font-medium">{highPriorityItems}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Badge className="bg-amber-100 text-amber-800 mr-2">Medium</Badge>
                        <span className="text-sm">Priority</span>
                      </div>
                      <span className="font-medium">{mediumPriorityItems}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Badge className="bg-blue-100 text-blue-800 mr-2">Low</Badge>
                        <span className="text-sm">Priority</span>
                      </div>
                      <span className="font-medium">{lowPriorityItems}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-sm">Due in 30 days</span>
                      </div>
                      <span className="font-medium">{dueSoon}</span>
                    </div>
                    <Link href="/compliance-checklist?status=overdue">
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        View All Deadlines
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance by Category</CardTitle>
                  <CardDescription>
                    Distribution of compliance items across business functions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.filter(cat => cat.value !== 'all').map(category => {
                      const count = itemsByCategory[category.value] || 0;
                      const completeCount = demoComplianceItems.filter(
                        item => item.category === category.value && item.status === 'complete'
                      ).length;
                      const percentage = count > 0 ? (completeCount / count) * 100 : 0;
                      
                      return (
                        <div key={category.value} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center">
                              {getCategoryIcon(category.value)}
                              <span className="ml-2">{category.label}</span>
                            </div>
                            <span>{completeCount}/{count}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Updates */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Updates</CardTitle>
                  <CardDescription>
                    Latest compliance activity and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demoComplianceItems
                      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
                      .slice(0, 5)
                      .map(item => (
                        <div key={item.id} className="border-b pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-sm">{item.title}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {getStatusIcon(item.status)}
                                <span className="ml-1">
                                  {item.status === 'complete' ? 'Completed' : 
                                   item.status === 'pending' ? 'Updated' : 
                                   item.status === 'overdue' ? 'Marked overdue' : 'Status changed'}
                                </span>
                              </p>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(item.lastUpdated).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Checklist Tab */}
          <TabsContent value="checklist" className="mt-6">
            {/* Filters and Search */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search items..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger>
                  <SelectValue placeholder="Business Entity" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map(entity => (
                    <SelectItem key={entity.value} value={entity.value}>
                      {entity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Compliance Items List */}
            {filteredComplianceItems.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No compliance items found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComplianceItems.map(item => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getStatusIcon(item.status)}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white flex items-center flex-wrap gap-2">
                                {item.title}
                                {getPriorityBadge(item.priority)}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {item.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Building className="h-3.5 w-3.5" />
                                  <span>{item.entity}</span>
                                </div>
                                {item.assignedTo && (
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>Assigned: {item.assignedTo}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-auto">
                            <Checkbox id={`complete-${item.id}`} />
                            <Label htmlFor={`complete-${item.id}`} className="text-sm cursor-pointer">
                              Mark Complete
                            </Label>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toggleItemExpanded(item.id)}
                            >
                              {expandedItems.includes(item.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        {/* Expanded details */}
                        {expandedItems.includes(item.id) && (
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                  Details
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Category:</span>
                                    <span>{categories.find(c => c.value === item.category)?.label || item.category}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Last Updated:</span>
                                    <span>{new Date(item.lastUpdated).toLocaleDateString()}</span>
                                  </div>
                                  {item.nextAction && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500 dark:text-gray-400">Next Action:</span>
                                      <span>{item.nextAction}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                  Notes
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {item.notes || "No additional notes."}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex justify-end mt-4">
                              <Button variant="outline" size="sm" className="mr-2">
                                Edit Item
                              </Button>
                              <Button size="sm">Update Status</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}