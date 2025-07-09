import { Router } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertSubcategorySchema, insertToolSchema, insertTechStackSchema, insertSopSchema, insertActivitySchema, insertRecommendationSchema, insertPasswordVaultSchema, VaultItemType } from "@shared/schema";
import { 
  generateSOP, 
  generateRecommendations, 
  generateCalendarSOP, 
  analyzeSocialMediaMetrics,
  generateSocialMediaContent,
  generateBusinessInsights,
  generateWorkflowSuggestions,
  optimizeMarketingCampaigns,
  // Agency Killer functions
  generateText,
  generateJSONContent,
  generateMarketingCopy,
  generateSEOAudit,
  generateSEOKeywords,
  generateAdCampaign,
  generateMarketingFunnel,
  simulatePerformanceMetrics
} from "./openai";
import { calculateAutomationScore, getAutomationScoreDescription, generateAutomationRecommendations } from "@shared/automationScore";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = Router();
  
  // Business Entity routes
  apiRouter.get("/business-entities", async (req, res) => {
    try {
      const parentEntityId = req.query.parentEntityId ? parseInt(req.query.parentEntityId as string) : undefined;
      const entities = await storage.getBusinessEntities(parentEntityId);
      res.json({ entities });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business entities" });
    }
  });
  
  apiRouter.get("/business-entities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entity = await storage.getBusinessEntityById(id);
      if (!entity) {
        return res.status(404).json({ message: "Business entity not found" });
      }
      res.json({ entity });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business entity" });
    }
  });
  
  // Category routes
  apiRouter.get("/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  apiRouter.get("/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ category });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Subcategory routes
  apiRouter.get("/subcategories", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const subcategories = await storage.getSubcategories(categoryId);
      res.json({ subcategories });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  });

  apiRouter.get("/categories/:slug/subcategories", async (req, res) => {
    try {
      const subcategories = await storage.getSubcategoriesByCategorySlug(req.params.slug);
      res.json({ subcategories });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  });

  // Pricing tier routes
  apiRouter.get("/pricing-tiers", async (req, res) => {
    try {
      const tiers = await storage.getPricingTiers();
      res.json({ tiers });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pricing tiers" });
    }
  });

  // Tool routes
  apiRouter.get("/tools", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const tierSlug = req.query.tierSlug as string | undefined;
      const tools = await storage.getTools(categoryId, tierSlug);
      res.json({ tools });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tools" });
    }
  });

  apiRouter.get("/tools/:id", async (req, res) => {
    try {
      const tool = await storage.getToolById(parseInt(req.params.id));
      if (!tool) {
        return res.status(404).json({ message: "Tool not found" });
      }
      res.json({ tool });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tool" });
    }
  });

  apiRouter.get("/categories/:slug/tools", async (req, res) => {
    try {
      const tools = await storage.getToolsByCategorySlug(req.params.slug);
      res.json({ tools });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tools" });
    }
  });

  apiRouter.post("/tools", async (req, res) => {
    try {
      const validatedData = insertToolSchema.parse(req.body);
      const tool = await storage.createTool(validatedData);
      res.status(201).json({ tool });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tool data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tool" });
    }
  });

  // Tech stack routes
  apiRouter.get("/tech-stack", async (req, res) => {
    try {
      // Using demo user ID (1) for simplicity
      const userId = 1;
      const businessEntityId = req.query.businessEntityId ? Number(req.query.businessEntityId) : undefined;
      
      const techStack = await storage.getTechStack(userId, businessEntityId);
      
      // Calculate total monthly cost
      const totalMonthlyCost = techStack.reduce((total, item) => {
        return total + (item.monthlyPrice || 0);
      }, 0);
      
      res.json({ techStack, totalMonthlyCost });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tech stack" });
    }
  });

  apiRouter.post("/tech-stack", async (req, res) => {
    try {
      // Using demo user ID (1) for simplicity
      req.body.userId = 1;
      
      const validatedData = insertTechStackSchema.parse(req.body);
      const techStackItem = await storage.addToolToTechStack(validatedData);
      
      // Add activity record
      const tool = await storage.getToolById(validatedData.toolId);
      
      // Add businessEntity name to the activity description if provided
      let description = `Added ${tool?.name || "a tool"} to your tech stack`;
      if (validatedData.businessEntityId) {
        const entity = await storage.getBusinessEntityById(validatedData.businessEntityId);
        if (entity) {
          description = `Added ${tool?.name || "a tool"} to ${entity.name}'s tech stack`;
        }
      }
      
      await storage.createActivity({
        userId: validatedData.userId,
        type: "added_tool",
        description,
        metadata: { 
          toolId: validatedData.toolId,
          businessEntityId: validatedData.businessEntityId
        }
      });
      
      res.status(201).json({ techStackItem });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tech stack data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add tool to tech stack" });
    }
  });

  apiRouter.delete("/tech-stack/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeToolFromTechStack(id);
      if (!success) {
        return res.status(404).json({ message: "Tech stack item not found" });
      }
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove tool from tech stack" });
    }
  });

  // SOP routes
  apiRouter.get("/sops", async (req, res) => {
    try {
      // Using demo user ID (1) for simplicity
      const userId = 1;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const sops = await storage.getSops(userId, categoryId);
      res.json({ sops });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SOPs" });
    }
  });

  apiRouter.get("/sops/:id", async (req, res) => {
    try {
      const sop = await storage.getSopById(parseInt(req.params.id));
      if (!sop) {
        return res.status(404).json({ message: "SOP not found" });
      }
      res.json({ sop });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SOP" });
    }
  });

  apiRouter.post("/sops", async (req, res) => {
    try {
      const validatedData = insertSopSchema.parse(req.body);
      const sop = await storage.createSop(validatedData);
      
      // Add activity record
      await storage.createActivity({
        userId: 1, // Using demo user ID for simplicity
        type: "generated_sop",
        description: `Generated new SOP: ${validatedData.title}`,
        metadata: { sopId: sop.id }
      });
      
      res.status(201).json({ sop });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid SOP data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create SOP" });
    }
  });

  // Generate SOP with AI but don't save it
  apiRouter.post("/sops/generate", async (req, res) => {
    try {
      const { title, categoryId, subcategoryId, businessDescription } = req.body;
      
      if (!title || !categoryId) {
        return res.status(400).json({ message: "Title and category are required" });
      }
      
      // Get category and subcategory names
      const categories = await storage.getCategories();
      const category = categories.find(c => c.id === parseInt(categoryId));
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      let subcategory;
      if (subcategoryId) {
        const subcategories = await storage.getSubcategories(parseInt(categoryId));
        subcategory = subcategories.find(s => s.id === parseInt(subcategoryId));
      }
      
      // Generate SOP with OpenAI
      const generated = await generateSOP(
        title,
        category.name,
        subcategory?.name || "General",
        businessDescription
      );
      
      // Return the generated content but don't save it yet
      res.json({
        content: generated.content,
        steps: generated.steps
      });
    } catch (error) {
      console.error("Error generating SOP:", error);
      res.status(500).json({ message: "Failed to generate SOP" });
    }
  });
  
  // Generate Google Calendar SOP specifically for team collaboration
  apiRouter.post("/sops/calendar", async (req, res) => {
    try {
      const { businessSize, globalTeam, integrationNeeds } = req.body;
      
      // Generate Calendar SOP with OpenAI
      const generated = await generateCalendarSOP(
        businessSize || "Small",
        globalTeam !== false, // Default to true if not specified
        integrationNeeds || []
      );
      
      // Return the generated content
      res.json({
        content: generated.content,
        steps: generated.steps
      });
    } catch (error) {
      console.error("Error generating Calendar SOP:", error);
      res.status(500).json({ message: "Failed to generate Calendar SOP" });
    }
  });
  
  // For backward compatibility
  apiRouter.post("/generate-sop", async (req, res) => {
    try {
      const { title, categoryId, subcategoryId, additionalInfo } = req.body;
      
      if (!title || !categoryId) {
        return res.status(400).json({ message: "Title and category are required" });
      }
      
      // Get category and subcategory names
      const categories = await storage.getCategories();
      const category = categories.find(c => c.id === parseInt(categoryId));
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      let subcategory;
      if (subcategoryId) {
        const subcategories = await storage.getSubcategories(parseInt(categoryId));
        subcategory = subcategories.find(s => s.id === parseInt(subcategoryId));
      }
      
      // Generate SOP with OpenAI
      const generated = await generateSOP(
        title,
        category.name,
        subcategory?.name || "General",
        additionalInfo
      );
      
      // Create SOP in storage
      const sop = await storage.createSop({
        title,
        categoryId: parseInt(categoryId),
        subcategoryId: subcategoryId ? parseInt(subcategoryId) : undefined,
        content: generated.content,
        steps: generated.steps,
        isAiGenerated: true
      });
      
      // Add activity record
      await storage.createActivity({
        userId: 1, // Using demo user ID for simplicity
        type: "generated_sop",
        description: `Generated new SOP: ${title}`,
        metadata: { sopId: sop.id }
      });
      
      res.json({ sop });
    } catch (error) {
      console.error("Error generating SOP:", error);
      res.status(500).json({ message: "Failed to generate SOP" });
    }
  });

  // Activity routes
  apiRouter.get("/activities", async (req, res) => {
    try {
      // Using demo user ID (1) for simplicity
      const userId = 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const activities = await storage.getActivities(userId, limit);
      res.json({ activities });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Recommendation routes
  apiRouter.get("/recommendations", async (req, res) => {
    try {
      // Using demo user ID (1) for simplicity
      const userId = 1;
      const status = req.query.status as string | undefined;
      const recommendations = await storage.getRecommendations(userId, status);
      res.json({ recommendations });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  apiRouter.post("/recommendations/generate", async (req, res) => {
    try {
      const { categoryId, businessSize, budget } = req.body;
      
      if (!categoryId) {
        return res.status(400).json({ message: "Category is required" });
      }
      
      // Get category info
      const categories = await storage.getCategories();
      const category = categories.find(c => c.id === parseInt(categoryId));
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      // Get user's current tools in this category
      const userId = 1; // Using demo user ID for simplicity
      const techStack = await storage.getTechStack(userId);
      const categoryTools = techStack
        .filter(item => item.tool.categoryId === parseInt(categoryId))
        .map(item => item.tool.name);
      
      // Generate recommendations with OpenAI
      const recommendations = await generateRecommendations(
        category.name,
        categoryTools,
        businessSize || "Small business",
        budget || 500
      );
      
      // Save recommendations to storage
      const savedRecommendations = [];
      for (const rec of recommendations) {
        const recommendation = await storage.createRecommendation({
          userId,
          title: rec.title,
          description: rec.description,
          categoryId: parseInt(categoryId),
          type: rec.type,
          status: "pending"
        });
        savedRecommendations.push(recommendation);
      }
      
      res.json({ recommendations: savedRecommendations });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  apiRouter.patch("/recommendations/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "implemented", "dismissed"].includes(status)) {
        return res.status(400).json({ message: "Valid status is required (pending, implemented, or dismissed)" });
      }
      
      const recommendation = await storage.updateRecommendationStatus(id, status);
      if (!recommendation) {
        return res.status(404).json({ message: "Recommendation not found" });
      }
      
      res.json({ recommendation });
    } catch (error) {
      res.status(500).json({ message: "Failed to update recommendation status" });
    }
  });

  // Dashboard statistics
  apiRouter.get("/dashboard-stats", async (req, res) => {
    try {
      // Using demo user ID (1) for simplicity
      const userId = 1;
      
      // Get tech stack
      const techStack = await storage.getTechStack(userId);
      
      // Get SOPs
      const sops = await storage.getSops(userId);
      
      // Get tool count by category
      const toolsByCategory = {};
      const categories = await storage.getCategories();
      
      for (const category of categories) {
        const tools = techStack.filter(item => item.tool.categoryId === category.id);
        const totalCost = tools.reduce((sum, item) => sum + (item.monthlyPrice || 0), 0);
        
        toolsByCategory[category.slug] = {
          count: tools.length,
          cost: totalCost
        };
      }
      
      // Calculate total monthly cost
      const totalMonthlyCost = techStack.reduce((sum, item) => sum + (item.monthlyPrice || 0), 0);
      
      // Get tools by tier for automation sophistication calculation
      const toolsByTier = {};
      for (const techStackItem of techStack) {
        const tierSlug = techStackItem.tool.tierSlug;
        toolsByTier[tierSlug] = (toolsByTier[tierSlug] || 0) + 1;
      }
      
      // Create category tools map for automation score calculation
      const categoryToolsMap = {};
      for (const category of categories) {
        const toolsInCategory = techStack.filter(item => item.tool.categoryId === category.id);
        if (toolsInCategory.length > 0) {
          categoryToolsMap[category.id] = { count: toolsInCategory.length };
        }
      }
      
      // Calculate average SOP steps
      const averageSopSteps = sops.length > 0 
        ? sops.reduce((sum, sop) => sum + (sop.steps?.length || 0), 0) / sops.length 
        : 0;
      
      // Estimate integration between tools (in reality would be stored in DB)
      // This is a simplification - in a real system we'd track actual integrations
      const integratedToolPairs = Math.floor(techStack.length * 0.3); // Assume 30% of possible integrations
      
      // Calculate automation score using the comprehensive formula
      const automationScore = calculateAutomationScore(
        categoryToolsMap,
        integratedToolPairs,
        toolsByTier,
        sops.length,
        averageSopSteps,
        categories.length,
        techStack.length
      );
      
      // Get automation score description
      const automationScoreDescription = getAutomationScoreDescription(automationScore);
      
      // Generate improvement recommendations
      const automationRecommendations = generateAutomationRecommendations(
        categoryToolsMap,
        integratedToolPairs,
        toolsByTier,
        sops.length,
        categories.length,
        techStack.length
      );
      
      res.json({
        stats: {
          totalTools: techStack.length,
          totalMonthlyCost,
          totalSops: sops.length,
          automationScore,
          automationScoreDescription
        },
        toolsByCategory,
        automationRecommendations
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  // Business Entities routes
  apiRouter.get("/business-entities", async (req, res) => {
    try {
      const entities = await storage.getBusinessEntities();
      res.json({ entities });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business entities" });
    }
  });
  
  // Department Automation routes
  apiRouter.get("/department-automation", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      const tools = await storage.getTools();
      
      // Generate automation data for each department (category)
      const departmentData = categories.map(category => {
        // Get tools for this category
        const deptTools = tools.filter(tool => tool.categoryId === category.id);
        
        // Generate processes for the department (in a real app, this would come from the database)
        const processCount = Math.floor(Math.random() * 5) + 3; // Random 3-7 processes
        const processes = Array(processCount).fill(0).map((_, i) => {
          const handlerTypes = ['ai', 'team', 'hybrid'] as const;
          const handledBy = handlerTypes[Math.floor(Math.random() * handlerTypes.length)];
          const automationLevel = Math.floor(Math.random() * 100) + 1; // Random 1-100%
          
          return {
            id: `${category.slug}-process-${i}`,
            name: getRandomProcessName(category.slug, i),
            handledBy,
            automationLevel,
            description: `This is a ${handledBy === 'ai' ? 'fully automated' : handledBy === 'hybrid' ? 'partially automated' : 'manual'} process for the ${category.name} department.`
          };
        });
        
        // Calculate overall automation score based on tools and processes
        const hasAdvancedTools = deptTools.some(tool => 
          tool.tierSlug === 'professional' || tool.tierSlug === 'enterprise'
        );
        
        // Calculate scores
        const aiProcessesCount = processes.filter(p => p.handledBy === 'ai').length;
        const automationBaseScore = Math.floor((aiProcessesCount / processes.length) * 100);
        const toolBonus = Math.min(deptTools.length * 5, 20); // Max 20% bonus from tools
        const advancedToolBonus = hasAdvancedTools ? 10 : 0;
        
        const automationScore = Math.min(
          Math.floor(automationBaseScore + toolBonus + advancedToolBonus),
          95
        ); // Cap at 95%
        
        // Team size and time saved calculations
        const teamSize = Math.floor(Math.random() * 5) + 1; // Random 1-5
        const baseHoursSaved = aiProcessesCount * 10; // Each AI process saves about 10 hours
        const hybridProcessSavings = processes.filter(p => p.handledBy === 'hybrid').length * 5;
        const monthlyTimeSaved = baseHoursSaved + hybridProcessSavings;
        
        return {
          ...category,
          overallAutomationScore: automationScore,
          teamSize,
          monthlyTimeSaved,
          processes
        };
      });
      
      res.json({ departments: departmentData });
    } catch (error) {
      console.error("Error getting department automation data:", error);
      res.status(500).json({ message: "Failed to get department automation data" });
    }
  });
  
  // Helper function to get random process names based on department
  function getRandomProcessName(deptSlug: string, index: number): string {
    const processesByDept: Record<string, string[]> = {
      'finance': [
        'Invoice Processing', 'Budget Allocation', 'Financial Reporting', 
        'Expense Approval', 'Tax Calculation', 'Investment Analysis'
      ],
      'operations': [
        'Inventory Management', 'Resource Scheduling', 'Quality Control',
        'Supply Chain Oversight', 'Logistics Planning', 'Production Monitoring'
      ],
      'marketing': [
        'Campaign Scheduling', 'Content Creation', 'Analytics Review',
        'Ad Placement', 'Social Media Management', 'SEO Optimization'
      ],
      'sales': [
        'Lead Qualification', 'Proposal Generation', 'CRM Updates',
        'Sales Forecasting', 'Client Outreach', 'Deal Negotiation'
      ],
      'customer-experience': [
        'Support Ticket Processing', 'Feedback Collection', 'Satisfaction Surveys',
        'Return Processing', 'Onboarding', 'Loyalty Program Management'
      ]
    };
    
    // Get process list for this department, or use a generic list
    const processList = processesByDept[deptSlug] || [
      'Documentation', 'Data Entry', 'Review Process', 
      'Approval Workflow', 'Tracking', 'Reporting'
    ];
    
    // Pick a process name based on the index, or randomly if index exceeds list length
    return processList[index % processList.length];
  }
  
  // Mock data for Gorgias customer service tickets
  apiRouter.get("/tickets", async (req, res) => {
    try {
      const mockTickets = [
        {
          id: "ticket-1",
          subject: "Unable to access my account",
          status: "open",
          priority: "high",
          channel: "email",
          createdAt: new Date(new Date().getTime() - 5 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(new Date().getTime() - 2 * 60 * 60 * 1000).toISOString(),
          customer: {
            id: "customer-1",
            name: "Sarah Johnson",
            email: "sarah.johnson@example.com",
            phone: "+1 (555) 123-4567",
            avatar: null,
            tags: ["VIP", "Repeat Customer"],
            orders: 7,
            totalSpent: 1250.75,
            lastOrder: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            firstOrder: new Date(new Date().getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(),
            location: {
              city: "Austin",
              state: "TX",
              country: "USA"
            },
            marketingConsent: true,
            entityId: 3,
            entityName: "Lone Star Custom Clothing"
          },
          assignedTo: {
            id: "agent-1",
            name: "Alex Rodriguez",
            avatar: null,
            email: "alex.r@company.com"
          },
          messages: [
            {
              id: "msg-1",
              body: "Hi, I'm having trouble logging into my account. I've tried resetting my password multiple times but I'm not receiving any emails.",
              createdAt: new Date(new Date().getTime() - 5 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Sarah Johnson",
                email: "sarah.johnson@example.com",
                type: "customer"
              }
            },
            {
              id: "msg-2",
              body: "Hello Sarah, I'm sorry to hear about your login issues. Let me look into this for you. Can you verify the email address you're using to log in?",
              createdAt: new Date(new Date().getTime() - 4.5 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Alex Rodriguez",
                email: "alex.r@company.com",
                type: "agent"
              }
            },
            {
              id: "msg-3",
              body: "I'm using sarah.johnson@example.com, which is the same email I'm writing from now.",
              createdAt: new Date(new Date().getTime() - 4 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Sarah Johnson",
                email: "sarah.johnson@example.com",
                type: "customer"
              }
            },
            {
              id: "msg-4",
              body: "Thanks for confirming. I can see that there might be an issue with our email delivery system. I've manually triggered a password reset link and you should receive it shortly. If you don't receive it in the next 10 minutes, please let me know and we'll try an alternative method.",
              createdAt: new Date(new Date().getTime() - 3.5 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Alex Rodriguez",
                email: "alex.r@company.com",
                type: "agent"
              }
            },
            {
              id: "msg-5",
              body: "I still haven't received any email. Can we try something else?",
              createdAt: new Date(new Date().getTime() - 2 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Sarah Johnson",
                email: "sarah.johnson@example.com",
                type: "customer"
              }
            }
          ],
          tags: ["account", "login", "password-reset"],
          entityId: 3,
          entityName: "Lone Star Custom Clothing"
        },
        {
          id: "ticket-2",
          subject: "Product customization question",
          status: "pending",
          priority: "medium",
          channel: "chat",
          createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(new Date().getTime() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
          customer: {
            id: "customer-2",
            name: "Michael Chen",
            email: "mchen@example.com",
            phone: "+1 (555) 987-6543",
            avatar: null,
            tags: ["New Customer"],
            orders: 1,
            totalSpent: 349.99,
            lastOrder: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            firstOrder: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            location: {
              city: "San Francisco",
              state: "CA",
              country: "USA"
            },
            marketingConsent: true,
            entityId: 1,
            entityName: "Digital Merch Pros"
          },
          assignedTo: {
            id: "agent-2",
            name: "Jasmine Williams",
            avatar: null,
            email: "jasmine.w@company.com"
          },
          messages: [
            {
              id: "msg-6",
              body: "I'm interested in ordering custom t-shirts for my company event. Can I add our logo to the front and text to the back?",
              createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Michael Chen",
                email: "mchen@example.com",
                type: "customer"
              }
            },
            {
              id: "msg-7",
              body: "Hello Michael! Yes, absolutely. We offer full customization for both the front and back of our shirts. Would you be able to share your logo file with us? We accept .PNG, .JPG, .AI, and .EPS formats.",
              createdAt: new Date(new Date().getTime() - 1.9 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Jasmine Williams",
                email: "jasmine.w@company.com",
                type: "agent"
              }
            },
            {
              id: "msg-8",
              body: "Great! Here's our logo. We'd like it on the front left chest area, and our company slogan 'Innovation Forward' on the back in large text.",
              createdAt: new Date(new Date().getTime() - 1.8 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Michael Chen",
                email: "mchen@example.com",
                type: "customer"
              },
              attachments: [
                {
                  filename: "company_logo.png",
                  url: "https://example.com/files/company_logo.png",
                  contentType: "image/png",
                  size: 256000
                }
              ]
            },
            {
              id: "msg-9",
              body: "Thank you for providing your logo. I've forwarded it to our design team. They'll create a mock-up for your approval before we proceed with the order. Approximately how many shirts would you need and for what date?",
              createdAt: new Date(new Date().getTime() - 1.7 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Jasmine Williams",
                email: "jasmine.w@company.com",
                type: "agent"
              }
            },
            {
              id: "msg-10",
              body: "We need about 50 shirts in various sizes. The event is on the 15th of next month, so we would need them at least a week before.",
              createdAt: new Date(new Date().getTime() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Michael Chen",
                email: "mchen@example.com",
                type: "customer"
              }
            }
          ],
          tags: ["customization", "bulk-order", "design"],
          entityId: 1,
          entityName: "Digital Merch Pros"
        },
        {
          id: "ticket-3",
          subject: "Order status inquiry #ORD-23456",
          status: "solved",
          priority: "medium",
          channel: "website",
          createdAt: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(new Date().getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          customer: {
            id: "customer-3",
            name: "Emily Rodriguez",
            email: "emily.r@example.com",
            avatar: null,
            tags: ["Wholesale"],
            orders: 3,
            totalSpent: 2750.50,
            lastOrder: new Date(new Date().getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            firstOrder: new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            entityId: 4,
            entityName: "Alcoeaze"
          },
          assignedTo: {
            id: "agent-3",
            name: "Thomas Johnson",
            avatar: null,
            email: "thomas.j@company.com"
          },
          messages: [
            {
              id: "msg-11",
              body: "I placed an order (ORD-23456) last week and I still haven't received any shipping confirmation. Can you please check the status?",
              createdAt: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Emily Rodriguez",
                email: "emily.r@example.com",
                type: "customer"
              }
            },
            {
              id: "msg-12",
              body: "Hello Emily, thank you for your message. I apologize for the delay. Let me check the status of your order right away.",
              createdAt: new Date(new Date().getTime() - 9.9 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Thomas Johnson",
                email: "thomas.j@company.com",
                type: "agent"
              }
            },
            {
              id: "msg-13",
              body: "I've checked your order and it looks like it was shipped yesterday! You should have received an email confirmation, but it might have gone to your spam folder. Your tracking number is USP12345678 and the package is expected to be delivered within 3-5 business days.",
              createdAt: new Date(new Date().getTime() - 9.8 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Thomas Johnson",
                email: "thomas.j@company.com",
                type: "agent"
              }
            },
            {
              id: "msg-14",
              body: "Thank you for checking! I found the email in my spam folder. I appreciate your quick response.",
              createdAt: new Date(new Date().getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Emily Rodriguez",
                email: "emily.r@example.com",
                type: "customer"
              }
            }
          ],
          tags: ["shipping", "order-status"],
          entityId: 4,
          entityName: "Alcoeaze"
        },
        {
          id: "ticket-4",
          subject: "Request for product return",
          status: "open",
          priority: "urgent",
          channel: "whatsapp",
          createdAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(new Date().getTime() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
          customer: {
            id: "customer-4",
            name: "James Wilson",
            email: "james.wilson@example.com",
            phone: "+1 (555) 456-7890",
            avatar: null,
            orders: 2,
            totalSpent: 189.98,
            lastOrder: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            location: {
              city: "Houston",
              state: "TX",
              country: "USA"
            },
            entityId: 4,
            entityName: "Alcoeaze"
          },
          messages: [
            {
              id: "msg-15",
              body: "I received the wrong item in my order #ORD-34567. I ordered the Pro Series water bottle but received the Standard Series instead. I'd like to return it for the correct item.",
              createdAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "James Wilson",
                email: "james.wilson@example.com",
                type: "customer"
              }
            },
            {
              id: "msg-16",
              body: "I apologize for the mix-up with your order. We'll make this right for you. I can arrange for a return shipping label to be sent to your email, and we'll ship out the correct item as soon as we receive the return. Would that work for you?",
              createdAt: new Date(new Date().getTime() - 0.9 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "System",
                email: "system@company.com",
                type: "system"
              }
            },
            {
              id: "msg-17",
              body: "Yes, that works. But I need the correct item as soon as possible. Is there any way you can ship it before receiving the return?",
              createdAt: new Date(new Date().getTime() - 0.8 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "James Wilson",
                email: "james.wilson@example.com",
                type: "customer"
              }
            },
            {
              id: "msg-18",
              body: "I understand you need this quickly. Let me check with my manager to see if we can make an exception and ship the replacement right away.",
              createdAt: new Date(new Date().getTime() - 0.7 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "System",
                email: "system@company.com",
                type: "system"
              }
            },
            {
              id: "msg-19",
              body: "Thank you, I really appreciate it.",
              createdAt: new Date(new Date().getTime() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "James Wilson",
                email: "james.wilson@example.com",
                type: "customer"
              }
            }
          ],
          tags: ["return", "wrong-item", "urgent"],
          entityId: 4,
          entityName: "Alcoeaze"
        },
        {
          id: "ticket-5",
          subject: "Pricing question for bulk order",
          status: "pending",
          priority: "low",
          channel: "phone",
          createdAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(new Date().getTime() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
          customer: {
            id: "customer-5",
            name: "Robert Johnson",
            email: "robert.j@example.com",
            phone: "+1 (555) 234-5678",
            avatar: null,
            tags: ["Potential Wholesale"],
            entityId: 2,
            entityName: "Mystery Hype"
          },
          assignedTo: {
            id: "agent-4",
            name: "Lisa Thompson",
            avatar: null,
            email: "lisa.t@company.com"
          },
          messages: [
            {
              id: "msg-20",
              body: "Customer called to inquire about bulk pricing for promotional items. They're interested in ordering 200 custom printed phone cases for a corporate event.",
              createdAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Lisa Thompson",
                email: "lisa.t@company.com",
                type: "agent"
              }
            },
            {
              id: "msg-21",
              body: "Provided initial quote of $12.50 per unit for orders over 150 units. Customer requested a formal quote via email with all customization options listed.",
              createdAt: new Date(new Date().getTime() - 2.9 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Lisa Thompson",
                email: "lisa.t@company.com",
                type: "agent"
              }
            },
            {
              id: "msg-22",
              body: "Follow-up email sent with detailed quote and customization options.",
              createdAt: new Date(new Date().getTime() - 2.8 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Lisa Thompson",
                email: "lisa.t@company.com",
                type: "agent"
              },
              attachments: [
                {
                  filename: "bulk_order_quote_robert_j.pdf",
                  url: "https://example.com/files/bulk_order_quote_robert_j.pdf",
                  contentType: "application/pdf",
                  size: 512000
                }
              ]
            },
            {
              id: "msg-23",
              body: "Customer replied requesting samples before placing bulk order. Confirmed they would cover sample costs.",
              createdAt: new Date(new Date().getTime() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
              from: {
                name: "Lisa Thompson",
                email: "lisa.t@company.com",
                type: "agent"
              }
            }
          ],
          tags: ["wholesale", "quote", "bulk-order"],
          entityId: 2,
          entityName: "Mystery Hype"
        }
      ];
      
      res.json({ tickets: mockTickets });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  // Mock data for social media dashboard
  apiRouter.get("/social-dashboard", (req, res) => {
    try {
      const mockSocialMediaData = {
        entities: [
          { id: 1, name: "Digital Merch Pros", type: "agency", slug: "digital-merch-pros" },
          { id: 2, name: "Mystery Hype", type: "ecommerce", slug: "mystery-hype" },
          { id: 3, name: "Lone Star Custom Clothing", type: "physical", slug: "lone-star-custom" },
          { id: 4, name: "Alcoeaze", type: "products", slug: "alcoeaze" }
        ],
        posts: [
          {
            id: "post-1",
            platform: "instagram",
            content: "Check out our new summer collection! Perfect for those hot Texas days. #SummerFashion #TexasStyle",
            mediaUrls: ["https://example.com/images/summer-collection.jpg"],
            contentType: "image",
            status: "published",
            publishedAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            stats: {
              likes: 245,
              comments: 37,
              shares: 18,
              views: 1820,
            },
            tags: ["product", "collection", "summer"],
            url: "https://instagram.com/p/example1",
            createdAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            entityId: 3,
            entityName: "Lone Star Custom Clothing"
          },
          {
            id: "post-2",
            platform: "facebook",
            content: "We're excited to announce our new web design service for small businesses! Get in touch for a free consultation. #WebDesign #DigitalMarketing",
            contentType: "text",
            status: "published",
            publishedAt: new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            stats: {
              likes: 78,
              comments: 23,
              shares: 15,
              views: 1250,
              clicks: 45
            },
            tags: ["service", "web-design", "announcement"],
            url: "https://facebook.com/posts/example2",
            createdAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            entityId: 1,
            entityName: "Digital Merch Pros"
          },
          {
            id: "post-3",
            platform: "twitter",
            content: "New mystery box drop coming this Friday! Limited quantities, exclusive items. Sign up for early access. #MysteryBox #ExclusiveDrop",
            contentType: "text",
            status: "published",
            publishedAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            stats: {
              likes: 189,
              comments: 42,
              shares: 67,
              views: 2340
            },
            tags: ["product", "launch", "exclusive"],
            url: "https://twitter.com/posts/example3",
            createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            entityId: 2,
            entityName: "Mystery Hype"
          },
          {
            id: "post-4",
            platform: "instagram",
            content: "Introducing our new alcohol-free refreshing beverage line - Alcoeaze Refresh! Perfect for hot summer days. #AlcoholFree #Refreshing",
            mediaUrls: ["https://example.com/images/alcoeaze-refresh.jpg"],
            contentType: "image",
            status: "published",
            publishedAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            stats: {
              likes: 312,
              comments: 45,
              shares: 28,
              views: 2100
            },
            tags: ["product", "launch", "beverage"],
            url: "https://instagram.com/p/example4",
            createdAt: new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            entityId: 4,
            entityName: "Alcoeaze"
          },
          {
            id: "post-5",
            platform: "linkedin",
            content: "Excited to announce our partnership with @TechInnovators to bring cutting-edge digital marketing solutions to our clients! #Partnership #DigitalMarketing",
            contentType: "text",
            status: "scheduled",
            scheduledFor: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            tags: ["partnership", "announcement", "digital-marketing"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            entityId: 1,
            entityName: "Digital Merch Pros"
          }
        ],
        analytics: {
          timeRange: "30d",
          accounts: [
            {
              id: "account-1",
              platform: "instagram",
              name: "Lone Star Clothing",
              handle: "@lonestarclothing",
              profileUrl: "https://instagram.com/lonestarclothing",
              profileImageUrl: "https://example.com/profiles/lonestar.jpg",
              followers: 5240,
              followersGrowth: 120,
              engagement: 3.8,
              impressions: 28500,
              reach: 15700
            },
            {
              id: "account-2",
              platform: "facebook",
              name: "Digital Merch Pros",
              handle: "Digital Merch Pros",
              profileUrl: "https://facebook.com/digitalmerchpros",
              profileImageUrl: "https://example.com/profiles/dmp.jpg",
              followers: 3750,
              followersGrowth: 85,
              engagement: 2.5,
              impressions: 22000,
              reach: 12000,
              clicks: 450
            },
            {
              id: "account-3",
              platform: "twitter",
              name: "Mystery Hype",
              handle: "@mysteryhype",
              profileUrl: "https://twitter.com/mysteryhype",
              profileImageUrl: "https://example.com/profiles/mysteryhype.jpg",
              followers: 8900,
              followersGrowth: 230,
              engagement: 4.2,
              impressions: 45000,
              reach: 28000
            },
            {
              id: "account-4",
              platform: "instagram",
              name: "Alcoeaze",
              handle: "@alcoeaze",
              profileUrl: "https://instagram.com/alcoeaze",
              profileImageUrl: "https://example.com/profiles/alcoeaze.jpg",
              followers: 7200,
              followersGrowth: 180,
              engagement: 3.5,
              impressions: 38000,
              reach: 22000
            }
          ],
          topPosts: [
            {
              id: "post-4",
              platform: "instagram",
              content: "Introducing our new alcohol-free refreshing beverage line - Alcoeaze Refresh! Perfect for hot summer days. #AlcoholFree #Refreshing",
              mediaUrls: ["https://example.com/images/alcoeaze-refresh.jpg"],
              contentType: "image",
              status: "published",
              publishedAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              stats: {
                likes: 312,
                comments: 45,
                shares: 28,
                views: 2100
              },
              entityId: 4,
              entityName: "Alcoeaze"
            },
            {
              id: "post-1",
              platform: "instagram",
              content: "Check out our new summer collection! Perfect for those hot Texas days. #SummerFashion #TexasStyle",
              mediaUrls: ["https://example.com/images/summer-collection.jpg"],
              contentType: "image",
              status: "published",
              publishedAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              stats: {
                likes: 245,
                comments: 37,
                shares: 18,
                views: 1820
              },
              entityId: 3,
              entityName: "Lone Star Custom Clothing"
            },
            {
              id: "post-3",
              platform: "twitter",
              content: "New mystery box drop coming this Friday! Limited quantities, exclusive items. Sign up for early access. #MysteryBox #ExclusiveDrop",
              contentType: "text",
              status: "published",
              publishedAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              stats: {
                likes: 189,
                comments: 42,
                shares: 67,
                views: 2340
              },
              entityId: 2,
              entityName: "Mystery Hype"
            }
          ],
          audienceInsights: {
            demographics: {
              age: {
                "18-24": 15,
                "25-34": 38,
                "35-44": 25,
                "45-54": 15,
                "55+": 7
              },
              gender: {
                "male": 45,
                "female": 53,
                "other": 2
              },
              location: {
                "Texas": 40,
                "California": 15,
                "New York": 10,
                "Florida": 8,
                "Other US": 20,
                "International": 7
              }
            },
            interests: {
              "Fashion": 35,
              "Technology": 28,
              "Food & Drink": 25,
              "Fitness": 20,
              "Travel": 18,
              "Entertainment": 15
            },
            activeHours: {
              "6-9": 5,
              "9-12": 15,
              "12-15": 20,
              "15-18": 25,
              "18-21": 28,
              "21-24": 5,
              "0-3": 1,
              "3-6": 1
            }
          },
          trends: {
            followers: [
              { date: "2024-01-01", total: 20000, "instagram": 10000, "facebook": 6000, "twitter": 4000 },
              { date: "2024-02-01", total: 21500, "instagram": 11000, "facebook": 6200, "twitter": 4300 },
              { date: "2024-03-01", total: 23000, "instagram": 12000, "facebook": 6500, "twitter": 4500 },
              { date: "2024-04-01", total: 24800, "instagram": 13000, "facebook": 6800, "twitter": 5000 },
              { date: "2024-05-01", total: 25090, "instagram": 13200, "facebook": 6890, "twitter": 5000 }
            ],
            engagement: [
              { date: "2024-01-01", total: 3.2, "instagram": 3.5, "facebook": 2.8, "twitter": 3.3 },
              { date: "2024-02-01", total: 3.3, "instagram": 3.6, "facebook": 2.9, "twitter": 3.4 },
              { date: "2024-03-01", total: 3.5, "instagram": 3.8, "facebook": 3.0, "twitter": 3.6 },
              { date: "2024-04-01", total: 3.6, "instagram": 3.9, "facebook": 3.1, "twitter": 3.7 },
              { date: "2024-05-01", total: 3.5, "instagram": 3.8, "facebook": 3.0, "twitter": 3.6 }
            ],
            impressions: [
              { date: "2024-01-01", total: 100000, "instagram": 50000, "facebook": 30000, "twitter": 20000 },
              { date: "2024-02-01", total: 110000, "instagram": 55000, "facebook": 32000, "twitter": 23000 },
              { date: "2024-03-01", total: 125000, "instagram": 62000, "facebook": 36000, "twitter": 27000 },
              { date: "2024-04-01", total: 133500, "instagram": 66000, "facebook": 39000, "twitter": 28500 },
              { date: "2024-05-01", total: 128000, "instagram": 63000, "facebook": 37000, "twitter": 28000 }
            ]
          },
          totals: {
            followers: 25090,
            engagement: 3.5,
            impressions: 128000,
            reach: 77700,
            clicks: 4500,
            engagementRate: 3.5
          }
        }
      };
      
      res.json({ data: mockSocialMediaData });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social media dashboard data" });
    }
  });

  // Social Media Management Routes
  
  // Analyze social media metrics with AI
  apiRouter.post("/social-media/analyze", async (req, res) => {
    try {
      const { platformData, timeRange } = req.body;
      
      if (!platformData || !Array.isArray(platformData) || platformData.length === 0) {
        return res.status(400).json({ message: "Valid platform data is required" });
      }
      
      // Analyze metrics with OpenAI
      const analysis = await analyzeSocialMediaMetrics(
        platformData,
        timeRange || "past 30 days"
      );
      
      // Add activity record
      await storage.createActivity({
        userId: 1, // Using demo user ID for simplicity
        type: "social_media_analysis",
        description: `Analyzed social media performance for ${timeRange || "past 30 days"}`,
        metadata: { 
          platforms: platformData.map(p => p.platform),
          timeRange
        }
      });
      
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing social media metrics:", error);
      res.status(500).json({ message: "Failed to analyze social media metrics" });
    }
  });
  
  // Generate social media content with AI
  apiRouter.post("/social-media/generate-content", async (req, res) => {
    try {
      const { 
        businessType, 
        platform, 
        contentGoals, 
        brand,
        count
      } = req.body;
      
      if (!businessType || !platform || !contentGoals || !brand) {
        return res.status(400).json({ 
          message: "Business type, platform, content goals, and brand information are required" 
        });
      }
      
      if (!brand.name || !brand.voice || !brand.targetAudience || !brand.keyProducts) {
        return res.status(400).json({ 
          message: "Brand information must include name, voice, targetAudience, and keyProducts" 
        });
      }
      
      // Generate content with OpenAI
      const content = await generateSocialMediaContent(
        businessType,
        platform,
        contentGoals,
        brand,
        count || 5
      );
      
      // Add activity record
      await storage.createActivity({
        userId: 1, // Using demo user ID for simplicity
        type: "generated_social_content",
        description: `Generated ${count || 5} social media content ideas for ${platform}`,
        metadata: { 
          platform,
          businessType,
          contentGoals
        }
      });
      
      res.json(content);
    } catch (error) {
      console.error("Error generating social media content:", error);
      res.status(500).json({ message: "Failed to generate social media content" });
    }
  });
  
  // Marketing Campaign Optimization with AI
  apiRouter.post("/marketing/optimize-campaigns", async (req, res) => {
    try {
      const { campaignIds } = req.body;
      
      if (!campaignIds || !Array.isArray(campaignIds) || campaignIds.length === 0) {
        return res.status(400).json({ message: "Please provide at least one campaign ID" });
      }
      
      // Get campaign data based on the provided IDs
      const campaigns = await storage.getAdCampaigns(campaignIds);
      
      if (campaigns.length === 0) {
        return res.status(404).json({ message: "No campaigns found with the provided IDs" });
      }
      
      // Get business entity info for context
      const businessEntity = campaigns[0].entityId 
        ? await storage.getBusinessEntity(campaigns[0].entityId)
        : null;
        
      // Set business goals based on entity or default goals
      const businessGoals = businessEntity?.marketingGoals || [
        "Increase brand awareness",
        "Improve return on ad spend (ROAS)",
        "Grow customer acquisition",
        "Enhance customer engagement"
      ];
      
      // Set budget constraints if available from entity data
      const budgetConstraints = businessEntity?.marketingBudget ? {
        totalBudget: businessEntity.marketingBudget,
        minimumRoas: businessEntity.minimumRoas || 2.0
      } : undefined;
      
      // Generate optimization recommendations
      const optimizationResults = await optimizeMarketingCampaigns(
        campaigns,
        businessGoals,
        budgetConstraints
      );
      
      // Add activity record
      await storage.createActivity({
        userId: 1, // Using demo user ID for simplicity
        type: "optimized_marketing_campaigns",
        description: `Generated AI optimization recommendations for ${campaigns.length} marketing campaigns`,
        metadata: { 
          campaignCount: campaigns.length,
          platforms: [...new Set(campaigns.map(c => c.platform))],
          optimizationCount: optimizationResults.optimizations.length
        }
      });
      
      res.json(optimizationResults);
    } catch (error) {
      console.error("Error optimizing marketing campaigns:", error);
      res.status(500).json({ 
        message: "Failed to generate campaign optimization suggestions",
        error: error.message
      });
    }
  });
  
  // Generate business insights with AI
  apiRouter.post("/business/insights", async (req, res) => {
    try {
      const { data, businessEntity, timeframe } = req.body;
      
      if (!data || !businessEntity) {
        return res.status(400).json({ message: "Business data and entity name are required" });
      }
      
      // Generate insights with OpenAI
      const insights = await generateBusinessInsights(
        data,
        businessEntity,
        timeframe || "last month"
      );
      
      // Add activity record
      await storage.createActivity({
        userId: 1, // Using demo user ID for simplicity
        type: "business_insights",
        description: `Generated business insights for ${businessEntity} (${timeframe || "last month"})`,
        metadata: { 
          businessEntity,
          timeframe,
          dataCategories: Object.keys(data)
        }
      });
      
      res.json(insights);
    } catch (error) {
      console.error("Error generating business insights:", error);
      res.status(500).json({ message: "Failed to generate business insights" });
    }
  });
  
  // Generate workflow automation suggestions based on user behavior
  apiRouter.post("/workflow/suggestions", async (req, res) => {
    try {
      const { userActivities, userRole, existingTools } = req.body;
      
      if (!userActivities || !userActivities.length || !userRole) {
        return res.status(400).json({ 
          message: "Missing required fields: userActivities and userRole are required" 
        });
      }
      
      // Generate workflow suggestions with OpenAI
      const result = await generateWorkflowSuggestions(
        userActivities,
        userRole,
        existingTools || []
      );
      
      // Add activity record for the analysis
      await storage.createActivity({
        userId: 1, // Using demo user ID for simplicity
        type: "workflow_analysis",
        description: `Generated ${result.suggestions.length} workflow automation suggestions for ${userRole}`,
        metadata: { 
          suggestionCount: result.suggestions.length,
          userRole
        }
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error generating workflow suggestions:", error);
      res.status(500).json({ message: "Failed to generate workflow suggestions" });
    }
  });



  // Password Vault routes
  apiRouter.get("/password-vault", async (req, res) => {
    try {
      // Using demo user ID (1) for simplicity
      const userId = 1;
      const businessEntityId = req.query.businessEntityId ? parseInt(req.query.businessEntityId as string) : undefined;
      const type = req.query.type as VaultItemType | undefined;
      const toolId = req.query.toolId ? parseInt(req.query.toolId as string) : undefined;
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
      const favorite = req.query.favorite !== undefined ? req.query.favorite === 'true' : undefined;
      const tags = req.query.tags ? (req.query.tags as string).split(',') : undefined;
      
      const items = await storage.getPasswordVaultItems({
        userId,
        businessEntityId,
        type,
        toolId,
        companyId,
        favorite,
        tags
      });
      
      res.json({ items });
    } catch (error) {
      console.error("Error fetching password vault items:", error);
      res.status(500).json({ message: "Failed to fetch password vault items" });
    }
  });
  
  apiRouter.get("/password-vault/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getPasswordVaultItemById(id);
      if (!item) {
        return res.status(404).json({ message: "Password vault item not found" });
      }
      res.json({ item });
    } catch (error) {
      console.error("Error fetching password vault item:", error);
      res.status(500).json({ message: "Failed to fetch password vault item" });
    }
  });
  
  apiRouter.post("/password-vault", async (req, res) => {
    try {
      // Using demo user ID (1) for simplicity
      req.body.userId = 1;
      
      const validatedData = insertPasswordVaultSchema.parse(req.body);
      const item = await storage.createPasswordVaultItem(validatedData);
      
      // Add activity record
      let description = `Added new ${validatedData.type} to password vault`;
      if (validatedData.name) {
        description = `Added ${validatedData.name} (${validatedData.type}) to password vault`;
      }
      
      await storage.createActivity({
        userId: validatedData.userId,
        type: "added_password",
        description,
        metadata: { 
          type: validatedData.type,
          businessEntityId: validatedData.businessEntityId,
          toolId: validatedData.toolId
        }
      });
      
      res.status(201).json({ item });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid password vault data", errors: error.errors });
      }
      console.error("Error creating password vault item:", error);
      res.status(500).json({ message: "Failed to create password vault item" });
    }
  });
  
  apiRouter.patch("/password-vault/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPasswordVaultSchema.partial().parse(req.body);
      
      const item = await storage.updatePasswordVaultItem(id, validatedData);
      if (!item) {
        return res.status(404).json({ message: "Password vault item not found" });
      }
      
      await storage.createActivity({
        userId: 1, // Using demo user ID for simplicity
        type: "updated_password",
        description: `Updated password vault item: ${item.name || 'Unnamed item'}`,
        metadata: { itemId: id, type: item.type }
      });
      
      res.json({ item });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid password vault data", errors: error.errors });
      }
      console.error("Error updating password vault item:", error);
      res.status(500).json({ message: "Failed to update password vault item" });
    }
  });
  
  apiRouter.delete("/password-vault/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get the item before deleting for the activity log
      const item = await storage.getPasswordVaultItemById(id);
      if (!item) {
        return res.status(404).json({ message: "Password vault item not found" });
      }
      
      const success = await storage.deletePasswordVaultItem(id);
      if (!success) {
        return res.status(404).json({ message: "Password vault item not found" });
      }
      
      await storage.createActivity({
        userId: 1, // Using demo user ID for simplicity
        type: "deleted_password",
        description: `Deleted password vault item: ${item.name || 'Unnamed item'}`,
        metadata: { type: item.type }
      });
      
      res.json({ success });
    } catch (error) {
      console.error("Error deleting password vault item:", error);
      res.status(500).json({ message: "Failed to delete password vault item" });
    }
  });

  // Sales Dashboard Routes
  apiRouter.get("/sales-pipeline", async (req, res) => {
    try {
      const businessEntityId = req.query.entityId ? parseInt(req.query.entityId as string) : undefined;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      // Get business entities for the dashboard
      const entities = await storage.getBusinessEntities();
      
      // Get sales pipeline data from storage
      const pipelineData = await storage.getSalesPipelineData({
        businessEntityId,
        startDate,
        endDate
      });
      
      // Return the complete data for the dashboard
      res.json({
        data: {
          deals: pipelineData.deals,
          entities,
          summary: pipelineData.summary,
          forecast: pipelineData.forecast
        }
      });
    } catch (error) {
      console.error("Error fetching sales pipeline data:", error);
      res.status(500).json({ message: "Failed to fetch sales pipeline data" });
    }
  });

  // Support Metrics API endpoint
  apiRouter.get("/support-metrics", async (req, res) => {
    try {
      const timePeriod = req.query.timePeriod as string || '7days';
      const entityFilter = req.query.entityFilter as string || 'all';
      
      // In a production environment, this would fetch from a database
      // For now, we'll generate meaningful demo data
      
      // Create demo entities
      const entities = await storage.getBusinessEntities();
      
      // Generate agent metrics
      const agentNames = [
        "Sarah Johnson", 
        "Michael Chen", 
        "Jessica Rodriguez", 
        "David Kim", 
        "Emma Thompson"
      ];
      
      const agentMetrics = agentNames.map((name, index) => {
        // Create varied metrics per agent
        const ticketsPerHour = 2 + Math.random() * 2; // Between 2-4
        const avgResponseTime = 10 + Math.random() * 20; // Between 10-30 minutes
        const firstReplyTime = 5 + Math.random() * 15; // Between 5-20 minutes
        const totalTickets = 15 + Math.floor(Math.random() * 25); // Between 15-40
        const resolvedTickets = Math.floor(totalTickets * (0.6 + Math.random() * 0.3)); // Between 60-90% resolved
        const customerSatisfaction = 75 + Math.floor(Math.random() * 20); // Between 75-95%
        
        return {
          id: `agent-${index + 1}`,
          name,
          ticketsPerHour,
          avgResponseTime,
          firstReplyTime,
          resolvedTickets,
          totalTickets,
          customerSatisfaction
        };
      });
      
      // Generate waiting time distribution
      const waitingTimeDistribution = {
        lessThan15Min: 15 + Math.floor(Math.random() * 10),
        lessThan30Min: 10 + Math.floor(Math.random() * 8),
        lessThan1Hour: 8 + Math.floor(Math.random() * 7),
        lessThan4Hours: 6 + Math.floor(Math.random() * 5),
        lessThan24Hours: 4 + Math.floor(Math.random() * 3),
        moreThan24Hours: 2 + Math.floor(Math.random() * 2)
      };
      
      // Generate ticket metrics
      const ticketMetrics = {
        waitingTimeDistribution,
        ticketsByStatus: {
          open: 12 + Math.floor(Math.random() * 8),
          pending: 8 + Math.floor(Math.random() * 6),
          solved: 25 + Math.floor(Math.random() * 15),
          closed: 30 + Math.floor(Math.random() * 20)
        },
        ticketsByPriority: {
          low: 20 + Math.floor(Math.random() * 10),
          medium: 30 + Math.floor(Math.random() * 15),
          high: 15 + Math.floor(Math.random() * 10),
          urgent: 5 + Math.floor(Math.random() * 5)
        },
        ticketsByChannel: {
          email: 25 + Math.floor(Math.random() * 15),
          chat: 20 + Math.floor(Math.random() * 10),
          phone: 10 + Math.floor(Math.random() * 8),
          website: 15 + Math.floor(Math.random() * 10),
          whatsapp: 12 + Math.floor(Math.random() * 8),
          other: 5 + Math.floor(Math.random() * 3)
        },
        timeToResolve: {
          avgTimeToResolve: 4 + Math.random() * 3, // 4-7 hours
          avgFirstResponseTime: 12 + Math.random() * 18 // 12-30 minutes
        }
      };
      
      // Generate entity metrics (if we have business entities in our system)
      const entityMetrics = entities.map((entity, index) => {
        return {
          id: entity.id || index + 1,
          name: entity.name,
          tickets: 30 + Math.floor(Math.random() * 40),
          avgResponseTime: 15 + Math.random() * 15,
          customerSatisfaction: 70 + Math.floor(Math.random() * 25)
        };
      });
      
      // Generate daily metrics for a time series chart
      const dailyMetrics = [];
      // Get the last 14 days
      for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        dailyMetrics.push({
          date: date.toISOString().split('T')[0],
          newTickets: 5 + Math.floor(Math.random() * 10),
          resolvedTickets: 4 + Math.floor(Math.random() * 12),
          avgResponseTime: 10 + Math.random() * 20
        });
      }
      
      // Calculate overall metrics
      const totalTickets = Object.values(ticketMetrics.ticketsByStatus).reduce((a, b) => a + b, 0);
      const openTickets = ticketMetrics.ticketsByStatus.open + ticketMetrics.ticketsByStatus.pending;
      
      const overallMetrics = {
        totalTickets,
        openTickets,
        avgResponseTime: ticketMetrics.timeToResolve.avgFirstResponseTime,
        avgResolutionTime: ticketMetrics.timeToResolve.avgTimeToResolve,
        customerSatisfaction: 82 + Math.floor(Math.random() * 10),
        ticketsPerHour: agentMetrics.reduce((sum, agent) => sum + agent.ticketsPerHour, 0) / agentMetrics.length
      };
      
      res.json({
        data: {
          agentMetrics,
          ticketMetrics,
          entityMetrics,
          dailyMetrics,
          overallMetrics
        }
      });
    } catch (error) {
      console.error("Error generating support metrics:", error);
      res.status(500).json({ message: "Failed to generate support metrics" });
    }
  });
  
  // Company Goals routes
  apiRouter.get("/goals", async (req, res) => {
    const businessEntityId = req.query.businessEntityId ? 
      parseInt(req.query.businessEntityId as string) : undefined;
    const timeframe = req.query.timeframe as string;
    const status = req.query.status as string;
    
    try {
      const goals = await storage.getGoals({
        businessEntityId,
        timeframe,
        status
      });
      res.json({ goals });
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });
  
  apiRouter.get("/goals/:id", async (req, res) => {
    try {
      const goal = await storage.getGoalById(req.params.id);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.json({ goal });
    } catch (error) {
      console.error("Error fetching goal:", error);
      res.status(500).json({ message: "Failed to fetch goal" });
    }
  });
  
  apiRouter.post("/goals", async (req, res) => {
    try {
      const goal = await storage.createGoal(req.body);
      res.status(201).json({ goal });
    } catch (error) {
      console.error("Error creating goal:", error);
      res.status(500).json({ message: "Failed to create goal" });
    }
  });
  
  apiRouter.patch("/goals/:id", async (req, res) => {
    try {
      const updatedGoal = await storage.updateGoal(req.params.id, req.body);
      if (!updatedGoal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.json({ goal: updatedGoal });
    } catch (error) {
      console.error("Error updating goal:", error);
      res.status(500).json({ message: "Failed to update goal" });
    }
  });
  
  apiRouter.delete("/goals/:id", async (req, res) => {
    try {
      const success = await storage.deleteGoal(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting goal:", error);
      res.status(500).json({ message: "Failed to delete goal" });
    }
  });

  // OpenAI API endpoints for Agency Killer tools
  apiRouter.post("/openai/generate", async (req, res) => {
    try {
      const { prompt, model, maxTokens } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      
      const result = await generateText(prompt, model, maxTokens);
      res.json({ content: result });
    } catch (error: any) {
      console.error("OpenAI generation error:", error);
      res.status(500).json({ message: error.message || "Failed to generate content" });
    }
  });

  // Marketing Copy Generator
  apiRouter.post("/openai/marketing-copy", async (req, res) => {
    try {
      const { product, tone } = req.body;
      
      if (!product) {
        return res.status(400).json({ message: "Product description is required" });
      }
      
      const result = await generateMarketingCopy(product, tone || "professional");
      res.json(result);
    } catch (error: any) {
      console.error("Marketing copy generation error:", error);
      res.status(500).json({ message: error.message || "Failed to generate marketing copy" });
    }
  });

  // SEO Audit Generator
  apiRouter.post("/openai/seo-audit", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }
      
      const result = await generateSEOAudit(url);
      res.json(result);
    } catch (error: any) {
      console.error("SEO audit generation error:", error);
      res.status(500).json({ message: error.message || "Failed to generate SEO audit" });
    }
  });

  // SEO Keywords Generator
  apiRouter.post("/openai/seo-keywords", async (req, res) => {
    try {
      const { industry } = req.body;
      
      if (!industry) {
        return res.status(400).json({ message: "Industry is required" });
      }
      
      const result = await generateSEOKeywords(industry);
      res.json(result);
    } catch (error: any) {
      console.error("SEO keywords generation error:", error);
      res.status(500).json({ message: error.message || "Failed to generate SEO keywords" });
    }
  });

  // Ad Campaign Generator
  apiRouter.post("/openai/ad-campaign", async (req, res) => {
    try {
      const { product } = req.body;
      
      if (!product) {
        return res.status(400).json({ message: "Product description is required" });
      }
      
      const result = await generateAdCampaign(product);
      res.json(result);
    } catch (error: any) {
      console.error("Ad campaign generation error:", error);
      res.status(500).json({ message: error.message || "Failed to generate ad campaign" });
    }
  });

  // Marketing Funnel Generator
  apiRouter.post("/openai/marketing-funnel", async (req, res) => {
    try {
      const { goal } = req.body;
      
      if (!goal) {
        return res.status(400).json({ message: "Goal is required" });
      }
      
      const result = await generateMarketingFunnel(goal);
      res.json(result);
    } catch (error: any) {
      console.error("Marketing funnel generation error:", error);
      res.status(500).json({ message: error.message || "Failed to generate marketing funnel" });
    }
  });

  // Performance Metrics Simulator
  apiRouter.post("/openai/simulate-performance", async (req, res) => {
    try {
      const { currentMetrics, changes } = req.body;
      
      if (!currentMetrics) {
        return res.status(400).json({ message: "Current metrics are required" });
      }
      
      const result = await simulatePerformanceMetrics(currentMetrics, changes || {});
      res.json(result);
    } catch (error: any) {
      console.error("Performance simulation error:", error);
      res.status(500).json({ message: error.message || "Failed to simulate performance" });
    }
  });

  // Automation Score 2.0 routes
  apiRouter.get("/automation-score", async (req, res) => {
    try {
      const businessEntityId = req.query.businessEntityId ? parseInt(req.query.businessEntityId as string) : undefined;
      const automationScore = await storage.getAutomationScore(businessEntityId);
      res.json(automationScore);
    } catch (error) {
      console.error("Error getting automation score data:", error);
      res.status(500).json({ message: "Failed to get automation score data" });
    }
  });
  
  apiRouter.patch("/automation-recommendations/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const { implemented, inProgress } = req.body;
      
      const updated = await storage.updateAutomationRecommendation(id, {
        implemented: implemented !== undefined ? implemented : undefined,
        inProgress: inProgress !== undefined ? inProgress : undefined
      });
      
      if (!updated) {
        return res.status(404).json({ message: "Recommendation not found" });
      }
      
      // Add activity record
      await storage.createActivity({
        userId: 1, // Using demo user ID for simplicity
        type: implemented ? "implemented_automation" : "started_automation",
        description: `${implemented ? 'Implemented' : 'Started implementing'} automation: ${updated.title}`,
        metadata: { recommendationId: id }
      });
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating automation recommendation:", error);
      res.status(500).json({ message: "Failed to update automation recommendation" });
    }
  });
  
  // Register the API router
  app.use("/api", apiRouter);
  
  const httpServer = createServer(app);
  return httpServer;
}
