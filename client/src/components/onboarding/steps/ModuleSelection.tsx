import React from 'react';
import { useOnboarding } from '../OnboardingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart4, 
  ShoppingCart, 
  Users, 
  FileText, 
  Mail, 
  Search, 
  Megaphone, 
  PieChart,
  CalendarDays,
  MessagesSquare,
  Building2,
  FileStack,
  Settings2,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Available modules
const modules = [
  {
    id: 'sales',
    name: 'Sales Dashboard',
    description: 'Track deals, pipeline, and revenue with intuitive dashboards and insights.',
    icon: <BarChart4 className="h-5 w-5" />,
    category: 'core',
    recommended: true,
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Management',
    description: 'Manage products, orders, and inventory across multiple sales channels.',
    icon: <ShoppingCart className="h-5 w-5" />,
    category: 'sales',
    recommended: true,
  },
  {
    id: 'crm',
    name: 'Customer Relationship Management',
    description: 'Organize contacts, track interactions, and nurture customer relationships.',
    icon: <Users className="h-5 w-5" />,
    category: 'customers',
    recommended: true,
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    description: 'Manage contracts, NDAs, legal documents, and compliance requirements.',
    icon: <FileText className="h-5 w-5" />,
    category: 'legal',
    recommended: false,
  },
  {
    id: 'email_marketing',
    name: 'Email Marketing',
    description: 'Create and manage email campaigns, templates, and subscriber lists.',
    icon: <Mail className="h-5 w-5" />,
    category: 'marketing',
    recommended: false,
  },
  {
    id: 'seo',
    name: 'SEO Management',
    description: 'Track keywords, optimize content, and monitor search engine rankings.',
    icon: <Search className="h-5 w-5" />,
    category: 'marketing',
    recommended: false,
  },
  {
    id: 'advertising',
    name: 'Advertising Management',
    description: 'Manage ad campaigns across multiple platforms and track performance.',
    icon: <Megaphone className="h-5 w-5" />,
    category: 'marketing',
    recommended: false,
  },
  {
    id: 'analytics',
    name: 'Business Analytics',
    description: 'Visualize key metrics, track growth, and identify trends.',
    icon: <PieChart className="h-5 w-5" />,
    category: 'analytics',
    recommended: true,
  },
  {
    id: 'calendar',
    name: 'Calendar & Events',
    description: 'Schedule meetings, manage events, and track appointments.',
    icon: <CalendarDays className="h-5 w-5" />,
    category: 'productivity',
    recommended: false,
  },
  {
    id: 'messaging',
    name: 'Team Messaging',
    description: 'Communicate with your team, share files, and collaborate on projects.',
    icon: <MessagesSquare className="h-5 w-5" />,
    category: 'communication',
    recommended: false,
  },
  {
    id: 'organization',
    name: 'Organization Management',
    description: 'Manage company structure, departments, and organizational chart.',
    icon: <Building2 className="h-5 w-5" />,
    category: 'people',
    recommended: true,
  },
  {
    id: 'documents',
    name: 'Document Management',
    description: 'Store, organize, and share important business documents.',
    icon: <FileStack className="h-5 w-5" />,
    category: 'tools',
    recommended: true,
  },
  {
    id: 'settings',
    name: 'System Settings',
    description: 'Configure system preferences, permissions, and integrations.',
    icon: <Settings2 className="h-5 w-5" />,
    category: 'tools',
    recommended: true,
  },
  {
    id: 'workspace',
    name: 'Custom Workspace',
    description: 'Personalize your dashboard and create custom views for your team.',
    icon: <LayoutGrid className="h-5 w-5" />,
    category: 'tools',
    recommended: false,
  },
];

// Categories display names
const categories: Record<string, string> = {
  'core': 'Core Features',
  'sales': 'Sales',
  'customers': 'Customer Management',
  'marketing': 'Marketing',
  'analytics': 'Analytics & Reports',
  'legal': 'Legal & Compliance',
  'productivity': 'Productivity',
  'communication': 'Communication',
  'people': 'People & Organization',
  'tools': 'Tools & Settings',
};

export const ModuleSelection: React.FC = () => {
  const { onboardingState, toggleModule } = useOnboarding();

  // Group modules by category
  const modulesByCategory = modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, typeof modules>);

  // Handle check all recommended
  const handleSelectRecommended = () => {
    modules.forEach(module => {
      if (module.recommended && !onboardingState.selectedModules.includes(module.id)) {
        toggleModule(module.id);
      }
    });
  };

  // Handle check all
  const handleSelectAll = () => {
    modules.forEach(module => {
      if (!onboardingState.selectedModules.includes(module.id)) {
        toggleModule(module.id);
      }
    });
  };

  // Handle clear all
  const handleClearAll = () => {
    onboardingState.selectedModules.forEach(moduleId => {
      toggleModule(moduleId);
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-muted-foreground">
          Choose which modules you want to use in your workspace. You can enable or disable modules later.
        </p>
        <div className="flex gap-2 text-sm">
          <button 
            onClick={handleSelectRecommended}
            className="text-primary hover:underline"
          >
            Select Recommended
          </button>
          <span className="text-muted-foreground">•</span>
          <button 
            onClick={handleSelectAll}
            className="text-primary hover:underline"
          >
            Select All
          </button>
          <span className="text-muted-foreground">•</span>
          <button 
            onClick={handleClearAll}
            className="text-primary hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>

      <ScrollArea className="h-[340px] pr-4">
        <div className="space-y-6">
          {Object.entries(modulesByCategory).map(([category, categoryModules]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {categories[category]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {categoryModules.map(module => (
                  <Card 
                    key={module.id} 
                    className={cn(
                      "border cursor-pointer hover:bg-muted/10 transition-colors",
                      onboardingState.selectedModules.includes(module.id) && "border-primary bg-primary/5"
                    )}
                    onClick={() => toggleModule(module.id)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2 items-center">
                          <div className={cn(
                            "p-1.5 rounded-md",
                            onboardingState.selectedModules.includes(module.id) 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          )}>
                            {module.icon}
                          </div>
                          <CardTitle className="text-base">{module.name}</CardTitle>
                        </div>
                        <Checkbox 
                          checked={onboardingState.selectedModules.includes(module.id)}
                          onCheckedChange={() => toggleModule(module.id)}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                      <CardDescription className="pt-1">{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {module.recommended && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          Recommended
                        </span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="bg-muted/30 p-4 rounded-lg border mt-6">
        <h4 className="font-medium">Customize your experience</h4>
        <p className="text-sm text-muted-foreground">
          Selecting modules helps us customize your dashboard with just the features you need. 
          Don't worry - you can always enable additional modules later from the settings menu.
        </p>
      </div>
    </div>
  );
};