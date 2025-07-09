import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Avatar,
  AvatarFallback,
  AvatarImage 
} from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Clock,
  Filter,
  MailPlus,
  MessageCircle,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Send,
  ShoppingBag,
  Tag,
  User,
  Mail,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Clock4,
  StarIcon,
  MoreHorizontal,
  Paperclip,
  ListFilter,
  ExternalLink,
  HelpCircle,
  RotateCw,
  ShieldCheck,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Define types
interface CustomerInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  tags?: string[];
  orders?: number;
  totalSpent?: number;
  lastOrder?: string;
  firstOrder?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  marketingConsent?: boolean;
  entityId?: number;
  entityName?: string;
}

interface Agent {
  id: string;
  name: string;
  avatar?: string | null;
  email: string;
}

interface Message {
  id: string;
  body: string;
  createdAt: string;
  from: {
    name: string;
    email: string;
    type: "customer" | "agent" | "system";
  };
  attachments?: {
    filename: string;
    url: string;
    contentType: string;
    size: number;
  }[];
}

interface ResponseTimeMetric {
  current: string; // formatted as "2h 14m"
  target: string;
  percentChange: number;
  improved: boolean;
  percentageOfTarget: number;
}

interface EntityResponseTimes {
  entityId: number;
  entityName: string;
  tickets: string;
  social: string;
  email: string;
  ticketsPercentage: number;
  socialPercentage: number;
  emailPercentage: number;
}

interface SupportQualityMetric {
  current: number; // percentage
  target: number;
  percentChange?: number;
  improved?: boolean;
}

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "pending" | "solved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  channel: "email" | "chat" | "phone" | "website" | "whatsapp" | "other";
  createdAt: string;
  updatedAt: string;
  customer: CustomerInfo;
  assignedTo?: Agent;
  messages: Message[];
  tags?: string[];
  entityId?: number;
  entityName?: string;
}

// Get formatted date
const getFormattedDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return "Just now";
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/10";
    case "pending":
      return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/10";
    case "solved":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/10";
    case "closed":
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/10";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/10";
  }
};

// Get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/10";
    case "medium":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/10";
    case "high":
      return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/10";
    case "urgent":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/10";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/10";
  }
};

// Get channel icon
const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "email":
      return <Mail className="h-4 w-4" />;
    case "chat":
      return <MessageSquare className="h-4 w-4" />;
    case "phone":
      return <Phone className="h-4 w-4" />;
    case "website":
      return <ExternalLink className="h-4 w-4" />;
    case "whatsapp":
      return <MessageCircle className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

// Get entity color
const getEntityColor = (entityId?: number) => {
  const colors = [
    "bg-purple-500/10 text-purple-500",
    "bg-indigo-500/10 text-indigo-500",
    "bg-blue-500/10 text-blue-500",
    "bg-green-500/10 text-green-500",
    "bg-amber-500/10 text-amber-500",
  ];
  
  return colors[(entityId || 0) % colors.length];
};

// Ticket Preview Component
function TicketPreview({ 
  ticket, 
  isSelected, 
  onSelect
}: { 
  ticket: Ticket, 
  isSelected: boolean, 
  onSelect: () => void 
}) {
  return (
    <div 
      className={cn(
        "border-b cursor-pointer transition-colors", 
        isSelected ? "bg-muted/50" : "hover:bg-muted/20"
      )}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={cn("font-normal", getStatusColor(ticket.status))}
            >
              {ticket.status}
            </Badge>
            <Badge 
              variant="secondary" 
              className={cn("font-normal", getPriorityColor(ticket.priority))}
            >
              {ticket.priority}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            {getFormattedDate(ticket.updatedAt)}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="gap-1 font-normal">
            {getChannelIcon(ticket.channel)}
            <span className="capitalize">{ticket.channel}</span>
          </Badge>
          
          {ticket.entityId && (
            <Badge variant="outline" className={cn("gap-1 font-normal", getEntityColor(ticket.entityId))}>
              <Building className="h-3 w-3" />
              <span>{ticket.entityName}</span>
            </Badge>
          )}
        </div>
        
        <h4 className="text-sm font-medium mb-1 truncate">{ticket.subject}</h4>
        
        <div className="flex items-center gap-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={ticket.customer.avatar || undefined} />
            <AvatarFallback className="text-xs">
              {ticket.customer.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-xs truncate">{ticket.customer.name}</div>
        </div>
        
        {ticket.assignedTo && (
          <div className="flex items-center gap-2 mt-1">
            <div className="w-5"></div>
            <div className="text-xs text-muted-foreground">
              Assigned to {ticket.assignedTo.name}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Message Item Component
function MessageItem({ message, isLastMessage }: { message: Message, isLastMessage: boolean }) {
  const isCustomer = message.from.type === "customer";
  const isSystem = message.from.type === "system";
  
  return (
    <div className={cn(
      "mb-4 last:mb-0",
      isLastMessage ? "animate-pulse-once" : ""
    )}>
      <div className="flex items-start gap-2 mb-1.5">
        <Avatar className="h-6 w-6">
          <AvatarImage src={undefined} />
          <AvatarFallback className={cn(
            "text-xs",
            isCustomer ? "bg-amber-100 text-amber-700" :
            isSystem ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
          )}>
            {message.from.name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">
              {message.from.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {getFormattedDate(message.createdAt)}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {isCustomer ? "Customer" : isSystem ? "System" : "Agent"}
          </div>
        </div>
      </div>
      
      <div className="ml-8 text-sm whitespace-pre-wrap">
        {message.body}
      </div>
      
      {message.attachments && message.attachments.length > 0 && (
        <div className="ml-8 mt-2 space-y-2">
          {message.attachments.map((attachment, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 p-2 border rounded-md text-xs"
            >
              <Paperclip className="h-3 w-3 text-muted-foreground" />
              <div className="flex-1 truncate">{attachment.filename}</div>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Ticket Detail Component
function TicketDetail({ 
  ticket,
  onBack
}: { 
  ticket: Ticket,
  onBack: () => void
}) {
  const [reply, setReply] = useState("");
  
  // Get customer order history component
  const CustomerOrderHistory = ({ customer }: { customer: CustomerInfo }) => {
    if (!customer.orders) return null;
    
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="font-medium text-sm">Orders</div>
          <Badge>{customer.orders}</Badge>
        </div>
        
        <div className="text-sm">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Total spent</span>
            <span className="font-medium">${customer.totalSpent?.toFixed(2) || '0.00'}</span>
          </div>
          
          {customer.lastOrder && (
            <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
              <span>Last order</span>
              <span>{new Date(customer.lastOrder).toLocaleDateString()}</span>
            </div>
          )}
          
          {customer.firstOrder && (
            <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
              <span>First order</span>
              <span>{new Date(customer.firstOrder).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Handle reply submission
  const handleSubmitReply = () => {
    if (!reply.trim()) return;
    
    // In a real app, this would make an API call to submit the reply
    toast({
      title: "Reply sent",
      description: "Your reply has been added to the ticket.",
    });
    
    setReply("");
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Ticket header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="md:hidden">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div>
            <h3 className="text-base font-medium">{ticket.subject}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Ticket #{ticket.id.replace('ticket-', '')}</span>
              <span>•</span>
              <span>Created {getFormattedDate(ticket.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select defaultValue={ticket.status}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="solved">Solved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Ticket content */}
      <div className="flex-1 flex">
        {/* Messages */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            {ticket.messages.map((message, index) => (
              <MessageItem 
                key={message.id}
                message={message}
                isLastMessage={index === ticket.messages.length - 1}
              />
            ))}
          </ScrollArea>
          
          {/* Reply form */}
          <div className="border-t p-4">
            <div className="flex flex-col gap-3">
              <Textarea
                placeholder="Type your reply here..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="min-h-[100px]"
              />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4 mr-1" />
                    Attach
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <MailPlus className="h-4 w-4 mr-1" />
                    Templates
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select defaultValue="agent">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Reply as" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">Reply as Agent</SelectItem>
                      <SelectItem value="private">Private Note</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={handleSubmitReply} disabled={!reply.trim()}>
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Customer sidebar */}
        <div className="w-64 border-l hidden lg:block">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarImage src={ticket.customer.avatar || undefined} />
                  <AvatarFallback className="text-xl">
                    {ticket.customer.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center">
                  <h4 className="font-medium">{ticket.customer.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {ticket.customer.email}
                  </p>
                </div>
              </div>
              
              <Separator className="mb-4" />
              
              {/* Customer details */}
              <div className="space-y-4">
                {ticket.customer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{ticket.customer.phone}</span>
                  </div>
                )}
                
                {ticket.customer.location && (
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-sm">
                      {ticket.customer.location.city && (
                        <div>{ticket.customer.location.city}</div>
                      )}
                      {ticket.customer.location.state && ticket.customer.location.country && (
                        <div>{ticket.customer.location.state}, {ticket.customer.location.country}</div>
                      )}
                    </div>
                  </div>
                )}
                
                {ticket.customer.tags && ticket.customer.tags.length > 0 && (
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {ticket.customer.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Separator className="my-4" />
              
              {/* Customer order information */}
              <CustomerOrderHistory customer={ticket.customer} />
              
              <Separator className="my-4" />
              
              {/* Other ticket information */}
              <div className="space-y-4">
                <div>
                  <div className="font-medium text-sm mb-2">Ticket Tags</div>
                  {ticket.tags && ticket.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {ticket.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">No tags</div>
                  )}
                </div>
                
                <div>
                  <div className="font-medium text-sm mb-2">Assignment</div>
                  {ticket.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={ticket.assignedTo.avatar || undefined} />
                        <AvatarFallback className="text-xs">
                          {ticket.assignedTo.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{ticket.assignedTo.name}</span>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">Unassigned</div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

// Main component
export default function GorgiasIntegration() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  
  // Define API response interfaces
  interface TicketsResponse {
    tickets: Ticket[];
  }
  
  interface EntitiesResponse {
    entities: Array<{id: number, name: string}>;
  }
  
  // Fetch tickets and entities
  const { data: ticketsData, isLoading: isLoadingTickets } = useQuery<TicketsResponse, Error, TicketsResponse, any[]>({
    queryKey: ['/api/tickets'],
  });
  
  const { data: entitiesData } = useQuery<EntitiesResponse, Error, EntitiesResponse, any[]>({
    queryKey: ['/api/business-entities'],
  });
  
  // Handle loading state
  const tickets: Ticket[] = ticketsData?.tickets || [];
  const entities = entitiesData?.entities || [];
  
  // Get selected ticket
  const selectedTicket = selectedTicketId 
    ? tickets.find(ticket => ticket.id === selectedTicketId)
    : null;
    
  // Filter tickets based on search query and filters
  const filteredTickets = tickets.filter(ticket => {
    // Filter by search query
    const matchesSearch = searchQuery 
      ? ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    // Filter by status
    const matchesStatus = statusFilter === "all" 
      ? true 
      : ticket.status === statusFilter;
      
    // Filter by entity
    const matchesEntity = entityFilter === "all"
      ? true
      : ticket.entityId?.toString() === entityFilter;
      
    return matchesSearch && matchesStatus && matchesEntity;
  });
  
  // Handle creating a new ticket
  const handleCreateTicket = () => {
    toast({
      title: "Feature coming soon",
      description: "The ability to create new tickets will be available in a future update.",
    });
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="container py-6 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customer Support</h1>
            <p className="text-muted-foreground">
              View and manage all customer service tickets
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={handleCreateTicket}>
              <MailPlus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>
        
        <div className="border rounded-lg flex-1 flex flex-col">
          <Tabs defaultValue="all" className="flex-1 flex flex-col">
            <div className="border-b p-2">
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger value="all">All Tickets</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="solved">Solved</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-4 border-b flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tickets..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="solved">Solved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={entityFilter} 
                  onValueChange={setEntityFilter}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    {entities.map(entity => (
                      <SelectItem key={entity.id} value={entity.id.toString()}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TabsContent value="all" className="p-0 flex-1 flex">
              <div className={cn(
                "w-full md:w-96 md:border-r",
                selectedTicket ? "hidden md:block" : "block"
              )}>
                {isLoadingTickets ? (
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
                    <p className="text-muted-foreground">Loading tickets...</p>
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mb-4" />
                    <p className="font-medium mb-1">No tickets found</p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-18rem)]">
                    {filteredTickets.map(ticket => (
                      <TicketPreview
                        key={ticket.id}
                        ticket={ticket}
                        isSelected={selectedTicketId === ticket.id}
                        onSelect={() => setSelectedTicketId(ticket.id)}
                      />
                    ))}
                  </ScrollArea>
                )}
              </div>
              
              <div className={cn(
                "flex-1",
                selectedTicket ? "block" : "hidden md:flex md:items-center md:justify-center"
              )}>
                {selectedTicket ? (
                  <TicketDetail 
                    ticket={selectedTicket} 
                    onBack={() => setSelectedTicketId(null)}
                  />
                ) : (
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="font-medium mb-1">No ticket selected</p>
                    <p className="text-sm text-muted-foreground max-w-md mb-4">
                      Select a ticket from the list to view and respond to customer communications
                    </p>
                    
                    <Button variant="outline" onClick={handleCreateTicket}>
                      <MailPlus className="h-4 w-4 mr-2" />
                      Create New Ticket
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="open" className="flex-1 flex">
              {/* This would display only open tickets */}
              <div className="flex-1 flex items-center justify-center p-8 text-center">
                <div>
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium mb-1">Open Tickets View</p>
                  <p className="text-sm text-muted-foreground">
                    This view would show only open tickets
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="flex-1 flex">
              {/* This would display only pending tickets */}
              <div className="flex-1 flex items-center justify-center p-8 text-center">
                <div>
                  <Clock4 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium mb-1">Pending Tickets View</p>
                  <p className="text-sm text-muted-foreground">
                    This view would show only pending tickets
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="solved" className="flex-1 flex">
              {/* This would display only solved tickets */}
              <div className="flex-1 flex items-center justify-center p-8 text-center">
                <div>
                  <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium mb-1">Solved Tickets View</p>
                  <p className="text-sm text-muted-foreground">
                    This view would show only solved tickets
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="flex-1 overflow-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-6">Support Response Metrics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Ticket Response Time */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-lg">
                        <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                        Ticket Response Time
                      </CardTitle>
                      <CardDescription>Average time to first response</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">2h 14m</div>
                      <div className="flex items-center text-sm text-green-600 mb-4">
                        <ArrowRight className="h-4 w-4 mr-1 rotate-[-45deg]" />
                        <span>12% faster than last week</span>
                      </div>
                      <Progress value={78} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Target: 3h</span>
                        <span>Current: 2h 14m</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Social Media Response Time */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-lg">
                        <MessageCircle className="h-5 w-5 mr-2 text-indigo-500" />
                        Social Media Response
                      </CardTitle>
                      <CardDescription>Average time to respond on social platforms</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">37m</div>
                      <div className="flex items-center text-sm text-amber-600 mb-4">
                        <ArrowRight className="h-4 w-4 mr-1 rotate-[45deg]" />
                        <span>8% slower than last week</span>
                      </div>
                      <Progress value={65} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Target: 30m</span>
                        <span>Current: 37m</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Email Response Time */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-lg">
                        <Mail className="h-5 w-5 mr-2 text-purple-500" />
                        Email Response Time
                      </CardTitle>
                      <CardDescription>Average time to respond to emails</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">4h 32m</div>
                      <div className="flex items-center text-sm text-green-600 mb-4">
                        <ArrowRight className="h-4 w-4 mr-1 rotate-[-45deg]" />
                        <span>22% faster than last week</span>
                      </div>
                      <Progress value={85} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Target: 6h</span>
                        <span>Current: 4h 32m</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <h4 className="text-lg font-medium mb-4">Response Time Breakdown by Entity</h4>
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {entities.map((entity, index) => (
                    <Card key={entity.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{entity.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Tickets</span>
                              <span className="font-medium">{2 + index}h {(10 + index * 8)}m</span>
                            </div>
                            <Progress value={80 - (index * 10)} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Social</span>
                              <span className="font-medium">{index < 2 ? `${20 + index * 15}m` : `1h ${index * 5}m`}</span>
                            </div>
                            <Progress value={75 - (index * 8)} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Email</span>
                              <span className="font-medium">{4 + (index % 3)}h {(15 + index * 10)}m</span>
                            </div>
                            <Progress value={90 - (index * 7)} className="h-1.5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <h4 className="text-lg font-medium mb-4">Support Quality Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Customer Satisfaction</CardTitle>
                      <CardDescription>Based on post-resolution surveys</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-2">92%</div>
                      <Progress value={92} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Target: 90%</span>
                        <span>Current: 92%</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">First Contact Resolution</CardTitle>
                      <CardDescription>Issues resolved in first interaction</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-2">78%</div>
                      <Progress value={78} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Target: 80%</span>
                        <span>Current: 78%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}