import React, { useState } from 'react';
import {
  Sparkles,
  Filter,
  RefreshCw,
  Settings,
  ChevronDown,
  ArrowUpDown,
  CheckSquare,
  X
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { usePersonalization } from '@/contexts/PersonalizationContext';

// Importing components we'll need to make
import SmartRecommendationsPanel from '@/components/SmartRecommendationsPanel';

// Define recommendation types
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

const Recommendations = () => {
  const { personalizationSettings } = usePersonalization();
  const [filter, setFilter] = useState<string>('all');
  const [sort, setSort] = useState<string>('impact');
  
  return (
    <div className="container px-4 mx-auto max-w-7xl">
      <PageHeader 
        title="Smart Recommendations" 
        subtitle="AI-powered suggestions to optimize your business operations"
        icon={<Sparkles className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="default" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Button>
          </div>
        }
      />
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> 
                Filter 
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter('all')}>All recommendations</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('new')}>New</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('easy')}>Easy wins</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('high-impact')}>High impact</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('process')}>Process-related</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('tool')}>Tool-related</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-2 h-4 w-4" /> 
                Sort 
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSort('impact')}>Impact (High to Low)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort('difficulty')}>Difficulty (Easy first)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort('time')}>Time to implement (Quick first)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort('recent')}>Date (Newest first)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Showing {filter === 'all' ? 'all' : filter} recommendations sorted by {sort}
        </div>
      </div>
      
      {/* SmartRecommendationsPanel will handle loading recommendations and displaying them */}
      <SmartRecommendationsPanel standalone={true} />
      
      <div className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recently Implemented</CardTitle>
            <CardDescription>
              Recommendations you've successfully implemented
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <h4 className="font-medium">Automate customer onboarding emails</h4>
                    <Badge variant="outline" className="ml-2">Marketing</Badge>
                    <Badge variant="secondary" className="ml-2">Completed</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Set up email automation for customer welcome sequences to improve engagement
                  </p>
                  <div className="text-sm flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-green-50">Easy</Badge>
                    <span className="text-muted-foreground">Impact score: 7/10</span>
                    <span className="text-muted-foreground">Time saved: ~3 hours/week</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <CheckSquare className="h-5 w-5 text-green-500" />
                </div>
              </div>
              
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <h4 className="font-medium">Consolidate analytics tools</h4>
                    <Badge variant="outline" className="ml-2">Tools</Badge>
                    <Badge variant="secondary" className="ml-2">Completed</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Replace multiple analytics tools with a single integrated platform
                  </p>
                  <div className="text-sm flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-amber-50">Medium</Badge>
                    <span className="text-muted-foreground">Impact score: 9/10</span>
                    <span className="text-muted-foreground">Cost savings: $230/month</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <CheckSquare className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="p-0">
              View all implemented recommendations
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dismissed Recommendations</CardTitle>
            <CardDescription>
              Recommendations you've chosen not to implement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <h4 className="font-medium">Switch to quarterly financial reviews</h4>
                    <Badge variant="outline" className="ml-2">Financial</Badge>
                    <Badge variant="destructive" className="ml-2">Dismissed</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Move from monthly to quarterly financial review meetings
                  </p>
                  <div className="text-sm flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-green-50">Easy</Badge>
                    <span className="text-muted-foreground">Impact score: 4/10</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <X className="h-5 w-5 text-destructive" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="p-0">
              View all dismissed recommendations
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Recommendations;