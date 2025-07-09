import { useState, useEffect } from "react";
import { Calendar, ChevronDown, Download, FileText, Mail, RotateCw, LineChart, TrendingUp, 
  Clock, Users, ClipboardCheck, ListChecks, Check, LightbulbIcon, Send, MessageSquare,
  Award, BarChart2, Activity, Briefcase, PieChart, Zap
} from "lucide-react";
import { PageTitle } from "../components/PageTitle";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, subDays, startOfWeek, endOfWeek } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface DigestSection {
  id: string;
  title: string;
  description: string;
  isChecked: boolean;
}

interface DigestPreference {
  id: string;
  label: string;
  isEnabled: boolean;
}

const WeeklyDigestPage = () => {
  const { toast } = useToast();
  const { demoMode } = useDemoMode();
  const [activeTab, setActiveTab] = useState("generate");
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [digestGenerated, setDigestGenerated] = useState(false);
  const [weekRange, setWeekRange] = useState<[Date, Date]>([
    startOfWeek(new Date(), { weekStartsOn: 1 }), 
    endOfWeek(new Date(), { weekStartsOn: 1 })
  ]);

  const [digestSections, setDigestSections] = useState<DigestSection[]>([
    { id: "finance", title: "Financial Overview", description: "P&L, cash flow, revenue trends", isChecked: true },
    { id: "sales", title: "Sales Update", description: "Sales metrics, pipeline, deal activity", isChecked: true },
    { id: "marketing", title: "Marketing Performance", description: "Campaign metrics, social engagement, website analytics", isChecked: true },
    { id: "operations", title: "Operations Summary", description: "Project status, key processes, deliverables", isChecked: true },
    { id: "customer", title: "Customer Insights", description: "Feedback trends, support metrics, NPS scores", isChecked: true },
    { id: "team", title: "Team Updates", description: "Staff performance, hiring status, productivity", isChecked: false },
    { id: "strategic", title: "Strategic Initiatives", description: "Progress on key initiatives, milestones", isChecked: true },
    { id: "competitive", title: "Competitive Analysis", description: "Market position, competitor activities", isChecked: false },
    { id: "forecast", title: "Next Week Forecast", description: "Expected outcomes, upcoming events", isChecked: true },
  ]);

  const [deliveryPreferences, setDeliveryPreferences] = useState<DigestPreference[]>([
    { id: "email", label: "Email Delivery", isEnabled: true },
    { id: "slack", label: "Slack Notification", isEnabled: false },
    { id: "pdf", label: "Generate PDF", isEnabled: true },
    { id: "calendar", label: "Add Calendar Event", isEnabled: false },
  ]);

  // Fetch business entities
  const { data } = useQuery({
    queryKey: ["/api/business-entities"],
    queryFn: () => fetch("/api/business-entities").then(res => res.json()),
    enabled: demoMode, // Only fetch in demo mode
  });

  // Demo data for preview when in demo mode
  const demoEntities = [
    { id: 1, name: "Digital Merch Pros", slug: "dmp" },
    { id: 2, name: "Mystery Hype", slug: "mystery-hype" },
    { id: 3, name: "Lone Star Custom Clothing", slug: "lone-star" },
    { id: 4, name: "Alcoeaze", slug: "alcoeaze" },
    { id: 5, name: "Hide Cafe Bars", slug: "hide-cafe" }
  ];

  // Define interface for the entity type
  interface BusinessEntity {
    id: string;
    name: string;
    slug: string;
  }
  
  // Make sure businessEntities is always an array
  const entities = (data && typeof data === 'object' && data !== null && 
    'entities' in data && Array.isArray(data.entities)) ? 
    data.entities as BusinessEntity[] : [];
  const businessEntities = demoMode ? demoEntities : entities;

  // Toggle a digest section
  const toggleDigestSection = (id: string) => {
    setDigestSections(sections => 
      sections.map(section => 
        section.id === id 
          ? { ...section, isChecked: !section.isChecked } 
          : section
      )
    );
  };

  // Toggle a delivery preference
  const toggleDeliveryPreference = (id: string) => {
    setDeliveryPreferences(prefs => 
      prefs.map(pref => 
        pref.id === id 
          ? { ...pref, isEnabled: !pref.isEnabled } 
          : pref
      )
    );
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setWeekRange(([start, end]) => [subDays(start, 7), subDays(end, 7)]);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setWeekRange(([start, end]) => [addDays(start, 7), addDays(end, 7)]);
  };

  // Format the week range for display
  const formattedWeekRange = `${format(weekRange[0], 'MMM d')} - ${format(weekRange[1], 'MMM d, yyyy')}`;

  // Generate a new digest
  const generateDigest = () => {
    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsGenerating(false);
      setDigestGenerated(true);
      setActiveTab("preview");
      
      toast({
        title: "Weekly Digest Generated",
        description: `Your digest for ${formattedWeekRange} has been created successfully.`,
      });
    }, 2500);
  };

  // Send the digest via selected delivery methods
  const deliverDigest = () => {
    const enabledMethods = deliveryPreferences.filter(pref => pref.isEnabled).map(pref => pref.label);
    
    toast({
      title: "Digest Delivery Initiated",
      description: `Digest will be delivered via: ${enabledMethods.join(', ')}`,
    });
  };

  return (
    <div className="container py-6 space-y-6 max-w-7xl">
      <div className="bg-gradient-to-r from-blue-600 via-primary to-purple-600 rounded-xl p-8 mb-6 shadow-lg">
        <div className="relative z-10">
          <PageTitle 
            title="Weekly Founder Digest Generator" 
            description="Create comprehensive weekly business summaries for founders and executives"
            icon={<FileText className="h-6 w-6 md:h-8 md:w-8 text-white" />}
          />
          <div className="absolute -bottom-6 -right-8 h-24 w-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-40 blur-2xl"></div>
          <div className="absolute -top-4 -left-6 h-20 w-20 bg-gradient-to-tr from-blue-400 to-cyan-300 rounded-full opacity-30 blur-xl"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6 bg-gradient-to-r from-blue-100/80 via-primary/10 to-purple-100/80 p-1 rounded-lg">
              <TabsTrigger 
                value="generate" 
                className={cn(
                  "font-medium transition-all",
                  "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600",
                  "data-[state=active]:text-white data-[state=active]:shadow-md"
                )}
              >
                <PieChart className="h-4 w-4 mr-2" />
                Generate
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                disabled={!digestGenerated} 
                className={cn(
                  "font-medium transition-all",
                  "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600",
                  "data-[state=active]:text-white data-[state=active]:shadow-md"
                )}
              >
                <FileText className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className={cn(
                  "font-medium transition-all",
                  "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600",
                  "data-[state=active]:text-white data-[state=active]:shadow-md"
                )}
              >
                <Clock className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-4">
              <Card className="border-none shadow-xl">
                <CardHeader className="bg-white border-b rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Digest Parameters
                  </CardTitle>
                  <CardDescription>Configure your weekly digest content and delivery options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entity-select">Business Entity</Label>
                      <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                        <SelectTrigger id="entity-select">
                          <SelectValue placeholder="Select business entity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Entities (Enterprise View)</SelectItem>
                          {businessEntities.map((entity) => (
                            <SelectItem key={entity.id} value={entity.slug}>
                              {entity.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Time Period</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={goToPreviousWeek}
                          className="h-10"
                        >
                          <ChevronDown className="h-4 w-4 rotate-90" />
                        </Button>
                        <div className="flex-1 flex items-center justify-center border rounded-md h-10 px-4">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{formattedWeekRange}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={goToNextWeek}
                          className="h-10"
                        >
                          <ChevronDown className="h-4 w-4 -rotate-90" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold">Digest Sections</Label>
                      <Button variant="link" className="h-auto p-0" onClick={() => {
                        setDigestSections(sections => sections.map(section => ({ ...section, isChecked: true })));
                      }}>
                        Select All
                      </Button>
                    </div>
                    
                    <ScrollArea className="h-[220px] pr-4">
                      <div className="space-y-4">
                        {digestSections.map((section) => (
                          <div key={section.id} className="flex items-start space-x-3">
                            <Checkbox
                              id={`section-${section.id}`}
                              checked={section.isChecked}
                              onCheckedChange={() => toggleDigestSection(section.id)}
                              className="mt-1"
                            />
                            <div className="space-y-1">
                              <Label
                                htmlFor={`section-${section.id}`}
                                className="font-medium"
                              >
                                {section.title}
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                {section.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={generateDigest}
                    disabled={isGenerating || digestSections.filter(s => s.isChecked).length === 0}
                  >
                    {isGenerating ? (
                      <>
                        <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Weekly Digest"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              {digestGenerated ? (
                <>
                  <Card className="border-none shadow-xl overflow-hidden">
                    <div className="bg-white border-b">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-lg font-bold text-blue-800">
                              <FileText className="h-5 w-5 text-blue-600" />
                              Weekly Digest: {formattedWeekRange}
                            </CardTitle>
                            <CardDescription className="mt-1 text-gray-700">
                              {selectedEntity === "all" 
                                ? "Enterprise-wide business summary"
                                : `Business summary for ${businessEntities.find(e => e.slug === selectedEntity)?.name || selectedEntity}`}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white border-blue-200">
                              <Download className="h-4 w-4 mr-2 text-blue-600" />
                              PDF
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                              <Mail className="h-4 w-4 mr-2" />
                              Send
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </div>
                    <CardContent className="space-y-6">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <h2>Executive Summary</h2>
                        <p>
                          This week showed strong performance across key business metrics with revenue up 8% week-over-week. Operations efficiency improved by 12% while marketing campaigns delivered 15% higher engagement than forecasted. The sales team closed 3 major deals, and customer satisfaction remains high with NPS at 72.
                        </p>
                        
                        {digestSections.filter(s => s.isChecked).map((section) => (
                          <div key={section.id} className="mt-6">
                            <h3>{section.title}</h3>
                            <p>
                              {section.id === "finance" && (
                                "Revenue reached $127,500 this week (+8% WoW), with gross margin at 68%. Operating expenses were reduced by 5% due to improved vendor negotiations. Cash position remains strong at $845,000 with 8.2 months of runway at current burn rate."
                              )}
                              {section.id === "sales" && (
                                "The sales team closed 3 major deals worth $82,000 in ARR. Pipeline grew by 12% with 8 new qualified opportunities. Average deal size increased to $27,333 (+5% from previous quarter). Sales cycle time decreased to 32 days (-3 days)."
                              )}
                              {section.id === "marketing" && (
                                "Email campaign delivered 24% open rate and 3.8% conversion. Social media engagement up 15% with 1,250 new followers. PPC performance improved with CPA down 12% and ROAS up to 3.2x. Website traffic increased 8% with mobile sessions up 12%."
                              )}
                              {section.id === "operations" && (
                                "Production efficiency improved by 12% with new workflow implementation. Fulfillment time reduced to 1.2 days (-0.3 days). Inventory turnover increased to 8.5x annually. Vendor performance metrics all in the green with 99.2% on-time delivery."
                              )}
                              {section.id === "customer" && (
                                "NPS score remains strong at 72 (+2 points). Support ticket resolution time down to 2.4 hours (-18%). Customer retention at 94% with churn rate of 1.2% monthly. Expansion revenue contributing 22% of MRR with 105% net revenue retention."
                              )}
                              {section.id === "team" && (
                                "Team productivity metrics up 8% with new tools adoption. Two new hires started in marketing department. Onboarding progress for recent hires at 85% completion. Training compliance at 98% across organization."
                              )}
                              {section.id === "strategic" && (
                                "New market expansion initiative at 65% completion with key partnerships established. Product roadmap execution on track with 3 major features completed this sprint. Automation score improved to 78 (+4 points) with new workflow implementations."
                              )}
                              {section.id === "competitive" && (
                                "Competitor analysis shows our pricing strategy remains 15% more cost-effective than nearest competitor. Market share increased by 0.8% this quarter. New competitor entered the space with focus on enterprise segment, monitoring their traction."
                              )}
                              {section.id === "forecast" && (
                                "Next week forecast projects $135,000 in revenue (+6%). Three major deals expected to close worth $95,000 in total ARR. Marketing campaign launching for Q2 product release with projected 25,000 impressions. Operations team implementing new efficiency protocols."
                              )}
                            </p>
                          </div>
                        ))}
                        
                        <h3 className="mt-6">Action Items</h3>
                        <ul>
                          <li>Schedule quarterly business review with executive team</li>
                          <li>Approve marketing budget for Q2 campaign series</li>
                          <li>Review sales compensation plan adjustments</li>
                          <li>Finalize vendor contracts for new supply chain initiative</li>
                          <li>Decide on expansion timeline for west coast operations</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-none shadow-xl overflow-hidden">
                    <div className="bg-white border-b rounded-t-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-purple-800">
                          <Send className="h-5 w-5 text-purple-600" />
                          Delivery Options
                        </CardTitle>
                        <CardDescription className="text-gray-700">Choose how you want to deliver this digest</CardDescription>
                      </CardHeader>
                    </div>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {deliveryPreferences.map((pref) => {
                          // Set different gradient colors for each option
                          const gradientClass = 
                            pref.id === 'email' ? "from-blue-100 to-blue-50" :
                            pref.id === 'slack' ? "from-purple-100 to-purple-50" :
                            pref.id === 'pdf' ? "from-orange-100 to-orange-50" :
                            "from-green-100 to-green-50";
                          
                          const iconColor =
                            pref.id === 'email' ? "text-blue-600" :
                            pref.id === 'slack' ? "text-purple-600" :
                            pref.id === 'pdf' ? "text-orange-600" :
                            "text-green-600";
                            
                          return (
                            <div 
                              key={pref.id} 
                              className={`flex items-center justify-between space-x-2 p-4 rounded-lg border hover:shadow-md transition-all 
                                ${pref.isEnabled ? `bg-gradient-to-r ${gradientClass} border-${pref.id === 'email' ? 'blue' : pref.id === 'slack' ? 'purple' : pref.id === 'pdf' ? 'orange' : 'green'}-200` : 'bg-white hover:bg-gray-50'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`${pref.isEnabled ? `bg-${pref.id === 'email' ? 'blue' : pref.id === 'slack' ? 'purple' : pref.id === 'pdf' ? 'orange' : 'green'}-100` : 'bg-gray-100'} p-2 rounded-full`}>
                                  {pref.id === 'email' && <Mail className={`h-4 w-4 ${iconColor}`} />}
                                  {pref.id === 'slack' && <MessageSquare className={`h-4 w-4 ${iconColor}`} />}
                                  {pref.id === 'pdf' && <FileText className={`h-4 w-4 ${iconColor}`} />}
                                  {pref.id === 'calendar' && <Calendar className={`h-4 w-4 ${iconColor}`} />}
                                </div>
                                <Label htmlFor={`pref-${pref.id}`} className="flex-1 cursor-pointer font-medium">{pref.label}</Label>
                              </div>
                              <Switch
                                id={`pref-${pref.id}`}
                                checked={pref.isEnabled}
                                onCheckedChange={() => toggleDeliveryPreference(pref.id)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={deliverDigest}
                        disabled={!deliveryPreferences.some(p => p.isEnabled)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Deliver Digest
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              ) : (
                <Card className="border-none shadow-xl overflow-hidden">
                  <div className="bg-white border-b rounded-t-lg pt-6"></div>
                  <CardContent className="flex flex-col items-center justify-center pt-8 pb-12 bg-white">
                    <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-md">
                      <FileText className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-blue-800">No Digest Generated Yet</h3>
                    <p className="text-gray-700 text-center max-w-md mb-6">
                      Please go to the Generate tab and create a weekly digest to see a preview here.
                    </p>
                    <Button 
                      onClick={() => setActiveTab("generate")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 shadow-md"
                    >
                      <PieChart className="h-4 w-4 mr-2" />
                      Go to Generate Tab
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              <Card className="border-none shadow-xl overflow-hidden">
                <CardHeader className="bg-white border-b rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold text-blue-800">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Digest History
                  </CardTitle>
                  <CardDescription className="text-gray-700">Previously generated weekly digests</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {demoMode ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (7 * (i + 1)));
                        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
                        const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
                        const weekRange = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
                        
                        return (
                          <div key={i} className="flex items-center justify-between p-4 border-none rounded-lg shadow-md hover:shadow-lg bg-white transition-all">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 p-2 rounded-full hidden sm:flex shadow-sm">
                                <FileText className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-blue-800">Weekly Digest: {weekRange}</h4>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-gray-700">
                                    Enterprise-wide business summary
                                  </p>
                                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
                                    Delivered
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="bg-white hover:bg-gray-50 border border-gray-200 shadow-sm">
                                <Download className="h-4 w-4 mr-2 text-blue-600" />
                                PDF
                              </Button>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Mail className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 bg-white border border-gray-100 rounded-lg">
                      <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-md">
                        <Clock className="h-12 w-12 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-blue-800">No Digest History</h3>
                      <p className="text-gray-700 text-center max-w-md mb-6">
                        You haven't generated any weekly digests yet. Start by creating your first digest.
                      </p>
                      <Button 
                        onClick={() => setActiveTab("generate")} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 shadow-md"
                      >
                        <PieChart className="h-4 w-4 mr-2" />
                        Create First Digest
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:col-span-4 space-y-6">
          <Card className="border-none shadow-xl overflow-hidden">
            <div className="bg-white border-b rounded-t-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-blue-800">
                  <LineChart className="h-5 w-5 text-blue-600" />
                  Benefits of Weekly Digests
                </CardTitle>
                <CardDescription className="text-gray-700">Why consistent reporting matters</CardDescription>
              </CardHeader>
            </div>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="bg-blue-100 p-2 rounded-full shadow-sm">
                  <LightbulbIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-blue-800 inline-block">Informed Decision Making</h4>
                  <p className="text-sm text-gray-700">
                    Consolidated data enables faster, better-informed strategic decisions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="bg-purple-100 p-2 rounded-full shadow-sm">
                  <ClipboardCheck className="h-4 w-4 text-purple-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-purple-800 inline-block">Accountability</h4>
                  <p className="text-sm text-gray-700">
                    Regular reporting creates accountability across departments
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="bg-blue-100 p-2 rounded-full shadow-sm">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-blue-800 inline-block">Trend Identification</h4>
                  <p className="text-sm text-gray-700">
                    Weekly snapshots help identify patterns and trends over time
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="bg-purple-100 p-2 rounded-full shadow-sm">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-purple-800 inline-block">Time Savings</h4>
                  <p className="text-sm text-gray-700">
                    Automated digests save hours of manual reporting work
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="bg-blue-100 p-2 rounded-full shadow-sm">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-blue-800 inline-block">Stakeholder Alignment</h4>
                  <p className="text-sm text-gray-700">
                    Keep investors and advisors updated with consistent information
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-xl overflow-hidden">
            <div className="bg-white border-b rounded-t-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-purple-800">
                  <ListChecks className="h-5 w-5 text-purple-600" />
                  Tips for Effective Digests
                </CardTitle>
                <CardDescription className="text-gray-700">Maximize the impact of your reports</CardDescription>
              </CardHeader>
            </div>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="bg-blue-100 w-9 h-9 flex items-center justify-center rounded-full shadow-sm">
                  <Check className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-800">
                  Focus on key metrics that drive business decisions
                </p>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="bg-purple-100 w-9 h-9 flex items-center justify-center rounded-full shadow-sm">
                  <Check className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-800">
                  Include relevant context alongside raw numbers
                </p>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="bg-blue-100 w-9 h-9 flex items-center justify-center rounded-full shadow-sm">
                  <Check className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-800">
                  Highlight both positive results and areas for improvement
                </p>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="bg-purple-100 w-9 h-9 flex items-center justify-center rounded-full shadow-sm">
                  <Check className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-800">
                  Add specific action items for the coming week
                </p>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="bg-blue-100 w-9 h-9 flex items-center justify-center rounded-full shadow-sm">
                  <Check className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-800">
                  Maintain consistent delivery schedule (same day each week)
                </p>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="bg-purple-100 w-9 h-9 flex items-center justify-center rounded-full shadow-sm">
                  <Check className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-800">
                  Solicit feedback to improve digest format over time
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WeeklyDigestPage;