import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarClock,
  Contact2,
  DollarSign,
  Filter,
  MoreHorizontal,
  Package2,
  Plus,
  Search,
  ShoppingBag,
  Store,
  Tag,
  Users
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ClientType, 
  ClientSource,
  ClientStatus,
  PurchaseType, 
  ShippingPreference,
  ServiceFrequency,
  BillingType,
  VisitFrequency,
  LoyaltyStatus
} from '@/components/ClientManagementSystem';

// Sample client data
const sampleClients = [
  {
    id: "1",
    name: "Jane Cooper",
    companyName: "Cooper Industries",
    email: "jane.cooper@example.com",
    phone: "+1 (555) 123-4567",
    type: ClientType.BUSINESS,
    source: ClientSource.WEBSITE,
    status: ClientStatus.ACTIVE,
    createdAt: new Date("2023-01-15").toISOString(),
    entityName: "Digital Merch Pros",
    lifetime_value: 12500,
    avatarUrl: "",
    tags: ["premium", "enterprise"],
    serviceClient: {
      serviceTypes: ["Web Design", "Social Media"],
      serviceFrequency: ServiceFrequency.MONTHLY,
      billingType: BillingType.RETAINER,
      contractStartDate: new Date("2023-01-20").toISOString(),
      retainerAmount: 2500,
      projectHistory: [
        { 
          id: "p1", 
          name: "Website Redesign", 
          startDate: new Date("2023-02-01").toISOString(), 
          endDate: new Date("2023-03-15").toISOString(), 
          status: "completed", 
          value: 7500 
        }
      ]
    }
  },
  {
    id: "2",
    name: "Devon Lane",
    email: "devon.lane@example.com",
    phone: "+1 (555) 987-6543",
    type: ClientType.INDIVIDUAL,
    source: ClientSource.REFERRAL,
    status: ClientStatus.ACTIVE,
    createdAt: new Date("2023-03-10").toISOString(),
    entityName: "Lone Star Custom Clothing",
    lifetime_value: 850,
    avatarUrl: "",
    tags: ["returning"],
    productClient: {
      preferredCategories: ["Apparel", "Accessories"],
      preferredProducts: ["Custom T-shirts", "Hats"],
      purchaseTypes: [PurchaseType.ONLINE],
      shippingPreference: ShippingPreference.STANDARD,
      lastPurchaseDate: new Date("2023-06-15").toISOString(),
      totalOrders: 4,
      averageOrderValue: 212.50
    }
  },
  {
    id: "3",
    name: "Esther Howard",
    companyName: "Howard LLC",
    email: "esther.howard@example.com",
    phone: "+1 (555) 456-7890",
    type: ClientType.BUSINESS,
    source: ClientSource.MARKETPLACE,
    status: ClientStatus.VIP,
    createdAt: new Date("2022-11-05").toISOString(),
    entityName: "Alcoeaze",
    lifetime_value: 23750,
    avatarUrl: "",
    tags: ["wholesale", "premium"],
    productClient: {
      preferredCategories: ["Beverages", "Merchandise"],
      purchaseTypes: [PurchaseType.WHOLESALE],
      totalOrders: 12,
      averageOrderValue: 1979.17
    }
  },
  {
    id: "4",
    name: "Cameron Williamson",
    email: "cameron.williamson@example.com",
    phone: "+1 (555) 234-5678",
    type: ClientType.INDIVIDUAL,
    source: ClientSource.WALK_IN,
    status: ClientStatus.ACTIVE,
    createdAt: new Date("2023-05-22").toISOString(),
    entityName: "Hide Cafe Bars",
    lifetime_value: 345,
    avatarUrl: "",
    tags: ["local"],
    physicalClient: {
      visitFrequency: VisitFrequency.REGULAR,
      loyaltyStatus: LoyaltyStatus.SILVER,
      loyaltyPoints: 450,
      preferredLocation: "Downtown",
      lastVisitDate: new Date("2023-06-28").toISOString(),
      visitHistory: [
        { 
          date: new Date("2023-06-28").toISOString(), 
          location: "Downtown", 
          purpose: "Coffee and Pastry", 
          spend: 15 
        },
        { 
          date: new Date("2023-06-21").toISOString(), 
          location: "Downtown", 
          purpose: "Lunch", 
          spend: 32 
        }
      ]
    }
  },
  {
    id: "5",
    name: "Brooklyn Simmons",
    companyName: "Simmons Crafts",
    email: "brooklyn.simmons@example.com",
    phone: "+1 (555) 876-5432",
    type: ClientType.BUSINESS,
    source: ClientSource.SOCIAL_MEDIA,
    status: ClientStatus.LEAD,
    createdAt: new Date("2023-06-30").toISOString(),
    entityName: "Digital Merch Pros",
    lifetime_value: 0,
    avatarUrl: "",
    tags: ["prospect", "new"]
  }
];

type ClientTabsType = "all" | "agency" | "product" | "physical" | "leads";

export default function ClientManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ClientTabsType>("all");
  const [openNewClientDialog, setOpenNewClientDialog] = useState(false);
  const [clientType, setClientType] = useState<ClientType>(ClientType.BUSINESS);
  
  // Fetch clients - we're using mock data for now
  const { data: clientsData } = useQuery({
    queryKey: ['/api/clients'],
    queryFn: async () => {
      // In a real implementation, this would be an API call
      return { clients: sampleClients };
    },
  });

  const clients = clientsData?.clients || [];
  
  // Filter clients based on search query and active tab
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      searchQuery === "" || 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (client.companyName && client.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Filter by tab
    switch(activeTab) {
      case "agency":
        return client.entityName === "Digital Merch Pros";
      case "product":
        return client.entityName === "Alcoeaze" || client.entityName === "Lone Star Custom Clothing";
      case "physical":
        return client.entityName === "Hide Cafe Bars";
      case "leads":
        return client.status === ClientStatus.LEAD;
      case "all":
      default:
        return true;
    }
  });

  // Client type selector based on service type
  const getClientTypeTag = (client: any) => {
    if (client.serviceClient) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Users className="h-3 w-3 mr-1" />
          Service
        </Badge>
      );
    } else if (client.productClient) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Package2 className="h-3 w-3 mr-1" />
          Product
        </Badge>
      );
    } else if (client.physicalClient) {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          <Store className="h-3 w-3 mr-1" />
          Physical
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
        <Contact2 className="h-3 w-3 mr-1" />
        General
      </Badge>
    );
  };

  // Get client status badge
  const getStatusBadge = (status: ClientStatus) => {
    switch(status) {
      case ClientStatus.ACTIVE:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case ClientStatus.LEAD:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Lead</Badge>;
      case ClientStatus.VIP:
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">VIP</Badge>;
      case ClientStatus.INACTIVE:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      case ClientStatus.CHURNED:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Churned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout title="Client Management" description="Manage your clients across all business entities">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" onClick={() => setOpenNewClientDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as ClientTabsType)}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
            <TabsTrigger value="all">All Clients</TabsTrigger>
            <TabsTrigger value="agency">Agency</TabsTrigger>
            <TabsTrigger value="product">Product</TabsTrigger>
            <TabsTrigger value="physical">Physical</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <ClientsTable 
              clients={filteredClients} 
              getClientTypeTag={getClientTypeTag} 
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
          
          <TabsContent value="agency" className="mt-0">
            <ClientsTable 
              clients={filteredClients} 
              getClientTypeTag={getClientTypeTag} 
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
          
          <TabsContent value="product" className="mt-0">
            <ClientsTable 
              clients={filteredClients} 
              getClientTypeTag={getClientTypeTag} 
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
          
          <TabsContent value="physical" className="mt-0">
            <ClientsTable 
              clients={filteredClients} 
              getClientTypeTag={getClientTypeTag} 
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
          
          <TabsContent value="leads" className="mt-0">
            <ClientsTable 
              clients={filteredClients} 
              getClientTypeTag={getClientTypeTag} 
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* New Client Dialog */}
      <Dialog open={openNewClientDialog} onOpenChange={setOpenNewClientDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter the client's details. You can add more information later.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="firstName">Name</Label>
                <Input id="name" placeholder="Client name" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Company name (if applicable)" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="client@example.com" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Phone number" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="type">Client Type</Label>
                <Select defaultValue={ClientType.BUSINESS} onValueChange={(value) => setClientType(value as ClientType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ClientType.INDIVIDUAL}>Individual</SelectItem>
                    <SelectItem value={ClientType.BUSINESS}>Business</SelectItem>
                    <SelectItem value={ClientType.GOVERNMENT}>Government</SelectItem>
                    <SelectItem value={ClientType.NONPROFIT}>Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="source">Source</Label>
                <Select defaultValue={ClientSource.WEBSITE}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ClientSource.WEBSITE}>Website</SelectItem>
                    <SelectItem value={ClientSource.REFERRAL}>Referral</SelectItem>
                    <SelectItem value={ClientSource.SOCIAL_MEDIA}>Social Media</SelectItem>
                    <SelectItem value={ClientSource.MARKETPLACE}>Marketplace</SelectItem>
                    <SelectItem value={ClientSource.COLD_OUTREACH}>Cold Outreach</SelectItem>
                    <SelectItem value={ClientSource.EVENT}>Event</SelectItem>
                    <SelectItem value={ClientSource.WALK_IN}>Walk-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="businessEntity">Business Entity</Label>
              <Select defaultValue="digital-merch-pros">
                <SelectTrigger>
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital-merch-pros">Digital Merch Pros</SelectItem>
                  <SelectItem value="mystery-hype">Mystery Hype</SelectItem>
                  <SelectItem value="lone-star">Lone Star Custom Clothing</SelectItem>
                  <SelectItem value="alcoeaze">Alcoeaze</SelectItem>
                  <SelectItem value="hide-cafe">Hide Cafe Bars</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" placeholder="Enter tags separated by commas (premium, wholesale, etc.)" />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Any additional information about the client" />
            </div>
            
            {/* Conditional fields based on client type */}
            {clientType === ClientType.BUSINESS && (
              <div className="border rounded-md p-3 space-y-3">
                <h4 className="text-sm font-medium">Business Specific Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" placeholder="Client's industry" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="employees">Number of Employees</Label>
                    <Input id="employees" type="number" placeholder="Approx. number" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenNewClientDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpenNewClientDialog(false)}>
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

// Clients table component
function ClientsTable({ 
  clients, 
  getClientTypeTag, 
  getStatusBadge 
}: { 
  clients: any[], 
  getClientTypeTag: (client: any) => React.ReactNode, 
  getStatusBadge: (status: ClientStatus) => React.ReactNode 
}) {
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
  
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString();
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Lifetime Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Users className="h-8 w-8 mb-2" />
                    <p>No clients found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id} className="group">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={client.avatarUrl || ""} alt={client.name} />
                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        {client.companyName && (
                          <div className="text-sm text-muted-foreground">{client.companyName}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-sm">{client.entityName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getClientTypeTag(client)}</TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarClock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span className="text-sm">{formatDate(client.createdAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <DollarSign className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span className="text-sm font-medium">{formatCurrency(client.lifetime_value)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>Add Note</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Delete Client</DropdownMenuItem>
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
  );
}