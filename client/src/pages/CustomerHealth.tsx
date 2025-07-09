import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemoMode } from '@/contexts/DemoModeContext';
import {
  Search,
  PlusCircle,
  Download,
  Filter,
  MoreHorizontal,
  ChevronDown,
  Users,
  User,
  UserCheck,
  UserMinus,
  Heart,
  AlertCircle,
  Clock,
  Calendar,
  BarChart,
  PieChart,
  Activity,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  MessageCircle,
  Mail,
  FileText,
  ShieldCheck,
  Zap,
  DollarSign,
  Percent,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

// Types
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'churned' | 'at_risk';
  plan: string;
  mrr: number;
  totalSpent: number;
  dateJoined: string;
  lastContact: string;
  healthScore: number;
  npsScore?: number;
  tags: string[];
  notes?: string;
  avatar?: string;
  customFields?: Record<string, string | number | boolean>;
  entityId?: number;
  entityName?: string;
}

interface HealthMetric {
  id: number;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  status: 'good' | 'warning' | 'critical';
  icon: React.ElementType;
  description: string;
}

interface InteractionHistory {
  id: number;
  customerId: number;
  type: 'email' | 'call' | 'meeting' | 'support' | 'purchase' | 'cancellation' | 'upgrade' | 'downgrade';
  date: string;
  notes?: string;
  agent?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface SatisfactionSurvey {
  id: number;
  customerId: number;
  date: string;
  rating: number;
  feedback?: string;
  category?: string;
}

// Demo data
const getCustomerHealthMetrics = (demoMode: boolean): HealthMetric[] => {
  if (!demoMode) return [];
  
  return [
    {
      id: 1,
      name: 'Average Health Score',
      value: 72,
      previousValue: 68,
      change: 4,
      status: 'good',
      icon: Heart,
      description: 'Weighted score based on engagement, value, and retention risk'
    },
    {
      id: 2,
      name: 'Churn Risk Rate',
      value: 8.3,
      previousValue: 9.5,
      change: -1.2,
      status: 'good',
      icon: UserMinus,
      description: 'Percentage of customers at risk of churning'
    },
    {
      id: 3,
      name: 'Average NPS Score',
      value: 42,
      previousValue: 37,
      change: 5,
      status: 'warning',
      icon: Activity,
      description: 'Net Promoter Score (-100 to +100)'
    },
    {
      id: 4,
      name: 'Support Response Time',
      value: 3.2,
      previousValue: 4.5,
      change: -1.3,
      status: 'good',
      icon: Clock,
      description: 'Average hours to first response'
    },
    {
      id: 5,
      name: 'Active User Rate',
      value: 84,
      previousValue: 79,
      change: 5,
      status: 'good',
      icon: UserCheck,
      description: 'Percentage of customers active in the last 30 days'
    },
    {
      id: 6,
      name: 'Feature Adoption',
      value: 63,
      previousValue: 61,
      change: 2,
      status: 'warning',
      icon: Zap,
      description: 'Average percentage of available features used'
    }
  ];
};

const getAtRiskCustomers = (demoMode: boolean): Customer[] => {
  if (!demoMode) return [];
  
  return [
    {
      id: 1,
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '(555) 123-4567',
      company: 'Acme Corporation',
      status: 'at_risk',
      plan: 'Enterprise',
      mrr: 2500,
      totalSpent: 45000,
      dateJoined: '2022-03-15',
      lastContact: '2023-03-01',
      healthScore: 48,
      npsScore: 2,
      tags: ['enterprise', 'manufacturing'],
      notes: 'Recent support tickets about performance issues',
      entityName: 'Digital Merch Pros'
    },
    {
      id: 2,
      name: 'Johnson Medical',
      email: 'info@johnsonmedical.com',
      phone: '(555) 234-5678',
      company: 'Johnson Medical',
      status: 'at_risk',
      plan: 'Business',
      mrr: 1200,
      totalSpent: 28800,
      dateJoined: '2022-05-20',
      lastContact: '2023-02-27',
      healthScore: 52,
      npsScore: 4,
      tags: ['healthcare', 'mid-size'],
      notes: 'Reduced usage in the last 30 days',
      entityName: 'Mystery Hype'
    },
    {
      id: 3,
      name: 'Global Logistics Inc',
      email: 'support@globallogistics.com',
      phone: '(555) 345-6789',
      company: 'Global Logistics Inc',
      status: 'at_risk',
      plan: 'Business',
      mrr: 950,
      totalSpent: 22800,
      dateJoined: '2022-08-10',
      lastContact: '2023-03-02',
      healthScore: 45,
      npsScore: 3,
      tags: ['logistics', 'transportation'],
      notes: 'Contract renewal in 45 days, competitor outreach',
      entityName: 'Digital Merch Pros'
    }
  ];
};

const getSatisfactionSurveys = (demoMode: boolean): SatisfactionSurvey[] => {
  if (!demoMode) return [];
  
  return [
    {
      id: 1,
      customerId: 1,
      date: '2023-02-28',
      rating: 2,
      feedback: 'The system has been running slowly recently and affecting our operations.',
      category: 'Performance'
    },
    {
      id: 2,
      customerId: 2,
      date: '2023-02-25',
      rating: 4,
      feedback: 'Generally satisfied but would like more customization options for reports.',
      category: 'Features'
    },
    {
      id: 3,
      customerId: 3,
      date: '2023-02-27',
      rating: 3,
      feedback: 'Support team is helpful but response times could be faster.',
      category: 'Support'
    },
    {
      id: 4,
      customerId: 4,
      date: '2023-03-01',
      rating: 5,
      feedback: 'Very satisfied with the latest updates. Much easier to use now.',
      category: 'User Experience'
    },
    {
      id: 5,
      customerId: 5,
      date: '2023-02-26',
      rating: 1,
      feedback: 'Too many issues with integration to our ERP system.',
      category: 'Integration'
    }
  ];
};

// Component for Health Metric Card
const HealthMetricCard = ({ metric }: { metric: HealthMetric }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className={`flex items-center text-xs ${
              metric.change > 0 
                ? metric.status === 'good' ? 'text-green-500' : 'text-red-500'
                : metric.status === 'good' ? 'text-red-500' : 'text-green-500'
            }`}>
              {metric.change > 0 ? 
                <TrendingUp className="h-3 w-3 mr-1" /> : 
                <TrendingDown className="h-3 w-3 mr-1" />
              }
              {metric.change > 0 ? '+' : ''}{Math.abs(metric.change)} vs previous
            </div>
          </div>
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
            metric.status === 'good' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' :
            metric.status === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' :
            'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
          }`}>
            <metric.icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for At Risk Customer Card
const AtRiskCustomerCard = ({ customer }: { customer: Customer }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-2">
              <AvatarImage src={customer.avatar} />
              <AvatarFallback>{customer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{customer.name}</CardTitle>
              <CardDescription>{customer.company}</CardDescription>
            </div>
          </div>
          <Badge variant="destructive" className="ml-2">At Risk</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div>
            <div className="text-sm text-muted-foreground">Health Score</div>
            <div className="flex items-center">
              <Progress value={customer.healthScore} className="h-2 mr-2" />
              <span className="text-sm font-medium">{customer.healthScore}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>${customer.mrr}/mo</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>{new Date(customer.lastContact).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>NPS: {customer.npsScore}</span>
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span className="truncate">{customer.notes?.slice(0, 20)}...</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="outline" size="sm">
          <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
          Contact
        </Button>
        <Button variant="outline" size="sm">
          <FileText className="h-3.5 w-3.5 mr-1.5" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

// Component for Satisfaction Survey Card
const SatisfactionSurveyCard = ({ survey }: { survey: SatisfactionSurvey }) => {
  const getSentimentColor = (rating: number) => {
    if (rating >= 4) return 'text-green-500';
    if (rating >= 3) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const getSentimentIcons = (rating: number) => {
    const icons = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        icons.push(<CheckCircle2 key={i} className={`h-4 w-4 ${getSentimentColor(rating)}`} />);
      } else {
        icons.push(<Circle key={i} className="h-4 w-4 text-muted-foreground" />);
      }
    }
    return icons;
  };
  
  // Circle component for unfilled ratings
  function Circle(props: any) {
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
        {...props}
      >
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <Badge variant="outline" className={`mb-1 ${
              survey.category === 'Performance' ? 'border-orange-200 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' :
              survey.category === 'Support' ? 'border-blue-200 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
              survey.category === 'Features' ? 'border-purple-200 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' :
              survey.category === 'User Experience' ? 'border-green-200 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
              survey.category === 'Integration' ? 'border-red-200 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
              ''
            }`}>
              {survey.category}
            </Badge>
            <CardTitle className="text-sm">Satisfaction Survey</CardTitle>
            <CardDescription>{new Date(survey.date).toLocaleDateString()}</CardDescription>
          </div>
          <div className={`text-lg font-bold ${getSentimentColor(survey.rating)}`}>
            {survey.rating}/5
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            {getSentimentIcons(survey.rating)}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            "{survey.feedback}"
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component
const CustomerHealth = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { demoMode } = useDemoMode();
  
  // Load data with React Query (demo mode uses mock data)
  const { data: healthMetrics = [] } = useQuery({
    queryKey: ['customer-health-metrics'],
    queryFn: async () => {
      if (demoMode) {
        return getCustomerHealthMetrics(true);
      }
      const response = await apiRequest('GET', '/api/customer-health-metrics');
      return await response.json();
    }
  });
  
  const { data: atRiskCustomers = [] } = useQuery({
    queryKey: ['at-risk-customers'],
    queryFn: async () => {
      if (demoMode) {
        return getAtRiskCustomers(true);
      }
      const response = await apiRequest('GET', '/api/customers/at-risk');
      return await response.json();
    }
  });
  
  const { data: satisfactionSurveys = [] } = useQuery({
    queryKey: ['satisfaction-surveys'],
    queryFn: async () => {
      if (demoMode) {
        return getSatisfactionSurveys(true);
      }
      const response = await apiRequest('GET', '/api/satisfaction-surveys');
      return await response.json();
    }
  });
  
  const renderOverviewTab = () => {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Customer Health Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthMetrics.map((metric: HealthMetric) => (
              <HealthMetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">At-Risk Customers</h3>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {atRiskCustomers.map((customer: Customer) => (
              <AtRiskCustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Recent Satisfaction Surveys</h3>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {satisfactionSurveys.map((survey: SatisfactionSurvey) => (
              <SatisfactionSurveyCard key={survey.id} survey={survey} />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const renderNpsTab = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Net Promoter Score (NPS)</CardTitle>
            <CardDescription>Overall customer satisfaction and loyalty metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="relative h-48 w-48">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div className="text-5xl font-bold">42</div>
                  <div className="text-sm text-muted-foreground">Current NPS</div>
                </div>
                {/* This would typically be a Chart component */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-full rounded-full border-8 border-muted-foreground/10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-[85%] w-[85%] rounded-full border-8 border-green-500/50"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Detractors</div>
                <div className="text-2xl font-bold text-red-500">24%</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Passives</div>
                <div className="text-2xl font-bold text-amber-500">10%</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Promoters</div>
                <div className="text-2xl font-bold text-green-500">66%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>NPS Trend</CardTitle>
            <CardDescription>Historical NPS performance over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Chart placeholder - NPS trend over last 12 months</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderChurnAnalysisTab = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Churn Analysis</CardTitle>
            <CardDescription>Customer churn patterns and risk factors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Churn Rate</h4>
                <div className="flex items-end space-x-2 mb-1">
                  <div className="text-3xl font-bold">5.2%</div>
                  <div className="text-sm text-green-500 pb-1">-0.8% vs previous</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Monthly churn rate based on customer count
                </p>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Revenue Churn</h4>
                  <div className="flex items-end space-x-2 mb-1">
                    <div className="text-3xl font-bold">3.8%</div>
                    <div className="text-sm text-green-500 pb-1">-1.2% vs previous</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Monthly churn rate based on MRR
                  </p>
                </div>
              </div>
              
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Chart placeholder - Churn by segment</p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h4 className="text-sm font-medium mb-3">Top Churn Reasons</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Price/Value perception</span>
                    <span className="text-sm font-medium">34%</span>
                  </div>
                  <Progress value={34} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Missing features</span>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Poor customer support</span>
                    <span className="text-sm font-medium">16%</span>
                  </div>
                  <Progress value={16} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Competitor offering</span>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Business closed/changed</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Churn Prediction</CardTitle>
              <CardDescription>AI-powered churn risk prediction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-60">
                <p className="text-muted-foreground">Chart placeholder - Churn prediction model</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Retention Cohorts</CardTitle>
              <CardDescription>Customer retention by cohort</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-60">
                <p className="text-muted-foreground">Chart placeholder - Retention cohort analysis</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderCustomerHealthTab = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Health Score Distribution</CardTitle>
            <CardDescription>Distribution of customers by health score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <p className="text-muted-foreground">Chart placeholder - Health score distribution</p>
            </div>
            
            <div className="grid grid-cols-4 mt-6 text-center">
              <div className="p-3 border-r">
                <div className="text-sm font-medium text-muted-foreground">Critical</div>
                <div className="text-xl font-bold text-red-500">8%</div>
                <div className="text-xs text-muted-foreground">&lt; 40 score</div>
              </div>
              <div className="p-3 border-r">
                <div className="text-sm font-medium text-muted-foreground">At Risk</div>
                <div className="text-xl font-bold text-orange-500">15%</div>
                <div className="text-xs text-muted-foreground">40-60 score</div>
              </div>
              <div className="p-3 border-r">
                <div className="text-sm font-medium text-muted-foreground">Average</div>
                <div className="text-xl font-bold text-amber-500">42%</div>
                <div className="text-xs text-muted-foreground">60-80 score</div>
              </div>
              <div className="p-3">
                <div className="text-sm font-medium text-muted-foreground">Healthy</div>
                <div className="text-xl font-bold text-green-500">35%</div>
                <div className="text-xs text-muted-foreground">&gt; 80 score</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Health Score Components</CardTitle>
            <CardDescription>Breakdown of the factors influencing the health score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Product Usage</span>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <Progress value={30} className="h-2 bg-blue-100 dark:bg-blue-900/20" indicatorClassName="bg-blue-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Support Interaction</span>
                  <span className="text-sm font-medium">20%</span>
                </div>
                <Progress value={20} className="h-2 bg-green-100 dark:bg-green-900/20" indicatorClassName="bg-green-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Financial Health</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <Progress value={25} className="h-2 bg-purple-100 dark:bg-purple-900/20" indicatorClassName="bg-purple-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Engagement</span>
                  <span className="text-sm font-medium">15%</span>
                </div>
                <Progress value={15} className="h-2 bg-amber-100 dark:bg-amber-900/20" indicatorClassName="bg-amber-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Feature Adoption</span>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <Progress value={10} className="h-2 bg-red-100 dark:bg-red-900/20" indicatorClassName="bg-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customer Health</h1>
            <p className="text-muted-foreground">
              Monitor and analyze customer health metrics to improve retention and satisfaction
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="default" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="nps">NPS Analysis</TabsTrigger>
            <TabsTrigger value="churn">Churn Analysis</TabsTrigger>
            <TabsTrigger value="health-score">Health Score</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {renderOverviewTab()}
          </TabsContent>
          
          <TabsContent value="nps" className="space-y-4">
            {renderNpsTab()}
          </TabsContent>
          
          <TabsContent value="churn" className="space-y-4">
            {renderChurnAnalysisTab()}
          </TabsContent>
          
          <TabsContent value="health-score" className="space-y-4">
            {renderCustomerHealthTab()}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CustomerHealth;