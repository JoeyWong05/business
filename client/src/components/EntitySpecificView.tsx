import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Building,
  Users,
  ShoppingCart,
  TrendingUp,
  Truck,
  Clock,
  Calendar,
  Clipboard,
  Package,
  DollarSign,
  BarChart,
  PieChart,
  Map,
  Layers,
  Scissors,
  MessageSquare,
  Zap,
  AlertCircle,
  CheckCircle,
  Package2,
  Pencil,
  Palette,
  Store,
  ShoppingBag,
  ChevronRight,
  RefreshCw,
  ShieldCheck,
  HeartPulse,
  Target,
  VideoIcon,
  Image as ImageIcon,
  Share2,
  AtSign,
  FileText,
  Boxes,
  PersonStanding
} from "lucide-react";
import { cn } from "@/lib/utils";

// Entity Types
export enum EntityType {
  AGENCY = 'agency',
  PHYSICAL = 'physical',
  PRODUCTS = 'products',
  ECOMMERCE = 'ecommerce',
}

// Interface for Business Entity
interface BusinessEntity {
  id: number;
  name: string;
  type: EntityType;
  slug: string;
}

// Entity-specific card components
function AgencyDashboard({ entity }: { entity: BusinessEntity }) {
  const [clientRetentionRate, setClientRetentionRate] = useState(92);
  const [projectCompletionRate, setProjectCompletionRate] = useState(88);
  const [leadConversionRate, setLeadConversionRate] = useState(32);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Client Projects</CardTitle>
            <CardDescription>Active and pending projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Clipboard className="h-8 w-8 text-blue-500 mb-2" />
                <div className="text-2xl font-bold">14</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <Clock className="h-8 w-8 text-amber-500 mb-2" />
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>View all projects</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Creative Assets</CardTitle>
            <CardDescription>Recent design deliverables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Palette className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Brand Redesign - Mystery Hype</p>
                <p className="text-xs text-muted-foreground">Updated 2 days ago</p>
              </div>
              <Badge variant="outline">Approved</Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Social Media Pack - Alcoeaze</p>
                <p className="text-xs text-muted-foreground">Updated 3 days ago</p>
              </div>
              <Badge variant="outline">In Review</Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <VideoIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Promo Video - Lone Star</p>
                <p className="text-xs text-muted-foreground">Updated 5 days ago</p>
              </div>
              <Badge variant="outline">Delivered</Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>View asset library</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Client Relationships</CardTitle>
            <CardDescription>Key performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm">Client Retention</div>
                <div className="text-sm font-medium">{clientRetentionRate}%</div>
              </div>
              <Progress value={clientRetentionRate} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm">Project Completion</div>
                <div className="text-sm font-medium">{projectCompletionRate}%</div>
              </div>
              <Progress value={projectCompletionRate} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm">Lead Conversion</div>
                <div className="text-sm font-medium">{leadConversionRate}%</div>
              </div>
              <Progress value={leadConversionRate} className="h-2" />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>View detailed reports</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <Card className="md:col-span-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Agency Services Performance</CardTitle>
            <CardDescription>Revenue by service category</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                [Interactive Revenue Chart]
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Client Meetings</CardTitle>
            <CardDescription>Today and upcoming</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 pr-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="h-10 w-10 rounded-md bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Client Strategy Call - Lone Star</p>
                    <p className="text-xs text-muted-foreground">Today, 2:00 PM - 3:00 PM</p>
                  </div>
                  <Badge>Today</Badge>
                </div>
                
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="h-10 w-10 rounded-md bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Campaign Review - Mystery Hype</p>
                    <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM - 11:30 AM</p>
                  </div>
                  <Badge variant="outline">Tomorrow</Badge>
                </div>
                
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Onboarding - New Client</p>
                    <p className="text-xs text-muted-foreground">Wed, 9:00 AM - 10:00 AM</p>
                  </div>
                  <Badge variant="outline">Wed</Badge>
                </div>
                
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="h-10 w-10 rounded-md bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Quarterly Review - Alcoeaze</p>
                    <p className="text-xs text-muted-foreground">Fri, 1:00 PM - 2:30 PM</p>
                  </div>
                  <Badge variant="outline">Fri</Badge>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>View all meetings</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Client Distribution</CardTitle>
            <CardDescription>By industry segment</CardDescription>
          </CardHeader>
          <CardContent className="h-60 flex items-center justify-center">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                [Client Distribution Chart]
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Team Resources</CardTitle>
            <CardDescription>Availability and allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm">Design Team</div>
                  <div className="text-sm font-medium">78% allocated</div>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm">Development</div>
                  <div className="text-sm font-medium">92% allocated</div>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm">Marketing</div>
                  <div className="text-sm font-medium">65% allocated</div>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm">Account Management</div>
                  <div className="text-sm font-medium">82% allocated</div>
                </div>
                <Progress value={82} className="h-2" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>Resource planner</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upcoming Deliverables</CardTitle>
            <CardDescription>Due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 pr-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Website Mockups - Client A</p>
                    <p className="text-xs text-muted-foreground">Due tomorrow</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Content Calendar - Client B</p>
                    <p className="text-xs text-muted-foreground">Due in 2 days</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Campaign Analytics - Client C</p>
                    <p className="text-xs text-muted-foreground">Due in 3 days</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Social Media Graphics - Client D</p>
                    <p className="text-xs text-muted-foreground">Due in 5 days</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">SEO Report - Client E</p>
                    <p className="text-xs text-muted-foreground">Due in 7 days</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>View project timeline</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function PhysicalStoreDashboard({ entity }: { entity: BusinessEntity }) {
  const [dailyFootTraffic, setDailyFootTraffic] = useState(245);
  const [salesPerSquareFoot, setSalesPerSquareFoot] = useState(325);
  const [conversionRate, setConversionRate] = useState(22);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Today's Store Performance</CardTitle>
            <CardDescription>Real-time metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <PersonStanding className="h-8 w-8 text-blue-500 mb-2" />
                <div className="text-2xl font-bold">{dailyFootTraffic}</div>
                <div className="text-sm text-muted-foreground">Visitors</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <ShoppingBag className="h-8 w-8 text-green-500 mb-2" />
                <div className="text-2xl font-bold">{conversionRate}%</div>
                <div className="text-sm text-muted-foreground">Conversion</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>View traffic patterns</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Store Layout Efficiency</CardTitle>
            <CardDescription>${salesPerSquareFoot} per sq ft</CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                [Interactive Store Heatmap]
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>Optimize layout</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Staff Schedule</CardTitle>
            <CardDescription>Today's coverage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">9AM-5PM</Badge>
                <span className="text-sm font-medium">Alex R.</span>
              </div>
              <Badge>Manager</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">9AM-3PM</Badge>
                <span className="text-sm font-medium">Sarah T.</span>
              </div>
              <Badge variant="outline">Sales</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">10AM-6PM</Badge>
                <span className="text-sm font-medium">Michael B.</span>
              </div>
              <Badge variant="outline">Sales</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">12PM-8PM</Badge>
                <span className="text-sm font-medium">Jessica W.</span>
              </div>
              <Badge variant="outline">Sales</Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>Staff management</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <Card className="md:col-span-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Inventory Status</CardTitle>
            <CardDescription>Stock levels and reorder needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Healthy Stock (70+ items)</span>
                </div>
                <span className="text-sm">60% of inventory</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-sm font-medium">Low Stock (10-70 items)</span>
                </div>
                <span className="text-sm">30% of inventory</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium">Critical Stock (&lt;10 items)</span>
                </div>
                <span className="text-sm">10% of inventory</span>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Items Needing Reorder</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                      <Package className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Custom T-Shirts - Large</p>
                      <p className="text-xs text-muted-foreground">5 items remaining</p>
                    </div>
                    <Button variant="outline" size="sm">Reorder</Button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                      <Package className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Branded Hoodies - Medium</p>
                      <p className="text-xs text-muted-foreground">3 items remaining</p>
                    </div>
                    <Button variant="outline" size="sm">Reorder</Button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                      <Package className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Premium Caps</p>
                      <p className="text-xs text-muted-foreground">15 items remaining</p>
                    </div>
                    <Button variant="outline" size="sm">Reorder</Button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                      <Package className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Custom Stickers - Set</p>
                      <p className="text-xs text-muted-foreground">12 items remaining</p>
                    </div>
                    <Button variant="outline" size="sm">Reorder</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>Inventory management</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">In-Store Promotions</CardTitle>
            <CardDescription>Active and upcoming</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 pr-4">
              <div className="space-y-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">Active</Badge>
                    <div className="text-sm font-medium">Buy One Get One 50% Off</div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">All T-shirts and hoodies</p>
                  <div className="flex justify-between items-center text-xs">
                    <span>Ends in 3 days</span>
                    <span className="text-green-600 dark:text-green-400">+18% sales increase</span>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">Active</Badge>
                    <div className="text-sm font-medium">Custom Design Consultation</div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Free with $100+ purchase</p>
                  <div className="flex justify-between items-center text-xs">
                    <span>Ongoing</span>
                    <span className="text-green-600 dark:text-green-400">+12% conversion</span>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">Upcoming</Badge>
                    <div className="text-sm font-medium">Flash Sale: 30% Off</div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Limited items, while supplies last</p>
                  <div className="flex justify-between items-center text-xs">
                    <span>Starts in A Week</span>
                    <span>2-day event</span>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">Planned</Badge>
                    <div className="text-sm font-medium">Loyalty Member Day</div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Double points for all purchases</p>
                  <div className="flex justify-between items-center text-xs">
                    <span>Next month</span>
                    <span>Members only</span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>Promotion planner</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Local Area Marketing</CardTitle>
            <CardDescription>Targeting 5-mile radius</CardDescription>
          </CardHeader>
          <CardContent className="h-60 flex items-center justify-center">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                [Local Marketing Map]
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Customer Feedback</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="text-3xl">4.8</div>
                  <div className="text-sm text-muted-foreground">overall rating</div>
                </div>
                <div className="text-sm text-muted-foreground">Based on 142 reviews</div>
              </div>
              
              <Separator />
              
              <ScrollArea className="h-36 pr-4">
                <div className="space-y-3">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Sarah M.</div>
                      <div className="text-xs text-muted-foreground">2 days ago</div>
                    </div>
                    <p className="text-xs">Great experience with the custom design team! Very happy with my new hoodie.</p>
                  </div>
                  
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">John D.</div>
                      <div className="text-xs text-muted-foreground">5 days ago</div>
                    </div>
                    <p className="text-xs">Staff was knowledgeable and helped me find the perfect fit. Will shop here again!</p>
                  </div>
                  
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Emily L.</div>
                      <div className="text-xs text-muted-foreground">1 week ago</div>
                    </div>
                    <p className="text-xs">Fast service and quality products. The tees I bought for my team look amazing.</p>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>View all feedback</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Custom Design Requests</CardTitle>
            <CardDescription>Recent and pending</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 pr-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Scissors className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Corporate Logo Embroidery</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">In Progress</Badge>
                      <p className="text-xs text-muted-foreground">Due Tomorrow</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Scissors className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Custom Event T-Shirts (50 pcs)</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Design Phase</Badge>
                      <p className="text-xs text-muted-foreground">Due in 5 days</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <Scissors className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Family Reunion Caps (25 pcs)</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 text-xs">Complete</Badge>
                      <p className="text-xs text-muted-foreground">Ready for pickup</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                    <Scissors className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Custom Jersey Design</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Quote Pending</Badge>
                      <p className="text-xs text-muted-foreground">New request</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>View all design requests</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function ProductsCompanyDashboard({ entity }: { entity: BusinessEntity }) {
  const [productLineRevenue, setProductLineRevenue] = useState([
    { name: 'Core Series', value: 45 },
    { name: 'Premium Series', value: 30 },
    { name: 'Limited Edition', value: 15 },
    { name: 'Accessories', value: 10 }
  ]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Product Performance</CardTitle>
            <CardDescription>Revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-60 flex items-center justify-center">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                [Product Revenue Chart]
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>Detailed analytics</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Inventory Status</CardTitle>
            <CardDescription>Stock levels across SKUs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bottled Products</span>
                <Badge variant="outline" className="text-green-600">Healthy</Badge>
              </div>
              <Progress value={85} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Canned Products</span>
                <Badge variant="outline" className="text-amber-600">Monitor</Badge>
              </div>
              <Progress value={45} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Limited Edition</span>
                <Badge variant="outline" className="text-red-600">Low Stock</Badge>
              </div>
              <Progress value={15} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Merchandise</span>
                <Badge variant="outline" className="text-green-600">Healthy</Badge>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>Restock planning</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Distribution Channels</CardTitle>
            <CardDescription>Sales by channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Store className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Retail Partners</p>
                  <Progress value={40} className="h-1.5 mt-1" />
                </div>
                <div className="text-sm font-medium">40%</div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Direct E-commerce</p>
                  <Progress value={35} className="h-1.5 mt-1" />
                </div>
                <div className="text-sm font-medium">35%</div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Building className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Wholesale</p>
                  <Progress value={15} className="h-1.5 mt-1" />
                </div>
                <div className="text-sm font-medium">15%</div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Package2 className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Subscription Box</p>
                  <Progress value={10} className="h-1.5 mt-1" />
                </div>
                <div className="text-sm font-medium">10%</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>Channel management</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <Card className="md:col-span-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Production Planning</CardTitle>
            <CardDescription>Upcoming manufacturing schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Premium Series - Spring Batch</p>
                    <p className="text-xs text-muted-foreground">5,000 units • 4 variants</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">In Production</Badge>
                  <div className="text-xs">Production complete: 65%</div>
                  <Progress value={65} className="w-24 h-1.5" />
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Limited Edition - Summer Collection</p>
                    <p className="text-xs text-muted-foreground">2,500 units • 2 variants</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline">Planned</Badge>
                  <div className="text-xs">Starts in 2 weeks</div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Package className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Core Series - Restock</p>
                    <p className="text-xs text-muted-foreground">10,000 units • 6 variants</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300">Materials Procurement</Badge>
                  <div className="text-xs">Starts production next week</div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Merchandise - New Line</p>
                    <p className="text-xs text-muted-foreground">1,000 units • 3 variants</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline">Design Phase</Badge>
                  <div className="text-xs">Production in 4 weeks</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>Production schedule</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quality Assurance</CardTitle>
            <CardDescription>Recent batch testing</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 pr-4">
              <div className="space-y-4">
                <div className="p-3 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">Passed</Badge>
                    <div className="text-sm font-medium">Core Series - Batch #A2245</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Taste Profile</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Color/Clarity</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Packaging</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Labeling</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Tested yesterday</div>
                </div>
                
                <div className="p-3 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">Passed</Badge>
                    <div className="text-sm font-medium">Premium Series - Batch #P1128</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Taste Profile</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Color/Clarity</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Packaging</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Labeling</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Tested 3 days ago</div>
                </div>
                
                <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300">Minor Issues</Badge>
                    <div className="text-sm font-medium">Limited Edition - Batch #L0567</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Taste Profile</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Color/Clarity</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 text-amber-500" />
                      <span>Packaging</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Labeling</span>
                    </div>
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400">Slight packaging inconsistencies - corrective action taken</div>
                  <div className="text-xs text-muted-foreground mt-1">Tested 1 week ago</div>
                </div>
                
                <div className="p-3 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">Passed</Badge>
                    <div className="text-sm font-medium">Core Series - Batch #A2244</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Taste Profile</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Color/Clarity</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Packaging</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Labeling</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Tested 2 weeks ago</div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>Quality control center</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Supply Chain</CardTitle>
            <CardDescription>Material procurement status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bottle Supply</span>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">Healthy</span>
                </div>
              </div>
              <Progress value={95} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ingredients</span>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">Healthy</span>
                </div>
              </div>
              <Progress value={90} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Packaging Materials</span>
                <div className="flex items-center gap-1">
                  <RefreshCw className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-amber-600 dark:text-amber-400">Order Pending</span>
                </div>
              </div>
              <Progress value={45} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Labels</span>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">Healthy</span>
                </div>
              </div>
              <Progress value={80} className="h-2" />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>Supply chain management</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Product Development</CardTitle>
            <CardDescription>New products in pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 pr-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Core Series+ (Enhanced Formula)</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 text-xs">Testing</Badge>
                      <p className="text-xs text-muted-foreground">Launch in 2 months</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Premium Travel Size</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300 text-xs">Packaging Design</Badge>
                      <p className="text-xs text-muted-foreground">Launch in 3 months</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Seasonal Flavors - Fall Collection</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300 text-xs">Formula Development</Badge>
                      <p className="text-xs text-muted-foreground">Launch in 4 months</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">New Subscription Box Concept</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 text-xs">Market Research</Badge>
                      <p className="text-xs text-muted-foreground">Concept phase</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>Product roadmap</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Market Feedback</CardTitle>
            <CardDescription>Latest product reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="text-3xl">4.7</div>
                  <div className="text-sm text-muted-foreground">average rating</div>
                </div>
                <div className="text-sm text-muted-foreground">Based on 876 reviews</div>
              </div>
              
              <Separator />
              
              <ScrollArea className="h-36 pr-4">
                <div className="space-y-3">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Premium Series</Badge>
                        <div className="text-sm font-medium">Alex J.</div>
                      </div>
                      <div className="text-xs text-muted-foreground">3 days ago</div>
                    </div>
                    <p className="text-xs">Love the new formula! Taste is incredible and packaging looks premium.</p>
                  </div>
                  
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Core Series</Badge>
                        <div className="text-sm font-medium">Michelle T.</div>
                      </div>
                      <div className="text-xs text-muted-foreground">1 week ago</div>
                    </div>
                    <p className="text-xs">Absolutely refreshing. My go-to drink for hot summer days.</p>
                  </div>
                  
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Limited Edition</Badge>
                        <div className="text-sm font-medium">David R.</div>
                      </div>
                      <div className="text-xs text-muted-foreground">1 week ago</div>
                    </div>
                    <p className="text-xs">Unique flavor profile. Worth the premium price for special occasions.</p>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>View all reviews</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Main Entity Specific View
export default function EntitySpecificView() {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  
  // Fetch business entities
  const { data: entitiesData } = useQuery({
    queryKey: ['/api/business-entities'],
  });
  
  const entities: BusinessEntity[] = (entitiesData?.entities || []) as BusinessEntity[];
  
  // Get current entity
  const currentEntity = selectedEntityId 
    ? entities.find(e => e.id.toString() === selectedEntityId) 
    : null;
  
  // Render entity dashboard based on type
  const renderEntityDashboard = () => {
    if (!currentEntity) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Building className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Select a Business Entity</h3>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            Choose a business entity to view its specialized dashboard with metrics and insights tailored to its business model.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
            {entities.map((entity) => (
              <Button
                key={entity.id}
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center gap-3"
                onClick={() => setSelectedEntityId(entity.id.toString())}
              >
                {entity.type === EntityType.AGENCY && (
                  <Pencil className="h-8 w-8 text-purple-500" />
                )}
                {entity.type === EntityType.PHYSICAL && (
                  <Store className="h-8 w-8 text-blue-500" />
                )}
                {entity.type === EntityType.PRODUCTS && (
                  <Package2 className="h-8 w-8 text-green-500" />
                )}
                {entity.type === EntityType.ECOMMERCE && (
                  <ShoppingCart className="h-8 w-8 text-amber-500" />
                )}
                <div className="text-center">
                  <div className="font-medium">{entity.name}</div>
                  <Badge variant="secondary" className="mt-1">
                    {entity.type}
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
        </div>
      );
    }
    
    switch (currentEntity.type) {
      case EntityType.AGENCY:
        return <AgencyDashboard entity={currentEntity} />;
      case EntityType.PHYSICAL:
        return <PhysicalStoreDashboard entity={currentEntity} />;
      case EntityType.PRODUCTS:
      case EntityType.ECOMMERCE:
        return <ProductsCompanyDashboard entity={currentEntity} />;
      default:
        return <div>Unsupported entity type</div>;
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {currentEntity ? currentEntity.name : 'Business Entities'}
            </h1>
            <p className="text-muted-foreground">
              {currentEntity 
                ? `View and manage specialized operations for ${currentEntity.name}` 
                : 'Select a business entity to view its specialized dashboard'}
            </p>
          </div>
          
          {currentEntity && (
            <div className="flex items-center gap-3">
              <Select value={selectedEntityId || ""} onValueChange={setSelectedEntityId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select business entity" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name} 
                      <Badge variant="outline" className="ml-2 text-xs">
                        {entity.type}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="gap-2" onClick={() => setSelectedEntityId(null)}>
                <Building className="h-4 w-4" />
                All Entities
              </Button>
            </div>
          )}
        </div>
        
        {renderEntityDashboard()}
      </div>
    </div>
  );
}