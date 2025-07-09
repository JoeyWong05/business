import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Folder,
  FolderPlus,
  FolderInput,
  MoreHorizontal,
  Edit,
  Trash2,
  Lock,
  Share2,
  Search,
  FileText,
  Image,
  Video,
  File,
  MoveHorizontal,
  Copy,
  ArrowRight,
  ChevronRight,
  SortAsc,
  Filter,
  Check
} from "lucide-react";

import { AssetCategory, BrandAssetType, DocumentType, MediaType, TemplateType } from '@shared/assetTypes';

// Types for Asset Organizer
interface AssetFolderType {
  id: string;
  name: string;
  type: 'folder';
  icon?: React.ReactNode;
  path: string[];
  parentId?: string | null;
  assetCount: number;
  subfolderCount: number;
  createdAt: string;
  lastModified: string;
  isLocked?: boolean;
  isShared?: boolean;
  entityId?: number | null;
  category?: AssetCategory;
}

interface AssetOrganizationProps {
  onCreateFolder: (folder: Partial<AssetFolderType>) => void;
  onSelectFolder: (folderPath: string[]) => void;
  onFolderAction: (action: string, folder: AssetFolderType) => void;
  selectedFolderPath: string[];
  assetCategories: AssetCategory[];
  businessEntities: Array<{ id: number, name: string }>;
}

export default function AssetOrganizer({
  onCreateFolder,
  onSelectFolder,
  onFolderAction,
  selectedFolderPath,
  assetCategories,
  businessEntities
}: AssetOrganizationProps) {
  const { toast } = useToast();
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderEntityId, setNewFolderEntityId] = useState<string>('');
  const [newFolderCategory, setNewFolderCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [folderView, setFolderView] = useState<'tree' | 'grid'>('tree');
  const [sortBy, setSortBy] = useState<'name' | 'modified'>('name');
  
  // Sample folder structure - in a real app, these would be loaded from an API
  const [folders, setFolders] = useState<AssetFolderType[]>([
    {
      id: 'folder-1',
      name: 'Brand Assets',
      type: 'folder',
      icon: <Folder className="h-4 w-4 text-amber-500" />,
      path: ['Brand Assets'],
      assetCount: 24,
      subfolderCount: 5,
      createdAt: '2024-02-15T10:00:00Z',
      lastModified: '2025-03-20T14:30:00Z',
      category: AssetCategory.BRAND
    },
    {
      id: 'folder-2',
      name: 'Marketing Materials',
      type: 'folder',
      icon: <Folder className="h-4 w-4 text-amber-500" />,
      path: ['Marketing Materials'],
      assetCount: 32,
      subfolderCount: 3,
      createdAt: '2024-01-20T09:30:00Z',
      lastModified: '2025-03-18T11:45:00Z',
      category: AssetCategory.MEDIA
    },
    {
      id: 'folder-3',
      name: 'Presentations',
      type: 'folder',
      icon: <Folder className="h-4 w-4 text-amber-500" />,
      path: ['Presentations'],
      assetCount: 17,
      subfolderCount: 2,
      createdAt: '2024-03-05T15:20:00Z',
      lastModified: '2025-03-15T09:15:00Z',
      category: AssetCategory.DOCUMENT
    },
    {
      id: 'folder-4',
      name: 'Client Assets',
      type: 'folder',
      icon: <Folder className="h-4 w-4 text-amber-500" />,
      path: ['Client Assets'],
      assetCount: 43,
      subfolderCount: 8,
      createdAt: '2024-02-10T12:15:00Z',
      lastModified: '2025-03-22T16:45:00Z',
      category: AssetCategory.CUSTOMER
    },
    {
      id: 'folder-5',
      name: 'Templates',
      type: 'folder',
      icon: <Folder className="h-4 w-4 text-amber-500" />,
      path: ['Templates'],
      assetCount: 15,
      subfolderCount: 4,
      createdAt: '2024-03-12T11:30:00Z',
      lastModified: '2025-03-17T13:20:00Z',
      category: AssetCategory.TEMPLATE
    },
    {
      id: 'folder-6',
      name: 'Logos',
      type: 'folder',
      icon: <Folder className="h-4 w-4 text-amber-500" />,
      path: ['Brand Assets', 'Logos'],
      parentId: 'folder-1',
      assetCount: 12,
      subfolderCount: 0,
      createdAt: '2024-02-16T10:30:00Z',
      lastModified: '2025-03-20T10:15:00Z',
      category: AssetCategory.BRAND
    },
    {
      id: 'folder-7',
      name: 'Business Cards',
      type: 'folder',
      icon: <Folder className="h-4 w-4 text-amber-500" />,
      path: ['Brand Assets', 'Business Cards'],
      parentId: 'folder-1',
      assetCount: 5,
      subfolderCount: 0,
      createdAt: '2024-02-18T14:45:00Z',
      lastModified: '2025-03-19T09:30:00Z',
      category: AssetCategory.BRAND
    },
    {
      id: 'folder-8',
      name: 'Social Media Graphics',
      type: 'folder',
      icon: <Folder className="h-4 w-4 text-amber-500" />,
      path: ['Marketing Materials', 'Social Media Graphics'],
      parentId: 'folder-2',
      assetCount: 18,
      subfolderCount: 0,
      createdAt: '2024-01-22T13:15:00Z',
      lastModified: '2025-03-18T11:30:00Z',
      category: AssetCategory.MEDIA
    },
    {
      id: 'folder-9',
      name: 'Email Templates',
      type: 'folder',
      icon: <Folder className="h-4 w-4 text-amber-500" />,
      path: ['Templates', 'Email Templates'],
      parentId: 'folder-5',
      assetCount: 8,
      subfolderCount: 0,
      createdAt: '2024-03-14T09:00:00Z',
      lastModified: '2025-03-17T10:45:00Z',
      category: AssetCategory.TEMPLATE
    },
    {
      id: 'folder-10',
      name: 'Digital Merch Pros',
      type: 'folder',
      icon: <Folder className="h-4 w-4 text-amber-500" />,
      path: ['Client Assets', 'Digital Merch Pros'],
      parentId: 'folder-4',
      assetCount: 15,
      subfolderCount: 2,
      createdAt: '2024-02-12T11:00:00Z', 
      lastModified: '2025-03-22T15:30:00Z',
      entityId: 1,
      category: AssetCategory.CUSTOMER
    }
  ]);
  
  // Filter folders based on current path and search
  const getFilteredFolders = () => {
    let filteredFolders = folders;
    
    // Filter by search query if present
    if (searchQuery) {
      filteredFolders = filteredFolders.filter(folder => 
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      // When searching, show all matching folders regardless of hierarchy
      return filteredFolders;
    }
    
    // If no search, show folders based on current path
    if (selectedFolderPath.length === 0) {
      // Root level - show only top-level folders
      return filteredFolders.filter(folder => folder.path.length === 1);
    } else {
      // Inside a folder - show only direct children
      const currentPathStr = selectedFolderPath.join('/');
      return filteredFolders.filter(folder => {
        // Convert folder path to string for comparison
        const folderPathStr = folder.path.join('/');
        return folderPathStr.startsWith(currentPathStr + '/') && 
               folder.path.length === selectedFolderPath.length + 1;
      });
    }
  };

  // Get folders sorted
  const getSortedFolders = () => {
    const filtered = getFilteredFolders();
    return filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      }
    });
  };
  
  // Get breadcrumb path
  const getBreadcrumbPath = () => {
    return [
      { name: 'All Folders', path: [] },
      ...selectedFolderPath.map((folder, index) => ({
        name: folder,
        path: selectedFolderPath.slice(0, index + 1)
      }))
    ];
  };
  
  // Handle folder creation
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a folder name",
        variant: "destructive"
      });
      return;
    }
    
    const newFolder: Partial<AssetFolderType> = {
      name: newFolderName.trim(),
      path: [...selectedFolderPath, newFolderName.trim()],
      entityId: newFolderEntityId ? parseInt(newFolderEntityId) : null,
      category: newFolderCategory ? newFolderCategory as AssetCategory : undefined
    };
    
    onCreateFolder(newFolder);
    setCreateFolderOpen(false);
    setNewFolderName('');
    setNewFolderEntityId('');
    setNewFolderCategory('');
    
    toast({
      title: "Folder Created",
      description: `Folder "${newFolderName}" has been created`
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search folders..."
            className="pl-8 w-full sm:w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <Tabs value={folderView} onValueChange={(value) => setFolderView(value as 'tree' | 'grid')} className="h-9">
            <TabsList className="h-9">
              <TabsTrigger value="tree" className="h-9 px-3">Tree</TabsTrigger>
              <TabsTrigger value="grid" className="h-9 px-3">Grid</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <SortAsc className="h-4 w-4 mr-2" />
                {sortBy === 'name' ? 'Name' : 'Modified'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Name
                {sortBy === 'name' && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('modified')}>
                Last Modified
                {sortBy === 'modified' && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
            <DialogTrigger asChild>
              <Button className="h-9">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>
                  Add a new folder to organize your assets
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input
                    id="folderName"
                    placeholder="Enter folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="folderLocation">Location</Label>
                  <Input
                    id="folderLocation"
                    readOnly
                    value={selectedFolderPath.length ? `/${selectedFolderPath.join('/')}` : 'Root'}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="folderEntity">Associated Entity (Optional)</Label>
                  <select
                    id="folderEntity"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newFolderEntityId}
                    onChange={(e) => setNewFolderEntityId(e.target.value)}
                  >
                    <option value="">None (Organization-wide)</option>
                    {businessEntities.map(entity => (
                      <option key={entity.id} value={entity.id.toString()}>
                        {entity.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="folderCategory">Category (Optional)</Label>
                  <select
                    id="folderCategory"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newFolderCategory}
                    onChange={(e) => setNewFolderCategory(e.target.value)}
                  >
                    <option value="">None</option>
                    {Object.values(AssetCategory).map(category => (
                      <option key={category} value={category}>
                        {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateFolderOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFolder}>
                  Create Folder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Breadcrumb navigation */}
      {!searchQuery && (
        <div className="flex items-center mb-4 text-sm overflow-x-auto pb-1 -mr-2 pr-2 whitespace-nowrap">
          {getBreadcrumbPath().map((item, index) => (
            <React.Fragment key={index}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => onSelectFolder(item.path)}
              >
                {index === 0 ? (
                  <div className="flex items-center">
                    <Folder className="h-4 w-4 mr-1.5" />
                    {item.name}
                  </div>
                ) : (
                  <span>{item.name}</span>
                )}
              </Button>
              {index < getBreadcrumbPath().length - 1 && (
                <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      
      {/* Empty state */}
      {getSortedFolders().length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
          <FolderInput className="h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-1">No Folders Found</h3>
          <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
            {searchQuery ? `No folders match your search for "${searchQuery}"` : 
              selectedFolderPath.length > 0 ? 'This folder is empty' : 'Create folders to organize your assets'}
          </p>
          <Button onClick={() => setCreateFolderOpen(true)}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Create New Folder
          </Button>
        </div>
      )}
      
      {/* Grid view */}
      {getSortedFolders().length > 0 && folderView === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {getSortedFolders().map(folder => (
            <Card 
              key={folder.id} 
              className="cursor-pointer hover:bg-accent/30 transition-colors"
              onClick={() => onSelectFolder(folder.path)}
            >
              <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center space-x-2">
                  <Folder className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-base truncate">{folder.name}</CardTitle>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Folder Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onFolderAction('rename', folder);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onFolderAction('share', folder);
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onFolderAction('move', folder);
                      }}
                    >
                      <MoveHorizontal className="h-4 w-4 mr-2" />
                      Move
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onFolderAction('delete', folder);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              
              <CardContent className="p-4 pt-2">
                <div className="text-xs text-muted-foreground flex justify-between items-center">
                  <span>{folder.assetCount} {folder.assetCount === 1 ? 'asset' : 'assets'}</span>
                  {folder.isLocked && <Lock className="h-3.5 w-3.5" />}
                </div>
                
                <div className="mt-4 text-xs text-muted-foreground flex items-center">
                  <span>Modified {formatDate(folder.lastModified)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Tree/List view */}
      {getSortedFolders().length > 0 && folderView === 'tree' && (
        <div className="border rounded-md">
          <div className="grid grid-cols-12 bg-muted/50 p-3 text-xs font-medium">
            <div className="col-span-5 flex items-center">Name</div>
            <div className="col-span-2 hidden sm:flex items-center">Category</div>
            <div className="col-span-2 hidden sm:flex items-center">Assets</div>
            <div className="col-span-2 hidden sm:flex items-center">Modified</div>
            <div className="col-span-1 hidden sm:flex items-center justify-end">Actions</div>
          </div>
          
          <div className="divide-y">
            {getSortedFolders().map(folder => (
              <div 
                key={folder.id}
                className="grid grid-cols-12 p-3 cursor-pointer hover:bg-muted/20"
                onClick={() => onSelectFolder(folder.path)}
              >
                <div className="col-span-5 flex items-center gap-2 min-w-0">
                  <Folder className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <span className="font-medium truncate">{folder.name}</span>
                  {folder.isLocked && <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
                  {folder.isShared && <Share2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
                </div>
                
                <div className="col-span-2 hidden sm:flex items-center text-sm">
                  {folder.category && (
                    <Badge variant="outline" className="text-xs">
                      {folder.category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                    </Badge>
                  )}
                </div>
                
                <div className="col-span-2 hidden sm:flex items-center text-sm">
                  <span className="text-muted-foreground text-xs">
                    {folder.assetCount} {folder.assetCount === 1 ? 'asset' : 'assets'}
                    {folder.subfolderCount > 0 && `, ${folder.subfolderCount} subfolder${folder.subfolderCount !== 1 ? 's' : ''}`}
                  </span>
                </div>
                
                <div className="col-span-2 hidden sm:flex items-center text-sm">
                  <span className="text-muted-foreground text-xs">
                    {formatDate(folder.lastModified)}
                  </span>
                </div>
                
                <div className="col-span-7 sm:col-span-1 flex items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Folder Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onFolderAction('rename', folder);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onFolderAction('share', folder);
                        }}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onFolderAction('move', folder);
                        }}
                      >
                        <MoveHorizontal className="h-4 w-4 mr-2" />
                        Move
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onFolderAction('delete', folder);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}