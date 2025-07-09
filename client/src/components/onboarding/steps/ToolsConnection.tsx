import React, { useState } from 'react';
import { useOnboarding, Tool, ToolConnectionStatus } from '../OnboardingContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  MessageSquare, 
  Calendar, 
  Slack, 
  Mail, 
  CreditCard, 
  FileText, 
  BarChart4, 
  Search 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock tools data
const availableTools: Tool[] = [
  {
    id: 'shopify',
    name: 'Shopify',
    icon: 'shopify',
    description: 'Connect your Shopify store to track orders, products, and customers.',
    status: 'not_started',
    category: 'ecommerce',
    hasBuiltInOption: false,
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: 'slack',
    description: 'Connect Slack to get notifications and collaborate with your team.',
    status: 'not_started',
    category: 'communication',
    hasBuiltInOption: false,
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    icon: 'google',
    description: 'Sync your Google Calendar to manage meetings and events.',
    status: 'not_started',
    category: 'productivity',
    hasBuiltInOption: false,
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    icon: 'mailchimp',
    description: 'Sync your email campaigns, subscribers, and analytics.',
    status: 'not_started',
    category: 'marketing',
    hasBuiltInOption: true,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: 'stripe',
    description: 'Connect Stripe to track payments, invoices, and subscriptions.',
    status: 'not_started',
    category: 'finance',
    hasBuiltInOption: false,
  },
  {
    id: 'tiktok_shop',
    name: 'TikTok Shop',
    icon: 'tiktok',
    description: 'Connect your TikTok Shop to track orders and products.',
    status: 'not_started',
    category: 'ecommerce',
    hasBuiltInOption: false,
  },
  {
    id: 'google_analytics',
    name: 'Google Analytics',
    icon: 'google',
    description: 'Track website traffic, conversions, and user behavior.',
    status: 'not_started',
    category: 'analytics',
    hasBuiltInOption: false,
  },
  {
    id: 'docusign',
    name: 'DocuSign',
    icon: 'docusign',
    description: 'Send and manage legal document signatures.',
    status: 'not_started',
    category: 'legal',
    hasBuiltInOption: true,
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    icon: 'hubspot',
    description: 'Connect your CRM for contact management and sales pipeline.',
    status: 'not_started',
    category: 'crm',
    hasBuiltInOption: true,
  },
];

// Tool categories with icons
const toolCategories = [
  { id: 'all', name: 'All Tools', icon: <Search className="h-4 w-4" /> },
  { id: 'ecommerce', name: 'E-commerce', icon: <ShoppingCart className="h-4 w-4" /> },
  { id: 'communication', name: 'Communication', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'productivity', name: 'Productivity', icon: <Calendar className="h-4 w-4" /> },
  { id: 'marketing', name: 'Marketing', icon: <Mail className="h-4 w-4" /> },
  { id: 'finance', name: 'Finance', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'legal', name: 'Legal', icon: <FileText className="h-4 w-4" /> },
  { id: 'analytics', name: 'Analytics', icon: <BarChart4 className="h-4 w-4" /> },
  { id: 'crm', name: 'CRM', icon: <Slack className="h-4 w-4" /> },
];

export const ToolsConnection: React.FC = () => {
  const { onboardingState, updateToolConnection } = useOnboarding();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize tool statuses
  React.useEffect(() => {
    availableTools.forEach(tool => {
      if (!onboardingState.toolConnections[tool.id]) {
        updateToolConnection(tool.id, 'not_started');
      }
    });
  }, [onboardingState.toolConnections, updateToolConnection]);

  // Filter tools by category and search query
  const filteredTools = availableTools.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle tool connection
  const handleConnectTool = (toolId: string) => {
    updateToolConnection(toolId, 'connected');
  };

  // Handle tool skip
  const handleSkipTool = (toolId: string) => {
    updateToolConnection(toolId, 'skipped');
  };

  // Handle built-in option
  const handleUseBuiltIn = (toolId: string) => {
    updateToolConnection(toolId, 'connected');
  };

  // Get status badge
  const getStatusBadge = (status: ToolConnectionStatus) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>;
      case 'skipped':
        return <Badge variant="outline" className="text-muted-foreground">Skipped</Badge>;
      case 'in_progress':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">In Progress</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-muted-foreground">
          Connect the tools you already use to get the most out of DMPHQ. You can add more tools later.
        </p>
        
        <div className="w-full overflow-x-auto pb-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full justify-start">
              {toolCategories.map(category => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center gap-1"
                >
                  {category.icon}
                  <span>{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTools.map(tool => (
          <Card key={tool.id} className={cn(
            "transition-all",
            onboardingState.toolConnections[tool.id] === 'connected' && "border-green-200 bg-green-50/50",
            onboardingState.toolConnections[tool.id] === 'skipped' && "opacity-60"
          )}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {tool.icon === 'slack' && <Slack className="h-4 w-4" />}
                    {tool.icon === 'shopify' && <ShoppingCart className="h-4 w-4" />}
                    {tool.icon === 'stripe' && <CreditCard className="h-4 w-4" />}
                    {tool.icon === 'google' && <Search className="h-4 w-4" />}
                    {tool.icon === 'mailchimp' && <Mail className="h-4 w-4" />}
                    {tool.icon === 'tiktok' && <MessageSquare className="h-4 w-4" />}
                    {tool.icon === 'docusign' && <FileText className="h-4 w-4" />}
                    {tool.icon === 'hubspot' && <BarChart4 className="h-4 w-4" />}
                  </div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                </div>
                {getStatusBadge(onboardingState.toolConnections[tool.id])}
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              {onboardingState.toolConnections[tool.id] === 'not_started' && (
                <>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleConnectTool(tool.id)}
                    className="mr-2"
                  >
                    Connect
                  </Button>
                  {tool.hasBuiltInOption && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleUseBuiltIn(tool.id)}
                      className="mr-2"
                    >
                      Use Built-in
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSkipTool(tool.id)}
                  >
                    Skip
                  </Button>
                </>
              )}
              {onboardingState.toolConnections[tool.id] === 'connected' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => updateToolConnection(tool.id, 'not_started')}
                >
                  Disconnect
                </Button>
              )}
              {onboardingState.toolConnections[tool.id] === 'skipped' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => updateToolConnection(tool.id, 'not_started')}
                >
                  Connect Now
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-muted/30 p-4 rounded-lg border mt-6">
        <h4 className="font-medium">Tools make your workspace more powerful</h4>
        <p className="text-sm text-muted-foreground">
          Connecting your existing tools centralizes your data and workflows, saving you time switching between apps.
          You can always add more tools or switch to built-in options later.
        </p>
      </div>
    </div>
  );
};