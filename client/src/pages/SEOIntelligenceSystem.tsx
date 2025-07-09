import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart3,
  Search,
  Link as LinkIcon,
  FileText,
  Globe,
  BarChart,
  TrendingUp,
  Eye,
  AlertTriangle,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  X,
  ExternalLink,
  Info,
  Copy,
  Settings,
  Wifi,
  Clock,
  Plus,
  ChevronRight,
  Zap,
  RefreshCw,
  Target,
  PieChart,
  LineChart,
  Users,
  Filter
} from 'lucide-react';
import SEOScoreManager from '@/components/SEOScoreManager';

// Types adapted from SEOScoreManager component
enum SEOScoreCategory {
  TECHNICAL = 'technical',
  ON_PAGE = 'on_page',
  CONTENT = 'content',
  OFF_PAGE = 'off_page',
  LOCAL = 'local',
  MOBILE = 'mobile',
  USER_EXPERIENCE = 'user_experience',
  PERFORMANCE = 'performance'
}

enum SEOScoreSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

// Mock data for the SEO dashboard (in a real implementation, this would come from the API)
const mockBusinessEntities = [
  { id: 1, name: 'Digital Merch Pros', domain: 'digitalmprch.com' },
  { id: 2, name: 'Mystery Hype', domain: 'mysteryhype.com' },
  { id: 3, name: 'Lone Star Custom Clothing', domain: 'lonestarcustom.com' },
  { id: 4, name: 'Alcoeaze', domain: 'alcoeaze.com' },
  { id: 5, name: 'Hide Cafe Bars', domain: 'hidecafebars.com' }
];

const mockKeywords = [
  { id: 1, keyword: 'custom merchandise', volume: 8100, difficulty: 68, position: 12, change: 3 },
  { id: 2, keyword: 'digital merch', volume: 3600, difficulty: 42, position: 5, change: 1 },
  { id: 3, keyword: 't-shirt printing bulk', volume: 6700, difficulty: 55, position: 18, change: -2 },
  { id: 4, keyword: 'branded promotional items', volume: 4900, difficulty: 61, position: 22, change: 5 },
  { id: 5, keyword: 'custom corporate gifts', volume: 5300, difficulty: 59, position: 9, change: 0 },
  { id: 6, keyword: 'promotional products companies', volume: 7200, difficulty: 72, position: 31, change: -5 },
  { id: 7, keyword: 'mystery box clothing', volume: 9500, difficulty: 65, position: 3, change: 2 },
  { id: 8, keyword: 'hype clothing drops', volume: 12800, difficulty: 81, position: 21, change: -3 },
  { id: 9, keyword: 'alcohol free spirits', volume: 6200, difficulty: 54, position: 7, change: 4 },
  { id: 10, keyword: 'non alcoholic bar', volume: 8400, difficulty: 63, position: 15, change: -1 }
];

// Main SEO Intelligence System component
export default function SEOIntelligenceSystem() {
  const [selectedEntity, setSelectedEntity] = useState<string>("1");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditProgress, setAuditProgress] = useState<number>(0);
  const [auditDialogOpen, setAuditDialogOpen] = useState<boolean>(false);
  const [lastAuditDate, setLastAuditDate] = useState<string>("March 18, 2025");
  const [keywordDialogOpen, setKeywordDialogOpen] = useState<boolean>(false);
  const [newKeyword, setNewKeyword] = useState<string>("");
  
  // Simulated API call to start an SEO audit
  const startAudit = () => {
    setIsAuditing(true);
    setAuditProgress(0);
    setAuditDialogOpen(true);
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          setLastAuditDate("March 23, 2025");
          return 100;
        }
        return prev + 5;
      });
    }, 500);
  };
  
  // Simulate adding a new keyword
  const addKeyword = () => {
    if (newKeyword.trim()) {
      // In a real app, this would make an API call to add the keyword
      setNewKeyword("");
      setKeywordDialogOpen(false);
      // Show success notification or update the keyword list
    }
  };
  
  // Get the selected entity name
  const getSelectedEntityName = () => {
    const entity = mockBusinessEntities.find(e => e.id === Number(selectedEntity));
    return entity ? entity.name : "All Entities";
  };
  
  // Get the selected entity domain
  const getSelectedEntityDomain = () => {
    const entity = mockBusinessEntities.find(e => e.id === Number(selectedEntity));
    return entity ? entity.domain : "";
  };

  return (
    <MainLayout 
      title="SEO Intelligence System"
      description="Professional-grade SEO analysis, tracking, and optimization"
    >
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select entity" />
              </SelectTrigger>
              <SelectContent>
                {mockBusinessEntities.map(entity => (
                  <SelectItem key={entity.id} value={entity.id.toString()}>
                    {entity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setKeywordDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Keyword
          </Button>
          <Button onClick={startAudit}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Run Audit
          </Button>
        </div>
      </div>
      
      {/* Last Audit Info */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Last audit: {lastAuditDate} • Domain: <span className="font-medium text-foreground">{getSelectedEntityDomain()}</span>
        </p>
      </div>
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 h-auto">
          <TabsTrigger value="dashboard" className="py-2">
            <BarChart3 className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Dashboard</span>
            <span className="inline md:hidden">Dash</span>
          </TabsTrigger>
          <TabsTrigger value="keywords" className="py-2">
            <Target className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Keywords</span>
            <span className="inline md:hidden">Keys</span>
          </TabsTrigger>
          <TabsTrigger value="onpage" className="py-2">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">On-Page SEO</span>
            <span className="inline md:hidden">On-Page</span>
          </TabsTrigger>
          <TabsTrigger value="technical" className="py-2">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Technical SEO</span>
            <span className="inline md:hidden">Tech</span>
          </TabsTrigger>
          <TabsTrigger value="backlinks" className="py-2">
            <LinkIcon className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Backlinks</span>
            <span className="inline md:hidden">Links</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="py-2">
            <Eye className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Content Analysis</span>
            <span className="inline md:hidden">Content</span>
          </TabsTrigger>
          <TabsTrigger value="competitors" className="py-2">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Competitors</span>
            <span className="inline md:hidden">Comp</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="py-2">
            <LineChart className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Reports</span>
            <span className="inline md:hidden">Reps</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          {/* Score Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Overall SEO Score</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">73</span>
                      <span className="text-xs ml-2 text-emerald-500 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +4
                      </span>
                    </div>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <Progress value={73} className="h-2 mt-4" />
                <p className="text-xs text-muted-foreground mt-2">Good score, room for improvement</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Visibility Index</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">62%</span>
                      <span className="text-xs ml-2 text-emerald-500 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +7%
                      </span>
                    </div>
                  </div>
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                    <Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <Progress value={62} className="h-2 mt-4 bg-muted" />
                <p className="text-xs text-muted-foreground mt-2">Improving visibility in SERPs</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Keywords in Top 10</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">18</span>
                      <span className="text-xs ml-2 text-emerald-500 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        +3
                      </span>
                    </div>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                    <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-5">
                  <span>Last month: 15</span>
                  <span>Goal: 25</span>
                </div>
                <Progress value={72} className="h-2 mt-2 bg-muted" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Issues Found</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">12</span>
                      <span className="text-xs ml-2 text-red-500 flex items-center">
                        <ArrowDown className="h-3 w-3 mr-1" />
                        -5
                      </span>
                    </div>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center p-1 bg-red-100 dark:bg-red-900/20 rounded text-xs font-medium text-red-600 dark:text-red-400">
                    3 Critical
                  </div>
                  <div className="text-center p-1 bg-amber-100 dark:bg-amber-900/20 rounded text-xs font-medium text-amber-600 dark:text-amber-400">
                    5 Medium
                  </div>
                  <div className="text-center p-1 bg-blue-100 dark:bg-blue-900/20 rounded text-xs font-medium text-blue-600 dark:text-blue-400">
                    4 Low
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Performance Trends & Issues */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>SEO metrics over the past 90 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center p-8 border border-dashed rounded-lg bg-muted/40 max-w-md">
                    <LineChart className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Performance Chart</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This would display a chart showing metrics like organic traffic, 
                      keyword rankings, and visibility over time.
                    </p>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Issues</CardTitle>
                <CardDescription>Issues that need your attention</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px]">
                  <div className="px-4 py-2 border-b hover:bg-muted/30">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">
                        <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Missing Meta Descriptions</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          17 pages are missing meta descriptions, including key landing pages.
                        </p>
                        <Button variant="link" size="sm" className="h-6 p-0 mt-1">Fix Now</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-2 border-b hover:bg-muted/30">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">
                        <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Slow Page Load Speed</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Core Web Vitals need improvement. Average FCP is 3.8s.
                        </p>
                        <Button variant="link" size="sm" className="h-6 p-0 mt-1">View Details</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-2 border-b hover:bg-muted/30">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">
                        <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Crawl Errors</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          7 pages returning 404 errors that were previously indexed.
                        </p>
                        <Button variant="link" size="sm" className="h-6 p-0 mt-1">Investigate</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-2 border-b hover:bg-muted/30">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">
                        <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Thin Content</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          12 pages have less than 300 words of content.
                        </p>
                        <Button variant="link" size="sm" className="h-6 p-0 mt-1">View Pages</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-2 border-b hover:bg-muted/30">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">
                        <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Missing Alt Text</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          23 images missing alternative text for accessibility.
                        </p>
                        <Button variant="link" size="sm" className="h-6 p-0 mt-1">Fix Images</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-2 border-b hover:bg-muted/30">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Mobile Viewport Issues</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Some elements overflow on mobile viewport sizes.
                        </p>
                        <Button variant="link" size="sm" className="h-6 p-0 mt-1">Check Pages</Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Keyword Rankings</CardTitle>
                  <CardDescription>Track your performance for target keywords</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search keywords..."
                      className="pl-8 md:w-[200px] lg:w-[300px]"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead className="text-right">Search Volume</TableHead>
                    <TableHead className="text-right">Difficulty</TableHead>
                    <TableHead className="text-right">Position</TableHead>
                    <TableHead className="text-right">Change (30d)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockKeywords.map(keyword => (
                    <TableRow key={keyword.id}>
                      <TableCell className="font-medium">{keyword.keyword}</TableCell>
                      <TableCell className="text-right">{keyword.volume.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Progress 
                            value={keyword.difficulty} 
                            className="h-2 w-16"
                            // Use different colors based on difficulty
                            style={{
                              '--theme-primary': keyword.difficulty > 70 
                                ? 'hsl(0, 84%, 60%)' 
                                : keyword.difficulty > 50 
                                  ? 'hsl(38, 92%, 50%)' 
                                  : 'hsl(142, 71%, 45%)'
                            } as React.CSSProperties}
                          />
                          <span>{keyword.difficulty}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={keyword.position <= 10 ? "default" : "outline"}>
                          {keyword.position}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`flex items-center justify-end gap-1 ${
                          keyword.change > 0 ? 'text-green-500' : 
                          keyword.change < 0 ? 'text-red-500' : 'text-gray-500'
                        }`}>
                          {keyword.change > 0 ? <ArrowUp className="h-3 w-3" /> : 
                           keyword.change < 0 ? <ArrowDown className="h-3 w-3" /> : 
                           <span className="h-3 w-3">–</span>}
                          {keyword.change !== 0 && Math.abs(keyword.change)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between py-4">
              <p className="text-sm text-muted-foreground">
                Showing 10 of 42 keywords
              </p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* On-Page SEO Tab */}
        <TabsContent value="onpage" className="space-y-4">
          {/* On-Page Analysis placeholder */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>On-Page SEO Analysis</CardTitle>
                  <CardDescription>Detailed page-by-page SEO analysis</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Enter page URL..."
                      className="pl-8 md:w-[300px] lg:w-[400px]"
                    />
                  </div>
                  <Button>Analyze</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileText className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">On-Page SEO Analysis</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  Enter a URL above to analyze on-page SEO factors including meta tags, content quality, 
                  headings structure, internal linking, and more.
                </p>
                <p className="text-sm text-muted-foreground">
                  Recently analyzed: <span className="text-primary font-medium">/products, /about, /contact</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Technical SEO Tab */}
        <TabsContent value="technical" className="space-y-4">
          {/* Technical SEO Analysis placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Technical SEO Analysis</CardTitle>
              <CardDescription>Performance, crawlability, and indexation issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full mr-3">
                        <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="font-medium">Crawlability</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <Progress value={92} className="h-2" />
                      </div>
                      <span className="ml-3 text-sm font-medium">92%</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-full mr-3">
                        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <span className="font-medium">Page Speed</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <Progress value={68} className="h-2" />
                      </div>
                      <span className="ml-3 text-sm font-medium">68%</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full mr-3">
                        <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-medium">Indexation</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <Progress value={84} className="h-2" />
                      </div>
                      <span className="ml-3 text-sm font-medium">84%</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full mr-3">
                        <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="font-medium">Security</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <Progress value={96} className="h-2" />
                      </div>
                      <span className="ml-3 text-sm font-medium">96%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Settings className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Full Technical Audit</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  This section would have a comprehensive technical SEO audit with crawl errors, 
                  site structure issues, schema markup validation, and more.
                </p>
                <Button>Run Technical Audit</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Placeholder content for the remaining tabs */}
        <TabsContent value="backlinks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backlink Profile</CardTitle>
              <CardDescription>Analyze and manage your website's backlinks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <LinkIcon className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Backlink Analysis</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  This section would display your backlink profile with metrics like domain authority, 
                  referring domains, backlink quality, and link growth over time.
                </p>
                <Button>View Backlink Details</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Analysis</CardTitle>
              <CardDescription>Content quality, optimization, and gap analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Eye className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Content Quality Analysis</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  This section would analyze your content quality, keyword usage, readability, 
                  and provide optimization suggestions.
                </p>
                <Button>Analyze Content</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="competitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitor Analysis</CardTitle>
              <CardDescription>Compare your SEO performance against competitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Users className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Competitor Intelligence</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  This section would provide a detailed competitive analysis with keyword gap analysis, 
                  content comparison, backlink overlap, and more.
                </p>
                <Button>View Competitors</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Reports</CardTitle>
              <CardDescription>Custom reports and performance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <LineChart className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Performance Reports</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  This section would contain customizable reports for tracking SEO performance,
                  including traffic growth, ranking improvements, conversion metrics, and more.
                </p>
                <Button>Generate Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Audit Progress Dialog */}
      <Dialog open={auditDialogOpen} onOpenChange={setAuditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Running SEO Audit</DialogTitle>
            <DialogDescription>
              Analyzing your website for SEO issues and opportunities
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{auditProgress}%</span>
              </div>
              <Progress value={auditProgress} className="h-2" />
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-start">
                <CheckCircle2 className={`h-5 w-5 ${auditProgress >= 20 ? 'text-green-500' : 'text-muted'} mr-2`} />
                <div>
                  <p className="text-sm font-medium">Checking crawlability</p>
                  <p className="text-xs text-muted-foreground">Analyzing robots.txt and sitemap.xml</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className={`h-5 w-5 ${auditProgress >= 40 ? 'text-green-500' : 'text-muted'} mr-2`} />
                <div>
                  <p className="text-sm font-medium">Scanning page content</p>
                  <p className="text-xs text-muted-foreground">Analyzing metadata and content quality</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className={`h-5 w-5 ${auditProgress >= 60 ? 'text-green-500' : 'text-muted'} mr-2`} />
                <div>
                  <p className="text-sm font-medium">Checking performance metrics</p>
                  <p className="text-xs text-muted-foreground">Analyzing page load speed and Core Web Vitals</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className={`h-5 w-5 ${auditProgress >= 80 ? 'text-green-500' : 'text-muted'} mr-2`} />
                <div>
                  <p className="text-sm font-medium">Checking backlink profile</p>
                  <p className="text-xs text-muted-foreground">Analyzing backlinks and referring domains</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className={`h-5 w-5 ${auditProgress >= 100 ? 'text-green-500' : 'text-muted'} mr-2`} />
                <div>
                  <p className="text-sm font-medium">Generating report</p>
                  <p className="text-xs text-muted-foreground">Compiling findings and recommendations</p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            {auditProgress < 100 ? (
              <Button variant="outline" onClick={() => setAuditDialogOpen(false)}>Cancel</Button>
            ) : (
              <Button onClick={() => setAuditDialogOpen(false)}>View Report</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Keyword Dialog */}
      <Dialog open={keywordDialogOpen} onOpenChange={setKeywordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Keyword to Track</DialogTitle>
            <DialogDescription>
              Add a new keyword to track rankings for {getSelectedEntityName()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="keyword" className="text-sm font-medium">Keyword</label>
              <Input 
                id="keyword" 
                placeholder="Enter keyword to track..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand">Brand</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="informational">Informational</SelectItem>
                  <SelectItem value="competitor">Competitor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">Priority</label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setKeywordDialogOpen(false)}>Cancel</Button>
            <Button onClick={addKeyword} disabled={!newKeyword.trim()}>Add Keyword</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}