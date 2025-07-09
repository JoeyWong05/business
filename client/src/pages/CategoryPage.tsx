import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import MainLayout from "@/components/MainLayout";
import ToolCard from "@/components/ToolCard";
import SOPItem from "@/components/SOPItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const [location] = useLocation();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>("all");

  // Extract subcategory from URL query param if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subcategoryParam = urlParams.get('subcategory');
    if (subcategoryParam) {
      setSelectedSubcategory(subcategoryParam);
    }
  }, [location]);

  // Fetch category
  const { data: categoryData, isLoading: isLoadingCategory } = useQuery({
    queryKey: [`/api/categories/${slug}`],
  });

  // Fetch subcategories for this category
  const { data: subcategoriesData, isLoading: isLoadingSubcategories } = useQuery({
    queryKey: [`/api/categories/${slug}/subcategories`],
  });

  // Fetch tools for this category
  const { data: toolsData, isLoading: isLoadingTools } = useQuery({
    queryKey: [`/api/categories/${slug}/tools`],
  });

  // Fetch tech stack to check if tools are already in the stack
  const { data: techStackData, isLoading: isLoadingTechStack } = useQuery({
    queryKey: ['/api/tech-stack'],
  });

  // Fetch pricing tiers
  const { data: tiersData, isLoading: isLoadingTiers } = useQuery({
    queryKey: ['/api/pricing-tiers'],
  });
  
  // Fetch SOPs for this category
  const { data: sopsData, isLoading: isLoadingSops } = useQuery({
    queryKey: ['/api/sops'],
  });

  const category = categoryData?.category;
  const subcategories = subcategoriesData?.subcategories || [];
  const tools = toolsData?.tools || [];
  const techStack = techStackData?.techStack || [];
  const pricingTiers = tiersData?.tiers || [];
  const allSops = sopsData?.sops || [];

  // Filter tools based on selected subcategory and tier
  const filteredTools = tools.filter(tool => {
    const matchesSubcategory = selectedSubcategory 
      ? subcategories.find(s => s.slug === selectedSubcategory)?.id === tool.subcategoryId 
      : true;
    
    const matchesTier = selectedTier === "all" || tool.tierSlug === selectedTier;
    
    return matchesSubcategory && matchesTier;
  });

  // Check if a tool is in the tech stack
  const isToolInTechStack = (toolId: number) => {
    return techStack.some(item => item.toolId === toolId);
  };

  const getCategoryIconAndColor = () => {
    if (!category) return { icon: "apps", color: "text-gray-500" };
    return { icon: category.icon, color: category.color };
  };

  const { icon, color } = getCategoryIconAndColor();

  // Get subcategory name if one is selected
  const getSelectedSubcategoryName = () => {
    if (!selectedSubcategory) return "";
    const subcategory = subcategories.find(s => s.slug === selectedSubcategory);
    return subcategory ? subcategory.name : "";
  };

  return (
    <MainLayout
      title={category ? category.name : "Category Tools"}
      description={selectedSubcategory 
        ? `${getSelectedSubcategoryName()} tools and solutions` 
        : category?.description || "Browse tools in this category"}
    >
      {/* Category Info */}
      {isLoadingCategory ? (
        <Card className="mb-6">
          <CardContent className="p-6 flex items-center">
            <Skeleton className="h-12 w-12 rounded-md mr-4" />
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>
          </CardContent>
        </Card>
      ) : category && (
        <Card className="mb-6">
          <CardContent className="p-6 flex items-center">
            <div className={`h-12 w-12 rounded-md ${color.replace('text', 'bg')} flex items-center justify-center text-white mr-4`}>
              <span className="material-icons">{icon}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{category.description}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtering Options */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* Subcategory Filter */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedSubcategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSubcategory(null)}
          >
            All
          </Button>
          
          {isLoadingSubcategories ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24" />
            ))
          ) : (
            subcategories.map(subcategory => (
              <Button
                key={subcategory.id}
                variant={selectedSubcategory === subcategory.slug ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubcategory(subcategory.slug)}
              >
                {subcategory.name}
              </Button>
            ))
          )}
        </div>

        {/* Pricing Tier Tabs */}
        <Tabs value={selectedTier} onValueChange={setSelectedTier}>
          <TabsList>
            <TabsTrigger value="all">All Tiers</TabsTrigger>
            {!isLoadingTiers && pricingTiers.map(tier => (
              <TabsTrigger key={tier.id} value={tier.slug}>
                {tier.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingTools || isLoadingTechStack ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-10" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredTools.length > 0 ? (
          filteredTools.map(tool => (
            <ToolCard
              key={tool.id}
              id={tool.id}
              name={tool.name}
              description={tool.description || ""}
              website={tool.website || ""}
              logo={tool.logo || ""}
              tierSlug={tool.tierSlug}
              monthlyPrice={tool.monthlyPrice}
              features={tool.features}
              inTechStack={isToolInTechStack(tool.id)}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <span className="material-icons text-4xl text-gray-400 mb-4">search_off</span>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tools found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {selectedSubcategory || selectedTier !== "all" 
                ? "Try changing your filters to see more tools." 
                : "No tools are available in this category yet."}
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedSubcategory(null);
                setSelectedTier("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* SOP Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Standard Operating Procedures
          </h2>
          <Button asChild>
            <Link href={`/generate-sop?category=${category?.id}`}>
              <span className="material-icons mr-1 text-sm">add</span>
              Generate SOP
            </Link>
          </Button>
        </div>

        {/* Filter SOPs based on current category */}
        {(() => {
          // Get category specific SOPs
          const categorySops = allSops.filter(sop => sop.categoryId === category?.id);
          
          if (isLoadingSops) {
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Array(4).fill(0).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          }
          
          if (categorySops.length > 0) {
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {categorySops.map(sop => (
                  <SOPItem
                    key={sop.id}
                    id={sop.id}
                    title={sop.title}
                    category={{
                      name: category?.name || "",
                      color: color.replace('text-', '')
                    }}
                    stepCount={sop.steps.length}
                    isAiGenerated={Boolean(sop.isAiGenerated)}
                    createdAt={new Date(sop.createdAt).toLocaleDateString()}
                    hasVideo={Boolean(sop.videoUrl)}
                    businessEntityName={sop.businessEntityName || "Enterprise-wide"}
                  />
                ))}
              </div>
            );
          }
          
          return (
            <Card>
              <CardContent className="p-6 text-center">
                <span className="material-icons text-4xl text-primary mb-4">description</span>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Create standardized processes
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-6">
                  Generate detailed Standard Operating Procedures for your {category?.name.toLowerCase()} 
                  processes with the help of AI to ensure consistency and efficiency.
                </p>
                <Button asChild>
                  <Link href={`/generate-sop?category=${category?.id}`}>
                    Generate {category?.name} SOP
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })()}
      </div>
    </MainLayout>
  );
}
