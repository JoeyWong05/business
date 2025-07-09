import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { CustomProgress } from "@/components/CustomProgress";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { 
  Users, 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  Mail, 
  Phone, 
  Filter, 
  Download, 
  MoreHorizontal, 
  PieChart as PieChartIcon, 
  Megaphone, 
  UserPlus, 
  BarChart2, 
  ArrowUpRight, 
  Info, 
  Plus,
  Calendar,
  Search,
  MessageCircle
} from "lucide-react";

// Types
interface CustomerFeedback {
  id: number;
  customerId: number;
  customerName: string;
  avatarUrl?: string;
  businessEntity: string;
  feedbackType: 'review' | 'survey' | 'nps' | 'direct';
  rating: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  createdAt: string;
  content: string;
  source: string;
  tags: string[];
  status: 'new' | 'reviewed' | 'addressed' | 'closed';
  responseStatus: 'pending' | 'responded' | 'none';
}

interface NPSData {
  promoters: number;
  passives: number;
  detractors: number;
  score: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

// Sample data
const npsData: NPSData = {
  promoters: 68,
  passives: 22,
  detractors: 10,
  score: 58,
  trend: 'up',
  changePercent: 7.4
};

const feedbackDistribution = [
  { name: 'Product Quality', value: 38 },
  { name: 'Customer Service', value: 29 },
  { name: 'Shipping Speed', value: 18 },
  { name: 'Website Experience', value: 15 }
];

const sentimentTrend = [
  { month: 'Jan', positive: 54, neutral: 32, negative: 14 },
  { month: 'Feb', positive: 58, neutral: 30, negative: 12 },
  { month: 'Mar', positive: 55, neutral: 33, negative: 12 },
  { month: 'Apr', positive: 61, neutral: 29, negative: 10 },
  { month: 'May', positive: 65, neutral: 26, negative: 9 },
  { month: 'Jun', positive: 68, neutral: 22, negative: 10 }
];

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const sampleFeedback: CustomerFeedback[] = [
  {
    id: 1,
    customerId: 101,
    customerName: "Alex Johnson",
    avatarUrl: "/avatars/alex-johnson.jpg",
    businessEntity: "Digital Merch Pros",
    feedbackType: "review",
    rating: 5,
    sentiment: "positive",
    createdAt: "2024-03-10T14:23:00Z",
    content: "I absolutely love the quality of the custom t-shirts! The print is vibrant and hasn't faded after multiple washes. Will definitely order again.",
    source: "Website",
    tags: ["product", "quality", "repeat-customer"],
    status: "reviewed",
    responseStatus: "responded"
  },
  {
    id: 2,
    customerId: 132,
    customerName: "Sarah Miller",
    businessEntity: "Mystery Hype",
    feedbackType: "nps",
    rating: 9,
    sentiment: "positive",
    createdAt: "2024-03-14T09:45:00Z",
    content: "The Mystery Box exceeded my expectations! The curation was spot-on to my preferences. The personalized note was a thoughtful touch.",
    source: "Email Survey",
    tags: ["product", "personalization", "first-time"],
    status: "new",
    responseStatus: "pending"
  },
  {
    id: 3,
    customerId: 205,
    customerName: "Michael Chen",
    businessEntity: "Lone Star Custom",
    feedbackType: "direct",
    rating: 3,
    sentiment: "negative",
    createdAt: "2024-03-15T16:30:00Z",
    content: "My order arrived later than promised. When I reached out to customer service, it took 2 days to get a response. Disappointing experience overall.",
    source: "Support Ticket",
    tags: ["shipping", "customer-service", "response-time"],
    status: "addressed",
    responseStatus: "responded"
  },
  {
    id: 4,
    customerId: 178,
    customerName: "Emma Rodriguez",
    avatarUrl: "/avatars/emma-rodriguez.jpg",
    businessEntity: "Digital Merch Pros",
    feedbackType: "survey",
    rating: 4,
    sentiment: "positive",
    createdAt: "2024-03-18T11:15:00Z",
    content: "Great product design tools on the website! I would suggest adding more templates for different clothing types.",
    source: "Post-Purchase Survey",
    tags: ["website", "design-tools", "feature-request"],
    status: "new",
    responseStatus: "pending"
  },
  {
    id: 5,
    customerId: 92,
    customerName: "David Williams",
    businessEntity: "Alcoeaze",
    feedbackType: "review",
    rating: 2,
    sentiment: "negative",
    createdAt: "2024-03-19T13:40:00Z",
    content: "The quality of the product was not as advertised. The materials felt cheap and it didn't match the images on the website at all.",
    source: "Facebook",
    tags: ["product", "quality", "expectations"],
    status: "new",
    responseStatus: "pending"
  }
];

export default function CustomerFeedback() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedEntity, setSelectedEntity] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedFeedbackType, setSelectedFeedbackType] = useState("all");
  
  // Simulate data loading
  const { data: feedbackData, isLoading } = useQuery({
    queryKey: ['/api/customer-feedback'],
    queryFn: async () => {
      // This would normally be an API fetch, but we're using sample data
      return { feedbacks: sampleFeedback };
    }
  });
  
  const feedbacks = feedbackData?.feedbacks || [];
  
  // Filter feedback based on selected entity
  const filteredFeedback = selectedEntity === "all" 
    ? feedbacks 
    : feedbacks.filter(item => item.businessEntity.toLowerCase() === selectedEntity.toLowerCase());
    
  // Filter feedback based on selected type
  const typeFilteredFeedback = selectedFeedbackType === "all"
    ? filteredFeedback
    : filteredFeedback.filter(item => item.feedbackType === selectedFeedbackType);
  
  // Calculate average ratings
  const avgRating = typeFilteredFeedback.length > 0
    ? (typeFilteredFeedback.reduce((sum, item) => sum + item.rating, 0) / typeFilteredFeedback.length).toFixed(1)
    : "0.0";
    
  // Calculate sentiment distribution
  const positiveCount = typeFilteredFeedback.filter(item => item.sentiment === "positive").length;
  const neutralCount = typeFilteredFeedback.filter(item => item.sentiment === "neutral").length;
  const negativeCount = typeFilteredFeedback.filter(item => item.sentiment === "negative").length;
  const total = typeFilteredFeedback.length;
  
  const positivePercentage = total > 0 ? Math.round((positiveCount / total) * 100) : 0;
  const neutralPercentage = total > 0 ? Math.round((neutralCount / total) * 100) : 0;
  const negativePercentage = total > 0 ? Math.round((negativeCount / total) * 100) : 0;
  
  // Render sentiment badge
  const renderSentimentBadge = (sentiment: string) => {
    switch(sentiment) {
      case "positive":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300">Positive</Badge>;
      case "neutral":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300">Neutral</Badge>;
      case "negative":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300">Negative</Badge>;
      default:
        return null;
    }
  };
  
  // Render star rating
  const renderStarRating = (rating: number) => {
    const maxRating = 5;
    const stars = [];
    
    for (let i = 1; i <= maxRating; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };
  
  // Render feedback type badge
  const renderFeedbackTypeBadge = (type: string) => {
    switch(type) {
      case "review":
        return <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Review</Badge>;
      case "survey":
        return <Badge variant="outline" className="rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300">Survey</Badge>;
      case "nps":
        return <Badge variant="outline" className="rounded-full bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">NPS</Badge>;
      case "direct":
        return <Badge variant="outline" className="rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300">Direct</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Feedback</h1>
          <p className="text-muted-foreground mt-1">Monitor and analyze customer sentiment and feedback across all channels</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Select value={selectedEntity} onValueChange={setSelectedEntity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select business" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Businesses</SelectLabel>
                <SelectItem value="all">All Businesses</SelectItem>
                <SelectItem value="Digital Merch Pros">Digital Merch Pros</SelectItem>
                <SelectItem value="Mystery Hype">Mystery Hype</SelectItem>
                <SelectItem value="Lone Star Custom">Lone Star Custom</SelectItem>
                <SelectItem value="Alcoeaze">Alcoeaze</SelectItem>
                <SelectItem value="Hide Cafe">Hide Cafe</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="nps">NPS Analysis</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Average Rating</div>
                    <Star className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="text-3xl font-bold">{avgRating}</div>
                  <div className="mt-1 text-xs text-muted-foreground">out of 5.0</div>
                  <div className="mt-2 flex items-center text-sm">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+0.3</span>
                    <span className="text-muted-foreground ml-1">from last period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-muted-foreground">NPS Score</div>
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold">{npsData.score}</div>
                  <div className="mt-1 text-xs text-muted-foreground">promoters - detractors</div>
                  <div className="mt-2 flex items-center text-sm">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+{npsData.changePercent}%</span>
                    <span className="text-muted-foreground ml-1">from last period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Total Feedback</div>
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold">{total}</div>
                  <div className="mt-1 text-xs text-muted-foreground">across all channels</div>
                  <div className="mt-2 flex items-center text-sm">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+12%</span>
                    <span className="text-muted-foreground ml-1">from last period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Response Rate</div>
                    <MessageCircle className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold">92%</div>
                  <div className="mt-1 text-xs text-muted-foreground">of feedbacks addressed</div>
                  <div className="mt-2 flex items-center text-sm">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+5%</span>
                    <span className="text-muted-foreground ml-1">from last period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Feedback and Sentiment Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Sentiment Distribution</CardTitle>
                <CardDescription>Breakdown of positive, neutral, and negative feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Positive", value: positivePercentage },
                          { name: "Neutral", value: neutralPercentage },
                          { name: "Negative", value: negativePercentage }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[0, 1, 2].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <RechartsTooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Positive</span>
                      </div>
                      <span className="font-medium">{positivePercentage}%</span>
                    </div>
                    <CustomProgress value={positivePercentage} className="h-2 bg-muted" color="green" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                        <span>Neutral</span>
                      </div>
                      <span className="font-medium">{neutralPercentage}%</span>
                    </div>
                    <CustomProgress value={neutralPercentage} className="h-2 bg-muted" color="amber" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span>Negative</span>
                      </div>
                      <span className="font-medium">{negativePercentage}%</span>
                    </div>
                    <CustomProgress value={negativePercentage} className="h-2 bg-muted" color="red" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Sentiment Trend</CardTitle>
                <CardDescription>How customer sentiment has evolved over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sentimentTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar 
                        dataKey="positive" 
                        stackId="1" 
                        fill="#10B981"
                        name="Positive" 
                      />
                      <Bar 
                        dataKey="neutral" 
                        stackId="1" 
                        fill="#F59E0B"
                        name="Neutral" 
                      />
                      <Bar 
                        dataKey="negative" 
                        stackId="1" 
                        fill="#EF4444"
                        name="Negative" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Feedback */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-medium">Recent Feedback</CardTitle>
                <CardDescription>Latest customer feedback across all channels</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={selectedFeedbackType} onValueChange={setSelectedFeedbackType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="review">Reviews</SelectItem>
                    <SelectItem value="nps">NPS</SelectItem>
                    <SelectItem value="survey">Surveys</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {typeFilteredFeedback.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            {feedback.avatarUrl ? (
                              <AvatarImage src={feedback.avatarUrl} alt={feedback.customerName} />
                            ) : (
                              <AvatarFallback>{feedback.customerName.substring(0, 2)}</AvatarFallback>
                            )}
                          </Avatar>
                          <div className="font-medium">{feedback.customerName}</div>
                        </div>
                      </TableCell>
                      <TableCell>{feedback.businessEntity}</TableCell>
                      <TableCell>{renderFeedbackTypeBadge(feedback.feedbackType)}</TableCell>
                      <TableCell>{renderStarRating(feedback.rating)}</TableCell>
                      <TableCell>{renderSentimentBadge(feedback.sentiment)}</TableCell>
                      <TableCell>{new Date(feedback.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          feedback.status === 'new' 
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                            : feedback.status === 'reviewed'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                            : 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300'
                        }>
                          {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Respond</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Mark as reviewed</DropdownMenuItem>
                            <DropdownMenuItem>Mark as addressed</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between py-4">
              <p className="text-sm text-muted-foreground">Showing {typeFilteredFeedback.length} of {typeFilteredFeedback.length} items</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* NPS Analysis Tab */}
        <TabsContent value="nps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Net Promoter Score (NPS)</CardTitle>
              <CardDescription>Overall NPS score and distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center p-6 bg-background border rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Current NPS Score</div>
                  <div className="text-5xl font-bold">{npsData.score}</div>
                  <div className="flex items-center mt-2">
                    {npsData.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    ) : npsData.trend === 'down' ? (
                      <ArrowUpRight className="h-4 w-4 text-red-500 mr-1 transform rotate-90" />
                    ) : (
                      <span className="w-4 h-4 mr-1"></span>
                    )}
                    <span className={
                      npsData.trend === 'up' 
                        ? 'text-green-500 font-medium' 
                        : npsData.trend === 'down'
                        ? 'text-red-500 font-medium'
                        : 'text-muted-foreground'
                    }>
                      {npsData.trend === 'up' ? '+' : npsData.trend === 'down' ? '-' : ''}{npsData.changePercent}%
                    </span>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground text-center">
                    <p className="mb-1">Score bands:</p>
                    <p>
                      <span className="text-red-500">Needs improvement: -100 to 0</span> •{' '}
                      <span className="text-amber-500">Good: 0 to 50</span> •{' '}
                      <span className="text-green-500">Excellent: 50 to 100</span>
                    </p>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span>Promoters (9-10)</span>
                        </div>
                        <span className="font-medium">{npsData.promoters}%</span>
                      </div>
                      <CustomProgress value={npsData.promoters} max={100} className="h-3 bg-muted" color="green" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                          <span>Passives (7-8)</span>
                        </div>
                        <span className="font-medium">{npsData.passives}%</span>
                      </div>
                      <CustomProgress value={npsData.passives} max={100} className="h-3 bg-muted" color="amber" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span>Detractors (0-6)</span>
                        </div>
                        <span className="font-medium">{npsData.detractors}%</span>
                      </div>
                      <CustomProgress value={npsData.detractors} max={100} className="h-3 bg-muted" color="red" />
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-md border border-amber-200 dark:border-amber-800 flex items-start">
                    <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800 dark:text-amber-300">
                      <p className="font-medium">NPS Formula</p>
                      <p>NPS = % Promoters - % Detractors</p>
                      <p className="mt-1">The score ranges from -100 (if every customer is a detractor) to +100 (if every customer is a promoter).</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">NPS Trend Over Time</CardTitle>
                <CardDescription>6-month history of your NPS score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", nps: 42 },
                        { month: "Feb", nps: 45 },
                        { month: "Mar", nps: 48 },
                        { month: "Apr", nps: 52 },
                        { month: "May", nps: 55 },
                        { month: "Jun", nps: 58 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <RechartsTooltip />
                      <Line 
                        type="monotone" 
                        dataKey="nps" 
                        stroke="#10B981" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">NPS by Business Entity</CardTitle>
                <CardDescription>Compare NPS scores across entities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Digital Merch Pros", nps: 62 },
                        { name: "Mystery Hype", nps: 65 },
                        { name: "Lone Star Custom", nps: 54 },
                        { name: "Alcoeaze", nps: 48 },
                        { name: "Hide Cafe", nps: 51 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <RechartsTooltip />
                      <Bar 
                        dataKey="nps" 
                        fill="#10B981" 
                        name="NPS Score" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="relative w-[300px]">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input 
                  placeholder="Search reviews..." 
                  className="w-full pl-9"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Manual Feedback
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {typeFilteredFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          {feedback.avatarUrl ? (
                            <AvatarImage src={feedback.avatarUrl} alt={feedback.customerName} />
                          ) : (
                            <AvatarFallback>{feedback.customerName.substring(0, 2)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{feedback.customerName}</div>
                          <div className="text-sm text-muted-foreground">
                            {feedback.businessEntity} • {new Date(feedback.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {renderFeedbackTypeBadge(feedback.feedbackType)}
                        {renderSentimentBadge(feedback.sentiment)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-2">{renderStarRating(feedback.rating)}</div>
                      <p className="text-sm">{feedback.content}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {feedback.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="text-sm text-muted-foreground">
                        Source: <span className="font-medium">{feedback.source}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between py-4">
              <p className="text-sm text-muted-foreground">Showing {typeFilteredFeedback.length} of {typeFilteredFeedback.length} feedback</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Responses Tab */}
        <TabsContent value="responses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Response Management</CardTitle>
              <CardDescription>Track and manage your responses to customer feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Feedback Type</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Response Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {typeFilteredFeedback.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            {feedback.avatarUrl ? (
                              <AvatarImage src={feedback.avatarUrl} alt={feedback.customerName} />
                            ) : (
                              <AvatarFallback>{feedback.customerName.substring(0, 2)}</AvatarFallback>
                            )}
                          </Avatar>
                          <div className="font-medium">{feedback.customerName}</div>
                        </div>
                      </TableCell>
                      <TableCell>{feedback.businessEntity}</TableCell>
                      <TableCell>{renderFeedbackTypeBadge(feedback.feedbackType)}</TableCell>
                      <TableCell>{renderSentimentBadge(feedback.sentiment)}</TableCell>
                      <TableCell>{new Date(feedback.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          feedback.responseStatus === 'pending' 
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300' 
                            : feedback.responseStatus === 'responded'
                            ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                        }>
                          {feedback.responseStatus.charAt(0).toUpperCase() + feedback.responseStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={feedback.responseStatus === 'responded'}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Respond
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Response Rate</CardTitle>
                <CardDescription>Percentage of feedback that received a response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-6">
                  <div className="relative h-48 w-48">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl font-bold">92%</div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Responded", value: 92 },
                            { name: "Pending", value: 8 }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          <Cell fill="#10B981" />
                          <Cell fill="#F59E0B" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Responded (92%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span className="text-sm">Pending (8%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Response Time</CardTitle>
                <CardDescription>Average time to respond to customer feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 flex justify-center items-center h-64">
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-2">4.2</div>
                    <div className="text-lg text-muted-foreground">hours</div>
                    <div className="mt-4 flex items-center justify-center text-sm">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1 transform rotate-90" />
                      <span className="text-green-500 font-medium">-12%</span>
                      <span className="text-muted-foreground ml-1">from last month</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}