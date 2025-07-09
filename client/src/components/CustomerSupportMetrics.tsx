import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { 
  Card, 
  CardContent, 
  CardDescription, 
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
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Activity, 
  BarChart, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  BarChart2,
  MessageSquare,
  StopCircle,
  Building,
  RotateCw,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart,
  Line
} from "recharts";

// Types for the metrics data
interface AgentMetrics {
  id: string;
  name: string;
  avatar?: string;
  ticketsPerHour: number;
  avgResponseTime: number; // in minutes
  firstReplyTime: number; // in minutes
  resolvedTickets: number;
  totalTickets: number;
  customerSatisfaction: number; // 0-100
}

interface TicketMetrics {
  waitingTimeDistribution: {
    lessThan15Min: number;
    lessThan30Min: number;
    lessThan1Hour: number;
    lessThan4Hours: number;
    lessThan24Hours: number;
    moreThan24Hours: number;
  };
  ticketsByStatus: {
    open: number;
    pending: number;
    solved: number;
    closed: number;
  };
  ticketsByPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  ticketsByChannel: {
    email: number;
    chat: number;
    phone: number;
    website: number;
    whatsapp: number;
    other: number;
  };
  timeToResolve: {
    avgTimeToResolve: number; // in hours
    avgFirstResponseTime: number; // in minutes
  };
}

interface EntityMetrics {
  id: number;
  name: string;
  tickets: number;
  avgResponseTime: number;
  customerSatisfaction: number;
}

interface DailyMetricsData {
  date: string;
  newTickets: number;
  resolvedTickets: number;
  avgResponseTime: number;
}

interface SupportMetricsData {
  agentMetrics: AgentMetrics[];
  ticketMetrics: TicketMetrics;
  entityMetrics: EntityMetrics[];
  dailyMetrics: DailyMetricsData[];
  overallMetrics: {
    totalTickets: number;
    openTickets: number;
    avgResponseTime: number; // in minutes
    avgResolutionTime: number; // in hours
    customerSatisfaction: number; // 0-100
    ticketsPerHour: number;
  };
}

// Time period options
type TimePeriod = 'today' | 'yesterday' | '7days' | '30days' | 'custom';

export default function CustomerSupportMetrics() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7days');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  
  // Fetch metrics data
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/support-metrics', timePeriod, entityFilter],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });
  
  // Format response time
  const formatResponseTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };
  
  // Format the metrics data
  const metricsData: SupportMetricsData = data?.data || {
    agentMetrics: [],
    ticketMetrics: {
      waitingTimeDistribution: {
        lessThan15Min: 0,
        lessThan30Min: 0,
        lessThan1Hour: 0,
        lessThan4Hours: 0,
        lessThan24Hours: 0,
        moreThan24Hours: 0
      },
      ticketsByStatus: {
        open: 0,
        pending: 0,
        solved: 0,
        closed: 0
      },
      ticketsByPriority: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      },
      ticketsByChannel: {
        email: 0,
        chat: 0,
        phone: 0,
        website: 0,
        whatsapp: 0,
        other: 0
      },
      timeToResolve: {
        avgTimeToResolve: 0,
        avgFirstResponseTime: 0
      }
    },
    entityMetrics: [],
    dailyMetrics: [],
    overallMetrics: {
      totalTickets: 0,
      openTickets: 0,
      avgResponseTime: 0,
      avgResolutionTime: 0,
      customerSatisfaction: 0,
      ticketsPerHour: 0
    }
  };
  
  // For the waiting time distribution chart
  const waitingTimeData = [
    { name: '<15m', value: metricsData.ticketMetrics.waitingTimeDistribution.lessThan15Min },
    { name: '<30m', value: metricsData.ticketMetrics.waitingTimeDistribution.lessThan30Min },
    { name: '<1h', value: metricsData.ticketMetrics.waitingTimeDistribution.lessThan1Hour },
    { name: '<4h', value: metricsData.ticketMetrics.waitingTimeDistribution.lessThan4Hours },
    { name: '<24h', value: metricsData.ticketMetrics.waitingTimeDistribution.lessThan24Hours },
    { name: '>24h', value: metricsData.ticketMetrics.waitingTimeDistribution.moreThan24Hours }
  ];
  
  // For tickets by channel chart
  const channelData = [
    { name: 'Email', value: metricsData.ticketMetrics.ticketsByChannel.email },
    { name: 'Chat', value: metricsData.ticketMetrics.ticketsByChannel.chat },
    { name: 'Phone', value: metricsData.ticketMetrics.ticketsByChannel.phone },
    { name: 'Website', value: metricsData.ticketMetrics.ticketsByChannel.website },
    { name: 'WhatsApp', value: metricsData.ticketMetrics.ticketsByChannel.whatsapp },
    { name: 'Other', value: metricsData.ticketMetrics.ticketsByChannel.other }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Support Metrics</h2>
          <p className="text-muted-foreground">
            Monitor support team performance and customer wait times
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Entities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              {metricsData.entityMetrics.map(entity => (
                <SelectItem key={entity.id} value={entity.id.toString()}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <RefreshButton />
          </Button>
        </div>
      </div>
      
      {/* Main metrics overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard 
          title="Total Tickets" 
          value={metricsData.overallMetrics.totalTickets} 
          icon={<MessageSquare className="h-4 w-4 text-blue-500" />}
        />
        <MetricCard 
          title="Open Tickets" 
          value={metricsData.overallMetrics.openTickets} 
          icon={<AlertCircle className="h-4 w-4 text-amber-500" />}
        />
        <MetricCard 
          title="Avg Response Time" 
          value={formatResponseTime(metricsData.overallMetrics.avgResponseTime)} 
          icon={<Clock className="h-4 w-4 text-purple-500" />}
        />
        <MetricCard 
          title="Avg Resolution Time" 
          value={`${metricsData.overallMetrics.avgResolutionTime.toFixed(1)}h`} 
          icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
        />
        <MetricCard 
          title="Tickets Per Hour" 
          value={metricsData.overallMetrics.ticketsPerHour.toFixed(1)} 
          icon={<Activity className="h-4 w-4 text-red-500" />}
        />
        <MetricCard 
          title="CSAT Score" 
          value={`${metricsData.overallMetrics.customerSatisfaction}%`} 
          icon={<Users className="h-4 w-4 text-indigo-500" />}
        />
      </div>
      
      {/* Detailed metrics tabs */}
      <Tabs defaultValue="agent-performance" className="space-y-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4">
          <TabsTrigger value="agent-performance">Agent Performance</TabsTrigger>
          <TabsTrigger value="wait-times">Wait Times</TabsTrigger>
          <TabsTrigger value="ticket-analysis">Ticket Analysis</TabsTrigger>
          <TabsTrigger value="entity-metrics">Entity Metrics</TabsTrigger>
        </TabsList>
        
        {/* Agent Performance Tab */}
        <TabsContent value="agent-performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tickets Per Hour by Agent</CardTitle>
                <CardDescription>
                  Number of tickets processed by each agent per hour
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={metricsData.agentMetrics.map(agent => ({
                        name: agent.name,
                        value: agent.ticketsPerHour
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="value" fill="#3498db" name="Tickets/Hour" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Average Response Time by Agent</CardTitle>
                <CardDescription>
                  Average time to first response in minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={metricsData.agentMetrics.map(agent => ({
                        name: agent.name,
                        value: agent.firstReplyTime
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <RechartsTooltip formatter={(value) => [`${value} min`, 'Response Time']} />
                      <Bar dataKey="value" fill="#e74c3c" name="Minutes" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Details</CardTitle>
              <CardDescription>
                Detailed metrics for each support agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {metricsData.agentMetrics.map(agent => (
                  <div key={agent.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {agent.avatar ? (
                            <img 
                              src={agent.avatar} 
                              alt={agent.name} 
                              className="h-10 w-10 rounded-full" 
                            />
                          ) : (
                            <Users className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {agent.resolvedTickets} of {agent.totalTickets} tickets resolved
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{agent.ticketsPerHour.toFixed(1)}</p>
                          <p className="text-xs text-muted-foreground">Tickets/hr</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatResponseTime(agent.avgResponseTime)}</p>
                          <p className="text-xs text-muted-foreground">Avg Response</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{agent.customerSatisfaction}%</p>
                          <p className="text-xs text-muted-foreground">CSAT</p>
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={(agent.resolvedTickets / agent.totalTickets) * 100 || 0} 
                      className="h-2"
                    />
                  </div>
                ))}
                
                {metricsData.agentMetrics.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <HelpCircle className="h-10 w-10 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No Agent Data Available</h3>
                    <p className="text-muted-foreground">
                      There is no agent performance data for the selected time period.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Wait Times Tab */}
        <TabsContent value="wait-times" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Wait Time Distribution</CardTitle>
                <CardDescription>
                  Distribution of wait times for customer responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={waitingTimeData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="value" name="Tickets" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Daily Response Performance</CardTitle>
                <CardDescription>
                  Average response time trends over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={metricsData.dailyMetrics}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <RechartsTooltip />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="avgResponseTime" 
                        name="Avg Response (min)" 
                        stroke="#2ecc71" 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="newTickets" 
                        name="New Tickets" 
                        stroke="#3498db" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Customer Wait Time Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of customer wait times by different metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    First Response Time
                  </h3>
                  <p className="text-3xl font-bold">
                    {formatResponseTime(metricsData.ticketMetrics.timeToResolve.avgFirstResponseTime)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Average time until first agent response
                  </p>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Response Time Distribution</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Under 15 minutes</span>
                        <span className="font-medium">{metricsData.ticketMetrics.waitingTimeDistribution.lessThan15Min}</span>
                      </div>
                      <Progress value={(metricsData.ticketMetrics.waitingTimeDistribution.lessThan15Min / getTotalTickets(metricsData.ticketMetrics.waitingTimeDistribution)) * 100} className="h-1 bg-blue-100" indicatorClassName="bg-blue-500" />
                      
                      <div className="flex justify-between items-center text-sm">
                        <span>15-30 minutes</span>
                        <span className="font-medium">{metricsData.ticketMetrics.waitingTimeDistribution.lessThan30Min}</span>
                      </div>
                      <Progress value={(metricsData.ticketMetrics.waitingTimeDistribution.lessThan30Min / getTotalTickets(metricsData.ticketMetrics.waitingTimeDistribution)) * 100} className="h-1 bg-green-100" indicatorClassName="bg-green-500" />
                      
                      <div className="flex justify-between items-center text-sm">
                        <span>30-60 minutes</span>
                        <span className="font-medium">{metricsData.ticketMetrics.waitingTimeDistribution.lessThan1Hour - metricsData.ticketMetrics.waitingTimeDistribution.lessThan30Min}</span>
                      </div>
                      <Progress value={((metricsData.ticketMetrics.waitingTimeDistribution.lessThan1Hour - metricsData.ticketMetrics.waitingTimeDistribution.lessThan30Min) / getTotalTickets(metricsData.ticketMetrics.waitingTimeDistribution)) * 100} className="h-1 bg-yellow-100" indicatorClassName="bg-yellow-500" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Resolution Time
                  </h3>
                  <p className="text-3xl font-bold">
                    {metricsData.ticketMetrics.timeToResolve.avgTimeToResolve.toFixed(1)}h
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Average time to resolve tickets
                  </p>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">By Priority</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">Urgent</Badge>
                        <div className="text-sm">~{(metricsData.ticketMetrics.timeToResolve.avgTimeToResolve * 0.6).toFixed(1)}h</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50">High</Badge>
                        <div className="text-sm">~{(metricsData.ticketMetrics.timeToResolve.avgTimeToResolve * 0.8).toFixed(1)}h</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">Medium</Badge>
                        <div className="text-sm">~{(metricsData.ticketMetrics.timeToResolve.avgTimeToResolve * 1.0).toFixed(1)}h</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">Low</Badge>
                        <div className="text-sm">~{(metricsData.ticketMetrics.timeToResolve.avgTimeToResolve * 1.5).toFixed(1)}h</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <StopCircle className="h-4 w-4 text-purple-500" />
                    Wait Time by Channel
                  </h3>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={[
                          { name: 'Email', value: metricsData.overallMetrics.avgResponseTime * 1.2 },
                          { name: 'Chat', value: metricsData.overallMetrics.avgResponseTime * 0.3 },
                          { name: 'WhatsApp', value: metricsData.overallMetrics.avgResponseTime * 0.6 },
                          { name: 'Website', value: metricsData.overallMetrics.avgResponseTime * 0.8 }
                        ]}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <RechartsTooltip formatter={(value) => [`${value.toFixed(0)} min`, 'Avg Wait']} />
                        <Bar dataKey="value" fill="#9b59b6" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground pt-2">
                    Average wait time varies by support channel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Ticket Analysis Tab */}
        <TabsContent value="ticket-analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tickets by Status</CardTitle>
                <CardDescription>
                  Current distribution of tickets by status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { name: 'Open', value: metricsData.ticketMetrics.ticketsByStatus.open, color: '#e74c3c' },
                        { name: 'Pending', value: metricsData.ticketMetrics.ticketsByStatus.pending, color: '#f39c12' },
                        { name: 'Solved', value: metricsData.ticketMetrics.ticketsByStatus.solved, color: '#2ecc71' },
                        { name: 'Closed', value: metricsData.ticketMetrics.ticketsByStatus.closed, color: '#7f8c8d' }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="value" name="Tickets">
                        {[
                          { name: 'Open', value: metricsData.ticketMetrics.ticketsByStatus.open, color: '#e74c3c' },
                          { name: 'Pending', value: metricsData.ticketMetrics.ticketsByStatus.pending, color: '#f39c12' },
                          { name: 'Solved', value: metricsData.ticketMetrics.ticketsByStatus.solved, color: '#2ecc71' },
                          { name: 'Closed', value: metricsData.ticketMetrics.ticketsByStatus.closed, color: '#7f8c8d' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tickets by Channel</CardTitle>
                <CardDescription>
                  Distribution of support tickets by channel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={channelData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="value" name="Tickets" fill="#3498db" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Ticket Volume Trends</CardTitle>
              <CardDescription>
                Daily ticket volume and resolution rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={metricsData.dailyMetrics}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="newTickets" 
                      name="New Tickets" 
                      stroke="#3498db" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="resolvedTickets" 
                      name="Resolved Tickets" 
                      stroke="#2ecc71" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Entity Metrics Tab */}
        <TabsContent value="entity-metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Business Entity</CardTitle>
              <CardDescription>
                Support metrics broken down by business entity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {metricsData.entityMetrics.map(entity => (
                  <div key={entity.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{entity.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {entity.tickets} total tickets
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatResponseTime(entity.avgResponseTime)}</p>
                          <p className="text-xs text-muted-foreground">Avg Response</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{entity.customerSatisfaction}%</p>
                          <p className="text-xs text-muted-foreground">CSAT</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Progress 
                          value={entity.customerSatisfaction} 
                          className="h-2"
                          indicatorClassName={
                            entity.customerSatisfaction >= 90 ? "bg-green-500" :
                            entity.customerSatisfaction >= 75 ? "bg-blue-500" :
                            entity.customerSatisfaction >= 60 ? "bg-yellow-500" :
                            "bg-red-500"
                          }
                        />
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <HelpCircle className="h-3.5 w-3.5" />
                              <span className="sr-only">Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="w-64">
                            <p className="font-medium">{entity.name} Performance</p>
                            <p className="text-sm mt-1">
                              Average response time: {formatResponseTime(entity.avgResponseTime)}
                            </p>
                            <p className="text-sm">
                              Customer satisfaction: {entity.customerSatisfaction}%
                            </p>
                            <p className="text-sm mt-1">
                              Based on {entity.tickets} tickets
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}
                
                {metricsData.entityMetrics.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <HelpCircle className="h-10 w-10 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No Entity Data Available</h3>
                    <p className="text-muted-foreground">
                      There is no entity performance data for the selected time period.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper components
function MetricCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col items-center text-center">
        <div className="rounded-full bg-primary/10 p-3 mb-2">{icon}</div>
        <h3 className="text-xl font-bold">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  );
}

function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  return (
    <RotateCw 
      className={cn("h-4 w-4", isRefreshing && "animate-spin")} 
      onClick={handleRefresh}
    />
  );
}

// Helper function to calculate total tickets from waiting time distribution
function getTotalTickets(distribution: TicketMetrics['waitingTimeDistribution']) {
  return (
    distribution.lessThan15Min +
    distribution.lessThan30Min +
    distribution.lessThan1Hour +
    distribution.lessThan4Hours +
    distribution.lessThan24Hours +
    distribution.moreThan24Hours
  );
}

// Custom bar chart cell for different colors
function Cell({ fill, children }: { fill: string, children?: React.ReactNode }) {
  return (
    <RechartsTooltip.Cell fill={fill}>
      {children}
    </RechartsTooltip.Cell>
  );
}