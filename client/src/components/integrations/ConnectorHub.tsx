import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react";
import { IntegrationPlatform, IntegrationPlatformProps } from "./IntegrationPlatform";
import GoHighLevelIcon from "../icons/GoHighLevelIcon";
import { 
  SiFacebook, 
  SiGoogle, 
  SiShopify, 
  SiMailchimp, 
  SiHubspot, 
  SiZapier,
  SiTwilio,
  SiSendgrid,
  SiZoho,
  SiAirtable,
  SiStripe,
  SiQuickbooks,
  SiWordpress,
} from "react-icons/si";

interface ConnectorHubProps {
  onAddIntegration?: (integration: IntegrationPlatformProps) => void;
}

export function ConnectorHub({ onAddIntegration }: ConnectorHubProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Available integration platforms
  const availablePlatforms: IntegrationPlatformProps[] = [
    {
      id: "gohighlevel",
      name: "Go High Level",
      description: "All-in-one marketing and sales platform for agencies",
      logo: <GoHighLevelIcon className="h-6 w-6" />,
      category: "crm",
      status: "disconnected",
      featuresList: [
        "CRM and contact management",
        "Email and SMS marketing",
        "Landing page builder",
        "Appointment scheduling",
        "Sales pipeline management"
      ],
      dataTypes: [
        { name: "Contacts", canRead: true, canWrite: true },
        { name: "Campaigns", canRead: true, canWrite: true },
        { name: "Appointments", canRead: true, canWrite: true },
        { name: "Funnels", canRead: true, canWrite: false },
        { name: "Workflows", canRead: true, canWrite: false }
      ]
    },
    {
      id: "hubspot",
      name: "HubSpot",
      description: "CRM platform with marketing, sales, service, and operations software",
      logo: <SiHubspot className="h-6 w-6" />,
      category: "crm",
      status: "disconnected",
      featuresList: [
        "Contact and customer management",
        "Marketing campaign automation",
        "Sales pipeline tracking",
        "Customer service tools"
      ],
      dataTypes: [
        { name: "Contacts", canRead: true, canWrite: true },
        { name: "Companies", canRead: true, canWrite: true },
        { name: "Deals", canRead: true, canWrite: true },
        { name: "Tickets", canRead: true, canWrite: true }
      ]
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Email marketing platform and marketing automation service",
      logo: <SiMailchimp className="h-6 w-6" />,
      category: "marketing",
      status: "disconnected",
      featuresList: [
        "Email campaign management",
        "Audience segmentation",
        "Marketing automation",
        "Performance analytics"
      ],
      dataTypes: [
        { name: "Subscribers", canRead: true, canWrite: true },
        { name: "Campaigns", canRead: true, canWrite: true },
        { name: "Automations", canRead: true, canWrite: false },
        { name: "Reports", canRead: true, canWrite: false }
      ]
    },
    {
      id: "shopify",
      name: "Shopify",
      description: "E-commerce platform for online stores and retail point-of-sale systems",
      logo: <SiShopify className="h-6 w-6" />,
      category: "ecommerce",
      status: "disconnected",
      featuresList: [
        "Product management",
        "Order fulfillment",
        "Customer management",
        "Store analytics"
      ],
      dataTypes: [
        { name: "Products", canRead: true, canWrite: true },
        { name: "Orders", canRead: true, canWrite: true },
        { name: "Customers", canRead: true, canWrite: true },
        { name: "Inventory", canRead: true, canWrite: true }
      ]
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Payment processing platform for internet businesses",
      logo: <SiStripe className="h-6 w-6" />,
      category: "finance",
      status: "disconnected",
      featuresList: [
        "Payment processing",
        "Subscription management",
        "Invoice generation",
        "Financial reporting"
      ],
      dataTypes: [
        { name: "Customers", canRead: true, canWrite: true },
        { name: "Payments", canRead: true, canWrite: true },
        { name: "Subscriptions", canRead: true, canWrite: true },
        { name: "Invoices", canRead: true, canWrite: true }
      ]
    },
    {
      id: "quickbooks",
      name: "QuickBooks",
      description: "Accounting software for small and medium-sized businesses",
      logo: <SiQuickbooks className="h-6 w-6" />,
      category: "finance",
      status: "disconnected",
      featuresList: [
        "Financial tracking",
        "Invoice and billing",
        "Expense management",
        "Tax preparation"
      ],
      dataTypes: [
        { name: "Customers", canRead: true, canWrite: true },
        { name: "Invoices", canRead: true, canWrite: true },
        { name: "Expenses", canRead: true, canWrite: true },
        { name: "Reports", canRead: true, canWrite: false }
      ]
    },
    {
      id: "googleanalytics",
      name: "Google Analytics",
      description: "Web analytics service that tracks and reports website traffic",
      logo: <SiGoogle className="h-6 w-6" />,
      category: "analytics",
      status: "disconnected",
      featuresList: [
        "Website traffic tracking",
        "User behavior analysis",
        "Conversion tracking",
        "Custom reporting"
      ],
      dataTypes: [
        { name: "Sessions", canRead: true, canWrite: false },
        { name: "Events", canRead: true, canWrite: true },
        { name: "Conversions", canRead: true, canWrite: false },
        { name: "Traffic sources", canRead: true, canWrite: false }
      ]
    },
    {
      id: "facebook",
      name: "Facebook",
      description: "Social media platform for ads and audience engagement",
      logo: <SiFacebook className="h-6 w-6" />,
      category: "marketing",
      status: "disconnected",
      featuresList: [
        "Ad campaign management",
        "Audience targeting",
        "Page insights",
        "Lead generation"
      ],
      dataTypes: [
        { name: "Ads", canRead: true, canWrite: true },
        { name: "Audiences", canRead: true, canWrite: true },
        { name: "Page insights", canRead: true, canWrite: false },
        { name: "Leads", canRead: true, canWrite: false }
      ]
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Automation tool that connects apps and services",
      logo: <SiZapier className="h-6 w-6" />,
      category: "automation",
      status: "disconnected",
      featuresList: [
        "App integrations",
        "Workflow automation",
        "Custom triggers and actions",
        "Multi-step zaps"
      ],
      dataTypes: [
        { name: "Zaps", canRead: true, canWrite: true },
        { name: "Triggers", canRead: true, canWrite: true },
        { name: "Actions", canRead: true, canWrite: true },
        { name: "Logs", canRead: true, canWrite: false }
      ]
    },
    {
      id: "twilio",
      name: "Twilio",
      description: "Cloud communications platform for building SMS, voice & messaging applications",
      logo: <SiTwilio className="h-6 w-6" />,
      category: "communication",
      status: "disconnected",
      featuresList: [
        "SMS messaging",
        "Voice calls",
        "WhatsApp integration",
        "Verification services"
      ],
      dataTypes: [
        { name: "Messages", canRead: true, canWrite: true },
        { name: "Calls", canRead: true, canWrite: true },
        { name: "Conversations", canRead: true, canWrite: true },
        { name: "Phone numbers", canRead: true, canWrite: true }
      ]
    },
    {
      id: "sendgrid",
      name: "SendGrid",
      description: "Email delivery service for transactional and marketing emails",
      logo: <SiSendgrid className="h-6 w-6" />,
      category: "marketing",
      status: "disconnected",
      featuresList: [
        "Transactional email delivery",
        "Marketing campaigns",
        "Email analytics",
        "Template management"
      ],
      dataTypes: [
        { name: "Contacts", canRead: true, canWrite: true },
        { name: "Campaigns", canRead: true, canWrite: true },
        { name: "Templates", canRead: true, canWrite: true },
        { name: "Statistics", canRead: true, canWrite: false }
      ]
    },
    {
      id: "wordpress",
      name: "WordPress",
      description: "Content management system for websites and blogs",
      logo: <SiWordpress className="h-6 w-6" />,
      category: "content",
      status: "disconnected",
      featuresList: [
        "Content management",
        "Blog posting",
        "User management",
        "Plugin integration"
      ],
      dataTypes: [
        { name: "Posts", canRead: true, canWrite: true },
        { name: "Pages", canRead: true, canWrite: true },
        { name: "Users", canRead: true, canWrite: true },
        { name: "Comments", canRead: true, canWrite: true }
      ]
    }
  ];

  // Filter platforms based on the active tab and search term
  const filteredPlatforms = availablePlatforms
    .filter(platform => 
      activeTab === "all" || platform.category === activeTab
    )
    .filter(platform => 
      platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      platform.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Count platforms by category
  const crmCount = availablePlatforms.filter(p => p.category === "crm").length;
  const marketingCount = availablePlatforms.filter(p => p.category === "marketing").length;
  const ecommerceCount = availablePlatforms.filter(p => p.category === "ecommerce").length;
  const financeCount = availablePlatforms.filter(p => p.category === "finance").length;
  const analyticsCount = availablePlatforms.filter(p => p.category === "analytics").length;
  const automationCount = availablePlatforms.filter(p => p.category === "automation").length;
  const communicationCount = availablePlatforms.filter(p => p.category === "communication").length;
  const contentCount = availablePlatforms.filter(p => p.category === "content").length;

  const handleAddIntegration = (platform: IntegrationPlatformProps) => {
    if (onAddIntegration) {
      onAddIntegration(platform);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Marketplace</CardTitle>
        <CardDescription>
          Connect your business with popular platforms and services
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search integrations..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="sm:w-auto w-full">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        
        {/* Category Tabs */}
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4 flex overflow-x-auto pb-px">
            <TabsTrigger value="all">All ({availablePlatforms.length})</TabsTrigger>
            <TabsTrigger value="crm">CRM ({crmCount})</TabsTrigger>
            <TabsTrigger value="marketing">Marketing ({marketingCount})</TabsTrigger>
            <TabsTrigger value="ecommerce">E-Commerce ({ecommerceCount})</TabsTrigger>
            <TabsTrigger value="finance">Finance ({financeCount})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics ({analyticsCount})</TabsTrigger>
            <TabsTrigger value="automation">Automation ({automationCount})</TabsTrigger>
            <TabsTrigger value="communication">Communication ({communicationCount})</TabsTrigger>
          </TabsList>
          
          {/* Integration Grid - Same for all tabs */}
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlatforms.map((platform) => (
                <div key={platform.id} className="relative group">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-xl transition-colors duration-200 pointer-events-none"></div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <Button size="sm" onClick={() => handleAddIntegration(platform)}>
                      <Plus className="h-4 w-4 mr-1" /> Connect
                    </Button>
                  </div>
                  <IntegrationPlatform
                    {...platform}
                    connectAction={() => handleAddIntegration(platform)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Duplicate content for other tabs to avoid re-filtering */}
          {["crm", "marketing", "ecommerce", "finance", "analytics", "automation", "communication", "content"].map(tab => (
            <TabsContent key={tab} value={tab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlatforms.map((platform) => (
                  <div key={platform.id} className="relative group">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-xl transition-colors duration-200 pointer-events-none"></div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      <Button size="sm" onClick={() => handleAddIntegration(platform)}>
                        <Plus className="h-4 w-4 mr-1" /> Connect
                      </Button>
                    </div>
                    <IntegrationPlatform
                      {...platform}
                      connectAction={() => handleAddIntegration(platform)}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}