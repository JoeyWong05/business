export interface ModuleAutomationScore {
  moduleId: string;
  moduleName: string;
  score: number;
  color: string;
  automatedProcessCount: number;
  manualProcessCount: number;
  totalProcesses: number;
  recommendations: AutomationRecommendation[];
}

export interface AutomationRecommendation {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'complex';
  impactScore: number; // 1-10 scale
  timeToImplement: string; // e.g., "2-4 hours"
  toolsRequired?: string[];
  costEstimate?: string;
  implemented: boolean;
  inProgress: boolean;
}

export interface ToolIntegration {
  sourceToolId: string;
  sourceToolName: string;
  targetToolId: string;
  targetToolName: string;
  integrationStatus: 'active' | 'inactive' | 'partial';
  dataFlow: 'one-way' | 'bi-directional';
}

export interface AutomationTool {
  id: string;
  name: string;
  moduleId: string;
  moduleName: string;
  category: string;
  automationTier: 'basic' | 'intermediate' | 'advanced';
  integratedWith: string[]; // Array of tool IDs this tool integrates with
  processesAutomated: string[];
  implementationStatus: 'planned' | 'in-progress' | 'implemented';
}

export interface AutomationScoreDetails {
  overallScore: number;
  moduleScores: ModuleAutomationScore[];
  toolsCoverageScore: number;
  toolsIntegrationScore: number;
  automationSophisticationScore: number;
  processDocumentationScore: number;
  integrationMap: ToolIntegration[];
  automationTools: AutomationTool[];
  recommendations: AutomationRecommendation[];
}