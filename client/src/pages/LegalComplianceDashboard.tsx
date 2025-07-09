import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileBarChart,
  FileBox,
  FileCheck,
  FileHeart,
  FileImage,
  FilePlus2,
  FilePieChart,
  FileText,
  FileType,
  Filter,
  HelpCircle,
  Info,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  RefreshCcw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Trash2,
  Upload,
  Users,
  PieChart,
  ChevronUp
} from 'lucide-react';
import { useDemoMode } from '@/contexts/DemoModeContext';

// Types
interface ComplianceCategory {
  id: number;
  name: string;
  description: string;
  items: ComplianceItem[];
  progress: number;
  entityId?: number;
  entityName?: string;
}

interface ComplianceItem {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  status: 'completed' | 'in_progress' | 'not_started' | 'not_applicable';
  dueDate?: string;
  completedDate?: string;
  assignedTo?: string;
  priority: 'high' | 'medium' | 'low';
  documentIds?: number[];
  notes?: string;
}

interface LegalDocument {
  id: number;
  name: string;
  description?: string;
  category: 'incorporation' | 'tax' | 'contracts' | 'licenses' | 'policies' | 'ip' | 'other';
  fileType: string;
  fileSize: number;
  uploadDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'draft' | 'pending_review';
  tags?: string[];
  uploadedBy: string;
  entityId?: number;
  entityName?: string;
  lastViewed?: string;
  url?: string;
}

interface ComplianceAlert {
  id: number;
  title: string;
  description: string;
  type: 'expiry' | 'missing' | 'update' | 'reminder';
  severity: 'high' | 'medium' | 'low';
  status: 'active' | 'dismissed' | 'resolved';
  dueDate?: string;
  relatedItemId?: number;
  relatedDocumentId?: number;
  createdAt: string;
  entityId?: number;
  entityName?: string;
}

// Component for Compliance Item in Checklist
const ComplianceItemRow: React.FC<{ 
  item: ComplianceItem; 
  onStatusChange: (id: number, status: ComplianceItem['status']) => void;
  onViewDetails: (id: number) => void;
}> = ({ item, onStatusChange, onViewDetails }) => {
  const statusColors = {
    completed: "bg-green-500",
    in_progress: "bg-amber-500",
    not_started: "bg-gray-300",
    not_applicable: "bg-blue-300"
  };
  
  const priorityColors = {
    high: "text-red-500",
    medium: "text-amber-500",
    low: "text-blue-500"
  };
  
  const getStatusDisplay = (status: ComplianceItem['status']) => {
    switch(status) {
      case 'completed':
        return { icon: <CheckCircle2 className="h-4 w-4 text-green-500" />, text: "Completed" };
      case 'in_progress':
        return { icon: <FileCheck className="h-4 w-4 text-amber-500" />, text: "In Progress" };
      case 'not_started':
        return { icon: <Clock className="h-4 w-4 text-gray-500" />, text: "Not Started" };
      case 'not_applicable':
        return { icon: <FileHeart className="h-4 w-4 text-blue-500" />, text: "Not Applicable" };
    }
  };
  
  const statusDisplay = getStatusDisplay(item.status);

  return (
    <div className="flex items-center space-x-2 py-3 border-b border-border last:border-0">
      <Checkbox 
        checked={item.status === 'completed'} 
        onCheckedChange={checked => onStatusChange(item.id, checked ? 'completed' : 'not_started')}
        className="mr-2"
      />
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start">
          <div className="font-medium">{item.name}</div>
          <div className={`text-xs ${priorityColors[item.priority]}`}>
            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
          <div className="flex items-center">
            {statusDisplay.icon}
            <span className="ml-1">{statusDisplay.text}</span>
          </div>
          {item.dueDate && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          {item.documentIds && item.documentIds.length > 0 && (
            <div className="flex items-center">
              <FileText className="h-3 w-3 mr-1" />
              <span>{item.documentIds.length} document{item.documentIds.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={() => onViewDetails(item.id)}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">View details</span>
      </Button>
    </div>
  );
};

// Component for Document Card
const DocumentCard: React.FC<{ document: LegalDocument; onViewDocument: (id: number) => void }> = ({ document, onViewDocument }) => {
  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (type.includes('doc') || type.includes('word')) return <FileText className="h-8 w-8 text-blue-500" />;
    if (type.includes('xls') || type.includes('sheet')) return <FileBarChart className="h-8 w-8 text-green-500" />;
    if (type.includes('ppt') || type.includes('presentation')) return <FilePieChart className="h-8 w-8 text-amber-500" />;
    if (type.includes('jpg') || type.includes('jpeg') || type.includes('png')) return <FileImage className="h-8 w-8 text-purple-500" />;
    return <FileBox className="h-8 w-8 text-gray-500" />;
  };
  
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const getStatusBadge = (status: LegalDocument['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'pending_review':
        return <Badge className="bg-amber-500">Pending Review</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-2">
            {getFileIcon(document.fileType)}
            <div>
              <CardTitle className="text-sm font-semibold line-clamp-1">{document.name}</CardTitle>
              <CardDescription className="text-xs">
                {document.category.charAt(0).toUpperCase() + document.category.slice(1).replace('_', ' ')}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge(document.status)}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {document.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{document.description}</p>
        )}
        
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="text-muted-foreground">Size:</div>
          <div className="text-right">{formatFileSize(document.fileSize)}</div>
          
          <div className="text-muted-foreground">Uploaded:</div>
          <div className="text-right">{new Date(document.uploadDate).toLocaleDateString()}</div>
          
          {document.expiryDate && (
            <>
              <div className="text-muted-foreground">Expires:</div>
              <div className="text-right">{new Date(document.expiryDate).toLocaleDateString()}</div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 text-xs"
          onClick={() => onViewDocument(document.id)}
        >
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FilePlus2 className="h-4 w-4 mr-2" />
              Upload New Version
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

// Component for Alert Item
const AlertItem: React.FC<{ alert: ComplianceAlert; onDismiss: (id: number) => void; onResolve: (id: number) => void }> = ({ alert, onDismiss, onResolve }) => {
  const severityColors = {
    high: "border-red-500 bg-red-50 dark:bg-red-950/20",
    medium: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
    low: "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
  };
  
  const severityIcons = {
    high: <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />,
    medium: <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />,
    low: <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
  };

  return (
    <div className={`border-l-4 p-3 rounded-md ${severityColors[alert.severity]}`}>
      <div className="flex items-start space-x-3">
        {severityIcons[alert.severity]}
        <div className="flex-1 space-y-1">
          <div className="flex justify-between">
            <h4 className="font-medium text-sm">{alert.title}</h4>
            <Badge 
              variant={alert.status === 'active' ? 'default' : 
                alert.status === 'resolved' ? 'outline' : 'secondary'}
              className="text-xs px-1.5 py-0 h-5"
            >
              {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{alert.description}</p>
          
          {alert.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Due: {new Date(alert.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 pt-1">
            {alert.status !== 'resolved' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 px-2 text-xs"
                onClick={() => onResolve(alert.id)}
              >
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Mark Resolved
              </Button>
            )}
            
            {alert.status !== 'dismissed' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs"
                onClick={() => onDismiss(alert.id)}
              >
                <Eye className="h-3 w-3 mr-1" />
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard: React.FC<{ 
  category: ComplianceCategory; 
  onCategoryClick: (id: number) => void;
}> = ({ category, onCategoryClick }) => {
  const getCompletionStatusColor = (progress: number) => {
    if (progress >= 80) return "text-green-500";
    if (progress >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <Card 
      className="cursor-pointer hover:border-primary/50 transition-colors"
      onClick={() => onCategoryClick(category.id)}
    >
      <CardHeader className="pb-2">
        <CardTitle>{category.name}</CardTitle>
        <CardDescription className="line-clamp-2">{category.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Completion:</span>
            <span className={`font-medium ${getCompletionStatusColor(category.progress)}`}>
              {category.progress}%
            </span>
          </div>
          <Progress value={category.progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main Legal Compliance Dashboard Component
export default function LegalComplianceDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedDocumentFilter, setSelectedDocumentFilter] = useState('all');
  const [selectedAlertFilter, setSelectedAlertFilter] = useState('active');
  const { demoMode } = useDemoMode();
  
  // Fetch data from API
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/compliance-categories'],
    queryFn: () => apiRequest('/api/compliance-categories')
  });
  
  const { data: documentsData, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['/api/legal-documents', selectedDocumentFilter],
    queryFn: () => apiRequest(`/api/legal-documents?status=${selectedDocumentFilter}`)
  });
  
  const { data: alertsData, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['/api/compliance-alerts', selectedAlertFilter],
    queryFn: () => apiRequest(`/api/compliance-alerts?status=${selectedAlertFilter}`)
  });
  
  const { data: entitiesData, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['/api/business-entities'],
    queryFn: () => apiRequest('/api/business-entities')
  });

  // Fetch compliance items for selected category
  const { data: complianceItemsData, isLoading: isLoadingItems } = useQuery({
    queryKey: ['/api/compliance-items', selectedCategory],
    queryFn: () => apiRequest(`/api/compliance-items?categoryId=${selectedCategory}`),
    enabled: selectedCategory !== null
  });

  // Mock default data for demo mode
  const defaultCategories: ComplianceCategory[] = demoMode ? [
    {
      id: 1,
      name: "Business Formation",
      description: "Legal documents and requirements related to business formation and structure.",
      items: [],
      progress: 100,
      entityName: "Digital Merch Pros"
    },
    {
      id: 2,
      name: "Tax Compliance",
      description: "Tax registration, filing requirements, and compliance documentation.",
      items: [],
      progress: 75,
      entityName: "Digital Merch Pros"
    },
    {
      id: 3,
      name: "Employment & HR",
      description: "Employment agreements, policies, and HR compliance requirements.",
      items: [],
      progress: 50,
      entityName: "Digital Merch Pros"
    },
    {
      id: 4,
      name: "Intellectual Property",
      description: "Trademarks, copyrights, and other intellectual property protections.",
      items: [],
      progress: 80,
      entityName: "Digital Merch Pros"
    },
    {
      id: 5,
      name: "Licenses & Permits",
      description: "Business licenses, permits, and certifications required for operation.",
      items: [],
      progress: 90,
      entityName: "Digital Merch Pros"
    },
    {
      id: 6,
      name: "Data Privacy & Security",
      description: "Privacy policies, data protection, and security compliance requirements.",
      items: [],
      progress: 30,
      entityName: "Digital Merch Pros"
    }
  ] : [];

  const defaultLegalDocuments: LegalDocument[] = demoMode ? [
    {
      id: 1,
      name: "Certificate of Incorporation",
      description: "Official certificate confirming the legal formation of the company.",
      category: "incorporation",
      fileType: "application/pdf",
      fileSize: 2356789,
      uploadDate: "2024-01-15T10:30:00Z",
      status: "active",
      tags: ["formation", "legal"],
      uploadedBy: "John Smith",
      entityName: "Digital Merch Pros"
    },
    {
      id: 2,
      name: "Operating Agreement",
      description: "Legal document outlining the ownership and operating procedures of the company.",
      category: "incorporation",
      fileType: "application/pdf",
      fileSize: 3456789,
      uploadDate: "2024-01-15T11:45:00Z",
      status: "active",
      tags: ["formation", "legal"],
      uploadedBy: "John Smith",
      entityName: "Digital Merch Pros"
    },
    {
      id: 3,
      name: "Business License - City of Austin",
      description: "Local business operating license for the city of Austin, TX.",
      category: "licenses",
      fileType: "application/pdf",
      fileSize: 1245678,
      uploadDate: "2024-02-10T14:20:00Z",
      expiryDate: "2025-02-10T00:00:00Z",
      status: "active",
      tags: ["license", "local"],
      uploadedBy: "Emily Chen",
      entityName: "Digital Merch Pros"
    },
    {
      id: 4,
      name: "Seller's Permit - State of Texas",
      description: "State permit allowing the collection of sales tax on taxable sales.",
      category: "licenses",
      fileType: "application/pdf",
      fileSize: 1745678,
      uploadDate: "2024-02-15T09:10:00Z",
      expiryDate: "2026-02-15T00:00:00Z",
      status: "active",
      tags: ["permit", "tax", "sales"],
      uploadedBy: "Emily Chen",
      entityName: "Digital Merch Pros"
    },
    {
      id: 5,
      name: "Trademark Registration - Digital Merch Pros Logo",
      description: "USPTO trademark registration for company logo and wordmark.",
      category: "ip",
      fileType: "application/pdf",
      fileSize: 3145678,
      uploadDate: "2024-03-05T11:30:00Z",
      status: "active",
      tags: ["trademark", "intellectual property", "branding"],
      uploadedBy: "David Brown",
      entityName: "Digital Merch Pros"
    },
    {
      id: 6,
      name: "Employment Agreement Template",
      description: "Standard employment agreement template for new hires.",
      category: "contracts",
      fileType: "application/docx",
      fileSize: 245678,
      uploadDate: "2024-01-20T15:45:00Z",
      status: "active",
      tags: ["employment", "hr", "template"],
      uploadedBy: "Sarah Johnson",
      entityName: "Digital Merch Pros"
    },
    {
      id: 7,
      name: "EIN Confirmation Letter",
      description: "IRS confirmation of company Employer Identification Number.",
      category: "tax",
      fileType: "application/pdf",
      fileSize: 945678,
      uploadDate: "2024-01-16T08:30:00Z",
      status: "active",
      tags: ["tax", "irs", "ein"],
      uploadedBy: "John Smith",
      entityName: "Digital Merch Pros"
    },
    {
      id: 8,
      name: "Privacy Policy",
      description: "Website and customer data privacy policy document.",
      category: "policies",
      fileType: "application/docx",
      fileSize: 345678,
      uploadDate: "2024-02-25T10:15:00Z",
      status: "draft",
      tags: ["privacy", "website", "compliance"],
      uploadedBy: "Emily Chen",
      entityName: "Digital Merch Pros"
    },
    {
      id: 9,
      name: "Independent Contractor Agreement",
      description: "Template for engaging freelancers and independent contractors.",
      category: "contracts",
      fileType: "application/docx",
      fileSize: 245678,
      uploadDate: "2024-03-10T13:45:00Z",
      status: "active",
      tags: ["contractor", "freelance", "agreement"],
      uploadedBy: "Sarah Johnson",
      entityName: "Digital Merch Pros"
    }
  ] : [];

  const defaultComplianceItems: ComplianceItem[] = demoMode ? [
    {
      id: 1,
      categoryId: 1,
      name: "File Articles of Incorporation",
      description: "Submit articles of incorporation to the Secretary of State to establish the business entity.",
      status: "completed",
      completedDate: "2024-01-10T09:30:00Z",
      priority: "high",
      documentIds: [1],
      notes: "Filed with Texas Secretary of State. Received certificate within 3 business days."
    },
    {
      id: 2,
      categoryId: 1,
      name: "Draft and Sign Operating Agreement",
      description: "Create and have all members sign the company operating agreement outlining ownership and operations.",
      status: "completed",
      completedDate: "2024-01-15T14:45:00Z",
      priority: "high",
      documentIds: [2],
      notes: "All members have signed. Original kept in company records."
    },
    {
      id: 3,
      categoryId: 1,
      name: "Obtain EIN from IRS",
      description: "Apply for and receive an Employer Identification Number (EIN) from the IRS.",
      status: "completed",
      completedDate: "2024-01-16T10:20:00Z",
      priority: "high",
      documentIds: [7]
    },
    {
      id: 4,
      categoryId: 2,
      name: "Register for State Sales Tax",
      description: "Register with the state department of revenue to collect and remit sales tax.",
      status: "completed",
      completedDate: "2024-02-01T11:15:00Z",
      priority: "high",
      documentIds: [4]
    },
    {
      id: 5,
      categoryId: 2,
      name: "Set Up Payroll Tax Accounts",
      description: "Register for payroll tax accounts for withholding, unemployment, and other employment taxes.",
      status: "in_progress",
      dueDate: "2025-04-15T00:00:00Z",
      assignedTo: "Emily Chen",
      priority: "high"
    },
    {
      id: 6,
      categoryId: 2,
      name: "Configure Accounting System for Tax Tracking",
      description: "Set up accounting software to properly track taxes owed and paid.",
      status: "in_progress",
      dueDate: "2025-04-10T00:00:00Z",
      assignedTo: "David Brown",
      priority: "medium"
    },
    {
      id: 7,
      categoryId: 3,
      name: "Create Employee Handbook",
      description: "Develop comprehensive employee handbook with all policies and procedures.",
      status: "in_progress",
      dueDate: "2025-04-30T00:00:00Z",
      assignedTo: "Sarah Johnson",
      priority: "medium"
    },
    {
      id: 8,
      categoryId: 3,
      name: "Establish Employment Agreements",
      description: "Create standard employment agreement templates for different employee types.",
      status: "completed",
      completedDate: "2024-01-25T16:30:00Z",
      priority: "high",
      documentIds: [6]
    },
    {
      id: 9,
      categoryId: 3,
      name: "Create Independent Contractor Agreements",
      description: "Establish template agreements for freelancers and independent contractors.",
      status: "completed",
      completedDate: "2024-03-10T15:20:00Z",
      priority: "medium",
      documentIds: [9]
    },
    {
      id: 10,
      categoryId: 3,
      name: "Set Up Workers' Compensation Insurance",
      description: "Obtain required workers' compensation insurance for employees.",
      status: "not_started",
      dueDate: "2025-05-15T00:00:00Z",
      priority: "high"
    },
    {
      id: 11,
      categoryId: 4,
      name: "Register Primary Trademark",
      description: "Register company name and logo trademark with the USPTO.",
      status: "completed",
      completedDate: "2024-03-05T14:10:00Z",
      priority: "high",
      documentIds: [5]
    },
    {
      id: 12,
      categoryId: 4,
      name: "Secure Domain Names",
      description: "Register essential domain names for the business.",
      status: "completed",
      completedDate: "2024-01-05T11:30:00Z",
      priority: "high"
    },
    {
      id: 13,
      categoryId: 5,
      name: "Obtain City Business License",
      description: "Apply for and receive local business operating license.",
      status: "completed",
      completedDate: "2024-02-10T16:45:00Z",
      priority: "high",
      documentIds: [3]
    },
    {
      id: 14,
      categoryId: 5,
      name: "Secure Reseller's Permit",
      description: "Obtain state reseller's permit for wholesale purchasing.",
      status: "completed",
      completedDate: "2024-02-15T10:30:00Z",
      priority: "high",
      documentIds: [4]
    },
    {
      id: 15,
      categoryId: 6,
      name: "Create Privacy Policy",
      description: "Develop comprehensive privacy policy for website and customer data.",
      status: "in_progress",
      dueDate: "2025-04-05T00:00:00Z",
      assignedTo: "Emily Chen",
      priority: "high",
      documentIds: [8]
    },
    {
      id: 16,
      categoryId: 6,
      name: "Implement Data Security Measures",
      description: "Establish technical safeguards to protect customer and business data.",
      status: "not_started",
      dueDate: "2025-05-20T00:00:00Z",
      priority: "high"
    }
  ] : [];

  const defaultComplianceAlerts: ComplianceAlert[] = demoMode ? [
    {
      id: 1,
      title: "Business License Renewal Approaching",
      description: "The City of Austin business license expires in 45 days. Submit renewal application soon.",
      type: "expiry",
      severity: "medium",
      status: "active",
      dueDate: "2025-04-10T00:00:00Z",
      relatedItemId: 13,
      relatedDocumentId: 3,
      createdAt: "2025-02-25T08:30:00Z",
      entityName: "Digital Merch Pros"
    },
    {
      id: 2,
      title: "Privacy Policy Needs Finalization",
      description: "The privacy policy document is still in draft status. It needs to be finalized and published on the website.",
      type: "update",
      severity: "high",
      status: "active",
      dueDate: "2025-04-05T00:00:00Z",
      relatedItemId: 15,
      relatedDocumentId: 8,
      createdAt: "2025-03-05T14:20:00Z",
      entityName: "Digital Merch Pros"
    },
    {
      id: 3,
      title: "Workers' Compensation Required",
      description: "Workers' compensation insurance setup is overdue. This is a legal requirement for businesses with employees.",
      type: "missing",
      severity: "high",
      status: "active",
      dueDate: "2025-03-15T00:00:00Z",
      relatedItemId: 10,
      createdAt: "2025-03-01T09:45:00Z",
      entityName: "Digital Merch Pros"
    },
    {
      id: 4,
      title: "Quarterly Tax Filing Reminder",
      description: "Q1 2025 estimated tax payments are due by April 15th.",
      type: "reminder",
      severity: "medium",
      status: "active",
      dueDate: "2025-04-15T00:00:00Z",
      createdAt: "2025-03-15T10:00:00Z",
      entityName: "Digital Merch Pros"
    },
    {
      id: 5,
      title: "Data Security Implementation Pending",
      description: "Implementation of data security measures is still pending. This is essential for protecting customer information.",
      type: "missing",
      severity: "high",
      status: "active",
      dueDate: "2025-04-20T00:00:00Z",
      relatedItemId: 16,
      createdAt: "2025-03-10T11:30:00Z",
      entityName: "Digital Merch Pros"
    }
  ] : [];

  const defaultEntities = [
    { id: 1, name: "Digital Merch Pros" },
    { id: 2, name: "Mystery Hype" },
    { id: 3, name: "Lone Star Custom Clothing" },
    { id: 4, name: "Alcoeaze" },
    { id: 5, name: "Hide Cafe Bars" }
  ];
  
  // Process data
  const categories = categoriesData?.categories || defaultCategories;
  const documents = documentsData?.documents || defaultLegalDocuments;
  const alerts = alertsData?.alerts || defaultComplianceAlerts;
  const entities = entitiesData?.entities || defaultEntities;
  const complianceItems = complianceItemsData?.items || 
    (selectedCategory ? defaultComplianceItems.filter(item => item.categoryId === selectedCategory) : []);
  
  // Filter documents based on selected filter
  const filteredDocuments = selectedDocumentFilter === 'all' 
    ? documents 
    : documents.filter(doc => doc.status === selectedDocumentFilter);
  
  // Filter alerts based on selected filter
  const filteredAlerts = selectedAlertFilter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.status === selectedAlertFilter);
  
  // Calculate overall compliance percentage
  const overallCompliance = categories.length 
    ? Math.round(categories.reduce((sum, category) => sum + category.progress, 0) / categories.length) 
    : 0;
  
  // Handle actions  
  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setActiveTab('checklist');
  };
  
  const handleComplianceStatusChange = (itemId: number, status: ComplianceItem['status']) => {
    // In a real implementation, this would update the status via an API call
    console.log(`Updating item ${itemId} status to ${status}`);
  };
  
  const handleViewItemDetails = (itemId: number) => {
    // In a real implementation, this would show a modal or navigate to a details page
    console.log(`Viewing details for item ${itemId}`);
  };
  
  const handleViewDocument = (documentId: number) => {
    // In a real implementation, this would open the document
    console.log(`Viewing document ${documentId}`);
  };
  
  const handleDismissAlert = (alertId: number) => {
    // In a real implementation, this would update the alert status via an API call
    console.log(`Dismissing alert ${alertId}`);
  };
  
  const handleResolveAlert = (alertId: number) => {
    // In a real implementation, this would update the alert status via an API call
    console.log(`Resolving alert ${alertId}`);
  };
  
  return (
    <MainLayout>
      <div className="container py-6 max-w-7xl">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Legal & Compliance</h1>
            <p className="text-muted-foreground">
              Manage your business legal requirements and compliance documentation
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-6">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="overview" className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="checklist" className="flex items-center gap-1">
                  <FileCheck className="h-4 w-4" />
                  <span>Compliance Checklist</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>Documents</span>
                </TabsTrigger>
                <TabsTrigger value="alerts" className="flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Alerts</span>
                </TabsTrigger>
              </TabsList>
              
              {activeTab === 'documents' && (
                <div className="flex items-center gap-2">
                  <Select value={selectedDocumentFilter} onValueChange={setSelectedDocumentFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending_review">Pending Review</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="default">
                    <Upload className="h-4 w-4 mr-1" />
                    Upload Document
                  </Button>
                </div>
              )}
              
              {activeTab === 'alerts' && (
                <div className="flex items-center gap-2">
                  <Select value={selectedAlertFilter} onValueChange={setSelectedAlertFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Alerts</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="dismissed">Dismissed</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline">
                    <RefreshCcw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                </div>
              )}
            </div>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            strokeWidth="10"
                            stroke="hsl(var(--muted))"
                            fill="transparent"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            strokeWidth="10"
                            stroke={`hsl(${overallCompliance >= 80 
                              ? 'var(--success)' 
                              : overallCompliance >= 50 
                                ? 'var(--warning)' 
                                : 'var(--destructive)'
                            })`}
                            fill="transparent"
                            strokeDasharray={`${overallCompliance * 2.51} 251`}
                            className="transition-all duration-1000 ease-in-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">{overallCompliance}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 text-center">
                        Overall Legal Compliance Score
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Compliance Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{categories.length}</div>
                    <p className="text-sm text-muted-foreground">Categories tracked</p>
                    
                    <div className="space-y-1 mt-2">
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>100% Complete</span>
                        <span>{categories.filter(c => c.progress === 100).length}</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>In Progress</span>
                        <span>{categories.filter(c => c.progress > 0 && c.progress < 100).length}</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>Not Started</span>
                        <span>{categories.filter(c => c.progress === 0).length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{documents.length}</div>
                    <p className="text-sm text-muted-foreground">Legal documents</p>
                    
                    <div className="space-y-1 mt-2">
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>Active</span>
                        <span>{documents.filter(d => d.status === 'active').length}</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>Expired</span>
                        <span>{documents.filter(d => d.status === 'expired').length}</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>Draft/Pending</span>
                        <span>{documents.filter(d => d.status === 'draft' || d.status === 'pending_review').length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                    <Badge className={alerts.filter(a => a.status === 'active' && a.severity === 'high').length > 0 ? 'bg-red-500' : 'bg-green-500'}>
                      {alerts.filter(a => a.status === 'active').length} Active
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>High Priority</span>
                        <span>{alerts.filter(a => a.status === 'active' && a.severity === 'high').length}</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>Medium Priority</span>
                        <span>{alerts.filter(a => a.status === 'active' && a.severity === 'medium').length}</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>Low Priority</span>
                        <span>{alerts.filter(a => a.status === 'active' && a.severity === 'low').length}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={() => setActiveTab('alerts')}
                    >
                      View Alerts
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              {/* Active Alerts Section */}
              {alerts.filter(a => a.status === 'active' && a.severity === 'high').length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold flex items-center">
                    <ShieldAlert className="h-5 w-5 mr-2 text-red-500" />
                    High Priority Alerts
                  </h2>
                  <div className="space-y-3">
                    {alerts
                      .filter(a => a.status === 'active' && a.severity === 'high')
                      .map(alert => (
                        <AlertItem 
                          key={alert.id} 
                          alert={alert} 
                          onDismiss={handleDismissAlert} 
                          onResolve={handleResolveAlert} 
                        />
                      ))
                    }
                  </div>
                </div>
              )}
              
              {/* Compliance Categories Section */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">Compliance Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {isLoadingCategories ? (
                    Array(6).fill(0).map((_, i) => (
                      <Card key={i}>
                        <CardHeader className="pb-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Skeleton className="h-4 w-20" />
                              <Skeleton className="h-4 w-8" />
                            </div>
                            <Skeleton className="h-2 w-full" />
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Skeleton className="h-8 w-full" />
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    categories.map(category => (
                      <CategoryCard 
                        key={category.id} 
                        category={category} 
                        onCategoryClick={handleCategoryClick} 
                      />
                    ))
                  )}
                </div>
              </div>
              
              {/* Recent Documents Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Recent Documents</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => setActiveTab('documents')}
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {isLoadingDocuments ? (
                    Array(4).fill(0).map((_, i) => (
                      <Card key={i}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex gap-2">
                              <Skeleton className="h-8 w-8 rounded" />
                              <div>
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20 mt-1" />
                              </div>
                            </div>
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-full mt-1" />
                          <div className="grid grid-cols-2 gap-1 mt-2">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-full" />
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Skeleton className="h-7 w-16" />
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    documents
                      .slice()
                      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
                      .slice(0, 4)
                      .map(document => (
                        <DocumentCard 
                          key={document.id} 
                          document={document} 
                          onViewDocument={handleViewDocument} 
                        />
                      ))
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Compliance Checklist Tab */}
            <TabsContent value="checklist" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">Categories</CardTitle>
                      <CardDescription>
                        Select a compliance category to view checklist items
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[500px]">
                        <div className="p-1">
                          {isLoadingCategories ? (
                            <div className="space-y-2 p-3">
                              {Array(6).fill(0).map((_, i) => (
                                <div key={i} className="space-y-1 p-2">
                                  <Skeleton className="h-5 w-3/4" />
                                  <Skeleton className="h-3 w-full" />
                                  <div className="flex justify-between pt-1">
                                    <Skeleton className="h-3 w-10" />
                                    <Skeleton className="h-3 w-10" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {categories.map(category => (
                                <div 
                                  key={category.id}
                                  className={`p-3 cursor-pointer rounded-md hover:bg-muted transition-colors ${selectedCategory === category.id ? 'bg-muted' : ''}`}
                                  onClick={() => setSelectedCategory(category.id)}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="font-medium">{category.name}</div>
                                    <div className={`text-xs ${
                                      category.progress >= 80 ? 'text-green-500' : 
                                      category.progress >= 50 ? 'text-amber-500' : 
                                      'text-red-500'
                                    }`}>
                                      {category.progress}%
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>
                                  <Progress value={category.progress} className="h-1.5 mt-2" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-bold">
                            {selectedCategory !== null 
                              ? categories.find(c => c.id === selectedCategory)?.name || 'Checklist Items' 
                              : 'Checklist Items'
                            }
                          </CardTitle>
                          <CardDescription>
                            {selectedCategory !== null 
                              ? categories.find(c => c.id === selectedCategory)?.description 
                              : 'Select a category to view compliance checklist items'
                            }
                          </CardDescription>
                        </div>
                        {selectedCategory !== null && (
                          <Button variant="outline" size="sm">
                            <PlusCircle className="h-4 w-4 mr-1" />
                            Add Item
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {selectedCategory === null ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                          <ShieldQuestion className="h-16 w-16 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No Category Selected</h3>
                          <p className="text-sm text-muted-foreground mt-2 mb-4 max-w-md">
                            Please select a compliance category from the left panel to view its checklist items.
                          </p>
                        </div>
                      ) : isLoadingItems ? (
                        <div className="p-6 space-y-4">
                          {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="space-y-2 border-b pb-4 last:border-0">
                              <div className="flex">
                                <Skeleton className="h-4 w-4 mr-3 mt-0.5" />
                                <div className="flex-1 space-y-1">
                                  <div className="flex justify-between">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-16" />
                                  </div>
                                  <Skeleton className="h-3 w-full" />
                                  <div className="flex gap-2">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : complianceItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                          <FileCheck className="h-16 w-16 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No Checklist Items</h3>
                          <p className="text-sm text-muted-foreground mt-2 mb-4 max-w-md">
                            There are no compliance items for this category yet. Add your first checklist item to get started.
                          </p>
                          <Button>
                            <PlusCircle className="h-4 w-4 mr-1" />
                            Add First Item
                          </Button>
                        </div>
                      ) : (
                        <ScrollArea className="h-[500px]">
                          <div className="p-6 space-y-1">
                            {complianceItems.map(item => (
                              <ComplianceItemRow 
                                key={item.id} 
                                item={item} 
                                onStatusChange={handleComplianceStatusChange}
                                onViewDetails={handleViewItemDetails}
                              />
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                  <div>
                    <h2 className="text-xl font-bold">Legal Documents</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your business legal documents and requirements
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search documents..."
                        className="w-full pl-8"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                    <Button variant="default" size="sm">
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                {isLoadingDocuments ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array(12).fill(0).map((_, i) => (
                      <Card key={i}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex gap-2">
                              <Skeleton className="h-8 w-8 rounded" />
                              <div>
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20 mt-1" />
                              </div>
                            </div>
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-full mt-1" />
                          <div className="grid grid-cols-2 gap-1 mt-2">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-full" />
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Skeleton className="h-7 w-16" />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : filteredDocuments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Documents Found</h3>
                    <p className="text-sm text-muted-foreground mt-2 mb-4 max-w-md">
                      {selectedDocumentFilter === 'all' 
                        ? "You haven't uploaded any legal documents yet." 
                        : `There are no documents with '${selectedDocumentFilter}' status.`
                      }
                    </p>
                    {selectedDocumentFilter === 'all' && (
                      <Button>
                        <Upload className="h-4 w-4 mr-1" />
                        Upload First Document
                      </Button>
                    )}
                    {selectedDocumentFilter !== 'all' && (
                      <Button variant="outline" onClick={() => setSelectedDocumentFilter('all')}>
                        Show All Documents
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredDocuments.map(document => (
                      <DocumentCard 
                        key={document.id} 
                        document={document} 
                        onViewDocument={handleViewDocument} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                  <div>
                    <h2 className="text-xl font-bold">Compliance Alerts</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage compliance issues, deadlines, and reminders
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Filter by:</span>
                      <Badge 
                        variant={selectedAlertFilter === 'all' ? 'default' : 'outline'} 
                        className="cursor-pointer"
                        onClick={() => setSelectedAlertFilter('all')}
                      >
                        All
                      </Badge>
                      <Badge 
                        variant={selectedAlertFilter === 'active' ? 'default' : 'outline'} 
                        className="cursor-pointer"
                        onClick={() => setSelectedAlertFilter('active')}
                      >
                        Active
                      </Badge>
                      <Badge 
                        variant={selectedAlertFilter === 'dismissed' ? 'default' : 'outline'} 
                        className="cursor-pointer"
                        onClick={() => setSelectedAlertFilter('dismissed')}
                      >
                        Dismissed
                      </Badge>
                      <Badge 
                        variant={selectedAlertFilter === 'resolved' ? 'default' : 'outline'} 
                        className="cursor-pointer"
                        onClick={() => setSelectedAlertFilter('resolved')}
                      >
                        Resolved
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {isLoadingAlerts ? (
                  <div className="space-y-4">
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : filteredAlerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <ShieldCheck className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Alerts Found</h3>
                    <p className="text-sm text-muted-foreground mt-2 mb-4 max-w-md">
                      {selectedAlertFilter === 'all' 
                        ? "There are currently no compliance alerts in the system." 
                        : `There are no ${selectedAlertFilter} alerts.`
                      }
                    </p>
                    {selectedAlertFilter !== 'all' && (
                      <Button variant="outline" onClick={() => setSelectedAlertFilter('all')}>
                        Show All Alerts
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAlerts.map(alert => (
                      <AlertItem 
                        key={alert.id} 
                        alert={alert} 
                        onDismiss={handleDismissAlert} 
                        onResolve={handleResolveAlert} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}