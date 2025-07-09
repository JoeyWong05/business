import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FolderOpen, 
  Upload, 
  Download, 
  Search, 
  FileText, 
  Image, 
  Video, 
  File, 
  MoreHorizontal, 
  ChevronRight, 
  Calendar, 
  ArrowUpRight,
  Filter,
  Eye,
  Star,
  Plus,
  PictureInPicture,
  Presentation,
  FileIcon,
  Lock,
  User,
  UserCheck,
  Users,
  Globe
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AssetsLibraryProps {
  companyId: string;
  companyBranding: {
    name: string;
    logo: string;
    logoFallback: string;
    primaryColor: string;
    secondaryColor: string;
    gradient: string;
  };
}

interface AssetFolder {
  id: string;
  name: string;
  type: 'folder';
  assetCount: number;
  updatedAt: Date;
  visibility: 'public' | 'internal' | 'partners' | 'private';
}

interface Asset {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'video' | 'document' | 'presentation' | 'spreadsheet';
  fileExtension: string;
  fileSize: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByAvatar?: string;
  previewUrl?: string;
  downloadUrl: string;
  description?: string;
  categories: string[];
  visibility: 'public' | 'internal' | 'partners' | 'private';
  starred: boolean;
}

type AssetItem = AssetFolder | Asset;

// Sample data for folders
const getSampleFolders = (): AssetFolder[] => [
  {
    id: 'folder1',
    name: 'Pitch Decks',
    type: 'folder',
    assetCount: 5,
    updatedAt: new Date(2023, 5, 15),
    visibility: 'partners'
  },
  {
    id: 'folder2',
    name: 'Fundraising Documents',
    type: 'folder',
    assetCount: 8,
    updatedAt: new Date(2023, 6, 10),
    visibility: 'partners'
  },
  {
    id: 'folder3',
    name: 'Roadmaps & Vision',
    type: 'folder',
    assetCount: 3,
    updatedAt: new Date(2023, 6, 22),
    visibility: 'internal'
  },
  {
    id: 'folder4',
    name: 'Legal Agreements',
    type: 'folder',
    assetCount: 12,
    updatedAt: new Date(2023, 4, 8),
    visibility: 'private'
  },
  {
    id: 'folder5',
    name: 'Brand Materials',
    type: 'folder',
    assetCount: 15,
    updatedAt: new Date(2023, 7, 2),
    visibility: 'public'
  }
];

// Sample data for assets by company
const getSampleAssets = (companyId: string): Asset[] => {
  const commonAssets = [
    {
      id: 'asset1',
      name: 'Investor One-Pager',
      type: 'pdf' as const,
      fileExtension: 'pdf',
      fileSize: '1.7 MB',
      createdAt: new Date(2023, 5, 15),
      updatedAt: new Date(2023, 5, 15),
      createdBy: 'Sarah Johnson',
      createdByAvatar: '/avatars/sarah.jpg',
      downloadUrl: '/assets/investor-one-pager.pdf',
      categories: ['investor', 'marketing'],
      visibility: 'partners' as const,
      starred: true
    },
    {
      id: 'asset2',
      name: 'Company Overview',
      type: 'presentation' as const,
      fileExtension: 'pptx',
      fileSize: '8.5 MB',
      createdAt: new Date(2023, 4, 28),
      updatedAt: new Date(2023, 6, 10),
      createdBy: 'David Wilson',
      createdByAvatar: '/avatars/david.jpg',
      downloadUrl: '/assets/company-overview.pptx',
      description: 'Complete company overview with market positioning, competitive analysis, and growth metrics.',
      categories: ['presentation', 'overview'],
      visibility: 'internal' as const,
      starred: true
    },
    {
      id: 'asset3',
      name: 'Legal Structure Diagram',
      type: 'image' as const,
      fileExtension: 'png',
      fileSize: '360 KB',
      createdAt: new Date(2023, 3, 15),
      updatedAt: new Date(2023, 3, 15),
      createdBy: 'Jennifer Lopez',
      createdByAvatar: '/avatars/jennifer.jpg',
      previewUrl: '/assets/previews/legal-structure.png',
      downloadUrl: '/assets/legal-structure.png',
      categories: ['legal', 'diagram'],
      visibility: 'partners' as const,
      starred: false
    }
  ];

  // Company-specific assets
  const companyAssets: Record<string, Asset[]> = {
    'dmp': [
      {
        id: 'asset4',
        name: 'DMP Product Roadmap 2023-2024',
        type: 'pdf' as const,
        fileExtension: 'pdf',
        fileSize: '3.2 MB',
        createdAt: new Date(2023, 6, 20),
        updatedAt: new Date(2023, 6, 20),
        createdBy: 'Marcus Chen',
        createdByAvatar: '/avatars/marcus.jpg',
        downloadUrl: '/assets/dmp-roadmap-2023.pdf',
        description: 'Product development roadmap for the next 18 months with milestone targets.',
        categories: ['roadmap', 'product'],
        visibility: 'internal' as const,
        starred: true
      },
      {
        id: 'asset5',
        name: 'Digital Merch Pros Brand Guidelines',
        type: 'pdf' as const,
        fileExtension: 'pdf',
        fileSize: '5.8 MB',
        createdAt: new Date(2023, 2, 5),
        updatedAt: new Date(2023, 2, 5),
        createdBy: 'Sarah Johnson',
        createdByAvatar: '/avatars/sarah.jpg',
        downloadUrl: '/assets/dmp-brand-guidelines.pdf',
        categories: ['brand', 'guidelines'],
        visibility: 'public' as const,
        starred: false
      }
    ],
    'mystery-hype': [
      {
        id: 'asset4',
        name: 'Mystery Hype Market Analysis',
        type: 'spreadsheet' as const,
        fileExtension: 'xlsx',
        fileSize: '2.1 MB',
        createdAt: new Date(2023, 5, 28),
        updatedAt: new Date(2023, 5, 28),
        createdBy: 'Daniel Kim',
        createdByAvatar: '/avatars/daniel.jpg',
        downloadUrl: '/assets/mystery-hype-market-analysis.xlsx',
        description: 'Detailed market analysis with competitive positioning and growth opportunities.',
        categories: ['market', 'analysis'],
        visibility: 'partners' as const,
        starred: true
      }
    ],
    'lonestar': [
      {
        id: 'asset4',
        name: 'Manufacturing Process Overview',
        type: 'video' as const,
        fileExtension: 'mp4',
        fileSize: '45 MB',
        createdAt: new Date(2023, 6, 15),
        updatedAt: new Date(2023, 6, 15),
        createdBy: 'Sarah Johnson',
        createdByAvatar: '/avatars/sarah.jpg',
        previewUrl: '/assets/previews/manufacturing-video.jpg',
        downloadUrl: '/assets/manufacturing-process.mp4',
        description: 'Walk-through of our custom clothing manufacturing process and quality control.',
        categories: ['manufacturing', 'process', 'video'],
        visibility: 'internal' as const,
        starred: false
      }
    ],
    'alcoease': [
      {
        id: 'asset4',
        name: 'Clinical Trial Results',
        type: 'pdf' as const,
        fileExtension: 'pdf',
        fileSize: '7.4 MB',
        createdAt: new Date(2023, 5, 10),
        updatedAt: new Date(2023, 5, 10),
        createdBy: 'Ryan Cooper',
        createdByAvatar: '/avatars/ryan.jpg',
        downloadUrl: '/assets/alcoease-trial-results.pdf',
        description: 'Complete results from our clinical trials with statistical analysis.',
        categories: ['clinical', 'research', 'results'],
        visibility: 'partners' as const,
        starred: true
      }
    ],
    'hide-cafe': [
      {
        id: 'asset4',
        name: 'Expansion Locations Map',
        type: 'image' as const,
        fileExtension: 'jpg',
        fileSize: '1.2 MB',
        createdAt: new Date(2023, 6, 5),
        updatedAt: new Date(2023, 6, 5),
        createdBy: 'Emma Wong',
        createdByAvatar: '/avatars/emma.jpg',
        previewUrl: '/assets/previews/expansion-map.jpg',
        downloadUrl: '/assets/expansion-map.jpg',
        description: 'Map of planned expansion locations over the next 24 months.',
        categories: ['expansion', 'growth', 'locations'],
        visibility: 'private' as const,
        starred: false
      }
    ]
  };

  const companySpecificAssets = companyAssets[companyId] || [];
  return [...commonAssets, ...companySpecificAssets];
};

export function AssetsLibrary({ companyId, companyBranding }: AssetsLibraryProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [currentFolder, setCurrentFolder] = useState<AssetFolder | null>(null);
  
  const folders = getSampleFolders();
  const assets = getSampleAssets(companyId);
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Get breadcrumbs
  const getBreadcrumbs = () => {
    const breadcrumbs = [{ name: 'Home', id: 'home' }];
    if (currentFolder) {
      breadcrumbs.push({ name: currentFolder.name, id: currentFolder.id });
    }
    return breadcrumbs;
  };
  
  // Get icon for file type
  const getFileIcon = (type: string, extension: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'image':
        return <Image className="h-6 w-6 text-blue-500" />;
      case 'video':
        return <Video className="h-6 w-6 text-purple-500" />;
      case 'presentation':
        return <Presentation className="h-6 w-6 text-orange-500" />;
      case 'spreadsheet':
        return <FileIcon className="h-6 w-6 text-green-500" />;
      case 'document':
        return <FileText className="h-6 w-6 text-sky-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };
  
  // Get icon for visibility
  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe className="h-4 w-4" title="Public" />;
      case 'internal':
        return <Users className="h-4 w-4" title="Internal" />;
      case 'partners':
        return <UserCheck className="h-4 w-4" title="Partners" />;
      case 'private':
        return <Lock className="h-4 w-4" title="Private" />;
      default:
        return <User className="h-4 w-4" title="Unknown" />;
    }
  };
  
  // Filter assets based on active tab and search query
  const filteredItems = () => {
    let items: AssetItem[] = [];
    
    // If we're in a folder, only show assets
    if (currentFolder) {
      items = assets;
    } else {
      // Otherwise show folders and all assets not in folders
      items = [...folders, ...assets];
    }
    
    // Apply tab filters
    if (activeTab === 'presentations') {
      items = items.filter(item => 'type' in item && (item.type === 'presentation' || item.type === 'pdf'));
    } else if (activeTab === 'media') {
      items = items.filter(item => 'type' in item && (item.type === 'image' || item.type === 'video'));
    } else if (activeTab === 'documents') {
      items = items.filter(item => 'type' in item && (item.type === 'document' || item.type === 'spreadsheet'));
    } else if (activeTab === 'brand') {
      items = items.filter(item => 'categories' in item && item.categories.includes('brand'));
    } else if (activeTab === 'starred') {
      items = items.filter(item => 'starred' in item && item.starred);
    }
    
    // Apply search if present
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => item.name.toLowerCase().includes(query));
    }
    
    return items;
  };
  
  return (
    <div className="space-y-8">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold">Assets & Documents Library</h3>
          <p className="text-muted-foreground">Access company documents, presentations, and brand assets</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={createFolderDialogOpen} onOpenChange={setCreateFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FolderOpen className="h-4 w-4" />
                <span>New Folder</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>
                  Create a new folder to organize your assets and documents.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="folder-name">Folder Name</label>
                  <input id="folder-name" className="col-span-3 p-2 border rounded" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="folder-visibility">Visibility</label>
                  <select id="folder-visibility" className="col-span-3 p-2 border rounded">
                    <option value="public">Public - Visible to everyone</option>
                    <option value="internal">Internal - Company members only</option>
                    <option value="partners">Partners - Partners and investors only</option>
                    <option value="private">Private - Admins only</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateFolderDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setCreateFolderDialogOpen(false)}>Create Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                <span>Upload Files</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Upload Files</DialogTitle>
                <DialogDescription>
                  Upload documents, presentations, or media files to the library.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="border-2 border-dashed rounded-md p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Drag and drop files here, or click to browse</p>
                  <input type="file" className="hidden" id="file-upload" multiple />
                  <Button className="mt-4" onClick={() => document.getElementById('file-upload')?.click()}>
                    Select Files
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="folder">Destination Folder</label>
                  <select id="folder" className="col-span-3 p-2 border rounded">
                    <option value="root">Root Directory</option>
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="visibility">Visibility</label>
                  <select id="visibility" className="col-span-3 p-2 border rounded">
                    <option value="public">Public - Visible to everyone</option>
                    <option value="internal">Internal - Company members only</option>
                    <option value="partners">Partners - Partners and investors only</option>
                    <option value="private">Private - Admins only</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right" htmlFor="categories">Categories</label>
                  <input id="categories" className="col-span-3 p-2 border rounded" placeholder="E.g. brand, legal, marketing (comma separated)" />
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <label className="text-right pt-2" htmlFor="description">Description</label>
                  <textarea id="description" className="col-span-3 p-2 border rounded" rows={3} placeholder="Optional description for the uploaded files"></textarea>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setUploadDialogOpen(false)}>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Search and navigation */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search assets and documents..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
          {getBreadcrumbs().map((breadcrumb, index) => (
            <React.Fragment key={breadcrumb.id}>
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              <Button 
                variant="link" 
                className="h-auto p-0 text-muted-foreground"
                onClick={() => {
                  if (breadcrumb.id === 'home') {
                    setCurrentFolder(null);
                  }
                }}
              >
                {breadcrumb.name}
              </Button>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="presentations">Pitch & Presentations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="brand">Brand Assets</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {/* Assets grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems().map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {'type' in item && item.type !== 'folder' ? (
                  // File asset
                  <>
                    <div className="h-32 bg-muted flex items-center justify-center">
                      {item.type === 'image' && item.previewUrl ? (
                        <div 
                          className="w-full h-full bg-center bg-cover" 
                          style={{ backgroundImage: `url(${item.previewUrl})` }}
                          onClick={() => setPreviewAsset(item)}
                        />
                      ) : item.type === 'video' && item.previewUrl ? (
                        <div 
                          className="relative w-full h-full bg-center bg-cover cursor-pointer" 
                          style={{ backgroundImage: `url(${item.previewUrl})` }}
                          onClick={() => setPreviewAsset(item)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="h-12 w-12 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          {getFileIcon(item.type, item.fileExtension)}
                          <p className="mt-2 text-muted-foreground text-xs">{item.fileExtension.toUpperCase()}</p>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base truncate max-w-[220px]">{item.name}</CardTitle>
                            {item.starred && <Star className="h-4 w-4 text-amber-500" />}
                          </div>
                          <CardDescription className="flex items-center gap-1">
                            <span>{item.fileSize}</span>
                            <span>•</span>
                            <span>{item.fileExtension.toUpperCase()}</span>
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => setPreviewAsset(item)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Preview</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Download className="mr-2 h-4 w-4" />
                              <span>Download</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Star className="mr-2 h-4 w-4" />
                              <span>{item.starred ? 'Remove Star' : 'Star'}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <ArrowUpRight className="mr-2 h-4 w-4" />
                              <span>Share</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      )}
                    </CardContent>
                    <CardFooter className="pt-2 pb-3 text-xs text-muted-foreground flex justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={item.createdByAvatar} alt={item.createdBy} />
                          <AvatarFallback>{item.createdBy.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{item.createdBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getVisibilityIcon(item.visibility)}
                        <span>{formatDate(item.updatedAt)}</span>
                      </div>
                    </CardFooter>
                  </>
                ) : (
                  // Folder
                  <>
                    <div 
                      className="p-4 cursor-pointer"
                      onClick={() => setCurrentFolder(item as AssetFolder)}
                    >
                      <div className="flex items-start gap-3">
                        <FolderOpen className="h-10 w-10 text-amber-500" />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {(item as AssetFolder).assetCount} {(item as AssetFolder).assetCount === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {getVisibilityIcon((item as AssetFolder).visibility)}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {(item as AssetFolder).visibility === 'public' && 'Public - Visible to everyone'}
                                  {(item as AssetFolder).visibility === 'internal' && 'Internal - Company members only'}
                                  {(item as AssetFolder).visibility === 'partners' && 'Partners - Partners and investors only'}
                                  {(item as AssetFolder).visibility === 'private' && 'Private - Admins only'}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <span className="text-xs text-muted-foreground mt-1">Updated {formatDate((item as AssetFolder).updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            ))}
            
            {/* Empty state */}
            {filteredItems().length === 0 && (
              <div className="col-span-full p-12 text-center">
                <File className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium">No assets found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? `No results found for "${searchQuery}"`
                    : 'No assets available in this category'}
                </p>
                {searchQuery && (
                  <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Asset preview dialog */}
      <Dialog open={!!previewAsset} onOpenChange={(open) => !open && setPreviewAsset(null)}>
        {previewAsset && (
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getFileIcon(previewAsset.type, previewAsset.fileExtension)}
                <span>{previewAsset.name}</span>
              </DialogTitle>
              <DialogDescription>
                {previewAsset.type.charAt(0).toUpperCase() + previewAsset.type.slice(1)} • {previewAsset.fileSize} • Uploaded by {previewAsset.createdBy}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {previewAsset.type === 'image' && previewAsset.previewUrl ? (
                <div className="bg-muted rounded-md overflow-hidden">
                  <img 
                    src={previewAsset.previewUrl} 
                    alt={previewAsset.name} 
                    className="max-h-[60vh] mx-auto"
                  />
                </div>
              ) : previewAsset.type === 'video' && previewAsset.previewUrl ? (
                <div className="bg-black h-[60vh] flex items-center justify-center rounded-md">
                  <div className="flex flex-col items-center gap-4">
                    <Video className="h-16 w-16 text-white/50" />
                    <p className="text-white/70">Video Preview</p>
                    <Button variant="outline" className="bg-transparent text-white border-white">
                      <Play className="mr-2 h-4 w-4" />
                      Play Video
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-muted h-[60vh] flex items-center justify-center rounded-md">
                  <div className="flex flex-col items-center gap-4">
                    {getFileIcon(previewAsset.type, previewAsset.fileExtension)}
                    <p className="text-muted-foreground">{previewAsset.type.charAt(0).toUpperCase() + previewAsset.type.slice(1)} Preview</p>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Download {previewAsset.fileExtension.toUpperCase()}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <Separator />
            <div className="py-2">
              <h4 className="font-medium mb-2">Details</h4>
              {previewAsset.description && (
                <p className="text-sm mb-4">{previewAsset.description}</p>
              )}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Created</div>
                <div>{formatDate(previewAsset.createdAt)}</div>
                
                <div className="text-muted-foreground">Last Updated</div>
                <div>{formatDate(previewAsset.updatedAt)}</div>
                
                <div className="text-muted-foreground">Categories</div>
                <div className="flex flex-wrap gap-1">
                  {previewAsset.categories.map(category => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
                
                <div className="text-muted-foreground">Visibility</div>
                <div className="flex items-center gap-1">
                  {getVisibilityIcon(previewAsset.visibility)}
                  <span>
                    {previewAsset.visibility === 'public' && 'Public'}
                    {previewAsset.visibility === 'internal' && 'Internal'}
                    {previewAsset.visibility === 'partners' && 'Partners'}
                    {previewAsset.visibility === 'private' && 'Private'}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewAsset(null)}>Close</Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}