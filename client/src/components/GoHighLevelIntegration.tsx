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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  AlertCircle,
  ArrowUpRight,
  Ban,
  BarChart2,
  Bell,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Edit,
  ExternalLink,
  Eye,
  Filter,
  Gauge,
  Globe,
  HelpCircle,
  Info,
  Link,
  Loader,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Play,
  Plus,
  PlusCircle,
  RefreshCw,
  Search,
  Settings,
  Smartphone,
  Tag,
  Timer,
  Trash,
  TrendingUp,
  User,
  Users,
  Wrench,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Enums for Go High Level Integration
export enum GHLConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  PENDING = 'pending',
  ERROR = 'error'
}

export enum GHLSyncFrequency {
  REALTIME = 'realtime',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MANUAL = 'manual'
}

export enum GHLFeature {
  CONTACTS = 'contacts',
  OPPORTUNITIES = 'opportunities',
  CALENDAR = 'calendar',
  WORKFLOWS = 'workflows',
  FORMS = 'forms',
  SMS = 'sms',
  EMAIL = 'email',
  WEBSITE = 'website',
  FUNNELS = 'funnels',
  APPOINTMENTS = 'appointments',
  SURVEYS = 'surveys',
  PAYMENTS = 'payments'
}

export enum GHLTaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  WAITING = 'waiting'
}

export enum GHLContactStatus {
  NEW = 'new',
  ACTIVE = 'active',
  OPPORTUNITY = 'opportunity',
  CUSTOMER = 'customer',
  CLOSED = 'closed'
}

export enum GHLContactSource {
  WEBSITE = 'website',
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
  REFERRAL = 'referral',
  EMAIL = 'email',
  PHONE = 'phone',
  MANUAL = 'manual',
  IMPORT = 'import',
  OTHER = 'other'
}

export enum GHLAppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

// Go High Level Interfaces
export interface GHLConnection {
  id: string;
  status: GHLConnectionStatus;
  locationId: string;
  locationName: string;
  apiKey?: string;
  connected: boolean;
  syncFrequency: GHLSyncFrequency;
  lastSyncedAt?: Date | string;
  nextSyncAt?: Date | string;
  featuresEnabled: GHLFeature[];
  contactsCount?: number;
  tasksCount?: number;
  appointmentsCount?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  entityId: number;
  entityName: string;
}

export interface GHLContact {
  id: string;
  connectionId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status: GHLContactStatus;
  source: GHLContactSource;
  tags?: string[];
  notes?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  customFields?: Record<string, any>;
  dateAdded: Date | string;
  dateUpdated: Date | string;
  dateLastContacted?: Date | string;
  value?: number;
  lastActivity?: string;
  entityId: number;
  entityName: string;
}

export interface GHLTask {
  id: string;
  connectionId: string;
  contactId?: string;
  title: string;
  description?: string;
  status: GHLTaskStatus;
  dueDate: Date | string;
  completedDate?: Date | string;
  assignedTo?: string;
  assignedToName?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date | string;
  updatedAt: Date | string;
  entityId: number;
  entityName: string;
}

export interface GHLAppointment {
  id: string;
  connectionId: string;
  contactId: string;
  contactName: string;
  title: string;
  description?: string;
  startTime: Date | string;
  endTime: Date | string;
  status: GHLAppointmentStatus;
  calendarId: string;
  calendarName?: string;
  location?: string;
  appointmentTypeId?: string;
  appointmentTypeName?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  entityId: number;
  entityName: string;
}

export interface GHLPipeline {
  id: string;
  connectionId: string;
  name: string;
  description?: string;
  stages: {
    id: string;
    name: string;
    order: number;
    color?: string;
    probability?: number;
  }[];
  opportunitiesCount: number;
  totalValue: number;
  active: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  entityId: number;
  entityName: string;
}

export interface GHLOpportunity {
  id: string;
  connectionId: string;
  contactId: string;
  contactName: string;
  pipelineId: string;
  pipelineName: string;
  stageId: string;
  stageName: string;
  name: string;
  value: number;
  assignedTo?: string;
  assignedToName?: string;
  status: 'active' | 'won' | 'lost';
  createdAt: Date | string;
  updatedAt: Date | string;
  expectedCloseDate?: Date | string;
  wonDate?: Date | string;
  lostDate?: Date | string;
  lostReason?: string;
  entityId: number;
  entityName: string;
}

export interface GHLForm {
  id: string;
  connectionId: string;
  name: string;
  slug: string;
  fields: {
    id: string;
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
  }[];
  submissionsCount: number;
  conversionRate: number;
  active: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  entityId: number;
  entityName: string;
}

export interface GHLWorkflow {
  id: string;
  connectionId: string;
  name: string;
  description?: string;
  trigger: string;
  active: boolean;
  stats: {
    started: number;
    completed: number;
    failed: number;
  };
  lastRun?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  entityId: number;
  entityName: string;
}

export interface GHLDashboardStats {
  totalContacts: number;
  newContactsThisWeek: number;
  totalAppointments: number;
  upcomingAppointments: number;
  totalOpportunities: number;
  opportunitiesValue: number;
  wonOpportunities: number;
  conversionRate: number;
  tasks: {
    completed: number;
    overdue: number;
    upcoming: number;
  };
}

interface GoHighLevelIntegrationProps {
  entities: Array<{ id: number, name: string, type: string }>;
  connections?: GHLConnection[];
  contacts?: GHLContact[];
  tasks?: GHLTask[];
  appointments?: GHLAppointment[];
  pipelines?: GHLPipeline[];
  opportunities?: GHLOpportunity[];
  forms?: GHLForm[];
  workflows?: GHLWorkflow[];
  dashboardStats?: GHLDashboardStats;
  onConnect?: (entityId: number, locationId: string, apiKey: string) => Promise<GHLConnection>;
  onDisconnect?: (connectionId: string) => Promise<void>;
  onSyncNow?: (connectionId: string) => Promise<void>;
  onUpdateConnection?: (connectionId: string, data: Partial<GHLConnection>) => Promise<GHLConnection>;
  onAddContact?: (contact: Omit<GHLContact, 'id'>) => Promise<GHLContact>;
  onUpdateContact?: (contactId: string, data: Partial<GHLContact>) => Promise<GHLContact>;
  onAddTask?: (task: Omit<GHLTask, 'id'>) => Promise<GHLTask>;
  onUpdateTaskStatus?: (taskId: string, status: GHLTaskStatus) => Promise<GHLTask>;
  onCreatePipeline?: (pipeline: Omit<GHLPipeline, 'id'>) => Promise<GHLPipeline>;
  onUpdateOpportunity?: (opportunityId: string, data: Partial<GHLOpportunity>) => Promise<GHLOpportunity>;
}

const GoHighLevelIntegration: React.FC<GoHighLevelIntegrationProps> = ({
  entities,
  connections = [],
  contacts = [],
  tasks = [],
  appointments = [],
  pipelines = [],
  opportunities = [],
  forms = [],
  workflows = [],
  dashboardStats,
  onConnect,
  onDisconnect,
  onSyncNow,
  onUpdateConnection,
  onAddContact,
  onUpdateContact,
  onAddTask,
  onUpdateTaskStatus,
  onCreatePipeline,
  onUpdateOpportunity
}) => {
  const [selectedEntity, setSelectedEntity] = useState<number | 'all'>('all');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnecting, setIsConnecting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newConnectionData, setNewConnectionData] = useState<{
    entityId?: number;
    locationId: string;
    apiKey: string;
  }>({
    locationId: '',
    apiKey: ''
  });
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [isCreatingContact, setIsCreatingContact] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Get the selected connection 
  const currentConnection = selectedConnection 
    ? connections.find(conn => conn.id === selectedConnection) 
    : connections.find(conn => conn.entityId === selectedEntity) || null;
  
  // Filter data based on selected entity or connection
  const filteredConnections = connections.filter(connection => 
    selectedEntity === 'all' || connection.entityId === selectedEntity
  );
  
  const filteredContacts = contacts.filter(contact => {
    if (currentConnection && contact.connectionId !== currentConnection.id) {
      return false;
    }
    
    if (selectedEntity !== 'all' && contact.entityId !== selectedEntity) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        contact.firstName.toLowerCase().includes(searchLower) ||
        contact.lastName.toLowerCase().includes(searchLower) ||
        (contact.email && contact.email.toLowerCase().includes(searchLower)) ||
        (contact.phone && contact.phone.includes(searchTerm)) ||
        (contact.tags && contact.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    return true;
  });
  
  const filteredTasks = tasks.filter(task => {
    if (currentConnection && task.connectionId !== currentConnection.id) {
      return false;
    }
    
    if (selectedEntity !== 'all' && task.entityId !== selectedEntity) {
      return false;
    }
    
    return true;
  });
  
  const filteredAppointments = appointments.filter(appointment => {
    if (currentConnection && appointment.connectionId !== currentConnection.id) {
      return false;
    }
    
    if (selectedEntity !== 'all' && appointment.entityId !== selectedEntity) {
      return false;
    }
    
    return true;
  });
  
  const filteredOpportunities = opportunities.filter(opportunity => {
    if (currentConnection && opportunity.connectionId !== currentConnection.id) {
      return false;
    }
    
    if (selectedEntity !== 'all' && opportunity.entityId !== selectedEntity) {
      return false;
    }
    
    return true;
  });
  
  const filteredWorkflows = workflows.filter(workflow => {
    if (currentConnection && workflow.connectionId !== currentConnection.id) {
      return false;
    }
    
    if (selectedEntity !== 'all' && workflow.entityId !== selectedEntity) {
      return false;
    }
    
    return true;
  });
  
  // Format date
  const formatDate = (date: string | Date) => {
    try {
      return new Date(date).toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Format time 
  const formatTime = (date: string | Date) => {
    try {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Invalid time';
    }
  };
  
  // Format date and time
  const formatDateTime = (date: string | Date) => {
    try {
      return `${formatDate(date)} ${formatTime(date)}`;
    } catch (e) {
      return 'Invalid date/time';
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Handle connect to Go High Level
  const handleConnect = async () => {
    if (!newConnectionData.entityId || !newConnectionData.locationId || !newConnectionData.apiKey) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (onConnect) {
        const result = await onConnect(
          newConnectionData.entityId,
          newConnectionData.locationId,
          newConnectionData.apiKey
        );
        
        toast({
          title: "Connection successful",
          description: `Connected to Go High Level location: ${result.locationName}`,
        });
        
        setIsConnecting(false);
        setNewConnectionData({
          locationId: '',
          apiKey: ''
        });
        setSelectedConnection(result.id);
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to Go High Level. Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get color for GHL connection status badge
  const getConnectionStatusColor = (status: GHLConnectionStatus) => {
    switch (status) {
      case GHLConnectionStatus.CONNECTED:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case GHLConnectionStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case GHLConnectionStatus.ERROR:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case GHLConnectionStatus.DISCONNECTED:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
      default:
        return "";
    }
  };
  
  // Get color for contact status badge
  const getContactStatusColor = (status: GHLContactStatus) => {
    switch (status) {
      case GHLContactStatus.NEW:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case GHLContactStatus.ACTIVE:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case GHLContactStatus.OPPORTUNITY:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case GHLContactStatus.CUSTOMER:
        return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
      case GHLContactStatus.CLOSED:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      default:
        return "";
    }
  };
  
  // Get color for task status badge
  const getTaskStatusColor = (status: GHLTaskStatus) => {
    switch (status) {
      case GHLTaskStatus.NOT_STARTED:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
      case GHLTaskStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case GHLTaskStatus.COMPLETED:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case GHLTaskStatus.WAITING:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "";
    }
  };
  
  // Get color for appointment status badge
  const getAppointmentStatusColor = (status: GHLAppointmentStatus) => {
    switch (status) {
      case GHLAppointmentStatus.SCHEDULED:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case GHLAppointmentStatus.CONFIRMED:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case GHLAppointmentStatus.COMPLETED:
        return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
      case GHLAppointmentStatus.CANCELLED:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case GHLAppointmentStatus.NO_SHOW:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      default:
        return "";
    }
  };
  
  // Calculate stats based on current filter
  const calculateStats = () => {
    const totalContacts = filteredContacts.length;
    
    const newContacts = filteredContacts.filter(contact => {
      const dateAdded = new Date(contact.dateAdded);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return dateAdded >= oneWeekAgo;
    }).length;
    
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(task => task.status === GHLTaskStatus.COMPLETED).length;
    
    const upcomingAppointments = filteredAppointments.filter(appointment => {
      const startTime = new Date(appointment.startTime);
      const now = new Date();
      return startTime > now && appointment.status !== GHLAppointmentStatus.CANCELLED;
    }).length;
    
    const totalOpportunities = filteredOpportunities.length;
    const totalOpportunitiesValue = filteredOpportunities.reduce((sum, opp) => sum + opp.value, 0);
    const wonOpportunities = filteredOpportunities.filter(opp => opp.status === 'won').length;
    
    return {
      totalContacts,
      newContacts,
      totalTasks,
      completedTasks,
      upcomingAppointments,
      totalOpportunities,
      totalOpportunitiesValue,
      wonOpportunities
    };
  };
  
  const stats = calculateStats();
  
  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Go High Level Integration</h2>
          <p className="text-muted-foreground">
            Manage your Go High Level connections, contacts, and workflows
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
          
          {filteredConnections.length > 0 ? (
            <Select
              value={selectedConnection || ''}
              onValueChange={setSelectedConnection}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {filteredConnections.map((connection) => (
                  <SelectItem key={connection.id} value={connection.id}>
                    {connection.locationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Button onClick={() => setIsConnecting(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Connect Location
            </Button>
          )}
        </div>
      </div>
      
      {/* Connection status card if there's a selected connection */}
      {currentConnection && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <svg className="h-4 w-4 text-purple-700 dark:text-purple-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1L15.586 9.172L24 10.0887L18 16.4663L19.414 24L12 20.4L4.586 24L6 16.4663L0 10.0887L8.414 9.172L12 1Z" fill="currentColor"/>
                    </svg>
                  </div>
                  {currentConnection.locationName}
                </CardTitle>
                <CardDescription>
                  Go High Level Location
                </CardDescription>
              </div>
              <Badge 
                variant="outline" 
                className={getConnectionStatusColor(currentConnection.status)}
              >
                {currentConnection.status.charAt(0).toUpperCase() + currentConnection.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Contacts</div>
                  <div className="font-medium">{currentConnection.contactsCount || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Tasks</div>
                  <div className="font-medium">{currentConnection.tasksCount || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Appointments</div>
                  <div className="font-medium">{currentConnection.appointmentsCount || 0}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Sync Frequency</div>
                <div className="font-medium">
                  {currentConnection.syncFrequency.charAt(0).toUpperCase() + currentConnection.syncFrequency.slice(1)}
                </div>
              </div>
              
              {currentConnection.lastSyncedAt && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Last Synced</div>
                    <div className="font-medium">{formatDateTime(currentConnection.lastSyncedAt)}</div>
                  </div>
                  {currentConnection.nextSyncAt && (
                    <div>
                      <div className="text-sm text-muted-foreground">Next Sync</div>
                      <div className="font-medium">{formatDateTime(currentConnection.nextSyncAt)}</div>
                    </div>
                  )}
                </div>
              )}
              
              <div>
                <div className="text-sm text-muted-foreground">Features Enabled</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentConnection.featuresEnabled.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-3">
            <div className="flex justify-between w-full">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (onSyncNow && currentConnection) {
                    onSyncNow(currentConnection.id);
                    toast({
                      title: "Sync started",
                      description: "Syncing data with Go High Level...",
                    });
                  }
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Now
              </Button>
              
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Open Go High Level dashboard
                    window.open('https://marketplace.gohighlevel.com/', '_blank');
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Dashboard
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Settings or disconnect
                    if (onDisconnect && currentConnection) {
                      onDisconnect(currentConnection.id);
                      setSelectedConnection(null);
                      toast({
                        title: "Disconnected",
                        description: "Successfully disconnected from Go High Level.",
                      });
                    }
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
      
      {/* No Connection Card */}
      {!currentConnection && !isConnecting && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
              <svg className="h-6 w-6 text-purple-700 dark:text-purple-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L15.586 9.172L24 10.0887L18 16.4663L19.414 24L12 20.4L4.586 24L6 16.4663L0 10.0887L8.414 9.172L12 1Z" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Connect to Go High Level</h3>
            <p className="text-center text-muted-foreground mt-2 mb-4 max-w-md">
              Connect your Go High Level account to manage your contacts, appointments, 
              opportunities, and workflows all from one place.
            </p>
            <Button onClick={() => setIsConnecting(true)}>
              <Link className="mr-2 h-4 w-4" />
              Connect Location
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Main Tabs - Only show if there's a connection */}
      {currentConnection && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalContacts}</div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                    <span className="text-green-500 font-medium">{stats.newContacts}</span>
                    <span>new this week</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredAppointments.length}</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {stats.upcomingAppointments} upcoming
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTasks}</div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <div>{stats.completedTasks} completed</div>
                    <div>{stats.totalTasks - stats.completedTasks} open</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalOpportunitiesValue)}</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {stats.totalOpportunities} active ({stats.wonOpportunities} won)
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Pipeline Value */}
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Overview</CardTitle>
                <CardDescription>
                  Value of opportunities in each pipeline stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pipelines.length === 0 ? (
                  <div className="text-center py-8">
                    <Gauge className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No pipeline data available</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pipelines
                      .filter(p => 
                        !currentConnection || p.connectionId === currentConnection.id
                      )
                      .filter(p => p.active)
                      .map(pipeline => (
                        <div key={pipeline.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{pipeline.name}</h3>
                            <div className="text-sm">
                              {pipeline.opportunitiesCount} opportunities · {formatCurrency(pipeline.totalValue)}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            {pipeline.stages.map(stage => {
                              // Calculate opportunities and value in this stage
                              const stageOpportunities = filteredOpportunities.filter(
                                o => o.pipelineId === pipeline.id && o.stageId === stage.id
                              );
                              const stageValue = stageOpportunities.reduce((sum, o) => sum + o.value, 0);
                              const stageCount = stageOpportunities.length;
                              
                              return (
                                <div key={stage.id} className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <div>{stage.name}</div>
                                    <div>
                                      {stageCount} · {formatCurrency(stageValue)}
                                    </div>
                                  </div>
                                  <Progress 
                                    value={pipeline.totalValue > 0 ? (stageValue / pipeline.totalValue) * 100 : 0} 
                                    className="h-2" 
                                    style={{ backgroundColor: stage.color ? `${stage.color}20` : undefined }}
                                    indicatorClassName={stage.color ? `bg-[${stage.color}]` : undefined}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-6">
                      <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No tasks available</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTasks
                        .filter(task => task.status !== GHLTaskStatus.COMPLETED)
                        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                        .slice(0, 5)
                        .map(task => (
                          <div key={task.id} className="flex justify-between items-start border-b pb-3">
                            <div>
                              <div className="font-medium">{task.title}</div>
                              {task.description && (
                                <div className="text-sm text-muted-foreground mt-0.5">
                                  {task.description}
                                </div>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={getTaskStatusColor(task.status)}>
                                  {task.status.split('_').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                  ).join(' ')}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Due: {formatDate(task.dueDate)}
                                </span>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                if (onUpdateTaskStatus) {
                                  onUpdateTaskStatus(task.id, GHLTaskStatus.COMPLETED);
                                }
                              }}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-6">
                      <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No appointments scheduled</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredAppointments
                        .filter(appointment => 
                          new Date(appointment.startTime) > new Date() && 
                          appointment.status !== GHLAppointmentStatus.CANCELLED
                        )
                        .sort((a, b) => 
                          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
                        )
                        .slice(0, 5)
                        .map(appointment => (
                          <div key={appointment.id} className="border-b pb-3">
                            <div className="flex justify-between">
                              <div className="font-medium">{appointment.title}</div>
                              <Badge variant="outline" className={getAppointmentStatusColor(appointment.status)}>
                                {appointment.status.split('_').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </Badge>
                            </div>
                            <div className="text-sm mt-1">{appointment.contactName}</div>
                            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>
                                {formatDate(appointment.startTime)} · {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                              </span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {Object.values(GHLContactStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
              
              <Button onClick={() => setIsCreatingContact(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <Users className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No contacts found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContacts.map((contact) => (
                        <TableRow 
                          key={contact.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setSelectedContact(contact.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-muted/80 flex items-center justify-center text-sm font-medium">
                                {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                                <div className="flex flex-col text-xs text-muted-foreground">
                                  {contact.email && <span>{contact.email}</span>}
                                  {contact.phone && <span>{contact.phone}</span>}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getContactStatusColor(contact.status)}>
                              {contact.status.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {contact.source.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </TableCell>
                          <TableCell>{formatDate(contact.dateAdded)}</TableCell>
                          <TableCell>
                            {contact.value 
                              ? formatCurrency(contact.value)
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {contact.lastActivity 
                              ? contact.lastActivity
                              : 'No activity'}
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
                                  setSelectedContact(contact.id);
                                }}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  // Create task for this contact
                                  setIsCreatingTask(true);
                                }}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Add Task
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Schedule Appointment
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <Smartphone className="mr-2 h-4 w-4" />
                                  Send SMS
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={(e) => e.stopPropagation()} 
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
          
          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {Object.values(GHLTaskStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={() => setIsCreatingTask(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <CheckCircle className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No tasks found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTasks.map((task) => {
                        const isOverdue = task.status !== GHLTaskStatus.COMPLETED && 
                          new Date(task.dueDate) < new Date();
                        
                        return (
                          <TableRow 
                            key={task.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setSelectedTask(task.id)}
                          >
                            <TableCell>
                              <div className="font-medium">{task.title}</div>
                              {task.description && (
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {task.description}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getTaskStatusColor(task.status)}>
                                {task.status.split('_').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className={isOverdue ? "text-red-600 font-medium" : ""}>
                                {formatDate(task.dueDate)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                task.priority === 'high' ? 'destructive' :
                                task.priority === 'medium' ? 'default' :
                                'outline'
                              } className="capitalize">
                                {task.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {task.assignedToName || 'Unassigned'}
                            </TableCell>
                            <TableCell>
                              {task.contactId ? (
                                <div>
                                  {contacts.find(c => c.id === task.contactId)?.firstName || 'Contact'} {contacts.find(c => c.id === task.contactId)?.lastName || ''}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">None</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end">
                                {task.status !== GHLTaskStatus.COMPLETED && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onUpdateTaskStatus) {
                                        onUpdateTaskStatus(task.id, GHLTaskStatus.COMPLETED);
                                      }
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTask(task.id);
                                    }}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    {task.status !== GHLTaskStatus.COMPLETED ? (
                                      <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        if (onUpdateTaskStatus) {
                                          onUpdateTaskStatus(task.id, GHLTaskStatus.COMPLETED);
                                        }
                                      }}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Mark as Completed
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        if (onUpdateTaskStatus) {
                                          onUpdateTaskStatus(task.id, GHLTaskStatus.NOT_STARTED);
                                        }
                                      }}>
                                        <Ban className="mr-2 h-4 w-4" />
                                        Mark as Not Started
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={(e) => e.stopPropagation()} 
                                      className="text-red-600"
                                    >
                                      <Trash className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
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
          
          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {Object.values(GHLAppointmentStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select defaultValue="upcoming">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this_week">This Week</SelectItem>
                    <SelectItem value="this_month">This Month</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Appointment</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No appointments found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div className="font-medium">{appointment.title}</div>
                            {appointment.description && (
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {appointment.description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div>{formatDate(appointment.startTime)}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                            </div>
                          </TableCell>
                          <TableCell>{appointment.contactName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getAppointmentStatusColor(appointment.status)}>
                              {appointment.status.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {appointment.location || 'Not specified'}
                          </TableCell>
                          <TableCell>
                            {appointment.appointmentTypeName || 'Standard'}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {appointment.status === GHLAppointmentStatus.SCHEDULED && (
                                  <DropdownMenuItem>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Confirm
                                  </DropdownMenuItem>
                                )}
                                {(appointment.status === GHLAppointmentStatus.SCHEDULED || 
                                 appointment.status === GHLAppointmentStatus.CONFIRMED) && (
                                  <DropdownMenuItem>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Send Reminder
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
          
          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pipeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pipelines</SelectItem>
                    {pipelines
                      .filter(p => p.active)
                      .map((pipeline) => (
                        <SelectItem key={pipeline.id} value={pipeline.id}>
                          {pipeline.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Opportunity
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Opportunity</TableHead>
                      <TableHead>Pipeline / Stage</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Expected Close</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOpportunities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <TrendingUp className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No opportunities found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOpportunities.map((opportunity) => (
                        <TableRow 
                          key={opportunity.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setSelectedOpportunity(opportunity.id)}
                        >
                          <TableCell>
                            <div className="font-medium">{opportunity.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Created: {formatDate(opportunity.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>{opportunity.pipelineName}</div>
                            <div className="text-sm text-muted-foreground">
                              {opportunity.stageName}
                            </div>
                          </TableCell>
                          <TableCell>{opportunity.contactName}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(opportunity.value)}
                          </TableCell>
                          <TableCell>
                            {opportunity.expectedCloseDate 
                              ? formatDate(opportunity.expectedCloseDate)
                              : 'Not set'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              opportunity.status === 'won' ? 'default' :
                              opportunity.status === 'lost' ? 'destructive' :
                              'outline'
                            } className="capitalize">
                              {opportunity.status}
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
                                  setSelectedOpportunity(opportunity.id);
                                }}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {opportunity.status === 'active' && (
                                  <>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      if (onUpdateOpportunity) {
                                        onUpdateOpportunity(opportunity.id, { 
                                          status: 'won',
                                          wonDate: new Date()
                                        });
                                      }
                                    }}>
                                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                      Mark as Won
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      if (onUpdateOpportunity) {
                                        onUpdateOpportunity(opportunity.id, { 
                                          status: 'lost',
                                          lostDate: new Date()
                                        });
                                      }
                                    }}>
                                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                      Mark as Lost
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={(e) => e.stopPropagation()} 
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
          
          {/* Forms Tab */}
          <TabsContent value="forms" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Web Forms</h3>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Form
              </Button>
            </div>
            
            {forms.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium">No forms created yet</h3>
                  <p className="text-sm text-muted-foreground text-center mt-1 max-w-md">
                    Create forms to capture leads from your website and landing pages
                  </p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Form
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {forms
                  .filter(form => !currentConnection || form.connectionId === currentConnection.id)
                  .map((form) => (
                    <Card key={form.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{form.name}</CardTitle>
                          <Switch checked={form.active} />
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <div className="text-sm text-muted-foreground">Submissions</div>
                            <div className="font-medium">{form.submissionsCount}</div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Conversion Rate</span>
                              <span>{(form.conversionRate * 100).toFixed(1)}%</span>
                            </div>
                            <Progress 
                              value={form.conversionRate * 100} 
                              className="h-1" 
                            />
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground">Form URL</div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <code className="text-xs bg-muted rounded px-1 py-0.5 truncate">
                                {`https://marketplace.gohighlevel.com/form/${form.slug}`}
                              </code>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-3">
                        <div className="flex justify-between w-full">
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart2 className="mr-2 h-4 w-4" />
                            Analytics
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                }
              </div>
            )}
          </TabsContent>
          
          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Automation Workflows</h3>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Workflow
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workflow</TableHead>
                      <TableHead>Trigger</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Stats</TableHead>
                      <TableHead>Last Run</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkflows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <Timer className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No workflows found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredWorkflows.map((workflow) => (
                        <TableRow key={workflow.id}>
                          <TableCell>
                            <div className="font-medium">{workflow.name}</div>
                            {workflow.description && (
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {workflow.description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{workflow.trigger}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`h-2.5 w-2.5 rounded-full ${
                                workflow.active ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                              }`} />
                              <span>{workflow.active ? 'Active' : 'Inactive'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Started:</span>
                                <span>{workflow.stats.started}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Completed:</span>
                                <span>{workflow.stats.completed}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Failed:</span>
                                <span>{workflow.stats.failed}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {workflow.lastRun ? formatDateTime(workflow.lastRun) : 'Never run'}
                          </TableCell>
                          <TableCell>{formatDate(workflow.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Play className="mr-2 h-4 w-4" />
                                  Run Now
                                </DropdownMenuItem>
                                {workflow.active ? (
                                  <DropdownMenuItem>
                                    <Ban className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>
                                    <Play className="mr-2 h-4 w-4" />
                                    Activate
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
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
      )}
      
      {/* Connect Dialog */}
      <Dialog open={isConnecting} onOpenChange={setIsConnecting}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                <svg className="h-4 w-4 text-purple-700 dark:text-purple-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1L15.586 9.172L24 10.0887L18 16.4663L19.414 24L12 20.4L4.586 24L6 16.4663L0 10.0887L8.414 9.172L12 1Z" fill="currentColor"/>
                </svg>
              </div>
              Connect to Go High Level
            </DialogTitle>
            <DialogDescription>
              Connect your Go High Level account to integrate with your business
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="entity-select">Business Entity</Label>
              <Select
                value={newConnectionData.entityId?.toString()}
                onValueChange={(value) => setNewConnectionData({
                  ...newConnectionData,
                  entityId: parseInt(value)
                })}
              >
                <SelectTrigger id="entity-select">
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
            
            <div className="space-y-2">
              <Label htmlFor="location-id">Location ID</Label>
              <Input 
                id="location-id" 
                placeholder="1234567890"
                value={newConnectionData.locationId}
                onChange={(e) => setNewConnectionData({
                  ...newConnectionData,
                  locationId: e.target.value
                })}
              />
              <p className="text-xs text-muted-foreground">
                You can find your Location ID in your Go High Level dashboard
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input 
                id="api-key" 
                type="password"
                placeholder="Enter your API Key"
                value={newConnectionData.apiKey}
                onChange={(e) => setNewConnectionData({
                  ...newConnectionData,
                  apiKey: e.target.value
                })}
              />
              <p className="text-xs text-muted-foreground">
                You can generate an API Key in the Go High Level dashboard under Settings &gt; API Keys
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    How to find your credentials
                  </h4>
                  <ol className="mt-1 text-sm text-blue-700 dark:text-blue-400 list-decimal pl-5 space-y-1">
                    <li>Log in to your Go High Level dashboard</li>
                    <li>Go to Settings &gt; API Documentation</li>
                    <li>Generate an API Key with appropriate permissions</li>
                    <li>Copy your Location ID from the top of the page</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsConnecting(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConnect}
              disabled={isLoading || !newConnectionData.locationId || !newConnectionData.apiKey || !newConnectionData.entityId}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Link className="mr-2 h-4 w-4" />
                  Connect
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Contact Dialog */}
      {/* Would be implemented with a form for adding contacts */}
      
      {/* Create Task Dialog */}
      {/* Would be implemented with a form for adding tasks */}
      
      {/* View Contact Details Dialog */}
      {/* Would be implemented with contact details */}
      
      {/* View Task Details Dialog */}
      {/* Would be implemented with task details */}
      
      {/* View Opportunity Details Dialog */}
      {/* Would be implemented with opportunity details */}
    </div>
  );
};

export default GoHighLevelIntegration;