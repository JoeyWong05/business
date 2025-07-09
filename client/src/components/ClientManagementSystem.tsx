import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; 
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
  Archive,
  ArrowUpRight,
  BarChart2,
  Building,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  CreditCard,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Globe,
  History,
  LayoutGrid,
  List,
  Mail,
  Map,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Package,
  Pencil,
  Phone,
  PieChart,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Star,
  Tag,
  Trash,
  Truck,
  UserPlus,
  Users,
  Wallet
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Client Types for Different Business Models
export enum ClientType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
  GOVERNMENT = 'government',
  NONPROFIT = 'nonprofit'
}

export enum ClientSource {
  WEBSITE = 'website',
  REFERRAL = 'referral',
  SOCIAL_MEDIA = 'social_media',
  MARKETPLACE = 'marketplace',
  COLD_OUTREACH = 'cold_outreach',
  EVENT = 'event',
  PARTNER = 'partner',
  ADVERTISEMENT = 'advertisement',
  WALK_IN = 'walk_in'
}

export enum ClientStatus {
  LEAD = 'lead',
  PROSPECT = 'prospect',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CHURNED = 'churned',
  VIP = 'vip'
}

// Product-Based Business Specific
export enum PurchaseType {
  ONLINE = 'online',
  IN_STORE = 'in_store',
  WHOLESALE = 'wholesale',
  SUBSCRIPTION = 'subscription'
}

export enum ShippingPreference {
  STANDARD = 'standard',
  EXPRESS = 'express',
  OVERNIGHT = 'overnight',
  PICKUP = 'pickup'
}

// Service-Based Business Specific
export enum ServiceFrequency {
  ONE_TIME = 'one_time',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
  CUSTOM = 'custom'
}

export enum BillingType {
  FIXED = 'fixed',
  HOURLY = 'hourly',
  VALUE_BASED = 'value_based',
  RETAINER = 'retainer'
}

// Physical Business Specific
export enum VisitFrequency {
  FIRST_TIME = 'first_time',
  OCCASIONAL = 'occasional',
  REGULAR = 'regular',
  FREQUENT = 'frequent'
}

export enum LoyaltyStatus {
  NONE = 'none',
  BASIC = 'basic',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum'
}

// Common client interface with business-specific extensions
export interface Client {
  id: string;
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  type: ClientType;
  source: ClientSource;
  status: ClientStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  lastContactedAt?: Date | string;
  notes?: string;
  tags?: string[];
  entityId: number; // Business entity this client belongs to
  entityName: string;
  assignedTo?: number; // User ID of the team member responsible for this client
  assignedToName?: string;
  lifetime_value?: number;
  avatarUrl?: string;
  // Extended properties for specific business types
  serviceClient?: {
    serviceTypes?: string[];
    serviceFrequency?: ServiceFrequency;
    billingType?: BillingType;
    contractStartDate?: Date | string;
    contractEndDate?: Date | string;
    retainerAmount?: number;
    hourlyRate?: number;
    projectHistory?: {
      id: string;
      name: string;
      startDate: Date | string;
      endDate?: Date | string;
      status: string;
      value: number;
    }[];
  };
  productClient?: {
    preferredCategories?: string[];
    preferredProducts?: string[];
    purchaseTypes?: PurchaseType[];
    shippingPreference?: ShippingPreference;
    lastPurchaseDate?: Date | string;
    totalOrders?: number;
    averageOrderValue?: number;
    productRecommendations?: string[];
  };
  physicalClient?: {
    visitFrequency?: VisitFrequency;
    loyaltyStatus?: LoyaltyStatus;
    loyaltyPoints?: number;
    preferredLocation?: string;
    lastVisitDate?: Date | string;
    visitHistory?: {
      date: Date | string;
      location: string;
      purpose: string;
      spend: number;
    }[];
  };
}

export interface ClientNote {
  id: string;
  clientId: string;
  content: string;
  createdAt: Date | string;
  createdBy: string;
  isPrivate: boolean;
}

export interface ClientTask {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  dueDate: Date | string;
  completedAt?: Date | string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  assignedToName?: string;
  type: 'follow_up' | 'meeting' | 'proposal' | 'payment' | 'delivery' | 'other';
}

export interface ClientInteraction {
  id: string;
  clientId: string;
  type: 'email' | 'call' | 'meeting' | 'purchase' | 'support' | 'other';
  date: Date | string;
  description: string;
  outcome?: string;
  nextSteps?: string;
  recordedBy: string;
}

export interface ClientOrder {
  id: string;
  clientId: string;
  orderNumber: string;
  date: Date | string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    discount?: number;
  }[];
  shippingAddress?: string;
  trackingNumber?: string;
  paymentMethod: string;
  notes?: string;
}

export interface ClientAppointment {
  id: string;
  clientId: string;
  title: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  location?: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  serviceName?: string;
  serviceId?: string;
  staffName?: string;
  staffId?: string;
}

export interface ClientInvoice {
  id: string;
  clientId: string;
  invoiceNumber: string;
  date: Date | string;
  dueDate: Date | string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  amount: number;
  paidAmount?: number;
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  notes?: string;
  paymentTerms?: string;
}

interface ClientManagementSystemProps {
  entities: Array<{ id: number, name: string, type: 'service' | 'product' | 'physical' }>;
  clients?: Client[];
  notes?: ClientNote[];
  tasks?: ClientTask[];
  interactions?: ClientInteraction[];
  orders?: ClientOrder[];
  appointments?: ClientAppointment[];
  invoices?: ClientInvoice[];
  teamMembers?: Array<{ id: number, name: string, role: string, avatarUrl?: string }>;
  onAddClient?: (client: Omit<Client, 'id'>) => void;
  onUpdateClient?: (id: string, client: Partial<Client>) => void;
  onDeleteClient?: (id: string) => void;
  onAddNote?: (note: Omit<ClientNote, 'id'>) => void;
  onAddTask?: (task: Omit<ClientTask, 'id'>) => void;
  onAddInteraction?: (interaction: Omit<ClientInteraction, 'id'>) => void;
  onAddOrder?: (order: Omit<ClientOrder, 'id'>) => void;
  onAddAppointment?: (appointment: Omit<ClientAppointment, 'id'>) => void;
  onAddInvoice?: (invoice: Omit<ClientInvoice, 'id'>) => void;
}

const ClientManagementSystem: React.FC<ClientManagementSystemProps> = ({
  entities,
  clients = [],
  notes = [],
  tasks = [],
  interactions = [],
  orders = [],
  appointments = [],
  invoices = [],
  teamMembers = [],
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onAddNote,
  onAddTask,
  onAddInteraction,
  onAddOrder,
  onAddAppointment,
  onAddInvoice
}) => {
  const [selectedEntity, setSelectedEntity] = useState<number | 'all'>('all');
  const [selectedClientType, setSelectedClientType] = useState<'all' | 'service' | 'product' | 'physical'>('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [newClientData, setNewClientData] = useState<Partial<Client>>({});
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteData, setNewNoteData] = useState<Partial<ClientNote>>({});
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskData, setNewTaskData] = useState<Partial<ClientTask>>({});
  const [isViewingInteractions, setIsViewingInteractions] = useState(false);
  const [isAddingInteraction, setIsAddingInteraction] = useState(false);
  const [newInteractionData, setNewInteractionData] = useState<Partial<ClientInteraction>>({});
  const { toast } = useToast();
  
  // Filter clients based on selected entity, client type, search term, and status
  const filteredClients = clients.filter(client => {
    // Filter by entity
    if (selectedEntity !== 'all' && client.entityId !== selectedEntity) {
      return false;
    }
    
    // Filter by client type based on business model
    if (selectedClientType !== 'all') {
      if (selectedClientType === 'service' && !client.serviceClient) {
        return false;
      }
      if (selectedClientType === 'product' && !client.productClient) {
        return false;
      }
      if (selectedClientType === 'physical' && !client.physicalClient) {
        return false;
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        client.name.toLowerCase().includes(searchLower) ||
        (client.companyName && client.companyName.toLowerCase().includes(searchLower)) ||
        client.email.toLowerCase().includes(searchLower) ||
        (client.phone && client.phone.includes(searchTerm)) ||
        (client.tags && client.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all' && client.status !== statusFilter) {
      return false;
    }
    
    return true;
  });
  
  // Get the client details for the currently selected client
  const currentClient = selectedClient 
    ? clients.find(client => client.id === selectedClient) 
    : null;
  
  // Get client-specific data
  const clientNotes = currentClient 
    ? notes.filter(note => note.clientId === currentClient.id)
    : [];
  
  const clientTasks = currentClient 
    ? tasks.filter(task => task.clientId === currentClient.id)
    : [];
  
  const clientInteractions = currentClient 
    ? interactions.filter(interaction => interaction.clientId === currentClient.id)
    : [];
  
  const clientOrders = currentClient 
    ? orders.filter(order => order.clientId === currentClient.id)
    : [];
  
  const clientAppointments = currentClient 
    ? appointments.filter(appointment => appointment.clientId === currentClient.id)
    : [];
  
  const clientInvoices = currentClient 
    ? invoices.filter(invoice => invoice.clientId === currentClient.id)
    : [];
  
  // Get business-type specific metrics
  const getServiceMetrics = () => {
    const serviceClients = clients.filter(client => client.serviceClient);
    const totalRetainerValue = serviceClients.reduce((sum, client) => 
      sum + (client.serviceClient?.retainerAmount || 0), 0);
    
    const activeProjects = serviceClients.reduce((sum, client) => {
      const activeProjects = client.serviceClient?.projectHistory?.filter(
        p => !p.endDate || new Date(p.endDate) > new Date()
      ) || [];
      return sum + activeProjects.length;
    }, 0);
    
    return {
      totalClients: serviceClients.length,
      totalRetainerValue,
      activeProjects
    };
  };
  
  const getProductMetrics = () => {
    const productClients = clients.filter(client => client.productClient);
    const totalOrders = productClients.reduce((sum, client) => 
      sum + (client.productClient?.totalOrders || 0), 0);
    
    const avgOrderValue = productClients.length > 0
      ? productClients.reduce((sum, client) => 
        sum + (client.productClient?.averageOrderValue || 0), 0) / productClients.length
      : 0;
    
    return {
      totalClients: productClients.length,
      totalOrders,
      avgOrderValue
    };
  };
  
  const getPhysicalMetrics = () => {
    const physicalClients = clients.filter(client => client.physicalClient);
    const loyalMembers = physicalClients.filter(client => 
      client.physicalClient?.loyaltyStatus && 
      client.physicalClient.loyaltyStatus !== LoyaltyStatus.NONE
    ).length;
    
    const totalLoyaltyPoints = physicalClients.reduce((sum, client) => 
      sum + (client.physicalClient?.loyaltyPoints || 0), 0);
    
    return {
      totalClients: physicalClients.length,
      loyalMembers,
      totalLoyaltyPoints
    };
  };
  
  // Calculate overall client metrics
  const calculateClientMetrics = () => {
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === ClientStatus.ACTIVE).length;
    const newThisMonth = clients.filter(c => {
      const createdDate = new Date(c.createdAt);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && 
             createdDate.getFullYear() === now.getFullYear();
    }).length;
    
    const totalLifetimeValue = clients.reduce((sum, client) => sum + (client.lifetime_value || 0), 0);
    
    return {
      totalClients,
      activeClients,
      newThisMonth,
      totalLifetimeValue
    };
  };
  
  const clientMetrics = calculateClientMetrics();
  const serviceMetrics = getServiceMetrics();
  const productMetrics = getProductMetrics();
  const physicalMetrics = getPhysicalMetrics();
  
  // Handle add new client
  const handleAddClient = () => {
    if (!newClientData.name || !newClientData.email || !newClientData.type || 
        !newClientData.source || !newClientData.status || !newClientData.entityId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (onAddClient) {
      const newClient: Omit<Client, 'id'> = {
        ...newClientData as any,
        createdAt: new Date(),
        updatedAt: new Date(),
        entityName: entities.find(e => e.id === newClientData.entityId)?.name || '',
      };
      
      onAddClient(newClient);
      
      toast({
        title: "Client added",
        description: `${newClientData.name} has been added successfully.`,
      });
      
      setIsAddingClient(false);
      setNewClientData({});
    }
  };
  
  // Handle add new note
  const handleAddNote = () => {
    if (!currentClient || !newNoteData.content) {
      toast({
        title: "Missing information",
        description: "Please add some content to your note.",
        variant: "destructive",
      });
      return;
    }
    
    if (onAddNote) {
      const note: Omit<ClientNote, 'id'> = {
        clientId: currentClient.id,
        content: newNoteData.content || '',
        isPrivate: newNoteData.isPrivate || false,
        createdAt: new Date(),
        createdBy: 'Current User', // This would be the logged in user
      };
      
      onAddNote(note);
      
      toast({
        title: "Note added",
        description: "Your note has been added successfully.",
      });
      
      setIsAddingNote(false);
      setNewNoteData({});
    }
  };
  
  // Handle add new task
  const handleAddTask = () => {
    if (!currentClient || !newTaskData.title || !newTaskData.dueDate || 
        !newTaskData.priority || !newTaskData.type) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (onAddTask) {
      const task: Omit<ClientTask, 'id'> = {
        clientId: currentClient.id,
        title: newTaskData.title || '',
        description: newTaskData.description || '',
        dueDate: newTaskData.dueDate || new Date(),
        status: 'pending',
        priority: newTaskData.priority as any || 'medium',
        type: newTaskData.type as any || 'follow_up',
        assignedTo: newTaskData.assignedTo || 'Current User',
        assignedToName: teamMembers.find(m => m.id.toString() === newTaskData.assignedTo)?.name || 'Current User',
      };
      
      onAddTask(task);
      
      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
      });
      
      setIsAddingTask(false);
      setNewTaskData({});
    }
  };
  
  // Handle add new interaction
  const handleAddInteraction = () => {
    if (!currentClient || !newInteractionData.type || !newInteractionData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (onAddInteraction) {
      const interaction: Omit<ClientInteraction, 'id'> = {
        clientId: currentClient.id,
        type: newInteractionData.type as any,
        date: newInteractionData.date || new Date(),
        description: newInteractionData.description || '',
        outcome: newInteractionData.outcome || '',
        nextSteps: newInteractionData.nextSteps || '',
        recordedBy: 'Current User', // This would be the logged in user
      };
      
      onAddInteraction(interaction);
      
      toast({
        title: "Interaction recorded",
        description: "Your interaction has been recorded successfully.",
      });
      
      setIsAddingInteraction(false);
      setNewInteractionData({});
    }
  };
  
  // Get color for client status badge
  const getStatusColor = (status: ClientStatus) => {
    switch (status) {
      case ClientStatus.LEAD:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case ClientStatus.PROSPECT:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case ClientStatus.ACTIVE:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case ClientStatus.INACTIVE:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case ClientStatus.CHURNED:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case ClientStatus.VIP:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      default:
        return "";
    }
  };
  
  // Get color for client type badge
  const getClientTypeColor = (type: ClientType) => {
    switch (type) {
      case ClientType.INDIVIDUAL:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
      case ClientType.BUSINESS:
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      case ClientType.GOVERNMENT:
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300";
      case ClientType.NONPROFIT:
        return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
      default:
        return "";
    }
  };
  
  // Get short formatted date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  };
  
  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Client Management</h2>
          <p className="text-muted-foreground">
            Manage clients across all your business entities and types
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
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>{entity.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedClientType}
            onValueChange={(value) => setSelectedClientType(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Client type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="service">Service Clients</SelectItem>
              <SelectItem value="product">Product Clients</SelectItem>
              <SelectItem value="physical">Physical Location</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => setIsAddingClient(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>
      
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientMetrics.totalClients}</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">{clientMetrics.newThisMonth}</span>
              <span>new this month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Rate
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clientMetrics.totalClients > 0 
                ? `${Math.round((clientMetrics.activeClients / clientMetrics.totalClients) * 100)}%` 
                : '0%'}
            </div>
            <Progress 
              value={clientMetrics.totalClients > 0 
                ? (clientMetrics.activeClients / clientMetrics.totalClients) * 100 
                : 0} 
              className="h-1 mt-2" 
            />
            <div className="mt-1 text-xs text-muted-foreground">
              {clientMetrics.activeClients} active clients
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lifetime Value
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${clientMetrics.totalLifetimeValue.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              ${(clientMetrics.totalClients > 0 
                ? clientMetrics.totalLifetimeValue / clientMetrics.totalClients 
                : 0).toLocaleString()} avg. per client
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Business Type Breakdown
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground space-y-2">
              <div className="flex justify-between">
                <span>Service Clients:</span>
                <span className="font-medium">{serviceMetrics.totalClients}</span>
              </div>
              <div className="flex justify-between">
                <span>Product Clients:</span>
                <span className="font-medium">{productMetrics.totalClients}</span>
              </div>
              <div className="flex justify-between">
                <span>Location Clients:</span>
                <span className="font-medium">{physicalMetrics.totalClients}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {selectedClientType !== 'all' && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedClientType === 'service' ? 'Service Clients' : 
               selectedClientType === 'product' ? 'Product Clients' : 
               'Physical Location Clients'} Overview
            </CardTitle>
            <CardDescription>
              Specific metrics for {selectedClientType} business model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedClientType === 'service' && (
                <>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Retainer Value</h3>
                    <div className="text-2xl font-bold">${serviceMetrics.totalRetainerValue.toLocaleString()}/mo</div>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">Active Projects</h3>
                    <div className="text-2xl font-bold">{serviceMetrics.activeProjects}</div>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">Avg Contract Value</h3>
                    <div className="text-2xl font-bold">
                      ${serviceMetrics.totalClients > 0 
                        ? Math.round(clientMetrics.totalLifetimeValue / serviceMetrics.totalClients).toLocaleString() 
                        : 0}
                    </div>
                  </div>
                </>
              )}
              
              {selectedClientType === 'product' && (
                <>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
                    <div className="text-2xl font-bold">{productMetrics.totalOrders}</div>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">Avg Order Value</h3>
                    <div className="text-2xl font-bold">${productMetrics.avgOrderValue.toLocaleString()}</div>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">Repeat Purchase Rate</h3>
                    <div className="text-2xl font-bold">
                      {productMetrics.totalClients > 0 && productMetrics.totalOrders > 0
                        ? `${Math.round((productMetrics.totalOrders / productMetrics.totalClients) * 100)}%`
                        : '0%'}
                    </div>
                  </div>
                </>
              )}
              
              {selectedClientType === 'physical' && (
                <>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">Loyalty Members</h3>
                    <div className="text-2xl font-bold">{physicalMetrics.loyalMembers}</div>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">Loyalty Program</h3>
                    <div className="text-2xl font-bold">
                      {physicalMetrics.totalClients > 0
                        ? `${Math.round((physicalMetrics.loyalMembers / physicalMetrics.totalClients) * 100)}%`
                        : '0%'}
                    </div>
                    <div className="text-xs text-muted-foreground">Program Enrollment</div>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Loyalty Points</h3>
                    <div className="text-2xl font-bold">{physicalMetrics.totalLoyaltyPoints.toLocaleString()}</div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Client list and filtering */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select 
            value={statusFilter === 'all' ? 'all' : statusFilter}
            onValueChange={(value) => setStatusFilter(value === 'all' ? 'all' : value as ClientStatus)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(ClientStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select defaultValue="created_desc">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_desc">Newest First</SelectItem>
              <SelectItem value="created_asc">Oldest First</SelectItem>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              <SelectItem value="value_desc">Value (High-Low)</SelectItem>
              <SelectItem value="value_asc">Value (Low-High)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-secondary rounded-md flex items-center p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Client list view */}
      {viewMode === 'list' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <Users className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No clients found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow 
                      key={client.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedClient(client.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={client.avatarUrl} alt={client.name} />
                            <AvatarFallback>
                              {client.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{client.name}</div>
                            {client.companyName && (
                              <div className="text-xs text-muted-foreground">{client.companyName}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(client.status)}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getClientTypeColor(client.type)}>
                          {client.type.charAt(0).toUpperCase() + client.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{client.entityName}</TableCell>
                      <TableCell>
                        <div className="text-sm">{client.email}</div>
                        {client.phone && (
                          <div className="text-xs text-muted-foreground">{client.phone}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {typeof client.createdAt === 'string' 
                          ? formatDate(client.createdAt)
                          : formatDate(client.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClient(client.id);
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit
                            }}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              setNewTaskData({
                                ...newTaskData,
                                clientId: client.id
                              });
                              setIsAddingTask(true);
                            }}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              Add Task
                            </DropdownMenuItem>
                            {client.productClient && (
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                // Handle order creation
                              }}>
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                New Order
                              </DropdownMenuItem>
                            )}
                            {client.serviceClient && (
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                // Handle invoice creation
                              }}>
                                <FileText className="mr-2 h-4 w-4" />
                                New Invoice
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              if (onDeleteClient) {
                                onDeleteClient(client.id);
                              }
                            }} className="text-red-600">
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium">No clients found</h3>
                <p className="text-sm text-muted-foreground text-center mt-1 max-w-md">
                  Try adjusting your filters or add a new client to get started
                </p>
                <Button className="mt-4" onClick={() => setIsAddingClient(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Client
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredClients.map((client) => (
              <Card 
                key={client.id} 
                className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setSelectedClient(client.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={client.avatarUrl} alt={client.name} />
                        <AvatarFallback>
                          {client.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{client.name}</CardTitle>
                        {client.companyName && (
                          <CardDescription>{client.companyName}</CardDescription>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(client.status)}>
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Contact</div>
                        <div className="text-sm truncate">{client.email}</div>
                        {client.phone && <div className="text-sm">{client.phone}</div>}
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Customer Since</div>
                        <div className="text-sm">
                          {typeof client.createdAt === 'string' 
                            ? formatDate(client.createdAt)
                            : formatDate(client.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Business</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline" className={getClientTypeColor(client.type)}>
                          {client.type.charAt(0).toUpperCase() + client.type.slice(1)}
                        </Badge>
                        {client.serviceClient && (
                          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                            Service
                          </Badge>
                        )}
                        {client.productClient && (
                          <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                            Product
                          </Badge>
                        )}
                        {client.physicalClient && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                            Location
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {client.tags && client.tags.length > 0 && (
                      <div>
                        <div className="text-sm text-muted-foreground">Tags</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {client.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {client.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{client.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {client.lifetime_value !== undefined && (
                      <div>
                        <div className="text-sm text-muted-foreground">Lifetime Value</div>
                        <div className="text-base font-medium">${client.lifetime_value.toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-3">
                  <div className="text-sm text-muted-foreground">
                    {client.entityName}
                  </div>
                  <div className="flex items-center gap-1">
                    {client.lastContactedAt && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <History className="h-3 w-3" />
                        Last contact: {formatDate(client.lastContactedAt)}
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
      
      {/* Client Detail View */}
      {currentClient && (
        <Dialog open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={currentClient.avatarUrl} alt={currentClient.name} />
                  <AvatarFallback>
                    {currentClient.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-xl">{currentClient.name}</DialogTitle>
                  <DialogDescription>
                    {currentClient.companyName || 
                      `${currentClient.type.charAt(0).toUpperCase() + currentClient.type.slice(1)} client from ${currentClient.entityName}`}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="interactions">Interactions</TabsTrigger>
                {currentClient.serviceClient && (
                  <TabsTrigger value="services">Services</TabsTrigger>
                )}
                {currentClient.productClient && (
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                )}
                {currentClient.physicalClient && (
                  <TabsTrigger value="visits">Visits</TabsTrigger>
                )}
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{currentClient.email}</span>
                      </div>
                      {currentClient.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{currentClient.phone}</span>
                        </div>
                      )}
                      {currentClient.address && (
                        <div className="flex items-start gap-2">
                          <Map className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div>{currentClient.address}</div>
                            <div>
                              {currentClient.city && `${currentClient.city}, `}
                              {currentClient.state && `${currentClient.state} `}
                              {currentClient.zipCode && currentClient.zipCode}
                            </div>
                            {currentClient.country && <div>{currentClient.country}</div>}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Client Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="outline" className={getClientTypeColor(currentClient.type)}>
                          {currentClient.type.charAt(0).toUpperCase() + currentClient.type.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant="outline" className={getStatusColor(currentClient.status)}>
                          {currentClient.status.charAt(0).toUpperCase() + currentClient.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Source:</span>
                        <span>{currentClient.source.replaceAll('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{formatDate(currentClient.createdAt)}</span>
                      </div>
                      {currentClient.lastContactedAt && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Contact:</span>
                          <span>{formatDate(currentClient.lastContactedAt)}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Business Value</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Lifetime Value:</span>
                        <span className="font-bold">
                          ${(currentClient.lifetime_value || 0).toLocaleString()}
                        </span>
                      </div>
                      
                      {currentClient.serviceClient && (
                        <>
                          <Separator />
                          <div className="text-sm font-medium">Service Client</div>
                          {currentClient.serviceClient.billingType && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Billing Type:</span>
                              <span>{currentClient.serviceClient.billingType.replaceAll('_', ' ')}</span>
                            </div>
                          )}
                          {currentClient.serviceClient.retainerAmount && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Retainer:</span>
                              <span>${currentClient.serviceClient.retainerAmount.toLocaleString()}/mo</span>
                            </div>
                          )}
                          {currentClient.serviceClient.projectHistory && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Projects:</span>
                              <span>{currentClient.serviceClient.projectHistory.length}</span>
                            </div>
                          )}
                        </>
                      )}
                      
                      {currentClient.productClient && (
                        <>
                          <Separator />
                          <div className="text-sm font-medium">Product Client</div>
                          {currentClient.productClient.totalOrders !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Orders:</span>
                              <span>{currentClient.productClient.totalOrders}</span>
                            </div>
                          )}
                          {currentClient.productClient.averageOrderValue !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">AOV:</span>
                              <span>${currentClient.productClient.averageOrderValue.toLocaleString()}</span>
                            </div>
                          )}
                          {currentClient.productClient.lastPurchaseDate && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Last Purchase:</span>
                              <span>{formatDate(currentClient.productClient.lastPurchaseDate)}</span>
                            </div>
                          )}
                        </>
                      )}
                      
                      {currentClient.physicalClient && (
                        <>
                          <Separator />
                          <div className="text-sm font-medium">Location Client</div>
                          {currentClient.physicalClient.visitFrequency && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Visit Frequency:</span>
                              <span>{currentClient.physicalClient.visitFrequency.replaceAll('_', ' ')}</span>
                            </div>
                          )}
                          {currentClient.physicalClient.loyaltyStatus && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Loyalty Status:</span>
                              <span>{currentClient.physicalClient.loyaltyStatus}</span>
                            </div>
                          )}
                          {currentClient.physicalClient.loyaltyPoints !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Loyalty Points:</span>
                              <span>{currentClient.physicalClient.loyaltyPoints.toLocaleString()}</span>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Recent Interactions */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Recent Interactions</CardTitle>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8"
                            onClick={() => setIsViewingInteractions(true)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View All
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8"
                            onClick={() => {
                              setNewInteractionData({
                                clientId: currentClient.id,
                                date: new Date()
                              });
                              setIsAddingInteraction(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {clientInteractions.length === 0 ? (
                        <div className="text-center py-6">
                          <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">No interactions recorded</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => {
                              setNewInteractionData({
                                clientId: currentClient.id,
                                date: new Date()
                              });
                              setIsAddingInteraction(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Interaction
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {clientInteractions.slice(0, 5).map((interaction) => (
                            <div key={interaction.id} className="flex gap-3">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                {interaction.type === 'email' && <Mail className="h-4 w-4" />}
                                {interaction.type === 'call' && <Phone className="h-4 w-4" />}
                                {interaction.type === 'meeting' && <Users className="h-4 w-4" />}
                                {interaction.type === 'purchase' && <ShoppingBag className="h-4 w-4" />}
                                {interaction.type === 'support' && <MessageCircle className="h-4 w-4" />}
                                {interaction.type === 'other' && <MessageSquare className="h-4 w-4" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium capitalize">
                                    {interaction.type}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(interaction.date)}
                                  </span>
                                </div>
                                <p className="text-sm">{interaction.description}</p>
                                {interaction.outcome && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Outcome: {interaction.outcome}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Notes & Tasks */}
                  <div className="space-y-4">
                    {/* Notes */}
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Notes</CardTitle>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setNewNoteData({
                                clientId: currentClient.id
                              });
                              setIsAddingNote(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Note
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {clientNotes.length === 0 ? (
                          <div className="text-center py-4">
                            <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">No notes added yet</p>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2">
                            {clientNotes.map((note) => (
                              <div key={note.id} className="text-sm border rounded-md p-3">
                                <div className="flex justify-between items-start mb-1">
                                  <div className="font-medium">{note.createdBy}</div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(note.createdAt)}
                                    </span>
                                    {note.isPrivate && (
                                      <Badge variant="outline" className="text-xs">Private</Badge>
                                    )}
                                  </div>
                                </div>
                                <p>{note.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Tasks */}
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Tasks</CardTitle>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setNewTaskData({
                                clientId: currentClient.id,
                                dueDate: new Date()
                              });
                              setIsAddingTask(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Task
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {clientTasks.length === 0 ? (
                          <div className="text-center py-4">
                            <CalendarIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">No tasks scheduled</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {clientTasks.slice(0, 3).map((task) => (
                              <div 
                                key={task.id}
                                className={`flex items-start justify-between rounded-md border p-3 ${
                                  task.status === 'completed' ? 'bg-muted/50' : ''
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <Checkbox 
                                    checked={task.status === 'completed'}
                                    onCheckedChange={(checked) => {
                                      if (onUpdateClient) {
                                        // Would need to implement this handler
                                      }
                                    }}
                                  />
                                  <div>
                                    <div className={`font-medium ${
                                      task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                                    }`}>
                                      {task.title}
                                    </div>
                                    {task.description && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {task.description}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant={
                                        task.priority === 'high' ? 'destructive' :
                                        task.priority === 'medium' ? 'default' : 'outline'
                                      } className="text-xs">
                                        {task.priority}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        Due: {formatDate(task.dueDate)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            ))}
                            
                            {clientTasks.length > 3 && (
                              <Button variant="ghost" className="w-full text-sm" size="sm">
                                View all {clientTasks.length} tasks
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  
                  {currentClient.phone && (
                    <Button variant="outline">
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                  )}
                  
                  {currentClient.serviceClient && (
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Create Invoice
                    </Button>
                  )}
                  
                  {currentClient.productClient && (
                    <Button variant="outline">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      New Order
                    </Button>
                  )}
                  
                  {currentClient.physicalClient && (
                    <Button variant="outline">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Schedule Visit
                    </Button>
                  )}
                  
                  <Button variant="default">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Client
                  </Button>
                </div>
              </TabsContent>
              
              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4 mt-4">
                {/* Would be implemented with more detailed client information */}
              </TabsContent>
              
              {/* Interactions Tab */}
              <TabsContent value="interactions" className="space-y-4 mt-4">
                {/* Would be implemented with all client interactions */}
              </TabsContent>
              
              {/* Services Tab */}
              {currentClient.serviceClient && (
                <TabsContent value="services" className="space-y-4 mt-4">
                  {/* Would be implemented with service-specific client information */}
                </TabsContent>
              )}
              
              {/* Orders Tab */}
              {currentClient.productClient && (
                <TabsContent value="orders" className="space-y-4 mt-4">
                  {/* Would be implemented with order-specific client information */}
                </TabsContent>
              )}
              
              {/* Visits Tab */}
              {currentClient.physicalClient && (
                <TabsContent value="visits" className="space-y-4 mt-4">
                  {/* Would be implemented with visit-specific client information */}
                </TabsContent>
              )}
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add Client Dialog */}
      <Dialog open={isAddingClient} onOpenChange={setIsAddingClient}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Create a new client record in your system
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Client Name</Label>
                <Input 
                  id="name" 
                  placeholder="Full name"
                  value={newClientData.name || ''}
                  onChange={(e) => setNewClientData({
                    ...newClientData,
                    name: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company Name (Optional)</Label>
                <Input 
                  id="company" 
                  placeholder="Company name"
                  value={newClientData.companyName || ''}
                  onChange={(e) => setNewClientData({
                    ...newClientData,
                    companyName: e.target.value
                  })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Email address"
                  value={newClientData.email || ''}
                  onChange={(e) => setNewClientData({
                    ...newClientData,
                    email: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input 
                  id="phone" 
                  placeholder="Phone number"
                  value={newClientData.phone || ''}
                  onChange={(e) => setNewClientData({
                    ...newClientData,
                    phone: e.target.value
                  })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Client Type</Label>
                <Select
                  value={newClientData.type}
                  onValueChange={(value) => setNewClientData({
                    ...newClientData,
                    type: value as ClientType
                  })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClientType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source">Lead Source</Label>
                <Select
                  value={newClientData.source}
                  onValueChange={(value) => setNewClientData({
                    ...newClientData,
                    source: value as ClientSource
                  })}
                >
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClientSource).map((source) => (
                      <SelectItem key={source} value={source}>
                        {source.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newClientData.status}
                  onValueChange={(value) => setNewClientData({
                    ...newClientData,
                    status: value as ClientStatus
                  })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClientStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entity">Business Entity</Label>
              <Select
                value={newClientData.entityId?.toString()}
                onValueChange={(value) => setNewClientData({
                  ...newClientData,
                  entityId: parseInt(value),
                  entityName: entities.find(e => e.id === parseInt(value))?.name || ''
                })}
              >
                <SelectTrigger id="entity">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name} ({entity.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client-tags">Tags (Optional, comma separated)</Label>
              <Input 
                id="client-tags" 
                placeholder="e.g. vip, referral, new"
                value={newClientData.tags?.join(', ') || ''}
                onChange={(e) => setNewClientData({
                  ...newClientData,
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea 
                id="notes" 
                placeholder="Any additional information about this client"
                value={newClientData.notes || ''}
                onChange={(e) => setNewClientData({
                  ...newClientData,
                  notes: e.target.value
                })}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="font-medium">Business Type</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center">
                  <Checkbox 
                    id="service-client"
                    checked={!!newClientData.serviceClient}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewClientData({
                          ...newClientData,
                          serviceClient: {}
                        });
                      } else {
                        const { serviceClient, ...rest } = newClientData;
                        setNewClientData(rest);
                      }
                    }}
                  />
                  <Label htmlFor="service-client" className="ml-2">
                    Service Client
                  </Label>
                </div>
                
                <div className="flex items-center">
                  <Checkbox 
                    id="product-client"
                    checked={!!newClientData.productClient}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewClientData({
                          ...newClientData,
                          productClient: {}
                        });
                      } else {
                        const { productClient, ...rest } = newClientData;
                        setNewClientData(rest);
                      }
                    }}
                  />
                  <Label htmlFor="product-client" className="ml-2">
                    Product Client
                  </Label>
                </div>
                
                <div className="flex items-center">
                  <Checkbox 
                    id="physical-client"
                    checked={!!newClientData.physicalClient}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewClientData({
                          ...newClientData,
                          physicalClient: {}
                        });
                      } else {
                        const { physicalClient, ...rest } = newClientData;
                        setNewClientData(rest);
                      }
                    }}
                  />
                  <Label htmlFor="physical-client" className="ml-2">
                    Location Client
                  </Label>
                </div>
              </div>
            </div>
            
            {newClientData.serviceClient && (
              <div className="space-y-2 rounded-md border p-3">
                <Label className="font-medium">Service Client Details</Label>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="service-frequency">Service Frequency</Label>
                    <Select
                      value={newClientData.serviceClient.serviceFrequency}
                      onValueChange={(value) => setNewClientData({
                        ...newClientData,
                        serviceClient: {
                          ...newClientData.serviceClient,
                          serviceFrequency: value as ServiceFrequency
                        }
                      })}
                    >
                      <SelectTrigger id="service-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ServiceFrequency).map((frequency) => (
                          <SelectItem key={frequency} value={frequency}>
                            {frequency.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billing-type">Billing Type</Label>
                    <Select
                      value={newClientData.serviceClient.billingType}
                      onValueChange={(value) => setNewClientData({
                        ...newClientData,
                        serviceClient: {
                          ...newClientData.serviceClient,
                          billingType: value as BillingType
                        }
                      })}
                    >
                      <SelectTrigger id="billing-type">
                        <SelectValue placeholder="Select billing type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(BillingType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            
            {newClientData.productClient && (
              <div className="space-y-2 rounded-md border p-3">
                <Label className="font-medium">Product Client Details</Label>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="purchase-type">Purchase Type</Label>
                    <Select
                      value={newClientData.productClient.purchaseTypes?.[0]}
                      onValueChange={(value) => setNewClientData({
                        ...newClientData,
                        productClient: {
                          ...newClientData.productClient,
                          purchaseTypes: [value as PurchaseType]
                        }
                      })}
                    >
                      <SelectTrigger id="purchase-type">
                        <SelectValue placeholder="Select purchase type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PurchaseType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shipping-preference">Shipping Preference</Label>
                    <Select
                      value={newClientData.productClient.shippingPreference}
                      onValueChange={(value) => setNewClientData({
                        ...newClientData,
                        productClient: {
                          ...newClientData.productClient,
                          shippingPreference: value as ShippingPreference
                        }
                      })}
                    >
                      <SelectTrigger id="shipping-preference">
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ShippingPreference).map((preference) => (
                          <SelectItem key={preference} value={preference}>
                            {preference.charAt(0).toUpperCase() + preference.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            
            {newClientData.physicalClient && (
              <div className="space-y-2 rounded-md border p-3">
                <Label className="font-medium">Location Client Details</Label>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="visit-frequency">Visit Frequency</Label>
                    <Select
                      value={newClientData.physicalClient.visitFrequency}
                      onValueChange={(value) => setNewClientData({
                        ...newClientData,
                        physicalClient: {
                          ...newClientData.physicalClient,
                          visitFrequency: value as VisitFrequency
                        }
                      })}
                    >
                      <SelectTrigger id="visit-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(VisitFrequency).map((frequency) => (
                          <SelectItem key={frequency} value={frequency}>
                            {frequency.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loyalty-status">Loyalty Status</Label>
                    <Select
                      value={newClientData.physicalClient.loyaltyStatus}
                      onValueChange={(value) => setNewClientData({
                        ...newClientData,
                        physicalClient: {
                          ...newClientData.physicalClient,
                          loyaltyStatus: value as LoyaltyStatus
                        }
                      })}
                    >
                      <SelectTrigger id="loyalty-status">
                        <SelectValue placeholder="Select loyalty status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(LoyaltyStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingClient(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddClient}>
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Note Dialog */}
      <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add a note to {currentClient?.name}'s record
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note-content">Note</Label>
              <Textarea 
                id="note-content" 
                placeholder="Enter your note here..."
                rows={5}
                value={newNoteData.content || ''}
                onChange={(e) => setNewNoteData({
                  ...newNoteData,
                  content: e.target.value
                })}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is-private"
                checked={newNoteData.isPrivate || false}
                onCheckedChange={(checked) => setNewNoteData({
                  ...newNoteData,
                  isPrivate: !!checked
                })}
              />
              <Label htmlFor="is-private">
                Mark as private (only visible to you)
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingNote(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote}>
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Task Dialog */}
      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>
              Schedule a task for {currentClient?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input 
                id="task-title" 
                placeholder="What needs to be done?"
                value={newTaskData.title || ''}
                onChange={(e) => setNewTaskData({
                  ...newTaskData,
                  title: e.target.value
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-description">Description (Optional)</Label>
              <Textarea 
                id="task-description" 
                placeholder="Add details about this task..."
                rows={3}
                value={newTaskData.description || ''}
                onChange={(e) => setNewTaskData({
                  ...newTaskData,
                  description: e.target.value
                })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-type">Task Type</Label>
                <Select
                  value={newTaskData.type}
                  onValueChange={(value) => setNewTaskData({
                    ...newTaskData,
                    type: value
                  })}
                >
                  <SelectTrigger id="task-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={newTaskData.priority}
                  onValueChange={(value) => setNewTaskData({
                    ...newTaskData,
                    priority: value as any
                  })}
                >
                  <SelectTrigger id="task-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newTaskData.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {newTaskData.dueDate ? (
                      format(new Date(newTaskData.dueDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      newTaskData.dueDate ? 
                      new Date(newTaskData.dueDate) : 
                      undefined
                    }
                    onSelect={(date) => setNewTaskData({
                      ...newTaskData,
                      dueDate: date
                    })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-assignee">Assigned To</Label>
              <Select
                value={newTaskData.assignedTo}
                onValueChange={(value) => setNewTaskData({
                  ...newTaskData,
                  assignedTo: value,
                  assignedToName: teamMembers.find(m => m.id.toString() === value)?.name
                })}
              >
                <SelectTrigger id="task-assignee">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current_user">Myself</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingTask(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Interaction Dialog */}
      <Dialog open={isAddingInteraction} onOpenChange={setIsAddingInteraction}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Interaction</DialogTitle>
            <DialogDescription>
              Log an interaction with {currentClient?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="interaction-type">Interaction Type</Label>
              <Select
                value={newInteractionData.type}
                onValueChange={(value) => setNewInteractionData({
                  ...newInteractionData,
                  type: value as any
                })}
              >
                <SelectTrigger id="interaction-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="call">Phone Call</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newInteractionData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {newInteractionData.date ? (
                      format(new Date(newInteractionData.date), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      newInteractionData.date ? 
                      new Date(newInteractionData.date) : 
                      undefined
                    }
                    onSelect={(date) => setNewInteractionData({
                      ...newInteractionData,
                      date
                    })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interaction-description">Description</Label>
              <Textarea 
                id="interaction-description" 
                placeholder="Describe the interaction..."
                rows={3}
                value={newInteractionData.description || ''}
                onChange={(e) => setNewInteractionData({
                  ...newInteractionData,
                  description: e.target.value
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interaction-outcome">Outcome (Optional)</Label>
              <Textarea 
                id="interaction-outcome" 
                placeholder="What was the result of this interaction?"
                rows={2}
                value={newInteractionData.outcome || ''}
                onChange={(e) => setNewInteractionData({
                  ...newInteractionData,
                  outcome: e.target.value
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interaction-next-steps">Next Steps (Optional)</Label>
              <Textarea 
                id="interaction-next-steps" 
                placeholder="What actions need to follow this interaction?"
                rows={2}
                value={newInteractionData.nextSteps || ''}
                onChange={(e) => setNewInteractionData({
                  ...newInteractionData,
                  nextSteps: e.target.value
                })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingInteraction(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddInteraction}>
              Record Interaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Interactions Dialog */}
      <Dialog open={isViewingInteractions} onOpenChange={setIsViewingInteractions}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Interaction History</DialogTitle>
            <DialogDescription>
              All recorded interactions with {currentClient?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <ScrollArea className="h-[400px] pr-4">
              {clientInteractions.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium">No interactions recorded</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start recording interactions with this client
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => {
                      setIsViewingInteractions(false);
                      setNewInteractionData({
                        clientId: currentClient?.id,
                        date: new Date()
                      });
                      setIsAddingInteraction(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Record Interaction
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {clientInteractions.map((interaction) => (
                    <div key={interaction.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            {interaction.type === 'email' && <Mail className="h-5 w-5" />}
                            {interaction.type === 'call' && <Phone className="h-5 w-5" />}
                            {interaction.type === 'meeting' && <Users className="h-5 w-5" />}
                            {interaction.type === 'purchase' && <ShoppingBag className="h-5 w-5" />}
                            {interaction.type === 'support' && <MessageCircle className="h-5 w-5" />}
                            {interaction.type === 'other' && <MessageSquare className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium capitalize">
                                {interaction.type}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(interaction.date)}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{interaction.description}</p>
                            
                            {(interaction.outcome || interaction.nextSteps) && (
                              <div className="grid grid-cols-2 gap-4 mt-3">
                                {interaction.outcome && (
                                  <div>
                                    <h4 className="text-xs font-medium text-muted-foreground">
                                      Outcome
                                    </h4>
                                    <p className="text-sm">{interaction.outcome}</p>
                                  </div>
                                )}
                                
                                {interaction.nextSteps && (
                                  <div>
                                    <h4 className="text-xs font-medium text-muted-foreground">
                                      Next Steps
                                    </h4>
                                    <p className="text-sm">{interaction.nextSteps}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
          
          <DialogFooter>
            {clientInteractions.length > 0 && (
              <Button 
                variant="outline" 
                className="mr-auto"
                onClick={() => {
                  setIsViewingInteractions(false);
                  setNewInteractionData({
                    clientId: currentClient?.id,
                    date: new Date()
                  });
                  setIsAddingInteraction(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Interaction
              </Button>
            )}
            <Button onClick={() => setIsViewingInteractions(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientManagementSystem;