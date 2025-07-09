import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMenuAdaptivity } from '@/contexts/MenuAdaptivityContext';
import { Link } from 'wouter';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Clock, 
  Star, 
  Sparkles, 
  PanelLeft,
  LayoutGrid,
  ArrowRight,
  PanelLeftClose,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type AdaptiveMenuSuggestionsProps = {
  onSuggestionClick?: () => void;
};

export default function AdaptiveMenuSuggestions({ onSuggestionClick }: AdaptiveMenuSuggestionsProps) {
  const [location] = useLocation();
  const {
    getFrequentlyUsedItems,
    getRecentlyUsedItems,
    getPersonalizedSuggestions,
    resetUsageData
  } = useMenuAdaptivity();
  
  const frequentItems = getFrequentlyUsedItems(5);
  const recentItems = getRecentlyUsedItems(5);
  const suggestedItems = getPersonalizedSuggestions(location, 3);
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Use a state variable to determine visibility
  const [isVisible, setIsVisible] = useState(true);
  
  // Only show suggestions if there's enough data to make them meaningful
  useEffect(() => {
    // Hide if not enough usage data
    if (
      frequentItems.length < 2 &&
      recentItems.length < 2 &&
      suggestedItems.length < 2
    ) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [frequentItems.length, recentItems.length, suggestedItems.length]);
  
  // Don't render if no suggestions to show
  if (!isVisible) return null;
  
  const handleItemClick = () => {
    if (onSuggestionClick) {
      onSuggestionClick();
    }
  };
  
  return (
    <Card className={cn(
      "transition-all duration-300 fixed bottom-4 right-4 shadow-lg border-primary/20 z-10",
      isCollapsed 
        ? "w-16 h-16 rounded-full overflow-hidden cursor-pointer hover:shadow-md" 
        : "w-80 max-w-[95vw]"
    )}>
      {isCollapsed ? (
        <div 
          className="flex items-center justify-center h-full bg-primary/10"
          onClick={() => setIsCollapsed(false)}
        >
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
      ) : (
        <>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center">
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                Smart Suggestions
              </CardTitle>
              <CardDescription className="text-xs">
                Based on your activity patterns
              </CardDescription>
            </div>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={() => setIsCollapsed(true)}
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsVisible(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pb-3 pt-0">
            <Tabs defaultValue="smart">
              <TabsList className="grid grid-cols-3 mb-2 h-8">
                <TabsTrigger value="smart" className="text-xs">
                  <Sparkles className="mr-1 h-3 w-3" /> Smart
                </TabsTrigger>
                <TabsTrigger value="frequent" className="text-xs">
                  <Star className="mr-1 h-3 w-3" /> Frequent
                </TabsTrigger>
                <TabsTrigger value="recent" className="text-xs">
                  <Clock className="mr-1 h-3 w-3" /> Recent
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="smart" className="m-0">
                <div className="space-y-1">
                  {suggestedItems.length > 0 ? (
                    suggestedItems.map(item => (
                      <Link 
                        key={item.path} 
                        href={item.path}
                        onClick={handleItemClick}
                      >
                        <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer">
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2 px-1 bg-primary/5">
                              <Sparkles className="h-3 w-3 text-primary" />
                            </Badge>
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-2 text-sm text-muted-foreground">
                      Continue using the app to get smart suggestions
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="frequent" className="m-0">
                <div className="space-y-1">
                  {frequentItems.length > 0 ? (
                    frequentItems.map(item => (
                      <Link 
                        key={item.path} 
                        href={item.path}
                        onClick={handleItemClick}
                      >
                        <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer">
                          <div className="flex items-center">
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {item.clickCount} visits
                          </Badge>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-2 text-sm text-muted-foreground">
                      No frequently visited pages yet
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="recent" className="m-0">
                <div className="space-y-1">
                  {recentItems.length > 0 ? (
                    recentItems.map(item => (
                      <Link 
                        key={item.path} 
                        href={item.path}
                        onClick={handleItemClick}
                      >
                        <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer">
                          <div className="flex items-center">
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(item.lastClicked)}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-2 text-sm text-muted-foreground">
                      No recently visited pages
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-2 pt-2 border-t flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 px-2"
                onClick={resetUsageData}
              >
                Reset data
              </Button>
              <p className="text-xs text-muted-foreground">Learns as you navigate</p>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSecs < 60) {
    return `${diffSecs} sec ago`;
  } else if (diffMins < 60) {
    return `${diffMins} min ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hr ago`;
  } else if (diffDays === 1) {
    return `Yesterday`;
  } else {
    return `${diffDays} days ago`;
  }
}