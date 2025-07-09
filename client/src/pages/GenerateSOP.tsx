import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Video } from "lucide-react";
import VideoEmbed from "@/components/VideoEmbed";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  categoryId: z.string().min(1, "Please select a category"),
  subcategoryId: z.string().optional(),
  additionalInfo: z.string().optional(),
  businessEntityId: z.string().optional(),
  videoUrl: z.string().optional(),
  videoType: z.enum(["loom", "youtube", "vimeo"]).default("loom"),
  useAi: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export default function GenerateSOP() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [generatedSteps, setGeneratedSteps] = useState<Array<{ title: string, description: string }> | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Get category from query param if available
  const getPreselectedCategory = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    return categoryParam || "";
  };

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Fetch business entities
  const { data: businessEntitiesData, isLoading: isLoadingBusinessEntities } = useQuery({
    queryKey: ['/api/business-entities'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Create the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      categoryId: getPreselectedCategory(),
      subcategoryId: "",
      additionalInfo: "",
      businessEntityId: "",
      videoUrl: "",
      videoType: "loom",
      useAi: true,
    },
  });

  const selectedCategoryId = form.watch("categoryId");
  const watchVideoUrl = form.watch("videoUrl");
  const watchVideoType = form.watch("videoType");
  const watchUseAi = form.watch("useAi");
  
  // Update video preview when URL changes
  useEffect(() => {
    if (watchVideoUrl) {
      setVideoPreview(watchVideoUrl);
    } else {
      setVideoPreview(null);
    }
  }, [watchVideoUrl, watchVideoType]);
  
  const { data: subcategoriesData, isLoading: isLoadingSubcategories } = useQuery({
    queryKey: ['/api/subcategories', selectedCategoryId],
    queryFn: async () => {
      if (!selectedCategoryId) return { subcategories: [] };
      const res = await fetch(`/api/subcategories?categoryId=${selectedCategoryId}`);
      if (!res.ok) throw new Error('Failed to fetch subcategories');
      return res.json();
    },
    enabled: !!selectedCategoryId,
  });

  const categories = categoriesData?.categories || [];
  const subcategories = subcategoriesData?.subcategories || [];
  const businessEntities = businessEntitiesData?.entities || [];

  // AI Generation mutation
  const generateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return apiRequest<{ content: string, steps: Array<{ title: string, description: string }> }>('POST', '/api/sops/generate', {
        title: data.title,
        categoryId: parseInt(data.categoryId, 10),
        subcategoryId: data.subcategoryId ? parseInt(data.subcategoryId, 10) : undefined,
        businessDescription: data.additionalInfo,
      });
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      setGeneratedSteps(data.steps);
      setActiveTab("review");
      toast({
        title: "SOP Generated!",
        description: "Your Standard Operating Procedure has been successfully generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate SOP. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Save SOP mutation
  const saveMutation = useMutation({
    mutationFn: async (data: {
      isAI: boolean;
      content: string;
      steps: Array<{ title: string, description: string }>;
    }) => {
      const formData = form.getValues();
      
      return apiRequest('POST', '/api/sops', {
        title: formData.title,
        categoryId: parseInt(formData.categoryId, 10),
        subcategoryId: formData.subcategoryId ? parseInt(formData.subcategoryId, 10) : undefined,
        businessEntityId: formData.businessEntityId ? parseInt(formData.businessEntityId, 10) : undefined,
        content: data.content,
        steps: data.steps,
        isAiGenerated: data.isAI,
        videoUrl: formData.videoUrl || undefined,
        videoType: formData.videoUrl ? formData.videoType : undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: "SOP Saved!",
        description: "Your Standard Operating Procedure has been saved successfully.",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/sops'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      
      // Reset form and state
      form.reset();
      setGeneratedContent(null);
      setGeneratedSteps(null);
      setVideoPreview(null);
      setActiveTab("details");
      
      // Redirect to dashboard
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save SOP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (data.useAi) {
      setIsGenerating(true);
      try {
        await generateMutation.mutateAsync(data);
      } finally {
        setIsGenerating(false);
      }
    } else {
      // If not using AI, move to manual tab
      setActiveTab("manual");
    }
  };
  
  const handleSaveAISop = () => {
    if (generatedContent && generatedSteps) {
      saveMutation.mutate({
        isAI: true,
        content: generatedContent,
        steps: generatedSteps
      });
    }
  };
  
  const handleSaveManualSop = () => {
    const content = form.getValues("additionalInfo") || "";
    // Create a simple step structure for manual SOPs
    const steps = [
      { 
        title: "Follow the instructions", 
        description: "Follow the video demonstration and written instructions provided." 
      }
    ];
    
    saveMutation.mutate({
      isAI: false,
      content,
      steps
    });
  };

  return (
    <MainLayout
      title="Create Standard Operating Procedure"
      description="Create an SOP with optional AI assistance and video demonstration"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-3xl mx-auto">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="details">SOP Details</TabsTrigger>
          <TabsTrigger value="manual" disabled={!form.formState.isValid}>Manual SOP</TabsTrigger>
          <TabsTrigger value="review" disabled={!generatedContent}>Review Generated</TabsTrigger>
        </TabsList>
        
        {/* Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="material-icons text-primary mr-2">description</span>
                SOP Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SOP Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Customer Onboarding Process" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Give your SOP a clear, descriptive title
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                            disabled={isLoadingCategories}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  <div className="flex items-center">
                                    <span className={`material-icons mr-2 ${category.color}`}>{category.icon}</span>
                                    {category.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the business function
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subcategoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subcategory (Optional)</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                            disabled={!selectedCategoryId || isLoadingSubcategories}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subcategory" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subcategories.map((subcategory) => (
                                <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                                  {subcategory.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Narrow down the scope
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="businessEntityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Entity (Optional)</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                          disabled={isLoadingBusinessEntities}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a business entity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {businessEntities.map((entity) => (
                              <SelectItem key={entity.id} value={entity.id.toString()}>
                                {entity.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Associate this SOP with a specific business entity
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Video Demonstration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <FormField
                        control={form.control}
                        name="videoType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Video Source</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select video source" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="loom">Loom</SelectItem>
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="vimeo">Vimeo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="videoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Video URL (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={`Enter ${watchVideoType} video URL`} 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Add a video demonstration for your SOP
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    {videoPreview && (
                      <div className="mt-4 border rounded-md p-2">
                        <p className="text-sm font-medium mb-2">Video Preview:</p>
                        <VideoEmbed 
                          videoUrl={videoPreview} 
                          videoType={watchVideoType} 
                          height={300}
                        />
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <FormField
                    control={form.control}
                    name="useAi"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Use AI Generation</FormLabel>
                          <FormDescription>
                            Let our AI create detailed SOP content for you based on your description
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {watchUseAi ? "Process Description for AI" : "SOP Instructions"}
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={watchUseAi 
                              ? "Describe the business process in detail for AI to generate an SOP. Include any specific requirements, goals, or context."
                              : "Write your detailed SOP instructions here. Include all necessary steps and information." 
                            }
                            className="min-h-[150px]" 
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {watchUseAi 
                            ? "The more details you provide, the better the AI-generated SOP will be"
                            : "Provide clear instructions that anyone can follow"
                          }
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => navigate("/")}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          {watchUseAi ? (
                            <>
                              <span className="material-icons mr-2 text-sm">auto_awesome</span>
                              Generate with AI
                            </>
                          ) : (
                            <>
                              <span className="material-icons mr-2 text-sm">arrow_forward</span>
                              Continue
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <span className="material-icons text-amber-500 mr-2">lightbulb</span>
                <h3 className="font-medium text-lg">Tips for Effective SOPs</h3>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Be specific about the outcome you want to achieve</li>
                <li>Include the audience that will be following this procedure</li>
                <li>Add a video demonstration to make steps clearer</li>
                <li>Specify any tools or resources needed in the description</li>
                <li>Consider different scenarios that might occur during the process</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Manual SOP Tab */}
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="material-icons text-primary mr-2">edit_document</span>
                Manual SOP Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{form.getValues("title")}</h3>
                    <p className="text-sm text-gray-500">
                      Category: {categories.find(c => c.id.toString() === form.getValues("categoryId"))?.name || "Unknown"}
                      {form.getValues("subcategoryId") && (
                        <> • Subcategory: {subcategories.find(s => s.id.toString() === form.getValues("subcategoryId"))?.name || "Unknown"}</>
                      )}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setActiveTab("details")}>
                    Back to Details
                  </Button>
                </div>
                
                {videoPreview && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Video Demonstration</h3>
                    <div className="border rounded-md overflow-hidden">
                      <VideoEmbed 
                        videoUrl={videoPreview} 
                        videoType={watchVideoType} 
                        height={350}
                      />
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Written Instructions</h3>
                  <div className="border rounded-md p-4 bg-gray-50">
                    {form.getValues("additionalInfo") ? (
                      <div className="whitespace-pre-line">
                        {form.getValues("additionalInfo")}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No written instructions provided. Consider adding instructions or a video demonstration.</p>
                    )}
                  </div>
                </div>
                
                <Button 
                  onClick={handleSaveManualSop} 
                  className="w-full mt-6"
                  disabled={saveMutation.isPending || (!form.getValues("additionalInfo") && !videoPreview)}
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-icons mr-2 text-sm">save</span>
                      Save Manual SOP
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Review Generated Tab */}
        <TabsContent value="review">
          {generatedContent && generatedSteps && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="material-icons text-primary mr-2">auto_awesome</span>
                  AI-Generated SOP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{form.getValues("title")}</h3>
                      <p className="text-sm text-gray-500">
                        Category: {categories.find(c => c.id.toString() === form.getValues("categoryId"))?.name || "Unknown"}
                        {form.getValues("subcategoryId") && (
                          <> • Subcategory: {subcategories.find(s => s.id.toString() === form.getValues("subcategoryId"))?.name || "Unknown"}</>
                        )}
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setActiveTab("details")}>
                      Edit Details
                    </Button>
                  </div>
                  
                  {videoPreview && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Video Demonstration</h3>
                      <div className="border rounded-md overflow-hidden">
                        <VideoEmbed 
                          videoUrl={videoPreview} 
                          videoType={watchVideoType} 
                          height={350}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Overview</h3>
                    <div className="border rounded-md p-4 bg-gray-50">
                      {generatedContent}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Procedure Steps</h3>
                    <div className="space-y-3">
                      {generatedSteps.map((step, index) => (
                        <div key={index} className="border rounded-md p-4 bg-gray-50">
                          <p className="font-medium">{index + 1}. {step.title}</p>
                          <p className="text-gray-700 mt-1">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSaveAISop} 
                    className="w-full mt-6"
                    disabled={saveMutation.isPending}
                  >
                    {saveMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <span className="material-icons mr-2 text-sm">save</span>
                        Save Generated SOP
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
