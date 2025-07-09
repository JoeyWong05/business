// Automation Score Calculation Logic

/**
 * Defines the weighting for each automation criteria
 */
export const automationWeights = {
  // Tools implemented across business areas (40% of total score)
  toolsCoverage: 0.4,
  
  // Integration between tools (25% of total score)
  toolsIntegration: 0.25,
  
  // Sophistication of automation (20% of total score)
  automationSophistication: 0.2,
  
  // Process documentation via SOPs (15% of total score)
  processDocumentation: 0.15
};

/**
 * Measures how many business functions have automated tools
 * @param categoryTools Map of category IDs to number of tools in each
 * @param totalCategories Total number of business categories
 */
export function calculateToolsCoverage(
  categoryTools: Record<number, { count: number }>,
  totalCategories: number
): number {
  // Count categories that have at least one tool
  const categoriesWithTools = Object.keys(categoryTools).length;
  
  // Calculate what percentage of categories have tools
  const categoryCoverage = totalCategories > 0 ? categoriesWithTools / totalCategories : 0;
  
  // Calculate average tools per category (capped at 5 tools per category for 100% score)
  const toolsPerCategory = Object.values(categoryTools).reduce((sum, cat) => {
    // Cap each category at 5 tools (more doesn't increase score)
    const cappedCount = Math.min(cat.count, 5);
    return sum + (cappedCount / 5); // 5 tools = 100% automation for a category
  }, 0) / totalCategories;
  
  // Combine both measures (50% weight on category coverage, 50% on tool density)
  return (categoryCoverage * 0.5) + (toolsPerCategory * 0.5);
}

/**
 * Calculates a score based on how many tools are integrated with each other
 * @param integratedToolPairs Number of tool pairs that are integrated
 * @param totalTools Total number of tools
 */
export function calculateToolsIntegration(
  integratedToolPairs: number,
  totalTools: number
): number {
  if (totalTools <= 1) return 0;
  
  // Maximum possible integrations is n*(n-1)/2 where n is number of tools
  const maxPossibleIntegrations = (totalTools * (totalTools - 1)) / 2;
  
  // Calculate percentage of possible integrations that are implemented
  return maxPossibleIntegrations > 0 ? 
    Math.min(integratedToolPairs / maxPossibleIntegrations, 1) : 0;
}

/**
 * Scores the level of sophistication in automations (basic vs advanced)
 * @param toolsByTier Map of tier slugs to count of tools in that tier
 * @param totalTools Total number of tools
 */
export function calculateAutomationSophistication(
  toolsByTier: Record<string, number>,
  totalTools: number
): number {
  if (totalTools === 0) return 0;
  
  // Weighting factors for different tiers
  const tierWeights = {
    'free': 0.3,     // Basic automation
    'low-cost': 0.7, // Intermediate automation
    'enterprise': 1  // Advanced automation
  };
  
  // Calculate weighted score based on tool tiers
  let weightedSum = 0;
  
  for (const [tier, count] of Object.entries(toolsByTier)) {
    // @ts-ignore
    const tierWeight = tierWeights[tier] || 0.5; // Default weight if unknown tier
    weightedSum += count * tierWeight;
  }
  
  return weightedSum / totalTools;
}

/**
 * Scores how well business processes are documented in SOPs
 * @param sopCount Number of SOPs created
 * @param totalCategories Total number of business categories
 * @param averageSopSteps Average number of steps in SOPs
 */
export function calculateProcessDocumentation(
  sopCount: number,
  totalCategories: number,
  averageSopSteps: number
): number {
  // Target metrics
  const targetSopsPerCategory = 3; // Aim for 3 SOPs per category
  const targetStepsPerSop = 5;     // Aim for SOPs with at least 5 steps
  
  // Calculate SOP coverage (capped at 100%)
  const sopCoverage = Math.min(sopCount / (totalCategories * targetSopsPerCategory), 1);
  
  // Calculate SOP quality based on steps (capped at 100%)
  const sopQuality = Math.min(averageSopSteps / targetStepsPerSop, 1);
  
  // Combined score (70% coverage, 30% quality)
  return (sopCoverage * 0.7) + (sopQuality * 0.3);
}

/**
 * Calculates overall automation score based on all factors
 * Returns the overall score and component scores with explanations
 */
export function calculateAutomationScore(
  categoryTools: Record<number, { count: number }>,
  integratedToolPairs: number,
  toolsByTier: Record<string, number>,
  sopCount: number,
  averageSopSteps: number,
  totalCategories: number,
  totalTools: number
): { 
  score: number,
  componentScores: {
    toolsCoverage: { score: number, percentage: number, explanation: string },
    toolsIntegration: { score: number, percentage: number, explanation: string },
    automationSophistication: { score: number, percentage: number, explanation: string },
    processDocumentation: { score: number, percentage: number, explanation: string }
  }
} {
  // Calculate individual component scores
  const toolsCoverage = calculateToolsCoverage(categoryTools, totalCategories);
  const toolsIntegration = calculateToolsIntegration(integratedToolPairs, totalTools);
  const automationSophistication = calculateAutomationSophistication(toolsByTier, totalTools);
  const processDocumentation = calculateProcessDocumentation(sopCount, totalCategories, averageSopSteps);
  
  // Generate explanations for each component
  const categoriesWithTools = Object.keys(categoryTools).length;
  const toolsCoverageExplanation = `${categoriesWithTools} out of ${totalCategories} business categories have automation tools. ${getToolsCoverageInsight(toolsCoverage)}`;
  
  const maxPossibleIntegrations = totalTools > 1 ? (totalTools * (totalTools - 1)) / 2 : 0;
  const integrationPercentage = maxPossibleIntegrations > 0 ? (integratedToolPairs / maxPossibleIntegrations) * 100 : 0;
  const toolsIntegrationExplanation = `${integratedToolPairs} tool integrations exist out of ${maxPossibleIntegrations} possible connections. ${getIntegrationInsight(toolsIntegration)}`;
  
  const freeTierPercentage = (toolsByTier['free'] || 0) / totalTools * 100;
  const enterpriseTierPercentage = (toolsByTier['enterprise'] || 0) / totalTools * 100;
  const automationSophisticationExplanation = `Your tool mix is ${getSophisticationDescription(automationSophistication)}. ${freeTierPercentage.toFixed(0)}% free-tier and ${enterpriseTierPercentage.toFixed(0)}% enterprise-tier tools.`;
  
  const targetSopsPerCategory = 3;
  const sopCoveragePercentage = Math.min(sopCount / (totalCategories * targetSopsPerCategory), 1) * 100;
  const processDocumentationExplanation = `${sopCount} SOPs documented with an average of ${averageSopSteps.toFixed(1)} steps per SOP. ${getDocumentationInsight(processDocumentation)}`;
  
  // Apply weightings to each component
  const weightedScore = 
    (toolsCoverage * automationWeights.toolsCoverage) +
    (toolsIntegration * automationWeights.toolsIntegration) +
    (automationSophistication * automationWeights.automationSophistication) +
    (processDocumentation * automationWeights.processDocumentation);
  
  // Convert to percentage and round to nearest integer
  const finalScore = Math.round(weightedScore * 100);
  
  // Return both the score and detailed component breakdowns
  return {
    score: finalScore,
    componentScores: {
      toolsCoverage: { 
        score: toolsCoverage, 
        percentage: Math.round(toolsCoverage * 100),
        explanation: toolsCoverageExplanation 
      },
      toolsIntegration: { 
        score: toolsIntegration, 
        percentage: Math.round(toolsIntegration * 100),
        explanation: toolsIntegrationExplanation 
      },
      automationSophistication: { 
        score: automationSophistication, 
        percentage: Math.round(automationSophistication * 100),
        explanation: automationSophisticationExplanation 
      },
      processDocumentation: { 
        score: processDocumentation, 
        percentage: Math.round(processDocumentation * 100),
        explanation: processDocumentationExplanation 
      }
    }
  };
}

/**
 * Generate insights for tools coverage score
 */
function getToolsCoverageInsight(score: number): string {
  if (score > 0.8) {
    return "Excellent coverage across business functions.";
  } else if (score > 0.6) {
    return "Good coverage, but some areas could benefit from more automation tools.";
  } else if (score > 0.4) {
    return "Moderate coverage, consider expanding tools to underserved areas.";
  } else if (score > 0.2) {
    return "Limited coverage, many business areas lack automation.";
  } else {
    return "Very limited coverage, most business functions are manual.";
  }
}

/**
 * Generate insights for tools integration score
 */
function getIntegrationInsight(score: number): string {
  if (score > 0.8) {
    return "Excellent integration between systems.";
  } else if (score > 0.6) {
    return "Good integration, but some tools remain siloed.";
  } else if (score > 0.4) {
    return "Moderate integration, consider connecting more systems.";
  } else if (score > 0.2) {
    return "Limited integration, most tools operate in isolation.";
  } else {
    return "Very limited integration, creating data silos and duplicated work.";
  }
}

/**
 * Get sophistication level description
 */
function getSophisticationDescription(score: number): string {
  if (score > 0.8) {
    return "advanced with powerful enterprise-grade solutions";
  } else if (score > 0.6) {
    return "fairly sophisticated with mid-tier solutions";
  } else if (score > 0.4) {
    return "moderately sophisticated";
  } else if (score > 0.2) {
    return "basic with mostly entry-level tools";
  } else {
    return "very basic with primarily free tools";
  }
}

/**
 * Generate insights for process documentation
 */
function getDocumentationInsight(score: number): string {
  if (score > 0.8) {
    return "Excellent documentation of processes.";
  } else if (score > 0.6) {
    return "Good documentation, but some processes could be better defined.";
  } else if (score > 0.4) {
    return "Moderate documentation, consider expanding SOP coverage.";
  } else if (score > 0.2) {
    return "Limited documentation, many processes lack SOPs.";
  } else {
    return "Very limited documentation, creating dependency on tribal knowledge.";
  }
}

/**
 * Provides a text explanation of the automation score
 */
export function getAutomationScoreDescription(score: number): string {
  if (score >= 90) {
    return "Excellent - Your business has achieved high levels of automation across all areas";
  } else if (score >= 75) {
    return "Very Good - Most business processes are automated with good integration between systems";
  } else if (score >= 60) {
    return "Good - Many key processes are automated, but there's room for better integration";
  } else if (score >= 40) {
    return "Fair - Basic automation is in place, but many processes remain manual";
  } else if (score >= 20) {
    return "Basic - Initial steps toward automation have been taken";
  } else {
    return "Limited - Few automation tools are in use, significant opportunity for improvement";
  }
}

/**
 * Generates recommendations based on automation score analysis
 */
export function generateAutomationRecommendations(
  categoryTools: Record<number, { count: number, name?: string }>,
  integratedToolPairs: number,
  toolsByTier: Record<string, number>,
  sopCount: number,
  totalCategories: number,
  totalTools: number,
  categoryMap?: Record<number, string>
): Array<{ 
  title: string, 
  description: string, 
  type: string, 
  priority: 'high' | 'medium' | 'low',
  potentialImpact: 'high' | 'medium' | 'low',
  timeToImplement: 'quick' | 'medium' | 'extended',
  actionItems: string[]
}> {
  const recommendations = [];
  
  // Check for categories without tools
  const categoriesWithTools = Object.keys(categoryTools).length;
  const categoriesWithoutTools = totalCategories - categoriesWithTools;
  
  if (categoriesWithTools < totalCategories) {
    // Try to identify which categories are missing
    let missingCategoriesText = "";
    if (categoryMap) {
      const missingCategories = Object.keys(categoryMap)
        .map(id => parseInt(id))
        .filter(id => !categoryTools[id])
        .map(id => categoryMap[id])
        .slice(0, 3);
      
      if (missingCategories.length > 0) {
        missingCategoriesText = `Specifically in: ${missingCategories.join(', ')}${missingCategories.length < categoriesWithoutTools ? ' and others' : ''}.`;
      }
    }
    
    recommendations.push({
      title: "Expand Your Automation Coverage",
      description: `${categoriesWithoutTools} out of ${totalCategories} business categories have no automation tools. ${missingCategoriesText} Adding tools to these areas could significantly improve efficiency.`,
      type: "coverage",
      priority: categoriesWithoutTools > totalCategories / 2 ? 'high' : 'medium',
      potentialImpact: 'high',
      timeToImplement: 'medium',
      actionItems: [
        "Identify which business categories lack automation tools",
        "Research entry-level tools for those categories",
        "Prioritize implementation based on potential time savings",
        "Start with a free trial or low-cost option before committing"
      ]
    });
  }
  
  // Check for integration opportunities
  const maxPossibleIntegrations = totalTools > 1 ? (totalTools * (totalTools - 1)) / 2 : 0;
  const integrationPercentage = maxPossibleIntegrations > 0 ? 
    (integratedToolPairs / maxPossibleIntegrations) : 0;
    
  if (integrationPercentage < 0.5 && totalTools > 3) {
    const missingIntegrations = maxPossibleIntegrations - integratedToolPairs;
    
    recommendations.push({
      title: "Improve Tool Integration",
      description: `You're only utilizing ${Math.round(integrationPercentage * 100)}% of possible integrations between your tools (${integratedToolPairs} out of ${maxPossibleIntegrations} possible connections). Connecting your systems could eliminate data silos and reduce manual data transfer.`,
      type: "integration",
      priority: integrationPercentage < 0.3 ? 'high' : 'medium',
      potentialImpact: 'high',
      timeToImplement: 'medium',
      actionItems: [
        "Map out data flows between your current business systems",
        "Identify where manual data transfer is happening",
        "Look for native integrations between your existing tools",
        "Consider middleware like Zapier or Make.com for custom integrations",
        "Prioritize connecting your most-used tools first"
      ]
    });
  }
  
  // Check for SOP coverage
  const targetSopsPerCategory = 3;
  const sopCoverage = sopCount / (totalCategories * targetSopsPerCategory);
  
  if (sopCoverage < 0.5) {
    const recommendedNewSopCount = Math.ceil((totalCategories * targetSopsPerCategory * 0.7) - sopCount);
    
    recommendations.push({
      title: "Document More Business Processes",
      description: `You have ${sopCount} SOPs documented out of an ideal ${totalCategories * targetSopsPerCategory}. Adding approximately ${recommendedNewSopCount} more SOPs would significantly improve your process documentation and enable better automation.`,
      type: "documentation",
      priority: sopCount < totalCategories ? 'high' : 'medium',
      potentialImpact: 'medium',
      timeToImplement: 'quick',
      actionItems: [
        "Identify the most frequently performed processes that lack documentation",
        "Create SOPs for repetitive tasks that could eventually be automated",
        "Start with simple checklists that can be expanded later",
        "Document processes that are currently dependent on specific team members",
        "Use our built-in AI SOP generator to speed up the documentation process"
      ]
    });
  }
  
  // Check tool sophistication
  const freeTierPercentage = (toolsByTier['free'] || 0) / totalTools;
  const enterpriseTierPercentage = (toolsByTier['enterprise'] || 0) / totalTools;
  
  if (freeTierPercentage > 0.7 && totalTools > 3) {
    recommendations.push({
      title: "Upgrade Critical Business Tools",
      description: `${Math.round(freeTierPercentage * 100)}% of your tools are basic (free tier) which may limit your automation capabilities. Identifying 2-3 critical business functions to upgrade could provide significant efficiency gains.`,
      type: "sophistication",
      priority: freeTierPercentage > 0.9 ? 'high' : 'medium',
      potentialImpact: 'high',
      timeToImplement: 'extended',
      actionItems: [
        "Identify which core business functions would benefit most from advanced tools",
        "Calculate potential ROI for upgrading key tools from free to paid tiers",
        "Start with one critical upgrade rather than multiple at once",
        "Consider mid-tier options before committing to enterprise solutions",
        "Schedule demos with sales teams to understand advanced automation features"
      ]
    });
  }
  
  // Recommendation for achieving balance
  if (enterpriseTierPercentage > 0.7 && totalTools > 5) {
    recommendations.push({
      title: "Optimize Tool Cost-Effectiveness",
      description: `${Math.round(enterpriseTierPercentage * 100)}% of your tools are enterprise-tier, which may represent unnecessary costs. Consider if some enterprise tools could be replaced with more cost-effective alternatives.`,
      type: "optimization",
      priority: 'medium',
      potentialImpact: 'medium',
      timeToImplement: 'extended',
      actionItems: [
        "Audit which enterprise features you're actually using in each tool",
        "Identify enterprise tools where you're using less than 50% of features",
        "Research mid-tier alternatives for underutilized enterprise tools",
        "Calculate potential savings from right-sizing your tool stack",
        "Consider consolidating functionalities into fewer tools"
      ]
    });
  }
  
  // Data utilization recommendation
  if (totalTools > 5 && integrationPercentage < 0.4) {
    recommendations.push({
      title: "Improve Data Utilization",
      description: "You have several tools but limited integration, which suggests data silos. Connecting your data across tools could unlock valuable business insights and automation opportunities.",
      type: "data",
      priority: 'medium',
      potentialImpact: 'high',
      timeToImplement: 'medium',
      actionItems: [
        "Map out what key business data exists in each of your tools",
        "Identify where the same data is being maintained in multiple systems",
        "Set up regular data exports/imports between critical systems",
        "Consider implementing a central dashboard that pulls data from multiple tools",
        "Evaluate whether a data warehouse would benefit your business"
      ]
    });
  }
  
  return recommendations;
}