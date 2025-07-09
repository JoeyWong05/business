import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import {
  Card, CardContent
} from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Icons
import {
  Search, Filter, Upload, Download, Share2, FileImage, File, Video,
  Image, FileText, ExternalLink, Grid, List, Copy, Check, CloudIcon,
  MoreHorizontal, Folder, FolderOpen, ArrowLeft, ArrowRight, Wand2, Link as LinkIcon,
  Smartphone, Download as DownloadIcon, Palette, Sparkles
} from 'lucide-react';

// Import from shared types
import { AssetCategory, AssetVisibility, MediaType, BrandAssetType, DocumentType, TemplateType, FileFormat } from '@shared/assetTypes';
import CreativeBriefGenerator from '@/components/brand-assets/CreativeBriefGenerator';
import CloudStorageIntegration from '@/components/brand-assets/CloudStorageIntegration';
import AssetOrganizer from '@/components/brand-assets/AssetOrganizer';

// Types for Asset Management
interface Asset {
  id: string;
  name: string;
  type: 'asset';
  description?: string;
  businessEntityId: number | null;
  category: AssetCategory;
  assetType: string;
  fileFormat: string;
  fileUrl: string;
  fileSizeKb: number | null;
  tags?: string[];
  visibility: AssetVisibility;
  createdAt: string;
  updatedAt?: string;
}

interface AssetFolder {
  id: string;
  name: string;
  type: 'folder';
  entityId?: number | null; // Allow null for Organization-wide folder
  category?: AssetCategory;
  assetType?: string;
  count: number;
  updatedAt: string;
  createdAt?: string; // Adding createdAt to AssetFolder interface
}

type AssetOrFolder = Asset | AssetFolder;

interface BusinessEntity {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  industry?: string;
  websiteUrl?: string;
  primaryColor?: string;
}

export default function BrandAssets() {
  // State for tabs and modals
  const [activeTab, setActiveTab] = useState<string>('assets');
  const [assetDetailsOpen, setAssetDetailsOpen] = useState<boolean>(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  // Asset management state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  
  const { toast } = useToast();
  
  // Mocked data for development
  const entities: BusinessEntity[] = [
    { id: 1, name: 'Digital Merch Pros', slug: 'digital-merch-pros', primaryColor: '#3498db' },
    { id: 2, name: 'Mystery Hype', slug: 'mystery-hype', primaryColor: '#9b59b6' },
    { id: 3, name: 'Lone Star Custom Clothing', slug: 'lone-star-custom-clothing', primaryColor: '#e74c3c' },
    { id: 4, name: 'Alcoeaze', slug: 'alcoeaze', primaryColor: '#2ecc71' },
    { id: 5, name: 'Hide Cafe Bars', slug: 'hide-cafe-bars', primaryColor: '#f39c12' }
  ];
  
  const assets: Asset[] = [
    {
      id: 'asset-1',
      name: 'Primary Logo - Digital Merch Pros',
      type: 'asset',
      description: 'Official Digital Merch Pros logo for all marketing materials',
      businessEntityId: 1,
      category: AssetCategory.BRAND,
      assetType: BrandAssetType.LOGO,
      fileFormat: FileFormat.PNG,
      fileUrl: 'https://source.unsplash.com/random/800x600/?logo',
      fileSizeKb: 256,
      tags: ['logo', 'brand', 'official'],
      visibility: AssetVisibility.PUBLIC,
      createdAt: '2023-03-15T10:00:00Z'
    },
    {
      id: 'asset-2',
      name: 'Mystery Hype Brand Guidelines',
      type: 'asset',
      businessEntityId: 2,
      category: AssetCategory.BRAND,
      assetType: BrandAssetType.BRAND_GUIDELINES,
      fileFormat: FileFormat.PDF,
      fileUrl: 'https://source.unsplash.com/random/800x600/?document',
      fileSizeKb: 4208,
      visibility: AssetVisibility.INTERNAL,
      createdAt: '2023-01-25T14:30:00Z'
    },
    {
      id: 'asset-3',
      name: 'Q4 Sales Presentation',
      type: 'asset',
      businessEntityId: null,
      category: AssetCategory.DOCUMENT,
      assetType: DocumentType.PRESENTATION,
      fileFormat: FileFormat.PPTX,
      fileUrl: 'https://source.unsplash.com/random/800x600/?presentation',
      fileSizeKb: 6582,
      tags: ['sales', 'quarterly', 'presentation'],
      visibility: AssetVisibility.INTERNAL,
      createdAt: '2023-09-30T09:15:00Z'
    },
    {
      id: 'asset-4',
      name: 'Product Photoshoot - Lone Star Hoodies',
      type: 'asset',
      businessEntityId: 3,
      category: AssetCategory.MEDIA,
      assetType: MediaType.PRODUCT_PHOTO,
      fileFormat: FileFormat.JPEG,
      fileUrl: 'https://source.unsplash.com/random/800x600/?hoodie',
      fileSizeKb: 3842,
      visibility: AssetVisibility.PUBLIC,
      createdAt: '2023-08-12T11:45:00Z'
    },
    {
      id: 'asset-5',
      name: 'Alcoeaze Instagram Template',
      type: 'asset',
      businessEntityId: 4,
      category: AssetCategory.TEMPLATE,
      assetType: TemplateType.SOCIAL_MEDIA,
      fileFormat: FileFormat.AI,
      fileUrl: 'https://source.unsplash.com/random/800x600/?template',
      fileSizeKb: 12480,
      tags: ['instagram', 'social', 'template'],
      visibility: AssetVisibility.RESTRICTED,
      createdAt: '2023-07-03T16:20:00Z',
      updatedAt: '2023-07-20T08:45:00Z'
    },
    {
      id: 'asset-6',
      name: 'Hide Cafe Promo Video',
      type: 'asset',
      businessEntityId: 5,
      category: AssetCategory.MEDIA,
      assetType: MediaType.VIDEO,
      fileFormat: FileFormat.MP4,
      fileUrl: 'https://source.unsplash.com/random/800x600/?cafe',
      fileSizeKb: 48600,
      visibility: AssetVisibility.PUBLIC,
      createdAt: '2023-05-18T13:10:00Z'
    }
  ];
  
  // Utility function to format category names for display
  const formatCategoryName = (category: string): string => {
    return category.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  // Filter assets based on search and selected filters
  const filteredAssets = assets.filter(asset => {
    // Filter by entity
    if (selectedEntity !== 'all' && asset.businessEntityId?.toString() !== selectedEntity) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== 'all' && asset.category !== selectedCategory) {
      return false;
    }
    
    // Filter by type
    if (selectedType !== 'all' && asset.assetType !== selectedType) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Generate folders based on navigation state
  const generateFolders = (): AssetFolder[] => {
    // If we're at the root level, show entity folders
    if (currentPath.length === 0) {
      return [
        {
          id: 'folder-org',
          name: 'Organization-wide',
          type: 'folder',
          entityId: null,
          count: assets.filter(asset => asset.businessEntityId === null).length,
          updatedAt: new Date().toISOString()
        },
        ...entities.map(entity => ({
          id: `folder-entity-${entity.id}`,
          name: entity.name,
          type: 'folder' as const,
          entityId: entity.id,
          count: assets.filter(asset => asset.businessEntityId === entity.id).length,
          updatedAt: new Date().toISOString()
        }))
      ];
    }
    
    // If we've selected an entity, show category folders
    if (currentPath.length === 1) {
      return Object.values(AssetCategory).map(category => {
        const categoryAssets = assets.filter(asset => 
          asset.category === category && 
          (selectedEntity === 'all' || asset.businessEntityId?.toString() === selectedEntity)
        );
        
        return {
          id: `folder-category-${category}`,
          name: formatCategoryName(category),
          type: 'folder' as const,
          category: category,
          count: categoryAssets.length,
          updatedAt: categoryAssets.length > 0 
            ? categoryAssets.reduce((latest, asset) => {
                // Handle the case where asset date properties might be undefined
                const assetDateStr = asset.updatedAt || asset.createdAt;
                const assetDate = assetDateStr ? new Date(assetDateStr) : new Date(0);
                const latestDate = latest ? new Date(latest) : new Date(0);
                return assetDate > latestDate ? assetDateStr : latest;
              }, categoryAssets[0].updatedAt || categoryAssets[0].createdAt || new Date().toISOString())
            : new Date().toISOString()
        };
      });
    }
    
    // If we've selected a category, show type folders
    if (currentPath.length === 2) {
      const assetTypes: string[] = [];
      
      // Get appropriate types based on selected category
      if (selectedCategory === AssetCategory.BRAND) {
        assetTypes.push(...Object.values(BrandAssetType));
      } else if (selectedCategory === AssetCategory.DOCUMENT) {
        assetTypes.push(...Object.values(DocumentType));
      } else if (selectedCategory === AssetCategory.MEDIA) {
        assetTypes.push(...Object.values(MediaType));
      } else if (selectedCategory === AssetCategory.TEMPLATE) {
        assetTypes.push(...Object.values(TemplateType));
      }
      
      return assetTypes.map(type => ({
        id: `folder-type-${type}`,
        name: formatCategoryName(type),
        type: 'folder' as const,
        assetType: type,
        count: assets.filter(asset => 
          asset.assetType === type && 
          (selectedEntity === 'all' || asset.businessEntityId === parseInt(selectedEntity))
        ).length,
        updatedAt: new Date().toISOString()
      }));
    }
    
    return [];
  };
  
  // Sort items by modified date
  const sortedItems = (items: AssetOrFolder[]): AssetOrFolder[] => {
    return [...items].sort((a, b) => {
      // Use fallback dates when createdAt or updatedAt might be undefined
      const dateA = a.updatedAt || (a.type === 'asset' ? a.createdAt : new Date().toISOString());
      const dateB = b.updatedAt || (b.type === 'asset' ? b.createdAt : new Date().toISOString());
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  };
  
  // Navigation functions
  const navigateToFolder = (folder: AssetOrFolder) => {
    // Make sure we're dealing with a folder, not an asset
    if (folder.type !== 'folder') return;
    
    const folderItem = folder as AssetFolder;
    
    // Handle entity folder click
    if (folderItem.entityId !== undefined) {
      setSelectedEntity(folderItem.entityId === null ? 'all' : folderItem.entityId.toString());
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
    if (entityId === null) return 'Organization-wide';
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
  
  // Render the component
  return (
    <MainLayout
      title="Brand Asset Hub"
      description="Manage assets and create professional creative briefs with AI assistance"
    >
      <div className="pb-6 max-w-[95rem] mx-auto">
        {/* Page header with decorative gradient elements */}
        <div className="relative mb-8 rounded-xl bg-gradient-to-b from-muted/50 to-background overflow-hidden border">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-primary/5 to-transparent"></div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent"></div>
          <div className="relative px-6 py-8 md:px-8 md:py-10">
            <div className="max-w-5xl">
              <div className="inline-block mb-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Digital Brand Management
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
                Brand Asset Hub
              </h1>
              <p className="text-muted-foreground text-lg max-w-3xl">
                Centralized brand asset management with cloud integration and AI-powered brief generation 
                for consistent brand representation across all channels.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-5 sm:space-y-6">
        {/* Tab Navigation */}
        <Tabs defaultValue="assets" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assets" className="flex items-center">
              <FileImage className="h-4 w-4 mr-2" />
              Asset Library
            </TabsTrigger>
            <TabsTrigger value="organize" className="flex items-center">
              <FolderOpen className="h-4 w-4 mr-2" />
              Organize
            </TabsTrigger>
            <TabsTrigger value="cloud-storage" className="flex items-center">
              <CloudIcon className="h-4 w-4 mr-2" />
              Cloud Storage
            </TabsTrigger>
            <TabsTrigger value="creative-brief" className="flex items-center">
              <Wand2 className="h-4 w-4 mr-2" />
              AI Brief Generator
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
                    <DialogContent className="sm:max-w-md" aria-describedby="share-dialog-description">
                      <DialogHeader>
                        <DialogTitle>Upload Assets</DialogTitle>
                        <DialogDescription id="share-dialog-description">
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
                            <Label htmlFor="category">Asset Category</Label>
                            <Select>
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
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpload}>Upload</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {/* Navigation breadcrumbs */}
              <div className="flex flex-wrap items-center gap-1.5 text-sm bg-muted/30 p-2 rounded-lg border">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 hover:bg-background/80 transition-colors"
                  onClick={resetNavigation}
                >
                  <Folder className="h-4 w-4 mr-1.5 text-primary" />
                  <span className="font-medium">Assets Home</span>
                </Button>
                
                {currentPath.length > 0 && (
                  <>
                    <span className="text-muted-foreground">/</span>
                    {currentPath.map((path, index) => (
                      <React.Fragment key={index}>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => navigateToBreadcrumb(index)}
                        >
                          {index === currentPath.length - 1 ? (
                            <span className="font-medium">{path}</span>
                          ) : (
                            path
                          )}
                        </Button>
                        {index < currentPath.length - 1 && (
                          <span className="text-muted-foreground">/</span>
                        )}
                      </React.Fragment>
                    ))}
                  </>
                )}
                
                {currentPath.length > 0 && (
                  <Button 
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 ml-2"
                    onClick={navigateUp}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              
              {/* Asset Grid or List */}
              {currentItems.length === 0 ? (
                <div className="border border-dashed rounded-lg p-10 py-16 text-center bg-muted/5">
                  <div className="mx-auto w-24 h-24 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-5">
                    <FileImage className="h-10 w-10 text-primary/60" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Assets Found</h3>
                  <p className="text-muted-foreground text-base max-w-md mx-auto mb-6">
                    {searchQuery 
                      ? `No results for "${searchQuery}". Try adjusting your search.` 
                      : selectedEntity !== 'all' || selectedCategory !== 'all' || selectedType !== 'all'
                        ? "No assets match your current filters. Try adjusting your filter criteria."
                        : "Start building your brand asset library by uploading your first assets."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => setUploadDialogOpen(true)} size="lg" className="px-6">
                      <Upload className="h-5 w-5 mr-2" />
                      Upload New Assets
                    </Button>
                    {(searchQuery || selectedEntity !== 'all' || selectedCategory !== 'all' || selectedType !== 'all') && (
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="px-6"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedEntity('all');
                          setSelectedCategory('all');
                          setSelectedType('all');
                        }}
                      >
                        <Filter className="h-5 w-5 mr-2" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              ) : viewMode === 'grid' ? (
                // Grid view
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {currentItems.map((item) => (
                    'type' in item && item.type === 'folder' ? (
                      // Folder item
                      <Card 
                        key={item.id} 
                        className="overflow-hidden cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group border border-border/60" 
                        onClick={() => navigateToFolder(item)}
                      >
                        <div className="p-4 pb-3 flex items-center justify-center">
                          <div 
                            className="w-full aspect-[4/3] rounded-lg flex flex-col justify-center items-center transition-all"
                            style={{
                              background: 'linear-gradient(135deg, var(--primary)/5% 0%, var(--secondary)/30% 100%)'
                            }}
                          >
                            <div className="relative flex justify-center items-center mb-2">
                              <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl opacity-60 scale-75"></div>
                              <div className="relative bg-background/80 backdrop-blur-sm h-16 w-16 rounded-xl border border-primary/10 flex justify-center items-center shadow-sm transition-transform group-hover:scale-110 duration-300">
                                <FolderOpen className="h-8 w-8 text-primary/80 transition-all group-hover:text-primary" />
                              </div>
                            </div>
                            <span className="text-sm font-medium text-center px-2 py-1 rounded-full bg-background/70 shadow-sm backdrop-blur-sm border border-primary/5 transition-all duration-300 group-hover:bg-background/90">
                              {item.type === 'folder' ? `${(item as AssetFolder).count} ${(item as AssetFolder).count === 1 ? 'item' : 'items'}` : ''}
                            </span>
                          </div>
                        </div>
                        <CardContent className="px-4 pt-1 pb-4 relative">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-sm sm:text-base font-semibold mb-0.5 truncate w-full">{item.name}</h3>
                              <div className="flex items-center gap-1.5">
                                {/* Display folder type if available */}
                                <Badge 
                                  variant="outline" 
                                  className="text-xs py-0 px-1.5 h-5 font-medium border-primary/10 bg-primary/5"
                                >
                                  Folder
                                </Badge>
                                {/* Show category if folder has one */}
                                {(item as AssetFolder).category && (
                                  <span className="text-xs text-muted-foreground">
                                    {formatCategoryName((item as AssetFolder).category as string)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -top-[65px] right-3">
                              <Button 
                                size="icon" 
                                variant="secondary"
                                className="h-9 w-9 bg-background/90 backdrop-blur-sm hover:bg-background shadow-md"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Folder details section */}
                          <div className="mt-3 pt-2 border-t border-border/40 flex justify-between items-center">
                            <div className="text-xs text-muted-foreground">
                              {(item as AssetFolder).updatedAt ? 
                                `Modified ${format(new Date((item as AssetFolder).updatedAt || new Date()), 'MMM d')}` : 
                                (item as AssetFolder).createdAt ? 
                                  `Created ${format(new Date((item as AssetFolder).createdAt || new Date()), 'MMM d')}` : 
                                  'Recently updated'}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      // Asset item
                      <Card 
                        key={item.id} 
                        className="overflow-hidden group hover:shadow-md transition-all border border-border/60 relative"
                        onClick={() => handleFileSelect(item as Asset)}
                      >
                        {/* Enterprise-level visual badge based on entity */}
                        {(item as Asset).businessEntityId && (
                          <div className="absolute top-0 right-0 h-8 w-8 z-10">
                            <div 
                              className="absolute top-0 right-0 h-0 w-0 border-t-[30px] border-r-[30px]" 
                              style={{
                                borderTopColor: (item as Asset).businessEntityId ? 
                                  entities.find(e => e.id === (item as Asset).businessEntityId)?.primaryColor || 'currentColor' : 
                                  'currentColor',
                                borderRightColor: 'transparent'
                              }}
                            />
                          </div>
                        )}
                      
                        <div className="aspect-[4/3] relative overflow-hidden">
                          {/* Background gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-muted/40 z-0"></div>
                          
                          {/* Image or file type display */}
                          {('fileFormat' in item) && item.fileFormat?.toLowerCase().match(/^(jpg|jpeg|png|gif|webp)$/) ? (
                            <>
                              <img 
                                src={('fileUrl' in item) ? item.fileUrl : ''}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105 z-0"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 z-1"></div>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-muted/20 to-muted/40">
                              {'fileFormat' in item && (
                                <>
                                  <div 
                                    className="h-20 w-20 flex items-center justify-center p-3 mb-2 rounded-xl drop-shadow-sm border border-primary/10"
                                    style={{
                                      background: 'radial-gradient(circle, var(--background) 0%, var(--muted) 100%)'
                                    }}
                                  >
                                    {getAssetIcon(item as Asset)}
                                  </div>
                                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-background/80 shadow-sm">
                                    {(item as Asset).fileFormat.toUpperCase()} File
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                          
                          {/* Category tag with enhanced styling */}
                          <div className="absolute top-2 left-2 z-10">
                            <Badge variant="secondary" className="backdrop-blur-sm bg-background/70 text-xs font-medium shadow-sm border border-border/40">
                              {formatCategoryName((item as Asset).category as string)}
                            </Badge>
                          </div>
                          
                          {/* Overlay actions - improved positioning and animations */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 z-20">
                            <div className="flex flex-row gap-1 scale-90 group-hover:scale-100 transition-all duration-300">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      size="icon" 
                                      variant="secondary"
                                      className="h-9 w-9 bg-background/80 backdrop-blur-sm hover:bg-background/95"
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
                                      className="h-9 w-9 bg-background/80 backdrop-blur-sm hover:bg-background/95"
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
                                      className="h-9 w-9 bg-background/80 backdrop-blur-sm hover:bg-background/95"
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
                        </div>
                        
                        <CardContent className="p-4 pb-5">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm sm:text-base truncate leading-tight mb-1">{item.name}</h3>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className="text-xs py-0 px-1.5 h-5 font-medium border-primary/20 bg-primary/5"
                                >
                                  {(item as Asset).fileFormat.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-muted-foreground truncate">
                                  {getEntityName((item as Asset).businessEntityId)}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                              {(item as Asset).fileSizeKb && formatFileSize((item as Asset).fileSizeKb)}
                            </div>
                          </div>
                          
                          {/* Additional metadata section */}
                          <div className="mt-3 pt-2 border-t border-border/40 flex justify-between items-center">
                            <div className="text-xs text-muted-foreground">
                              {(item as Asset).updatedAt ? 
                                `Updated ${format(new Date((item as Asset).updatedAt || new Date()), 'MMM d')}` : 
                                `Added ${format(new Date((item as Asset).createdAt || new Date()), 'MMM d')}`}
                            </div>
                            {(item as Asset).tags && ((item as Asset).tags?.length || 0) > 0 && (
                              <div className="flex -space-x-2">
                                {(item as Asset).tags?.slice(0, 3).map((tag, i) => (
                                  <Badge 
                                    key={i}
                                    variant="outline" 
                                    className="text-[10px] h-5 border-primary/10 bg-primary/5 hover:bg-primary/10 px-2 transition-colors font-medium"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {((item as Asset).tags?.length || 0) > 3 && (
                                  <Badge 
                                    variant="outline" 
                                    className="text-[10px] h-5 border-primary/10 bg-muted/20 hover:bg-muted/40 px-2 transition-colors font-medium rounded-full"
                                  >
                                    +{((item as Asset).tags?.length || 0) - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
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
              )}
            </div>
          </TabsContent>

          {/* Asset Organization Tab Content */}
          <TabsContent value="organize" className="mt-6">
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-1">Folder Organization</h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Create and manage folder structure for better asset organization
                  </p>
                </div>
              </div>
              
              <AssetOrganizer 
                selectedFolderPath={currentPath}
                assetCategories={Object.values(AssetCategory)}
                businessEntities={entities}
                onSelectFolder={(folderPath) => {
                  setCurrentPath(folderPath);
                  // Set the tab back to assets to show assets in this folder
                  if (folderPath.length > 0) {
                    setActiveTab('assets');
                  }
                }}
                onCreateFolder={(folder) => {
                  toast({
                    title: "Folder Created",
                    description: `New folder "${folder.name}" has been created`,
                  });
                }}
                onFolderAction={(action, folder) => {
                  if (action === 'delete') {
                    toast({
                      title: "Folder Deleted",
                      description: `Folder "${folder.name}" has been removed`,
                    });
                  } else if (action === 'rename') {
                    toast({
                      title: "Folder Renamed",
                      description: `Folder has been renamed successfully`,
                    });
                  } else if (action === 'share') {
                    toast({
                      title: "Folder Shared",
                      description: `Share link has been copied to clipboard`,
                    });
                  } else if (action === 'move') {
                    toast({
                      title: "Folder Moved",
                      description: `Folder "${folder.name}" has been moved`,
                    });
                  }
                }}
              />
            </div>
          </TabsContent>
          
          {/* Cloud Storage Integration Tab Content */}
          <TabsContent value="cloud-storage" className="mt-6">
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-1">Cloud Storage Integration</h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Connect to cloud storage services and import assets directly
                  </p>
                </div>
              </div>
              
              <CloudStorageIntegration 
                onAssetImport={(importedAssets) => {
                  toast({
                    title: "Assets Imported",
                    description: `${importedAssets.length} files imported from cloud storage`,
                  });
                  // In a real implementation, we would add these files to the assets state
                  // and potentially save them to the database
                }} 
              />
            </div>
          </TabsContent>
          
          {/* Creative Brief Generator Tab Content */}
          <TabsContent value="creative-brief" className="mt-6">
            <CreativeBriefGenerator />
          </TabsContent>
        </Tabs>
        </div>
      </div>
      
      {/* Asset Details Dialog */}
      <Dialog open={assetDetailsOpen} onOpenChange={setAssetDetailsOpen}>
        <DialogContent className="w-[95vw] max-w-4xl p-4 sm:p-6" aria-describedby="asset-details-description">
          {selectedAsset && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">{selectedAsset.name}</DialogTitle>
                <DialogDescription id="asset-details-description" className="text-sm">
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
    </MainLayout>
  );
}