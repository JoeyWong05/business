import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, CheckCircle, PlusCircle } from "lucide-react";

interface ToolCardProps {
  id: number;
  name: string;
  description: string;
  website: string;
  logo: string;
  tierSlug: string;
  monthlyPrice: number | null;
  features: string[];
  inTechStack?: boolean;
}

export default function ToolCard({ id, name, description, website, logo, tierSlug, monthlyPrice, features, inTechStack = false }: ToolCardProps) {
  const [isAddingToStack, setIsAddingToStack] = useState(false);
  const { toast } = useToast();

  const getPricingTierLabel = (tierSlug: string) => {
    switch (tierSlug) {
      case "free":
        return { label: "Free", variant: "outline" as const };
      case "low-cost":
        return { label: "Low-Cost", variant: "secondary" as const };
      case "enterprise":
        return { label: "Enterprise", variant: "default" as const };
      default:
        return { label: tierSlug, variant: "outline" as const };
    }
  };

  const addToTechStack = async () => {
    setIsAddingToStack(true);
    try {
      await apiRequest('POST', '/api/tech-stack', {
        toolId: id,
        monthlyPrice: monthlyPrice || 0,
        notes: `Added ${name} to tech stack`
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/tech-stack'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      
      toast({
        title: "Tool added",
        description: `${name} has been added to your tech stack.`,
      });
    } catch (error) {
      toast({
        title: "Error adding tool",
        description: "There was a problem adding this tool to your tech stack.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToStack(false);
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <Badge variant={getPricingTierLabel(tierSlug).variant} className="mt-1">
              {getPricingTierLabel(tierSlug).label}
            </Badge>
          </div>
          {monthlyPrice !== null && monthlyPrice > 0 && (
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                ${monthlyPrice.toFixed(2)}/mo
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{description}</p>
        
        {features.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Key Features:</p>
            <ul className="text-xs text-gray-500 dark:text-gray-400 list-disc list-inside pl-1">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="truncate">{feature}</li>
              ))}
              {features.length > 3 && (
                <li className="text-primary">+{features.length - 3} more</li>
              )}
            </ul>
          </div>
        )}
        
        <div className="mt-auto flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/tool/${id}`}>Details</Link>
          </Button>
          
          {website && (
            <Button variant="outline" size="sm" asChild>
              <a href={website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
          
          {!inTechStack ? (
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1"
              onClick={addToTechStack}
              disabled={isAddingToStack}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add
            </Button>
          ) : (
            <Button variant="secondary" size="sm" className="flex-1" disabled>
              <CheckCircle className="h-4 w-4 mr-1" />
              In Stack
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
