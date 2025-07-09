import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { CheckCircle, Zap, Calendar, CreditCard, X, RefreshCw, Sparkles, Crown, Shield, FastForward, Users, ChevronRight, Download, ArrowRight, HelpCircle, Info, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small businesses starting their journey',
    price: 49,
    features: [
      'Up to 3 business entities',
      'Basic reporting',
      'Standard customer support',
      '5 team members',
      'Core business tools',
      'Mobile app access',
    ],
    limits: {
      entities: 3,
      users: 5,
      storage: 10,
    },
    recommended: false,
    badge: null,
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For growing businesses with expanding needs',
    price: 99,
    features: [
      'Up to 7 business entities',
      'Advanced reporting',
      'Priority customer support',
      '15 team members',
      'All business tools',
      'API access',
      'Integration with 3rd party apps',
      'Custom branding',
    ],
    limits: {
      entities: 7,
      users: 15,
      storage: 50,
    },
    recommended: true,
    badge: 'MOST POPULAR',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with complex requirements',
    price: 249,
    features: [
      'Unlimited business entities',
      'Enterprise reporting',
      'Dedicated account manager',
      'Unlimited team members',
      'All business tools + Enterprise features',
      'Advanced security features',
      'Custom integrations',
      'On-premises deployment option',
      'SLA guarantees',
    ],
    limits: {
      entities: Infinity,
      users: Infinity,
      storage: 500,
    },
    recommended: false,
    badge: 'ENTERPRISE',
  },
];

const invoices = [
  {
    id: 'INV-2025-0012',
    date: new Date(2025, 2, 15),
    amount: 99,
    status: 'paid',
    description: 'Professional Plan - Monthly Subscription',
  },
  {
    id: 'INV-2025-0011',
    date: new Date(2025, 1, 15),
    amount: 99,
    status: 'paid',
    description: 'Professional Plan - Monthly Subscription',
  },
  {
    id: 'INV-2025-0010',
    date: new Date(2025, 0, 15),
    amount: 99,
    status: 'paid',
    description: 'Professional Plan - Monthly Subscription',
  },
  {
    id: 'INV-2024-0009',
    date: new Date(2024, 11, 15),
    amount: 49,
    status: 'paid',
    description: 'Starter Plan - Monthly Subscription',
  },
  {
    id: 'INV-2024-0008',
    date: new Date(2024, 10, 15),
    amount: 49,
    status: 'paid',
    description: 'Starter Plan - Monthly Subscription',
  },
];

const usageStats = {
  entities: {
    used: 5,
    total: 7,
    percentage: (5 / 7) * 100,
  },
  users: {
    used: 11,
    total: 15,
    percentage: (11 / 15) * 100,
  },
  storage: {
    used: 32.5,
    total: 50,
    percentage: (32.5 / 50) * 100,
  },
  api: {
    used: 75621,
    total: 100000,
    percentage: (75621 / 100000) * 100,
  },
};

const addOns = [
  {
    id: 'additional-users',
    name: 'Additional Users',
    description: 'Add more users to your plan',
    price: 9,
    unit: 'per user/month',
    active: true,
    quantity: 3
  },
  {
    id: 'additional-storage',
    name: 'Additional Storage',
    description: 'Expand your storage capacity',
    price: 5,
    unit: 'per 10GB/month',
    active: false,
    quantity: 0
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Gain deeper insights with enhanced analytics features',
    price: 29,
    unit: 'per month',
    active: true,
    quantity: 1
  },
  {
    id: 'priority-support',
    name: 'Priority Support',
    description: 'Get faster response times and dedicated support',
    price: 19,
    unit: 'per month',
    active: false,
    quantity: 0
  },
];

const paymentMethods = [
  {
    id: 'pm_1',
    type: 'card',
    brand: 'visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2027,
    isDefault: true,
  },
  {
    id: 'pm_2',
    type: 'card',
    brand: 'mastercard',
    last4: '5555',
    expMonth: 8,
    expYear: 2026,
    isDefault: false,
  },
];

function SubscriptionOverview() {
  const currentPlan = plans.find(plan => plan.id === 'pro');
  const nextBillingDate = new Date(2025, 3, 15);
  const [isYearly, setIsYearly] = useState(false);
  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Current Subscription</h3>
          <p className="text-muted-foreground">Manage your plan and billing details</p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <Badge variant="outline" className="px-2 py-1 border-primary/30 bg-primary/5 text-primary">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Active</span>
            </div>
          </Badge>
          <div className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Next billing: {format(nextBillingDate, 'MMM d, yyyy')}
          </div>
        </div>
      </div>
      
      <Card className="border-primary/20 overflow-hidden shadow-md">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/10 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <Crown className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{currentPlan?.name} Plan</h3>
                {currentPlan?.recommended && (
                  <Badge className="bg-primary text-white">
                    {currentPlan.badge}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground max-w-md">{currentPlan?.description}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-3xl font-bold text-primary">
                ${isYearly ? ((currentPlan?.price || 0) * 10).toFixed(2) : currentPlan?.price?.toFixed(2)}
                <span className="text-base font-normal text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
              </div>
              {isYearly && (
                <div className="text-sm text-green-600 font-medium mt-1">
                  You save $178.20/year with annual billing
                </div>
              )}
            </div>
          </div>
        </div>
        
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="billing-cycle" className="font-medium text-base">Billing Cycle</Label>
                  <p className="text-sm text-muted-foreground">Choose between monthly or annual billing</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-1 border rounded-full bg-muted">
                <Button 
                  variant={isYearly ? "ghost" : "default"} 
                  size="sm" 
                  className={cn(
                    "rounded-full text-sm px-4 py-1 h-auto",
                    !isYearly && "shadow-sm"
                  )}
                  onClick={() => setIsYearly(false)}
                >
                  Monthly
                </Button>
                <Button 
                  variant={!isYearly ? "ghost" : "default"} 
                  size="sm" 
                  className={cn(
                    "rounded-full text-sm px-4 py-1 h-auto flex items-center gap-1.5",
                    isYearly && "shadow-sm"
                  )}
                  onClick={() => setIsYearly(true)}
                >
                  <span>Yearly</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800 py-0 h-5">
                    Save 17%
                  </Badge>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card className="border-muted bg-background overflow-hidden">
                <CardHeader className="p-4 pb-2 bg-slate-50 dark:bg-slate-900 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Business Entities</CardTitle>
                    <Badge variant={usageStats.entities.percentage > 90 ? "destructive" : "outline"} className="text-xs">
                      {usageStats.entities.percentage > 90 ? 'Near limit' : 'Good standing'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{usageStats.entities.used} / {usageStats.entities.total}</div>
                    <div className="text-sm text-muted-foreground">{Math.round(usageStats.entities.percentage)}%</div>
                  </div>
                  <div className="relative w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all",
                        usageStats.entities.percentage > 90 
                          ? "bg-red-500" 
                          : usageStats.entities.percentage > 75 
                            ? "bg-amber-500" 
                            : "bg-green-500"
                      )}
                      style={{ width: `${Math.min(100, usageStats.entities.percentage)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-muted bg-background overflow-hidden">
                <CardHeader className="p-4 pb-2 bg-slate-50 dark:bg-slate-900 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Team Members</CardTitle>
                    <Badge variant={usageStats.users.percentage > 90 ? "destructive" : "outline"} className="text-xs">
                      {usageStats.users.percentage > 90 ? 'Near limit' : usageStats.users.percentage > 75 ? 'Approaching limit' : 'Good standing'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{usageStats.users.used} / {usageStats.users.total}</div>
                    <div className="text-sm text-muted-foreground">{Math.round(usageStats.users.percentage)}%</div>
                  </div>
                  <div className="relative w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all",
                        usageStats.users.percentage > 90 
                          ? "bg-red-500" 
                          : usageStats.users.percentage > 75 
                            ? "bg-amber-500" 
                            : "bg-green-500"
                      )}
                      style={{ width: `${Math.min(100, usageStats.users.percentage)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-muted bg-background overflow-hidden">
                <CardHeader className="p-4 pb-2 bg-slate-50 dark:bg-slate-900 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Storage Usage</CardTitle>
                    <Badge variant={usageStats.storage.percentage > 90 ? "destructive" : "outline"} className="text-xs">
                      {usageStats.storage.percentage > 90 ? 'Near limit' : 'Good standing'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{usageStats.storage.used}GB / {usageStats.storage.total}GB</div>
                    <div className="text-sm text-muted-foreground">{Math.round(usageStats.storage.percentage)}%</div>
                  </div>
                  <div className="relative w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all",
                        usageStats.storage.percentage > 90 
                          ? "bg-red-500" 
                          : usageStats.storage.percentage > 75 
                            ? "bg-amber-500" 
                            : "bg-green-500"
                      )}
                      style={{ width: `${Math.min(100, usageStats.storage.percentage)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-4 p-5 rounded-lg border bg-slate-50 dark:bg-slate-900/50">
              <h4 className="font-medium text-base mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Plan Features
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentPlan?.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        
        <div className="p-6 border-t bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900/70 dark:to-slate-900/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-700 font-medium"
                onClick={() => setIsChangePlanOpen(true)}
              >
                <Zap className="h-4 w-4 mr-2 text-primary" />
                Change Plan
              </Button>
              <Dialog open={isChangePlanOpen} onOpenChange={setIsChangePlanOpen}>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Choose Your Subscription Plan</DialogTitle>
                    <DialogDescription>
                      Select the plan that best fits your business requirements
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                    {plans.map((plan) => (
                      <Card key={plan.id} className={cn(
                        "relative flex flex-col h-full overflow-hidden", 
                        plan.id === 'pro' 
                          ? "border-primary shadow-lg shadow-primary/10" 
                          : "border-muted shadow-sm hover:shadow-md transition-shadow duration-300"
                      )}>
                        {plan.badge && (
                          <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 z-10">
                            <Badge className={cn(
                              "font-medium shadow-sm",
                              plan.id === 'pro' 
                                ? "bg-primary text-white" 
                                : plan.id === 'enterprise' 
                                  ? "bg-slate-800 text-white"
                                  : "bg-blue-600 text-white"
                            )}>
                              {plan.badge}
                            </Badge>
                          </div>
                        )}
                        {plan.id === 'pro' && (
                          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                        )}
                        <CardHeader className={cn(
                          "pb-4",
                          plan.id === 'pro' && "bg-primary/5"
                        )}>
                          <CardTitle className="text-xl">
                            {plan.name}
                          </CardTitle>
                          <CardDescription className="min-h-12 mt-1">{plan.description}</CardDescription>
                          <div className="mt-2">
                            <span className="text-3xl font-bold">${plan.price}</span>
                            <span className="text-muted-foreground ml-1">/month</span>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col py-4">
                          <div className="space-y-3 text-sm flex-grow mb-4">
                            {plan.features.map((feature, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <CheckCircle className={cn(
                                  "h-4 w-4 shrink-0 mt-0.5",
                                  plan.id === 'pro' ? "text-primary" : "text-green-600"
                                )} />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0 pb-5">
                          <Button 
                            className="w-full gap-1.5"
                            variant={plan.id === 'pro' ? "secondary" : "outline"}
                            disabled={plan.id === 'pro'}
                          >
                            {plan.id === 'pro' ? (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                <span>Current Plan</span>
                              </>
                            ) : (
                              <>
                                <Zap className="h-4 w-4" />
                                <span>Switch to {plan.name}</span>
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  
                  <DialogFooter className="flex-col sm:flex-row space-y-4 sm:space-y-0 pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span className="text-muted-foreground">Changing plans will take effect at the next billing cycle.</span>
                    </div>
                    <Button variant="outline" onClick={() => setIsChangePlanOpen(false)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex flex-col xs:flex-row items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4" />
                      <span>Need help?</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Contact our support team for assistance with your subscription</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button 
                variant="destructive" 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setIsCancelDialogOpen(true)}
              >
                Cancel Subscription
              </Button>
              
              <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure you want to cancel?</DialogTitle>
                    <DialogDescription>
                      Your subscription will remain active until the end of your current billing period on {format(nextBillingDate, 'MMM d, yyyy')}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="my-4 space-y-4">
                    <div className="flex items-start gap-2 p-4 rounded-md bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">You'll lose access to:</p>
                        <ul className="mt-1 ml-5 text-sm list-disc space-y-1">
                          <li>All Professional plan features</li>
                          <li>Your current business entities data</li>
                          <li>Team member accounts</li>
                          <li>Historical analytics and reporting</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium">Reason for cancellation:</p>
                      <select className="w-full p-2 border rounded-md">
                        <option>Please select a reason</option>
                        <option>Too expensive</option>
                        <option>Missing features</option>
                        <option>Switching to another service</option>
                        <option>Temporary pause</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>Keep my subscription</Button>
                    <Button variant="destructive">Cancel Subscription</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function BillingHistory() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Billing History</h3>
          <p className="text-muted-foreground">View and download your past invoices</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export All
        </Button>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{format(invoice.date, 'MMM d, yyyy')}</TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    invoice.status === 'paid' && "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800",
                    invoice.status === 'pending' && "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                  )}>
                    {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function AddOns() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Add-Ons & Extensions</h3>
          <p className="text-muted-foreground">Enhance your subscription with additional features</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addOns.map((addon) => (
          <Card key={addon.id} className={cn("border", addon.active && "border-primary/20")}>
            <CardHeader className={cn("pb-2", addon.active && "bg-primary/5")}>
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {addon.name}
                    {addon.active && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800">
                        Active
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{addon.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${addon.price.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">{addon.unit}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {addon.active ? (
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    Quantity: <span className="font-medium">{addon.quantity}</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-8">
                    <div className="flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" />
                      <span>Manage</span>
                    </div>
                  </Button>
                </div>
              ) : (
                <Button className="w-full">Add to Subscription</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PaymentMethods() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Payment Methods</h3>
          <p className="text-muted-foreground">Manage your payment options</p>
        </div>
        <Button className="gap-2">
          <CreditCard className="h-4 w-4" />
          Add Payment Method
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <Card key={method.id} className={cn("relative", method.isDefault && "border-primary/20")}>
            {method.isDefault && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <Badge className="bg-primary text-white">Default</Badge>
              </div>
            )}
            <CardHeader className={cn("pb-2", method.isDefault && "bg-primary/5")}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-14 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {method.brand === 'visa' ? 'VISA' : 'MC'}
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} ending in {method.last4}
                    </CardTitle>
                    <CardDescription>
                      Expires {method.expMonth}/{method.expYear}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <div className="space-x-2">
                  {!method.isDefault && (
                    <Button variant="outline" size="sm" className="h-8">Set as Default</Button>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                  <div className="flex items-center gap-1">
                    <X className="h-3 w-3" />
                    <span>Remove</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <MainLayout>
      <div className="mx-auto p-4 sm:p-6 max-w-7xl">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Billing & Subscription</h2>
              <p className="text-muted-foreground mt-1">Manage your subscription, payment methods, and billing history</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link href="/settings">
                  Back to Settings
                </Link>
              </Button>
              <Button asChild>
                <a href="mailto:support@dmphq.com" className="flex items-center gap-1">
                  <HelpCircle className="h-4 w-4" />
                  <span>Billing Support</span>
                </a>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="subscription" className="space-y-6">
            <TabsList className="grid grid-cols-4 md:w-fit">
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="billing-history">Billing History</TabsTrigger>
              <TabsTrigger value="add-ons">Add-Ons</TabsTrigger>
              <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            </TabsList>
            
            <TabsContent value="subscription" className="space-y-6">
              <SubscriptionOverview />
            </TabsContent>
            
            <TabsContent value="billing-history">
              <BillingHistory />
            </TabsContent>
            
            <TabsContent value="add-ons">
              <AddOns />
            </TabsContent>
            
            <TabsContent value="payment-methods">
              <PaymentMethods />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}