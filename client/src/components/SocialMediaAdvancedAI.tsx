import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Check,
  Copy,
  Globe,
  Image,
  Instagram,
  Loader,
  RefreshCw,
  Send,
  Sparkles,
  Wand2,
  Youtube
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SiFacebook, SiLinkedin, SiPinterest, SiTiktok } from 'react-icons/si';
import { BsTwitter } from 'react-icons/bs';

// Import these types from your EnhancedSocialMediaManager component
import { SocialPlatform, ContentType } from './EnhancedSocialMediaManager';

interface AIContentGeneratorProps {
  onGenerate: (prompt: string, platform: SocialPlatform, contentType: ContentType, options: AIGenerationOptions) => Promise<string>;
  defaultPlatform?: SocialPlatform;
  defaultContentType?: ContentType;
}

interface AIGenerationOptions {
  tone: string;
  length: number; // 1-100 scale
  includeHashtags: boolean;
  includeEmojis: boolean;
  targetAudience?: string;
  callToAction?: string;
}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  onGenerate,
  defaultPlatform = SocialPlatform.FACEBOOK,
  defaultContentType = ContentType.TEXT
}) => {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>(defaultPlatform);
  const [contentType, setContentType] = useState<ContentType>(defaultContentType);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<AIGenerationOptions>({
    tone: 'professional',
    length: 50,
    includeHashtags: true,
    includeEmojis: true,
    targetAudience: '',
    callToAction: ''
  });
  const { toast } = useToast();

  // Get platform icon
  const getPlatformIcon = (platform: SocialPlatform, className = 'h-5 w-5') => {
    switch (platform) {
      case SocialPlatform.FACEBOOK:
        return <SiFacebook className={className} style={{ color: '#1877F2' }} />;
      case SocialPlatform.INSTAGRAM:
        return <Instagram className={className} style={{ color: '#E1306C' }} />;
      case SocialPlatform.TWITTER:
        return <BsTwitter className={className} style={{ color: '#1DA1F2' }} />;
      case SocialPlatform.LINKEDIN:
        return <SiLinkedin className={className} style={{ color: '#0A66C2' }} />;
      case SocialPlatform.PINTEREST:
        return <SiPinterest className={className} style={{ color: '#E60023' }} />;
      case SocialPlatform.TIKTOK:
        return <SiTiktok className={className} style={{ color: '#000000' }} />;
      case SocialPlatform.YOUTUBE:
        return <Youtube className={className} style={{ color: '#FF0000' }} />;
      default:
        return <Globe className={className} />;
    }
  };

  const handleGenerateContent = async () => {
    if (!prompt) {
      toast({
        title: 'Prompt required',
        description: 'Please enter a prompt to generate content.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const content = await onGenerate(prompt, platform, contentType, options);
      setGeneratedContent(content);
      
      toast({
        title: 'Content Generated',
        description: 'AI content has been successfully generated.',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-500" />
          <CardTitle>AI Content Generator</CardTitle>
        </div>
        <CardDescription>
          Generate optimized content for your social media platforms using AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <Label>Platform</Label>
              <Select 
                value={platform} 
                onValueChange={(value) => setPlatform(value as SocialPlatform)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SocialPlatform).map((p) => (
                    <SelectItem key={p} value={p}>
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(p as SocialPlatform, 'h-4 w-4')}
                        <span>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-1">
              <Label>Content Type</Label>
              <Select 
                value={contentType} 
                onValueChange={(value) => setContentType(value as ContentType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ContentType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-1">
              <Label>Tone</Label>
              <Select 
                value={options.tone} 
                onValueChange={(value) => setOptions({...options, tone: value})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="funny">Funny</SelectItem>
                  <SelectItem value="serious">Serious</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="informative">Informative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Content Length</Label>
              <span className="text-sm text-muted-foreground">
                {options.length < 33 ? 'Short' : options.length < 66 ? 'Medium' : 'Long'}
              </span>
            </div>
            <Slider
              min={1}
              max={100}
              step={1}
              value={[options.length]}
              onValueChange={(value) => setOptions({...options, length: value[0]})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="hashtags"
                checked={options.includeHashtags}
                onCheckedChange={(checked) => setOptions({...options, includeHashtags: checked})}
              />
              <Label htmlFor="hashtags">Include Hashtags</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="emojis"
                checked={options.includeEmojis}
                onCheckedChange={(checked) => setOptions({...options, includeEmojis: checked})}
              />
              <Label htmlFor="emojis">Include Emojis</Label>
            </div>
          </div>
          
          <div>
            <Label>Target Audience (Optional)</Label>
            <Input
              placeholder="e.g., Millennials interested in fitness and wellness"
              value={options.targetAudience}
              onChange={(e) => setOptions({...options, targetAudience: e.target.value})}
            />
          </div>
          
          <div>
            <Label>Call to Action (Optional)</Label>
            <Input
              placeholder="e.g., Sign up for our newsletter, Shop now, Learn more"
              value={options.callToAction}
              onChange={(e) => setOptions({...options, callToAction: e.target.value})}
            />
          </div>
          
          <div>
            <Label>Prompt</Label>
            <Textarea
              placeholder="Describe what you want to create. E.g., 'Announce our new summer collection with a focus on sustainability'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
          
          <Button 
            onClick={handleGenerateContent}
            disabled={isLoading || !prompt}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </div>
        
        {generatedContent && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <Label>Generated Content</Label>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(generatedContent);
                  toast({
                    title: 'Copied to clipboard',
                    description: 'Content has been copied to your clipboard',
                  });
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
            <div className="p-4 border rounded-md bg-muted">
              <div className="whitespace-pre-wrap">{generatedContent}</div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {generatedContent && (
          <Button variant="outline" onClick={handleGenerateContent}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AIContentGenerator;