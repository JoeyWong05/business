import {
  User, InsertUser, users,
  BusinessEntity, InsertBusinessEntity, businessEntities,
  Company, InsertCompany, companies,
  Category, InsertCategory, categories,
  Subcategory, InsertSubcategory, subcategories,
  PricingTier, InsertPricingTier, pricingTiers,
  Tool, InsertTool, tools,
  TechStack, InsertTechStack, techStack,
  Sop, InsertSop, sops,
  Activity, InsertActivity, activities,
  EnhancedActivity, InsertEnhancedActivity, enhancedActivities,
  Recommendation, InsertRecommendation, recommendations,
  Asset, InsertAsset, assets,
  FinancialTransaction, InsertFinancialTransaction, financialTransactions,
  Employee, InsertEmployee, employees,
  Payroll, InsertPayroll, payroll,
  PasswordVault, InsertPasswordVault, passwordVault,
  VaultItemType,
  SalesDeal, InsertSalesDeal, salesDeals,
  SalesPipelineStage, SalesPriority, DealType, DealSource,
  SalesActivity, InsertSalesActivity, salesActivities,
  SalesForecast, InsertSalesForecast, salesForecasts,
  // SEO Intelligence System 
  SeoProfile, InsertSeoProfile, seoProfiles,
  SeoKeyword, InsertSeoKeyword, seoKeywords,
  SeoIssue, InsertSeoIssue, seoIssues,
  SeoRecommendation, InsertSeoRecommendation, seoRecommendations,
  SeoCompetitor, InsertSeoCompetitor, seoCompetitors,
  SeoBacklink, InsertSeoBacklink, seoBacklinks,
  SeoAudit, InsertSeoAudit, seoAudits,
  SeoPageMetric, InsertSeoPageMetric, seoPageMetrics,
  SEOScoreCategory, SEOScoreSeverity, SEOCompetitorRank
} from "@shared/schema";

import { 
  AssetCategory, 
  AssetStatus 
} from "@shared/assetTypes";

import {
  calculateAutomationScore as calculateScore,
  getAutomationScoreDescription,
  generateAutomationRecommendations
} from "@shared/automationScore";

import {
  AutomationScoreDetails,
  ModuleAutomationScore,
  AutomationRecommendation,
  ToolIntegration,
  AutomationTool
} from "../client/src/types/automation-score-types";

// Define AdCampaign interface
export interface AdCampaign {
  id: number;
  name: string;
  platform: 'facebook' | 'instagram' | 'google' | 'tiktok' | 'linkedin' | 'twitter';
  status: 'active' | 'paused' | 'completed' | 'draft';
  startDate: string;
  endDate?: string;
  budget: number;
  budgetSpent: number;
  metrics: {
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number;
    conversions?: number;
    conversionRate?: number;
    revenue?: number;
    roas?: number;
  };
  lastUpdated: string;
  entityId?: number;
  entityName?: string;
  targetAudience?: {
    demographics?: string[];
    interests?: string[];
    behaviors?: string[];
  };
  creativeTypes?: string[];
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Marketing Campaign methods
  getAdCampaigns(campaignIds?: number[]): Promise<AdCampaign[]>;
  getBusinessEntity(id: number): Promise<BusinessEntity | undefined>;
  
  // SEO Intelligence System methods
  getSeoProfiles(businessEntityId?: number): Promise<SeoProfile[]>;
  getSeoProfileById(id: number): Promise<SeoProfile | undefined>;
  createSeoProfile(profile: InsertSeoProfile): Promise<SeoProfile>;
  updateSeoProfile(id: number, profile: Partial<InsertSeoProfile>): Promise<SeoProfile | undefined>;
  
  getSeoKeywords(profileId: number): Promise<SeoKeyword[]>;
  getSeoKeywordById(id: number): Promise<SeoKeyword | undefined>;
  createSeoKeyword(keyword: InsertSeoKeyword): Promise<SeoKeyword>;
  updateSeoKeyword(id: number, keyword: Partial<InsertSeoKeyword>): Promise<SeoKeyword | undefined>;
  deleteSeoKeyword(id: number): Promise<boolean>;
  
  getSeoIssues(profileId: number, filters?: { 
    category?: string, 
    severity?: string, 
    status?: string 
  }): Promise<SeoIssue[]>;
  getSeoIssueById(id: number): Promise<SeoIssue | undefined>;
  createSeoIssue(issue: InsertSeoIssue): Promise<SeoIssue>;
  updateSeoIssueStatus(id: number, status: string): Promise<SeoIssue | undefined>;
  
  getSeoRecommendations(profileId: number, filters?: { 
    category?: string, 
    status?: string 
  }): Promise<SeoRecommendation[]>;
  getSeoRecommendationById(id: number): Promise<SeoRecommendation | undefined>;
  createSeoRecommendation(recommendation: InsertSeoRecommendation): Promise<SeoRecommendation>;
  updateSeoRecommendationStatus(id: number, status: string): Promise<SeoRecommendation | undefined>;
  
  getSeoCompetitors(profileId: number): Promise<SeoCompetitor[]>;
  getSeoCompetitorById(id: number): Promise<SeoCompetitor | undefined>;
  createSeoCompetitor(competitor: InsertSeoCompetitor): Promise<SeoCompetitor>;
  deleteSeoCompetitor(id: number): Promise<boolean>;
  
  getSeoBacklinks(profileId: number, filters?: { 
    isActive?: boolean, 
    isFollowed?: boolean 
  }): Promise<SeoBacklink[]>;
  getSeoBacklinkById(id: number): Promise<SeoBacklink | undefined>;
  createSeoBacklink(backlink: InsertSeoBacklink): Promise<SeoBacklink>;
  
  getSeoAudits(profileId: number): Promise<SeoAudit[]>;
  getSeoAuditById(id: number): Promise<SeoAudit | undefined>;
  createSeoAudit(audit: InsertSeoAudit): Promise<SeoAudit>;
  updateSeoAuditStatus(id: number, status: string, results?: any): Promise<SeoAudit | undefined>;
  
  getSeoPageMetrics(profileId: number): Promise<SeoPageMetric[]>;
  getSeoPageMetricByUrl(profileId: number, pageUrl: string): Promise<SeoPageMetric | undefined>;
  createSeoPageMetric(pageMetric: InsertSeoPageMetric): Promise<SeoPageMetric>;
  
  // Sales Deal methods
  getSalesDeals(params: {
    businessEntityId?: number,
    stage?: SalesPipelineStage,
    priority?: string,
    type?: string,
    assignedTo?: number,
    startDate?: Date,
    endDate?: Date
  }): Promise<SalesDeal[]>;
  getSalesDealById(id: number): Promise<SalesDeal | undefined>;
  getSalesDealByNumber(dealNumber: string): Promise<SalesDeal | undefined>;
  createSalesDeal(deal: InsertSalesDeal): Promise<SalesDeal>;
  updateSalesDealStage(id: number, stage: SalesPipelineStage): Promise<SalesDeal | undefined>;
  updateSalesDeal(id: number, deal: Partial<InsertSalesDeal>): Promise<SalesDeal | undefined>;
  deleteSalesDeal(id: number): Promise<boolean>;
  
  // Sales Activity methods
  getSalesActivities(dealId: number): Promise<SalesActivity[]>;
  createSalesActivity(activity: InsertSalesActivity): Promise<SalesActivity>;
  
  // Sales Forecast methods
  getSalesForecasts(params: {
    businessEntityId?: number,
    period?: string,
    startDate?: Date,
    endDate?: Date
  }): Promise<SalesForecast[]>;
  getSalesForecastById(id: number): Promise<SalesForecast | undefined>;
  createSalesForecast(forecast: InsertSalesForecast): Promise<SalesForecast>;
  updateSalesForecast(id: number, forecast: Partial<InsertSalesForecast>): Promise<SalesForecast | undefined>;
  
  // Sales Dashboard data
  getSalesPipelineData(params: {
    businessEntityId?: number,
    startDate?: Date,
    endDate?: Date
  }): Promise<{
    deals: SalesDeal[];
    summary: {
      totalValue: number;
      totalDeals: number;
      avgDealValue: number;
      avgDealCycle: number;
      winRate: number;
      conversions: Record<string, number>;
      monthlyTrend: Array<{ month: string; value: number; deals: number; }>;
    };
    forecast: {
      thisMonth: number;
      nextMonth: number;
      quarter: number;
    };
  }>;
  
  // Company Goals methods
  getGoals(params: {
    businessEntityId?: number,
    timeframe?: string,
    status?: string
  }): Promise<any[]>;
  getGoalById(id: string): Promise<any | undefined>;
  createGoal(goal: any): Promise<any>;
  updateGoal(id: string, goal: Partial<any>): Promise<any | undefined>;
  deleteGoal(id: string): Promise<boolean>;

  // Business Entity methods
  getBusinessEntities(parentEntityId?: number): Promise<BusinessEntity[]>;
  getBusinessEntityById(id: number): Promise<BusinessEntity | undefined>;
  getBusinessEntityBySlug(slug: string): Promise<BusinessEntity | undefined>;
  createBusinessEntity(entity: InsertBusinessEntity): Promise<BusinessEntity>;
  
  // Company methods
  getCompanies(businessEntityId?: number, type?: string): Promise<Company[]>;
  getCompanyById(id: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Subcategory methods
  getSubcategories(categoryId?: number): Promise<Subcategory[]>;
  getSubcategoriesByCategorySlug(categorySlug: string): Promise<Subcategory[]>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;

  // Pricing tier methods
  getPricingTiers(): Promise<PricingTier[]>;
  createPricingTier(tier: InsertPricingTier): Promise<PricingTier>;

  // Tool methods
  getTools(categoryId?: number, tierSlug?: string): Promise<Tool[]>;
  getToolById(id: number): Promise<Tool | undefined>;
  getToolsByCategorySlug(categorySlug: string): Promise<Tool[]>;
  createTool(tool: InsertTool): Promise<Tool>;

  // Tech stack methods
  getTechStack(userId: number, businessEntityId?: number): Promise<(TechStack & { tool: Tool })[]>;
  addToolToTechStack(techStackItem: InsertTechStack): Promise<TechStack>;
  removeToolFromTechStack(id: number): Promise<boolean>;
  
  // SOP methods
  getSops(userId: number, categoryId?: number, businessEntityId?: number): Promise<Sop[]>;
  getSopById(id: number): Promise<Sop | undefined>;
  createSop(sop: InsertSop): Promise<Sop>;

  // Activity methods
  getActivities(userId: number, limit?: number, businessEntityId?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Enhanced Activity methods (with financial impact)
  getEnhancedActivities(userId: number, limit?: number, businessEntityId?: number): Promise<EnhancedActivity[]>;
  createEnhancedActivity(activity: InsertEnhancedActivity): Promise<EnhancedActivity>;

  // Recommendation methods
  getRecommendations(userId: number, status?: string, businessEntityId?: number): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  updateRecommendationStatus(id: number, status: string): Promise<Recommendation | undefined>;
  
  // Asset methods
  getAssets(params: {
    category?: AssetCategory, 
    businessEntityId?: number, 
    companyId?: number,
    type?: string,
    tags?: string[]
  }): Promise<Asset[]>;
  getAssetById(id: number): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAssetStatus(id: number, status: AssetStatus): Promise<Asset | undefined>;
  
  // Financial Transaction methods
  getFinancialTransactions(params: {
    businessEntityId?: number,
    type?: string,
    startDate?: Date,
    endDate?: Date,
    category?: string
  }): Promise<FinancialTransaction[]>;
  createFinancialTransaction(transaction: InsertFinancialTransaction): Promise<FinancialTransaction>;
  
  // Meeting methods
  getMeetings(params: {
    userId?: number,
    businessEntityId?: number,
    startDate?: Date,
    endDate?: Date,
    status?: string
  }): Promise<Meeting[]>;
  getMeetingById(id: number): Promise<Meeting | undefined>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  updateMeeting(id: number, meeting: Partial<InsertMeeting>): Promise<Meeting | undefined>;
  deleteMeeting(id: number): Promise<boolean>;
  
  // WhatsApp Integration methods
  getWhatsAppSettings(userId: number): Promise<WhatsAppSettings | undefined>;
  createWhatsAppSettings(settings: InsertWhatsAppSettings): Promise<WhatsAppSettings>;
  updateWhatsAppSettings(userId: number, settings: Partial<InsertWhatsAppSettings>): Promise<WhatsAppSettings | undefined>;
  
  getWhatsAppGroups(params: {
    userId?: number,
    businessEntityId?: number,
    categoryId?: number,
    isActive?: boolean
  }): Promise<WhatsAppGroup[]>;
  getWhatsAppGroupById(id: number): Promise<WhatsAppGroup | undefined>;
  createWhatsAppGroup(group: InsertWhatsAppGroup): Promise<WhatsAppGroup>;
  updateWhatsAppGroup(id: number, group: Partial<InsertWhatsAppGroup>): Promise<WhatsAppGroup | undefined>;
  
  // Automation Score methods
  calculateAutomationScore(userId: number, businessEntityId?: number): Promise<{
    score: number,
    description: string,
    recommendations: Array<{ title: string, description: string, type: string }>
  }>;
  
  // Automation Score 2.0 methods
  getAutomationScore(businessEntityId?: number): Promise<AutomationScoreDetails>;
  updateAutomationRecommendation(id: string, updates: { implemented?: boolean, inProgress?: boolean }): Promise<AutomationRecommendation>;
  
  // Order methods
  getOrders(params: {
    businessEntityId?: number,
    status?: string,
    startDate?: Date,
    endDate?: Date,
    customerId?: number
  }): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string, paymentStatus?: string): Promise<Order | undefined>;
  
  // Customer Inquiry methods
  getCustomerInquiries(params: {
    businessEntityId?: number,
    status?: string,
    priority?: string,
    source?: string,
    assignedTo?: number
  }): Promise<CustomerInquiry[]>;
  getCustomerInquiryById(id: number): Promise<CustomerInquiry | undefined>;
  createCustomerInquiry(inquiry: InsertCustomerInquiry): Promise<CustomerInquiry>;
  updateCustomerInquiryStatus(id: number, status: string): Promise<CustomerInquiry | undefined>;
  assignCustomerInquiry(id: number, userId: number): Promise<CustomerInquiry | undefined>;
  addCustomerInquiryResponse(id: number, response: string, userId: number): Promise<CustomerInquiry | undefined>;
  
  // Competitor Analysis methods
  getCompetitors(businessEntityId?: number): Promise<Competitor[]>;
  getCompetitorById(id: number): Promise<Competitor | undefined>;
  createCompetitor(competitor: InsertCompetitor): Promise<Competitor>;
  updateCompetitor(id: number, competitor: Partial<InsertCompetitor>): Promise<Competitor | undefined>;
  
  // Competitor Tools methods
  getCompetitorTools(competitorId: number): Promise<CompetitorTool[]>;
  getCompetitorToolById(id: number): Promise<CompetitorTool | undefined>;
  createCompetitorTool(tool: InsertCompetitorTool): Promise<CompetitorTool>;
  updateCompetitorTool(id: number, tool: Partial<InsertCompetitorTool>): Promise<CompetitorTool | undefined>;
  deleteCompetitorTool(id: number): Promise<boolean>;
  
  // Employee methods
  getEmployees(params: {
    businessEntityId?: number,
    department?: string,
    status?: string,
    employmentType?: string,
    isManager?: boolean
  }): Promise<Employee[]>;
  getEmployeeById(id: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  getDirectReports(managerId: number): Promise<Employee[]>;
  getOrgChartData(businessEntityId?: number): Promise<any>;
  
  // Payroll methods
  getPayrolls(params: {
    businessEntityId?: number,
    employeeId?: number,
    startDate?: Date,
    endDate?: Date,
    status?: string,
    payrollFrequency?: string
  }): Promise<Payroll[]>;
  getPayrollById(id: number): Promise<Payroll | undefined>;
  createPayroll(payroll: InsertPayroll): Promise<Payroll>;
  updatePayroll(id: number, payroll: Partial<InsertPayroll>): Promise<Payroll | undefined>;
  getEmployeePayrollSummary(employeeId: number): Promise<{
    totalEarnings: number;
    averagePay: number;
    latestPayroll?: Payroll;
    nextPayDate?: Date;
    paymentHistory: {
      date: Date;
      amount: number;
    }[];
  }>;
  
  // Password Vault methods
  getPasswordVaultItems(params: {
    userId: number,
    businessEntityId?: number,
    type?: VaultItemType,
    toolId?: number,
    companyId?: number,
    favorite?: boolean,
    tags?: string[]
  }): Promise<PasswordVault[]>;
  getPasswordVaultItemById(id: number): Promise<PasswordVault | undefined>;
  createPasswordVaultItem(item: InsertPasswordVault): Promise<PasswordVault>;
  updatePasswordVaultItem(id: number, item: Partial<InsertPasswordVault>): Promise<PasswordVault | undefined>;
  deletePasswordVaultItem(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private businessEntities: Map<number, BusinessEntity>;
  private companies: Map<number, Company>;
  private categories: Map<number, Category>;
  private subcategories: Map<number, Subcategory>;
  private pricingTiers: Map<number, PricingTier>;
  private tools: Map<number, Tool>;
  private techStacks: Map<number, TechStack>;
  private sops: Map<number, Sop>;
  private activities: Map<number, Activity>;
  private enhancedActivities: Map<number, EnhancedActivity>;
  private recommendations: Map<number, Recommendation>;
  private assets: Map<number, Asset>;
  private financialTransactions: Map<number, FinancialTransaction>;
  private employees: Map<number, Employee>;
  private payrolls: Map<number, Payroll>;
  private passwordVaultItems: Map<number, PasswordVault>;
  private goals: Map<string, any>;
  private salesDeals: Map<number, SalesDeal>;
  private salesActivities: Map<number, SalesActivity>;
  private salesForecasts: Map<number, SalesForecast>;
  private adCampaigns: Map<number, AdCampaign>;
  
  // SEO Intelligence System
  private seoProfiles: Map<number, SeoProfile>;
  private seoKeywords: Map<number, SeoKeyword>;
  private seoIssues: Map<number, SeoIssue>;
  private seoRecommendations: Map<number, SeoRecommendation>;
  private seoCompetitors: Map<number, SeoCompetitor>;
  private seoBacklinks: Map<number, SeoBacklink>;
  private seoAudits: Map<number, SeoAudit>;
  private seoPageMetrics: Map<number, SeoPageMetric>;
  
  // Automation Score 2.0 storage
  private automationScoreDetails: AutomationScoreDetails | null;

  private userIdCounter: number;
  private businessEntityIdCounter: number;
  private companyIdCounter: number;
  private categoryIdCounter: number;
  private subcategoryIdCounter: number;
  private pricingTierIdCounter: number;
  private toolIdCounter: number;
  private techStackIdCounter: number;
  private sopIdCounter: number;
  private activityIdCounter: number;
  private enhancedActivityIdCounter: number;
  private recommendationIdCounter: number;
  private assetIdCounter: number;
  private financialTransactionIdCounter: number;
  private passwordVaultIdCounter: number;
  private salesDealIdCounter: number;
  private salesActivityIdCounter: number;
  private salesForecastIdCounter: number;
  
  // SEO Intelligence System counters
  private seoProfileIdCounter: number;
  private seoKeywordIdCounter: number;
  private seoIssueIdCounter: number;
  private seoRecommendationIdCounter: number;
  private seoCompetitorIdCounter: number;
  private seoBacklinkIdCounter: number;
  private seoAuditIdCounter: number;
  private seoPageMetricIdCounter: number;

  constructor() {
    this.users = new Map();
    this.businessEntities = new Map();
    this.companies = new Map();
    this.categories = new Map();
    this.subcategories = new Map();
    this.pricingTiers = new Map();
    this.tools = new Map();
    this.techStacks = new Map();
    this.sops = new Map();
    this.activities = new Map();
    this.enhancedActivities = new Map();
    this.recommendations = new Map();
    this.assets = new Map();
    this.financialTransactions = new Map();
    this.employees = new Map();
    this.payrolls = new Map();
    this.passwordVaultItems = new Map();
    this.goals = new Map();
    this.salesDeals = new Map();
    this.salesActivities = new Map();
    this.salesForecasts = new Map();
    this.adCampaigns = new Map();
    
    // SEO Intelligence System storage
    this.seoProfiles = new Map();
    this.seoKeywords = new Map();
    this.seoIssues = new Map();
    this.seoRecommendations = new Map();
    this.seoCompetitors = new Map();
    this.seoBacklinks = new Map();
    this.seoAudits = new Map();
    this.seoPageMetrics = new Map();
    
    // Initialize Automation Score 2.0
    this.automationScoreDetails = null;

    this.userIdCounter = 1;
    this.businessEntityIdCounter = 1;
    this.companyIdCounter = 1;
    this.categoryIdCounter = 1;
    this.subcategoryIdCounter = 1;
    this.pricingTierIdCounter = 1;
    this.toolIdCounter = 1;
    this.techStackIdCounter = 1;
    this.sopIdCounter = 1;
    this.activityIdCounter = 1;
    this.enhancedActivityIdCounter = 1;
    this.recommendationIdCounter = 1;
    this.assetIdCounter = 1;
    this.financialTransactionIdCounter = 1;
    this.passwordVaultIdCounter = 1;
    this.salesDealIdCounter = 1;
    this.salesActivityIdCounter = 1;
    this.salesForecastIdCounter = 1;
    
    // SEO Intelligence System counters
    this.seoProfileIdCounter = 1;
    this.seoKeywordIdCounter = 1;
    this.seoIssueIdCounter = 1;
    this.seoRecommendationIdCounter = 1;
    this.seoCompetitorIdCounter = 1;
    this.seoBacklinkIdCounter = 1;
    this.seoAuditIdCounter = 1;
    this.seoPageMetricIdCounter = 1;

    // Initialize with default data
    this.initializeDefaultData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  // Business Entity methods
  async getBusinessEntities(parentEntityId?: number): Promise<BusinessEntity[]> {
    if (parentEntityId) {
      return Array.from(this.businessEntities.values()).filter(
        entity => entity.parentEntityId === parentEntityId
      );
    }
    return Array.from(this.businessEntities.values());
  }
  
  async getBusinessEntityById(id: number): Promise<BusinessEntity | undefined> {
    return this.businessEntities.get(id);
  }
  
  async getBusinessEntityBySlug(slug: string): Promise<BusinessEntity | undefined> {
    return Array.from(this.businessEntities.values()).find(entity => entity.slug === slug);
  }
  
  async createBusinessEntity(insertEntity: InsertBusinessEntity): Promise<BusinessEntity> {
    const id = this.businessEntityIdCounter++;
    const now = new Date();
    const entity: BusinessEntity = { 
      ...insertEntity, 
      id, 
      createdAt: now
    };
    this.businessEntities.set(id, entity);
    return entity;
  }
  
  // Company methods
  async getCompanies(businessEntityId?: number, type?: string): Promise<Company[]> {
    let companies = Array.from(this.companies.values());
    
    if (businessEntityId) {
      companies = companies.filter(company => company.businessEntityId === businessEntityId);
    }
    
    if (type) {
      companies = companies.filter(company => company.type === type);
    }
    
    return companies;
  }
  
  async getCompanyById(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }
  
  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.companyIdCounter++;
    const now = new Date();
    const company: Company = { ...insertCompany, id, createdAt: now };
    this.companies.set(id, company);
    return company;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(category => category.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Subcategory methods
  async getSubcategories(categoryId?: number): Promise<Subcategory[]> {
    if (categoryId) {
      return Array.from(this.subcategories.values()).filter(
        subcategory => subcategory.categoryId === categoryId
      );
    }
    return Array.from(this.subcategories.values());
  }

  async getSubcategoriesByCategorySlug(categorySlug: string): Promise<Subcategory[]> {
    const category = await this.getCategoryBySlug(categorySlug);
    if (!category) return [];
    return this.getSubcategories(category.id);
  }

  async createSubcategory(insertSubcategory: InsertSubcategory): Promise<Subcategory> {
    const id = this.subcategoryIdCounter++;
    const subcategory: Subcategory = { ...insertSubcategory, id };
    this.subcategories.set(id, subcategory);
    return subcategory;
  }

  // Pricing tier methods
  async getPricingTiers(): Promise<PricingTier[]> {
    return Array.from(this.pricingTiers.values());
  }

  async createPricingTier(insertTier: InsertPricingTier): Promise<PricingTier> {
    const id = this.pricingTierIdCounter++;
    const tier: PricingTier = { ...insertTier, id };
    this.pricingTiers.set(id, tier);
    return tier;
  }

  // Tool methods
  async getTools(categoryId?: number, tierSlug?: string): Promise<Tool[]> {
    let result = Array.from(this.tools.values());
    
    if (categoryId) {
      result = result.filter(tool => tool.categoryId === categoryId);
    }
    
    if (tierSlug) {
      result = result.filter(tool => tool.tierSlug === tierSlug);
    }
    
    return result;
  }

  async getToolById(id: number): Promise<Tool | undefined> {
    return this.tools.get(id);
  }

  async getToolsByCategorySlug(categorySlug: string): Promise<Tool[]> {
    const category = await this.getCategoryBySlug(categorySlug);
    if (!category) return [];
    return this.getTools(category.id);
  }

  async createTool(insertTool: InsertTool): Promise<Tool> {
    const id = this.toolIdCounter++;
    const now = new Date();
    const tool: Tool = { ...insertTool, id, createdAt: now };
    this.tools.set(id, tool);
    return tool;
  }

  // Tech stack methods
  async getTechStack(userId: number, businessEntityId?: number): Promise<(TechStack & { tool: Tool })[]> {
    const userTechStack = Array.from(this.techStacks.values()).filter(item => {
      // Always filter by user ID
      if (item.userId !== userId) return false;
      
      // If businessEntityId is provided, filter by that too
      if (businessEntityId !== undefined && item.businessEntityId !== undefined) {
        return item.businessEntityId === businessEntityId;
      }
      
      // If no businessEntityId filter is specified, return all user's tech stack items
      return true;
    });
    
    return userTechStack.map(item => {
      const tool = this.tools.get(item.toolId);
      if (!tool) {
        throw new Error(`Tool with ID ${item.toolId} not found`);
      }
      return { ...item, tool };
    });
  }

  async addToolToTechStack(insertTechStackItem: InsertTechStack): Promise<TechStack> {
    const id = this.techStackIdCounter++;
    const now = new Date();
    const techStackItem: TechStack = { 
      ...insertTechStackItem, 
      id, 
      activeSince: insertTechStackItem.activeSince || now 
    };
    this.techStacks.set(id, techStackItem);
    return techStackItem;
  }

  async removeToolFromTechStack(id: number): Promise<boolean> {
    return this.techStacks.delete(id);
  }

  // SOP methods
  async getSops(userId: number, categoryId?: number): Promise<Sop[]> {
    let result = Array.from(this.sops.values());
    
    if (categoryId) {
      result = result.filter(sop => sop.categoryId === categoryId);
    }
    
    return result;
  }

  async getSopById(id: number): Promise<Sop | undefined> {
    return this.sops.get(id);
  }

  async createSop(insertSop: InsertSop): Promise<Sop> {
    const id = this.sopIdCounter++;
    const now = new Date();
    const sop: Sop = { ...insertSop, id, createdAt: now };
    this.sops.set(id, sop);
    return sop;
  }

  // Activity methods
  async getActivities(userId: number, limit?: number): Promise<Activity[]> {
    let activities = Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => {
        // Sort by createdAt in descending order (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    
    if (limit && limit > 0) {
      activities = activities.slice(0, limit);
    }
    
    return activities;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const now = new Date();
    const activity: Activity = { ...insertActivity, id, createdAt: now };
    this.activities.set(id, activity);
    return activity;
  }

  // Marketing Campaign methods
  async getAdCampaigns(campaignIds?: number[]): Promise<AdCampaign[]> {
    if (campaignIds && campaignIds.length > 0) {
      return campaignIds.map(id => this.adCampaigns.get(id)).filter(Boolean) as AdCampaign[];
    }
    return Array.from(this.adCampaigns.values());
  }
  
  async getBusinessEntity(id: number): Promise<BusinessEntity | undefined> {
    return this.businessEntities.get(id);
  }
  
  // Recommendation methods
  async getRecommendations(userId: number, status?: string): Promise<Recommendation[]> {
    let recommendations = Array.from(this.recommendations.values())
      .filter(recommendation => recommendation.userId === userId);
    
    if (status) {
      recommendations = recommendations.filter(recommendation => recommendation.status === status);
    }
    
    return recommendations;
  }

  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const id = this.recommendationIdCounter++;
    const now = new Date();
    const recommendation: Recommendation = { ...insertRecommendation, id, createdAt: now };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }

  async updateRecommendationStatus(id: number, status: string): Promise<Recommendation | undefined> {
    const recommendation = this.recommendations.get(id);
    if (!recommendation) return undefined;
    
    const updated = { ...recommendation, status };
    this.recommendations.set(id, updated);
    return updated;
  }
  
  // Company Goals methods
  async getGoals(params: {
    businessEntityId?: number,
    timeframe?: string,
    status?: string
  }): Promise<any[]> {
    let goals = Array.from(this.goals.values());
    
    if (params.businessEntityId) {
      goals = goals.filter(goal => 
        goal.businessEntityId === params.businessEntityId || goal.businessEntityId === undefined
      );
    }
    
    if (params.timeframe) {
      goals = goals.filter(goal => goal.timeframe === params.timeframe);
    }
    
    if (params.status) {
      goals = goals.filter(goal => goal.status === params.status);
    }
    
    return goals;
  }
  
  async getGoalById(id: string): Promise<any | undefined> {
    return this.goals.get(id);
  }
  
  async createGoal(goal: any): Promise<any> {
    const id = goal.id || `goal-${Date.now()}`;
    const now = new Date().toISOString();
    const newGoal = { 
      ...goal, 
      id, 
      createdAt: goal.createdAt || now,
      updatedAt: now
    };
    this.goals.set(id, newGoal);
    return newGoal;
  }
  
  async updateGoal(id: string, goalUpdate: Partial<any>): Promise<any | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;
    
    const updatedGoal = { 
      ...goal, 
      ...goalUpdate,
      updatedAt: new Date().toISOString()
    };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }
  
  async deleteGoal(id: string): Promise<boolean> {
    return this.goals.delete(id);
  }

  // Sales Deal methods
  async getSalesDeals(params: {
    businessEntityId?: number,
    stage?: SalesPipelineStage,
    priority?: string,
    type?: string,
    assignedTo?: number,
    startDate?: Date,
    endDate?: Date
  }): Promise<SalesDeal[]> {
    let deals = Array.from(this.salesDeals.values());
    
    if (params.businessEntityId !== undefined) {
      deals = deals.filter(deal => deal.businessEntityId === params.businessEntityId);
    }
    
    if (params.stage !== undefined) {
      deals = deals.filter(deal => deal.stage === params.stage);
    }
    
    if (params.priority !== undefined) {
      deals = deals.filter(deal => deal.priority === params.priority);
    }
    
    if (params.type !== undefined) {
      deals = deals.filter(deal => deal.type === params.type);
    }
    
    if (params.assignedTo !== undefined) {
      deals = deals.filter(deal => deal.assignedTo === params.assignedTo);
    }
    
    if (params.startDate !== undefined && params.endDate !== undefined) {
      deals = deals.filter(deal => {
        const dealDate = new Date(deal.expectedCloseDate);
        return dealDate >= params.startDate! && dealDate <= params.endDate!;
      });
    } else if (params.startDate !== undefined) {
      deals = deals.filter(deal => new Date(deal.expectedCloseDate) >= params.startDate!);
    } else if (params.endDate !== undefined) {
      deals = deals.filter(deal => new Date(deal.expectedCloseDate) <= params.endDate!);
    }
    
    return deals;
  }
  
  async getSalesDealById(id: number): Promise<SalesDeal | undefined> {
    return this.salesDeals.get(id);
  }
  
  async getSalesDealByNumber(dealNumber: string): Promise<SalesDeal | undefined> {
    return Array.from(this.salesDeals.values())
      .find(deal => deal.dealNumber === dealNumber);
  }
  
  async createSalesDeal(deal: InsertSalesDeal): Promise<SalesDeal> {
    const id = this.salesDealIdCounter++;
    const now = new Date();
    const dealNumber = `DEAL-${id.toString().padStart(4, '0')}`;
    
    const salesDeal: SalesDeal = { 
      ...deal, 
      id, 
      dealNumber,
      createdAt: now,
      updatedAt: now
    };
    
    this.salesDeals.set(id, salesDeal);
    return salesDeal;
  }
  
  async updateSalesDealStage(id: number, stage: SalesPipelineStage): Promise<SalesDeal | undefined> {
    const deal = this.salesDeals.get(id);
    if (!deal) return undefined;
    
    const now = new Date();
    const updatedDeal = { ...deal, stage, updatedAt: now };
    this.salesDeals.set(id, updatedDeal);
    
    // Create an activity for the stage change
    const stageChangeActivity: InsertSalesActivity = {
      dealId: id,
      type: 'stage_change',
      description: `Deal moved to ${stage} stage`,
      createdBy: deal.assignedTo,
      createdAt: now
    };
    this.createSalesActivity(stageChangeActivity);
    
    return updatedDeal;
  }
  
  async updateSalesDeal(id: number, dealUpdate: Partial<InsertSalesDeal>): Promise<SalesDeal | undefined> {
    const deal = this.salesDeals.get(id);
    if (!deal) return undefined;
    
    const now = new Date();
    const updatedDeal = { ...deal, ...dealUpdate, updatedAt: now };
    this.salesDeals.set(id, updatedDeal);
    return updatedDeal;
  }
  
  async deleteSalesDeal(id: number): Promise<boolean> {
    // Delete all activities associated with this deal
    const activitiesToDelete = Array.from(this.salesActivities.entries())
      .filter(([_, activity]) => activity.dealId === id);
      
    for (const [activityId, _] of activitiesToDelete) {
      this.salesActivities.delete(activityId);
    }
    
    return this.salesDeals.delete(id);
  }
  
  // Sales Activity methods
  async getSalesActivities(dealId: number): Promise<SalesActivity[]> {
    return Array.from(this.salesActivities.values())
      .filter(activity => activity.dealId === dealId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createSalesActivity(activity: InsertSalesActivity): Promise<SalesActivity> {
    const id = this.salesActivityIdCounter++;
    const activityWithId: SalesActivity = { ...activity, id };
    this.salesActivities.set(id, activityWithId);
    return activityWithId;
  }
  
  // Sales Forecast methods
  async getSalesForecasts(params: {
    businessEntityId?: number,
    period?: string,
    startDate?: Date,
    endDate?: Date
  }): Promise<SalesForecast[]> {
    let forecasts = Array.from(this.salesForecasts.values());
    
    if (params.businessEntityId !== undefined) {
      forecasts = forecasts.filter(forecast => forecast.businessEntityId === params.businessEntityId);
    }
    
    if (params.period !== undefined) {
      forecasts = forecasts.filter(forecast => forecast.period === params.period);
    }
    
    if (params.startDate !== undefined && params.endDate !== undefined) {
      forecasts = forecasts.filter(forecast => {
        const forecastDate = new Date(forecast.forecastDate);
        return forecastDate >= params.startDate! && forecastDate <= params.endDate!;
      });
    } else if (params.startDate !== undefined) {
      forecasts = forecasts.filter(forecast => new Date(forecast.forecastDate) >= params.startDate!);
    } else if (params.endDate !== undefined) {
      forecasts = forecasts.filter(forecast => new Date(forecast.forecastDate) <= params.endDate!);
    }
    
    return forecasts;
  }
  
  async getSalesForecastById(id: number): Promise<SalesForecast | undefined> {
    return this.salesForecasts.get(id);
  }
  
  async createSalesForecast(forecast: InsertSalesForecast): Promise<SalesForecast> {
    const id = this.salesForecastIdCounter++;
    const now = new Date();
    
    const salesForecast: SalesForecast = { 
      ...forecast, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    
    this.salesForecasts.set(id, salesForecast);
    return salesForecast;
  }
  
  async updateSalesForecast(id: number, forecastUpdate: Partial<InsertSalesForecast>): Promise<SalesForecast | undefined> {
    const forecast = this.salesForecasts.get(id);
    if (!forecast) return undefined;
    
    const now = new Date();
    const updatedForecast = { ...forecast, ...forecastUpdate, updatedAt: now };
    this.salesForecasts.set(id, updatedForecast);
    return updatedForecast;
  }
  
  // Sales Dashboard data
  async getSalesPipelineData(params: {
    businessEntityId?: number,
    startDate?: Date,
    endDate?: Date
  }): Promise<{
    deals: SalesDeal[];
    summary: {
      totalValue: number;
      totalDeals: number;
      avgDealValue: number;
      avgDealCycle: number;
      winRate: number;
      conversions: Record<string, number>;
      monthlyTrend: Array<{ month: string; value: number; deals: number; }>;
    };
    forecast: {
      thisMonth: number;
      nextMonth: number;
      quarter: number;
    };
  }> {
    // Get filtered deals
    const deals = await this.getSalesDeals(params);
    
    // Calculate summary statistics
    const totalDeals = deals.length;
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const avgDealValue = totalDeals > 0 ? totalValue / totalDeals : 0;
    
    // Calculate average deal cycle (days from created to closed)
    let totalCycleDays = 0;
    let closedDeals = 0;
    deals.forEach(deal => {
      if (deal.stage === SalesPipelineStage.CLOSED_WON || deal.stage === SalesPipelineStage.CLOSED_LOST) {
        const createdDate = new Date(deal.createdAt);
        const closedDate = new Date(deal.updatedAt);
        const cycleDays = Math.floor((closedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        totalCycleDays += cycleDays;
        closedDeals++;
      }
    });
    const avgDealCycle = closedDeals > 0 ? totalCycleDays / closedDeals : 0;
    
    // Calculate win rate
    const wonDeals = deals.filter(deal => deal.stage === SalesPipelineStage.CLOSED_WON).length;
    const lostDeals = deals.filter(deal => deal.stage === SalesPipelineStage.CLOSED_LOST).length;
    const winRate = (wonDeals + lostDeals) > 0 ? (wonDeals / (wonDeals + lostDeals)) * 100 : 0;
    
    // Calculate stage conversions
    const stageDeals: Record<string, number> = {};
    Object.values(SalesPipelineStage).forEach(stage => {
      stageDeals[stage] = deals.filter(deal => deal.stage === stage).length;
    });
    
    // Generate monthly trend data
    const monthlyTrend: Array<{ month: string; value: number; deals: number; }> = [];
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYear = `${monthNames[monthDate.getMonth()]} ${monthDate.getFullYear()}`;
      
      const monthDeals = deals.filter(deal => {
        const dealDate = new Date(deal.createdAt);
        return dealDate.getMonth() === monthDate.getMonth() && 
               dealDate.getFullYear() === monthDate.getFullYear();
      });
      
      const monthValue = monthDeals.reduce((sum, deal) => sum + deal.value, 0);
      monthlyTrend.push({
        month: monthYear,
        value: monthValue,
        deals: monthDeals.length
      });
    }
    
    // Calculate forecast
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
    const nextNextMonthDate = new Date(currentYear, currentMonth + 2, 1);
    const quarterEndDate = new Date(currentYear, Math.floor(currentMonth / 3) * 3 + 3, 0);
    
    const probabilityAdjustedValue = (deal: SalesDeal) => deal.value * (deal.probability / 100);
    
    const thisMonthForecast = deals
      .filter(deal => 
        deal.stage !== SalesPipelineStage.CLOSED_LOST && 
        new Date(deal.expectedCloseDate).getMonth() === currentMonth &&
        new Date(deal.expectedCloseDate).getFullYear() === currentYear
      )
      .reduce((sum, deal) => sum + probabilityAdjustedValue(deal), 0);
    
    const nextMonthForecast = deals
      .filter(deal => 
        deal.stage !== SalesPipelineStage.CLOSED_LOST && 
        new Date(deal.expectedCloseDate) >= nextMonthDate &&
        new Date(deal.expectedCloseDate) < nextNextMonthDate
      )
      .reduce((sum, deal) => sum + probabilityAdjustedValue(deal), 0);
    
    const quarterForecast = deals
      .filter(deal => 
        deal.stage !== SalesPipelineStage.CLOSED_LOST && 
        new Date(deal.expectedCloseDate) <= quarterEndDate
      )
      .reduce((sum, deal) => sum + probabilityAdjustedValue(deal), 0);
    
    return {
      deals,
      summary: {
        totalValue,
        totalDeals,
        avgDealValue,
        avgDealCycle,
        winRate,
        conversions: stageDeals,
        monthlyTrend
      },
      forecast: {
        thisMonth: thisMonthForecast,
        nextMonth: nextMonthForecast,
        quarter: quarterForecast
      }
    };
  }

  // Initialize with default data
  private async initializeDefaultData() {
    // Initialize sample sales deals
    const deal1 = await this.createSalesDeal({
      dealNumber: "DEAL-001",
      title: "Custom Merchandise Package",
      companyName: "Tech Innovations Inc.",
      contactName: "Alex Johnson",
      contactEmail: "alex@techinnovations.com",
      contactPhone: "+1 (555) 123-4567",
      stage: "proposal",
      value: "15000",
      probability: 60,
      priority: "high",
      expectedCloseDate: new Date("2025-04-15"),
      type: "new_business",
      source: "referral",
      tags: ["tech", "merchandise", "new-client"],
      notes: "Looking for branded merchandise for their tech conference in June",
      assignedTo: 1,
      businessEntityId: 1
    });
    
    await this.createSalesDeal({
      dealNumber: "DEAL-002",
      title: "Seasonal Apparel Collection",
      companyName: "Outdoor Adventures Co.",
      contactName: "Jamie Smith",
      contactEmail: "jamie@outdooradventures.com",
      contactPhone: "+1 (555) 987-6543",
      stage: "negotiation",
      value: "32000",
      probability: 75,
      priority: "medium",
      expectedCloseDate: new Date("2025-04-05"),
      type: "expansion",
      source: "referral",
      tags: ["apparel", "seasonal", "outdoor"],
      notes: "Expanding their branded apparel line for summer season",
      assignedTo: 2,
      businessEntityId: 3
    });
    
    await this.createSalesDeal({
      dealNumber: "DEAL-003",
      title: "Corporate Gift Packages",
      companyName: "Global Financial Services",
      contactName: "Taylor Morgan",
      contactEmail: "tmorgan@globalfinancial.com",
      contactPhone: "+1 (555) 246-8102",
      stage: SalesPipelineStage.LEAD,
      value: "18500",
      probability: 30,
      priority: SalesPriority.MEDIUM,
      expectedCloseDate: new Date("2025-05-20"),
      type: DealType.NEW_BUSINESS,
      source: DealSource.WEBSITE,
      tags: ["corporate", "gifts", "financial"],
      notes: "Interested in year-end client gift packages",
      assignedTo: 3,
      assignedToName: "Ethan Rodriguez",
      businessEntityId: 1
    });
    
    await this.createSalesDeal({
      dealNumber: "DEAL-004",
      title: "Limited Edition Merchandise",
      companyName: "Cosmic Entertainment",
      contactName: "Jordan Lee",
      contactEmail: "jlee@cosmicent.com",
      contactPhone: "+1 (555) 369-7412",
      stage: SalesPipelineStage.CLOSED_WON,
      value: "45000",
      probability: 100,
      priority: SalesPriority.HIGH,
      expectedCloseDate: new Date("2025-03-10"),
      type: DealType.NEW_BUSINESS,
      source: DealSource.PARTNER,
      tags: ["entertainment", "limited-edition", "merchandise"],
      notes: "Deal for exclusive merchandise for upcoming movie launch",
      assignedTo: 4,
      assignedToName: "Amanda Wilson",
      businessEntityId: 2,
      closedAt: new Date("2025-03-10")
    });
    
    await this.createSalesDeal({
      dealNumber: "DEAL-005",
      title: "Premium Branded Drinkware",
      companyName: "Alpine Beverages",
      contactName: "Casey Rivers",
      contactEmail: "casey@alpinebev.com",
      contactPhone: "+1 (555) 789-0123",
      stage: SalesPipelineStage.CONTACTED,
      value: "12800",
      probability: 45,
      priority: SalesPriority.LOW,
      expectedCloseDate: new Date("2025-05-15"),
      type: DealType.CROSS_SELL,
      source: DealSource.EMAIL,
      tags: ["beverages", "drinkware", "premium"],
      notes: "Looking for high-end branded drinkware for new product line",
      assignedTo: 1,
      assignedToName: "Sarah Williams",
      businessEntityId: 5
    });
    
    // Add sales activities for the first deal
    await this.createSalesActivity({
      type: "call",
      description: "Initial discovery call with potential client",
      dealId: deal1.id,
      date: new Date("2025-03-10T14:30:00Z"),
      userId: 1,
      userName: "Sarah Williams"
    });
    
    await this.createSalesActivity({
      type: "email",
      description: "Sent product catalog and pricing information",
      dealId: deal1.id,
      date: new Date("2025-03-15T10:15:00Z"),
      userId: 1,
      userName: "Sarah Williams"
    });
    
    await this.createSalesActivity({
      type: "meeting",
      description: "Virtual meeting to discuss merchandise options",
      dealId: deal1.id,
      date: new Date("2025-03-18T15:00:00Z"),
      userId: 1,
      userName: "Sarah Williams"
    });
    
    // Add sales forecasts
    await this.createSalesForecast({
      period: "month",
      startDate: new Date("2025-03-01"),
      endDate: new Date("2025-03-31"),
      forecastAmount: "95000",
      deals: 8,
      businessEntityId: null // All entities
    });
    
    await this.createSalesForecast({
      period: "month",
      startDate: new Date("2025-04-01"),
      endDate: new Date("2025-04-30"),
      forecastAmount: "142000",
      deals: 12,
      businessEntityId: null // All entities
    });
    
    await this.createSalesForecast({
      period: "quarter",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-03-31"),
      forecastAmount: "235000",
      actualAmount: "245500",
      deals: 24,
      closedDeals: 22,
      businessEntityId: null // All entities
    });
    
    await this.createSalesForecast({
      period: "quarter",
      startDate: new Date("2025-04-01"),
      endDate: new Date("2025-06-30"),
      forecastAmount: "395000",
      deals: 32,
      businessEntityId: null // All entities
    });
    
    // Initialize sample goals
    this.goals.set('goal-1', {
      id: 'goal-1',
      title: 'Increase Social Media Engagement',
      description: 'Improve engagement metrics across all social media platforms by 25%',
      businessEntityId: 1, // Digital Merch Pros
      timeframe: 'Q2-2025',
      status: 'in-progress',
      target: 25,
      unit: 'percent',
      metric: 'engagement',
      startDate: '2025-04-01',
      endDate: '2025-06-30',
      progress: 15,
      notes: 'Focus on Instagram and TikTok first',
      owner: 'Marketing Team',
      priority: 'high',
      createdAt: '2025-03-15T10:00:00Z',
      updatedAt: '2025-03-20T14:30:00Z'
    });
    
    this.goals.set('goal-2', {
      id: 'goal-2',
      title: 'Launch New Product Line',
      description: 'Successfully launch the eco-friendly merchandise collection',
      businessEntityId: 1, // Digital Merch Pros
      timeframe: 'Q3-2025',
      status: 'planned',
      target: 1,
      unit: 'launch',
      metric: 'completion',
      startDate: '2025-07-01',
      endDate: '2025-09-30',
      progress: 0,
      notes: 'Sourcing sustainable materials is the first priority',
      owner: 'Product Team',
      priority: 'critical',
      createdAt: '2025-03-10T09:00:00Z',
      updatedAt: '2025-03-10T09:00:00Z'
    });
    
    this.goals.set('goal-3', {
      id: 'goal-3',
      title: 'Reduce Customer Acquisition Cost',
      description: 'Lower CAC by 15% while maintaining quality leads',
      businessEntityId: 2, // Mystery Hype
      timeframe: 'Q2-2025',
      status: 'in-progress',
      target: 15,
      unit: 'percent',
      metric: 'cost-reduction',
      startDate: '2025-04-01',
      endDate: '2025-06-30',
      progress: 5,
      notes: 'Implementing new lead scoring system',
      owner: 'Marketing & Sales Teams',
      priority: 'high',
      createdAt: '2025-03-05T08:30:00Z',
      updatedAt: '2025-03-18T11:45:00Z'
    });
    
    this.goals.set('goal-4', {
      id: 'goal-4',
      title: 'Expand to European Market',
      description: 'Establish operations and distribution in at least 3 European countries',
      businessEntityId: 3, // Lone Star Custom Clothing
      timeframe: 'Q4-2025',
      status: 'planned',
      target: 3,
      unit: 'countries',
      metric: 'expansion',
      startDate: '2025-10-01',
      endDate: '2025-12-31',
      progress: 0,
      notes: 'Researching regulations in target countries',
      owner: 'Executive Team',
      priority: 'medium',
      createdAt: '2025-03-01T15:20:00Z',
      updatedAt: '2025-03-01T15:20:00Z'
    });
    
    this.goals.set('goal-5', {
      id: 'goal-5',
      title: 'Improve Production Efficiency',
      description: 'Increase factory output by 20% without additional staff',
      businessEntityId: 3, // Lone Star Custom Clothing
      timeframe: 'Q3-2025',
      status: 'in-progress',
      target: 20,
      unit: 'percent',
      metric: 'efficiency',
      startDate: '2025-07-01',
      endDate: '2025-09-30',
      progress: 8,
      notes: 'New equipment installation in progress',
      owner: 'Operations Team',
      priority: 'high',
      createdAt: '2025-02-20T09:15:00Z',
      updatedAt: '2025-03-15T16:40:00Z'
    });
    
    this.goals.set('goal-6', {
      id: 'goal-6',
      title: 'Secure Retail Distribution',
      description: 'Get products into at least 50 retail locations',
      businessEntityId: 4, // Alcoeaze
      timeframe: 'Q2-Q3-2025',
      status: 'in-progress',
      target: 50,
      unit: 'locations',
      metric: 'distribution',
      startDate: '2025-04-01',
      endDate: '2025-09-30',
      progress: 12,
      notes: 'Focus on independent specialty stores first',
      owner: 'Sales Team',
      priority: 'critical',
      createdAt: '2025-01-15T11:30:00Z',
      updatedAt: '2025-03-10T13:20:00Z'
    });
    
    this.goals.set('goal-7', {
      id: 'goal-7',
      title: 'New Location Opening',
      description: 'Successfully open new flagship location in Austin',
      businessEntityId: 5, // Hide Cafe Bars
      timeframe: 'Q3-2025',
      status: 'planned',
      target: 1,
      unit: 'location',
      metric: 'completion',
      startDate: '2025-07-01',
      endDate: '2025-09-30',
      progress: 0,
      notes: 'Site selection in progress',
      owner: 'Executive & Operations Teams',
      priority: 'critical',
      createdAt: '2025-03-01T10:00:00Z',
      updatedAt: '2025-03-05T14:30:00Z'
    });
    
    this.goals.set('goal-8', {
      id: 'goal-8',
      title: 'Implement Customer Loyalty Program',
      description: 'Launch digital loyalty program with mobile app integration',
      businessEntityId: 5, // Hide Cafe Bars
      timeframe: 'Q2-2025',
      status: 'in-progress',
      target: 1,
      unit: 'program',
      metric: 'completion',
      startDate: '2025-04-01',
      endDate: '2025-06-30',
      progress: 35,
      notes: 'App development underway, rewards structure finalized',
      owner: 'Marketing & IT Teams',
      priority: 'high',
      createdAt: '2025-02-10T09:45:00Z',
      updatedAt: '2025-03-18T11:20:00Z'
    });
    
    // Create default business entities
    await this.createBusinessEntity({
      name: "Digital Merch Pros",
      slug: "digital-merch-pros",
      description: "Print-on-demand merchandising business",
      industry: "E-commerce",
      website: "digitalmechpros.com"
    });
    
    await this.createBusinessEntity({
      name: "Mystery Hype",
      slug: "mystery-hype",
      description: "Mystery box subscription service",
      industry: "E-commerce",
      website: "mysteryhype.com"
    });
    
    await this.createBusinessEntity({
      name: "Lone Star Custom Clothing",
      slug: "lone-star-custom",
      description: "Custom clothing manufacturer in Texas",
      industry: "Manufacturing",
      website: "lonestarcustom.com"
    });
    
    await this.createBusinessEntity({
      name: "Alcoeaze",
      slug: "alcoeaze",
      description: "Non-alcoholic beverage startup",
      industry: "Food & Beverage",
      website: "alcoeaze.com"
    });
    
    await this.createBusinessEntity({
      name: "Hide Cafe Bars",
      slug: "hide-cafe",
      description: "Premium cafe and cocktail bar chain",
      industry: "Hospitality",
      website: "hidecafe.com"
    });
    
    // Create default pricing tiers
    await this.createPricingTier({ name: "Free", slug: "free" });
    await this.createPricingTier({ name: "Low Cost", slug: "low-cost" });
    await this.createPricingTier({ name: "Enterprise", slug: "enterprise" });
    
    // Initialize sample ad campaigns
    const adCampaign1 = {
      id: 1,
      name: "Summer Collection Launch",
      platform: "facebook" as AdCampaign['platform'],
      status: "active" as AdCampaign['status'],
      startDate: "2025-03-01",
      endDate: "2025-04-30",
      budget: 5000,
      budgetSpent: 2100,
      metrics: {
        impressions: 125000,
        clicks: 3800,
        ctr: 3.04,
        cpc: 0.55,
        conversions: 180,
        conversionRate: 4.74,
        revenue: 8200,
        roas: 3.9
      },
      entityId: 1, // Digital Merch Pros
      entityName: "Digital Merch Pros",
      lastUpdated: "2025-03-20T10:15:00Z",
      targetAudience: {
        demographics: ["18-34", "US-based", "Interest in fashion"],
        interests: ["customized apparel", "streetwear", "pop culture"],
        behaviors: ["online shoppers", "high engagement on social"]
      },
      creativeTypes: ["image", "carousel", "video"]
    };
    
    const adCampaign2 = {
      id: 2,
      name: "Mystery Box Promotion",
      platform: "instagram" as AdCampaign['platform'],
      status: "active" as AdCampaign['status'],
      startDate: "2025-02-15",
      endDate: "2025-04-15",
      budget: 7500,
      budgetSpent: 4200,
      metrics: {
        impressions: 210000,
        clicks: 6300,
        ctr: 3.0,
        cpc: 0.67,
        conversions: 420,
        conversionRate: 6.67,
        revenue: 18900,
        roas: 4.5
      },
      entityId: 2, // Mystery Hype
      entityName: "Mystery Hype",
      lastUpdated: "2025-03-22T09:30:00Z",
      targetAudience: {
        demographics: ["16-28", "US & Canada", "Gaming enthusiasts"],
        interests: ["collectibles", "anime", "gaming merch"],
        behaviors: ["subscription services users", "collectors"]
      },
      creativeTypes: ["story", "reel", "image"]
    };
    
    const adCampaign3 = {
      id: 3,
      name: "Brand Awareness Campaign",
      platform: "tiktok" as AdCampaign['platform'],
      status: "active" as AdCampaign['status'],
      startDate: "2025-03-10",
      endDate: "2025-05-10",
      budget: 4000,
      budgetSpent: 1800,
      metrics: {
        impressions: 350000,
        clicks: 8200,
        ctr: 2.34,
        cpc: 0.22,
        conversions: 310,
        conversionRate: 3.78,
        revenue: 5800,
        roas: 3.22
      },
      entityId: 4, // Alcoeaze
      entityName: "Alcoeaze",
      lastUpdated: "2025-03-21T15:45:00Z",
      targetAudience: {
        demographics: ["21-45", "Health-conscious", "Social drinkers"],
        interests: ["non-alcoholic beverages", "wellness", "social events"],
        behaviors: ["health app users", "premium food & beverage shoppers"]
      },
      creativeTypes: ["video", "user-generated"]
    };
    
    const adCampaign4 = {
      id: 4,
      name: "Google Search Campaign",
      platform: "google" as AdCampaign['platform'],
      status: "active" as AdCampaign['status'],
      startDate: "2025-02-01",
      endDate: "2025-05-01",
      budget: 6000,
      budgetSpent: 3600,
      metrics: {
        impressions: 95000,
        clicks: 4100,
        ctr: 4.32,
        cpc: 0.88,
        conversions: 205,
        conversionRate: 5.0,
        revenue: 12300,
        roas: 3.42
      },
      entityId: 3, // Lone Star Custom Clothing
      entityName: "Lone Star Custom Clothing",
      lastUpdated: "2025-03-18T11:20:00Z",
      targetAudience: {
        demographics: ["25-55", "Texas-based", "Corporate clients"],
        interests: ["custom uniforms", "corporate events", "promotional products"],
        behaviors: ["B2B purchasers", "high-ticket shoppers"]
      },
      creativeTypes: ["search", "display"]
    };
    
    const adCampaign5 = {
      id: 5,
      name: "Premium Experience Campaign",
      platform: "linkedin" as AdCampaign['platform'],
      status: "paused" as AdCampaign['status'],
      startDate: "2025-01-15",
      endDate: "2025-03-15",
      budget: 3500,
      budgetSpent: 3500,
      metrics: {
        impressions: 42000,
        clicks: 1850,
        ctr: 4.40,
        cpc: 1.89,
        conversions: 120,
        conversionRate: 6.49,
        revenue: 9600,
        roas: 2.74
      },
      entityId: 5, // Hide Cafe Bars
      entityName: "Hide Cafe Bars",
      lastUpdated: "2025-03-15T16:30:00Z",
      targetAudience: {
        demographics: ["28-55", "Urban professionals", "Higher income"],
        interests: ["premium dining", "craft cocktails", "business networking"],
        behaviors: ["frequent restaurant-goers", "upscale venue patrons"]
      },
      creativeTypes: ["image", "carousel"]
    };
    
    this.adCampaigns.set(1, adCampaign1);
    this.adCampaigns.set(2, adCampaign2);
    this.adCampaigns.set(3, adCampaign3);
    this.adCampaigns.set(4, adCampaign4);
    this.adCampaigns.set(5, adCampaign5);

    // Create default categories
    const finance = await this.createCategory({ 
      name: "Finance", 
      slug: "finance", 
      description: "Manage your financial operations",
      icon: "account_balance",
      color: "text-green-500" 
    });

    const operations = await this.createCategory({ 
      name: "Operations", 
      slug: "operations", 
      description: "Streamline business processes",
      icon: "settings",
      color: "text-blue-500" 
    });

    const marketing = await this.createCategory({ 
      name: "Marketing", 
      slug: "marketing", 
      description: "Grow your brand and audience",
      icon: "campaign",
      color: "text-purple-500" 
    });

    const sales = await this.createCategory({ 
      name: "Sales", 
      slug: "sales", 
      description: "Convert leads into customers",
      icon: "storefront",
      color: "text-amber-500" 
    });

    const customer = await this.createCategory({ 
      name: "Customer Experience", 
      slug: "customer-experience", 
      description: "Delight your customers at every touchpoint",
      icon: "support_agent",
      color: "text-red-500" 
    });

    // Create Finance subcategories
    await this.createSubcategory({ name: "Cash Flow", slug: "cash-flow", categoryId: finance.id });
    await this.createSubcategory({ name: "Accounting", slug: "accounting", categoryId: finance.id });
    await this.createSubcategory({ name: "Budgeting", slug: "budgeting", categoryId: finance.id });
    await this.createSubcategory({ name: "Financial Planning", slug: "financial-planning", categoryId: finance.id });

    // Create Operations subcategories
    await this.createSubcategory({ name: "Project Management", slug: "project-management", categoryId: operations.id });
    await this.createSubcategory({ name: "HR & Team", slug: "hr-team", categoryId: operations.id });
    await this.createSubcategory({ name: "Procurement", slug: "procurement", categoryId: operations.id });
    await this.createSubcategory({ name: "Logistics", slug: "logistics", categoryId: operations.id });

    // Create Marketing subcategories
    await this.createSubcategory({ name: "Content Creation", slug: "content-creation", categoryId: marketing.id });
    await this.createSubcategory({ name: "Social Media", slug: "social-media", categoryId: marketing.id });
    await this.createSubcategory({ name: "SEO & Analytics", slug: "seo-analytics", categoryId: marketing.id });
    await this.createSubcategory({ name: "Email Marketing", slug: "email-marketing", categoryId: marketing.id });

    // Create Sales subcategories
    await this.createSubcategory({ name: "CRM", slug: "crm", categoryId: sales.id });
    await this.createSubcategory({ name: "Lead Generation", slug: "lead-generation", categoryId: sales.id });
    await this.createSubcategory({ name: "Sales Funnel", slug: "sales-funnel", categoryId: sales.id });
    await this.createSubcategory({ name: "Conversion Optimization", slug: "conversion-optimization", categoryId: sales.id });

    // Create Customer Experience subcategories
    await this.createSubcategory({ name: "Support Systems", slug: "support-systems", categoryId: customer.id });
    await this.createSubcategory({ name: "Customer Feedback", slug: "customer-feedback", categoryId: customer.id });
    await this.createSubcategory({ name: "Loyalty Programs", slug: "loyalty-programs", categoryId: customer.id });
    await this.createSubcategory({ name: "User Experience", slug: "user-experience", categoryId: customer.id });

    // Create sample tools
    await this.createTool({
      name: "QuickBooks",
      description: "Cloud-based accounting software for small businesses",
      website: "https://quickbooks.intuit.com/",
      logo: "quickbooks",
      categoryId: finance.id,
      subcategoryId: 2, // Accounting
      tierSlug: "low-cost",
      monthlyPrice: 25,
      features: ["Invoicing", "Expense tracking", "Tax preparation", "Payroll"],
      pros: ["Easy to use", "Widely adopted", "Good support"],
      cons: ["Can be expensive for growing teams", "Limited customization"]
    });

    await this.createTool({
      name: "Wave",
      description: "Free accounting software for small businesses",
      website: "https://www.waveapps.com/",
      logo: "wave",
      categoryId: finance.id,
      subcategoryId: 2, // Accounting
      tierSlug: "free",
      monthlyPrice: 0,
      features: ["Invoicing", "Accounting", "Receipt scanning"],
      pros: ["Free for basic use", "Simple interface", "Good for freelancers"],
      cons: ["Limited features", "Payroll is paid add-on", "Limited support"]
    });

    await this.createTool({
      name: "Trello",
      description: "Visual project management tool",
      website: "https://trello.com/",
      logo: "trello",
      categoryId: operations.id,
      subcategoryId: 5, // Project Management
      tierSlug: "free",
      monthlyPrice: 0,
      features: ["Kanban boards", "Task management", "Team collaboration"],
      pros: ["Visual interface", "Easy to learn", "Free tier available"],
      cons: ["Limited reporting", "Can get cluttered with large projects"]
    });

    await this.createTool({
      name: "Asana",
      description: "Work management platform for teams",
      website: "https://asana.com/",
      logo: "asana",
      categoryId: operations.id,
      subcategoryId: 5, // Project Management
      tierSlug: "low-cost",
      monthlyPrice: 10.99,
      features: ["Task management", "Project timelines", "Team workload view"],
      pros: ["Versatile", "Good for complex projects", "Strong visualization options"],
      cons: ["Learning curve", "Can be overwhelming for small teams"]
    });

    await this.createTool({
      name: "Mailchimp",
      description: "Email marketing platform",
      website: "https://mailchimp.com/",
      logo: "mailchimp",
      categoryId: marketing.id,
      subcategoryId: 12, // Email Marketing
      tierSlug: "low-cost",
      monthlyPrice: 11,
      features: ["Email campaigns", "Audience management", "Basic automation"],
      pros: ["User-friendly", "Free tier available", "Good templates"],
      cons: ["Gets expensive with large lists", "Limited automation in lower tiers"]
    });

    await this.createTool({
      name: "HubSpot CRM",
      description: "Customer relationship management platform",
      website: "https://www.hubspot.com/",
      logo: "hubspot",
      categoryId: sales.id,
      subcategoryId: 13, // CRM
      tierSlug: "free",
      monthlyPrice: 0,
      features: ["Contact management", "Deal tracking", "Email integration"],
      pros: ["Free core CRM", "User-friendly", "Good for small teams"],
      cons: ["Advanced features require paid plans", "Can be complex to set up fully"]
    });

    await this.createTool({
      name: "Salesforce",
      description: "Enterprise CRM platform",
      website: "https://www.salesforce.com/",
      logo: "salesforce",
      categoryId: sales.id,
      subcategoryId: 13, // CRM
      tierSlug: "enterprise",
      monthlyPrice: 150,
      features: ["Complete CRM", "Workflow automation", "Advanced analytics", "AppExchange ecosystem"],
      pros: ["Extremely powerful", "Highly customizable", "Industry standard"],
      cons: ["Expensive", "Significant setup time", "Requires dedicated admin"]
    });

    await this.createTool({
      name: "Zendesk",
      description: "Customer service platform",
      website: "https://www.zendesk.com/",
      logo: "zendesk",
      categoryId: customer.id,
      subcategoryId: 17, // Support Systems
      tierSlug: "low-cost",
      monthlyPrice: 19,
      features: ["Ticketing system", "Knowledge base", "Live chat"],
      pros: ["Easy to use", "Scalable", "Customizable"],
      cons: ["Can get expensive", "Some features limited to higher tiers"]
    });

    // Create demo user
    const user = await this.createUser({
      username: "demo",
      password: "demo123"
    });

    // Get business entities for reference
    const digitalMerchPros = await this.getBusinessEntityBySlug("digital-merch-pros");
    const mysteryHype = await this.getBusinessEntityBySlug("mystery-hype");
    const loneStarCustom = await this.getBusinessEntityBySlug("lone-star-custom");
    const alcoeaze = await this.getBusinessEntityBySlug("alcoeaze");
    const hideCafe = await this.getBusinessEntityBySlug("hide-cafe");

    // Add some tools to Digital Merch Pros tech stack
    await this.addToolToTechStack({
      userId: user.id,
      toolId: 1, // QuickBooks
      businessEntityId: digitalMerchPros?.id,
      monthlyPrice: 25,
      notes: "Using for basic accounting needs"
    });

    await this.addToolToTechStack({
      userId: user.id,
      toolId: 3, // Trello
      businessEntityId: digitalMerchPros?.id,
      monthlyPrice: 0,
      notes: "Team project management"
    });

    // Add tools to Mystery Hype tech stack
    await this.addToolToTechStack({
      userId: user.id,
      toolId: 5, // Mailchimp
      businessEntityId: mysteryHype?.id,
      monthlyPrice: 11,
      notes: "Email newsletters"
    });
    
    await this.addToolToTechStack({
      userId: user.id,
      toolId: 6, // HubSpot CRM
      businessEntityId: mysteryHype?.id,
      monthlyPrice: 0,
      notes: "Customer relationship management"
    });
    
    // Add tools to Lone Star Custom tech stack
    await this.addToolToTechStack({
      userId: user.id,
      toolId: 1, // QuickBooks
      businessEntityId: loneStarCustom?.id,
      monthlyPrice: 30,
      notes: "Manufacturing accounting"
    });
    
    await this.addToolToTechStack({
      userId: user.id,
      toolId: 4, // Asana
      businessEntityId: loneStarCustom?.id,
      monthlyPrice: 10.99,
      notes: "Production planning"
    });
    
    // Add tools to AlcoEaze tech stack
    await this.addToolToTechStack({
      userId: user.id,
      toolId: 3, // Trello
      businessEntityId: alcoeaze?.id,
      monthlyPrice: 0,
      notes: "Product development tracking"
    });
    
    // Add tools to Hide Cafe tech stack
    await this.addToolToTechStack({
      userId: user.id,
      toolId: 1, // QuickBooks
      businessEntityId: hideCafe?.id,
      monthlyPrice: 45,
      notes: "Multi-location accounting"
    });
    
    await this.addToolToTechStack({
      userId: user.id,
      toolId: 8, // Zendesk
      businessEntityId: hideCafe?.id,
      monthlyPrice: 19,
      notes: "Customer service portal"
    });

    // Create sample SOPs
    await this.createSop({
      title: "Customer Onboarding Process",
      categoryId: customer.id,
      content: "A comprehensive guide to onboarding new customers effectively.",
      steps: [
        { title: "Initial Welcome", description: "Send a welcome email within 24 hours of sign-up." },
        { title: "Account Setup Call", description: "Schedule a 30-minute call to help with initial account setup." },
        { title: "Product Walkthrough", description: "Conduct a personalized product walkthrough session." },
        { title: "Resource Sharing", description: "Share relevant documentation and resources." },
        { title: "Follow-up Check", description: "Check in after 7 days to address any issues." },
        { title: "Feedback Collection", description: "Ask for initial feedback after 14 days." },
        { title: "Success Planning", description: "Create a 90-day success plan with the customer." },
        { title: "Regular Reviews", description: "Establish regular review meetings based on customer needs." }
      ],
      isAiGenerated: true
    });

    await this.createSop({
      title: "Social Media Content Calendar",
      categoryId: marketing.id,
      content: "A structured approach to planning and executing social media content.",
      steps: [
        { title: "Audience Analysis", description: "Define target audience segments and preferences." },
        { title: "Content Themes", description: "Establish monthly content themes and topics." },
        { title: "Content Creation", description: "Develop text, images, and videos for each platform." },
        { title: "Review Process", description: "Implement a content review and approval workflow." },
        { title: "Scheduling", description: "Schedule posts for optimal engagement times." }
      ],
      isAiGenerated: true
    });

    await this.createSop({
      title: "Monthly Financial Reporting",
      categoryId: finance.id,
      content: "A systematic process for creating and reviewing monthly financial reports.",
      steps: [
        { title: "Data Collection", description: "Gather all financial data from relevant systems." },
        { title: "Reconciliation", description: "Reconcile accounts and transactions for accuracy." },
        { title: "Report Generation", description: "Generate P&L, balance sheet, and cash flow statements." },
        { title: "Variance Analysis", description: "Compare actual vs. budgeted figures and explain variances." },
        { title: "Executive Summary", description: "Create a summary of key findings and recommendations." },
        { title: "Department Distribution", description: "Share relevant sections with department heads." },
        { title: "Team Review", description: "Conduct a financial review meeting with leadership." },
        { title: "Action Planning", description: "Develop action plans for addressing issues." },
        { title: "Documentation", description: "Archive reports and meeting notes for future reference." },
        { title: "System Updates", description: "Update forecasts and budgets based on actual performance." },
        { title: "Compliance Check", description: "Ensure all regulatory requirements are satisfied." },
        { title: "External Reporting", description: "Prepare any necessary reports for external stakeholders." }
      ],
      isAiGenerated: true
    });

    // Add sample activities
    await this.createActivity({
      userId: user.id,
      type: "added_tool",
      description: "Added a new CRM tool to your Sales stack",
      metadata: { toolId: 6 } // HubSpot
    });

    await this.createActivity({
      userId: user.id,
      type: "generated_sop",
      description: "Generated new SOP for Customer Onboarding",
      metadata: { sopId: 1 }
    });

    await this.createActivity({
      userId: user.id,
      type: "subscription_renewed",
      description: "Subscription renewed for Accounting software",
      metadata: { toolId: 1 } // QuickBooks
    });

    // Add sample recommendations
    await this.createRecommendation({
      userId: user.id,
      title: "Upgrade your CRM solution",
      description: "Your current tool lacks automation features. Consider upgrading to an enterprise solution to increase sales efficiency.",
      categoryId: sales.id,
      type: "upgrade",
      status: "pending"
    });

    await this.createRecommendation({
      userId: user.id,
      title: "Marketing automation opportunity",
      description: "You could save 5 hours weekly by implementing email marketing automation. Here are some affordable options.",
      categoryId: marketing.id,
      type: "improvement",
      status: "pending"
    });

    await this.createRecommendation({
      userId: user.id,
      title: "Missing customer support tool",
      description: "Based on your business growth, it's time to implement a dedicated customer support system. Here are recommendations.",
      categoryId: customer.id,
      type: "new_tool",
      status: "pending"
    });
  }

  // Password Vault methods
  async getPasswordVaultItems(params: {
    userId: number,
    businessEntityId?: number,
    type?: VaultItemType,
    toolId?: number,
    companyId?: number,
    favorite?: boolean,
    tags?: string[]
  }): Promise<PasswordVault[]> {
    let items = Array.from(this.passwordVaultItems.values())
      .filter(item => item.userId === params.userId);
    
    if (params.businessEntityId !== undefined) {
      items = items.filter(item => item.businessEntityId === params.businessEntityId);
    }
    
    if (params.type) {
      items = items.filter(item => item.type === params.type);
    }
    
    if (params.toolId !== undefined) {
      items = items.filter(item => item.toolId === params.toolId);
    }
    
    if (params.companyId !== undefined) {
      items = items.filter(item => item.companyId === params.companyId);
    }
    
    if (params.favorite !== undefined) {
      items = items.filter(item => item.favorite === params.favorite);
    }
    
    if (params.tags && params.tags.length > 0) {
      items = items.filter(item => {
        if (!item.tags || item.tags.length === 0) return false;
        return params.tags!.some(tag => item.tags!.includes(tag));
      });
    }
    
    return items;
  }

  async getPasswordVaultItemById(id: number): Promise<PasswordVault | undefined> {
    return this.passwordVaultItems.get(id);
  }

  async createPasswordVaultItem(insertItem: InsertPasswordVault): Promise<PasswordVault> {
    const id = this.passwordVaultIdCounter++;
    const now = new Date();
    const vaultItem: PasswordVault = { 
      ...insertItem, 
      id, 
      createdAt: now,
      updatedAt: now 
    };
    this.passwordVaultItems.set(id, vaultItem);
    return vaultItem;
  }

  async updatePasswordVaultItem(id: number, updateData: Partial<InsertPasswordVault>): Promise<PasswordVault | undefined> {
    const existingItem = this.passwordVaultItems.get(id);
    if (!existingItem) return undefined;
    
    const now = new Date();
    const updatedItem: PasswordVault = { 
      ...existingItem, 
      ...updateData, 
      updatedAt: now 
    };
    
    this.passwordVaultItems.set(id, updatedItem);
    return updatedItem;
  }

  async deletePasswordVaultItem(id: number): Promise<boolean> {
    return this.passwordVaultItems.delete(id);
  }

  // Automation Score methods
  async calculateAutomationScore(userId: number, businessEntityId?: number): Promise<{
    score: number,
    description: string,
    recommendations: Array<{ title: string, description: string, type: string }>
  }> {
    // Get all tools for user
    const userTools = await this.getTechStack(userId, businessEntityId);
    
    // Calculate metrics for automation score
    const toolsByCategory: Record<string, number> = {};
    const toolsByTier: Record<string, number> = {};
    const totalTools = userTools.length;
    
    // Count tools by category and tier
    for (const item of userTools) {
      const categoryId = item.tool.categoryId;
      const tierSlug = item.tool.tierSlug;
      
      toolsByCategory[categoryId] = (toolsByCategory[categoryId] || 0) + 1;
      toolsByTier[tierSlug] = (toolsByTier[tierSlug] || 0) + 1;
    }
    
    // Get all categories to calculate coverage
    const allCategories = await this.getCategories();
    const totalCategories = allCategories.length;
    
    // Calculate score using shared utility
    const result = calculateScore({
      toolsCoverage: {
        totalTools,
        totalCategories,
        categoriesWithTools: Object.keys(toolsByCategory).length
      },
      toolsIntegration: {
        totalTools,
        integratedPairs: Math.floor(totalTools * 0.3) // Placeholder: assume 30% of tools are integrated
      },
      automationSophistication: {
        toolsByTier,
        totalTools
      },
      processDocumentation: {
        sopCount: (await this.getSops(userId, undefined, businessEntityId)).length,
        totalCategories,
        averageSopSteps: 5 // Placeholder: average number of steps
      }
    });
    
    // Get description of score
    const description = getAutomationScoreDescription(result.score);
    
    // Generate recommendations
    const recommendations = generateAutomationRecommendations(result, allCategories);
    
    return {
      score: result.score,
      description,
      recommendations
    };
  }

  // Automation Score 2.0 methods
  async getAutomationScore(businessEntityId?: number): Promise<AutomationScoreDetails> {
    // If we already have cached automation score data, return it
    if (this.automationScoreDetails) {
      return this.automationScoreDetails;
    }

    // Generate fresh automation score data
    const moduleScores: ModuleAutomationScore[] = [
      {
        moduleId: "finance",
        moduleName: "Finance",
        score: 76,
        color: "#34D399",
        automatedProcessCount: 8,
        manualProcessCount: 2,
        totalProcesses: 10,
        recommendations: [
          {
            id: "fin-rec-1",
            moduleId: "finance",
            title: "Implement invoice automation",
            description: "Connect your accounting software with your payment processor to automate invoice generation and payment tracking.",
            difficulty: "medium",
            impactScore: 8,
            timeToImplement: "4-6 hours",
            toolsRequired: ["QuickBooks", "Stripe"],
            costEstimate: "$0 (using existing tools)",
            implemented: false,
            inProgress: false
          }
        ]
      },
      {
        moduleId: "operations",
        moduleName: "Operations",
        score: 62,
        color: "#FBBF24",
        automatedProcessCount: 5,
        manualProcessCount: 5,
        totalProcesses: 10,
        recommendations: [
          {
            id: "ops-rec-1",
            moduleId: "operations",
            title: "Automate inventory notifications",
            description: "Set up automatic alerts when inventory reaches reorder thresholds to prevent stockouts.",
            difficulty: "easy",
            impactScore: 7,
            timeToImplement: "2-3 hours",
            toolsRequired: ["Inventory System", "Slack"],
            costEstimate: "$0 (using existing tools)",
            implemented: false,
            inProgress: false
          }
        ]
      },
      {
        moduleId: "marketing",
        moduleName: "Marketing",
        score: 85,
        color: "#34D399",
        automatedProcessCount: 9,
        manualProcessCount: 1,
        totalProcesses: 10,
        recommendations: [
          {
            id: "mkt-rec-1",
            moduleId: "marketing",
            title: "Implement A/B testing automation",
            description: "Set up automated A/B testing for email campaigns to optimize open rates and conversions.",
            difficulty: "medium",
            impactScore: 6,
            timeToImplement: "5-8 hours",
            toolsRequired: ["Mailchimp", "Google Analytics"],
            costEstimate: "$0-$29/month (premium features)",
            implemented: false,
            inProgress: true
          }
        ]
      },
      {
        moduleId: "sales",
        moduleName: "Sales",
        score: 58,
        color: "#F59E0B",
        automatedProcessCount: 5,
        manualProcessCount: 6,
        totalProcesses: 11,
        recommendations: [
          {
            id: "sales-rec-1",
            moduleId: "sales",
            title: "Automate lead scoring",
            description: "Implement an automated lead scoring system to prioritize high-value prospects for your sales team.",
            difficulty: "complex",
            impactScore: 9,
            timeToImplement: "8-12 hours",
            toolsRequired: ["CRM", "Marketing Automation Tool"],
            costEstimate: "$50-$100/month (additional features)",
            implemented: false,
            inProgress: false
          }
        ]
      },
      {
        moduleId: "customer",
        moduleName: "Customer",
        score: 71,
        color: "#34D399",
        automatedProcessCount: 7,
        manualProcessCount: 3,
        totalProcesses: 10,
        recommendations: [
          {
            id: "cust-rec-1",
            moduleId: "customer",
            title: "Implement customer feedback automation",
            description: "Set up triggered NPS surveys based on customer lifecycle events to gather timely feedback.",
            difficulty: "easy",
            impactScore: 7,
            timeToImplement: "3-4 hours",
            toolsRequired: ["Customer Feedback Tool", "CRM"],
            costEstimate: "$0-$29/month (depending on volume)",
            implemented: true,
            inProgress: false
          }
        ]
      }
    ];

    // Create tool integrations for the integration map
    const integrationMap: ToolIntegration[] = [
      {
        sourceToolId: "tool-1",
        sourceToolName: "QuickBooks",
        targetToolId: "tool-2",
        targetToolName: "Xero",
        integrationStatus: "active",
        dataFlow: "bi-directional"
      },
      {
        sourceToolId: "tool-3",
        sourceToolName: "Mailchimp",
        targetToolId: "tool-4",
        targetToolName: "Salesforce",
        integrationStatus: "active",
        dataFlow: "one-way"
      },
      {
        sourceToolId: "tool-5",
        sourceToolName: "Asana",
        targetToolId: "tool-6",
        targetToolName: "Slack",
        integrationStatus: "active",
        dataFlow: "bi-directional"
      },
      {
        sourceToolId: "tool-7",
        sourceToolName: "Google Analytics",
        targetToolId: "tool-3",
        targetToolName: "Mailchimp",
        integrationStatus: "partial",
        dataFlow: "one-way"
      }
    ];

    // Create automation tools
    const automationTools: AutomationTool[] = [
      {
        id: "tool-1",
        name: "QuickBooks",
        moduleId: "finance",
        moduleName: "Finance",
        category: "Accounting",
        automationTier: "advanced",
        integratedWith: ["tool-2", "tool-4"],
        processesAutomated: ["Invoice generation", "Expense tracking", "Tax preparation"],
        implementationStatus: "implemented"
      },
      {
        id: "tool-3",
        name: "Mailchimp",
        moduleId: "marketing",
        moduleName: "Marketing",
        category: "Email Marketing",
        automationTier: "advanced",
        integratedWith: ["tool-4", "tool-7"],
        processesAutomated: ["Email campaigns", "Audience segmentation", "Campaign analytics"],
        implementationStatus: "implemented"
      },
      {
        id: "tool-5",
        name: "Asana",
        moduleId: "operations",
        moduleName: "Operations",
        category: "Project Management",
        automationTier: "intermediate",
        integratedWith: ["tool-6"],
        processesAutomated: ["Task assignment", "Project timeline"],
        implementationStatus: "implemented"
      },
      {
        id: "tool-8",
        name: "Zendesk",
        moduleId: "customer",
        moduleName: "Customer",
        category: "Support",
        automationTier: "intermediate",
        integratedWith: ["tool-4"],
        processesAutomated: ["Ticket routing", "Customer communication"],
        implementationStatus: "implemented"
      }
    ];

    // Combine module recommendations into a single list
    const allRecommendations: AutomationRecommendation[] = moduleScores.flatMap(
      module => module.recommendations
    );
    
    // Add more cross-functional recommendations
    allRecommendations.push({
      id: "cross-rec-1",
      moduleId: "cross-functional",
      title: "Implement cross-department workflow automation",
      description: "Connect your project management, CRM, and communication tools to automate information flow across departments.",
      difficulty: "complex",
      impactScore: 9,
      timeToImplement: "10-15 hours",
      toolsRequired: ["Zapier", "Slack", "Asana", "Salesforce"],
      costEstimate: "$49-$99/month",
      implemented: false,
      inProgress: false
    });

    // Calculate overall score (weighted average of module scores)
    const totalWeight = moduleScores.length;
    const weightedSum = moduleScores.reduce((sum, module) => sum + module.score, 0);
    const overallScore = Math.round(weightedSum / totalWeight);

    // Calculate component scores
    const toolsCoverageScore = 72;
    const toolsIntegrationScore = 68;
    const automationSophisticationScore = 76;
    const processDocumentationScore = 65;

    // Create the complete automation score object
    const automationScoreDetails: AutomationScoreDetails = {
      overallScore,
      moduleScores,
      toolsCoverageScore,
      toolsIntegrationScore,
      automationSophisticationScore,
      processDocumentationScore,
      integrationMap,
      automationTools,
      recommendations: allRecommendations
    };

    // Cache the result
    this.automationScoreDetails = automationScoreDetails;
    
    return automationScoreDetails;
  }

  async updateAutomationRecommendation(id: string, updates: { implemented?: boolean, inProgress?: boolean }): Promise<AutomationRecommendation> {
    // Ensure we have automation score data loaded
    if (!this.automationScoreDetails) {
      await this.getAutomationScore();
    }

    // Find the recommendation in our stored data
    const recommendation = this.automationScoreDetails!.recommendations.find(rec => rec.id === id);
    
    if (!recommendation) {
      throw new Error(`Recommendation with ID ${id} not found`);
    }
    
    // Update the recommendation
    if (updates.implemented !== undefined) {
      recommendation.implemented = updates.implemented;
      // If implemented is set to true, automatically set inProgress to false
      if (updates.implemented) {
        recommendation.inProgress = false;
      }
    }
    
    if (updates.inProgress !== undefined) {
      recommendation.inProgress = updates.inProgress;
      // If inProgress is set to true, ensure implemented is false
      if (updates.inProgress) {
        recommendation.implemented = false;
      }
    }
    
    // Also update the same recommendation in the module-specific lists
    for (const moduleScore of this.automationScoreDetails!.moduleScores) {
      const moduleRec = moduleScore.recommendations.find(rec => rec.id === id);
      if (moduleRec) {
        if (updates.implemented !== undefined) {
          moduleRec.implemented = updates.implemented;
          if (updates.implemented) {
            moduleRec.inProgress = false;
          }
        }
        
        if (updates.inProgress !== undefined) {
          moduleRec.inProgress = updates.inProgress;
          if (updates.inProgress) {
            moduleRec.implemented = false;
          }
        }
      }
    }
    
    return recommendation;
  }
}

export const storage = new MemStorage();
