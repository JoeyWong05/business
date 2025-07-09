import React, { useState } from 'react';
import {
  LightbulbIcon,
  TrendingUp,
  AlertTriangle,
  Zap,
  LineChart,
  BarChart3,
  Calendar,
  ChevronDown,
  FileText
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePersonalization } from '@/contexts/PersonalizationContext';

// Importing components we'll need to make
import PredictiveInsightsPanel from '@/components/PredictiveInsightsPanel';

const PredictiveInsights = () => {
  const { personalizationSettings } = usePersonalization();
  const [timeRange, setTimeRange] = useState('30days');
  
  return (
    <div className="container px-4 mx-auto max-w-7xl">
      <PageHeader 
        title="Predictive Insights" 
        subtitle="AI-powered forecasting to anticipate trends and optimize business decisions"
        icon={<LightbulbIcon className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Time range: {timeRange === '7days' ? '7 days' : timeRange === '30days' ? '30 days' : '90 days'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTimeRange('7days')}>Next 7 days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange('30days')}>Next 30 days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange('90days')}>Next 90 days</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="default" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        }
      />
      
      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="bg-card">
          <TabsTrigger value="metrics">Business Metrics</TabsTrigger>
          <TabsTrigger value="opportunities">Growth Opportunities</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
          <TabsTrigger value="schedule">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Revenue Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$42,580</p>
                <p className="text-sm text-muted-foreground mt-1">Projected for next 30 days</p>
                <p className="text-sm mt-4 flex items-center gap-1 text-green-600 dark:text-green-400">
                  <TrendingUp className="h-4 w-4" /> 12.3% increase from current month
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  Cost Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$3,850</p>
                <p className="text-sm text-muted-foreground mt-1">Potential monthly savings</p>
                <p className="text-sm mt-4">Biggest opportunity: Consolidate SaaS tools</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Growth Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">17.8%</p>
                <p className="text-sm text-muted-foreground mt-1">Projected annual growth</p>
                <p className="text-sm mt-4">Based on current trajectory and market conditions</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Main insights panel */}
          <PredictiveInsightsPanel fullWidth={true} />
        </TabsContent>
        
        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  High-Impact Opportunities
                </CardTitle>
                <CardDescription>
                  Key areas where you can drive significant growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Expand Social Media Presence</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Increase engagement on Instagram and TikTok to reach new audience segments
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">High ROI</Badge>
                    </div>
                    <div className="mt-4 text-sm">
                      <p className="text-muted-foreground">Projected outcome:</p>
                      <p className="font-medium mt-1">
                        25-30% increase in organic reach within 60 days
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Launch Referral Program</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implement a structured customer referral system with incentives
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">High ROI</Badge>
                    </div>
                    <div className="mt-4 text-sm">
                      <p className="text-muted-foreground">Projected outcome:</p>
                      <p className="font-medium mt-1">
                        15-20% increase in new customer acquisition at 30% lower CAC
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="p-0">
                  View detailed analysis
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Emerging Trends
                </CardTitle>
                <CardDescription>
                  Market trends you should prepare to capitalize on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Sustainable Product Packaging</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Growing consumer demand for eco-friendly packaging solutions
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Trend</Badge>
                    </div>
                    <div className="mt-4 text-sm">
                      <p className="text-muted-foreground">Recommendation:</p>
                      <p className="font-medium mt-1">
                        Begin transitioning to recycled materials within next 90 days
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Interactive Product Demos</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Increasing engagement through interactive online product demonstrations
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Trend</Badge>
                    </div>
                    <div className="mt-4 text-sm">
                      <p className="text-muted-foreground">Recommendation:</p>
                      <p className="font-medium mt-1">
                        Develop video and AR demos for top 5 products
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="p-0">
                  View detailed analysis
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="risks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Business Risks
                </CardTitle>
                <CardDescription>
                  Potential challenges that could impact your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Supply Chain Disruption</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Potential delays from key suppliers in Q3
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-red-50 text-red-700">High Risk</Badge>
                    </div>
                    <div className="mt-4 text-sm">
                      <p className="text-muted-foreground">Mitigation strategy:</p>
                      <p className="font-medium mt-1">
                        Identify backup suppliers and increase inventory of critical components
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Rising Advertising Costs</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Digital ad costs projected to increase 15-20% in next quarter
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Medium Risk</Badge>
                    </div>
                    <div className="mt-4 text-sm">
                      <p className="text-muted-foreground">Mitigation strategy:</p>
                      <p className="font-medium mt-1">
                        Shift budget toward content marketing and email campaigns
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="p-0">
                  View all risks
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Regulatory Changes
                </CardTitle>
                <CardDescription>
                  Upcoming regulations that may affect your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Data Privacy Updates</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          New data protection requirements effective in 120 days
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Medium Risk</Badge>
                    </div>
                    <div className="mt-4 text-sm">
                      <p className="text-muted-foreground">Recommendation:</p>
                      <p className="font-medium mt-1">
                        Schedule compliance review and update privacy policies
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Import Tax Changes</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Potential tariff increases on international shipping
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Medium Risk</Badge>
                    </div>
                    <div className="mt-4 text-sm">
                      <p className="text-muted-foreground">Recommendation:</p>
                      <p className="font-medium mt-1">
                        Update pricing models to account for potential increases
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="p-0">
                  View detailed analysis
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Timeline</CardTitle>
              <CardDescription>
                Optimal scheduling for implementing business initiatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 h-full w-px bg-border"></div>
                
                <div className="space-y-8 relative">
                  <div className="ml-12 relative">
                    <div className="absolute -left-12 top-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      1
                    </div>
                    <h3 className="font-medium">Immediate (Next 30 Days)</h3>
                    <ul className="mt-2 space-y-2">
                      <li className="text-sm flex items-start gap-2">
                        <span className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-xs">✓</span>
                        <span>Implement customer feedback collection mechanism</span>
                      </li>
                      <li className="text-sm flex items-start gap-2">
                        <span className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-xs">!</span>
                        <span>Begin social media content calendar expansion</span>
                      </li>
                      <li className="text-sm flex items-start gap-2">
                        <span className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-xs">!</span>
                        <span>Audit and optimize current ad campaigns</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="ml-12 relative">
                    <div className="absolute -left-12 top-1 w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-primary-foreground">
                      2
                    </div>
                    <h3 className="font-medium">Short-term (60-90 Days)</h3>
                    <ul className="mt-2 space-y-2">
                      <li className="text-sm flex items-start gap-2">
                        <span className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-xs">→</span>
                        <span>Launch referral program with initial incentives</span>
                      </li>
                      <li className="text-sm flex items-start gap-2">
                        <span className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-xs">→</span>
                        <span>Implement alternative supplier onboarding process</span>
                      </li>
                      <li className="text-sm flex items-start gap-2">
                        <span className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-xs">→</span>
                        <span>Begin content marketing strategy implementation</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="ml-12 relative">
                    <div className="absolute -left-12 top-1 w-8 h-8 rounded-full bg-primary/60 flex items-center justify-center text-primary-foreground">
                      3
                    </div>
                    <h3 className="font-medium">Medium-term (3-6 Months)</h3>
                    <ul className="mt-2 space-y-2">
                      <li className="text-sm flex items-start gap-2">
                        <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 text-xs">○</span>
                        <span>Complete regulatory compliance updates</span>
                      </li>
                      <li className="text-sm flex items-start gap-2">
                        <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 text-xs">○</span>
                        <span>Transition to eco-friendly packaging materials</span>
                      </li>
                      <li className="text-sm flex items-start gap-2">
                        <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 text-xs">○</span>
                        <span>Launch interactive product demos for flagship products</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">
                Export Timeline
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveInsights;