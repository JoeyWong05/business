import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import SaasLayout from "@/components/SaasLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ExternalLink, PlusCircle } from "lucide-react";
import { Link } from "wouter";

interface ToolDetailsProps {
  params: {
    id: string;
  };
}

export default function ToolDetails({ params }: ToolDetailsProps) {
  const { id } = params;
  const [isAddingToStack, setIsAddingToStack] = useState(false);
  const { toast } = useToast();

  // Fetch tool details
  const { data: toolData, isLoading: isLoadingTool } = useQuery({
    queryKey: [`/api/tools/${id}`],
  });

  // Fetch categories to get the category name and color
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Fetch tech stack to check if tool is already in the stack
  const { data: techStackData, isLoading: isLoadingTechStack } = useQuery({
    queryKey: ['/api/tech-stack'],
  });

  const tool = toolData?.tool;
  const categories = categoriesData?.categories || [];
  const techStack = techStackData?.techStack || [];

  // Check if tool is in tech stack
  const isInTechStack = tool && techStack.some(item => item.toolId === tool.id);

  // Get category information
  const getCategory = () => {
    if (!tool || !categories.length) return { name: "", color: "text-gray-500", icon: "apps" };
    const category = categories.find(c => c.id === tool.categoryId);
    return {
      name: category?.name || "Uncategorized",
      color: category?.color || "text-gray-500",
      icon: category?.icon || "apps",
      slug: category?.slug || ""
    };
  };

  const category = getCategory();

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
    if (!tool) return;
    
    setIsAddingToStack(true);
    try {
      await apiRequest('POST', '/api/tech-stack', {
        toolId: tool.id,
        monthlyPrice: tool.monthlyPrice || 0,
        notes: `Added ${tool.name} to tech stack`
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/tech-stack'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      
      toast({
        title: "Tool added",
        description: `${tool.name} has been added to your tech stack.`,
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
    <SaasLayout>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
        <Link href="/">
          <a className="hover:text-primary">Dashboard</a>
        </Link>
        <span className="mx-2">/</span>
        {!isLoadingCategories && category.slug && (
          <>
            <Link href={`/category/${category.slug}`}>
              <a className="hover:text-primary">{category.name}</a>
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-gray-700 dark:text-gray-300">
          {isLoadingTool ? "Loading..." : tool?.name || "Tool Details"}
        </span>
      </div>

      {/* Tool Details Card */}
      {isLoadingTool ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-6 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-8" />
            <div className="flex gap-4 mb-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      ) : tool && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`material-icons ${category.color}`}>{category.icon}</span>
                    <CardTitle className="text-2xl">{tool.name}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getPricingTierLabel(tool.tierSlug).variant}>
                      {getPricingTierLabel(tool.tierSlug).label}
                    </Badge>
                    <Badge variant="outline">
                      {category.name}
                    </Badge>
                  </div>
                </div>
                {tool.monthlyPrice !== null && (
                  <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Monthly Cost</div>
                    <div className="text-xl font-semibold">
                      {tool.monthlyPrice > 0 ? `$${tool.monthlyPrice.toFixed(2)}` : 'Free'}
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {tool.description || "No description available."}
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                {!isInTechStack ? (
                  <Button 
                    onClick={addToTechStack}
                    disabled={isAddingToStack}
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add to Tech Stack
                  </Button>
                ) : (
                  <Button variant="secondary" disabled>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    In Tech Stack
                  </Button>
                )}

                {tool.website && (
                  <Button variant="outline" asChild>
                    <a href={tool.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </div>

              <Tabs defaultValue="features">
                <TabsList>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="pros">Pros</TabsTrigger>
                  <TabsTrigger value="cons">Cons</TabsTrigger>
                </TabsList>
                
                <TabsContent value="features" className="py-4">
                  <h3 className="text-lg font-medium mb-2">Key Features</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {tool.features.map((feature, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">{feature}</li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="pros" className="py-4">
                  <h3 className="text-lg font-medium mb-2">Advantages</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {tool.pros.map((pro, index) => (
                      <li key={index} className="text-green-700 dark:text-green-300">{pro}</li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="cons" className="py-4">
                  <h3 className="text-lg font-medium mb-2">Limitations</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {tool.cons.map((con, index) => (
                      <li key={index} className="text-red-700 dark:text-red-300">{con}</li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Side Info */}
          <div className="space-y-6">
            {/* Alternative Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Similar Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Compare with other options in the same category
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/category/${category.slug}`}>
                    View All {category.name} Tools
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Related SOPs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related SOPs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Create standardized procedures for using this tool effectively
                </p>
                <Button asChild className="w-full">
                  <Link href={`/generate-sop?category=${tool.categoryId}`}>
                    Generate SOP
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </SaasLayout>
  );
}
