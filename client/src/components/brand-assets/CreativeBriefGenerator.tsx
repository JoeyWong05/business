import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getQueryFn } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Icons
import {
  Wand2,
  FileOutput,
  Target,
  CheckCircle2,
  MessageSquare,
  Megaphone,
  Lightbulb,
  Calendar,
  Share2,
  Download,
  Upload
} from 'lucide-react';

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
interface CreativeBrief {
  id: string;
  title: string;
  audience: string;
  entityId: number;
  entityName: string;
  description: string;
  brandGuidelines: string;
  deliverables: string[];
  toneAndVoice: string;
  channels: string[];
  timeline: string;
  keyMessages: string[];
  success: string;
  createdAt: string;
}

interface BusinessEntity {
  id: number;
  name: string;
  description?: string;
  type?: string;
  slug?: string;
}

const CreativeBriefGenerator: React.FC = () => {
  // Creative Brief states
  const [briefDialogOpen, setBriefDialogOpen] = useState(false);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [briefEntityId, setBriefEntityId] = useState<string>('');
  const [briefCampaignName, setBriefCampaignName] = useState('');
  const [briefTargetAudience, setBriefTargetAudience] = useState('');
  const [generatedBrief, setGeneratedBrief] = useState<CreativeBrief | null>(null);
  const [briefDetailsOpen, setBriefDetailsOpen] = useState(false);
  
  const { toast } = useToast();

  // Fetch entities
  const { data: entitiesData } = useQuery({
    queryKey: ['/api/business-entities'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });
  
  const entities: BusinessEntity[] = (entitiesData && typeof entitiesData === 'object' && 
    entitiesData !== null && 'entities' in entitiesData && Array.isArray(entitiesData.entities)) 
    ? entitiesData.entities as BusinessEntity[] 
    : [];

  // Creative Brief generation functions
  const generateCreativeBrief = async () => {
    if (!briefEntityId || !briefCampaignName || !briefTargetAudience) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate a creative brief.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingBrief(true);
    
    try {
      // Simulate API call (in a real implementation, this would be a call to OpenAI API)
      // In a production environment, you would have a backend endpoint for this
      setTimeout(() => {
        const entityName = entities.find(e => e.id.toString() === briefEntityId)?.name || 'Unknown';
        
        const brief: CreativeBrief = {
          id: `brief-${Math.random().toString(36).substring(2, 9)}`,
          title: briefCampaignName,
          audience: briefTargetAudience,
          entityId: parseInt(briefEntityId),
          entityName: entityName,
          description: `This creative brief outlines the strategy, audience, and deliverables for the ${briefCampaignName} campaign.`,
          brandGuidelines: "Maintain consistent brand voice and visual identity across all deliverables. Use approved color palette and typography.",
          deliverables: [
            "Social media graphics (multiple formats)",
            "Email marketing templates",
            "Landing page content",
            "Ad creative (various sizes)",
            "Product photography guidelines"
          ],
          toneAndVoice: briefTargetAudience.includes("professional") ? 
            "Professional, authoritative, and informative" : 
            "Friendly, conversational, and approachable",
          channels: [
            "Instagram",
            "Facebook",
            "Email newsletters",
            "LinkedIn",
            "Google Ads"
          ],
          timeline: "4 weeks from brief approval to campaign launch",
          keyMessages: [
            "Focus on value proposition and unique selling points",
            "Address key customer pain points directly",
            "Emphasize quality and reliability",
            "Include clear call-to-action in all materials"
          ],
          success: "Increase engagement by 25%, generate 500 qualified leads, and improve conversion rate by 15%",
          createdAt: new Date().toISOString()
        };
        
        setGeneratedBrief(brief);
        setBriefDialogOpen(false);
        setBriefDetailsOpen(true);
        setIsGeneratingBrief(false);
        
        toast({
          title: "Creative Brief Generated",
          description: "Your AI-generated creative brief is ready to review.",
        });
      }, 2000);
    } catch (error) {
      console.error("Error generating creative brief:", error);
      setIsGeneratingBrief(false);
      
      toast({
        title: "Generation Failed",
        description: "Failed to generate creative brief. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const exportBriefAsPDF = () => {
    if (!generatedBrief) return;
    
    toast({
      title: "Export Started",
      description: "Your PDF is being prepared for download..."
    });
    
    // In a real implementation, this would use a PDF generation library
    // For this demo, we'll simulate the export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your creative brief has been downloaded as PDF."
      });
    }, 1500);
  };
  
  const shareBrief = () => {
    // Generate a shareable link
    const shareableLink = `https://app.dmphq.com/brand-assets/brief/${generatedBrief?.id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableLink).then(() => {
      toast({
        title: "Link copied",
        description: "Shareable link has been copied to clipboard",
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-1">AI Creative Brief Generator</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Generate professional creative briefs for marketing campaigns with AI assistance
          </p>
        </div>
        
        <Button onClick={() => setBriefDialogOpen(true)}>
          <Wand2 className="h-4 w-4 mr-2" />
          Generate New Brief
        </Button>
      </div>
      
      {generatedBrief ? (
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <CardTitle className="text-xl">{generatedBrief.title}</CardTitle>
                <CardDescription>
                  For {generatedBrief.entityName} • Created {format(new Date(generatedBrief.createdAt), 'MMMM d, yyyy')}
                </CardDescription>
              </div>
              <div className="flex">
                <Button variant="outline" size="sm" onClick={shareBrief} className="mr-2">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button size="sm" onClick={() => setBriefDetailsOpen(true)}>
                  View Details
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm mb-1">Description</h3>
                <p className="text-sm text-muted-foreground">{generatedBrief.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-sm mb-1">Target Audience</h3>
                  <p className="text-sm text-muted-foreground">{generatedBrief.audience}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Tone & Voice</h3>
                  <p className="text-sm text-muted-foreground">{generatedBrief.toneAndVoice}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Timeline</h3>
                  <p className="text-sm text-muted-foreground">{generatedBrief.timeline}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm mb-1">Key Messages</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  {generatedBrief.keyMessages.slice(0, 2).map((message, index) => (
                    <li key={index}>{message}</li>
                  ))}
                  {generatedBrief.keyMessages.length > 2 && (
                    <li>
                      <Button 
                        variant="link" 
                        className="px-0 h-auto text-primary" 
                        onClick={() => setBriefDetailsOpen(true)}
                      >
                        View {generatedBrief.keyMessages.length - 2} more...
                      </Button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <FileOutput className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No creative briefs yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Generate your first AI-powered creative brief to streamline your marketing campaigns.
            </p>
            <Button onClick={() => setBriefDialogOpen(true)}>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Your First Brief
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Creative Brief Dialog */}
      <Dialog open={briefDialogOpen} onOpenChange={setBriefDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Generate AI Creative Brief</DialogTitle>
            <DialogDescription>
              Fill in the details below to generate a professional creative brief using AI.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="entity">Business Entity</Label>
              <Select 
                value={briefEntityId} 
                onValueChange={setBriefEntityId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business entity" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map(entity => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign/Project Name</Label>
              <Input
                id="campaign-name"
                placeholder="e.g., Summer Collection Launch 2025"
                value={briefCampaignName}
                onChange={(e) => setBriefCampaignName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target-audience">Target Audience</Label>
              <Textarea
                id="target-audience"
                placeholder="Describe your target audience, including demographics, interests, and pain points"
                value={briefTargetAudience}
                onChange={(e) => setBriefTargetAudience(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBriefDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={generateCreativeBrief}
              disabled={isGeneratingBrief}
              className="ml-2"
            >
              {isGeneratingBrief ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Brief
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Generated Brief Dialog */}
      <Dialog open={briefDetailsOpen} onOpenChange={setBriefDetailsOpen}>
        <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
          {generatedBrief && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-xl sm:text-2xl">{generatedBrief.title}</DialogTitle>
                  <Badge variant="outline" className="ml-2">{generatedBrief.entityName}</Badge>
                </div>
                <DialogDescription>
                  Created on {format(new Date(generatedBrief.createdAt), 'MMMM d, yyyy')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Target className="mr-2 h-4 w-4 text-primary" />
                    Target Audience
                  </h3>
                  <p className="text-sm text-muted-foreground">{generatedBrief.audience}</p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FileOutput className="mr-2 h-4 w-4 text-primary" />
                    Description
                  </h3>
                  <p className="text-sm text-muted-foreground">{generatedBrief.description}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                      Deliverables
                    </h3>
                    <ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
                      {generatedBrief.deliverables.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4 text-primary" />
                      Tone & Voice
                    </h3>
                    <p className="text-sm text-muted-foreground">{generatedBrief.toneAndVoice}</p>
                    
                    <h3 className="text-lg font-semibold flex items-center mt-4">
                      <Megaphone className="mr-2 h-4 w-4 text-primary" />
                      Distribution Channels
                    </h3>
                    <ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
                      {generatedBrief.channels.map((channel, index) => (
                        <li key={index}>{channel}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Lightbulb className="mr-2 h-4 w-4 text-primary" />
                    Key Messages
                  </h3>
                  <ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
                    {generatedBrief.keyMessages.map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <h3 className="text-md font-semibold flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      Timeline
                    </h3>
                    <p className="text-sm text-muted-foreground">{generatedBrief.timeline}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-md font-semibold flex items-center">
                      <Target className="mr-2 h-4 w-4 text-primary" />
                      Success Metrics
                    </h3>
                    <p className="text-sm text-muted-foreground">{generatedBrief.success}</p>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <div className="flex justify-between w-full">
                  <Button variant="outline" onClick={() => setBriefDetailsOpen(false)}>
                    Close
                  </Button>
                  <div>
                    <Button variant="outline" onClick={shareBrief} className="mr-2">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button onClick={exportBriefAsPDF}>
                      <Download className="mr-2 h-4 w-4" />
                      Export as PDF
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreativeBriefGenerator;