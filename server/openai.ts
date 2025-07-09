import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const DEFAULT_MODEL = "gpt-4o";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Original functions from existing implementation
export async function analyzeSocialMediaMetrics(data: any): Promise<any> {
  return generateJSONContent(
    `Analyze these social media metrics: ${JSON.stringify(data)}`,
    DEFAULT_MODEL,
    1000
  );
}

export async function generateSocialMediaContent(
  platform: string,
  businessType: string
): Promise<any> {
  return generateJSONContent(
    `Generate social media content for ${platform} for a ${businessType} business.`,
    DEFAULT_MODEL,
    1000
  );
}

export async function generateBusinessInsights(data: any): Promise<any> {
  return generateJSONContent(
    `Generate business insights based on: ${JSON.stringify(data)}`,
    DEFAULT_MODEL,
    1000
  );
}

export async function generateWorkflowSuggestions(activities: any[]): Promise<any> {
  return generateJSONContent(
    `Suggest workflow improvements based on: ${JSON.stringify(activities)}`,
    DEFAULT_MODEL,
    1000
  );
}

export async function optimizeMarketingCampaigns(campaigns: any[]): Promise<any> {
  return generateJSONContent(
    `Optimize these marketing campaigns: ${JSON.stringify(campaigns)}`,
    DEFAULT_MODEL,
    1000
  );
}

export async function generateSOP(
  title: string,
  category: string,
  subcategory: string,
  businessDescription?: string
): Promise<any> {
  const prompt = `
Create a Standard Operating Procedure (SOP) for "${title}" in the ${category} department, specifically for ${subcategory}.
${businessDescription ? `Additional business context: ${businessDescription}` : ""}

Generate a complete SOP with:
1. A comprehensive introduction explaining the purpose and importance
2. A detailed step-by-step process, with at least 7-10 clear steps
3. Best practices and tips for implementation
4. Common pitfalls to avoid

Format as a JSON object with: content (string with full SOP text) and steps (array of step objects with title and description fields).
`;

  return generateJSONContent(prompt, DEFAULT_MODEL, 2000);
}

export async function generateCalendarSOP(
  businessSize: string,
  globalTeam: boolean,
  integrationNeeds: string[]
): Promise<any> {
  const prompt = `
Create a detailed Standard Operating Procedure (SOP) for optimizing Google Calendar usage for team collaboration.
Business context: ${businessSize} business${globalTeam ? " with globally distributed team" : ""}
${integrationNeeds.length > 0 ? `Integration requirements: ${integrationNeeds.join(", ")}` : ""}

Generate a complete SOP that includes:
1. Introduction explaining the importance of calendar management for team collaboration
2. Setup process for Google Calendar with best practices
3. Step-by-step guidelines for scheduling, sharing, and managing team calendars
4. Specific techniques for managing time zones${globalTeam ? " across global teams" : ""}
5. Instructions for integrating with: ${
    integrationNeeds.length > 0 ? integrationNeeds.join(", ") : "common productivity tools"
  }

Format as a JSON object with: content (string with full SOP text) and steps (array of step objects with title and description fields).
`;

  return generateJSONContent(prompt, DEFAULT_MODEL, 2000);
}

export async function generateRecommendations(
  category: string,
  existingTools: string[],
  businessSize: string,
  monthlyBudget: number
): Promise<any[]> {
  const prompt = `
Generate 3-5 tool recommendations for the ${category} category for a ${businessSize}.
Current tools in use: ${existingTools.length > 0 ? existingTools.join(", ") : "None"}
Monthly budget: $${monthlyBudget}

For each recommendation, provide:
1. A title (the tool name)
2. A detailed description explaining the tool and its benefits
3. The type of tool (e.g., CRM, analytics, automation)

Format as a JSON array with objects containing: title, description, and type fields.
`;

  const result = await generateJSONContent(prompt, DEFAULT_MODEL, 1500);
  return Array.isArray(result) ? result : [];
}

/**
 * Generates text content using OpenAI's API based on the provided prompt
 * @param prompt The instruction text to send to OpenAI
 * @param model The OpenAI model to use
 * @param maxTokens Maximum number of tokens to generate
 * @returns The generated text
 */
export async function generateText(
  prompt: string,
  model: string = DEFAULT_MODEL,
  maxTokens: number = 1000
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}

/**
 * Generates text content in JSON format using OpenAI's API based on the provided prompt
 * @param prompt The instruction text to send to OpenAI
 * @param model The OpenAI model to use
 * @param maxTokens Maximum number of tokens to generate
 * @returns The generated content as a parsed JSON object
 */
export async function generateJSONContent(
  prompt: string,
  model: string = DEFAULT_MODEL,
  maxTokens: number = 1000
): Promise<any> {
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that always responds in valid JSON format. Your responses should be well-structured and directly parseable by JSON.parse().",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error: any) {
    console.error("OpenAI JSON generation error:", error);
    throw new Error(`Failed to generate JSON content: ${error.message}`);
  }
}

/**
 * Agency Killer specific function: Generates marketing copy content
 */
export async function generateMarketingCopy(product: string, tone: string): Promise<any> {
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

  return generateJSONContent(prompt, DEFAULT_MODEL, 1500);
}

/**
 * Agency Killer specific function: Generates SEO audit for a website
 */
export async function generateSEOAudit(url: string): Promise<any> {
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

  return generateJSONContent(prompt, DEFAULT_MODEL, 1500);
}

/**
 * Agency Killer specific function: Generates SEO keywords for an industry
 */
export async function generateSEOKeywords(industry: string): Promise<string[]> {
  const prompt = `
Generate 10 highly relevant SEO keywords for a business in the "${industry}" industry.
Focus on keywords that have good search volume and moderate competition.
Include a mix of short-tail and long-tail keywords.
Format your response as a JSON array of strings.
`;

  const result = await generateJSONContent(prompt, DEFAULT_MODEL, 800);
  return Array.isArray(result) ? result : result.keywords || [];
}

/**
 * Agency Killer specific function: Generates ad campaign strategy
 */
export async function generateAdCampaign(product: string): Promise<any> {
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

  return generateJSONContent(prompt, DEFAULT_MODEL, 1500);
}

/**
 * Agency Killer specific function: Generates marketing funnel strategy
 */
export async function generateMarketingFunnel(goal: string): Promise<any> {
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

  return generateJSONContent(prompt, DEFAULT_MODEL, 2000);
}

/**
 * Agency Killer specific function: Simulates performance metrics based on campaign changes
 */
export async function simulatePerformanceMetrics(currentMetrics: any, changes: any): Promise<any> {
  const prompt = `
Given the following current campaign metrics:
- Budget: $${currentMetrics.budget}
- Impressions: ${currentMetrics.impressions}
- Clicks: ${currentMetrics.clicks}
- CTR: ${currentMetrics.ctr}%
- Conversions: ${currentMetrics.conversions}
- Conversion Rate: ${currentMetrics.conversionRate}%
- CPA: $${currentMetrics.cpa}
- Revenue: $${currentMetrics.revenue}
- ROAS: ${currentMetrics.roas}

And these proposed changes:
${
  changes.budgetChange
    ? `- Budget ${changes.budgetChange > 0 ? "increase" : "decrease"} by ${Math.abs(
        changes.budgetChange
      )}%`
    : ""
}
${changes.audienceChange ? `- Audience changes: ${changes.audienceChange}` : ""}
${changes.creativeChange ? `- Creative changes: ${changes.creativeChange}` : ""}
${changes.targetingChange ? `- Targeting changes: ${changes.targetingChange}` : ""}

Predict the updated campaign metrics after these changes.
Use your knowledge of digital marketing to make reasonable projections.
Format your response as a JSON object with the same metrics structure: budget, impressions, clicks, ctr, conversions, conversionRate, cpa, revenue, roas.
`;

  return generateJSONContent(prompt, DEFAULT_MODEL, 1000);
}
