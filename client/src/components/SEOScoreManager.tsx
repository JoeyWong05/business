import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; 
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  AlertCircle,
  ArrowUp,
  BarChart2,
  ChevronDown,
  Clock,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  Info,
  Loader,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search as SearchIcon,
  Settings,
  Share,
  TrendingDown,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Types for SEO Score Management

export enum SEOScoreCategory {
  TECHNICAL = 'technical',
  CONTENT = 'content',
  ON_PAGE = 'on_page',
  OFF_PAGE = 'off_page',
  LOCAL = 'local',
  MOBILE = 'mobile',
  USER_EXPERIENCE = 'user_experience',
  SPEED = 'speed'
}

export enum SEOScoreSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

export enum SEOCompetitorRank {
  AHEAD = 'ahead',
  BEHIND = 'behind',
  EQUAL = 'equal'
}

export interface SEOScore {
  id: string;
  entityId: number;
  entityName: string;
  websiteUrl: string;
  overallScore: number; // 1-100
  createdAt: Date | string;
  updatedAt: Date | string;
  categoryScores: {
    [key in SEOScoreCategory]: number; // 1-100
  };
  keywordRankings: SEOKeywordRanking[];
  issues: SEOIssue[];
  recommendations: SEORecommendation[];
  competitorAnalysis: SEOCompetitorAnalysis[];
  historicalData: SEOHistoricalData[];
}

export interface SEOKeywordRanking {
  id: string;
  entityId: number;
  keyword: string;
  position: number;
  searchVolume: number;
  difficulty: number; // 1-100
  previousPosition?: number;
  dateChecked: Date | string;
  url?: string;
  isTargeted: boolean;
  competitorRankings?: {
    competitorName: string;
    position: number;
    url: string;
  }[];
}

export interface SEOIssue {
  id: string;
  entityId: number;
  category: SEOScoreCategory;
  severity: SEOScoreSeverity;
  title: string;
  description: string;
  affectedPages?: string[];
  impactScore: number; // 1-100
  recommendedActions: string[];
  status: 'open' | 'in_progress' | 'resolved' | 'ignored';
  createdAt: Date | string;
  resolvedAt?: Date | string;
}

export interface SEORecommendation {
  id: string;
  entityId: number;
  category: SEOScoreCategory;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  impactPotential: number; // 1-100
  estimatedTime: string; // "2 hours", "3 days"
  steps: string[];
  status: 'new' | 'in_progress' | 'completed' | 'ignored';
  createdAt: Date | string;
  completedAt?: Date | string;
}

export interface SEOCompetitorAnalysis {
  id: string;
  entityId: number;
  competitorName: string;
  websiteUrl: string;
  overallScore: number;
  strengthScore: number; // 1-100
  weaknessScore: number; // 1-100
  keywordOverlap: number; // percentage
  backlinks: number;
  domain: {
    authority: number; // 1-100
    age: number; // in months
    trustScore: number; // 1-100
  };
  ranking: SEOCompetitorRank;
  topKeywords: {
    keyword: string;
    position: number;
    searchVolume: number;
  }[];
  content: {
    totalPages: number;
    blogPosts: number;
    postFrequency: string; // "2 per week"
    avgWordCount: number;
  };
}

export interface SEOHistoricalData {
  id: string;
  entityId: number;
  date: Date | string;
  overallScore: number;
  categoryScores: {
    [key in SEOScoreCategory]: number; // 1-100
  };
  visibilityIndex?: number;
  keywordsInTop10?: number;
  totalBacklinks?: number;
}

export interface SEOAudit {
  id: string;
  entityId: number;
  entityName: string;
  websiteUrl: string;
  requestedAt: Date | string;
  completedAt?: Date | string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: SEOScore;
}

export interface SEOScoreManagerProps {
  entities: Array<{ id: number, name: string, type: string }>;
  seoScores?: SEOScore[];
  seoAudits?: SEOAudit[];
  onRunAudit?: (entityId: number, websiteUrl: string) => Promise<SEOAudit>;
  onGetAuditStatus?: (auditId: string) => Promise<SEOAudit>;
  onGetSEOScore?: (entityId: number) => Promise<SEOScore>;
  onUpdateIssueStatus?: (issueId: string, status: 'open' | 'in_progress' | 'resolved' | 'ignored') => Promise<SEOIssue>;
  onUpdateRecommendationStatus?: (recommendationId: string, status: 'new' | 'in_progress' | 'completed' | 'ignored') => Promise<SEORecommendation>;
  onAddTargetKeyword?: (entityId: number, keyword: string) => Promise<SEOKeywordRanking>;
  onRemoveTargetKeyword?: (keywordId: string) => Promise<void>;
  onAddCompetitor?: (entityId: number, competitorUrl: string, competitorName: string) => Promise<SEOCompetitorAnalysis>;
  onRemoveCompetitor?: (competitorId: string) => Promise<void>;
}

// Main component
const SEOScoreManager: React.FC<SEOScoreManagerProps> = ({
  entities,
  seoScores = [],
  seoAudits = [],
  onRunAudit,
  onGetAuditStatus,
  onGetSEOScore,
  onUpdateIssueStatus,
  onUpdateRecommendationStatus,
  onAddTargetKeyword,
  onRemoveTargetKeyword,
  onAddCompetitor,
  onRemoveCompetitor
}) => {
  const [selectedEntity, setSelectedEntity] = useState<number | 'all'>('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [competitorName, setCompetitorName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Get the score for the selected entity
  const getSelectedEntityScore = () => {
    if (selectedEntity === 'all' || !seoScores.length) {
      return null;
    }
    
    return seoScores.find(score => score.entityId === selectedEntity);
  };
  
  const selectedScore = getSelectedEntityScore();
  
  // Filtered issues based on selected entity, category, and severity
  const getFilteredIssues = () => {
    if (!selectedScore) {
      return [];
    }
    
    return selectedScore.issues.filter(issue => {
      // Filter by category
      if (categoryFilter !== 'all' && issue.category !== categoryFilter) {
        return false;
      }
      
      // Filter by severity
      if (severityFilter !== 'all' && issue.severity !== severityFilter) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm && !issue.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };
  
  const filteredIssues = getFilteredIssues();
  
  // Filtered recommendations based on selected entity and category
  const getFilteredRecommendations = () => {
    if (!selectedScore) {
      return [];
    }
    
    return selectedScore.recommendations.filter(recommendation => {
      // Filter by category
      if (categoryFilter !== 'all' && recommendation.category !== categoryFilter) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm && !recommendation.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };
  
  const filteredRecommendations = getFilteredRecommendations();
  
  // Format date
  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Format SEO score category
  const formatSEOCategory = (category: SEOScoreCategory) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) {
      return "text-green-500 dark:text-green-400";
    } else if (score >= 60) {
      return "text-yellow-500 dark:text-yellow-400";
    } else if (score >= 40) {
      return "text-orange-500 dark:text-orange-400";
    } else {
      return "text-red-500 dark:text-red-400";
    }
  };
  
  // Get score badge color
  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) {
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    } else if (score >= 60) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    } else if (score >= 40) {
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    } else {
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    }
  };
  
  // Get severity badge color
  const getSeverityBadgeColor = (severity: SEOScoreSeverity) => {
    switch (severity) {
      case SEOScoreSeverity.CRITICAL:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case SEOScoreSeverity.HIGH:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case SEOScoreSeverity.MEDIUM:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case SEOScoreSeverity.LOW:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case SEOScoreSeverity.INFO:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };
  
  // Handle running an SEO audit
  const handleRunAudit = async () => {
    if (selectedEntity === 'all' || !websiteUrl) {
      toast({
        title: "Missing information",
        description: "Please select an entity and enter a website URL.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRunningAudit(true);
    
    try {
      if (onRunAudit) {
        const audit = await onRunAudit(selectedEntity as number, websiteUrl);
        
        toast({
          title: "Audit started",
          description: "The SEO audit has been successfully initiated. This may take a few minutes to complete.",
        });
        
        // Start polling for audit status
        pollAuditStatus(audit.id);
      }
    } catch (error) {
      toast({
        title: "Audit failed",
        description: "Failed to start the SEO audit. Please try again.",
        variant: "destructive",
      });
      setIsRunningAudit(false);
    }
  };
  
  // Poll for audit status
  const pollAuditStatus = async (auditId: string) => {
    if (!onGetAuditStatus) {
      setIsRunningAudit(false);
      return;
    }
    
    try {
      const audit = await onGetAuditStatus(auditId);
      
      if (audit.status === 'completed') {
        toast({
          title: "Audit completed",
          description: "The SEO audit has been successfully completed.",
        });
        
        setIsRunningAudit(false);
        
        // Refresh the score
        if (onGetSEOScore && selectedEntity !== 'all') {
          await onGetSEOScore(selectedEntity as number);
        }
        
        return;
      } else if (audit.status === 'failed') {
        toast({
          title: "Audit failed",
          description: "The SEO audit failed to complete. Please try again.",
          variant: "destructive",
        });
        
        setIsRunningAudit(false);
        return;
      }
      
      // Continue polling
      setTimeout(() => pollAuditStatus(auditId), 5000);
    } catch (error) {
      toast({
        title: "Status check failed",
        description: "Failed to check the audit status. Please refresh the page.",
        variant: "destructive",
      });
      
      setIsRunningAudit(false);
    }
  };
  
  // Handle adding a target keyword
  const handleAddTargetKeyword = async () => {
    if (selectedEntity === 'all' || !newKeyword) {
      toast({
        title: "Missing information",
        description: "Please select an entity and enter a keyword.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (onAddTargetKeyword) {
        await onAddTargetKeyword(selectedEntity as number, newKeyword);
        
        toast({
          title: "Keyword added",
          description: `"${newKeyword}" has been added as a target keyword.`,
        });
        
        setNewKeyword('');
      }
    } catch (error) {
      toast({
        title: "Failed to add keyword",
        description: "Failed to add the target keyword. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle removing a target keyword
  const handleRemoveTargetKeyword = async (keywordId: string) => {
    setIsLoading(true);
    
    try {
      if (onRemoveTargetKeyword) {
        await onRemoveTargetKeyword(keywordId);
        
        toast({
          title: "Keyword removed",
          description: "The target keyword has been removed.",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to remove keyword",
        description: "Failed to remove the target keyword. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle adding a competitor
  const handleAddCompetitor = async () => {
    if (selectedEntity === 'all' || !competitorUrl || !competitorName) {
      toast({
        title: "Missing information",
        description: "Please select an entity and enter competitor details.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (onAddCompetitor) {
        await onAddCompetitor(selectedEntity as number, competitorUrl, competitorName);
        
        toast({
          title: "Competitor added",
          description: `"${competitorName}" has been added as a competitor.`,
        });
        
        setCompetitorUrl('');
        setCompetitorName('');
      }
    } catch (error) {
      toast({
        title: "Failed to add competitor",
        description: "Failed to add the competitor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle removing a competitor
  const handleRemoveCompetitor = async (competitorId: string) => {
    setIsLoading(true);
    
    try {
      if (onRemoveCompetitor) {
        await onRemoveCompetitor(competitorId);
        
        toast({
          title: "Competitor removed",
          description: "The competitor has been removed.",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to remove competitor",
        description: "Failed to remove the competitor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle updating issue status
  const handleUpdateIssueStatus = async (issueId: string, status: 'open' | 'in_progress' | 'resolved' | 'ignored') => {
    setIsLoading(true);
    
    try {
      if (onUpdateIssueStatus) {
        await onUpdateIssueStatus(issueId, status);
        
        toast({
          title: "Issue updated",
          description: `The issue status has been updated to ${status.replace('_', ' ')}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to update issue",
        description: "Failed to update the issue status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle updating recommendation status
  const handleUpdateRecommendationStatus = async (recommendationId: string, status: 'new' | 'in_progress' | 'completed' | 'ignored') => {
    setIsLoading(true);
    
    try {
      if (onUpdateRecommendationStatus) {
        await onUpdateRecommendationStatus(recommendationId, status);
        
        toast({
          title: "Recommendation updated",
          description: `The recommendation status has been updated to ${status.replace('_', ' ')}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to update recommendation",
        description: "Failed to update the recommendation status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get score trend description
  const getScoreTrendDescription = (score: SEOScore) => {
    if (score.historicalData.length < 2) {
      return "Not enough data to determine trend";
    }
    
    const latestScore = score.historicalData[score.historicalData.length - 1].overallScore;
    const previousScore = score.historicalData[score.historicalData.length - 2].overallScore;
    
    const difference = latestScore - previousScore;
    
    if (difference > 5) {
      return "Significant improvement in the last period";
    } else if (difference > 0) {
      return "Slight improvement in the last period";
    } else if (difference === 0) {
      return "Score has remained stable";
    } else if (difference > -5) {
      return "Slight decline in the last period";
    } else {
      return "Significant decline in the last period";
    }
  };
  
  // Get trend icon
  const getTrendIcon = (current: number, previous: number) => {
    const difference = current - previous;
    
    if (difference > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (difference === 0) {
      return <ArrowUp className="h-4 w-4 rotate-90 text-gray-500" />;
    } else {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">SEO Score Manager</h2>
          <p className="text-muted-foreground">
            Monitor and optimize your SEO performance with real-time scoring (1-100)
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
              {entities.map((entity) => (
                <SelectItem key={entity.id} value={entity.id.toString()}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={() => selectedScore ? setActiveTab('audit') : null}
            disabled={!selectedScore}
          >
            <Zap className="mr-2 h-4 w-4" />
            View SEO Score
          </Button>
        </div>
      </div>
      
      {/* Entity selection prompt if all entities are selected */}
      {selectedEntity === 'all' && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a Business Entity</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Please select a specific business entity to view its SEO score and perform an audit
              </p>
              <Select
                value={selectedEntity === 'all' ? undefined : selectedEntity.toString()}
                onValueChange={(value) => setSelectedEntity(parseInt(value))}
              >
                <SelectTrigger className="w-[250px] mx-auto">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Main content for selected entity */}
      {selectedEntity !== 'all' && (
        <>
          {selectedScore ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="competitors">Competitors</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                {/* Score overview card */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>SEO Performance Overview</CardTitle>
                        <CardDescription>
                          {selectedScore.entityName} • {selectedScore.websiteUrl}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge 
                          className={getScoreBadgeColor(selectedScore.overallScore)}
                        >
                          Score: {selectedScore.overallScore}/100
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          Last updated: {formatDate(selectedScore.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Overall score with trend */}
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="relative flex items-center justify-center w-32 h-32 mr-6">
                            <div className={`text-4xl font-bold ${getScoreColor(selectedScore.overallScore)}`}>
                              {selectedScore.overallScore}
                            </div>
                            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="10"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * selectedScore.overallScore / 100)}
                                className="text-muted stroke-[4] dark:text-muted"
                                transform="rotate(-90 50 50)"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                strokeWidth="10"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * selectedScore.overallScore / 100)}
                                className={
                                  selectedScore.overallScore >= 80 ? "text-green-500 stroke-current" :
                                  selectedScore.overallScore >= 60 ? "text-yellow-500 stroke-current" :
                                  selectedScore.overallScore >= 40 ? "text-orange-500 stroke-current" :
                                  "text-red-500 stroke-current"
                                }
                                transform="rotate(-90 50 50)"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium">Overall SEO Score</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {selectedScore.overallScore >= 80 ? "Excellent" :
                               selectedScore.overallScore >= 60 ? "Good" :
                               selectedScore.overallScore >= 40 ? "Needs Improvement" :
                               "Poor"}
                            </p>
                            <div className="text-sm mb-1">
                              {getScoreTrendDescription(selectedScore)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Based on analysis of {selectedScore.issues.length} technical factors
                            </div>
                          </div>
                        </div>
                        
                        {/* Issues summary */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Issues Breakdown</h4>
                          <div className="space-y-2">
                            {Object.entries({
                              [SEOScoreSeverity.CRITICAL]: selectedScore.issues.filter(i => i.severity === SEOScoreSeverity.CRITICAL && i.status !== 'resolved').length,
                              [SEOScoreSeverity.HIGH]: selectedScore.issues.filter(i => i.severity === SEOScoreSeverity.HIGH && i.status !== 'resolved').length,
                              [SEOScoreSeverity.MEDIUM]: selectedScore.issues.filter(i => i.severity === SEOScoreSeverity.MEDIUM && i.status !== 'resolved').length,
                              [SEOScoreSeverity.LOW]: selectedScore.issues.filter(i => i.severity === SEOScoreSeverity.LOW && i.status !== 'resolved').length
                            }).map(([severity, count]) => (
                              <div key={severity} className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <Badge 
                                    variant="outline"
                                    className={getSeverityBadgeColor(severity as SEOScoreSeverity)}
                                  >
                                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                                  </Badge>
                                </div>
                                <div className="text-sm">{count} issues</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Category scores */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium mb-2">Category Scores</h4>
                        <div className="space-y-3">
                          {Object.entries(selectedScore.categoryScores).map(([category, score]) => (
                            <div key={category} className="space-y-2">
                              <div className="flex justify-between">
                                <div className="text-sm">{formatSEOCategory(category as SEOScoreCategory)}</div>
                                <div className="text-sm font-medium">{score}/100</div>
                              </div>
                              <Progress 
                                value={score} 
                                className="h-2"
                                color={
                                  score >= 80 ? "bg-green-500" :
                                  score >= 60 ? "bg-yellow-500" :
                                  score >= 40 ? "bg-orange-500" :
                                  "bg-red-500"
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Keyword rankings and key metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Top Keyword Rankings</CardTitle>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveTab('keywords')}
                        >
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {selectedScore.keywordRankings.length === 0 ? (
                        <div className="text-center py-6">
                          <SearchIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No keyword rankings found</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedScore.keywordRankings
                            .sort((a, b) => a.position - b.position)
                            .slice(0, 5)
                            .map((keyword) => (
                              <div key={keyword.id} className="flex justify-between items-center pb-3 border-b last:border-0 last:pb-0">
                                <div>
                                  <div className="font-medium">{keyword.keyword}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Volume: {keyword.searchVolume.toLocaleString()} • Difficulty: {keyword.difficulty}/100
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {keyword.previousPosition && (
                                    <div className="flex items-center text-xs">
                                      {getTrendIcon(keyword.previousPosition, keyword.position)}
                                      <span className="ml-1">
                                        {keyword.previousPosition > keyword.position ? 
                                          `+${keyword.previousPosition - keyword.position}` : 
                                          keyword.previousPosition < keyword.position ?
                                          `-${keyword.position - keyword.previousPosition}` :
                                          '0'
                                        }
                                      </span>
                                    </div>
                                  )}
                                  <Badge 
                                    variant="outline"
                                    className={
                                      keyword.position <= 3 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                      keyword.position <= 10 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                      keyword.position <= 20 ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" :
                                      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    }
                                  >
                                    #{keyword.position}
                                  </Badge>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Issues To Fix</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedScore.issues.filter(i => i.status !== 'resolved' && i.status !== 'ignored').length === 0 ? (
                        <div className="text-center py-6">
                          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-muted-foreground">No active issues found</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedScore.issues
                            .filter(i => i.status !== 'resolved' && i.status !== 'ignored')
                            .sort((a, b) => {
                              const severityOrder = {
                                [SEOScoreSeverity.CRITICAL]: 0,
                                [SEOScoreSeverity.HIGH]: 1,
                                [SEOScoreSeverity.MEDIUM]: 2,
                                [SEOScoreSeverity.LOW]: 3,
                                [SEOScoreSeverity.INFO]: 4
                              };
                              return severityOrder[a.severity] - severityOrder[b.severity];
                            })
                            .slice(0, 5)
                            .map((issue) => (
                              <div 
                                key={issue.id} 
                                className="pb-3 border-b last:border-0 last:pb-0 cursor-pointer hover:bg-muted/50 transition-colors rounded-md px-2"
                                onClick={() => setSelectedIssue(issue.id)}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="font-medium">{issue.title}</div>
                                  <Badge 
                                    variant="outline"
                                    className={getSeverityBadgeColor(issue.severity)}
                                  >
                                    {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {formatSEOCategory(issue.category)} • Impact Score: {issue.impactScore}/100
                                </div>
                              </div>
                            ))
                          }
                          
                          {selectedScore.issues.filter(i => i.status !== 'resolved' && i.status !== 'ignored').length > 5 && (
                            <div className="text-center pt-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setActiveTab('issues')}
                              >
                                View All Issues
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Competitor analysis summary */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Competitor Analysis</CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab('competitors')}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Competitor</TableHead>
                          <TableHead>SEO Score</TableHead>
                          <TableHead>Domain Authority</TableHead>
                          <TableHead>Backlinks</TableHead>
                          <TableHead>Keyword Overlap</TableHead>
                          <TableHead>Ranking</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedScore.competitorAnalysis.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <div className="flex flex-col items-center">
                                <BarChart2 className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">No competitors analyzed yet</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          selectedScore.competitorAnalysis.map((competitor) => (
                            <TableRow key={competitor.id}>
                              <TableCell>
                                <div className="font-medium">{competitor.competitorName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {competitor.websiteUrl}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline"
                                  className={getScoreBadgeColor(competitor.overallScore)}
                                >
                                  {competitor.overallScore}/100
                                </Badge>
                              </TableCell>
                              <TableCell>{competitor.domain.authority}/100</TableCell>
                              <TableCell>{competitor.backlinks.toLocaleString()}</TableCell>
                              <TableCell>{competitor.keywordOverlap}%</TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline"
                                  className={
                                    competitor.ranking === SEOCompetitorRank.AHEAD ? 
                                    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                    competitor.ranking === SEOCompetitorRank.BEHIND ? 
                                    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  }
                                >
                                  {competitor.ranking.charAt(0).toUpperCase() + competitor.ranking.slice(1)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Keywords Tab */}
              <TabsContent value="keywords" className="space-y-4">
                {/* Keyword search controls */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search keywords..."
                        className="pl-8 w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Positions</SelectItem>
                        <SelectItem value="top3">Top 3</SelectItem>
                        <SelectItem value="top10">Top 10</SelectItem>
                        <SelectItem value="top20">Top 20</SelectItem>
                        <SelectItem value="top50">Top 50</SelectItem>
                        <SelectItem value="top100">Top 100</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Keywords</SelectItem>
                        <SelectItem value="targeted">Targeted Only</SelectItem>
                        <SelectItem value="non_targeted">Non-Targeted Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add new target keyword..."
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        className="w-[200px] md:w-[250px]"
                      />
                      <Button 
                        onClick={handleAddTargetKeyword}
                        disabled={isLoading || !newKeyword}
                      >
                        {isLoading ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="mr-2 h-4 w-4" />
                        )}
                        Add Keyword
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Keywords table */}
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Keyword</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Change</TableHead>
                          <TableHead>Search Volume</TableHead>
                          <TableHead>Difficulty</TableHead>
                          <TableHead>Targeted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedScore.keywordRankings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              <div className="flex flex-col items-center">
                                <SearchIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">No keyword rankings found</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          selectedScore.keywordRankings
                            .filter(keyword => {
                              if (searchTerm && !keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())) {
                                return false;
                              }
                              return true;
                            })
                            .sort((a, b) => a.position - b.position)
                            .map((keyword) => (
                              <TableRow key={keyword.id}>
                                <TableCell>
                                  <div className="font-medium">{keyword.keyword}</div>
                                  {keyword.url && (
                                    <div className="text-xs text-muted-foreground truncate max-w-xs">
                                      {keyword.url}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant="outline"
                                    className={
                                      keyword.position <= 3 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                      keyword.position <= 10 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                      keyword.position <= 20 ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" :
                                      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    }
                                  >
                                    #{keyword.position}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {keyword.previousPosition ? (
                                    <div className="flex items-center">
                                      {getTrendIcon(keyword.previousPosition, keyword.position)}
                                      <span className="ml-1 text-sm">
                                        {keyword.previousPosition > keyword.position ? 
                                          `+${keyword.previousPosition - keyword.position}` : 
                                          keyword.previousPosition < keyword.position ?
                                          `-${keyword.position - keyword.previousPosition}` :
                                          '0'
                                        }
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">New</span>
                                  )}
                                </TableCell>
                                <TableCell>{keyword.searchVolume.toLocaleString()}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Progress 
                                      value={keyword.difficulty} 
                                      className="h-2 w-16"
                                      color={
                                        keyword.difficulty <= 30 ? "bg-green-500" :
                                        keyword.difficulty <= 60 ? "bg-yellow-500" :
                                        "bg-red-500"
                                      }
                                    />
                                    <span className="text-sm">{keyword.difficulty}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {keyword.isTargeted ? (
                                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                      Yes
                                    </Badge>
                                  ) : (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleAddTargetKeyword()}
                                    >
                                      <Plus className="mr-1 h-3 w-3" />
                                      Target
                                    </Button>
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
                                      {keyword.url && (
                                        <DropdownMenuItem onClick={() => window.open(keyword.url, '_blank')}>
                                          <ExternalLink className="mr-2 h-4 w-4" />
                                          Visit Page
                                        </DropdownMenuItem>
                                      )}
                                      {keyword.isTargeted ? (
                                        <DropdownMenuItem onClick={() => handleRemoveTargetKeyword(keyword.id)}>
                                          <Trash className="mr-2 h-4 w-4" />
                                          Remove Target
                                        </DropdownMenuItem>
                                      ) : (
                                        <DropdownMenuItem onClick={() => handleAddTargetKeyword()}>
                                          <Plus className="mr-2 h-4 w-4" />
                                          Add Target
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuItem onClick={() => {}}>
                                        <BarChart2 className="mr-2 h-4 w-4" />
                                        View Competitors
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
              
              {/* Issues Tab */}
              <TabsContent value="issues" className="space-y-4">
                {/* Issues filters */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search issues..."
                        className="pl-8 w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Select 
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {Object.values(SEOScoreCategory).map((category) => (
                          <SelectItem key={category} value={category}>
                            {formatSEOCategory(category)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={severityFilter}
                      onValueChange={setSeverityFilter}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        {Object.values(SEOScoreSeverity).map((severity) => (
                          <SelectItem key={severity} value={severity}>
                            {severity.charAt(0).toUpperCase() + severity.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button onClick={() => setActiveTab('audit')}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Run New Audit
                  </Button>
                </div>
                
                {/* Issues list */}
                <div className="space-y-4">
                  {filteredIssues.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Issues Found</h3>
                        <p className="text-muted-foreground max-w-md text-center">
                          {searchTerm || categoryFilter !== 'all' || severityFilter !== 'all' ? 
                            "No issues match your current filters. Try adjusting your search criteria." :
                            "Great job! Your website doesn't have any SEO issues at the moment."
                          }
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredIssues.map((issue) => (
                      <Card key={issue.id} className={`border-l-4 ${
                        issue.severity === SEOScoreSeverity.CRITICAL ? 'border-l-red-500' :
                        issue.severity === SEOScoreSeverity.HIGH ? 'border-l-orange-500' :
                        issue.severity === SEOScoreSeverity.MEDIUM ? 'border-l-yellow-500' :
                        issue.severity === SEOScoreSeverity.LOW ? 'border-l-blue-500' :
                        'border-l-gray-500'
                      }`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{issue.title}</CardTitle>
                              <CardDescription>
                                {formatSEOCategory(issue.category)} • Impact Score: {issue.impactScore}/100
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Badge 
                                variant="outline"
                                className={getSeverityBadgeColor(issue.severity)}
                              >
                                {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                              </Badge>
                              <Badge 
                                variant="outline"
                                className={
                                  issue.status === 'open' ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                                  issue.status === 'in_progress' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                  issue.status === 'resolved' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                  "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                }
                              >
                                {issue.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm">{issue.description}</p>
                          
                          {issue.affectedPages && issue.affectedPages.length > 0 && (
                            <div className="mt-3">
                              <div className="text-sm font-medium mb-1">Affected Pages:</div>
                              <div className="text-sm text-muted-foreground">
                                {issue.affectedPages.length <= 3 ? (
                                  <ul className="list-disc pl-5 space-y-1">
                                    {issue.affectedPages.map((page, idx) => (
                                      <li key={idx}>{page}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <div>
                                    {issue.affectedPages[0]}
                                    <br />
                                    {issue.affectedPages[1]}
                                    <br />
                                    <Button variant="link" size="sm" className="h-6 p-0">
                                      +{issue.affectedPages.length - 2} more
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {issue.recommendedActions && issue.recommendedActions.length > 0 && (
                            <div className="mt-3">
                              <div className="text-sm font-medium mb-1">Recommended Actions:</div>
                              <ul className="list-disc pl-5 space-y-1 text-sm">
                                {issue.recommendedActions.map((action, idx) => (
                                  <li key={idx}>{action}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-3">
                          <div className="text-xs text-muted-foreground">
                            Detected on {formatDate(issue.createdAt)}
                          </div>
                          <div className="flex gap-2">
                            {issue.status !== 'resolved' && issue.status !== 'ignored' && (
                              <>
                                {issue.status === 'open' ? (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleUpdateIssueStatus(issue.id, 'in_progress')}
                                  >
                                    <Play className="mr-2 h-4 w-4" />
                                    Start Fixing
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleUpdateIssueStatus(issue.id, 'resolved')}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Resolved
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleUpdateIssueStatus(issue.id, 'ignored')}
                                >
                                  Ignore
                                </Button>
                              </>
                            )}
                            {(issue.status === 'resolved' || issue.status === 'ignored') && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateIssueStatus(issue.id, 'open')}
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Reopen
                              </Button>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
              
              {/* Recommendations Tab */}
              <TabsContent value="recommendations" className="space-y-4">
                {/* Recommendations filters */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search recommendations..."
                        className="pl-8 w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Select 
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {Object.values(SEOScoreCategory).map((category) => (
                          <SelectItem key={category} value={category}>
                            {formatSEOCategory(category)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="ignored">Ignored</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Recommendations list */}
                <div className="space-y-4">
                  {filteredRecommendations.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Recommendations</h3>
                        <p className="text-muted-foreground max-w-md text-center">
                          {searchTerm || categoryFilter !== 'all' ? 
                            "No recommendations match your current filters. Try adjusting your search criteria." :
                            "There are no recommendations at the moment."
                          }
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredRecommendations.map((recommendation) => (
                      <Card key={recommendation.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                              <CardDescription>
                                {formatSEOCategory(recommendation.category)} • Impact: {recommendation.impactPotential}/100 • Difficulty: {recommendation.difficulty.charAt(0).toUpperCase() + recommendation.difficulty.slice(1)}
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Badge 
                                variant="outline"
                                className={
                                  recommendation.status === 'new' ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                                  recommendation.status === 'in_progress' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                  recommendation.status === 'completed' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                  "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                }
                              >
                                {recommendation.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                              <Badge variant="outline">
                                {recommendation.estimatedTime}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm">{recommendation.description}</p>
                          
                          {recommendation.steps && recommendation.steps.length > 0 && (
                            <div className="mt-3">
                              <div className="text-sm font-medium mb-1">Implementation Steps:</div>
                              <ol className="list-decimal pl-5 space-y-1 text-sm">
                                {recommendation.steps.map((step, idx) => (
                                  <li key={idx}>{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-3">
                          <div className="text-xs text-muted-foreground">
                            Added on {formatDate(recommendation.createdAt)}
                          </div>
                          <div className="flex gap-2">
                            {recommendation.status !== 'completed' && recommendation.status !== 'ignored' && (
                              <>
                                {recommendation.status === 'new' ? (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleUpdateRecommendationStatus(recommendation.id, 'in_progress')}
                                  >
                                    <Play className="mr-2 h-4 w-4" />
                                    Start
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleUpdateRecommendationStatus(recommendation.id, 'completed')}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Complete
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleUpdateRecommendationStatus(recommendation.id, 'ignored')}
                                >
                                  Ignore
                                </Button>
                              </>
                            )}
                            {(recommendation.status === 'completed' || recommendation.status === 'ignored') && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateRecommendationStatus(recommendation.id, 'new')}
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Reactivate
                              </Button>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
              
              {/* Competitors Tab */}
              <TabsContent value="competitors" className="space-y-4">
                {/* Competitor controls */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <h3 className="text-lg font-medium">Competitor Analysis</h3>
                  
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Competitor URL..."
                        value={competitorUrl}
                        onChange={(e) => setCompetitorUrl(e.target.value)}
                        className="w-[180px] md:w-[220px]"
                      />
                      <Input
                        placeholder="Competitor Name..."
                        value={competitorName}
                        onChange={(e) => setCompetitorName(e.target.value)}
                        className="w-[180px] md:w-[220px]"
                      />
                      <Button 
                        onClick={handleAddCompetitor}
                        disabled={isLoading || !competitorUrl || !competitorName}
                      >
                        {isLoading ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="mr-2 h-4 w-4" />
                        )}
                        Add Competitor
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Competitors list */}
                {selectedScore.competitorAnalysis.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <BarChart2 className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Competitors Added</h3>
                      <p className="text-muted-foreground max-w-md text-center mb-4">
                        Add competitors to compare your SEO performance and identify opportunities for improvement.
                      </p>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Competitor URL..."
                          value={competitorUrl}
                          onChange={(e) => setCompetitorUrl(e.target.value)}
                          className="w-[220px]"
                        />
                        <Input
                          placeholder="Competitor Name..."
                          value={competitorName}
                          onChange={(e) => setCompetitorName(e.target.value)}
                          className="w-[220px]"
                        />
                        <Button 
                          onClick={handleAddCompetitor}
                          disabled={isLoading || !competitorUrl || !competitorName}
                        >
                          {isLoading ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="mr-2 h-4 w-4" />
                          )}
                          Add Competitor
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {selectedScore.competitorAnalysis.map((competitor) => (
                      <Card key={competitor.id}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{competitor.competitorName}</CardTitle>
                              <CardDescription>
                                {competitor.websiteUrl}
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline"
                                className={getScoreBadgeColor(competitor.overallScore)}
                              >
                                Score: {competitor.overallScore}/100
                              </Badge>
                              <Badge 
                                variant="outline"
                                className={
                                  competitor.ranking === SEOCompetitorRank.AHEAD ? 
                                  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                  competitor.ranking === SEOCompetitorRank.BEHIND ? 
                                  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                }
                              >
                                {competitor.ranking === SEOCompetitorRank.AHEAD ? "Ahead of you" :
                                 competitor.ranking === SEOCompetitorRank.BEHIND ? "Behind you" :
                                 "Equal to you"}
                              </Badge>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleRemoveCompetitor(competitor.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-medium">Domain Metrics</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <div className="text-sm">Domain Authority</div>
                                  <div className="text-sm font-medium">{competitor.domain.authority}/100</div>
                                </div>
                                <Progress 
                                  value={competitor.domain.authority} 
                                  className="h-2"
                                />
                                
                                <div className="flex justify-between items-center">
                                  <div className="text-sm">Trust Score</div>
                                  <div className="text-sm font-medium">{competitor.domain.trustScore}/100</div>
                                </div>
                                <Progress 
                                  value={competitor.domain.trustScore} 
                                  className="h-2"
                                />
                                
                                <div className="flex justify-between items-center mt-4">
                                  <div className="text-sm">Domain Age</div>
                                  <div className="text-sm font-medium">{competitor.domain.age} months</div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <div className="text-sm">Backlinks</div>
                                  <div className="text-sm font-medium">{competitor.backlinks.toLocaleString()}</div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <div className="text-sm">Keyword Overlap</div>
                                  <div className="text-sm font-medium">{competitor.keywordOverlap}%</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <h4 className="text-sm font-medium">Strengths & Weaknesses</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <div className="text-sm">Strength Score</div>
                                  <div className="text-sm font-medium">{competitor.strengthScore}/100</div>
                                </div>
                                <Progress 
                                  value={competitor.strengthScore} 
                                  className="h-2"
                                  color="bg-blue-500"
                                />
                                
                                <div className="flex justify-between items-center">
                                  <div className="text-sm">Weakness Score</div>
                                  <div className="text-sm font-medium">{competitor.weaknessScore}/100</div>
                                </div>
                                <Progress 
                                  value={competitor.weaknessScore} 
                                  className="h-2"
                                  color="bg-orange-500"
                                />
                              </div>
                              
                              <div className="pt-3">
                                <h4 className="text-sm font-medium mb-2">Content Statistics</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-sm text-muted-foreground">Total Pages</div>
                                    <div className="font-medium">{competitor.content.totalPages.toLocaleString()}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Blog Posts</div>
                                    <div className="font-medium">{competitor.content.blogPosts.toLocaleString()}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Post Frequency</div>
                                    <div className="font-medium">{competitor.content.postFrequency}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Avg Word Count</div>
                                    <div className="font-medium">{competitor.content.avgWordCount.toLocaleString()}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <h4 className="text-sm font-medium">Top Keywords</h4>
                              <div className="space-y-2">
                                {competitor.topKeywords.length === 0 ? (
                                  <div className="text-center py-4">
                                    <SearchIcon className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">No keyword data available</p>
                                  </div>
                                ) : (
                                  competitor.topKeywords.map((keyword, idx) => (
                                    <div key={idx} className="flex justify-between items-center pb-2 border-b last:border-0 last:pb-0">
                                      <div className="font-medium text-sm">{keyword.keyword}</div>
                                      <div className="flex items-center gap-2">
                                        <div className="text-sm text-muted-foreground">
                                          {keyword.searchVolume.toLocaleString()}
                                        </div>
                                        <Badge 
                                          variant="outline"
                                          className={
                                            keyword.position <= 3 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                            keyword.position <= 10 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                          }
                                        >
                                          #{keyword.position}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No SEO Score Available</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Run an SEO audit to get a comprehensive analysis of your website's search engine optimization
                  </p>
                  <div className="max-w-md mx-auto">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="website-url">Website URL</Label>
                        <Input 
                          id="website-url" 
                          placeholder="https://www.example.com"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleRunAudit}
                        disabled={isRunningAudit || !websiteUrl}
                        className="w-full"
                      >
                        {isRunningAudit ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Running Audit...
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Run SEO Audit
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
      
      {/* Audit Tab */}
      <TabsContent value="audit" className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="max-w-md mx-auto py-6">
              <h3 className="text-lg font-medium text-center mb-4">Run a New SEO Audit</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-website-url">Website URL</Label>
                  <Input 
                    id="new-website-url" 
                    placeholder="https://www.example.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the full URL including https:// or http://
                  </p>
                </div>
                
                <Button 
                  onClick={handleRunAudit}
                  disabled={isRunningAudit || !websiteUrl}
                  className="w-full"
                >
                  {isRunningAudit ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Running Audit...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Run SEO Audit
                    </>
                  )}
                </Button>
                
                {isRunningAudit && (
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    This may take a few minutes to complete. Please be patient.
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <h4 className="text-sm font-medium mb-2">What the audit checks:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Technical SEO factors (meta tags, site structure, etc.)</li>
                  <li>Content quality and optimization</li>
                  <li>On-page SEO elements</li>
                  <li>Mobile-friendliness and responsive design</li>
                  <li>Page speed and performance</li>
                  <li>Backlink profile and authority</li>
                  <li>Keyword rankings and opportunities</li>
                  <li>Competitor analysis</li>
                </ul>
              </div>
              
              <div className="mt-6 text-sm text-muted-foreground">
                <div className="flex items-start">
                  <Info className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                  <p>
                    Audit results will be summarized into a comprehensive score from 1-100, with detailed insights and recommendations for improvement.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Audit History */}
        {seoAudits.filter(audit => 
          selectedEntity === 'all' || audit.entityId === selectedEntity
        ).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Audits</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entity</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seoAudits
                    .filter(audit => selectedEntity === 'all' || audit.entityId === selectedEntity)
                    .sort((a, b) => 
                      new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
                    )
                    .map((audit) => (
                      <TableRow key={audit.id}>
                        <TableCell>{audit.entityName}</TableCell>
                        <TableCell>{audit.websiteUrl}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={
                              audit.status === 'completed' ? 
                              "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                              audit.status === 'in_progress' ? 
                              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                              audit.status === 'pending' ? 
                              "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }
                          >
                            {audit.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(audit.requestedAt)}</TableCell>
                        <TableCell>
                          {audit.completedAt ? formatDate(audit.completedAt) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {audit.status === 'completed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setActiveTab('overview')}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Results
                            </Button>
                          )}
                          {audit.status === 'in_progress' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled
                            >
                              <Loader className="mr-2 h-4 w-4 animate-spin" />
                              In Progress
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      
      {/* Issue Detail Dialog would be implemented here */}
      
      {/* Recommendation Detail Dialog would be implemented here */}
    </div>
  );
};

interface CheckCircleProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const CheckCircle: React.FC<CheckCircleProps> = ({ className, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
};

interface MousePointerClickProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const MousePointerClick: React.FC<MousePointerClickProps> = ({ className, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="m9 9 5 12 1.8-5.2L21 14Z"/>
      <path d="M7.2 2.2 8 5.1"/>
      <path d="M5.1 7.2 2.2 8"/>
      <path d="M14 4.1 12 6"/>
      <path d="m6 12-1.9 2"/>
    </svg>
  );
};

interface MailOpenProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const MailOpen: React.FC<MailOpenProps> = ({ className, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/>
      <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/>
    </svg>
  );
};

interface DollarSignProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const DollarSign: React.FC<DollarSignProps> = ({ className, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <line x1="12" x2="12" y1="2" y2="22"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
};

export default SEOScoreManager;