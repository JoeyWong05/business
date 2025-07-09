import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  Filter,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Tag,
  Mail,
  Building,
  User,
  Users,
  DollarSign,
  Calendar,
  Star,
  StarHalf,
  ExternalLink,
  Pencil,
  Trash2,
  AlertCircle,
  HelpCircle,
  Activity,
  Clock,
  Info,
  Edit,
  Save,
  X,
  FileText
} from 'lucide-react';

// Define customer types and statuses
type CustomerStatus = 'active' | 'inactive' | 'at-risk' | 'vip' | 'new';
type CustomerSegment = 'retail' | 'wholesale' | 'enterprise' | 'small-business' | 'other';
type CustomerSource = 'website' | 'referral' | 'advertising' | 'social-media' | 'other';

interface CustomerNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  isImportant: boolean;
}

interface CustomerInteraction {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'support' | 'other';
  description: string;
  date: string;
  outcome?: string;
  nextAction?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: CustomerStatus;
  segment: CustomerSegment;
  source: CustomerSource;
  tags: string[];
  createdAt: string;
  lastContactDate?: string;
  lifetimeValue: number;
  totalOrders: number;
  entityId: number;
  entityName: string;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  notes?: CustomerNote[];
  interactions?: CustomerInteraction[];
}

// Demo data for customers
const demoCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smithson',
    email: 'john.smithson@example.com',
    phone: '+1 (555) 123-4567',
    company: 'TechBiz Solutions',
    status: 'active',
    segment: 'enterprise',
    source: 'website',
    tags: ['tech', 'high-value', 'enterprise'],
    createdAt: '2023-04-15T10:30:00Z',
    lastContactDate: '2023-11-20T15:20:00Z',
    lifetimeValue: 15200.50,
    totalOrders: 8,
    entityId: 1,
    entityName: 'Digital Merch Pros',
    avatar: 'https://ui-avatars.com/api/?name=John+Smithson&background=random',
    address: {
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    },
    notes: [
      {
        id: 'n1',
        content: 'John expressed interest in our enterprise package.',
        createdAt: '2023-10-15T14:30:00Z',
        createdBy: 'Alex Johnson',
        isImportant: true
      },
      {
        id: 'n2',
        content: 'Follow up about the new product launch.',
        createdAt: '2023-11-10T09:45:00Z',
        createdBy: 'Maria Garcia',
        isImportant: false
      }
    ],
    interactions: [
      {
        id: 'i1',
        type: 'call',
        description: 'Quarterly review call',
        date: '2023-11-20T15:20:00Z',
        outcome: 'Positive - interested in expanding services',
        nextAction: 'Send proposal for enterprise package'
      },
      {
        id: 'i2',
        type: 'email',
        description: 'Sent product updates',
        date: '2023-10-05T11:15:00Z',
        outcome: 'Acknowledged receipt',
        nextAction: 'Follow up in two weeks'
      }
    ]
  },
  {
    id: '2',
    name: 'Lisa Johnson',
    email: 'lisa.johnson@example.com',
    phone: '+1 (555) 987-6543',
    company: 'Marketing Innovators',
    status: 'vip',
    segment: 'enterprise',
    source: 'referral',
    tags: ['marketing', 'vip', 'referral-program'],
    createdAt: '2022-08-20T09:15:00Z',
    lastContactDate: '2023-11-18T13:40:00Z',
    lifetimeValue: 28750.75,
    totalOrders: 12,
    entityId: 1,
    entityName: 'Digital Merch Pros',
    avatar: 'https://ui-avatars.com/api/?name=Lisa+Johnson&background=random',
    address: {
      street: '456 Market Avenue',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    notes: [
      {
        id: 'n3',
        content: 'VIP client - provide priority support',
        createdAt: '2022-09-10T10:20:00Z',
        createdBy: 'Sales Team',
        isImportant: true
      }
    ],
    interactions: [
      {
        id: 'i3',
        type: 'meeting',
        description: 'In-person strategy session',
        date: '2023-11-18T13:40:00Z',
        outcome: 'Very positive - increasing budget next quarter',
        nextAction: 'Prepare expanded services proposal'
      }
    ]
  },
  {
    id: '3',
    name: 'Robert Chen',
    email: 'robert.chen@example.com',
    phone: '+1 (555) 234-5678',
    company: 'Chen & Associates',
    status: 'at-risk',
    segment: 'small-business',
    source: 'advertising',
    tags: ['legal', 'at-risk', 'needs-attention'],
    createdAt: '2023-02-10T11:45:00Z',
    lastContactDate: '2023-09-05T16:30:00Z',
    lifetimeValue: 4850.00,
    totalOrders: 3,
    entityId: 2,
    entityName: 'Mystery Hype',
    avatar: 'https://ui-avatars.com/api/?name=Robert+Chen&background=random',
    interactions: [
      {
        id: 'i4',
        type: 'support',
        description: 'Complained about service delays',
        date: '2023-09-05T16:30:00Z',
        outcome: 'Partially resolved - still unsatisfied',
        nextAction: 'Schedule call with account manager'
      }
    ]
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '+1 (555) 876-5432',
    status: 'active',
    segment: 'retail',
    source: 'social-media',
    tags: ['retail', 'new-product-interest'],
    createdAt: '2023-06-25T14:20:00Z',
    lastContactDate: '2023-11-12T10:15:00Z',
    lifetimeValue: 1250.25,
    totalOrders: 5,
    entityId: 3,
    entityName: 'Lone Star Custom Clothing',
    avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=random'
  },
  {
    id: '5',
    name: 'Michael Wong',
    email: 'michael.wong@example.com',
    phone: '+1 (555) 345-6789',
    company: 'Wong Enterprises',
    status: 'inactive',
    segment: 'wholesale',
    source: 'referral',
    tags: ['wholesale', 'inactive', 'follow-up'],
    createdAt: '2022-11-30T16:50:00Z',
    lastContactDate: '2023-05-18T09:30:00Z',
    lifetimeValue: 9600.00,
    totalOrders: 2,
    entityId: 1,
    entityName: 'Digital Merch Pros',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Wong&background=random'
  },
  {
    id: '6',
    name: 'Sarah Martinez',
    email: 'sarah.martinez@example.com',
    phone: '+1 (555) 456-7890',
    company: 'Creative Designs Co.',
    status: 'active',
    segment: 'small-business',
    source: 'website',
    tags: ['design', 'repeat-customer'],
    createdAt: '2023-03-15T13:25:00Z',
    lastContactDate: '2023-11-01T11:45:00Z',
    lifetimeValue: 5700.50,
    totalOrders: 7,
    entityId: 2,
    entityName: 'Mystery Hype',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Martinez&background=random'
  },
  {
    id: '7',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    phone: '+1 (555) 567-8901',
    status: 'new',
    segment: 'retail',
    source: 'social-media',
    tags: ['new-customer', 'social-media-conversion'],
    createdAt: '2023-11-10T10:10:00Z',
    lifetimeValue: 150.00,
    totalOrders: 1,
    entityId: 3,
    entityName: 'Lone Star Custom Clothing',
    avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=random'
  },
  {
    id: '8',
    name: 'Olivia Kim',
    email: 'olivia.kim@example.com',
    phone: '+1 (555) 678-9012',
    company: 'Kim Fashion House',
    status: 'vip',
    segment: 'wholesale',
    source: 'referral',
    tags: ['fashion', 'vip', 'high-value'],
    createdAt: '2022-07-05T09:30:00Z',
    lastContactDate: '2023-11-15T14:20:00Z',
    lifetimeValue: 42300.75,
    totalOrders: 15,
    entityId: 3,
    entityName: 'Lone Star Custom Clothing',
    avatar: 'https://ui-avatars.com/api/?name=Olivia+Kim&background=random'
  },
  {
    id: '9',
    name: 'Daniel Brown',
    email: 'daniel.brown@example.com',
    phone: '+1 (555) 789-0123',
    company: 'Brown Media Group',
    status: 'active',
    segment: 'small-business',
    source: 'advertising',
    tags: ['media', 'growing-account'],
    createdAt: '2023-01-20T15:45:00Z',
    lastContactDate: '2023-10-25T11:30:00Z',
    lifetimeValue: 8150.25,
    totalOrders: 6,
    entityId: 1,
    entityName: 'Digital Merch Pros',
    avatar: 'https://ui-avatars.com/api/?name=Daniel+Brown&background=random'
  },
  {
    id: '10',
    name: 'Emma Thompson',
    email: 'emma.thompson@example.com',
    phone: '+1 (555) 890-1234',
    status: 'at-risk',
    segment: 'retail',
    source: 'website',
    tags: ['retail', 'at-risk', 'service-issue'],
    createdAt: '2022-09-12T11:20:00Z',
    lastContactDate: '2023-08-05T09:15:00Z',
    lifetimeValue: 3200.50,
    totalOrders: 4,
    entityId: 2,
    entityName: 'Mystery Hype',
    avatar: 'https://ui-avatars.com/api/?name=Emma+Thompson&background=random'
  }
];

// Demo data for entities
const demoEntities = [
  { id: 1, name: "Digital Merch Pros" },
  { id: 2, name: "Mystery Hype" },
  { id: 3, name: "Lone Star Custom Clothing" },
  { id: 4, name: "Alcoeaze" },
  { id: 5, name: "Hide Cafe Bars" }
];

// Demo data for segments
const demoSegments = [
  { id: 'vip', name: 'VIP Customers', customerCount: 2, avgLtv: 35525.75, color: '#8B5CF6' },
  { id: 'at-risk', name: 'At Risk', customerCount: 2, avgLtv: 4025.25, color: '#EF4444' },
  { id: 'new', name: 'New Customers', customerCount: 1, avgLtv: 150.00, color: '#3B82F6' },
  { id: 'active', name: 'Active', customerCount: 4, avgLtv: 7675.31, color: '#10B981' },
  { id: 'inactive', name: 'Inactive', customerCount: 1, avgLtv: 9600.00, color: '#9CA3AF' }
];

// Component for customer avatar with fallback
const CustomerAvatar = ({ customer }: { customer: Customer }) => {
  const initials = customer.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const getStatusColor = (status: CustomerStatus) => {
    switch(status) {
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'at-risk': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-10 w-10">
        <AvatarImage src={customer.avatar} alt={customer.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${getStatusColor(customer.status)}`} />
    </div>
  );
};

// Component for status badge
const StatusBadge = ({ status }: { status: CustomerStatus }) => {
  const getStatusProps = (status: CustomerStatus) => {
    switch(status) {
      case 'vip':
        return { className: 'bg-purple-100 text-purple-800 hover:bg-purple-100', label: 'VIP' };
      case 'at-risk':
        return { className: 'bg-red-100 text-red-800 hover:bg-red-100', label: 'At Risk' };
      case 'active':
        return { className: 'bg-green-100 text-green-800 hover:bg-green-100', label: 'Active' };
      case 'inactive':
        return { className: 'bg-gray-100 text-gray-800 hover:bg-gray-100', label: 'Inactive' };
      case 'new':
        return { className: 'bg-blue-100 text-blue-800 hover:bg-blue-100', label: 'New' };
      default:
        return { className: '', label: status };
    }
  };

  const { className, label } = getStatusProps(status);
  return <Badge className={className}>{label}</Badge>;
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date
const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Get time ago
const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 30) {
    return formatDate(dateString);
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMins > 0) {
    return `${diffInMins} minute${diffInMins > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

// Main CRM component
const EnhancedCRM = () => {
  const { demoMode } = useDemoMode();
  const { toast } = useToast();
  
  // State for tabs and filters
  const [activeTab, setActiveTab] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // State for customer creation/editing
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'new',
    segment: 'retail',
    source: 'website',
    tags: [],
    entityId: 1,
    lifetimeValue: 0,
    totalOrders: 0
  });
  
  // State for tag input
  const [tagInput, setTagInput] = useState('');
  
  // State for customer notes
  const [newNote, setNewNote] = useState('');
  const [isImportantNote, setIsImportantNote] = useState(false);
  
  // State for customer data
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  // Query data from API (or use demo data)
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['/api/customers', entityFilter, statusFilter],
    queryFn: async () => {
      if (demoMode) {
        return { customers: demoCustomers };
      }
      const response = await apiRequest('GET', `/api/customers?entityId=${entityFilter}&status=${statusFilter}`);
      return await response.json();
    }
  });
  
  const { data: entitiesData, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['/api/business-entities'],
    queryFn: async () => {
      if (demoMode) {
        return { entities: demoEntities };
      }
      const response = await apiRequest('GET', '/api/business-entities');
      return await response.json();
    }
  });
  
  // Mutations for CRUD operations
  const createCustomerMutation = useMutation({
    mutationFn: async (customer: Partial<Customer>) => {
      if (demoMode) {
        // For demo mode, just generate a fake ID and return the customer
        return {
          ...customer,
          id: `demo-${Date.now()}`,
          createdAt: new Date().toISOString()
        };
      }
      const response = await apiRequest('POST', '/api/customers', customer);
      return await response.json();
    },
    onSuccess: (newCustomer) => {
      // Add new customer to the list
      setCustomers([...customers, newCustomer as Customer]);
      setIsAddingCustomer(false);
      toast({
        title: "Customer Created",
        description: `${newCustomer.name} has been added to your CRM.`
      });
      // Reset form
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'new',
        segment: 'retail',
        source: 'website',
        tags: [],
        entityId: 1,
        lifetimeValue: 0,
        totalOrders: 0
      });
      // Refresh customer list
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create customer. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const updateCustomerMutation = useMutation({
    mutationFn: async (customer: Customer) => {
      if (demoMode) {
        return customer;
      }
      const response = await apiRequest('PUT', `/api/customers/${customer.id}`, customer);
      return await response.json();
    },
    onSuccess: (updatedCustomer) => {
      // Update customer in the list
      setCustomers(customers.map(c => 
        c.id === updatedCustomer.id ? updatedCustomer : c
      ));
      setIsEditingCustomer(false);
      toast({
        title: "Customer Updated",
        description: `${updatedCustomer.name}'s information has been updated.`
      });
      // Refresh selected customer
      if (selectedCustomer?.id === updatedCustomer.id) {
        setSelectedCustomer(updatedCustomer);
      }
      // Refresh customer list
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update customer. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerId: string) => {
      if (demoMode) {
        return { id: customerId };
      }
      await apiRequest('DELETE', `/api/customers/${customerId}`);
      return { id: customerId };
    },
    onSuccess: (data) => {
      // Remove customer from the list
      setCustomers(customers.filter(c => c.id !== data.id));
      if (selectedCustomer?.id === data.id) {
        setSelectedCustomer(null);
      }
      toast({
        title: "Customer Deleted",
        description: "The customer has been removed from your CRM."
      });
      // Refresh customer list
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete customer. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const addCustomerNoteMutation = useMutation({
    mutationFn: async ({ customerId, note }: { customerId: string, note: Partial<CustomerNote> }) => {
      if (demoMode) {
        return {
          ...note,
          id: `note-${Date.now()}`,
          createdAt: new Date().toISOString(),
          createdBy: 'Demo User'
        };
      }
      const response = await apiRequest('POST', `/api/customers/${customerId}/notes`, note);
      return await response.json();
    },
    onSuccess: (newNote, { customerId }) => {
      // Add note to the customer
      if (selectedCustomer && selectedCustomer.id === customerId) {
        const updatedCustomer = {
          ...selectedCustomer,
          notes: [...(selectedCustomer.notes || []), newNote as CustomerNote]
        };
        setSelectedCustomer(updatedCustomer);
        
        // Also update in the customers list
        setCustomers(customers.map(c => 
          c.id === customerId ? updatedCustomer : c
        ));
      }
      
      setNewNote('');
      setIsImportantNote(false);
      toast({
        title: "Note Added",
        description: "Your note has been added to the customer record."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Update state when data changes
  useEffect(() => {
    if (customersData?.customers) {
      setCustomers(customersData.customers);
    }
  }, [customersData]);
  
  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    // Filter by search term
    const searchMatch = searchTerm === '' || 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      customer.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status
    const statusMatch = statusFilter === 'all' || customer.status === statusFilter;
    
    // Filter by entity
    const entityMatch = entityFilter === 'all' || customer.entityId.toString() === entityFilter;
    
    // Filter by segment
    const segmentMatch = segmentFilter === 'all' || customer.segment === segmentFilter;
    
    return searchMatch && statusMatch && entityMatch && segmentMatch;
  });
  
  // Handle form submission for new customer
  const handleCreateCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a name and email for the customer.",
        variant: "destructive"
      });
      return;
    }
    
    createCustomerMutation.mutate(newCustomer as Customer);
  };
  
  // Handle form submission for editing customer
  const handleUpdateCustomer = () => {
    if (!selectedCustomer) return;
    
    updateCustomerMutation.mutate(selectedCustomer);
  };
  
  // Handle adding a note to a customer
  const handleAddNote = () => {
    if (!selectedCustomer || !newNote) return;
    
    addCustomerNoteMutation.mutate({
      customerId: selectedCustomer.id,
      note: {
        content: newNote,
        isImportant: isImportantNote
      }
    });
  };
  
  // Handle adding a tag
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    if (isEditingCustomer && selectedCustomer) {
      const updatedTags = [...(selectedCustomer.tags || [])];
      if (!updatedTags.includes(tagInput.trim())) {
        updatedTags.push(tagInput.trim());
        setSelectedCustomer({
          ...selectedCustomer,
          tags: updatedTags
        });
      }
    } else if (isAddingCustomer) {
      const updatedTags = [...(newCustomer.tags || [])];
      if (!updatedTags.includes(tagInput.trim())) {
        updatedTags.push(tagInput.trim());
        setNewCustomer({
          ...newCustomer,
          tags: updatedTags
        });
      }
    }
    
    setTagInput('');
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tag: string) => {
    if (isEditingCustomer && selectedCustomer) {
      setSelectedCustomer({
        ...selectedCustomer,
        tags: selectedCustomer.tags.filter(t => t !== tag)
      });
    } else if (isAddingCustomer) {
      setNewCustomer({
        ...newCustomer,
        tags: (newCustomer.tags || []).filter(t => t !== tag)
      });
    }
  };
  
  // Compute statistics
  const totalCustomers = customers.length;
  const totalLifetimeValue = customers.reduce((sum, customer) => sum + customer.lifetimeValue, 0);
  const totalVipCustomers = customers.filter(c => c.status === 'vip').length;
  const totalAtRiskCustomers = customers.filter(c => c.status === 'at-risk').length;
  
  // Get entities
  const entities = entitiesData?.entities || demoEntities;
  
  return (
    <MainLayout>
      <div className="container py-6 space-y-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customer Relationship Management</h1>
            <p className="text-muted-foreground">
              Manage your customer database, track interactions, and analyze customer data
            </p>
          </div>
          
          <Button onClick={() => setIsAddingCustomer(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <div className="text-2xl font-bold">{totalCustomers}</div>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Lifetime Value</p>
                  <div className="text-2xl font-bold">{formatCurrency(totalLifetimeValue)}</div>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">VIP Customers</p>
                  <div className="text-2xl font-bold">{totalVipCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalCustomers > 0 ? Math.round((totalVipCustomers / totalCustomers) * 100) : 0}% of total
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">At Risk</p>
                  <div className="text-2xl font-bold">{totalAtRiskCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalCustomers > 0 ? Math.round((totalAtRiskCustomers / totalCustomers) * 100) : 0}% of total
                  </p>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="segments">Segments</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {entities.map((entity: {id: number, name: string}) => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="customers" className="space-y-4 mt-6">
            {isLoadingCustomers ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg">
                <Users className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No customers found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' || entityFilter !== 'all' || segmentFilter !== 'all'
                    ? "Try adjusting your search or filters"
                    : "Add your first customer to get started"}
                </p>
                <Button onClick={() => setIsAddingCustomer(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Customer
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <Card className="overflow-hidden">
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-lg">Customer List</CardTitle>
                      <CardDescription>
                        {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="max-h-[600px] overflow-y-auto">
                        {filteredCustomers.map((customer) => (
                          <div
                            key={customer.id}
                            className={`flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer border-t ${selectedCustomer?.id === customer.id ? 'bg-muted' : ''}`}
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <CustomerAvatar customer={customer} />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{customer.name}</div>
                              <div className="text-sm text-muted-foreground truncate">
                                {customer.company || customer.email}
                              </div>
                            </div>
                            <StatusBadge status={customer.status} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  {selectedCustomer ? (
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <CustomerAvatar customer={selectedCustomer} />
                              <div>
                                <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                                <p className="text-muted-foreground">
                                  {selectedCustomer.company && `${selectedCustomer.company} • `}
                                  {selectedCustomer.entityName}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setIsEditingCustomer(true);
                                }}
                              >
                                <Pencil className="h-4 w-4 mr-2" /> Edit
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => {}}>
                                    <Phone className="h-4 w-4 mr-2" /> Log Call
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {}}>
                                    <Mail className="h-4 w-4 mr-2" /> Send Email
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {}}>
                                    <Calendar className="h-4 w-4 mr-2" /> Schedule Meeting
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete ${selectedCustomer.name}?`)) {
                                        deleteCustomerMutation.mutate(selectedCustomer.id);
                                      }
                                    }}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete Customer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <a href={`mailto:${selectedCustomer.email}`} className="text-sm hover:underline">
                                    {selectedCustomer.email}
                                  </a>
                                </div>
                                {selectedCustomer.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <a href={`tel:${selectedCustomer.phone}`} className="text-sm hover:underline">
                                      {selectedCustomer.phone}
                                    </a>
                                  </div>
                                )}
                                {selectedCustomer.company && (
                                  <div className="flex items-center gap-2">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{selectedCustomer.company}</span>
                                  </div>
                                )}
                                {selectedCustomer.address && (
                                  <div className="flex items-start gap-2">
                                    <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div className="text-sm">
                                      {selectedCustomer.address.street && <div>{selectedCustomer.address.street}</div>}
                                      {selectedCustomer.address.city && selectedCustomer.address.state && (
                                        <div>
                                          {selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.zip}
                                        </div>
                                      )}
                                      {selectedCustomer.address.country && <div>{selectedCustomer.address.country}</div>}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Customer Details</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Status:</span>
                                  <StatusBadge status={selectedCustomer.status} />
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Segment:</span>
                                  <span className="text-sm capitalize">{selectedCustomer.segment.replace('-', ' ')}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Customer Since:</span>
                                  <span className="text-sm">{formatDate(selectedCustomer.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Last Contact:</span>
                                  <span className="text-sm">{selectedCustomer.lastContactDate ? formatDate(selectedCustomer.lastContactDate) : 'Never'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Lifetime Value:</span>
                                  <span className="text-sm font-medium">{formatCurrency(selectedCustomer.lifetimeValue)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Total Orders:</span>
                                  <span className="text-sm">{selectedCustomer.totalOrders}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {selectedCustomer.tags && selectedCustomer.tags.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Tags</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedCustomer.tags.map((tag) => (
                                  <Badge key={tag} variant="outline">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
                      {/* Notes section */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Note input */}
                            <div className="flex flex-col gap-2">
                              <Textarea 
                                placeholder="Add a note about this customer..." 
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                              />
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id="important-note"
                                    checked={isImportantNote}
                                    onChange={(e) => setIsImportantNote(e.target.checked)}
                                    className="rounded border-gray-300"
                                  />
                                  <Label htmlFor="important-note" className="text-sm">
                                    Mark as important
                                  </Label>
                                </div>
                                <Button 
                                  size="sm" 
                                  disabled={!newNote.trim()}
                                  onClick={handleAddNote}
                                >
                                  Add Note
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                              {selectedCustomer.notes && selectedCustomer.notes.length > 0 ? (
                                selectedCustomer.notes
                                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                  .map((note) => (
                                    <div 
                                      key={note.id} 
                                      className={`p-3 rounded-md border ${note.isImportant ? 'border-red-200 bg-red-50' : ''}`}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div className="font-medium text-sm">{note.createdBy}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {getTimeAgo(note.createdAt)}
                                        </div>
                                      </div>
                                      <p className="mt-1 text-sm whitespace-pre-line">{note.content}</p>
                                    </div>
                                  ))
                              ) : (
                                <div className="text-center py-6 text-muted-foreground">
                                  No notes yet. Add one to keep track of important information.
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Interactions/Activity section */}
                      {selectedCustomer.interactions && selectedCustomer.interactions.length > 0 && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {selectedCustomer.interactions
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((interaction) => (
                                  <div key={interaction.id} className="flex gap-4">
                                    <div className="mt-0.5">
                                      {interaction.type === 'call' && (
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                          <Phone className="h-4 w-4 text-blue-600" />
                                        </div>
                                      )}
                                      {interaction.type === 'email' && (
                                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                          <Mail className="h-4 w-4 text-purple-600" />
                                        </div>
                                      )}
                                      {interaction.type === 'meeting' && (
                                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                          <Users className="h-4 w-4 text-green-600" />
                                        </div>
                                      )}
                                      {interaction.type === 'support' && (
                                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                          <HelpCircle className="h-4 w-4 text-amber-600" />
                                        </div>
                                      )}
                                      {interaction.type === 'other' && (
                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                          <Activity className="h-4 w-4 text-gray-600" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between">
                                        <h4 className="text-sm font-medium">{interaction.description}</h4>
                                        <span className="text-xs text-muted-foreground">
                                          {formatDate(interaction.date)}
                                        </span>
                                      </div>
                                      {interaction.outcome && (
                                        <p className="mt-1 text-sm">{interaction.outcome}</p>
                                      )}
                                      {interaction.nextAction && (
                                        <div className="mt-2 flex items-center gap-1 text-xs bg-muted p-1.5 rounded-sm">
                                          <Clock className="h-3.5 w-3.5" />
                                          <span>Next: {interaction.nextAction}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[400px] border-2 border-dashed rounded-lg">
                      <div className="text-center p-6">
                        <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No customer selected</h3>
                        <p className="text-muted-foreground mt-1 mb-4">
                          Select a customer from the list to view their details
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="segments" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Customer Segments */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Segments</CardTitle>
                  <CardDescription>
                    Distribution of customers by segment
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Segment chart visualization
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Segments Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Segment Metrics</CardTitle>
                  <CardDescription>
                    Performance metrics by customer segment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Segment</TableHead>
                        <TableHead className="text-right">Customers</TableHead>
                        <TableHead className="text-right">Avg. LTV</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {demoSegments.map((segment) => (
                        <TableRow key={segment.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div 
                                className="h-3 w-3 rounded-full mr-2" 
                                style={{ backgroundColor: segment.color }}
                              ></div>
                              {segment.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{segment.customerCount}</TableCell>
                          <TableCell className="text-right">{formatCurrency(segment.avgLtv)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              {/* Customer Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Status</CardTitle>
                  <CardDescription>
                    Current status of all customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active</span>
                        <span className="font-medium">
                          {customers.filter(c => c.status === 'active').length} ({totalCustomers ? Math.round((customers.filter(c => c.status === 'active').length / totalCustomers) * 100) : 0}%)
                        </span>
                      </div>
                      <Progress value={totalCustomers ? (customers.filter(c => c.status === 'active').length / totalCustomers) * 100 : 0} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>VIP</span>
                        <span className="font-medium">
                          {customers.filter(c => c.status === 'vip').length} ({totalCustomers ? Math.round((customers.filter(c => c.status === 'vip').length / totalCustomers) * 100) : 0}%)
                        </span>
                      </div>
                      <Progress value={totalCustomers ? (customers.filter(c => c.status === 'vip').length / totalCustomers) * 100 : 0} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>New</span>
                        <span className="font-medium">
                          {customers.filter(c => c.status === 'new').length} ({totalCustomers ? Math.round((customers.filter(c => c.status === 'new').length / totalCustomers) * 100) : 0}%)
                        </span>
                      </div>
                      <Progress value={totalCustomers ? (customers.filter(c => c.status === 'new').length / totalCustomers) * 100 : 0} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>At Risk</span>
                        <span className="font-medium">
                          {customers.filter(c => c.status === 'at-risk').length} ({totalCustomers ? Math.round((customers.filter(c => c.status === 'at-risk').length / totalCustomers) * 100) : 0}%)
                        </span>
                      </div>
                      <Progress value={totalCustomers ? (customers.filter(c => c.status === 'at-risk').length / totalCustomers) * 100 : 0} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Inactive</span>
                        <span className="font-medium">
                          {customers.filter(c => c.status === 'inactive').length} ({totalCustomers ? Math.round((customers.filter(c => c.status === 'inactive').length / totalCustomers) * 100) : 0}%)
                        </span>
                      </div>
                      <Progress value={totalCustomers ? (customers.filter(c => c.status === 'inactive').length / totalCustomers) * 100 : 0} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Customer Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Acquisition Channels</CardTitle>
                  <CardDescription>
                    Where your customers come from
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Acquisition channels chart
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Customer Dialog */}
      <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter customer information. Required fields are marked with an asterisk.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="name" 
                  value={newCustomer.name} 
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} 
                  placeholder="John Smith"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={newCustomer.email} 
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} 
                  placeholder="john.smith@example.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={newCustomer.phone} 
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} 
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  value={newCustomer.company} 
                  onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})} 
                  placeholder="Acme Inc."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={newCustomer.status} 
                  onValueChange={(value) => setNewCustomer({...newCustomer, status: value as CustomerStatus})}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="at-risk">At Risk</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="segment">
                  Segment <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={newCustomer.segment} 
                  onValueChange={(value) => setNewCustomer({...newCustomer, segment: value as CustomerSegment})}
                >
                  <SelectTrigger id="segment">
                    <SelectValue placeholder="Select segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="wholesale">Wholesale</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="small-business">Small Business</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="source">
                  Source <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={newCustomer.source} 
                  onValueChange={(value) => setNewCustomer({...newCustomer, source: value as CustomerSource})}
                >
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="advertising">Advertising</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="tags" 
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {newCustomer.tags && newCustomer.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newCustomer.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <button 
                        type="button" 
                        className="ml-1 rounded-full hover:bg-muted" 
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="entity">
                Entity <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={newCustomer.entityId?.toString()} 
                onValueChange={(value) => {
                  const entityId = parseInt(value);
                  const entityName = entities.find(e => e.id === entityId)?.name;
                  setNewCustomer({
                    ...newCustomer, 
                    entityId,
                    entityName
                  });
                }}
              >
                <SelectTrigger id="entity">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingCustomer(false)}>Cancel</Button>
            <Button onClick={handleCreateCustomer} disabled={!newCustomer.name || !newCustomer.email}>Save Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Customer Dialog */}
      <Dialog open={isEditingCustomer} onOpenChange={setIsEditingCustomer}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information.
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input 
                    id="edit-name" 
                    value={selectedCustomer.name} 
                    onChange={(e) => setSelectedCustomer({...selectedCustomer, name: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input 
                    id="edit-email" 
                    type="email" 
                    value={selectedCustomer.email} 
                    onChange={(e) => setSelectedCustomer({...selectedCustomer, email: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input 
                    id="edit-phone" 
                    value={selectedCustomer.phone || ''} 
                    onChange={(e) => setSelectedCustomer({...selectedCustomer, phone: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-company">Company</Label>
                  <Input 
                    id="edit-company" 
                    value={selectedCustomer.company || ''} 
                    onChange={(e) => setSelectedCustomer({...selectedCustomer, company: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={selectedCustomer.status} 
                    onValueChange={(value) => setSelectedCustomer({...selectedCustomer, status: value as CustomerStatus})}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="at-risk">At Risk</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-segment">Segment</Label>
                  <Select 
                    value={selectedCustomer.segment} 
                    onValueChange={(value) => setSelectedCustomer({...selectedCustomer, segment: value as CustomerSegment})}
                  >
                    <SelectTrigger id="edit-segment">
                      <SelectValue placeholder="Select segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="small-business">Small Business</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-source">Source</Label>
                  <Select 
                    value={selectedCustomer.source} 
                    onValueChange={(value) => setSelectedCustomer({...selectedCustomer, source: value as CustomerSource})}
                  >
                    <SelectTrigger id="edit-source">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="advertising">Advertising</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-tags">Tags</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="edit-tags" 
                    value={tagInput} 
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && tagInput.trim()) {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {selectedCustomer.tags && selectedCustomer.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCustomer.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <button 
                          type="button" 
                          className="ml-1 rounded-full hover:bg-muted" 
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-ltv">Lifetime Value ($)</Label>
                  <Input 
                    id="edit-ltv" 
                    type="number" 
                    value={selectedCustomer.lifetimeValue} 
                    onChange={(e) => setSelectedCustomer({
                      ...selectedCustomer, 
                      lifetimeValue: parseFloat(e.target.value) || 0
                    })} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-orders">Total Orders</Label>
                  <Input 
                    id="edit-orders" 
                    type="number" 
                    value={selectedCustomer.totalOrders} 
                    onChange={(e) => setSelectedCustomer({
                      ...selectedCustomer, 
                      totalOrders: parseInt(e.target.value) || 0
                    })} 
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-entity">Entity</Label>
                <Select 
                  value={selectedCustomer.entityId.toString()} 
                  onValueChange={(value) => {
                    const entityId = parseInt(value);
                    const entityName = entities.find(e => e.id === entityId)?.name || '';
                    setSelectedCustomer({
                      ...selectedCustomer, 
                      entityId,
                      entityName
                    });
                  }}
                >
                  <SelectTrigger id="edit-entity">
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
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingCustomer(false)}>Cancel</Button>
            <Button onClick={handleUpdateCustomer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default EnhancedCRM;