import React, { useState } from 'react';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  BarChart2,
  Box,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  CircleDollarSign,
  Clipboard,
  Clock,
  Edit,
  Eye,
  FileBarChart,
  Filter,
  HelpCircle,
  Image,
  Info,
  Link,
  ListFilter,
  Loader,
  MoreHorizontal,
  Package,
  PackageCheck,
  PackageOpen,
  Pencil,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Send,
  Settings,
  Share,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Trash,
  Truck,
  UploadCloud,
  Users,
  Warehouse,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Enums for product management
export enum ProductStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued'
}

export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  SERVICE = 'service',
  SUBSCRIPTION = 'subscription',
  BUNDLE = 'bundle'
}

export enum TaxClass {
  STANDARD = 'standard',
  REDUCED = 'reduced',
  ZERO = 'zero'
}

export enum StockStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  BACKORDERED = 'backordered',
  PRE_ORDER = 'pre_order'
}

export enum InventoryTrackingMethod {
  SIMPLE = 'simple',
  VARIANT = 'variant',
  SERIAL = 'serial',
  LOT = 'lot',
  NONE = 'none'
}

// Product and inventory interfaces
export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  costPrice?: number;
  compareAtPrice?: number;
  status: ProductStatus;
  type: ProductType;
  weight?: number;
  weightUnit?: 'g' | 'kg' | 'lb' | 'oz';
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  taxClass: TaxClass;
  taxable: boolean;
  categories: string[];
  tags?: string[];
  brandId?: string;
  brandName?: string;
  featuredImageUrl?: string;
  images?: string[];
  options?: ProductOption[];
  variants?: ProductVariant[];
  hasVariants: boolean;
  inventoryTracking: InventoryTrackingMethod;
  entityId: number;
  entityName: string;
  visibility: 'public' | 'private' | 'password_protected';
  createdAt: Date | string;
  updatedAt: Date | string;
  seoTitle?: string;
  seoDescription?: string;
  metafields?: Record<string, string>;
  stats?: {
    views: number;
    sales: number;
    revenue: number;
    returnRate: number;
  };
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
  required: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name?: string;
  price: number;
  costPrice?: number;
  compareAtPrice?: number;
  options: {
    optionId: string;
    value: string;
  }[];
  imageUrl?: string;
  weight?: number;
  weightUnit?: 'g' | 'kg' | 'lb' | 'oz';
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  inventoryQuantity: number;
  inventoryPolicy: 'deny' | 'continue';
  barcode?: string;
}

export interface InventoryLocation {
  id: string;
  name: string;
  type: 'warehouse' | 'store' | 'dropship' | 'supplier' | 'other';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isDefault: boolean;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  entityId: number;
  entityName: string;
}

export interface InventoryLevel {
  id: string;
  productId: string;
  variantId?: string; 
  locationId: string;
  quantity: number;
  minQuantity?: number;
  maxQuantity?: number;
  shelfLocation?: string;
  lotNumber?: string;
  expiryDate?: Date | string;
  status: StockStatus;
  lastCountedAt?: Date | string;
  updatedAt: Date | string;
}

export interface InventoryTransaction {
  id: string;
  type: 'receive' | 'adjust' | 'transfer' | 'sell' | 'return' | 'scrap';
  productId: string;
  variantId?: string;
  locationId: string;
  destinationLocationId?: string; // For transfers
  orderId?: string;
  quantity: number;
  note?: string;
  referenceNumber?: string;
  userId: number;
  createdAt: Date | string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  entityId: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
  entityId: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  currency?: string;
  leadTime?: number; // In days
  minimumOrderValue?: number;
  shippingTerms?: string;
  paymentTerms?: string;
  isActive: boolean;
  notes?: string;
  entityId: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  status: 'draft' | 'submitted' | 'confirmed' | 'partial' | 'received' | 'cancelled';
  orderDate: Date | string;
  expectedDeliveryDate?: Date | string;
  actualDeliveryDate?: Date | string;
  locationId: string;
  items: {
    productId: string;
    variantId?: string;
    sku: string;
    name: string;
    quantity: number;
    receivedQuantity: number;
    unitCost: number;
    tax?: number;
    total: number;
  }[];
  subTotal: number;
  taxTotal: number;
  shippingCost: number;
  total: number;
  notes?: string;
  userId: number;
  entityId: number;
  entityName: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ProductInventorySystemProps {
  entities: Array<{ id: number, name: string, type: 'service' | 'product' | 'physical' }>;
  products?: Product[];
  inventoryLocations?: InventoryLocation[];
  inventoryLevels?: InventoryLevel[];
  suppliers?: Supplier[];
  categories?: ProductCategory[];
  brands?: Brand[];
  purchaseOrders?: PurchaseOrder[];
  onAddProduct?: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct?: (id: string, product: Partial<Product>) => void;
  onDeleteProduct?: (id: string) => void;
  onAddInventoryLocation?: (location: Omit<InventoryLocation, 'id'>) => void;
  onAddInventoryTransaction?: (transaction: Omit<InventoryTransaction, 'id'>) => void;
  onCreatePurchaseOrder?: (order: Omit<PurchaseOrder, 'id'>) => void;
  onUpdatePurchaseOrder?: (id: string, order: Partial<PurchaseOrder>) => void;
}

const ProductInventorySystem: React.FC<ProductInventorySystemProps> = ({
  entities,
  products = [],
  inventoryLocations = [],
  inventoryLevels = [],
  suppliers = [],
  categories = [],
  brands = [],
  purchaseOrders = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddInventoryLocation,
  onAddInventoryTransaction,
  onCreatePurchaseOrder,
  onUpdatePurchaseOrder
}) => {
  const [selectedEntity, setSelectedEntity] = useState<number | 'all'>('all');
  const [activeTab, setActiveTab] = useState('products');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductData, setNewProductData] = useState<Partial<Product>>({});
  const [isAddingInventory, setIsAddingInventory] = useState(false);
  const [isCreatingPO, setIsCreatingPO] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [newPOData, setNewPOData] = useState<Partial<PurchaseOrder>>({});
  const { toast } = useToast();
  
  // Filter products based on selected entity, search term, status, and category
  const filteredProducts = products.filter(product => {
    // Filter by entity
    if (selectedEntity !== 'all' && product.entityId !== selectedEntity) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all' && product.status !== statusFilter) {
      return false;
    }
    
    // Filter by category
    if (categoryFilter !== 'all' && !product.categories.includes(categoryFilter)) {
      return false;
    }
    
    return true;
  });
  
  // Get the product details for the currently selected product
  const currentProduct = selectedProduct 
    ? products.find(product => product.id === selectedProduct) 
    : null;
  
  // Get inventory levels for the currently selected product
  const productInventory = currentProduct 
    ? inventoryLevels.filter(level => level.productId === currentProduct.id) 
    : [];
  
  // Calculate inventory totals across all locations
  const calculateInventoryTotals = () => {
    const totalProductCount = products.length;
    const totalInventoryValue = products.reduce((sum, product) => {
      // For products with variants, sum the value of all variants
      if (product.hasVariants && product.variants) {
        return sum + product.variants.reduce((variantSum, variant) => {
          const variantInventory = inventoryLevels.find(
            level => level.productId === product.id && level.variantId === variant.id
          );
          return variantSum + (variant.costPrice || 0) * (variantInventory?.quantity || 0);
        }, 0);
      }
      
      // For simple products, just use the product's cost price and inventory
      const productInventory = inventoryLevels.find(
        level => level.productId === product.id && !level.variantId
      );
      return sum + (product.costPrice || 0) * (productInventory?.quantity || 0);
    }, 0);
    
    const lowStockCount = inventoryLevels.filter(level => level.status === StockStatus.LOW_STOCK).length;
    const outOfStockCount = inventoryLevels.filter(level => level.status === StockStatus.OUT_OF_STOCK).length;
    
    return {
      totalProductCount,
      totalInventoryValue,
      lowStockCount,
      outOfStockCount
    };
  };
  
  const inventoryTotals = calculateInventoryTotals();
  
  // Handle add new product
  const handleAddProduct = () => {
    if (!newProductData.name || !newProductData.sku || !newProductData.price || 
        !newProductData.status || !newProductData.type || !newProductData.entityId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (onAddProduct) {
      const newProduct: Omit<Product, 'id'> = {
        ...newProductData as any,
        createdAt: new Date(),
        updatedAt: new Date(),
        hasVariants: false,
        inventoryTracking: InventoryTrackingMethod.SIMPLE,
        entityName: entities.find(e => e.id === newProductData.entityId)?.name || '',
        taxable: newProductData.taxable !== undefined ? newProductData.taxable : true,
        taxClass: newProductData.taxClass || TaxClass.STANDARD,
        categories: newProductData.categories || [],
        visibility: newProductData.visibility || 'public'
      };
      
      onAddProduct(newProduct);
      
      toast({
        title: "Product added",
        description: `${newProductData.name} has been added successfully.`,
      });
      
      setIsAddingProduct(false);
      setNewProductData({});
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Get color for product status badge
  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.ACTIVE:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case ProductStatus.DRAFT:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case ProductStatus.ARCHIVED:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case ProductStatus.OUT_OF_STOCK:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case ProductStatus.DISCONTINUED:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "";
    }
  };
  
  // Get color for stock status badge
  const getStockStatusColor = (status: StockStatus) => {
    switch (status) {
      case StockStatus.IN_STOCK:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case StockStatus.LOW_STOCK:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case StockStatus.OUT_OF_STOCK:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case StockStatus.BACKORDERED:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case StockStatus.PRE_ORDER:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "";
    }
  };
  
  // Get color for purchase order status badge
  const getPOStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
      case 'submitted':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case 'confirmed':
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      case 'partial':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case 'received':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case 'cancelled':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "";
    }
  };
  
  // Format date
  const formatDate = (date: string | Date) => {
    try {
      return new Date(date).toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Calculate profit margin
  const calculateMargin = (price: number, costPrice?: number) => {
    if (!costPrice || costPrice === 0) return null;
    
    const margin = ((price - costPrice) / price) * 100;
    return margin.toFixed(2) + '%';
  };
  
  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Product & Inventory Management</h2>
          <p className="text-muted-foreground">
            Manage products, inventory, and suppliers across your business entities
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
              {entities
                .filter(entity => entity.type === 'product')
                .map((entity) => (
                  <SelectItem key={entity.id} value={entity.id.toString()}>
                    {entity.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          
          <Button onClick={() => setIsAddingProduct(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>
      
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryTotals.totalProductCount}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Across {entities.filter(e => e.type === 'product').length} product-based entities
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Value
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(inventoryTotals.totalInventoryValue)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Based on cost price and current inventory levels
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryTotals.lowStockCount}</div>
            <Progress 
              value={inventoryTotals.lowStockCount > 0 
                ? (inventoryTotals.lowStockCount / products.length) * 100 
                : 0} 
              className="h-1 mt-2" 
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
              <span>Need attention</span>
              <span>{inventoryTotals.outOfStockCount} out of stock</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Purchase Orders
            </CardTitle>
            <Clipboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrders.length}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {purchaseOrders.filter(po => po.status === 'submitted').length} Pending
              </Badge>
              <Badge variant="outline" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                {purchaseOrders.filter(po => po.status === 'received').length} Received
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="purchase_orders">Purchase Orders</TabsTrigger>
        </TabsList>
        
        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select 
                value={statusFilter === 'all' ? 'all' : statusFilter}
                onValueChange={(value) => setStatusFilter(value === 'all' ? 'all' : value as ProductStatus)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.values(ProductStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
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
                  <Tag className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('list')}
                >
                  <ListFilter className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
              
              <Button variant="outline">
                <UploadCloud className="mr-2 h-4 w-4" />
                Import
              </Button>
              
              <Button onClick={() => setIsAddingProduct(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
          
          {/* Products List View */}
          {viewMode === 'list' ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <Package className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No products found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => {
                        // Find inventory level for this product
                        const productLevel = inventoryLevels.find(
                          level => level.productId === product.id && !level.variantId
                        );

                        return (
                          <TableRow 
                            key={product.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setSelectedProduct(product.id)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                                  {product.featuredImageUrl ? (
                                    <img src={product.featuredImageUrl} alt={product.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                                    {product.hasVariants && ' • With Variants'}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{product.sku}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{formatCurrency(product.price)}</span>
                                {product.costPrice && (
                                  <span className="text-xs text-muted-foreground">
                                    Cost: {formatCurrency(product.costPrice)}
                                    {calculateMargin(product.price, product.costPrice) && 
                                      ` (${calculateMargin(product.price, product.costPrice)} margin)`}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {product.categories.slice(0, 2).map((categoryId, index) => {
                                  const category = categories.find(c => c.id === categoryId);
                                  return category ? (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {category.name}
                                    </Badge>
                                  ) : null;
                                })}
                                {product.categories.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{product.categories.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(product.status)}>
                                {product.status.charAt(0).toUpperCase() + product.status.slice(1).replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {productLevel ? (
                                <Badge variant="outline" className={getStockStatusColor(productLevel.status)}>
                                  {productLevel.quantity} in stock
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">Not tracked</span>
                              )}
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
                                    setSelectedProduct(product.id);
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
                                    // Handle duplicate
                                  }}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    if (onDeleteProduct) {
                                      onDeleteProduct(product.id);
                                    }
                                  }} className="text-red-600">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            // Products Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium">No products found</h3>
                    <p className="text-sm text-muted-foreground text-center mt-1 max-w-md">
                      Try adjusting your filters or add a new product to get started
                    </p>
                    <Button className="mt-4" onClick={() => setIsAddingProduct(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredProducts.map((product) => {
                  // Find inventory level for this product
                  const productLevel = inventoryLevels.find(
                    level => level.productId === product.id && !level.variantId
                  );

                  return (
                    <Card 
                      key={product.id} 
                      className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => setSelectedProduct(product.id)}
                    >
                      <div className="aspect-square w-full bg-muted relative overflow-hidden">
                        {product.featuredImageUrl ? (
                          <img 
                            src={product.featuredImageUrl} 
                            alt={product.name} 
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          <Badge variant="outline" className={getStatusColor(product.status)}>
                            {product.status.charAt(0).toUpperCase() + product.status.slice(1).replace('_', ' ')}
                          </Badge>
                          {productLevel && (
                            <Badge variant="outline" className={getStockStatusColor(productLevel.status)}>
                              {productLevel.quantity} in stock
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{product.name}</CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProduct(product.id);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardDescription className="truncate">
                          SKU: {product.sku}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between">
                          <div>
                            <div className="text-lg font-semibold">{formatCurrency(product.price)}</div>
                            {product.costPrice && (
                              <div className="text-xs text-muted-foreground">
                                Cost: {formatCurrency(product.costPrice)}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            {product.hasVariants ? (
                              <div className="text-sm">
                                {product.variants ? product.variants.length : 0} variants
                              </div>
                            ) : (
                              <div className="text-sm">
                                {productLevel ? productLevel.quantity : 'N/A'} in stock
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {product.categories.slice(0, 3).map((categoryId, index) => {
                              const category = categories.find(c => c.id === categoryId);
                              return category ? (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {category.name}
                                </Badge>
                              ) : null;
                            })}
                            {product.categories.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.categories.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-2 flex justify-between">
                        <div className="text-xs text-muted-foreground">
                          {product.entityName}
                        </div>
                        {product.stats && (
                          <div className="text-xs flex items-center gap-1">
                            <EyeIcon className="h-3 w-3" />
                            <span>{product.stats.views}</span>
                            <ShoppingCart className="h-3 w-3 ml-1" />
                            <span>{product.stats.sales}</span>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </TabsContent>
        
        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <Select
                value={selectedEntity === 'all' ? 'all' : selectedEntity.toString()}
                onValueChange={(value) => setSelectedEntity(value === 'all' ? 'all' : parseInt(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {entities
                    .filter(entity => entity.type === 'product')
                    .map((entity) => (
                      <SelectItem key={entity.id} value={entity.id.toString()}>
                        {entity.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {inventoryLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.values(StockStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Count Inventory
              </Button>
              
              <Button variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                Transfer Stock
              </Button>
              
              <Button onClick={() => setIsAddingInventory(true)}>
                <Package className="mr-2 h-4 w-4" />
                Adjust Inventory
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Inventory Levels</CardTitle>
              <CardDescription>
                Current stock levels across all inventory locations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>In Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryLevels.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Warehouse className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No inventory data</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    inventoryLevels
                      .filter(level => selectedEntity === 'all' || 
                        products.find(p => p.id === level.productId)?.entityId === selectedEntity)
                      .map((level) => {
                        const product = products.find(p => p.id === level.productId);
                        const location = inventoryLocations.find(l => l.id === level.locationId);
                        
                        if (!product || !location) return null;
                        
                        return (
                          <TableRow key={level.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                                  {product.featuredImageUrl ? (
                                    <img 
                                      src={product.featuredImageUrl} 
                                      alt={product.name} 
                                      className="h-full w-full object-cover" 
                                    />
                                  ) : (
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  {level.variantId && (
                                    <div className="text-xs text-muted-foreground">
                                      {product.variants?.find(v => v.id === level.variantId)?.name || 'Variant'}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{level.variantId 
                              ? product.variants?.find(v => v.id === level.variantId)?.sku 
                              : product.sku}</TableCell>
                            <TableCell>{location.name}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{level.quantity}</span>
                                {level.minQuantity !== undefined && (
                                  <span className="text-xs text-muted-foreground">
                                    Min: {level.minQuantity}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStockStatusColor(level.status)}>
                                {level.status.charAt(0).toUpperCase() + level.status.slice(1).replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(level.updatedAt)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {}}>
                                    <Package className="mr-2 h-4 w-4" />
                                    View Product
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {}}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Adjust Stock
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {}}>
                                    <Truck className="mr-2 h-4 w-4" />
                                    Transfer
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {}}>
                                    <QrCode className="mr-2 h-4 w-4" />
                                    Print Label
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Locations</CardTitle>
                <CardDescription>
                  Manage your warehouses and storage locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inventoryLocations.length === 0 ? (
                  <div className="text-center py-6">
                    <Warehouse className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No inventory locations</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {
                        // Handle adding location
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Location
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inventoryLocations
                      .filter(location => 
                        selectedEntity === 'all' || location.entityId === selectedEntity
                      )
                      .map((location) => (
                        <div 
                          key={location.id} 
                          className="border rounded-md p-3 flex justify-between items-start hover:bg-muted/30 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{location.name}</div>
                              {location.isDefault && (
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">{location.type.charAt(0).toUpperCase() + location.type.slice(1)}</div>
                            {location.address && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {location.address}, {location.city}, {location.state} {location.zipCode}
                              </div>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {}}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Inventory
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Location
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}}>
                                <PackageCheck className="mr-2 h-4 w-4" />
                                Count Stock
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-3">
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Location
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Inventory Changes</CardTitle>
                <CardDescription>
                  Latest inventory adjustments and movements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No recent changes</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recent inventory transactions will appear here
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3">
                <Button variant="outline" className="w-full" onClick={() => setIsAddingInventory(true)}>
                  <PackageOpen className="mr-2 h-4 w-4" />
                  Make Inventory Adjustment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers..."
                  className="pl-8 w-[250px]"
                />
              </div>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Lead Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Truck className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No suppliers found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    suppliers
                      .filter(supplier => 
                        selectedEntity === 'all' || supplier.entityId === selectedEntity
                      )
                      .map((supplier) => (
                        <TableRow 
                          key={supplier.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setSelectedSupplier(supplier.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {supplier.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{supplier.name}</div>
                                {supplier.website && (
                                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Link className="h-3 w-3" />
                                    <a 
                                      href={supplier.website} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="hover:underline"
                                    >
                                      {supplier.website.replace(/^https?:\/\//, '')}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{supplier.contactName || 'No contact'}</div>
                            {supplier.email && (
                              <div className="text-xs text-muted-foreground">{supplier.email}</div>
                            )}
                            {supplier.phone && (
                              <div className="text-xs text-muted-foreground">{supplier.phone}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span>Products supplied data would go here</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {supplier.leadTime 
                              ? `${supplier.leadTime} days` 
                              : 'Not specified'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={supplier.isActive 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}>
                              {supplier.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {entities.find(e => e.id === supplier.entityId)?.name || 'Unknown'}
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
                                  setSelectedSupplier(supplier.id);
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
                                  setIsCreatingPO(true);
                                  setNewPOData({
                                    supplierId: supplier.id,
                                    supplierName: supplier.name,
                                    orderDate: new Date(),
                                    status: 'draft',
                                    entityId: supplier.entityId,
                                    items: [],
                                    subTotal: 0,
                                    taxTotal: 0,
                                    shippingCost: 0,
                                    total: 0
                                  });
                                }}>
                                  <Clipboard className="mr-2 h-4 w-4" />
                                  New Purchase Order
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-red-600">
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
        
        {/* Purchase Orders Tab */}
        <TabsContent value="purchase_orders" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8 w-[250px]"
                />
              </div>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="partial">Partially Received</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={selectedEntity === 'all' ? 'all' : selectedEntity.toString()}
                onValueChange={(value) => setSelectedEntity(value === 'all' ? 'all' : parseInt(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {entities
                    .filter(entity => entity.type === 'product')
                    .map((entity) => (
                      <SelectItem key={entity.id} value={entity.id.toString()}>
                        {entity.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={() => setIsCreatingPO(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create PO
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Clipboard className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No purchase orders found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    purchaseOrders
                      .filter(po => 
                        selectedEntity === 'all' || po.entityId === selectedEntity
                      )
                      .map((po) => (
                        <TableRow 
                          key={po.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            <div className="font-medium">{po.orderNumber}</div>
                          </TableCell>
                          <TableCell>{po.supplierName}</TableCell>
                          <TableCell>{formatDate(po.orderDate)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getPOStatusColor(po.status)}>
                              {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span>{po.items.length} items</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatCurrency(po.total)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {}}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Order
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {}}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {po.status === 'draft' && (
                                  <DropdownMenuItem onClick={() => {
                                    if (onUpdatePurchaseOrder) {
                                      onUpdatePurchaseOrder(po.id, { status: 'submitted' });
                                    }
                                  }}>
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit Order
                                  </DropdownMenuItem>
                                )}
                                {(po.status === 'submitted' || po.status === 'confirmed' || po.status === 'partial') && (
                                  <DropdownMenuItem onClick={() => {}}>
                                    <PackageCheck className="mr-2 h-4 w-4" />
                                    Receive Items
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => {}}>
                                  <Share className="mr-2 h-4 w-4" />
                                  Email PO
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {po.status !== 'cancelled' && po.status !== 'received' && (
                                  <DropdownMenuItem onClick={() => {
                                    if (onUpdatePurchaseOrder) {
                                      onUpdatePurchaseOrder(po.id, { status: 'cancelled' });
                                    }
                                  }} className="text-red-600">
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel Order
                                  </DropdownMenuItem>
                                )}
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
      
      {/* Product Detail Dialog */}
      {currentProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl">{currentProduct.name}</DialogTitle>
                  <DialogDescription>
                    SKU: {currentProduct.sku} • {currentProduct.type.charAt(0).toUpperCase() + currentProduct.type.slice(1)}
                  </DialogDescription>
                </div>
                <Badge variant="outline" className={getStatusColor(currentProduct.status)}>
                  {currentProduct.status.charAt(0).toUpperCase() + currentProduct.status.slice(1).replace('_', ' ')}
                </Badge>
              </div>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="md:col-span-1">
                <div className="aspect-square rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  {currentProduct.featuredImageUrl ? (
                    <img 
                      src={currentProduct.featuredImageUrl} 
                      alt={currentProduct.name} 
                      className="h-full w-full object-contain" 
                    />
                  ) : (
                    <Package className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                
                {currentProduct.images && currentProduct.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {currentProduct.images.slice(0, 4).map((img, index) => (
                      <div key={index} className="aspect-square rounded-md overflow-hidden bg-muted">
                        <img src={img} alt={`Product image ${index+1}`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Product Categories</h3>
                  <div className="flex flex-wrap gap-1">
                    {currentProduct.categories.map((categoryId, index) => {
                      const category = categories.find(c => c.id === categoryId);
                      return category ? (
                        <Badge key={index} variant="secondary">
                          {category.name}
                        </Badge>
                      ) : null;
                    })}
                    {currentProduct.categories.length === 0 && (
                      <span className="text-sm text-muted-foreground">No categories assigned</span>
                    )}
                  </div>
                </div>
                
                {currentProduct.tags && currentProduct.tags.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-1">
                      {currentProduct.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Product Details</h3>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Price</div>
                        <div className="font-medium">{formatCurrency(currentProduct.price)}</div>
                      </div>
                      
                      {currentProduct.costPrice !== undefined && (
                        <div>
                          <div className="text-sm text-muted-foreground">Cost</div>
                          <div className="font-medium">
                            {formatCurrency(currentProduct.costPrice)}
                            {calculateMargin(currentProduct.price, currentProduct.costPrice) && (
                              <span className="ml-2 text-sm text-muted-foreground">
                                ({calculateMargin(currentProduct.price, currentProduct.costPrice)} margin)
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {currentProduct.compareAtPrice !== undefined && (
                      <div>
                        <div className="text-sm text-muted-foreground">Compare At Price</div>
                        <div className="font-medium">{formatCurrency(currentProduct.compareAtPrice)}</div>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Tax Class</div>
                        <div>{currentProduct.taxClass.charAt(0).toUpperCase() + currentProduct.taxClass.slice(1)}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Taxable</div>
                        <div>{currentProduct.taxable ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                    
                    {currentProduct.weight !== undefined && (
                      <div>
                        <div className="text-sm text-muted-foreground">Weight</div>
                        <div>
                          {currentProduct.weight} {currentProduct.weightUnit}
                        </div>
                      </div>
                    )}
                    
                    {currentProduct.dimensions && (
                      <div>
                        <div className="text-sm text-muted-foreground">Dimensions (L × W × H)</div>
                        <div>
                          {currentProduct.dimensions.length} × {currentProduct.dimensions.width} × {currentProduct.dimensions.height} {currentProduct.dimensions.unit}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Inventory</h3>
                    <Button variant="outline" size="sm">
                      <PackageOpen className="mr-2 h-4 w-4" />
                      Adjust Stock
                    </Button>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Tracking Method</div>
                        <div className="font-medium">
                          {currentProduct.inventoryTracking.charAt(0).toUpperCase() + 
                            currentProduct.inventoryTracking.slice(1)} Tracking
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Variant Tracking</div>
                        <div className="font-medium">
                          {currentProduct.hasVariants ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>
                    
                    {productInventory.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Location</TableHead>
                            <TableHead>In Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Updated</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {productInventory.map((level) => {
                            const location = inventoryLocations.find(l => l.id === level.locationId);
                            if (!location) return null;
                            
                            return (
                              <TableRow key={level.id}>
                                <TableCell>{location.name}</TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{level.quantity}</span>
                                    {level.minQuantity !== undefined && (
                                      <span className="text-xs text-muted-foreground">
                                        Min: {level.minQuantity}
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getStockStatusColor(level.status)}>
                                    {level.status.charAt(0).toUpperCase() + level.status.slice(1).replace('_', ' ')}
                                  </Badge>
                                </TableCell>
                                <TableCell>{formatDate(level.updatedAt)}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-6">
                        <PackageOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No inventory tracking set up</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {currentProduct.description && (
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm">{currentProduct.description}</p>
                    </div>
                  </div>
                )}
                
                {currentProduct.hasVariants && currentProduct.variants && currentProduct.variants.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Variants ({currentProduct.variants.length})</h3>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Variant</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentProduct.variants.map((variant) => {
                            const variantLevel = inventoryLevels.find(
                              level => level.productId === currentProduct.id && level.variantId === variant.id
                            );
                            
                            return (
                              <TableRow key={variant.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {variant.imageUrl && (
                                      <div className="h-8 w-8 rounded-md overflow-hidden bg-muted">
                                        <img 
                                          src={variant.imageUrl} 
                                          alt={variant.name || 'Variant'} 
                                          className="h-full w-full object-cover" 
                                        />
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-medium">
                                        {variant.name || variant.options.map(o => o.value).join(' / ')}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{variant.sku}</TableCell>
                                <TableCell>{formatCurrency(variant.price)}</TableCell>
                                <TableCell>
                                  {variantLevel ? (
                                    <Badge variant="outline" className={getStockStatusColor(variantLevel.status)}>
                                      {variantLevel.quantity} in stock
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground">Not tracked</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
                
                {currentProduct.stats && (
                  <div>
                    <h3 className="font-medium mb-2">Performance</h3>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Views</div>
                          <div className="font-medium">{currentProduct.stats.views.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Sales</div>
                          <div className="font-medium">{currentProduct.stats.sales.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Revenue</div>
                          <div className="font-medium">{formatCurrency(currentProduct.stats.revenue)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Return Rate</div>
                          <div className="font-medium">{currentProduct.stats.returnRate.toFixed(2)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline">
                <PackageOpen className="mr-2 h-4 w-4" />
                Adjust Inventory
              </Button>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View in Store
              </Button>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add Product Dialog would be implemented here */}
      
      {/* Inventory Adjustment Dialog would be implemented here */}
      
      {/* Create Purchase Order Dialog would be implemented here */}
    </div>
  );
};

export default ProductInventorySystem;