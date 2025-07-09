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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  CloudIcon,
  Download,
  ExternalLink,
  Smartphone as SmartphoneIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  RefreshCcw,
  Link as LinkIcon,
  Box,
  FileText,
  Upload,
  ArrowRight,
  Settings
} from "lucide-react";

// Mock cloud provider icons
const GoogleDriveIcon = () => <Box className="text-blue-500 h-5 w-5" />;
const DropboxIcon = () => <Box className="text-blue-700 h-5 w-5" />;

interface CloudStorageIntegrationProps {
  onAssetImport: (assets: any[]) => void;
}

interface CloudConnection {
  id: string;
  type: 'googledrive' | 'dropbox' | 'onedrive' | 'box';
  name: string;
  status: 'connected' | 'disconnected';
  lastSync?: string;
}

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  lastModified?: string;
  iconUrl?: string;
  thumbnailUrl?: string;
  path?: string;
}

export default function CloudStorageIntegration({ onAssetImport }: CloudStorageIntegrationProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('connect');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [importInProgress, setImportInProgress] = useState(false);

  // Mock data for connected cloud services
  const [connectedServices, setConnectedServices] = useState<CloudConnection[]>([
    {
      id: 'gd-1',
      type: 'googledrive',
      name: 'Google Drive',
      status: 'connected',
      lastSync: '2025-03-24T15:30:00Z'
    }
  ]);

  // Mock data for files
  const [files, setFiles] = useState<FileItem[]>([
    { id: 'folder-1', name: 'Brand Assets', type: 'folder' },
    { id: 'folder-2', name: 'Marketing Materials', type: 'folder' },
    { id: 'file-1', name: 'Logo.png', type: 'file', size: '1.2 MB', lastModified: '2025-03-20T10:22:00Z', thumbnailUrl: 'https://source.unsplash.com/random/100x100/?logo' },
    { id: 'file-2', name: 'Presentation.pptx', type: 'file', size: '4.5 MB', lastModified: '2025-03-18T14:15:00Z' },
    { id: 'file-3', name: 'Brand Guidelines.pdf', type: 'file', size: '8.7 MB', lastModified: '2025-03-15T09:30:00Z' },
  ]);

  const handleConnect = (provider: string) => {
    setIsLoading(true);
    
    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      
      if (provider === 'googledrive' && !connectedServices.some(s => s.type === 'googledrive')) {
        setConnectedServices([
          ...connectedServices,
          {
            id: 'gd-1',
            type: 'googledrive',
            name: 'Google Drive',
            status: 'connected',
            lastSync: new Date().toISOString()
          }
        ]);
      } else if (provider === 'dropbox' && !connectedServices.some(s => s.type === 'dropbox')) {
        setConnectedServices([
          ...connectedServices,
          {
            id: 'db-1',
            type: 'dropbox',
            name: 'Dropbox',
            status: 'connected',
            lastSync: new Date().toISOString()
          }
        ]);
      }
      
      toast({
        title: "Connected Successfully",
        description: `Your ${provider === 'googledrive' ? 'Google Drive' : 'Dropbox'} account is now connected`,
      });
      
      setActiveTab('browse');
    }, 2000);
  };

  const handleDisconnect = (serviceId: string) => {
    setConnectedServices(connectedServices.filter(service => service.id !== serviceId));
    
    toast({
      title: "Disconnected",
      description: "Cloud storage disconnected successfully",
    });
  };

  const handleOpenFolder = (folderId: string) => {
    setCurrentPath([...currentPath, folderId]);
    // In a real implementation, this would fetch the contents of the folder
    // For this demo, we'll just simulate different files at different paths
    if (currentPath.length === 0) {
      setFiles([
        { id: 'subfolder-1', name: 'Logos', type: 'folder' },
        { id: 'subfolder-2', name: 'Photos', type: 'folder' },
        { id: 'subfile-1', name: 'Main Logo.svg', type: 'file', size: '0.5 MB', lastModified: '2025-03-22T08:40:00Z', thumbnailUrl: 'https://source.unsplash.com/random/100x100/?logo' },
        { id: 'subfile-2', name: 'Business Card.pdf', type: 'file', size: '2.3 MB', lastModified: '2025-03-21T16:25:00Z' },
      ]);
    } else {
      setFiles([
        { id: 'subsubfile-1', name: 'Logo - Dark.png', type: 'file', size: '0.8 MB', lastModified: '2025-03-23T11:15:00Z', thumbnailUrl: 'https://source.unsplash.com/random/100x100/?dark-logo' },
        { id: 'subsubfile-2', name: 'Logo - Light.png', type: 'file', size: '0.7 MB', lastModified: '2025-03-23T11:16:00Z', thumbnailUrl: 'https://source.unsplash.com/random/100x100/?light-logo' },
        { id: 'subsubfile-3', name: 'Icon.svg', type: 'file', size: '0.2 MB', lastModified: '2025-03-23T11:20:00Z', thumbnailUrl: 'https://source.unsplash.com/random/100x100/?icon' },
      ]);
    }
  };

  const handleNavigateBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
      // Reset to original files when going back to root
      if (currentPath.length === 1) {
        setFiles([
          { id: 'folder-1', name: 'Brand Assets', type: 'folder' },
          { id: 'folder-2', name: 'Marketing Materials', type: 'folder' },
          { id: 'file-1', name: 'Logo.png', type: 'file', size: '1.2 MB', lastModified: '2025-03-20T10:22:00Z', thumbnailUrl: 'https://source.unsplash.com/random/100x100/?logo' },
          { id: 'file-2', name: 'Presentation.pptx', type: 'file', size: '4.5 MB', lastModified: '2025-03-18T14:15:00Z' },
          { id: 'file-3', name: 'Brand Guidelines.pdf', type: 'file', size: '8.7 MB', lastModified: '2025-03-15T09:30:00Z' },
        ]);
      }
    }
  };

  const toggleFileSelection = (fileId: string) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    } else {
      setSelectedFiles([...selectedFiles, fileId]);
    }
  };

  const handleImport = () => {
    setImportInProgress(true);
    
    // Simulate import process
    setTimeout(() => {
      const selectedFileObjects = files.filter(file => selectedFiles.includes(file.id));
      
      onAssetImport(selectedFileObjects);
      
      setImportInProgress(false);
      setSelectedFiles([]);
      setImportDialogOpen(false);
      
      toast({
        title: "Import Successful",
        description: `${selectedFileObjects.length} files imported to your brand assets`,
      });
    }, 2500);
  };

  const refreshFiles = () => {
    setIsLoading(true);
    
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Files Refreshed",
        description: "Your cloud storage files have been refreshed",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="connect">
            <CloudIcon className="h-4 w-4 mr-2" />
            Connect Accounts
          </TabsTrigger>
          <TabsTrigger value="browse">
            <FolderOpenIcon className="h-4 w-4 mr-2" />
            Browse & Import
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="connect" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center mb-2">
                  <GoogleDriveIcon />
                  <CardTitle className="text-lg ml-2">Google Drive</CardTitle>
                </div>
                <CardDescription>
                  Connect your Google Drive account to import files directly into your brand assets
                </CardDescription>
              </CardHeader>
              <CardFooter>
                {connectedServices.some(s => s.type === 'googledrive') ? (
                  <Button variant="outline" className="w-full" onClick={() => handleDisconnect('gd-1')}>
                    Disconnect
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    onClick={() => handleConnect('googledrive')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Connecting...
                      </>
                    ) : (
                      <>Connect Google Drive</>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center mb-2">
                  <DropboxIcon />
                  <CardTitle className="text-lg ml-2">Dropbox</CardTitle>
                </div>
                <CardDescription>
                  Connect your Dropbox account to import files directly into your brand assets
                </CardDescription>
              </CardHeader>
              <CardFooter>
                {connectedServices.some(s => s.type === 'dropbox') ? (
                  <Button variant="outline" className="w-full" onClick={() => handleDisconnect('db-1')}>
                    Disconnect
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-blue-700 hover:bg-blue-800" 
                    onClick={() => handleConnect('dropbox')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Connecting...
                      </>
                    ) : (
                      <>Connect Dropbox</>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mobile Device Import</CardTitle>
              <CardDescription>
                Import assets directly from your mobile device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-md">
                <div className="text-center">
                  <SmartphoneIcon className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <Button variant="secondary">
                    Scan QR Code to Import from Mobile
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Use the DMPHQ mobile app to scan this code and upload directly
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Connection Options
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="api-key">API Key (Optional)</Label>
                    <Input id="api-key" placeholder="Enter API key" />
                    <p className="text-xs text-muted-foreground">
                      For enterprise connections or custom integrations
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="auto-sync" />
                    <Label htmlFor="auto-sync">Enable automatic synchronization</Label>
                  </div>
                  
                  <Button variant="outline" size="sm" className="mt-2">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Connect Custom API
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        
        <TabsContent value="browse" className="space-y-4">
          {connectedServices.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CloudIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Cloud Storage Connected</h3>
                <p className="text-center text-muted-foreground mb-4 max-w-md">
                  Connect to a cloud storage provider to browse and import your files
                </p>
                <Button onClick={() => setActiveTab('connect')}>
                  Connect Storage
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleNavigateBack}
                    disabled={currentPath.length === 0}
                    className="mr-2"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180 mr-1" />
                    Back
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    Path: / {currentPath.map((path, index) => {
                      const folder = files.find(f => f.id === path);
                      return folder ? folder.name + ' / ' : '';
                    })}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={refreshFiles}
                    disabled={isLoading}
                  >
                    <RefreshCcw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={() => setImportDialogOpen(true)}
                    disabled={selectedFiles.length === 0}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Import Selected ({selectedFiles.length})
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md">
                <div className="grid grid-cols-12 bg-muted/50 p-2 text-xs font-medium">
                  <div className="col-span-6 flex items-center">Name</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-2">Modified</div>
                </div>
                
                <div className="divide-y">
                  {files.map((file) => (
                    <div key={file.id} className="grid grid-cols-12 p-2 hover:bg-muted/20">
                      <div className="col-span-6 flex items-center">
                        <Checkbox 
                          className="mr-2" 
                          checked={selectedFiles.includes(file.id)}
                          onCheckedChange={() => toggleFileSelection(file.id)}
                          disabled={file.type === 'folder'}
                        />
                        
                        {file.type === 'folder' ? (
                          <Button 
                            variant="ghost" 
                            className="p-0 h-auto flex items-center hover:bg-transparent"
                            onClick={() => handleOpenFolder(file.id)}
                          >
                            <FolderIcon className="h-4 w-4 mr-2 text-amber-500" />
                            <span>{file.name}</span>
                          </Button>
                        ) : (
                          <div className="flex items-center">
                            {file.thumbnailUrl ? (
                              <img 
                                src={file.thumbnailUrl} 
                                alt={file.name}
                                className="h-6 w-6 object-cover mr-2 rounded"
                              />
                            ) : (
                              <FileText className="h-4 w-4 mr-2 text-blue-500" />
                            )}
                            <span>{file.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="col-span-2 flex items-center">
                        {file.type === 'folder' ? 'Folder' : file.name.split('.').pop()?.toUpperCase()}
                      </div>
                      <div className="col-span-2 flex items-center">{file.size || '-'}</div>
                      <div className="col-span-2 flex items-center text-xs text-muted-foreground">
                        {file.lastModified ? new Date(file.lastModified).toLocaleDateString() : '-'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Files to Brand Assets</DialogTitle>
            <DialogDescription>
              Selected files will be imported to your brand assets library
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h4 className="font-medium mb-2">Selected Files ({selectedFiles.length})</h4>
            <div className="border rounded-md divide-y max-h-[200px] overflow-y-auto">
              {files.filter(file => selectedFiles.includes(file.id)).map(file => (
                <div key={file.id} className="p-2 flex items-center">
                  {file.thumbnailUrl ? (
                    <img 
                      src={file.thumbnailUrl} 
                      alt={file.name}
                      className="h-8 w-8 object-cover mr-2 rounded"
                    />
                  ) : (
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  )}
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-xs text-muted-foreground">{file.size}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport}
              disabled={importInProgress}
            >
              {importInProgress ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Files
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}