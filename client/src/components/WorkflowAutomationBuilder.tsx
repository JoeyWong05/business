import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUpDown,
  BellRing, 
  Box, 
  Brain,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Code2,
  Cog,
  Compass,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Filter,
  FlowArrow,
  Fuel, 
  Globe,
  Grid3x3,
  Hammer,
  HardDrive,
  HelpCircle,
  History,
  Key,
  Laptop,
  Layers,
  Library,
  Link,
  ListFilter,
  Mail,
  MessageSquare,
  MonitorPlay,
  MoreHorizontal,
  MoveHorizontal,
  PackageOpen,
  Pencil,
  Plus,
  PlusCircle,
  Puzzle,
  ReceiptText,
  Repeat,
  Save,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Shuffle,
  Sparkles,
  Stopwatch,
  Tag,
  TerminalSquare,
  Trash2,
  Undo2,
  Upload,
  User,
  UserPlus,
  Wand2,
  Workflow,
  X,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define types for workflow components
interface TriggerConfig {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  config: Record<string, any>;
  entityType?: 'service' | 'physical' | 'product' | 'all';
}

interface ActionConfig {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  config: Record<string, any>;
  entityType?: 'service' | 'physical' | 'product' | 'all';
}

interface ConditionConfig {
  id: string;
  type: 'condition';
  name: string;
  operator: string;
  value: any;
  config: Record<string, any>;
}

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  config: TriggerConfig | ActionConfig | ConditionConfig | any;
  nextNodes: string[];
  position: { x: number; y: number };
}

interface Connection {
  sourceId: string;
  targetId: string;
  label?: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  entityId?: number;
  active: boolean;
  nodes: WorkflowNode[];
  connections: Connection[];
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  runCount: number;
  createdBy: string;
  tags: string[];
  businessType: 'service' | 'physical' | 'product' | 'all';
}

const WorkflowAutomationBuilder: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState<boolean>(false);
  const [newWorkflowName, setNewWorkflowName] = useState<string>('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState<string>('');
  const [newWorkflowBusinessType, setNewWorkflowBusinessType] = useState<'service' | 'physical' | 'product' | 'all'>('all');
  const [newWorkflowEntity, setNewWorkflowEntity] = useState<string>('all');
  const [tabValue, setTabValue] = useState<string>('workflows');
  const [showNodeSelector, setShowNodeSelector] = useState<boolean>(false);
  const [nodeSelectorPosition, setNodeSelectorPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();
  
  // Mock data for business entities
  const entities = [
    { id: 1, name: 'Digital Merch Pros', type: 'product' },
    { id: 2, name: 'Mystery Hype', type: 'product' },
    { id: 3, name: 'Lone Star Custom Clothing', type: 'service' },
    { id: 4, name: 'Alcoeaze', type: 'physical' },
    { id: 5, name: 'Hide Cafe Bars', type: 'physical' },
  ];
  
  // Sample trigger templates
  const triggerTemplates: TriggerConfig[] = [
    {
      id: 'new_order',
      type: 'trigger',
      name: 'New Order Created',
      description: 'Triggers when a new order is placed',
      icon: <ShoppingBag className="h-5 w-5" />,
      config: { source: 'all' },
      entityType: 'product'
    },
    {
      id: 'new_client',
      type: 'trigger',
      name: 'New Client Added',
      description: 'Triggers when a new client is added to the system',
      icon: <UserPlus className="h-5 w-5" />,
      config: { source: 'all' },
      entityType: 'all'
    },
    {
      id: 'payment_received',
      type: 'trigger',
      name: 'Payment Received',
      description: 'Triggers when a payment is received',
      icon: <CreditCard className="h-5 w-5" />,
      config: { source: 'all' },
      entityType: 'all'
    },
    {
      id: 'inventory_low',
      type: 'trigger',
      name: 'Inventory Low Alert',
      description: 'Triggers when inventory drops below threshold',
      icon: <Box className="h-5 w-5" />,
      config: { threshold: 10 },
      entityType: 'product'
    },
    {
      id: 'new_appointment',
      type: 'trigger',
      name: 'New Appointment Booked',
      description: 'Triggers when a client books an appointment',
      icon: <Calendar className="h-5 w-5" />,
      config: { calendar: 'all' },
      entityType: 'service'
    },
    {
      id: 'form_submitted',
      type: 'trigger',
      name: 'Form Submission',
      description: 'Triggers when a form is submitted',
      icon: <ClipboardCheck className="h-5 w-5" />,
      config: { formId: 'all' },
      entityType: 'all'
    },
    {
      id: 'scheduled',
      type: 'trigger',
      name: 'Scheduled Trigger',
      description: 'Triggers at scheduled intervals',
      icon: <Clock className="h-5 w-5" />,
      config: { interval: 'daily', time: '09:00' },
      entityType: 'all'
    },
    {
      id: 'customer_support',
      type: 'trigger',
      name: 'New Support Ticket',
      description: 'Triggers when a new support ticket is created',
      icon: <MessageSquare className="h-5 w-5" />,
      config: { priority: 'all' },
      entityType: 'all'
    }
  ];
  
  // Sample action templates
  const actionTemplates: ActionConfig[] = [
    {
      id: 'send_email',
      type: 'action',
      name: 'Send Email',
      description: 'Sends an email to specified recipients',
      icon: <Mail className="h-5 w-5" />,
      config: { template: '', to: '', subject: '', body: '' },
      entityType: 'all'
    },
    {
      id: 'create_task',
      type: 'action',
      name: 'Create Task',
      description: 'Creates a new task and assigns it to a team member',
      icon: <ClipboardCheck className="h-5 w-5" />,
      config: { title: '', assignee: '', dueDate: '', priority: 'medium' },
      entityType: 'all'
    },
    {
      id: 'update_crm',
      type: 'action',
      name: 'Update CRM Record',
      description: 'Updates a record in the CRM system',
      icon: <User className="h-5 w-5" />,
      config: { recordType: 'client', recordId: '', fields: {} },
      entityType: 'all'
    },
    {
      id: 'send_notification',
      type: 'action',
      name: 'Send Notification',
      description: 'Sends a notification to specified users',
      icon: <BellRing className="h-5 w-5" />,
      config: { recipients: [], message: '', type: 'info' },
      entityType: 'all'
    },
    {
      id: 'reorder_inventory',
      type: 'action',
      name: 'Reorder Inventory',
      description: 'Creates a purchase order for inventory replenishment',
      icon: <PackageOpen className="h-5 w-5" />,
      config: { supplier: '', items: [], urgency: 'normal' },
      entityType: 'product'
    },
    {
      id: 'generate_invoice',
      type: 'action',
      name: 'Generate Invoice',
      description: 'Generates an invoice for a client',
      icon: <ReceiptText className="h-5 w-5" />,
      config: { client: '', services: [], dueDate: '' },
      entityType: 'all'
    },
    {
      id: 'schedule_delivery',
      type: 'action',
      name: 'Schedule Delivery',
      description: 'Schedules a delivery for a physical product',
      icon: <Truck className="h-5 w-5" />,
      config: { orderId: '', date: '', timeSlot: '', carrier: '' },
      entityType: 'product'
    },
    {
      id: 'generate_sop',
      type: 'action',
      name: 'Generate SOP',
      description: 'Generates a custom SOP for a specific business function',
      icon: <Wand2 className="h-5 w-5" />,
      config: { category: '', businessType: '', complexity: 'medium' },
      entityType: 'all'
    },
    {
      id: 'update_api',
      type: 'action',
      name: 'API Request',
      description: 'Makes an API request to an external system',
      icon: <Globe className="h-5 w-5" />,
      config: { url: '', method: 'GET', headers: {}, body: {} },
      entityType: 'all'
    },
    {
      id: 'ai_analysis',
      type: 'action',
      name: 'AI Data Analysis',
      description: 'Analyzes data using AI and generates insights',
      icon: <Brain className="h-5 w-5" />,
      config: { dataSource: '', analysisType: 'basic', outputFormat: 'report' },
      entityType: 'all'
    }
  ];
  
  // Sample condition templates
  const conditionTemplates = [
    { id: 'equals', name: 'Equals', operator: '==' },
    { id: 'not_equals', name: 'Not Equals', operator: '!=' },
    { id: 'greater_than', name: 'Greater Than', operator: '>' },
    { id: 'less_than', name: 'Less Than', operator: '<' },
    { id: 'contains', name: 'Contains', operator: 'contains' },
    { id: 'starts_with', name: 'Starts With', operator: 'startsWith' },
    { id: 'ends_with', name: 'Ends With', operator: 'endsWith' },
  ];
  
  // Sample delay options
  const delayOptions = [
    { value: '1m', label: '1 minute' },
    { value: '5m', label: '5 minutes' },
    { value: '15m', label: '15 minutes' },
    { value: '30m', label: '30 minutes' },
    { value: '1h', label: '1 hour' },
    { value: '3h', label: '3 hours' },
    { value: '6h', label: '6 hours' },
    { value: '12h', label: '12 hours' },
    { value: '1d', label: '1 day' },
    { value: '3d', label: '3 days' },
    { value: '1w', label: '1 week' },
    { value: 'custom', label: 'Custom...' },
  ];
  
  // Sample example workflows
  const exampleWorkflows = [
    {
      id: 'new_client_onboarding',
      name: 'New Client Onboarding',
      description: 'Automatically onboard new clients with welcome emails, task creation, and document generation',
      businessType: 'service' as const,
      tags: ['client', 'onboarding', 'automation']
    },
    {
      id: 'inventory_management',
      name: 'Inventory Management Automation',
      description: 'Automatically reorders inventory when stock levels are low and notifies the procurement team',
      businessType: 'product' as const,
      tags: ['inventory', 'procurement', 'stock']
    },
    {
      id: 'appointment_reminder',
      name: 'Appointment Reminder System',
      description: 'Sends automated reminders to clients before their scheduled appointments',
      businessType: 'service' as const,
      tags: ['appointment', 'reminder', 'client']
    },
    {
      id: 'order_fulfillment',
      name: 'Order Fulfillment Process',
      description: 'Streamlines the order processing workflow from receipt to delivery',
      businessType: 'product' as const,
      tags: ['order', 'fulfillment', 'delivery']
    },
    {
      id: 'invoice_management',
      name: 'Invoice Management',
      description: 'Automatically generates and sends invoices, tracks payments, and sends reminders',
      businessType: 'all' as const,
      tags: ['invoice', 'payment', 'accounting']
    }
  ];
  
  // Sample mock workflows
  const mockWorkflows = [
    {
      id: 'workflow_1',
      name: 'Client Onboarding',
      description: 'Automated workflow for onboarding new clients',
      entityId: 3,
      active: true,
      nodes: [],
      connections: [],
      createdAt: new Date('2025-02-15'),
      updatedAt: new Date('2025-03-10'),
      lastRun: new Date('2025-03-15'),
      runCount: 24,
      createdBy: 'John Doe',
      tags: ['client', 'onboarding', 'automation'],
      businessType: 'service' as const
    },
    {
      id: 'workflow_2',
      name: 'Order Processing',
      description: 'Streamlines order processing from receipt to delivery',
      entityId: 1,
      active: true,
      nodes: [],
      connections: [],
      createdAt: new Date('2025-01-20'),
      updatedAt: new Date('2025-03-05'),
      lastRun: new Date('2025-03-20'),
      runCount: 156,
      createdBy: 'Jane Smith',
      tags: ['order', 'processing', 'delivery'],
      businessType: 'product' as const
    }
  ];
  
  // Function to create a new workflow
  const createNewWorkflow = () => {
    if (!newWorkflowName) {
      toast({
        title: "Missing information",
        description: "Please provide a name for your workflow.",
        variant: "destructive",
      });
      return;
    }
    
    const newWorkflow: Workflow = {
      id: `workflow_${Math.random().toString(36).substr(2, 9)}`,
      name: newWorkflowName,
      description: newWorkflowDescription || 'No description provided',
      entityId: newWorkflowEntity !== 'all' ? parseInt(newWorkflowEntity) : undefined,
      active: false,
      nodes: [],
      connections: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      runCount: 0,
      createdBy: 'Current User',
      tags: [],
      businessType: newWorkflowBusinessType
    };
    
    setWorkflows([...workflows, newWorkflow]);
    setActiveWorkflow(newWorkflow);
    setIsCreatingWorkflow(false);
    setTabValue('editor');
    
    toast({
      title: "Workflow Created",
      description: `"${newWorkflowName}" has been created successfully.`,
    });
  };
  
  // Function to add a node to the workflow
  const addNodeToWorkflow = (nodeType: 'trigger' | 'action' | 'condition' | 'delay', templateId: string) => {
    if (!activeWorkflow) return;
    
    let nodeConfig;
    
    if (nodeType === 'trigger') {
      nodeConfig = triggerTemplates.find((t) => t.id === templateId);
    } else if (nodeType === 'action') {
      nodeConfig = actionTemplates.find((a) => a.id === templateId);
    } else if (nodeType === 'condition') {
      nodeConfig = {
        id: templateId,
        type: 'condition',
        name: conditionTemplates.find((c) => c.id === templateId)?.name || 'Condition',
        operator: conditionTemplates.find((c) => c.id === templateId)?.operator || '==',
        value: '',
        config: {}
      };
    } else if (nodeType === 'delay') {
      nodeConfig = {
        id: 'delay',
        type: 'delay',
        name: 'Delay',
        description: 'Pauses the workflow for a specified duration',
        icon: <Clock />,
        config: { duration: '1h' }
      };
    }
    
    if (!nodeConfig) return;
    
    const newNode: WorkflowNode = {
      id: `${nodeType}_${Math.random().toString(36).substr(2, 9)}`,
      type: nodeType,
      config: nodeConfig,
      nextNodes: [],
      position: { ...nodeSelectorPosition }
    };
    
    const updatedWorkflow = {
      ...activeWorkflow,
      nodes: [...activeWorkflow.nodes, newNode]
    };
    
    setActiveWorkflow(updatedWorkflow);
    setShowNodeSelector(false);
    
    // Update in workflows array
    setWorkflows(
      workflows.map((w) => (w.id === activeWorkflow.id ? updatedWorkflow : w))
    );
  };
  
  // Function to save the workflow
  const saveWorkflow = () => {
    if (!activeWorkflow) return;
    
    const updatedWorkflow = {
      ...activeWorkflow,
      updatedAt: new Date()
    };
    
    setWorkflows(
      workflows.map((w) => (w.id === activeWorkflow.id ? updatedWorkflow : w))
    );
    
    toast({
      title: "Workflow Saved",
      description: `"${activeWorkflow.name}" has been saved successfully.`,
    });
  };
  
  // Function to activate/deactivate a workflow
  const toggleWorkflowStatus = (workflowId: string) => {
    setWorkflows(
      workflows.map((w) => {
        if (w.id === workflowId) {
          return { ...w, active: !w.active };
        }
        return w;
      })
    );
    
    const workflow = workflows.find((w) => w.id === workflowId);
    if (workflow) {
      toast({
        title: workflow.active ? "Workflow Deactivated" : "Workflow Activated",
        description: `"${workflow.name}" has been ${workflow.active ? 'deactivated' : 'activated'}.`,
      });
    }
  };
  
  // Function to delete a workflow
  const deleteWorkflow = (workflowId: string) => {
    setWorkflows(workflows.filter((w) => w.id !== workflowId));
    
    if (activeWorkflow?.id === workflowId) {
      setActiveWorkflow(null);
      setTabValue('workflows');
    }
    
    toast({
      title: "Workflow Deleted",
      description: "The workflow has been deleted successfully.",
    });
  };
  
  // Function to filter templates based on business type
  const filterTemplatesByBusinessType = (templates: any[], type: string) => {
    if (type === 'all') return templates;
    
    return templates.filter(
      (t) => t.entityType === 'all' || t.entityType === type
    );
  };
  
  // Function to duplicate a workflow
  const duplicateWorkflow = (workflow: Workflow) => {
    const duplicatedWorkflow: Workflow = {
      ...workflow,
      id: `workflow_${Math.random().toString(36).substr(2, 9)}`,
      name: `${workflow.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      runCount: 0,
      active: false
    };
    
    setWorkflows([...workflows, duplicatedWorkflow]);
    
    toast({
      title: "Workflow Duplicated",
      description: `"${workflow.name}" has been duplicated successfully.`,
    });
  };
  
  // Function to export workflow as JSON
  const exportWorkflow = (workflow: Workflow) => {
    const jsonStr = JSON.stringify(workflow, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(jsonStr)}`;
    
    // Create a temporary link element and trigger download
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `${workflow.name.toLowerCase().replace(/\s+/g, '_')}_workflow.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Workflow Exported",
      description: `"${workflow.name}" has been exported as JSON.`,
    });
  };
  
  // Function to handle node selection
  const handleNodeSelection = (nodeId: string) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
  };
  
  // UI components
  
  // Node component for workflow editor
  const WorkflowNode = ({ node, isSelected }: { node: WorkflowNode; isSelected: boolean }) => {
    const getNodeColor = () => {
      switch (node.type) {
        case 'trigger':
          return 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700';
        case 'action':
          return 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700';
        case 'condition':
          return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700';
        case 'delay':
          return 'bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700';
        default:
          return 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700';
      }
    };
    
    const getNodeIcon = () => {
      if (node.config.icon) return node.config.icon;
      
      switch (node.type) {
        case 'trigger':
          return <Zap className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
        case 'action':
          return <Workflow className="h-5 w-5 text-green-500 dark:text-green-400" />;
        case 'condition':
          return <ArrowUpDown className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />;
        case 'delay':
          return <Clock className="h-5 w-5 text-purple-500 dark:text-purple-400" />;
        default:
          return <Puzzle className="h-5 w-5" />;
      }
    };
    
    return (
      <div
        className={`absolute rounded-md border-2 p-3 shadow-sm w-64 cursor-pointer transition-all ${getNodeColor()} ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        style={{ left: node.position.x, top: node.position.y }}
        onClick={() => handleNodeSelection(node.id)}
      >
        <div className="flex items-center gap-2">
          {getNodeIcon()}
          <div>
            <h3 className="font-medium text-sm">{node.config.name}</h3>
            <p className="text-xs text-muted-foreground">{node.config.description}</p>
          </div>
        </div>
      </div>
    );
  };
  
  // Node selector component
  const NodeSelector = () => {
    const [nodeType, setNodeType] = useState<'trigger' | 'action' | 'condition' | 'delay'>('trigger');
    
    return (
      <Card className="absolute z-10 w-72 shadow-lg" style={{ left: nodeSelectorPosition.x, top: nodeSelectorPosition.y }}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Add Node</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowNodeSelector(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <Tabs defaultValue="trigger" onValueChange={(value) => setNodeType(value as any)}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="trigger">Trigger</TabsTrigger>
              <TabsTrigger value="action">Action</TabsTrigger>
              <TabsTrigger value="condition">Condition</TabsTrigger>
              <TabsTrigger value="delay">Delay</TabsTrigger>
            </TabsList>
            <TabsContent value="trigger" className="mt-2 max-h-72 overflow-auto">
              <div className="space-y-1">
                {filterTemplatesByBusinessType(triggerTemplates, activeWorkflow?.businessType || 'all').map((trigger) => (
                  <div
                    key={trigger.id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => addNodeToWorkflow('trigger', trigger.id)}
                  >
                    <div className="h-8 w-8 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      {trigger.icon || <Zap className="h-4 w-4 text-blue-500 dark:text-blue-400" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{trigger.name}</h4>
                      <p className="text-xs text-muted-foreground">{trigger.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="action" className="mt-2 max-h-72 overflow-auto">
              <div className="space-y-1">
                {filterTemplatesByBusinessType(actionTemplates, activeWorkflow?.businessType || 'all').map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => addNodeToWorkflow('action', action.id)}
                  >
                    <div className="h-8 w-8 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      {action.icon || <Workflow className="h-4 w-4 text-green-500 dark:text-green-400" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{action.name}</h4>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="condition" className="mt-2 max-h-72 overflow-auto">
              <div className="space-y-1">
                {conditionTemplates.map((condition) => (
                  <div
                    key={condition.id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => addNodeToWorkflow('condition', condition.id)}
                  >
                    <div className="h-8 w-8 rounded-md bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <ArrowUpDown className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{condition.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {condition.operator}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="delay" className="mt-2 max-h-72 overflow-auto">
              <div className="space-y-2 p-2">
                <Label>Delay Duration</Label>
                <Select defaultValue="1h" onValueChange={(value) => {}}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {delayOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  className="w-full mt-2"
                  onClick={() => addNodeToWorkflow('delay', 'delay')}
                >
                  Add Delay
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };
  
  // Node configuration panel
  const NodeConfigPanel = () => {
    if (!activeWorkflow || !selectedNode) return null;
    
    const node = activeWorkflow.nodes.find((n) => n.id === selectedNode);
    if (!node) return null;
    
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Configure {node.type.charAt(0).toUpperCase() + node.type.slice(1)}</CardTitle>
          <CardDescription>
            Customize the settings for this {node.type}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {node.type === 'trigger' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={node.config.name} />
              </div>
              
              {node.config.id === 'new_order' && (
                <>
                  <div className="space-y-2">
                    <Label>Order Source</Label>
                    <Select defaultValue={node.config.config.source}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="amazon">Amazon</SelectItem>
                        <SelectItem value="ebay">eBay</SelectItem>
                        <SelectItem value="etsy">Etsy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Order Minimum Value</Label>
                    <Input type="number" defaultValue="0" />
                  </div>
                </>
              )}
              
              {node.config.id === 'inventory_low' && (
                <div className="space-y-2">
                  <Label>Threshold</Label>
                  <Input type="number" defaultValue={node.config.config.threshold.toString()} />
                </div>
              )}
              
              {node.config.id === 'scheduled' && (
                <>
                  <div className="space-y-2">
                    <Label>Interval</Label>
                    <Select defaultValue={node.config.config.interval}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input type="time" defaultValue={node.config.config.time} />
                  </div>
                </>
              )}
            </div>
          )}
          
          {node.type === 'action' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={node.config.name} />
              </div>
              
              {node.config.id === 'send_email' && (
                <>
                  <div className="space-y-2">
                    <Label>To</Label>
                    <Input placeholder="Recipient email or dynamic value" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input placeholder="Email subject" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Template</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select email template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="welcome">Welcome Email</SelectItem>
                        <SelectItem value="order_confirmation">Order Confirmation</SelectItem>
                        <SelectItem value="invoice">Invoice</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Body</Label>
                    <Textarea rows={5} placeholder="Email content" />
                  </div>
                </>
              )}
              
              {node.config.id === 'create_task' && (
                <>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input placeholder="Task title" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Assignee</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign to" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current_user">Current User</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="team">Team</SelectItem>
                        <SelectItem value="dynamic">Dynamic (From Trigger)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input type="date" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          )}
          
          {node.type === 'condition' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Field</Label>
                <Input placeholder="Select or enter field name" />
              </div>
              
              <div className="space-y-2">
                <Label>Operator</Label>
                <Select defaultValue={node.config.operator}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionTemplates.map((condition) => (
                      <SelectItem key={condition.id} value={condition.operator}>
                        {condition.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Value</Label>
                <Input placeholder="Comparison value" />
              </div>
            </div>
          )}
          
          {node.type === 'delay' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select defaultValue={node.config.config.duration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {delayOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-between border-t pt-4">
          <Button variant="destructive" size="sm" onClick={() => {
            if (activeWorkflow) {
              const updatedWorkflow = {
                ...activeWorkflow,
                nodes: activeWorkflow.nodes.filter(n => n.id !== selectedNode)
              };
              
              setActiveWorkflow(updatedWorkflow);
              setSelectedNode(null);
              
              // Update in workflows array
              setWorkflows(
                workflows.map((w) => (w.id === activeWorkflow.id ? updatedWorkflow : w))
              );
            }
          }}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button size="sm">
            <Check className="h-4 w-4 mr-2" />
            Apply
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Workflow Automation Builder</h2>
          <p className="text-muted-foreground">
            Create and manage custom automation workflows for your business
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeWorkflow && tabValue === 'editor' ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  setTabValue('workflows');
                  setActiveWorkflow(null);
                }}
              >
                <Undo2 className="mr-2 h-4 w-4" />
                Back to List
              </Button>
              <Button onClick={saveWorkflow}>
                <Save className="mr-2 h-4 w-4" />
                Save Workflow
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsCreatingWorkflow(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          )}
        </div>
      </div>
      
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <TabsList>
          <TabsTrigger value="workflows">My Workflows</TabsTrigger>
          <TabsTrigger value="editor" disabled={!activeWorkflow}>Workflow Editor</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        {/* My Workflows Tab */}
        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Workflows</CardTitle>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Search workflows..."
                    className="w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select 
                    value={filterType} 
                    onValueChange={setFilterType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Business Types</SelectItem>
                      <SelectItem value="service">Service-Based</SelectItem>
                      <SelectItem value="product">Product-Based</SelectItem>
                      <SelectItem value="physical">Physical Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                {[...mockWorkflows, ...workflows].length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="rounded-full bg-muted p-3">
                      <Workflow className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">No workflows yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Create your first workflow to automate business processes
                    </p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setIsCreatingWorkflow(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Workflow
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y">
                    {[...mockWorkflows, ...workflows]
                      .filter(w => {
                        // Filter by search term
                        if (searchTerm && !w.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
                            !w.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                          return false;
                        }
                        
                        // Filter by business type
                        if (filterType !== 'all' && w.businessType !== filterType && w.businessType !== 'all') {
                          return false;
                        }
                        
                        return true;
                      })
                      .map((workflow) => (
                        <div key={workflow.id} className="p-4 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start justify-between">
                            <div 
                              className="flex-1 cursor-pointer"
                              onClick={() => {
                                setActiveWorkflow(workflow);
                                setTabValue('editor');
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{workflow.name}</h3>
                                <Badge 
                                  variant={workflow.active ? "default" : "outline"}
                                  className={workflow.active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : ""}
                                >
                                  {workflow.active ? "Active" : "Inactive"}
                                </Badge>
                                
                                {workflow.businessType !== 'all' && (
                                  <Badge variant="outline">
                                    {workflow.businessType === 'service' 
                                      ? 'Service-Based' 
                                      : workflow.businessType === 'product'
                                      ? 'Product-Based'
                                      : 'Physical Business'}
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="mt-1 text-sm text-muted-foreground">
                                {workflow.description}
                              </p>
                              
                              <div className="mt-2 flex flex-wrap gap-1">
                                {workflow.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <History className="h-3 w-3" />
                                  Last run: {workflow.lastRun ? new Date(workflow.lastRun).toLocaleDateString() : "Never"}
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Repeat className="h-3 w-3" />
                                  Runs: {workflow.runCount}
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Updated: {new Date(workflow.updatedAt).toLocaleDateString()}
                                </div>
                                
                                {workflow.entityId && (
                                  <div className="flex items-center gap-1">
                                    <Building className="h-3 w-3" />
                                    Entity: {entities.find(e => e.id === workflow.entityId)?.name || 'Unknown'}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleWorkflowStatus(workflow.id)}
                                title={workflow.active ? "Deactivate" : "Activate"}
                              >
                                {workflow.active ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Circle className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setActiveWorkflow(workflow);
                                      setTabValue('editor');
                                    }}
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => duplicateWorkflow(workflow)}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => exportWorkflow(workflow)}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Export
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-500 focus:text-red-500 dark:text-red-400 dark:focus:text-red-400"
                                    onClick={() => deleteWorkflow(workflow.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Workflow Editor Tab */}
        <TabsContent value="editor" className="space-y-4">
          {activeWorkflow && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{activeWorkflow.name}</CardTitle>
                      <CardDescription>{activeWorkflow.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="workflow-status" className="text-sm">Status:</Label>
                        <Switch
                          id="workflow-status"
                          checked={activeWorkflow.active}
                          onCheckedChange={(checked) => {
                            setActiveWorkflow({
                              ...activeWorkflow,
                              active: checked
                            });
                          }}
                        />
                        <span className="text-sm font-medium">
                          {activeWorkflow.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      
                      <Button variant="outline" onClick={saveWorkflow}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md bg-muted/20 h-[500px] relative overflow-hidden">
                    {activeWorkflow.nodes.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="rounded-full bg-primary/10 p-3">
                          <Workflow className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium">Start building your workflow</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Click anywhere on the canvas to add a node
                        </p>
                      </div>
                    ) : (
                      // This would be replaced with a proper workflow visualization
                      activeWorkflow.nodes.map((node) => (
                        <WorkflowNode
                          key={node.id}
                          node={node}
                          isSelected={selectedNode === node.id}
                        />
                      ))
                    )}
                    
                    {/* Click handler for workflow canvas */}
                    <div 
                      className="absolute inset-0 z-0 cursor-crosshair"
                      onClick={(e) => {
                        // If clicking directly on the canvas (not on a node)
                        if ((e.target as HTMLElement).classList.contains('cursor-crosshair')) {
                          setNodeSelectorPosition({ 
                            x: e.nativeEvent.offsetX, 
                            y: e.nativeEvent.offsetY 
                          });
                          setShowNodeSelector(true);
                        }
                      }}
                    />
                    
                    {showNodeSelector && <NodeSelector />}
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <Card className="md:col-span-6 lg:col-span-8">
                  <CardHeader>
                    <CardTitle>Workflow Logic</CardTitle>
                    <CardDescription>
                      Define the sequence and conditions for your workflow
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted/30 rounded-md p-4">
                        <h3 className="text-sm font-medium">Settings</h3>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="space-y-2">
                            <Label>Workflow Name</Label>
                            <Input 
                              value={activeWorkflow.name}
                              onChange={(e) => setActiveWorkflow({
                                ...activeWorkflow,
                                name: e.target.value
                              })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Business Type</Label>
                            <Select 
                              value={activeWorkflow.businessType}
                              onValueChange={(value: 'service' | 'physical' | 'product' | 'all') => {
                                setActiveWorkflow({
                                  ...activeWorkflow,
                                  businessType: value
                                });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select business type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Business Types</SelectItem>
                                <SelectItem value="service">Service-Based</SelectItem>
                                <SelectItem value="product">Product-Based</SelectItem>
                                <SelectItem value="physical">Physical Business</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Business Entity</Label>
                            <Select 
                              value={activeWorkflow.entityId?.toString() || 'all'}
                              onValueChange={(value) => {
                                setActiveWorkflow({
                                  ...activeWorkflow,
                                  entityId: value === 'all' ? undefined : parseInt(value)
                                });
                              }}
                            >
                              <SelectTrigger>
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
                          
                          <div className="space-y-2">
                            <Label>Tags</Label>
                            <Input 
                              placeholder="Enter tags (comma separated)"
                              value={activeWorkflow.tags.join(', ')}
                              onChange={(e) => {
                                const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                                setActiveWorkflow({
                                  ...activeWorkflow,
                                  tags
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 rounded-md p-4">
                        <h3 className="text-sm font-medium">Description</h3>
                        <Textarea 
                          className="mt-2"
                          rows={3}
                          value={activeWorkflow.description}
                          onChange={(e) => setActiveWorkflow({
                            ...activeWorkflow,
                            description: e.target.value
                          })}
                        />
                      </div>
                      
                      <div className="bg-muted/30 rounded-md p-4">
                        <h3 className="text-sm font-medium">Advanced Settings</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="error-notifications" className="cursor-pointer">
                              Error Notifications
                            </Label>
                            <Switch id="error-notifications" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="execution-logs" className="cursor-pointer">
                              Keep Execution Logs
                            </Label>
                            <Switch id="execution-logs" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="timeout" className="cursor-pointer">
                              Execution Timeout
                            </Label>
                            <Select defaultValue="30m">
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Timeout" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5m">5 minutes</SelectItem>
                                <SelectItem value="15m">15 minutes</SelectItem>
                                <SelectItem value="30m">30 minutes</SelectItem>
                                <SelectItem value="1h">1 hour</SelectItem>
                                <SelectItem value="2h">2 hours</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {selectedNode ? <NodeConfigPanel /> : (
                  <Card className="md:col-span-6 lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Workflow Components</CardTitle>
                      <CardDescription>
                        Click on the canvas to add components to your workflow
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-md border p-3">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-blue-500" />
                          <div>
                            <h3 className="text-sm font-medium">Triggers</h3>
                            <p className="text-xs text-muted-foreground">
                              Events that start your workflow
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-md border p-3">
                        <div className="flex items-center gap-2">
                          <Workflow className="h-5 w-5 text-green-500" />
                          <div>
                            <h3 className="text-sm font-medium">Actions</h3>
                            <p className="text-xs text-muted-foreground">
                              Tasks performed by your workflow
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-md border p-3">
                        <div className="flex items-center gap-2">
                          <ArrowUpDown className="h-5 w-5 text-yellow-500" />
                          <div>
                            <h3 className="text-sm font-medium">Conditions</h3>
                            <p className="text-xs text-muted-foreground">
                              Logic that controls workflow paths
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-md border p-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-purple-500" />
                          <div>
                            <h3 className="text-sm font-medium">Delays</h3>
                            <p className="text-xs text-muted-foreground">
                              Pause workflow for specific duration
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </TabsContent>
        
        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Templates</CardTitle>
              <CardDescription>
                Pre-built workflow templates to jumpstart your automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {exampleWorkflows.map((template) => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setNewWorkflowName(template.name);
                      setNewWorkflowDescription(template.description);
                      setNewWorkflowBusinessType(template.businessType);
                      setIsCreatingWorkflow(true);
                    }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <Badge variant="outline">
                        {template.businessType === 'service' 
                          ? 'Service-Based' 
                          : template.businessType === 'product'
                          ? 'Product-Based'
                          : template.businessType === 'physical'
                          ? 'Physical Business'
                          : 'All Business Types'}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {template.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button size="sm" className="w-full">
                        Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Activity</CardTitle>
              <CardDescription>
                Monitor the execution and performance of your workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md divide-y">
                <div className="p-4 flex items-center justify-between text-sm font-medium text-muted-foreground bg-muted/30">
                  <div className="flex items-center gap-8">
                    <span className="w-48">Workflow</span>
                    <span className="w-32">Status</span>
                    <span className="w-32">Entity</span>
                    <span className="w-32">Duration</span>
                    <span className="flex-1">Result</span>
                  </div>
                  <span>Timestamp</span>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <span className="w-48 font-medium">Client Onboarding</span>
                    <span className="w-32">
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Completed
                      </Badge>
                    </span>
                    <span className="w-32 text-sm">Lone Star Custom Clothing</span>
                    <span className="w-32 text-sm">3.2 seconds</span>
                    <span className="flex-1 text-sm text-muted-foreground">
                      Successfully sent welcome email and created onboarding task
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">Today, 2:15 PM</span>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <span className="w-48 font-medium">Order Processing</span>
                    <span className="w-32">
                      <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Failed
                      </Badge>
                    </span>
                    <span className="w-32 text-sm">Digital Merch Pros</span>
                    <span className="w-32 text-sm">1.8 seconds</span>
                    <span className="flex-1 text-sm text-muted-foreground">
                      Failed to connect to shipping API: Authentication error
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">Today, 1:42 PM</span>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <span className="w-48 font-medium">Inventory Management</span>
                    <span className="w-32">
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Completed
                      </Badge>
                    </span>
                    <span className="w-32 text-sm">Mystery Hype</span>
                    <span className="w-32 text-sm">2.5 seconds</span>
                    <span className="flex-1 text-sm text-muted-foreground">
                      Generated purchase order for 5 low-stock items
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">Today, 10:23 AM</span>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <span className="w-48 font-medium">Invoice Management</span>
                    <span className="w-32">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Running
                      </Badge>
                    </span>
                    <span className="w-32 text-sm">All Entities</span>
                    <span className="w-32 text-sm">25.7 seconds</span>
                    <span className="flex-1 text-sm text-muted-foreground">
                      Generating monthly invoices for 42 clients
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">Today, 9:00 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog for creating new workflow */}
      <Dialog open={isCreatingWorkflow} onOpenChange={setIsCreatingWorkflow}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Define the basic details for your new automation workflow
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input 
                id="workflow-name" 
                placeholder="e.g., Client Onboarding Process"
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workflow-description">Description</Label>
              <Textarea 
                id="workflow-description" 
                placeholder="Describe what this workflow will do..."
                value={newWorkflowDescription}
                onChange={(e) => setNewWorkflowDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workflow-business-type">Business Type</Label>
              <Select 
                value={newWorkflowBusinessType}
                onValueChange={(value: 'service' | 'physical' | 'product' | 'all') => setNewWorkflowBusinessType(value)}
              >
                <SelectTrigger id="workflow-business-type">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Business Types</SelectItem>
                  <SelectItem value="service">Service-Based</SelectItem>
                  <SelectItem value="product">Product-Based</SelectItem>
                  <SelectItem value="physical">Physical Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workflow-entity">Business Entity</Label>
              <Select 
                value={newWorkflowEntity}
                onValueChange={setNewWorkflowEntity}
              >
                <SelectTrigger id="workflow-entity">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingWorkflow(false)}>
              Cancel
            </Button>
            <Button onClick={createNewWorkflow}>
              Create Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowAutomationBuilder;

// Temporary definition of Circle and Truck for the demo
const Circle = ({ className }: { className?: string }) => {
  return <div className={`rounded-full border h-4 w-4 ${className}`} />;
};

const Truck = ({ className }: { className?: string }) => {
  return <div className={className}>🚚</div>;
};