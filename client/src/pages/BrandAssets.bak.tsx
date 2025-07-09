import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Folder, 
  Image, 
  File, 
  FileText, 
  Video, 
  Download, 
  Share2, 
  MoreHorizontal, 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  SlidersHorizontal,
  CloudIcon,
  Smartphone,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  Grid,
  List,
  Check,
  Wand2,
  BrainCircuit,
  Lightbulb,
  Target,
  UserRound,
  ClipboardCheck,
  FileOutput,
  FileImage,
  MessageSquare,
  Megaphone,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { getQueryFn } from '@/lib/queryClient';
import { useUserRole } from '@/contexts/UserRoleContext';
import { AssetCategory, BrandAssetType, FileFormat, AssetVisibility } from '@shared/assetTypes';
import CreativeBriefGenerator from '@/components/brand-assets/CreativeBriefGenerator';

// UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import MainLayout from '@/components/MainLayout';

// Types
interface Asset {
  id: number;
  name: string;
  description: string | null;
  category: AssetCategory;
  type: string;
  fileUrl: string;
  fileFormat: FileFormat;
  fileSizeKb: number | null;
  status: string;
  visibility: string;
  version: string | null;
  tags: string[] | null;
  businessEntityId: number | null;
  companyId: number | null;
  createdAt: string;
  createdBy: number;
  updatedAt: string | null;
  updatedBy: number | null;
  // Custom properties
  thumbnailUrl?: string;
  entityName?: string;
}

interface BusinessEntity {
  id: number;
  name: string;
  description?: string;
  type?: string;
  slug?: string;
}

interface AssetFolder {
  id: string;
  name: string;
  type: 'folder';
  entityId?: number;
  category?: AssetCategory;
  assetType?: string;
  count: number;
  updatedAt: string;
}

type AssetOrFolder = Asset | AssetFolder;

// Creative Brief interfaces are now defined in the CreativeBriefGenerator component

// Create the component
export default function BrandAssets() {
  // Tab state
  const [activeTab, setActiveTab] = useState('assets');
  
  // Asset management states
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assetDetailsOpen, setAssetDetailsOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Tab states only
  // Creative brief functionality has been moved to CreativeBriefGenerator component
  
  const { toast } = useToast();
  const { userRole } = useUserRole();
  
  // Fetch entities
  const { data: entitiesData, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['/api/business-entities'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });
  
  // Fetch assets
  const { data: assetsData, isLoading: isLoadingAssets } = useQuery({
    queryKey: ['/api/assets', selectedEntity, selectedCategory, selectedType],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });
  
  const entities: BusinessEntity[] = entitiesData?.entities || [];
  const assets: Asset[] = assetsData?.assets || [];
  
  // Create folders for organizing assets
  const generateFolders = (): AssetFolder[] => {
    // If we're at the root level
    if (currentPath.length === 0) {
      // Generate entity folders if no entity is selected
      if (selectedEntity === 'all') {
        return entities.map(entity => ({
          id: `entity-${entity.id}`,
          name: entity.name,
          type: 'folder',
          entityId: entity.id,
          count: assets.filter(asset => asset.businessEntityId === entity.id).length,
          updatedAt: new Date().toISOString()
        }));
      } 
      
      // Generate category folders if entity is selected but category is not
      if (selectedCategory === 'all') {
        const categories = Object.values(AssetCategory);
        return categories.map(category => {
          const categoryAssets = assets.filter(asset => 
            asset.category === category && 
            (selectedEntity === 'all' || asset.businessEntityId === parseInt(selectedEntity))
          );
          
          return {
            id: `category-${category}`,
            name: formatCategoryName(category),
            type: 'folder',
            category,
            count: categoryAssets.length,
            updatedAt: categoryAssets.length > 0 
              ? categoryAssets.reduce((latest, asset) => {
                  return new Date(asset.updatedAt || asset.createdAt) > new Date(latest) 
                    ? (asset.updatedAt || asset.createdAt) 
                    : latest;
                }, '2000-01-01')
              : new Date().toISOString()
          };
        });
      }
      
      // Generate asset type folders if category is selected but type is not
      if (selectedType === 'all' && selectedCategory === AssetCategory.BRAND) {
        const types = Object.values(BrandAssetType);
        return types.map(type => ({
          id: `type-${type}`,
          name: formatTypeName(type),
          type: 'folder',
          assetType: type,
          count: assets.filter(asset => 
            asset.type === type && 
            (selectedEntity === 'all' || asset.businessEntityId === parseInt(selectedEntity))
          ).length,
          updatedAt: new Date().toISOString()
        }));
      }
    }
    
    // Return empty array if none of the conditions apply
    return [];
  };
  
  // Format names for display
  const formatCategoryName = (category: string): string => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  const formatTypeName = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  // Filter and sort assets
  const filteredAssets = assets.filter(asset => {
    // Filter by search query
    if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by entity if selected
    if (selectedEntity !== 'all' && asset.businessEntityId !== parseInt(selectedEntity)) {
      return false;
    }
    
    // Filter by category if selected
    if (selectedCategory !== 'all' && asset.category !== selectedCategory) {
      return false;
    }
    
    // Filter by type if selected
    if (selectedType !== 'all' && asset.type !== selectedType) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by most recently updated
    return new Date(b.updatedAt || b.createdAt).getTime() - 
           new Date(a.updatedAt || a.createdAt).getTime();
  });
  
  // Navigation functions
  const navigateToFolder = (folder: AssetOrFolder) => {
    // Make sure we're dealing with a folder, not an asset
    if (folder.type !== 'folder') return;
    
    const folderItem = folder as AssetFolder;
    
    // Handle entity folder click
    if (folderItem.entityId) {
      setSelectedEntity(folderItem.entityId.toString());
      setCurrentPath([...currentPath, folderItem.name]);
    }
    // Handle category folder click
    else if (folderItem.category) {
      setSelectedCategory(folderItem.category);
      setCurrentPath([...currentPath, folderItem.name]);
    }
    // Handle type folder click
    else if (folderItem.assetType) {
      setSelectedType(folderItem.assetType);
      setCurrentPath([...currentPath, folderItem.name]);
    }
  };
  
  const navigateUp = () => {
    if (currentPath.length === 0) return;
    
    currentPath.pop();
    setCurrentPath([...currentPath]);
    
    if (currentPath.length === 0) {
      setSelectedEntity('all');
      setSelectedCategory('all');
      setSelectedType('all');
    } else if (currentPath.length === 1) {
      setSelectedCategory('all');
      setSelectedType('all');
    } else if (currentPath.length === 2) {
      setSelectedType('all');
    }
  };
  
  const resetNavigation = () => {
    setCurrentPath([]);
    setSelectedEntity('all');
    setSelectedCategory('all');
    setSelectedType('all');
  };
  
  const navigateToBreadcrumb = (index: number) => {
    if (index < 0) {
      resetNavigation();
      return;
    }
    
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    
    if (index === -1) {
      setSelectedEntity('all');
      setSelectedCategory('all');
      setSelectedType('all');
    } else if (index === 0) {
      setSelectedCategory('all');
      setSelectedType('all');
    } else if (index === 1) {
      setSelectedType('all');
    }
  };
  
  // File handling functions
  const handleFileSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    setAssetDetailsOpen(true);
  };
  
  const handleUpload = () => {
    toast({
      title: "Upload initiated",
      description: "Your assets are being uploaded...",
    });
    
    // Simulate upload process
    setTimeout(() => {
      setUploadDialogOpen(false);
      toast({
        title: "Upload complete",
        description: "Your assets have been uploaded successfully.",
      });
    }, 2000);
  };
  
  const handleFileShare = (asset: Asset) => {
    // Generate a shareable link
    const shareableLink = `https://app.dmphq.com/assets/${asset.id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableLink).then(() => {
      setLinkCopied(true);
      toast({
        title: "Link copied",
        description: "Shareable link has been copied to clipboard",
      });
      
      setTimeout(() => setLinkCopied(false), 3000);
    });
  };
  
  const getEntityName = (entityId: number | null): string => {
    if (!entityId) return 'Organization-wide';
    const entity = entities.find(e => e.id === entityId);
    return entity ? entity.name : 'Unknown';
  };
  
  const getAssetIcon = (asset: Asset) => {
    const format = asset.fileFormat.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(format)) {
      return <Image className="h-6 w-6 text-blue-500" />;
    }
    if (['mp4', 'mov', 'avi'].includes(format)) {
      return <Video className="h-6 w-6 text-purple-500" />;
    }
    if (['pdf'].includes(format)) {
      return <FileText className="h-6 w-6 text-red-500" />;
    }
    if (['doc', 'docx', 'txt'].includes(format)) {
      return <FileText className="h-6 w-6 text-blue-500" />;
    }
    if (['xls', 'xlsx'].includes(format)) {
      return <FileText className="h-6 w-6 text-green-500" />;
    }
    if (['ppt', 'pptx'].includes(format)) {
      return <FileText className="h-6 w-6 text-orange-500" />;
    }
    return <File className="h-6 w-6 text-gray-500" />;
  };
  
  const formatFileSize = (sizeInKb: number | null): string => {
    if (sizeInKb === null) return 'Unknown size';
    if (sizeInKb < 1000) return `${sizeInKb} KB`;
    return `${(sizeInKb / 1024).toFixed(2)} MB`;
  };
  
  // Asset folders and current visible items
  const folders = generateFolders();
  const currentItems: AssetOrFolder[] = [...folders, ...filteredAssets];
  
  // Get current breadcrumb text
  const getCurrentBreadcrumbText = (): string => {
    if (currentPath.length === 0) return 'All Brand Assets';
    return currentPath[currentPath.length - 1];
  };
  
  // Creative Brief generation functions have been moved to CreativeBriefGenerator component
  
  // Render the component
  return (
    <MainLayout
      title="Brand Asset Hub"
      description="Manage assets and create professional creative briefs with AI assistance"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Tab Navigation */}
        <Tabs defaultValue="assets" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assets" className="flex items-center">
              <FileImage className="h-4 w-4 mr-2" />
              Asset Management
            </TabsTrigger>
            <TabsTrigger value="creative-brief" className="flex items-center">
              <Wand2 className="h-4 w-4 mr-2" />
              AI Creative Brief Generator
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assets" className="mt-6">
            {/* Asset Management Tab Content */}
            <div className="space-y-4">
              {/* Header with controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-1">Brand Assets</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage, share, and organize all brand assets and press kits
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-full text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 mt-1 sm:mt-0">
              <Button variant="outline" size="sm" className="sm:hidden px-2 h-9" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                <span className="sr-only">Toggle view</span>
              </Button>
              
              <Button variant="outline" className="hidden sm:flex" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                {viewMode === 'grid' ? <List className="h-4 w-4 mr-2" /> : <Grid className="h-4 w-4 mr-2" />}
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="sm:hidden">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter Assets</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-2 space-y-2">
                    <div className="space-y-1">
                      <Label>Entity</Label>
                      <Select
                        value={selectedEntity}
                        onValueChange={setSelectedEntity}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Entities" />
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
                    
                    <div className="space-y-1">
                      <Label>Category</Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={(value) => setSelectedCategory(value as AssetCategory | 'all')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {Object.values(AssetCategory).map(category => (
                            <SelectItem key={category} value={category}>
                              {formatCategoryName(category)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hidden sm:flex">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter Assets</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-2 space-y-2">
                    <div className="space-y-1">
                      <Label>Entity</Label>
                      <Select
                        value={selectedEntity}
                        onValueChange={setSelectedEntity}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Entities" />
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
                    
                    <div className="space-y-1">
                      <Label>Category</Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={(value) => setSelectedCategory(value as AssetCategory | 'all')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {Object.values(AssetCategory).map(category => (
                            <SelectItem key={category} value={category}>
                              {formatCategoryName(category)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="sm:hidden">
                  <Upload className="h-4 w-4" />
                  <span className="sr-only">Upload</span>
                </Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button className="hidden sm:flex">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Assets
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Assets</DialogTitle>
                  <DialogDescription>
                    Upload new brand assets to your asset library
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-3 space-y-1">
                      <Label>Upload Method</Label>
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <Button variant="outline" className="justify-start">
                          <CloudIcon className="h-4 w-4 mr-2" />
                          Cloud
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Smartphone className="h-4 w-4 mr-2" />
                          Phone
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          URL
                        </Button>
                      </div>
                    </div>
                    
                    <div className="col-span-3 space-y-1">
                      <Label htmlFor="files">Files</Label>
                      <div className="mt-1 flex justify-center rounded-lg border border-dashed px-6 py-10">
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                          <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80"
                            >
                              <span>Upload files</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, GIF, PDF up to 10MB</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-3 space-y-1">
                      <Label htmlFor="entity">Business Entity</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select entity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="organization">Organization-wide</SelectItem>
                          {entities.map(entity => (
                            <SelectItem key={entity.id} value={entity.id.toString()}>
                              {entity.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-3 space-y-1">
                      <Label htmlFor="category">Category</Label>
                      <Select defaultValue={AssetCategory.BRAND}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(AssetCategory).map(category => (
                            <SelectItem key={category} value={category}>
                              {formatCategoryName(category)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-3 space-y-1">
                      <Label htmlFor="visibility">Visibility</Label>
                      <Select defaultValue={AssetVisibility.INTERNAL}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(AssetVisibility).map(visibility => (
                            <SelectItem key={visibility} value={visibility}>
                              {formatCategoryName(visibility)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter className="sm:justify-end">
                  <Button 
                    variant="ghost" 
                    onClick={() => setUploadDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleUpload}
                  >
                    Upload
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center overflow-auto pb-1 hide-scrollbar">
          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="flex-nowrap">
              <BreadcrumbItem className="whitespace-nowrap">
                <BreadcrumbLink onClick={() => resetNavigation()} className="text-xs sm:text-sm">
                  Assets
                </BreadcrumbLink>
              </BreadcrumbItem>
              
              {currentPath.map((path, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="whitespace-nowrap">
                    <BreadcrumbLink 
                      onClick={() => navigateToBreadcrumb(index)}
                      className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none inline-block"
                    >
                      {path}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        {isLoadingAssets || isLoadingEntities ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video w-full">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : currentItems.length === 0 ? (
          // Empty state
          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-3 mb-4">
                <File className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No assets found</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                There are no assets in this location. Upload some assets to get started.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => setUploadDialogOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Assets
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Items view (grid or list)
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
              {currentItems.map((item) => (
                'type' in item && item.type === 'folder' ? (
                  // Folder item
                  <Card 
                    key={item.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors overflow-hidden"
                    onClick={() => navigateToFolder(item)}
                  >
                    <CardContent className="p-2 sm:p-4 flex flex-col items-center text-center">
                      <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2 mb-2">
                        <Folder className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-medium mb-0.5 truncate w-full">{item.name}</h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {item.type === 'folder' ? `${(item as AssetFolder).count} ${(item as AssetFolder).count === 1 ? 'item' : 'items'}` : ''}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  // Asset item
                  <Card 
                    key={item.id} 
                    className="overflow-hidden group"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      {('fileFormat' in item) && item.fileFormat?.toLowerCase().match(/^(jpg|jpeg|png|gif|webp)$/) ? (
                        <img 
                          src={('fileUrl' in item) ? item.fileUrl : ''}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          {'fileFormat' in item && getAssetIcon(item as Asset)}
                        </div>
                      )}
                      
                      {/* Overlay actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFileSelect(item as Asset);
                                }}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFileShare(item as Asset);
                                }}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Share</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open((item as Asset).fileUrl, '_blank');
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {getEntityName((item as Asset).businessEntityId)}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {(item as Asset).fileFormat.toUpperCase()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          ) : (
            // List view
            <div className="space-y-1 border rounded-md">
              {/* Table header - Desktop view */}
              <div className="hidden md:grid grid-cols-12 gap-2 py-2 px-4 bg-muted/50 font-medium text-sm">
                <div className="col-span-6">Name</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Entity</div>
                <div className="col-span-1">Size</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              
              {currentItems.map((item) => (
                'type' in item && item.type === 'folder' ? (
                  // Folder item
                  <div 
                    key={item.id}
                    className="grid md:grid-cols-12 grid-cols-6 gap-2 py-2 px-3 sm:px-4 hover:bg-muted/50 cursor-pointer border-b last:border-b-0 border-muted"
                    onClick={() => navigateToFolder(item)}
                  >
                    {/* Mobile view */}
                    <div className="col-span-5 md:col-span-6 flex items-center">
                      <div className="flex-shrink-0">
                        <Folder className="h-4 w-4 text-blue-500 mr-2" />
                      </div>
                      <span className="truncate text-sm">{item.name}</span>
                    </div>
                    
                    <div className="col-span-1 md:hidden flex justify-end">
                      <Badge variant="outline" className="text-xs">
                        Folder
                      </Badge>
                    </div>
                    
                    {/* Desktop view */}
                    <div className="hidden md:block col-span-2 text-muted-foreground text-sm">Folder</div>
                    <div className="hidden md:block col-span-2 text-muted-foreground text-sm">—</div>
                    <div className="hidden md:block col-span-1 text-muted-foreground text-sm">{(item as AssetFolder).count} items</div>
                    <div className="hidden md:block col-span-1 text-right">—</div>
                  </div>
                ) : (
                  // Asset item
                  <div 
                    key={item.id}
                    className="grid md:grid-cols-12 grid-cols-6 gap-2 py-2 px-3 sm:px-4 hover:bg-muted/50 cursor-pointer border-b last:border-b-0 border-muted"
                    onClick={() => handleFileSelect(item as Asset)}
                  >
                    {/* Mobile view - Main row */}
                    <div className="col-span-5 md:col-span-6 flex items-center">
                      <div className="flex-shrink-0">
                        {getAssetIcon(item as Asset)}
                      </div>
                      <span className="truncate ml-2 text-sm">{item.name}</span>
                    </div>
                    
                    <div className="col-span-1 md:hidden flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleFileSelect(item as Asset);
                          }}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleFileShare(item as Asset);
                          }}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            window.open((item as Asset).fileUrl, '_blank');
                          }}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {/* Mobile view - Meta info row */}
                    <div className="col-span-6 md:hidden flex items-center justify-between pr-8 pl-6">
                      <Badge variant="outline" className="text-xs">
                        {(item as Asset).fileFormat.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {getEntityName((item as Asset).businessEntityId)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize((item as Asset).fileSizeKb)}
                      </span>
                    </div>
                    
                    {/* Desktop view */}
                    <div className="hidden md:block col-span-2">
                      <Badge variant="outline" className="text-xs">
                        {(item as Asset).fileFormat.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="hidden md:block col-span-2 text-muted-foreground truncate text-sm">
                      {getEntityName((item as Asset).businessEntityId)}
                    </div>
                    <div className="hidden md:block col-span-1 text-muted-foreground text-sm">
                      {formatFileSize((item as Asset).fileSizeKb)}
                    </div>
                    <div className="hidden md:block col-span-1 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleFileSelect(item as Asset);
                          }}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleFileShare(item as Asset);
                          }}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            window.open((item as Asset).fileUrl, '_blank');
                          }}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              ))}
            </div>
          )
        )}
      </div>
      
      {/* Asset Details Dialog */}
      <Dialog open={assetDetailsOpen} onOpenChange={setAssetDetailsOpen}>
        <DialogContent className="w-[95vw] max-w-4xl p-4 sm:p-6">
          {selectedAsset && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">{selectedAsset.name}</DialogTitle>
                <DialogDescription className="text-sm">
                  Asset details and information
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-2 sm:mt-4">
                {/* Asset preview section */}
                <div className="flex flex-col space-y-3 sm:space-y-4">
                  <div className="bg-muted rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                    {selectedAsset.fileFormat.toLowerCase().match(/^(jpg|jpeg|png|gif|webp)$/) ? (
                      <img 
                        src={selectedAsset.fileUrl} 
                        alt={selectedAsset.name}
                        className="max-w-full max-h-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        {getAssetIcon(selectedAsset)}
                        <span className="mt-2 text-base sm:text-lg font-medium">
                          {selectedAsset.fileFormat.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" className="sm:h-10" onClick={() => window.open(selectedAsset.fileUrl, '_blank')}>
                      <Download className="mr-2 h-4 w-4" />
                      <span className="hidden xs:inline">Download</span>
                    </Button>
                    <Button size="sm" className="sm:h-10" variant="outline" onClick={() => handleFileShare(selectedAsset)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      <span className="hidden xs:inline">Share Link</span>
                    </Button>
                    <Button size="sm" className="sm:h-10" variant="outline">
                      <CloudIcon className="mr-2 h-4 w-4" />
                      <span className="hidden xs:inline">Save to Drive</span>
                    </Button>
                  </div>
                </div>
                
                {/* Asset details section */}
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-medium mb-2">Asset Information</h3>
                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium truncate max-w-[60%] text-right">{selectedAsset.name}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="outline">
                          {selectedAsset.fileFormat.toUpperCase()}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Size:</span>
                        <span>{formatFileSize(selectedAsset.fileSizeKb)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Entity:</span>
                        <span className="truncate max-w-[60%] text-right">{getEntityName(selectedAsset.businessEntityId)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="truncate max-w-[60%] text-right">{formatCategoryName(selectedAsset.category)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{format(new Date(selectedAsset.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedAsset.description && (
                    <div>
                      <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Description</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">{selectedAsset.description}</p>
                    </div>
                  )}
                  
                  {selectedAsset.tags && selectedAsset.tags.length > 0 && (
                    <div>
                      <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedAsset.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Shareable Link</h3>
                    <div className="flex">
                      <Input 
                        readOnly 
                        value={`https://app.dmphq.com/assets/${selectedAsset.id}`}
                        className="flex-1 text-xs sm:text-sm h-9"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleFileShare(selectedAsset)}
                        className="ml-2 h-9 w-9"
                      >
                        {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Creative Brief Generator Tab Content */}
      <TabsContent value="creative-brief" className="mt-6">
        <CreativeBriefGenerator />
      </TabsContent>
      
      </Tabs>
      </div>
    </MainLayout>
  );
            
            {/* Navigation Tools */}
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <Breadcrumb className="hidden sm:flex">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigateToBreadcrumb(-1)}>
                      All Assets
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  
                  {currentPath.map((path, index) => (
                    <BreadcrumbItem key={index}>
                      <BreadcrumbSeparator />
                      <BreadcrumbLink onClick={() => navigateToBreadcrumb(index)}>
                        {path}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
              
              <div className="flex gap-2 items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigateUp()}
                  disabled={currentPath.length === 0}
                  className="h-9"
                >
                  <Folder className="h-4 w-4 mr-2" />
                  Up
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => resetNavigation()}
                  disabled={currentPath.length === 0}
                  className="h-9"
                >
                  <CloudIcon className="h-4 w-4 mr-2" />
                  Root
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4">
                    <div className="flex flex-1 items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground ml-2" />
                      <Input
                        placeholder="Search assets..."
                        className="flex-1"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-2 self-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        className="h-9 w-9 p-0"
                      >
                        {viewMode === 'grid' ? (
                          <List className="h-4 w-4" />
                        ) : (
                          <Grid className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-9">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Select 
                              value={selectedEntity === 'all' ? 'all' : selectedEntity} 
                              onValueChange={(value) => {
                                setSelectedEntity(value);
                                resetNavigation();
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select entity" />
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
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Button 
                        onClick={() => setUploadDialogOpen(true)}
                        className="h-9"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Creative Brief Generator Tab Content */}
        <TabsContent value="creative-brief" className="mt-6">
          <CreativeBriefGenerator />
        </TabsContent>
      </Tabs>
      
      {/* Creative Brief Dialogs have been moved to CreativeBriefGenerator component */}
    </MainLayout>
  );
}