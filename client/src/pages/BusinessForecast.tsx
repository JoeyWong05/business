import React, { useState } from 'react';
import { Link } from 'wouter';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExportButton } from '@/components/ExportButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart2, LineChart, PieChart, TrendingUp, Calendar, Download, Upload, BarChart, FileText, Users, Target, Briefcase } from 'lucide-react';
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';

// Mock forecast data
const financialForecastData = [
  { month: 'Jan', projected: 42000, actual: 38000 },
  { month: 'Feb', projected: 45000, actual: 44000 },
  { month: 'Mar', projected: 48000, actual: 49500 },
  { month: 'Apr', projected: 51000, actual: 47000 },
  { month: 'May', projected: 54000, actual: 56000 },
  { month: 'Jun', projected: 57000, actual: 59000 },
  { month: 'Jul', projected: 60000, actual: 58000 },
  { month: 'Aug', projected: 63000, actual: null },
  { month: 'Sep', projected: 66000, actual: null },
  { month: 'Oct', projected: 69000, actual: null },
  { month: 'Nov', projected: 72000, actual: null },
  { month: 'Dec', projected: 75000, actual: null }
];

const clientGrowthData = [
  { month: 'Jan', projected: 120, actual: 115 },
  { month: 'Feb', projected: 125, actual: 122 },
  { month: 'Mar', projected: 130, actual: 128 },
  { month: 'Apr', projected: 135, actual: 138 },
  { month: 'May', projected: 140, actual: 145 },
  { month: 'Jun', projected: 145, actual: 151 },
  { month: 'Jul', projected: 150, actual: 155 },
  { month: 'Aug', projected: 155, actual: null },
  { month: 'Sep', projected: 160, actual: null },
  { month: 'Oct', projected: 165, actual: null },
  { month: 'Nov', projected: 170, actual: null },
  { month: 'Dec', projected: 175, actual: null }
];

const teamGrowthData = [
  { month: 'Jan', projected: 14, actual: 14 },
  { month: 'Feb', projected: 14, actual: 14 },
  { month: 'Mar', projected: 15, actual: 15 },
  { month: 'Apr', projected: 15, actual: 16 },
  { month: 'May', projected: 16, actual: 16 },
  { month: 'Jun', projected: 17, actual: 16 },
  { month: 'Jul', projected: 18, actual: 17 },
  { month: 'Aug', projected: 19, actual: null },
  { month: 'Sep', projected: 20, actual: null },
  { month: 'Oct', projected: 20, actual: null },
  { month: 'Nov', projected: 21, actual: null },
  { month: 'Dec', projected: 22, actual: null }
];

export default function BusinessForecast() {
  const [selectedEntity, setSelectedEntity] = useState('all-entities');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [activeTab, setActiveTab] = useState('financial');
  
  return (
    <MainLayout title="Business Forecast">
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Button variant="ghost" size="sm" className="p-0 h-8" asChild>
                <Link href="/financial-overview">
                  <span className="text-muted-foreground hover:text-primary">Financial Overview</span>
                </Link>
              </Button>
              <span className="text-muted-foreground">/</span>
              <span>Business Forecast</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Business Forecast</h1>
            <p className="text-muted-foreground">
              Monitor and analyze business forecasts across all entities
            </p>
          </div>
          
          <div className="flex gap-3">
            <Select 
              value={selectedEntity} 
              onValueChange={setSelectedEntity}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-entities">All Business Entities</SelectItem>
                <SelectItem value="digital-merch-pros">Digital Merch Pros</SelectItem>
                <SelectItem value="mystery-hype">Mystery Hype</SelectItem>
                <SelectItem value="lone-star">Lone Star Custom Clothing</SelectItem>
                <SelectItem value="alcoeaze">Alcoeaze</SelectItem>
                <SelectItem value="hide-cafe">Hide Cafe Bars</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedYear} 
              onValueChange={setSelectedYear}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
            
            <ExportButton 
              data={{
                financialForecastData,
                clientGrowthData,
                teamGrowthData,
                entity: selectedEntity,
                year: selectedYear,
                activeTab: activeTab
              }}
              filename={`business-forecast-${selectedEntity}-${selectedYear}`}
              title="Forecast Export Options"
            />
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full mb-4">
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Financial Forecast</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Client Growth</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Team Growth</span>
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Scenario Planning</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Revenue Forecast</CardTitle>
                  <CardDescription>Projected vs actual revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$751,000</div>
                  <div className="text-sm text-muted-foreground">Annual projection</div>
                  <div className="text-sm font-medium flex items-center gap-1 mt-1 text-green-600">
                    <TrendingUp className="h-4 w-4" /> 
                    <span>+8.4% from previous year</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Current Pace</CardTitle>
                  <CardDescription>Based on YTD performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$765,000</div>
                  <div className="text-sm text-muted-foreground">Year-end projection</div>
                  <div className="text-sm font-medium flex items-center gap-1 mt-1 text-green-600">
                    <TrendingUp className="h-4 w-4" /> 
                    <span>+1.9% over target</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Profit Margin</CardTitle>
                  <CardDescription>Forecast year-end</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24.5%</div>
                  <div className="text-sm text-muted-foreground">Net profit margin</div>
                  <div className="text-sm font-medium flex items-center gap-1 mt-1 text-green-600">
                    <TrendingUp className="h-4 w-4" /> 
                    <span>+2.1% from previous year</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
                <CardDescription>Monthly projected vs. actual revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={financialForecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => value ? `$${value.toLocaleString()}` : 'N/A'} 
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="projected"
                        name="Projected Revenue"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        name="Actual Revenue"
                        stroke="#4ade80"
                        fill="#4ade80"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Business Entity</CardTitle>
                  <CardDescription>Projected distribution for 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <div>Digital Merch Pros</div>
                      </div>
                      <div className="font-medium">$310,000 (41.3%)</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div>Mystery Hype</div>
                      </div>
                      <div className="font-medium">$180,000 (24%)</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <div>Lone Star Custom Clothing</div>
                      </div>
                      <div className="font-medium">$125,000 (16.6%)</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <div>Alcoeaze</div>
                      </div>
                      <div className="font-medium">$80,000 (10.7%)</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                        <div>Hide Cafe Bars</div>
                      </div>
                      <div className="font-medium">$56,000 (7.4%)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Key Growth Drivers</CardTitle>
                  <CardDescription>Forecasted contributors to revenue growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-blue-500" />
                          <div className="font-medium">New Client Acquisition</div>
                        </div>
                        <div className="font-medium">+$120,000</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-500" />
                          <div className="font-medium">Existing Client Expansion</div>
                        </div>
                        <div className="font-medium">+$85,000</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <BarChart className="h-4 w-4 text-purple-500" />
                          <div className="font-medium">New Product Lines</div>
                        </div>
                        <div className="font-medium">+$45,000</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '17%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-amber-500" />
                          <div className="font-medium">Market Expansion</div>
                        </div>
                        <div className="font-medium">+$15,000</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '6%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Clients</CardTitle>
                  <CardDescription>End of year projection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">175</div>
                  <div className="text-sm text-muted-foreground">Projected client base</div>
                  <div className="text-sm font-medium flex items-center gap-1 mt-1 text-green-600">
                    <TrendingUp className="h-4 w-4" /> 
                    <span>+45.8% from previous year</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Client Retention</CardTitle>
                  <CardDescription>Projected annual rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92.5%</div>
                  <div className="text-sm text-muted-foreground">Annual retention rate</div>
                  <div className="text-sm font-medium flex items-center gap-1 mt-1 text-green-600">
                    <TrendingUp className="h-4 w-4" /> 
                    <span>+3.2% from previous year</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average LTV</CardTitle>
                  <CardDescription>Client lifetime value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$24,500</div>
                  <div className="text-sm text-muted-foreground">Per client average</div>
                  <div className="text-sm font-medium flex items-center gap-1 mt-1 text-green-600">
                    <TrendingUp className="h-4 w-4" /> 
                    <span>+12.4% from previous year</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Client Growth Forecast</CardTitle>
                <CardDescription>Monthly projected vs. actual client count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={clientGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="projected"
                        name="Projected Clients"
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        name="Actual Clients"
                        stroke="#4ade80"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Team Size</CardTitle>
                  <CardDescription>End of year projection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">22</div>
                  <div className="text-sm text-muted-foreground">Team members</div>
                  <div className="text-sm font-medium flex items-center gap-1 mt-1 text-green-600">
                    <TrendingUp className="h-4 w-4" /> 
                    <span>+29.4% from previous year</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Revenue Per Employee</CardTitle>
                  <CardDescription>Projected annual metric</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$34,150</div>
                  <div className="text-sm text-muted-foreground">Annual average</div>
                  <div className="text-sm font-medium flex items-center gap-1 mt-1 text-green-600">
                    <TrendingUp className="h-4 w-4" /> 
                    <span>+5.8% from previous year</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Hiring Needs</CardTitle>
                  <CardDescription>Projected for next 12 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm text-muted-foreground">New positions</div>
                  <div className="text-sm font-medium flex items-center gap-1 mt-1">
                    <Briefcase className="h-4 w-4" /> 
                    <span>Based on capacity equation</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Team Growth Forecast</CardTitle>
                <CardDescription>Monthly projected vs. actual team size</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={teamGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[10, 25]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="stepAfter"
                        dataKey="projected"
                        name="Projected Team Size"
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                      <Line
                        type="stepAfter"
                        dataKey="actual"
                        name="Actual Team Size"
                        stroke="#4ade80"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Department Breakdown</CardTitle>
                <CardDescription>Projected team distribution by end of year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <div>Client Services</div>
                    </div>
                    <div className="font-medium">7 (31.8%)</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div>Creative & Design</div>
                    </div>
                    <div className="font-medium">5 (22.7%)</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div>Sales & Marketing</div>
                    </div>
                    <div className="font-medium">4 (18.2%)</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <div>Operations</div>
                    </div>
                    <div className="font-medium">3 (13.6%)</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div>Management</div>
                    </div>
                    <div className="font-medium">2 (9.1%)</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                      <div>Finance & Admin</div>
                    </div>
                    <div className="font-medium">1 (4.5%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scenarios" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Base Case</CardTitle>
                  <CardDescription>Expected business conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$751,000</div>
                  <div className="text-sm text-muted-foreground">Annual revenue</div>
                  <div className="text-sm font-medium flex items-center gap-1 mt-1 text-green-600">
                    <TrendingUp className="h-4 w-4" /> 
                    <span>+8.4% from previous year</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Upside Case</CardTitle>
                  <CardDescription>Favorable business conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$865,000</div>
                  <div className="text-sm text-muted-foreground">Annual revenue</div>
                  <div className="text-sm font-medium flex items-center gap-1 mt-1 text-green-600">
                    <TrendingUp className="h-4 w-4" /> 
                    <span>+15.2% over base case</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Downside Case</CardTitle>
                  <CardDescription>Adverse business conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$650,000</div>
                  <div className="text-sm text-muted-foreground">Annual revenue</div>
                  <div className="text-sm font-medium flex items-center gap-1 mt-1 text-rose-600">
                    <TrendingUp className="h-4 w-4" /> 
                    <span>-13.4% below base case</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Scenario Comparison</CardTitle>
                    <CardDescription>Revenue projections under different assumptions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Create New Scenario</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg">
                    <div className="grid grid-cols-4 border-b p-3 bg-muted/50">
                      <div className="font-medium">Scenario</div>
                      <div className="font-medium">Revenue</div>
                      <div className="font-medium">Profit Margin</div>
                      <div className="font-medium">Client Count</div>
                    </div>
                    
                    <div className="grid grid-cols-4 border-b p-3">
                      <div className="font-medium">Base Case</div>
                      <div>$751,000</div>
                      <div>24.5%</div>
                      <div>175</div>
                    </div>
                    
                    <div className="grid grid-cols-4 border-b p-3">
                      <div className="font-medium">Upside Case</div>
                      <div>$865,000</div>
                      <div>27.0%</div>
                      <div>195</div>
                    </div>
                    
                    <div className="grid grid-cols-4 p-3">
                      <div className="font-medium">Downside Case</div>
                      <div>$650,000</div>
                      <div>19.8%</div>
                      <div>155</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Key Assumptions</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Base Case</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div>• 5-7% market growth</div>
                          <div>• 35 new client acquisitions</div>
                          <div>• 90% client retention</div>
                          <div>• Inflation at 2.5%</div>
                          <div>• 5 new team members</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Upside Case</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div>• 8-10% market growth</div>
                          <div>• 45 new client acquisitions</div>
                          <div>• 95% client retention</div>
                          <div>• Inflation at 2.0%</div>
                          <div>• 7 new team members</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Downside Case</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div>• 1-3% market growth</div>
                          <div>• 20 new client acquisitions</div>
                          <div>• 85% client retention</div>
                          <div>• Inflation at 3.5%</div>
                          <div>• 2 new team members</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}