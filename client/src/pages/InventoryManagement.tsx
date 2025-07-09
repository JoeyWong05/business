import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  AlertTriangle,
  ArrowUpDown,
  BarChart3,
  Box,
  Boxes,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  DollarSign,
  FilterX,
  History,
  Package2,
  PackagePlus,
  Percent,
  Plus,
  RefreshCcw,
  Search,
  ShoppingCart,
  Tag,
  Truck
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

// Inventory item types
enum ProductCategory {
  APPAREL = 'apparel',
  BEVERAGES = 'beverages',
  FOOD = 'food',
  ACCESSORIES = 'accessories',
  MERCHANDISE = 'merchandise',
  PACKAGING = 'packaging',
  SUPPLIES = 'supplies',
  RAW_MATERIALS = 'raw_materials',
  EQUIPMENT = 'equipment'
}

enum StockStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
  BACKORDERED = 'backordered',
  ON_ORDER = 'on_order'
}

enum StorageLocation {
  WAREHOUSE = 'warehouse',
  STORE_FRONT = 'store_front',
  PRODUCTION = 'production',
  SUPPLIER = 'supplier',
  TRANSIT = 'in_transit'
}

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: ProductCategory;
  status: StockStatus;
  quantity: number;
  reorderPoint: number;
  costPrice: number;
  sellingPrice: number;
  location: StorageLocation;
  supplier: string;
  lastRestocked: string; // ISO date string
  minimumOrderQuantity: number;
  leadTime: number; // in days
  tags: string[];
  imageUrl?: string;
  entityId: number;
  entityName: string;
}

// Mock inventory data
const sampleInventory: InventoryItem[] = [
  {
    id: "1",
    sku: "TS-BLK-M",
    name: "Black T-Shirt (Medium)",
    description: "Classic black cotton t-shirt, medium size",
    category: ProductCategory.APPAREL,
    status: StockStatus.IN_STOCK,
    quantity: 35,
    reorderPoint: 15,
    costPrice: 8.50,
    sellingPrice: 19.99,
    location: StorageLocation.WAREHOUSE,
    supplier: "Premium Textiles Inc.",
    lastRestocked: "2023-06-15T10:30:00Z",
    minimumOrderQuantity: 50,
    leadTime: 7,
    tags: ["bestseller", "evergreen"],
    entityId: 3,
    entityName: "Lone Star Custom Clothing"
  },
  {
    id: "2",
    sku: "TS-BLK-L",
    name: "Black T-Shirt (Large)",
    description: "Classic black cotton t-shirt, large size",
    category: ProductCategory.APPAREL,
    status: StockStatus.LOW_STOCK,
    quantity: 12,
    reorderPoint: 15,
    costPrice: 8.50,
    sellingPrice: 19.99,
    location: StorageLocation.WAREHOUSE,
    supplier: "Premium Textiles Inc.",
    lastRestocked: "2023-06-15T10:30:00Z",
    minimumOrderQuantity: 50,
    leadTime: 7,
    tags: ["bestseller", "evergreen"],
    entityId: 3,
    entityName: "Lone Star Custom Clothing"
  },
  {
    id: "3",
    sku: "HC-ESP-250",
    name: "Espresso Coffee Beans (250g)",
    description: "Premium espresso coffee beans, medium roast",
    category: ProductCategory.BEVERAGES,
    status: StockStatus.IN_STOCK,
    quantity: 48,
    reorderPoint: 20,
    costPrice: 5.75,
    sellingPrice: 12.99,
    location: StorageLocation.STORE_FRONT,
    supplier: "Java Imports Co.",
    lastRestocked: "2023-07-01T14:15:00Z",
    minimumOrderQuantity: 24,
    leadTime: 5,
    tags: ["coffee", "house-blend"],
    entityId: 5,
    entityName: "Hide Cafe Bars"
  },
  {
    id: "4",
    sku: "AZ-LAGER-12PK",
    name: "Craft Lager 12-Pack",
    description: "Premium craft lager, pack of 12 x 330ml cans",
    category: ProductCategory.BEVERAGES,
    status: StockStatus.OUT_OF_STOCK,
    quantity: 0,
    reorderPoint: 10,
    costPrice: 15.60,
    sellingPrice: 28.99,
    location: StorageLocation.WAREHOUSE,
    supplier: "Craft Brew Distributors",
    lastRestocked: "2023-05-10T09:45:00Z",
    minimumOrderQuantity: 10,
    leadTime: 4,
    tags: ["beer", "alcohol", "premium"],
    entityId: 4,
    entityName: "Alcoeaze"
  },
  {
    id: "5",
    sku: "AZ-IPA-12PK",
    name: "IPA 12-Pack",
    description: "Hoppy India Pale Ale, pack of 12 x 330ml cans",
    category: ProductCategory.BEVERAGES,
    status: StockStatus.LOW_STOCK,
    quantity: 8,
    reorderPoint: 10,
    costPrice: 16.80,
    sellingPrice: 32.99,
    location: StorageLocation.WAREHOUSE,
    supplier: "Craft Brew Distributors",
    lastRestocked: "2023-05-20T09:45:00Z",
    minimumOrderQuantity: 10,
    leadTime: 4,
    tags: ["beer", "alcohol", "premium"],
    entityId: 4,
    entityName: "Alcoeaze"
  },
  {
    id: "6",
    sku: "CAP-SNAP-BLK",
    name: "Black Snapback Cap",
    description: "Adjustable black snapback cap with embroidered logo",
    category: ProductCategory.APPAREL,
    status: StockStatus.IN_STOCK,
    quantity: 25,
    reorderPoint: 10,
    costPrice: 7.25,
    sellingPrice: 24.99,
    location: StorageLocation.STORE_FRONT,
    supplier: "HeadGear Suppliers",
    lastRestocked: "2023-06-28T11:00:00Z",
    minimumOrderQuantity: 20,
    leadTime: 10,
    tags: ["headwear", "accessories"],
    entityId: 3,
    entityName: "Lone Star Custom Clothing"
  },
  {
    id: "7",
    sku: "HC-MUFFIN-BLUEBERRY",
    name: "Blueberry Muffin",
    description: "Freshly baked blueberry muffin",
    category: ProductCategory.FOOD,
    status: StockStatus.IN_STOCK,
    quantity: 15,
    reorderPoint: 5,
    costPrice: 1.25,
    sellingPrice: 3.99,
    location: StorageLocation.STORE_FRONT,
    supplier: "In-house Bakery",
    lastRestocked: "2023-07-12T06:30:00Z",
    minimumOrderQuantity: 12,
    leadTime: 1,
    tags: ["bakery", "pastry", "fresh"],
    entityId: 5,
    entityName: "Hide Cafe Bars"
  },
  {
    id: "8",
    sku: "AZ-STOUT-12PK",
    name: "Chocolate Stout 12-Pack",
    description: "Rich chocolate stout, pack of 12 x 330ml bottles",
    category: ProductCategory.BEVERAGES,
    status: StockStatus.ON_ORDER,
    quantity: 0,
    reorderPoint: 8,
    costPrice: 18.00,
    sellingPrice: 34.99,
    location: StorageLocation.TRANSIT,
    supplier: "Craft Brew Distributors",
    lastRestocked: "2023-04-15T10:15:00Z",
    minimumOrderQuantity: 8,
    leadTime: 6,
    tags: ["beer", "alcohol", "premium", "seasonal"],
    entityId: 4,
    entityName: "Alcoeaze"
  },
  {
    id: "9",
    sku: "HC-SYRUP-VANILLA",
    name: "Vanilla Syrup",
    description: "Premium vanilla flavoring syrup for coffee drinks",
    category: ProductCategory.SUPPLIES,
    status: StockStatus.LOW_STOCK,
    quantity: 3,
    reorderPoint: 5,
    costPrice: 4.50,
    sellingPrice: 0, // Not sold directly
    location: StorageLocation.STORE_FRONT,
    supplier: "Barista Supplies Co.",
    lastRestocked: "2023-06-05T15:30:00Z",
    minimumOrderQuantity: 6,
    leadTime: 3,
    tags: ["coffee", "ingredients", "syrup"],
    entityId: 5,
    entityName: "Hide Cafe Bars"
  },
  {
    id: "10",
    sku: "MKT-TOTE-ECO",
    name: "Eco-friendly Tote Bag",
    description: "Branded eco-friendly canvas tote bag",
    category: ProductCategory.MERCHANDISE,
    status: StockStatus.IN_STOCK,
    quantity: 75,
    reorderPoint: 25,
    costPrice: 3.75,
    sellingPrice: 12.99,
    location: StorageLocation.WAREHOUSE,
    supplier: "Green Merchandise Ltd.",
    lastRestocked: "2023-06-20T13:45:00Z",
    minimumOrderQuantity: 100,
    leadTime: 14,
    tags: ["eco-friendly", "merchandise", "gift"],
    entityId: 1,
    entityName: "Digital Merch Pros"
  }
];

// Tab types
type InventoryTabType = "all" | "low-stock" | "apparel" | "beverages" | "food";

export default function InventoryManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<InventoryTabType>("all");
  const [openNewItemDialog, setOpenNewItemDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(ProductCategory.APPAREL);
  
  // Fetch inventory - using mock data for now
  const { data: inventoryData } = useQuery({
    queryKey: ['/api/inventory'],
    queryFn: async () => {
      // In a real implementation, this would be an API call
      return { items: sampleInventory };
    },
  });

  const inventoryItems = inventoryData?.items || [];
  
  // Filter inventory items based on search query and active tab
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Filter by tab
    switch(activeTab) {
      case "low-stock":
        return item.status === StockStatus.LOW_STOCK || item.status === StockStatus.OUT_OF_STOCK;
      case "apparel":
        return item.category === ProductCategory.APPAREL;
      case "beverages":
        return item.category === ProductCategory.BEVERAGES;
      case "food":
        return item.category === ProductCategory.FOOD;
      case "all":
      default:
        return true;
    }
  });

  // Get stock status badge
  const getStatusBadge = (status: StockStatus) => {
    switch(status) {
      case StockStatus.IN_STOCK:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>;
      case StockStatus.LOW_STOCK:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Low Stock</Badge>;
      case StockStatus.OUT_OF_STOCK:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Out of Stock</Badge>;
      case StockStatus.ON_ORDER:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">On Order</Badge>;
      case StockStatus.BACKORDERED:
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Backordered</Badge>;
      case StockStatus.DISCONTINUED:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Discontinued</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Category badge styling
  const getCategoryBadge = (category: ProductCategory) => {
    switch(category) {
      case ProductCategory.APPAREL:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Package2 className="h-3 w-3 mr-1" />
            Apparel
          </Badge>
        );
      case ProductCategory.BEVERAGES:
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Package2 className="h-3 w-3 mr-1" />
            Beverages
          </Badge>
        );
      case ProductCategory.FOOD:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Package2 className="h-3 w-3 mr-1" />
            Food
          </Badge>
        );
      case ProductCategory.ACCESSORIES:
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            <Package2 className="h-3 w-3 mr-1" />
            Accessories
          </Badge>
        );
      case ProductCategory.MERCHANDISE:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Package2 className="h-3 w-3 mr-1" />
            Merchandise
          </Badge>
        );
      case ProductCategory.SUPPLIES:
        return (
          <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
            <Package2 className="h-3 w-3 mr-1" />
            Supplies
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Package2 className="h-3 w-3 mr-1" />
            {category}
          </Badge>
        );
    }
  };

  // Dashboard cards
  const inventoryStats = {
    totalItems: inventoryItems.length,
    totalValue: inventoryItems.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0),
    lowStockItems: inventoryItems.filter(item => item.status === StockStatus.LOW_STOCK).length,
    outOfStockItems: inventoryItems.filter(item => item.status === StockStatus.OUT_OF_STOCK).length,
    alertItems: inventoryItems.filter(item => item.quantity <= item.reorderPoint).length
  };

  return (
    <MainLayout title="Inventory Management" description="Manage your product inventory across all business entities">
      <div className="space-y-6">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${inventoryStats.totalValue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {inventoryStats.totalItems} items
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inventoryStats.lowStockItems}
              </div>
              <p className="text-xs text-muted-foreground">
                {inventoryStats.outOfStockItems} items out of stock
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Reorder Alerts</CardTitle>
              <RefreshCcw className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inventoryStats.alertItems}
              </div>
              <p className="text-xs text-muted-foreground">
                Items below reorder point
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </Button>
            <Button variant="outline" size="sm">
              <FilterX className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" onClick={() => setOpenNewItemDialog(true)}>
              <PackagePlus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Tabs and Inventory Table */}
        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as InventoryTabType)}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            <TabsTrigger value="apparel">Apparel</TabsTrigger>
            <TabsTrigger value="beverages">Beverages</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <InventoryTable 
              items={filteredItems} 
              getStatusBadge={getStatusBadge} 
              getCategoryBadge={getCategoryBadge}
            />
          </TabsContent>
          
          <TabsContent value="low-stock" className="mt-0">
            <InventoryTable 
              items={filteredItems} 
              getStatusBadge={getStatusBadge} 
              getCategoryBadge={getCategoryBadge}
            />
          </TabsContent>
          
          <TabsContent value="apparel" className="mt-0">
            <InventoryTable 
              items={filteredItems} 
              getStatusBadge={getStatusBadge} 
              getCategoryBadge={getCategoryBadge}
            />
          </TabsContent>
          
          <TabsContent value="beverages" className="mt-0">
            <InventoryTable 
              items={filteredItems} 
              getStatusBadge={getStatusBadge} 
              getCategoryBadge={getCategoryBadge}
            />
          </TabsContent>
          
          <TabsContent value="food" className="mt-0">
            <InventoryTable 
              items={filteredItems} 
              getStatusBadge={getStatusBadge} 
              getCategoryBadge={getCategoryBadge}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* New Inventory Item Dialog */}
      <Dialog open={openNewItemDialog} onOpenChange={setOpenNewItemDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
            <DialogDescription>
              Add a new product or supply to your inventory.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="Product SKU" />
              </div>
              <div className="col-span-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Product name" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Product description" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue={ProductCategory.APPAREL} onValueChange={(value) => setSelectedCategory(value as ProductCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ProductCategory.APPAREL}>Apparel</SelectItem>
                    <SelectItem value={ProductCategory.BEVERAGES}>Beverages</SelectItem>
                    <SelectItem value={ProductCategory.FOOD}>Food</SelectItem>
                    <SelectItem value={ProductCategory.ACCESSORIES}>Accessories</SelectItem>
                    <SelectItem value={ProductCategory.MERCHANDISE}>Merchandise</SelectItem>
                    <SelectItem value={ProductCategory.PACKAGING}>Packaging</SelectItem>
                    <SelectItem value={ProductCategory.SUPPLIES}>Supplies</SelectItem>
                    <SelectItem value={ProductCategory.RAW_MATERIALS}>Raw Materials</SelectItem>
                    <SelectItem value={ProductCategory.EQUIPMENT}>Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={StockStatus.IN_STOCK}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={StockStatus.IN_STOCK}>In Stock</SelectItem>
                    <SelectItem value={StockStatus.LOW_STOCK}>Low Stock</SelectItem>
                    <SelectItem value={StockStatus.OUT_OF_STOCK}>Out of Stock</SelectItem>
                    <SelectItem value={StockStatus.ON_ORDER}>On Order</SelectItem>
                    <SelectItem value={StockStatus.BACKORDERED}>Backordered</SelectItem>
                    <SelectItem value={StockStatus.DISCONTINUED}>Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label htmlFor="quantity">Current Quantity</Label>
                <Input id="quantity" type="number" min="0" placeholder="0" />
              </div>
              <div className="col-span-1">
                <Label htmlFor="reorderPoint">Reorder Point</Label>
                <Input id="reorderPoint" type="number" min="0" placeholder="0" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label htmlFor="costPrice">Cost Price ($)</Label>
                <Input id="costPrice" type="number" min="0" step="0.01" placeholder="0.00" />
              </div>
              <div className="col-span-1">
                <Label htmlFor="sellingPrice">Selling Price ($)</Label>
                <Input id="sellingPrice" type="number" min="0" step="0.01" placeholder="0.00" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label htmlFor="location">Storage Location</Label>
                <Select defaultValue={StorageLocation.WAREHOUSE}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={StorageLocation.WAREHOUSE}>Warehouse</SelectItem>
                    <SelectItem value={StorageLocation.STORE_FRONT}>Store Front</SelectItem>
                    <SelectItem value={StorageLocation.PRODUCTION}>Production</SelectItem>
                    <SelectItem value={StorageLocation.SUPPLIER}>Supplier</SelectItem>
                    <SelectItem value={StorageLocation.TRANSIT}>In Transit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" placeholder="Supplier name" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label htmlFor="minimumOrderQuantity">Min. Order Quantity</Label>
                <Input id="minimumOrderQuantity" type="number" min="1" placeholder="1" />
              </div>
              <div className="col-span-1">
                <Label htmlFor="leadTime">Lead Time (Days)</Label>
                <Input id="leadTime" type="number" min="1" placeholder="7" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" placeholder="Enter tags separated by commas" />
            </div>
            
            <div>
              <Label htmlFor="businessEntity">Business Entity</Label>
              <Select defaultValue="3">
                <SelectTrigger>
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Digital Merch Pros</SelectItem>
                  <SelectItem value="2">Mystery Hype</SelectItem>
                  <SelectItem value="3">Lone Star Custom Clothing</SelectItem>
                  <SelectItem value="4">Alcoeaze</SelectItem>
                  <SelectItem value="5">Hide Cafe Bars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenNewItemDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpenNewItemDialog(false)}>
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

// Inventory Table Component
function InventoryTable({ 
  items, 
  getStatusBadge, 
  getCategoryBadge 
}: { 
  items: InventoryItem[], 
  getStatusBadge: (status: StockStatus) => React.ReactNode, 
  getCategoryBadge: (category: ProductCategory) => React.ReactNode 
}) {
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
  
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  function getStockIndicator(item: InventoryItem) {
    if (item.status === StockStatus.OUT_OF_STOCK) {
      return <div className="w-full bg-gray-200 h-2 rounded"><div className="bg-red-500 h-2 rounded" style={{ width: '0%' }}></div></div>;
    }
    
    const percentage = Math.min(100, Math.floor((item.quantity / item.reorderPoint) * 100));
    const color = percentage <= 50 ? "bg-red-500" : percentage <= 100 ? "bg-yellow-500" : "bg-green-500";
    
    return (
      <div className="w-full bg-gray-200 h-2 rounded">
        <div className={`${color} h-2 rounded`} style={{ width: `${percentage}%` }}></div>
      </div>
    );
  }

  // Restock action dialog
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
  const [restockQuantity, setRestockQuantity] = useState<number>(0);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState<boolean>(false);

  const openRestockDialog = (item: InventoryItem) => {
    setRestockItem(item);
    setRestockQuantity(item.minimumOrderQuantity);
    setIsRestockDialogOpen(true);
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU / Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Package2 className="h-8 w-8 mb-2" />
                    <p>No inventory items found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} className="group">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.sku}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(item.category)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{item.quantity}</div>
                    <div className="text-xs text-muted-foreground">Min: {item.reorderPoint}</div>
                  </TableCell>
                  <TableCell>
                    <div className="w-20">{getStockIndicator(item)}</div>
                  </TableCell>
                  <TableCell>{formatCurrency(item.costPrice)}</TableCell>
                  <TableCell>{formatCurrency(item.sellingPrice)}</TableCell>
                  <TableCell>
                    <div className="text-sm">{item.entityName}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0">
                          <ChevronDown className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openRestockDialog(item)}>
                          <RefreshCcw className="w-4 h-4 mr-2" />
                          Restock
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <History className="w-4 h-4 mr-2" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Box className="w-4 h-4 mr-2" />
                          Adjust Quantity
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Truck className="w-4 h-4 mr-2" />
                          Move Location
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Tag className="w-4 h-4 mr-2" />
                          Edit Item
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

      {/* Restock Dialog */}
      <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Restock Item</DialogTitle>
            <DialogDescription>
              {restockItem && (
                <div className="text-sm text-muted-foreground">
                  {restockItem.sku}: {restockItem.name}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="restock-quantity">Restock Quantity</Label>
              <Input
                id="restock-quantity"
                type="number"
                min={1}
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(parseInt(e.target.value))}
              />
              {restockItem && (
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum order quantity: {restockItem.minimumOrderQuantity}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={restockItem?.supplier || ""}
                readOnly
              />
            </div>
            {restockItem && (
              <div>
                <Label>Estimated Cost</Label>
                <div className="text-lg font-medium mt-1">
                  {formatCurrency(restockQuantity * restockItem.costPrice)}
                </div>
              </div>
            )}
            {restockItem && (
              <div>
                <Label>Estimated Delivery</Label>
                <div className="text-sm mt-1">
                  {new Date(Date.now() + restockItem.leadTime * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  {" "}
                  ({restockItem.leadTime} days lead time)
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestockDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // In a real app, this would submit a restock order
              setIsRestockDialogOpen(false);
            }}>
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}