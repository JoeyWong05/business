import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowUpDown, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Clock, 
  Star, 
  Tag, 
  Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export interface SmartRecommendationsPanelProps {
  standalone?: boolean;
}

// Types for recommendations
type RecDifficulty = 'easy' | 'medium' | 'complex';
type RecStatus = 'new' | 'in-progress' | 'dismissed' | 'completed';
type RecCategory = 'process' | 'tool' | 'financial' | 'marketing' | 'operations';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: RecCategory;
  difficulty: RecDifficulty;
  impactScore: number; // 1-10
  timeToImplement: string;
  status: RecStatus;
  createdAt: string;
  moduleId?: string;
  moduleName?: string;
}

// Mock data for recommendations - In a real app this would come from an API call
const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Implement email automation for customer onboarding',
    description: 'Set up a welcome email sequence for new customers to improve engagement and reduce support inquiries.',
    category: 'marketing',
    difficulty: 'easy',
    impactScore: 8,
    timeToImplement: '2-3 hours',
    status: 'new',
    createdAt: '2025-03-22T10:30:00Z',
    moduleId: 'marketing',
    moduleName: 'Marketing'
  },
  {
    id: '2',
    title: 'Consolidate project management tools',
    description: 'Reduce duplicate tools by migrating all projects to a single platform to save costs and improve collaboration.',
    category: 'tool',
    difficulty: 'medium',
    impactScore: 9,
    timeToImplement: '1-2 days',
    status: 'new',
    createdAt: '2025-03-21T14:15:00Z',
    moduleId: 'operations',
    moduleName: 'Operations'
  },
  {
    id: '3',
    title: 'Document standard operating procedures for customer service',
    description: 'Create clear SOPs for handling customer inquiries to ensure consistent service quality.',
    category: 'process',
    difficulty: 'medium',
    impactScore: 7,
    timeToImplement: '4-6 hours',
    status: 'new',
    createdAt: '2025-03-20T09:45:00Z',
    moduleId: 'customer-service',
    moduleName: 'Customer Service'
  },
  {
    id: '4',
    title: 'Review subscription service pricing tiers',
    description: 'Analyze customer usage patterns and adjust pricing tiers to maximize revenue and customer satisfaction.',
    category: 'financial',
    difficulty: 'complex',
    impactScore: 10,
    timeToImplement: '2-3 days',
    status: 'new',
    createdAt: '2025-03-19T16:20:00Z',
    moduleId: 'finance',
    moduleName: 'Finance'
  },
  {
    id: '5',
    title: 'Implement automated inventory alerts',
    description: 'Set up notifications for low inventory levels to prevent stockouts and improve supply chain efficiency.',
    category: 'operations',
    difficulty: 'easy',
    impactScore: 6,
    timeToImplement: '3-4 hours',
    status: 'new',
    createdAt: '2025-03-18T11:10:00Z',
    moduleId: 'inventory',
    moduleName: 'Inventory'
  }
];

const SmartRecommendationsPanel: React.FC<SmartRecommendationsPanelProps> = ({ 
  standalone = false 
}) => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [sortBy, setSortBy] = useState<string>('impact');
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Sort recommendations based on current sort option
  const getSortedRecommendations = () => {
    const filtered = recommendations.filter(rec => {
      if (activeTab === 'all') return true;
      if (activeTab === 'easy') return rec.difficulty === 'easy';
      if (activeTab === 'high-impact') return rec.impactScore >= 8;
      return rec.category === activeTab;
    });
    
    return [...filtered].sort((a, b) => {
      if (sortBy === 'impact') return b.impactScore - a.impactScore;
      if (sortBy === 'difficulty') {
        const difficultyOrder = { easy: 0, medium: 1, complex: 2 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      }
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  };
  
  const handleAcceptRecommendation = (id: string) => {
    setRecommendations(recommendations.map(r => 
      r.id === id ? { ...r, status: 'in-progress' as RecStatus } : r
    ));
    toast({
      title: "Recommendation accepted",
      description: "The recommendation has been added to your in-progress tasks.",
      duration: 3000,
    });
  };
  
  const handleDismissRecommendation = (id: string) => {
    setRecommendations(recommendations.map(r => 
      r.id === id ? { ...r, status: 'dismissed' as RecStatus } : r
    ));
    toast({
      title: "Recommendation dismissed",
      description: "The recommendation has been dismissed.",
      duration: 3000,
    });
  };
  
  // Color coding based on difficulty
  const getDifficultyColor = (difficulty: RecDifficulty) => {
    const priorityConfig = {
      easy: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
      complex: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
    };
    
    return priorityConfig[difficulty];
  };
  
  // Category labels
  const categoryLabels = {
    process: 'Process',
    tool: 'Tool',
    financial: 'Financial',
    marketing: 'Marketing',
    operations: 'Operations'
  };
  
  const sortedRecommendations = getSortedRecommendations();
  
  return (
    <Card className={standalone ? '' : 'border-none shadow-none'}>
      {standalone && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Recommendations
              </CardTitle>
              <CardDescription>
                Smart suggestions to optimize your business operations
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSortBy(sortBy === 'impact' ? 'difficulty' : 'impact')}>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort by: {sortBy === 'impact' ? 'Impact' : sortBy === 'difficulty' ? 'Difficulty' : 'Date'}
            </Button>
          </div>
        </CardHeader>
      )}
      
      <CardContent className="pt-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="easy">Easy Wins</TabsTrigger>
            <TabsTrigger value="high-impact">High Impact</TabsTrigger>
            <TabsTrigger value="process">Process</TabsTrigger>
            <TabsTrigger value="tool">Tools</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-4">
          {sortedRecommendations.length > 0 ? (
            sortedRecommendations.map((recommendation) => {
              const difficultyStyle = getDifficultyColor(recommendation.difficulty);
              
              return (
                <div key={recommendation.id} className="p-4 border rounded-lg">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <h3 className="font-medium text-base">{recommendation.title}</h3>
                          <Badge variant="outline">{categoryLabels[recommendation.category]}</Badge>
                          <Badge 
                            variant="outline" 
                            className={`${difficultyStyle.bg} ${difficultyStyle.text}`}
                          >
                            {recommendation.difficulty.charAt(0).toUpperCase() + recommendation.difficulty.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                      </div>
                      <div className="ml-4 flex flex-col items-end gap-2">
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">Impact</span>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < Math.ceil(recommendation.impactScore/2) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-sm flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">{recommendation.timeToImplement}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDismissRecommendation(recommendation.id)}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Dismiss
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleAcceptRecommendation(recommendation.id)}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Accept
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No recommendations found matching your criteria.</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {standalone && (
        <CardFooter className="flex justify-between">
          <Button variant="link" className="text-muted-foreground p-0" onClick={() => setSortBy('date')}>
            View all recommendations
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure AI
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SmartRecommendationsPanel;