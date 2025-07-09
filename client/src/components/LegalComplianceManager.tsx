import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; 
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  HelpCircle,
  Info,
  Loader,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Trash,
  Upload,
  X,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, isBefore, addDays, isPast, isToday, isFuture } from 'date-fns';

// Types for Legal Compliance Management

export enum EntityType {
  LLC = 'llc',
  C_CORPORATION = 'c_corporation',
  S_CORPORATION = 's_corporation',
  SOLE_PROPRIETORSHIP = 'sole_proprietorship',
  PARTNERSHIP = 'partnership',
  LIMITED_PARTNERSHIP = 'limited_partnership',
  NONPROFIT = 'nonprofit',
  BENEFIT_CORPORATION = 'benefit_corporation',
  PROFESSIONAL_CORPORATION = 'professional_corporation',
  SERIES_LLC = 'series_llc'
}

export enum LicenseType {
  BUSINESS = 'business',
  SALES_TAX = 'sales_tax',
  PROFESSIONAL = 'professional',
  HEALTH = 'health', 
  LIQUOR = 'liquor',
  FOOD = 'food',
  CONSTRUCTION = 'construction',
  TRANSPORTATION = 'transportation',
  MANUFACTURING = 'manufacturing',
  ENVIRONMENTAL = 'environmental',
  WHOLESALE = 'wholesale',
  IMPORT_EXPORT = 'import_export',
  OTHER = 'other'
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  PENDING = 'pending',
  EXPIRING_SOON = 'expiring_soon',
  EXPIRED = 'expired',
  NON_COMPLIANT = 'non_compliant',
  NOT_APPLICABLE = 'not_applicable'
}

export enum FilingFrequency {
  ANNUAL = 'annual',
  QUARTERLY = 'quarterly',
  MONTHLY = 'monthly',
  BIENNIAL = 'biennial',
  ONE_TIME = 'one_time'
}

export enum DocumentType {
  FORMATION = 'formation',
  LICENSE = 'license',
  PERMIT = 'permit',
  FILING = 'filing',
  CERTIFICATE = 'certificate',
  REPORT = 'report',
  TAX_DOCUMENT = 'tax_document',
  REGISTRATION = 'registration',
  INSURANCE = 'insurance',
  OTHER = 'other'
}

export enum ComplianceCategory {
  FORMATION = 'formation',
  LICENSING = 'licensing',
  TAXATION = 'taxation',
  EMPLOYMENT = 'employment',
  INSURANCE = 'insurance',
  REPORTING = 'reporting',
  PERMITS = 'permits',
  REGULATIONS = 'regulations',
  CONTRACTS = 'contracts',
  INTELLECTUAL_PROPERTY = 'intellectual_property'
}

export interface EntityDetails {
  id: string;
  entityId: number;
  entityName: string;
  entityType: EntityType;
  texasEntityNumber?: string;
  einNumber?: string;
  formationDate: Date | string;
  registeredAgent: string;
  registeredOfficeAddress: string;
  annualFilingDueDate: Date | string;
  owners: {
    name: string;
    ownership: number; // Percentage
    title?: string;
  }[];
  operatingAddress: string;
  status: 'active' | 'inactive' | 'dissolved' | 'suspended';
  documents: {
    id: string;
    type: DocumentType;
    name: string;
    fileUrl?: string;
    issuedDate: Date | string;
    expirationDate?: Date | string;
  }[];
  notes?: string;
}

export interface License {
  id: string;
  entityId: number;
  entityName: string;
  name: string;
  licenseType: LicenseType;
  licenseNumber: string;
  issuingAuthority: string;
  issueDate: Date | string;
  expirationDate: Date | string;
  renewalRequirements?: string;
  status: ComplianceStatus;
  documents: {
    id: string;
    name: string;
    fileUrl?: string;
    uploadDate: Date | string;
  }[];
  notes?: string;
  reminderDays: number; // Days before expiration to send reminder
}

export interface ComplianceRequirement {
  id: string;
  entityId: number;
  entityName: string;
  category: ComplianceCategory;
  name: string;
  description: string;
  dueDate: Date | string;
  frequency: FilingFrequency;
  lastFiledDate?: Date | string;
  nextDueDate: Date | string;
  status: ComplianceStatus;
  authority: string; // The government agency or body requiring compliance
  filingFee?: number;
  assignedTo?: string;
  documents: {
    id: string;
    name: string;
    fileUrl?: string;
    filingDate: Date | string;
  }[];
  notes?: string;
  reminderDays: number; // Days before due date to send reminder
}

export interface TaxFiling {
  id: string;
  entityId: number;
  entityName: string;
  name: string;
  taxType: 'franchise' | 'sales' | 'employment' | 'property' | 'other';
  description: string;
  dueDate: Date | string;
  frequency: FilingFrequency;
  lastFiledDate?: Date | string;
  lastAmountPaid?: number;
  status: ComplianceStatus;
  authority: string;
  accountNumber?: string;
  documents: {
    id: string;
    name: string;
    fileUrl?: string;
    filingDate: Date | string;
  }[];
  notes?: string;
  reminderDays: number;
}

export interface ComplianceAlert {
  id: string;
  entityId: number;
  entityName: string;
  type: 'license' | 'requirement' | 'tax' | 'entity';
  itemId: string; // References the id of the relevant license, requirement, etc.
  title: string;
  description: string;
  dueDate: Date | string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'dismissed';
  createdAt: Date | string;
  resolvedAt?: Date | string;
  assignedTo?: string;
}

export interface TexasLawUpdate {
  id: string;
  title: string;
  summary: string;
  effectiveDate: Date | string;
  lawReference: string;
  categories: ComplianceCategory[];
  affectedEntityTypes: EntityType[];
  impactLevel: 'low' | 'medium' | 'high';
  actionRequired: boolean;
  sourceUrl?: string;
  createdAt: Date | string;
}

export interface LegalComplianceManagerProps {
  entities: Array<{ id: number, name: string, type: string }>;
  entityDetails?: EntityDetails[];
  licenses?: License[];
  requirements?: ComplianceRequirement[];
  taxFilings?: TaxFiling[];
  alerts?: ComplianceAlert[];
  lawUpdates?: TexasLawUpdate[];
  onCreateEntityDetails?: (details: Omit<EntityDetails, 'id'>) => Promise<EntityDetails>;
  onUpdateEntityDetails?: (id: string, details: Partial<EntityDetails>) => Promise<EntityDetails>;
  onCreateLicense?: (license: Omit<License, 'id'>) => Promise<License>;
  onUpdateLicense?: (id: string, license: Partial<License>) => Promise<License>;
  onDeleteLicense?: (id: string) => Promise<void>;
  onCreateRequirement?: (requirement: Omit<ComplianceRequirement, 'id'>) => Promise<ComplianceRequirement>;
  onUpdateRequirement?: (id: string, requirement: Partial<ComplianceRequirement>) => Promise<ComplianceRequirement>;
  onDeleteRequirement?: (id: string) => Promise<void>;
  onCreateTaxFiling?: (filing: Omit<TaxFiling, 'id'>) => Promise<TaxFiling>;
  onUpdateTaxFiling?: (id: string, filing: Partial<TaxFiling>) => Promise<TaxFiling>;
  onDeleteTaxFiling?: (id: string) => Promise<void>;
  onResolveAlert?: (id: string, status: 'resolved' | 'dismissed') => Promise<void>;
  onUploadDocument?: (entityId: number, documentType: DocumentType, file: File) => Promise<string>;
}

// Main component
const LegalComplianceManager: React.FC<LegalComplianceManagerProps> = ({
  entities,
  entityDetails = [],
  licenses = [],
  requirements = [],
  taxFilings = [],
  alerts = [],
  lawUpdates = [],
  onCreateEntityDetails,
  onUpdateEntityDetails,
  onCreateLicense,
  onUpdateLicense,
  onDeleteLicense,
  onCreateRequirement,
  onUpdateRequirement,
  onDeleteRequirement,
  onCreateTaxFiling,
  onUpdateTaxFiling,
  onDeleteTaxFiling,
  onResolveAlert,
  onUploadDocument
}) => {
  const [selectedEntity, setSelectedEntity] = useState<number | 'all'>('all');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreatingLicense, setIsCreatingLicense] = useState(false);
  const [isCreatingRequirement, setIsCreatingRequirement] = useState(false);
  const [isCreatingTaxFiling, setIsCreatingTaxFiling] = useState(false);
  const [isEditingEntityDetails, setIsEditingEntityDetails] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(null);
  const [selectedTaxFiling, setSelectedTaxFiling] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Filtered data based on selected entity and filters
  const filteredEntityDetails = entityDetails.filter(detail => 
    selectedEntity === 'all' || detail.entityId === selectedEntity
  );
  
  const filteredLicenses = licenses.filter(license => {
    // Filter by entity
    if (selectedEntity !== 'all' && license.entityId !== selectedEntity) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== 'all' && license.status !== statusFilter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !license.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const filteredRequirements = requirements.filter(requirement => {
    // Filter by entity
    if (selectedEntity !== 'all' && requirement.entityId !== selectedEntity) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== 'all' && requirement.status !== statusFilter) {
      return false;
    }
    
    // Filter by category
    if (categoryFilter !== 'all' && requirement.category !== categoryFilter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !requirement.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const filteredTaxFilings = taxFilings.filter(filing => {
    // Filter by entity
    if (selectedEntity !== 'all' && filing.entityId !== selectedEntity) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== 'all' && filing.status !== statusFilter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !filing.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const filteredAlerts = alerts.filter(alert => 
    (selectedEntity === 'all' || alert.entityId === selectedEntity) &&
    (alert.status === 'open' || alert.status === 'in_progress')
  );
  
  const filteredLawUpdates = lawUpdates.filter(update => {
    const updateDate = new Date(update.effectiveDate);
    const threeMonthsAgo = addDays(new Date(), -90);
    const sixMonthsAhead = addDays(new Date(), 180);
    
    // Only show recent and upcoming updates (3 months back, 6 months ahead)
    return updateDate >= threeMonthsAgo && updateDate <= sixMonthsAhead;
  });

  // Format date
  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Get status badge variant
  const getStatusBadgeVariant = (status: ComplianceStatus) => {
    switch (status) {
      case ComplianceStatus.COMPLIANT:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case ComplianceStatus.PENDING:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case ComplianceStatus.EXPIRING_SOON:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case ComplianceStatus.EXPIRED:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case ComplianceStatus.NON_COMPLIANT:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case ComplianceStatus.NOT_APPLICABLE:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };
  
  // Format entity type for display
  const formatEntityType = (type: EntityType) => {
    switch (type) {
      case EntityType.LLC:
        return "Limited Liability Company";
      case EntityType.C_CORPORATION:
        return "C Corporation";
      case EntityType.S_CORPORATION:
        return "S Corporation";
      case EntityType.SOLE_PROPRIETORSHIP:
        return "Sole Proprietorship";
      case EntityType.PARTNERSHIP:
        return "Partnership";
      case EntityType.LIMITED_PARTNERSHIP:
        return "Limited Partnership";
      case EntityType.NONPROFIT:
        return "Nonprofit Organization";
      case EntityType.BENEFIT_CORPORATION:
        return "Benefit Corporation";
      case EntityType.PROFESSIONAL_CORPORATION:
        return "Professional Corporation";
      case EntityType.SERIES_LLC:
        return "Series LLC";
      default:
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };
  
  // Format license type for display
  const formatLicenseType = (type: LicenseType) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Format compliance category for display
  const formatComplianceCategory = (category: ComplianceCategory) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Get days until expiration
  const getDaysUntilDue = (date: string | Date) => {
    const dueDate = new Date(date);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Format days until due with appropriate label
  const formatDaysUntilDue = (date: string | Date) => {
    const days = getDaysUntilDue(date);
    
    if (days < 0) {
      return `${Math.abs(days)} days overdue`;
    } else if (days === 0) {
      return "Due today";
    } else if (days === 1) {
      return "Due tomorrow";
    } else {
      return `Due in ${days} days`;
    }
  };
  
  // Get status color class
  const getStatusColorClass = (date: string | Date) => {
    const days = getDaysUntilDue(date);
    
    if (days < 0) {
      return "text-red-600 dark:text-red-400";
    } else if (days <= 7) {
      return "text-yellow-600 dark:text-yellow-400";
    } else if (days <= 30) {
      return "text-orange-600 dark:text-orange-400";
    } else {
      return "text-green-600 dark:text-green-400";
    }
  };
  
  // Get alert severity badge
  const getAlertSeverityBadge = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'low':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case 'medium':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case 'high':
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case 'critical':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };
  
  // Get entity details by entity id
  const getEntityDetailsById = (entityId: number) => {
    return entityDetails.find(entity => entity.entityId === entityId);
  };
  
  // Get entity name by entity id
  const getEntityNameById = (entityId: number) => {
    const entity = entities.find(e => e.id === entityId);
    return entity ? entity.name : '';
  };
  
  // Calculate compliance stats
  const calculateComplianceStats = () => {
    const totalItems = filteredLicenses.length + filteredRequirements.length + filteredTaxFilings.length;
    const compliantItems = [
      ...filteredLicenses.filter(l => l.status === ComplianceStatus.COMPLIANT),
      ...filteredRequirements.filter(r => r.status === ComplianceStatus.COMPLIANT),
      ...filteredTaxFilings.filter(t => t.status === ComplianceStatus.COMPLIANT)
    ].length;
    
    const pendingItems = [
      ...filteredLicenses.filter(l => l.status === ComplianceStatus.PENDING),
      ...filteredRequirements.filter(r => r.status === ComplianceStatus.PENDING),
      ...filteredTaxFilings.filter(t => t.status === ComplianceStatus.PENDING)
    ].length;
    
    const expiringItems = [
      ...filteredLicenses.filter(l => l.status === ComplianceStatus.EXPIRING_SOON),
      ...filteredRequirements.filter(r => r.status === ComplianceStatus.EXPIRING_SOON),
      ...filteredTaxFilings.filter(t => t.status === ComplianceStatus.EXPIRING_SOON)
    ].length;
    
    const nonCompliantItems = [
      ...filteredLicenses.filter(l => 
        l.status === ComplianceStatus.EXPIRED || l.status === ComplianceStatus.NON_COMPLIANT
      ),
      ...filteredRequirements.filter(r => 
        r.status === ComplianceStatus.EXPIRED || r.status === ComplianceStatus.NON_COMPLIANT
      ),
      ...filteredTaxFilings.filter(t => 
        t.status === ComplianceStatus.EXPIRED || t.status === ComplianceStatus.NON_COMPLIANT
      )
    ].length;
    
    const complianceRate = totalItems > 0 ? (compliantItems / totalItems) * 100 : 0;
    
    return {
      totalItems,
      compliantItems,
      pendingItems,
      expiringItems,
      nonCompliantItems,
      complianceRate
    };
  };
  
  const complianceStats = calculateComplianceStats();
  
  // Get upcoming deadlines
  const getUpcomingDeadlines = () => {
    const now = new Date();
    const thirtyDaysLater = addDays(now, 30);
    
    const upcomingLicenses = filteredLicenses
      .filter(license => {
        const expirationDate = new Date(license.expirationDate);
        return expirationDate > now && expirationDate <= thirtyDaysLater;
      })
      .map(license => ({
        id: license.id,
        entityId: license.entityId,
        entityName: license.entityName,
        name: license.name,
        dueDate: license.expirationDate,
        type: 'license' as const,
        category: license.licenseType
      }));
    
    const upcomingRequirements = filteredRequirements
      .filter(requirement => {
        const dueDate = new Date(requirement.nextDueDate);
        return dueDate > now && dueDate <= thirtyDaysLater;
      })
      .map(requirement => ({
        id: requirement.id,
        entityId: requirement.entityId,
        entityName: requirement.entityName,
        name: requirement.name,
        dueDate: requirement.nextDueDate,
        type: 'requirement' as const,
        category: requirement.category
      }));
    
    const upcomingTaxFilings = filteredTaxFilings
      .filter(filing => {
        const dueDate = new Date(filing.dueDate);
        return dueDate > now && dueDate <= thirtyDaysLater;
      })
      .map(filing => ({
        id: filing.id,
        entityId: filing.entityId,
        entityName: filing.entityName,
        name: filing.name,
        dueDate: filing.dueDate,
        type: 'tax' as const,
        category: filing.taxType
      }));
    
    return [...upcomingLicenses, ...upcomingRequirements, ...upcomingTaxFilings]
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };
  
  const upcomingDeadlines = getUpcomingDeadlines();
  
  // Handle document upload
  const handleDocumentUpload = async (
    entityId: number, 
    documentType: DocumentType, 
    file: File
  ) => {
    setIsLoading(true);
    
    try {
      if (onUploadDocument) {
        const fileUrl = await onUploadDocument(entityId, documentType, file);
        
        toast({
          title: "Document uploaded",
          description: "The document has been successfully uploaded.",
        });
        
        return fileUrl;
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    
    return null;
  };
  
  // Handle alert resolution
  const handleResolveAlert = async (alertId: string, status: 'resolved' | 'dismissed') => {
    try {
      if (onResolveAlert) {
        await onResolveAlert(alertId, status);
        
        toast({
          title: status === 'resolved' ? "Alert resolved" : "Alert dismissed",
          description: `The alert has been ${status}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Action failed",
        description: `Failed to ${status} the alert. Please try again.`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Legal Compliance Management</h2>
          <p className="text-muted-foreground">
            Track and manage legal compliance requirements for your Texas businesses
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={selectedEntity === 'all' ? 'all' : selectedEntity.toString()}
            onValueChange={(value) => setSelectedEntity(value === 'all' ? 'all' : parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              {entities.map((entity) => (
                <SelectItem key={entity.id} value={entity.id.toString()}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add New
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsCreatingLicense(true)}>
                <FileCheck className="mr-2 h-4 w-4" />
                New License
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsCreatingRequirement(true)}>
                <FileText className="mr-2 h-4 w-4" />
                New Requirement
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsCreatingTaxFiling(true)}>
                <Calendar className="mr-2 h-4 w-4" />
                New Tax Filing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Alerts Banner */}
      {filteredAlerts.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Attention needed
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  You have {filteredAlerts.length} compliance {filteredAlerts.length === 1 ? 'alert' : 'alerts'} that require your attention.
                </p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-900/50"
                    onClick={() => setActiveTab('alerts')}
                  >
                    View alerts
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="entities">Entity Details</TabsTrigger>
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          {/* Top stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className={complianceStats.nonCompliantItems > 0 ? "border-red-200 dark:border-red-800" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  Compliance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{complianceStats.complianceRate.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {complianceStats.compliantItems} of {complianceStats.totalItems} items compliant
                </div>
                <Progress 
                  value={complianceStats.complianceRate} 
                  className="h-2 mt-3"
                  color={
                    complianceStats.complianceRate >= 90 ? "bg-green-500" :
                    complianceStats.complianceRate >= 75 ? "bg-yellow-500" :
                    "bg-red-500"
                  }
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  Non-Compliant Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {complianceStats.nonCompliantItems}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {complianceStats.nonCompliantItems > 0 ? 
                    "Requires immediate attention" : 
                    "All items are compliant"
                  }
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs">
                  {complianceStats.nonCompliantItems > 0 ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs h-7 mt-1"
                      onClick={() => {
                        setStatusFilter(ComplianceStatus.NON_COMPLIANT);
                        setActiveTab('requirements');
                      }}
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      View items
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      <span>All good!</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Expiring Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {complianceStats.expiringItems}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Items expiring in the next 30 days
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs">
                  {complianceStats.expiringItems > 0 ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs h-7 mt-1"
                      onClick={() => {
                        setStatusFilter(ComplianceStatus.EXPIRING_SOON);
                        setActiveTab('licenses');
                      }}
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      View expiring
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      <span>No upcoming expirations</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  Pending Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {complianceStats.pendingItems}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Items pending completion or approval
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs">
                  {complianceStats.pendingItems > 0 ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs h-7 mt-1"
                      onClick={() => {
                        setStatusFilter(ComplianceStatus.PENDING);
                        setActiveTab('requirements');
                      }}
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      View pending
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      <span>No pending items</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Upcoming deadlines and Texas law updates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>
                  Items due in the next 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingDeadlines.length === 0 ? (
                  <div className="text-center py-6">
                    <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No upcoming deadlines</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingDeadlines.slice(0, 5).map((deadline) => (
                      <div key={`${deadline.type}-${deadline.id}`} className="flex justify-between items-start pb-3 border-b last:border-0 last:pb-0">
                        <div>
                          <div className="font-medium">{deadline.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {deadline.entityName} • {
                              deadline.type === 'license' ? 'License Renewal' :
                              deadline.type === 'requirement' ? 'Compliance Requirement' :
                              'Tax Filing'
                            }
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${getStatusColorClass(deadline.dueDate)}`}>
                          {formatDaysUntilDue(deadline.dueDate)}
                        </div>
                      </div>
                    ))}
                    
                    {upcomingDeadlines.length > 5 && (
                      <div className="text-center pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (upcomingDeadlines[0].type === 'license') {
                              setActiveTab('licenses');
                            } else if (upcomingDeadlines[0].type === 'requirement') {
                              setActiveTab('requirements');
                            } else {
                              setActiveTab('taxes');
                            }
                          }}
                        >
                          View all {upcomingDeadlines.length} deadlines
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Texas Law Updates</CardTitle>
                <CardDescription>
                  Recent and upcoming changes to Texas business laws
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredLawUpdates.length === 0 ? (
                  <div className="text-center py-6">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No recent law updates</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredLawUpdates.slice(0, 3).map((update) => (
                      <div key={update.id} className="pb-3 border-b last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-medium">{update.title}</div>
                          <Badge 
                            variant="outline" 
                            className={
                              update.impactLevel === 'high' ? 
                              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                              update.impactLevel === 'medium' ? 
                              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                              "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            }
                          >
                            {update.impactLevel.charAt(0).toUpperCase() + update.impactLevel.slice(1)} Impact
                          </Badge>
                        </div>
                        <div className="text-sm mb-2">{update.summary}</div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <div>Effective: {formatDate(update.effectiveDate)}</div>
                          <div>Ref: {update.lawReference}</div>
                        </div>
                        {update.actionRequired && (
                          <div className="mt-2">
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                              Action Required
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Entity Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Entity Overview</CardTitle>
              <CardDescription>
                Summary of your Texas business entities and their compliance status
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entity Name</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Texas Entity #</TableHead>
                    <TableHead>Annual Filing Due</TableHead>
                    <TableHead>Licenses</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntityDetails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No entity details available</p>
                          {entities.length > 0 && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => setIsEditingEntityDetails(true)}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Entity Details
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEntityDetails.map((entity) => {
                      const entityLicenses = licenses.filter(license => license.entityId === entity.entityId);
                      const complianceIssues = [
                        ...licenses.filter(license => 
                          license.entityId === entity.entityId && 
                          (license.status === ComplianceStatus.EXPIRED || license.status === ComplianceStatus.NON_COMPLIANT)
                        ),
                        ...requirements.filter(requirement => 
                          requirement.entityId === entity.entityId && 
                          (requirement.status === ComplianceStatus.EXPIRED || requirement.status === ComplianceStatus.NON_COMPLIANT)
                        ),
                        ...taxFilings.filter(filing => 
                          filing.entityId === entity.entityId && 
                          (filing.status === ComplianceStatus.EXPIRED || filing.status === ComplianceStatus.NON_COMPLIANT)
                        )
                      ];
                      
                      const complianceStatus = complianceIssues.length > 0 
                        ? ComplianceStatus.NON_COMPLIANT 
                        : ComplianceStatus.COMPLIANT;
                      
                      return (
                        <TableRow key={entity.id}>
                          <TableCell>
                            <div className="font-medium">{entity.entityName}</div>
                            <div className="text-xs text-muted-foreground">
                              Formed: {formatDate(entity.formationDate)}
                            </div>
                          </TableCell>
                          <TableCell>{formatEntityType(entity.entityType)}</TableCell>
                          <TableCell>{entity.texasEntityNumber || 'N/A'}</TableCell>
                          <TableCell>
                            <div className={getStatusColorClass(entity.annualFilingDueDate)}>
                              {formatDate(entity.annualFilingDueDate)}
                            </div>
                          </TableCell>
                          <TableCell>{entityLicenses.length}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={getStatusBadgeVariant(complianceStatus)}
                            >
                              {complianceIssues.length > 0 
                                ? `${complianceIssues.length} Issues` 
                                : 'Compliant'
                              }
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setSelectedEntity(entity.entityId);
                                setActiveTab('entities');
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Entity Details Tab */}
        <TabsContent value="entities" className="space-y-4">
          {selectedEntity === 'all' ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select an Entity</h3>
                  <p className="text-muted-foreground mb-4">
                    Please select a specific business entity to view its details
                  </p>
                  <Select
                    value={selectedEntity === 'all' ? undefined : selectedEntity.toString()}
                    onValueChange={(value) => setSelectedEntity(parseInt(value))}
                  >
                    <SelectTrigger className="w-[250px] mx-auto">
                      <SelectValue placeholder="Select entity" />
                    </SelectTrigger>
                    <SelectContent>
                      {entities.map((entity) => (
                        <SelectItem key={entity.id} value={entity.id.toString()}>
                          {entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {getEntityDetailsById(selectedEntity as number) ? (
                <EntityDetailsView 
                  entity={getEntityDetailsById(selectedEntity as number)!}
                  onEdit={() => setIsEditingEntityDetails(true)}
                  onUploadDocument={handleDocumentUpload}
                />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-6">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Entity Details</h3>
                      <p className="text-muted-foreground mb-4">
                        No details have been added for {getEntityNameById(selectedEntity as number)}
                      </p>
                      <Button onClick={() => setIsEditingEntityDetails(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Entity Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
        
        {/* Licenses Tab */}
        <TabsContent value="licenses" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search licenses..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={ComplianceStatus.COMPLIANT}>Compliant</SelectItem>
                  <SelectItem value={ComplianceStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={ComplianceStatus.EXPIRING_SOON}>Expiring Soon</SelectItem>
                  <SelectItem value={ComplianceStatus.EXPIRED}>Expired</SelectItem>
                  <SelectItem value={ComplianceStatus.NON_COMPLIANT}>Non-Compliant</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="License Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={LicenseType.BUSINESS}>Business</SelectItem>
                  <SelectItem value={LicenseType.SALES_TAX}>Sales Tax</SelectItem>
                  <SelectItem value={LicenseType.PROFESSIONAL}>Professional</SelectItem>
                  <SelectItem value={LicenseType.LIQUOR}>Liquor</SelectItem>
                  <SelectItem value={LicenseType.FOOD}>Food</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            <Button onClick={() => setIsCreatingLicense(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add License
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>License</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>License #</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLicenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <FileCheck className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No licenses found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLicenses.map((license) => (
                      <TableRow 
                        key={license.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedLicense(license.id)}
                      >
                        <TableCell>
                          <div className="font-medium">{license.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {license.issuingAuthority}
                          </div>
                        </TableCell>
                        <TableCell>{license.entityName}</TableCell>
                        <TableCell>{formatLicenseType(license.licenseType)}</TableCell>
                        <TableCell>{license.licenseNumber}</TableCell>
                        <TableCell>
                          <div className={getStatusColorClass(license.expirationDate)}>
                            {formatDate(license.expirationDate)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDaysUntilDue(license.expirationDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={getStatusBadgeVariant(license.status)}
                          >
                            {license.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLicense(license.id);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Document
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <CalendarDays className="mr-2 h-4 w-4" />
                                Set Reminder
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onDeleteLicense) {
                                    onDeleteLicense(license.id);
                                  }
                                }} 
                                className="text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Requirements Tab */}
        <TabsContent value="requirements" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requirements..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={ComplianceStatus.COMPLIANT}>Compliant</SelectItem>
                  <SelectItem value={ComplianceStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={ComplianceStatus.EXPIRING_SOON}>Due Soon</SelectItem>
                  <SelectItem value={ComplianceStatus.EXPIRED}>Overdue</SelectItem>
                  <SelectItem value={ComplianceStatus.NON_COMPLIANT}>Non-Compliant</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value={ComplianceCategory.FORMATION}>Formation</SelectItem>
                  <SelectItem value={ComplianceCategory.LICENSING}>Licensing</SelectItem>
                  <SelectItem value={ComplianceCategory.TAXATION}>Taxation</SelectItem>
                  <SelectItem value={ComplianceCategory.EMPLOYMENT}>Employment</SelectItem>
                  <SelectItem value={ComplianceCategory.REPORTING}>Reporting</SelectItem>
                  <SelectItem value={ComplianceCategory.PERMITS}>Permits</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => setIsCreatingTaxFiling(true)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Add Tax Filing
              </Button>
              
              <Button onClick={() => setIsCreatingRequirement(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Requirement
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="requirements">
            <TabsList>
              <TabsTrigger value="requirements">Compliance Requirements</TabsTrigger>
              <TabsTrigger value="taxes">Tax Filings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requirements">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Requirement</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Next Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequirements.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex flex-col items-center">
                              <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">No requirements found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRequirements.map((requirement) => (
                          <TableRow 
                            key={requirement.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setSelectedRequirement(requirement.id)}
                          >
                            <TableCell>
                              <div className="font-medium">{requirement.name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {requirement.description}
                              </div>
                            </TableCell>
                            <TableCell>{requirement.entityName}</TableCell>
                            <TableCell>
                              {formatComplianceCategory(requirement.category)}
                            </TableCell>
                            <TableCell>
                              {requirement.frequency.charAt(0).toUpperCase() + requirement.frequency.slice(1)}
                            </TableCell>
                            <TableCell>
                              <div className={getStatusColorClass(requirement.nextDueDate)}>
                                {formatDate(requirement.nextDueDate)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDaysUntilDue(requirement.nextDueDate)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={getStatusBadgeVariant(requirement.status)}
                              >
                                {requirement.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedRequirement(requirement.id);
                                  }}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Document
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    if (onUpdateRequirement) {
                                      onUpdateRequirement(requirement.id, { 
                                        status: ComplianceStatus.COMPLIANT,
                                        lastFiledDate: new Date().toISOString()
                                      });
                                    }
                                  }}>
                                    <Check className="mr-2 h-4 w-4" />
                                    Mark as Complete
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onDeleteRequirement) {
                                        onDeleteRequirement(requirement.id);
                                      }
                                    }} 
                                    className="text-red-600"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="taxes">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tax Filing</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Tax Type</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTaxFilings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex flex-col items-center">
                              <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">No tax filings found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTaxFilings.map((filing) => (
                          <TableRow 
                            key={filing.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setSelectedTaxFiling(filing.id)}
                          >
                            <TableCell>
                              <div className="font-medium">{filing.name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {filing.description}
                              </div>
                            </TableCell>
                            <TableCell>{filing.entityName}</TableCell>
                            <TableCell>
                              {filing.taxType.charAt(0).toUpperCase() + filing.taxType.slice(1)}
                            </TableCell>
                            <TableCell>
                              {filing.frequency.charAt(0).toUpperCase() + filing.frequency.slice(1)}
                            </TableCell>
                            <TableCell>
                              <div className={getStatusColorClass(filing.dueDate)}>
                                {formatDate(filing.dueDate)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDaysUntilDue(filing.dueDate)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={getStatusBadgeVariant(filing.status)}
                              >
                                {filing.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTaxFiling(filing.id);
                                  }}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Document
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    if (onUpdateTaxFiling) {
                                      onUpdateTaxFiling(filing.id, { 
                                        status: ComplianceStatus.COMPLIANT,
                                        lastFiledDate: new Date().toISOString()
                                      });
                                    }
                                  }}>
                                    <Check className="mr-2 h-4 w-4" />
                                    Mark as Filed
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onDeleteTaxFiling) {
                                        onDeleteTaxFiling(filing.id);
                                      }
                                    }} 
                                    className="text-red-600"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Compliance Alerts</CardTitle>
                  <CardDescription>
                    Issues that require your attention
                  </CardDescription>
                </div>
                <Select
                  value={selectedEntity === 'all' ? 'all' : selectedEntity.toString()}
                  onValueChange={(value) => setSelectedEntity(value === 'all' ? 'all' : parseInt(value))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    {entities.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id.toString()}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <ShieldCheck className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">All Clear!</h3>
                  <p className="text-muted-foreground">
                    You have no compliance alerts that require attention
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAlerts.map((alert) => (
                    <Card 
                      key={alert.id}
                      className={`
                        border-l-4 
                        ${alert.severity === 'critical' ? 'border-l-red-500' : 
                          alert.severity === 'high' ? 'border-l-orange-500' : 
                          alert.severity === 'medium' ? 'border-l-yellow-500' : 
                          'border-l-blue-500'}
                      `}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <AlertCircle className={`
                                h-5 w-5
                                ${alert.severity === 'critical' ? 'text-red-500' : 
                                  alert.severity === 'high' ? 'text-orange-500' : 
                                  alert.severity === 'medium' ? 'text-yellow-500' : 
                                  'text-blue-500'}
                              `} />
                              <div className="font-medium">{alert.title}</div>
                              <Badge 
                                variant="outline" 
                                className={getAlertSeverityBadge(alert.severity)}
                              >
                                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                              </Badge>
                            </div>
                            <div className="text-sm mt-1">{alert.description}</div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <div className="text-muted-foreground">
                                {alert.entityName}
                              </div>
                              <div className={`${getStatusColorClass(alert.dueDate)}`}>
                                Due: {formatDate(alert.dueDate)}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                if (alert.type === 'license') {
                                  setSelectedLicense(alert.itemId);
                                  setActiveTab('licenses');
                                } else if (alert.type === 'requirement') {
                                  setSelectedRequirement(alert.itemId);
                                  setActiveTab('requirements');
                                } else if (alert.type === 'tax') {
                                  setSelectedTaxFiling(alert.itemId);
                                  setActiveTab('requirements');
                                } else if (alert.type === 'entity') {
                                  setSelectedEntity(alert.entityId);
                                  setActiveTab('entities');
                                }
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleResolveAlert(alert.id, 'resolved')}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Resolve
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleResolveAlert(alert.id, 'dismissed')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Texas Law Updates</CardTitle>
              <CardDescription>
                Laws and regulations that may affect your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLawUpdates.length === 0 ? (
                <div className="text-center py-6">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No recent law updates</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLawUpdates.map((update) => (
                    <div key={update.id} className="pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{update.title}</div>
                        <Badge 
                          variant="outline" 
                          className={
                            update.impactLevel === 'high' ? 
                            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                            update.impactLevel === 'medium' ? 
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          }
                        >
                          {update.impactLevel.charAt(0).toUpperCase() + update.impactLevel.slice(1)} Impact
                        </Badge>
                      </div>
                      <div className="text-sm mb-2">{update.summary}</div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          Effective: {formatDate(update.effectiveDate)}
                        </div>
                        <div className="flex gap-2">
                          {update.sourceUrl && (
                            <Button variant="outline" size="sm" onClick={() => window.open(update.sourceUrl, '_blank')}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Learn More
                            </Button>
                          )}
                          {update.actionRequired && (
                            <Button variant="outline" size="sm">
                              <Plus className="mr-2 h-4 w-4" />
                              Create Requirement
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* License Detail Dialog would be implemented here */}
      
      {/* Requirement Detail Dialog would be implemented here */}
      
      {/* Tax Filing Detail Dialog would be implemented here */}
      
      {/* Create License Dialog would be implemented here */}
      
      {/* Create Requirement Dialog would be implemented here */}
      
      {/* Create Tax Filing Dialog would be implemented here */}
      
      {/* Entity Details Edit Dialog would be implemented here */}
    </div>
  );
};

// Entity Details View Component
interface EntityDetailsViewProps {
  entity: EntityDetails;
  onEdit: () => void;
  onUploadDocument: (entityId: number, documentType: DocumentType, file: File) => Promise<string | null>;
}

const EntityDetailsView: React.FC<EntityDetailsViewProps> = ({ 
  entity,
  onEdit,
  onUploadDocument
}) => {
  // Format date
  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Format entity type for display
  const formatEntityType = (type: EntityType) => {
    switch (type) {
      case EntityType.LLC:
        return "Limited Liability Company";
      case EntityType.C_CORPORATION:
        return "C Corporation";
      case EntityType.S_CORPORATION:
        return "S Corporation";
      case EntityType.SOLE_PROPRIETORSHIP:
        return "Sole Proprietorship";
      case EntityType.PARTNERSHIP:
        return "Partnership";
      case EntityType.LIMITED_PARTNERSHIP:
        return "Limited Partnership";
      case EntityType.NONPROFIT:
        return "Nonprofit Organization";
      case EntityType.BENEFIT_CORPORATION:
        return "Benefit Corporation";
      case EntityType.PROFESSIONAL_CORPORATION:
        return "Professional Corporation";
      case EntityType.SERIES_LLC:
        return "Series LLC";
      default:
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };
  
  // Format document type for display
  const formatDocumentType = (type: DocumentType) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Get days until annual filing
  const getDaysUntilFiling = () => {
    const filingDate = new Date(entity.annualFilingDueDate);
    const today = new Date();
    const diffTime = filingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysUntilFiling = getDaysUntilFiling();
  
  // Get status color class
  const getStatusColorClass = (date: string | Date) => {
    const days = getDaysUntilFiling();
    
    if (days < 0) {
      return "text-red-600 dark:text-red-400";
    } else if (days <= 7) {
      return "text-yellow-600 dark:text-yellow-400";
    } else if (days <= 30) {
      return "text-orange-600 dark:text-orange-400";
    } else {
      return "text-green-600 dark:text-green-400";
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-xl">{entity.entityName}</CardTitle>
              <CardDescription>
                {formatEntityType(entity.entityType)}
              </CardDescription>
            </div>
            <div>
              <Button variant="outline" onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Entity Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Texas Entity Number</div>
                    <div className="font-medium">{entity.texasEntityNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">EIN</div>
                    <div className="font-medium">{entity.einNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Formation Date</div>
                    <div className="font-medium">{formatDate(entity.formationDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="font-medium capitalize">{entity.status}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-muted-foreground">Annual Filing Due Date</div>
                    <div className={`font-medium ${getStatusColorClass(entity.annualFilingDueDate)}`}>
                      {formatDate(entity.annualFilingDueDate)} 
                      {daysUntilFiling < 0 
                        ? ` (${Math.abs(daysUntilFiling)} days overdue)` 
                        : daysUntilFiling === 0 
                          ? ' (Due today)' 
                          : ` (${daysUntilFiling} days remaining)`
                      }
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Registered Agent & Address</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Registered Agent</div>
                    <div className="font-medium">{entity.registeredAgent}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Registered Office Address</div>
                    <div className="font-medium">{entity.registeredOfficeAddress}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Operating Address</div>
                    <div className="font-medium">{entity.operatingAddress}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Ownership</h3>
                <div className="space-y-2">
                  {entity.owners.map((owner, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{owner.name}</div>
                        {owner.title && (
                          <div className="text-xs text-muted-foreground">{owner.title}</div>
                        )}
                      </div>
                      <Badge variant="outline">{owner.ownership}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              {entity.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                  <div className="text-sm border rounded-md p-3 bg-muted/50">
                    {entity.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Entity Documents</CardTitle>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entity.documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No documents uploaded yet</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                entity.documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>{document.name}</TableCell>
                    <TableCell>{formatDocumentType(document.type)}</TableCell>
                    <TableCell>{formatDate(document.issuedDate)}</TableCell>
                    <TableCell>
                      {document.expirationDate ? formatDate(document.expirationDate) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {document.fileUrl && (
                          <Button variant="ghost" size="icon" onClick={() => window.open(document.fileUrl, '_blank')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalComplianceManager;