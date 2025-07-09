import { toast } from "@/hooks/use-toast";

interface OpenAITextResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Call OpenAI API through our backend to keep API key secure
export async function generateFromOpenAI(prompt: string, model: string = "gpt-4o", maxTokens: number = 800): Promise<OpenAITextResponse> {
  try {
    const response = await fetch('/api/openai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model,
        maxTokens,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate content');
    }
    
    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error("OpenAI generation error:", error);
    toast({
      title: "AI Generation Failed",
      description: error.message || "Unable to generate content. Please try again.",
      variant: "destructive"
    });
    
    return {
      success: false,
      error: error.message || "Unknown error occurred"
    };
  }
}

// Functions for specific Agency Killer tools

// AI Copy Generator
export async function generateCopyContent(product: string, tone: string): Promise<OpenAITextResponse> {
  const prompt = `
Generate marketing copy for "${product}" with a ${tone} tone. 
Include the following sections:
1. Five email subject lines
2. An email body
3. Landing page copy
4. Three social media ad copy variations with headline and body text
5. Four Instagram caption ideas

Format your response as a JSON object with keys: emailSubjects (array), emailBody (string), landingPage (string), socialAdCopy (array of objects with headline and body), and instagramCaptions (array).
`;

  return generateFromOpenAI(prompt, "gpt-4o", 1500);
}

// SEO Toolkit - Website Audit
export async function generateSEOAudit(url: string): Promise<OpenAITextResponse> {
  const prompt = `
Simulate an SEO audit for the website ${url}. 
Create a comprehensive report that includes:
1. An overall SEO score out of 100
2. Three optimized title tag suggestions
3. Three meta description suggestions
4. Eight relevant keywords for their industry
5. Eight common SEO checks (mobile-friendly, site speed, HTTPS, H1 tags, image alt text, sitemap, broken links, meta descriptions) with pass/fail status and brief description

Format your response as a JSON object with keys: score (number), titleTags (array), metaDescriptions (array), keywords (array), checks (array of objects with name, passed (boolean), and description).
`;

  return generateFromOpenAI(prompt, "gpt-4o", 1500);
}

// SEO Toolkit - Keyword Generator
export async function generateSEOKeywords(industry: string): Promise<OpenAITextResponse> {
  const prompt = `
Generate 10 highly relevant SEO keywords for a business in the "${industry}" industry.
Focus on keywords that have good search volume and moderate competition.
Include a mix of short-tail and long-tail keywords.
Format your response as a JSON array of strings.
`;

  return generateFromOpenAI(prompt, "gpt-4o", 800);
}

// Ad Campaign Builder
export async function generateAdCampaign(product: string): Promise<OpenAITextResponse> {
  const prompt = `
Create a comprehensive ad campaign strategy for "${product}".
Include the following in your response:
1. Target audience description
2. Three recommended platforms to advertise on, with a reason for each
3. Five compelling headlines
4. Four ad copy variations
5. Five call-to-action (CTA) options

Format your response as a JSON object with keys: audience (string), platforms (array of objects with name and reason), headlines (array), adCopy (array), and ctas (array).
`;

  return generateFromOpenAI(prompt, "gpt-4o", 1500);
}

// Marketing Funnel Builder
export async function generateMarketingFunnel(goal: string): Promise<OpenAITextResponse> {
  const prompt = `
Create a comprehensive marketing funnel for the goal: "${goal}".
The funnel should include 4-5 stages, from awareness to conversion.
For each stage, include:
1. Stage title
2. Stage description
3. Key elements or components (5 per stage)
4. Tips for optimization (5 per stage)

Format your response as a JSON object with keys: goal (string) and steps (array of objects with title, description, elements array, and tips array).
`;

  return generateFromOpenAI(prompt, "gpt-4o", 2000);
}

// Performance Simulator (updates input metrics based on campaign changes)
export async function simulatePerformanceChanges(
  metrics: any, 
  changes: {
    budgetChange?: number,
    audienceChange?: string,
    creativeChange?: string,
    targetingChange?: string
  }
): Promise<OpenAITextResponse> {
  const prompt = `
Given the following current campaign metrics:
- Budget: $${metrics.budget}
- Impressions: ${metrics.impressions}
- Clicks: ${metrics.clicks}
- CTR: ${metrics.ctr}%
- Conversions: ${metrics.conversions}
- Conversion Rate: ${metrics.conversionRate}%
- CPA: $${metrics.cpa}
- Revenue: $${metrics.revenue}
- ROAS: ${metrics.roas}

And these proposed changes:
${changes.budgetChange ? `- Budget ${changes.budgetChange > 0 ? 'increase' : 'decrease'} by ${Math.abs(changes.budgetChange)}%` : ''}
${changes.audienceChange ? `- Audience changes: ${changes.audienceChange}` : ''}
${changes.creativeChange ? `- Creative changes: ${changes.creativeChange}` : ''}
${changes.targetingChange ? `- Targeting changes: ${changes.targetingChange}` : ''}

Predict the updated campaign metrics after these changes.
Use your knowledge of digital marketing to make reasonable projections.
Format your response as a JSON object with the same metrics structure: budget, impressions, clicks, ctr, conversions, conversionRate, cpa, revenue, roas.
`;

  return generateFromOpenAI(prompt, "gpt-4o", 1000);
}