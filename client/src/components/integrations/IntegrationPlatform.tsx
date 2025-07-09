import { useState } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowRight, 
  CheckCircle2, 
  CloudOff, 
  Cog, 
  ExternalLink, 
  Lock, 
  Settings, 
  RefreshCw,
  ScanLine,
  Sliders, 
  Zap 
} from "lucide-react";

export interface IntegrationPlatformProps {
  id: string;
  name: string;
  description: string;
  logo: React.ReactNode;
  category: string;
  status: 'connected' | 'disconnected' | 'needs_attention';
  connectAction?: () => void;
  lastSyncTime?: string;
  featuresList?: string[];
  dataTypes?: {
    name: string;
    canRead: boolean;
    canWrite: boolean;
  }[];
}

export function IntegrationPlatform({
  id,
  name,
  description,
  logo,
  category,
  status,
  connectAction,
  lastSyncTime,
  featuresList = [],
  dataTypes = []
}: IntegrationPlatformProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              {logo}
            </div>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription className="line-clamp-1">{description}</CardDescription>
            </div>
          </div>
          {status === 'connected' ? (
            <Badge className="bg-green-500 text-white">Connected</Badge>
          ) : status === 'disconnected' ? (
            <Badge variant="outline" className="text-gray-500">Disconnected</Badge>
          ) : (
            <Badge variant="destructive">Needs Attention</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 px-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="data">Data Map</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {status === 'connected' && lastSyncTime && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Last synced: {formatDate(lastSyncTime)}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Features</h4>
              <ul className="space-y-1.5">
                {featuresList.length > 0 ? (
                  featuresList.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">No features listed</li>
                )}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4">
            <h4 className="text-sm font-medium">Data Access</h4>
            {dataTypes.length > 0 ? (
              <div className="border rounded-md">
                <div className="grid grid-cols-3 bg-muted p-2 text-xs font-medium">
                  <div>Data Type</div>
                  <div className="text-center">Read</div>
                  <div className="text-center">Write</div>
                </div>
                <div className="divide-y">
                  {dataTypes.map((dataType, index) => (
                    <div key={index} className="grid grid-cols-3 py-2 px-2 text-sm items-center">
                      <div>{dataType.name}</div>
                      <div className="text-center">
                        {dataType.canRead ? 
                          <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /> : 
                          <Lock className="h-4 w-4 text-gray-300 mx-auto" />}
                      </div>
                      <div className="text-center">
                        {dataType.canWrite ? 
                          <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /> : 
                          <Lock className="h-4 w-4 text-gray-300 mx-auto" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data mappings available</p>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Connection Settings</h4>
                  <p className="text-sm text-muted-foreground">Manage API keys and authentication</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsConfigOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <div>
                  <h4 className="font-medium">Sync Settings</h4>
                  <p className="text-sm text-muted-foreground">Manage data synchronization</p>
                </div>
                <Button variant="outline" size="sm">
                  <Sliders className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <div>
                  <h4 className="font-medium text-red-600">Delete Connection</h4>
                  <p className="text-sm text-muted-foreground">Remove this integration</p>
                </div>
                <Button variant="destructive" size="sm">
                  <CloudOff className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4 pb-3">
        {status === 'connected' ? (
          <>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Now
            </Button>
            <Button variant="default" size="sm">
              <Cog className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm">
              <ScanLine className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={connectAction}
              className="bg-primary"
            >
              <Zap className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </>
        )}
      </CardFooter>
      
      {/* Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure {name} Integration</DialogTitle>
            <DialogDescription>
              Enter your API credentials to connect with {name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" placeholder="Enter your API key" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="api-secret">API Secret</Label>
              <Input id="api-secret" type="password" placeholder="Enter your API secret" />
            </div>
            {id === 'gohighlevel' && (
              <div className="grid gap-2">
                <Label htmlFor="location-id">Location ID</Label>
                <Input id="location-id" placeholder="Enter your location ID" />
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              <p>Don't have credentials yet?</p>
              <a 
                href="#" 
                className="text-primary inline-flex items-center hover:underline mt-1"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Get {name} API keys
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </a>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}