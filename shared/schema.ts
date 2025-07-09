import { pgTable, text, serial, integer, boolean, timestamp, json, real, date, jsonb, numeric } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { 
  AssetCategory, 
  BrandAssetType, 
  DocumentType, 
  MediaType, 
  TemplateType,
  FileFormat, 
  AssetStatus,
  AssetVisibility,
  AssetTag
} from "./assetTypes";

// Define password vault item types
export enum VaultItemType {
  PASSWORD = 'password',
  SECURE_NOTE = 'secure_note',
  API_KEY = 'api_key',
  OTP = 'otp',
  CREDIT_CARD = 'credit_card'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done'
}

export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

// User authentication schema (keeping from original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true
});

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  TEAM_LEAD = 'team_lead',
  ANALYST = 'analyst',
  VIEWER = 'viewer'
}

// Gamification enums and types
export enum AchievementCategory {
  AUTOMATION = 'automation',
  PRODUCTIVITY = 'productivity',
  ENGAGEMENT = 'engagement',
  FINANCIAL = 'financial',
  MARKETING = 'marketing',
  OPERATIONS = 'operations',
  SALES = 'sales',
  SPECIAL = 'special'
}

// Print on Demand (POD) enums and types
export enum ProductCategory {
  APPAREL = 'apparel',
  ACCESSORIES = 'accessories',
  HOME_DECOR = 'home_decor',
  STATIONERY = 'stationery',
  PROMOTIONAL = 'promotional',
  CUSTOM = 'custom'
}

export enum ProductType {
  // Apparel
  TSHIRT = 'tshirt',
  HOODIE = 'hoodie',
  SWEATSHIRT = 'sweatshirt',
  TANK_TOP = 'tank_top',
  LONG_SLEEVE = 'long_sleeve',
  POLO = 'polo',
  HAT = 'hat',
  JACKET = 'jacket',
  
  // Accessories
  TOTE_BAG = 'tote_bag',
  BACKPACK = 'backpack',
  MUG = 'mug',
  WATER_BOTTLE = 'water_bottle',
  PHONE_CASE = 'phone_case',
  
  // Home Decor
  POSTER = 'poster',
  CANVAS = 'canvas',
  PILLOW = 'pillow',
  BLANKET = 'blanket',
  WALL_ART = 'wall_art',
  
  // Stationery
  STICKER = 'sticker',
  NOTEBOOK = 'notebook',
  GREETING_CARD = 'greeting_card',
  MOUSEPAD = 'mousepad',
  
  // Promotional
  BUSINESS_CARD = 'business_card',
  BANNER = 'banner',
  FLYER = 'flyer',
  BROCHURE = 'brochure',
  
  // Custom
  CUSTOM_ITEM = 'custom_item'
}

export enum PrintArea {
  FRONT = 'front',
  BACK = 'back',
  SLEEVE = 'sleeve',
  ALL_OVER = 'all_over',
  POCKET = 'pocket',
  INSIDE = 'inside',
  CUSTOM = 'custom'
}

export enum PodOrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  IN_PRODUCTION = 'in_production',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

export enum AchievementTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond'
}

// Achievement table
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").$type<AchievementCategory>().notNull(),
  tier: text("tier").$type<AchievementTier>().notNull(),
  pointsValue: integer("points_value").notNull().default(10),
  iconUrl: text("icon_url"),
  criteria: jsonb("criteria").notNull(), // Ex: {"automationScore": 80, "minToolsCount": 5}
  isHidden: boolean("is_hidden").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true
});

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

// User Achievements table (tracks which achievements users have earned)
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  earnedAt: timestamp("earned_at").defaultNow(),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  metadata: jsonb("metadata").default({})
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true
});

export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;

// Reward Points table
export const rewardPoints = pgTable("reward_points", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  points: integer("points").notNull(),
  source: text("source").notNull(), // achievement, streak, task_completion, etc.
  sourceId: integer("source_id"), // Reference to id in source table if applicable
  description: text("description").notNull(),
  awardedAt: timestamp("awarded_at").defaultNow()
});

export const insertRewardPointSchema = createInsertSchema(rewardPoints).omit({
  id: true,
  awardedAt: true
});

export type InsertRewardPoint = z.infer<typeof insertRewardPointSchema>;
export type RewardPoint = typeof rewardPoints.$inferSelect;

// User Streaks table (for tracking daily/weekly engagement)
export const userStreaks = pgTable("user_streaks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: date("last_activity_date").notNull(),
  streakType: text("streak_type").notNull().default("daily"), // daily, weekly
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertUserStreakSchema = createInsertSchema(userStreaks).omit({
  id: true,
  updatedAt: true
});

export type InsertUserStreak = z.infer<typeof insertUserStreakSchema>;
export type UserStreak = typeof userStreaks.$inferSelect;

export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  role: text("role").$type<UserRole>(),
  permissions: json("permissions").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});

export const insertUserRoleSchema = createInsertSchema(userRoles).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;
export type UserRoleRecord = typeof userRoles.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Business Entities (companies, brands, or divisions you own)
export const businessEntities = pgTable("business_entities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  industry: text("industry"),
  website: text("website"),
  logo: text("logo"),
  primaryColor: text("primary_color"),
  parentEntityId: integer("parent_entity_id").references(() => businessEntities.id),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id)
});

export const insertBusinessEntitySchema = createInsertSchema(businessEntities).omit({
  id: true,
  createdAt: true
});

export type InsertBusinessEntity = z.infer<typeof insertBusinessEntitySchema>;
export type BusinessEntity = typeof businessEntities.$inferSelect;

// External Companies (clients, partners, vendors)
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // client, partner, vendor, etc.
  industry: text("industry"),
  size: text("size"), // small, medium, large, enterprise
  website: text("website"),
  logo: text("logo"),
  primaryContact: text("primary_contact"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  notes: text("notes"),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id)
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true
});

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

// Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Subcategories
export const subcategories = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  categoryId: integer("category_id").notNull(),
});

export const insertSubcategorySchema = createInsertSchema(subcategories).omit({
  id: true,
});

export type InsertSubcategory = z.infer<typeof insertSubcategorySchema>;
export type Subcategory = typeof subcategories.$inferSelect;

// Tool pricing tiers
export const pricingTiers = pgTable("pricing_tiers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertPricingTierSchema = createInsertSchema(pricingTiers).omit({
  id: true,
});

export type InsertPricingTier = z.infer<typeof insertPricingTierSchema>;
export type PricingTier = typeof pricingTiers.$inferSelect;

// Tools
export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  website: text("website"),
  logo: text("logo"),
  categoryId: integer("category_id").notNull(),
  subcategoryId: integer("subcategory_id"),
  tierSlug: text("tier_slug").notNull(), // free, low-cost, enterprise
  monthlyPrice: real("monthly_price"),
  features: json("features").notNull().$type<string[]>(),
  pros: json("pros").notNull().$type<string[]>(),
  cons: json("cons").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertToolSchema = createInsertSchema(tools).omit({
  id: true,
  createdAt: true,
});

export type InsertTool = z.infer<typeof insertToolSchema>;
export type Tool = typeof tools.$inferSelect;

// User's tech stack
export const techStack = pgTable("tech_stack", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  toolId: integer("tool_id").notNull(),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  activeSince: timestamp("active_since").defaultNow(),
  monthlyPrice: real("monthly_price"),
  notes: text("notes"),
});

export const insertTechStackSchema = createInsertSchema(techStack).omit({
  id: true,
});

export type InsertTechStack = z.infer<typeof insertTechStackSchema>;
export type TechStack = typeof techStack.$inferSelect;

// SOPs (Standard Operating Procedures)
export const sops = pgTable("sops", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  categoryId: integer("category_id").notNull(),
  subcategoryId: integer("subcategory_id"),
  content: text("content").notNull(),
  steps: json("steps").notNull().$type<{title: string, description: string}[]>(),
  isAiGenerated: boolean("is_ai_generated").default(true),
  videoUrl: text("video_url"), // Loom or other video demonstration URL
  videoType: text("video_type").default("loom"), // loom, youtube, vimeo, etc.
  videoDuration: integer("video_duration"), // Duration in seconds
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedAt: timestamp("updated_at"),
});

export const insertSopSchema = createInsertSchema(sops).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSop = z.infer<typeof insertSopSchema>;
export type Sop = typeof sops.$inferSelect;

// Activity tracking
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // e.g., "added_tool", "generated_sop", etc.
  description: text("description").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true, 
  createdAt: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// AI Recommendations
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id"),
  type: text("type").notNull(), // e.g., "upgrade", "new_tool", "improvement"
  status: text("status").default("pending"), // "pending", "implemented", "dismissed"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;

// Assets (branding, documents, media files)
export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull().$type<AssetCategory>(),
  type: text("type").notNull(), // Specific type within category (e.g., BrandAssetType, DocumentType)
  fileUrl: text("file_url").notNull(), // Storage URL
  fileFormat: text("file_format").notNull().$type<FileFormat>(),
  fileSizeKb: integer("file_size_kb"),
  status: text("status").notNull().$type<AssetStatus>().default(AssetStatus.ACTIVE),
  visibility: text("visibility").notNull().$type<AssetVisibility>().default(AssetVisibility.INTERNAL),
  version: text("version").default("1.0"),
  tags: json("tags").$type<AssetTag[]>().default([]),
  
  // Associations
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  companyId: integer("company_id").references(() => companies.id), // For customer-specific assets
  
  // Audit
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedAt: timestamp("updated_at"),
  updatedBy: integer("updated_by").references(() => users.id)
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Asset = typeof assets.$inferSelect;

// Financial transactions
export const financialTransactions = pgTable("financial_transactions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // income, expense, investment, transfer
  category: text("category").notNull(), // subscription, salary, contract, etc.
  amount: real("amount").notNull(),
  currency: text("currency").default("USD"),
  description: text("description"),
  date: date("date").notNull(),
  isRecurring: boolean("is_recurring").default(false),
  recurringFrequency: text("recurring_frequency"), // monthly, yearly, etc.
  
  // Associations
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  companyId: integer("company_id").references(() => companies.id), // For customer/vendor transactions
  toolId: integer("tool_id").references(() => tools.id), // For tool subscriptions
  
  // Metadata
  tags: json("tags").$type<string[]>().default([]),
  
  // Audit
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id)
});

export const insertFinancialTransactionSchema = createInsertSchema(financialTransactions).omit({
  id: true,
  createdAt: true
});

export type InsertFinancialTransaction = z.infer<typeof insertFinancialTransactionSchema>;
export type FinancialTransaction = typeof financialTransactions.$inferSelect;

// Print on Demand Product Catalog
export const podProducts = pgTable("pod_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").$type<ProductCategory>().notNull(),
  type: text("type").$type<ProductType>().notNull(),
  basePrice: real("base_price").notNull(),
  costPrice: real("cost_price").notNull(),
  recommendedRetailPrice: real("recommended_retail_price").notNull(),
  currency: text("currency").default("USD"),
  availableColors: json("available_colors").$type<string[]>().default([]),
  availableSizes: json("available_sizes").$type<string[]>().default([]),
  printAreas: json("print_areas").$type<PrintArea[]>().default([]),
  materialInfo: text("material_info"),
  weight: real("weight"), // In grams
  dimensions: json("dimensions").$type<{ width: number, height: number, depth: number }>(),
  hasMockupTemplate: boolean("has_mockup_template").default(false),
  mockupTemplateUrl: text("mockup_template_url"),
  thumbnailUrl: text("thumbnail_url"),
  isActive: boolean("is_active").default(true),
  isPopular: boolean("is_popular").default(false),
  minOrderQuantity: integer("min_order_quantity").default(1),
  quantityAvailable: integer("quantity_available"),
  estimatedProductionDays: integer("estimated_production_days").default(3),
  tags: json("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});

export const insertPodProductSchema = createInsertSchema(podProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertPodProduct = z.infer<typeof insertPodProductSchema>;
export type PodProduct = typeof podProducts.$inferSelect;

// User's Print on Demand Stores
export const podStores = pgTable("pod_stores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  name: text("name").notNull(),
  description: text("description"),
  logo: text("logo"),
  bannerImage: text("banner_image"),
  primaryColor: text("primary_color").default("#3B82F6"),
  accentColor: text("accent_color").default("#2563EB"), 
  websiteUrl: text("website_url"),
  customDomain: text("custom_domain"),
  storeSlug: text("store_slug").notNull(), // For URL path: /pod/store/{storeSlug}
  supportEmail: text("support_email"),
  supportPhone: text("support_phone"),
  policyReturns: text("policy_returns"), 
  policyShipping: text("policy_shipping"),
  defaultCurrency: text("default_currency").default("USD"),
  isActive: boolean("is_active").default(true),
  profitMarginPercentage: real("profit_margin_percentage").default(30),
  paymentMethods: json("payment_methods").$type<string[]>().default(["stripe"]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});

export const insertPodStoreSchema = createInsertSchema(podStores).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertPodStore = z.infer<typeof insertPodStoreSchema>;
export type PodStore = typeof podStores.$inferSelect;

// Product Designs (uploaded by users for their stores)
export const podDesigns = pgTable("pod_designs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  storeId: integer("store_id").notNull().references(() => podStores.id),
  name: text("name").notNull(),
  description: text("description"),
  designImageUrl: text("design_image_url").notNull(),
  designPreviewUrl: text("design_preview_url"),
  fileFormat: text("file_format").$type<FileFormat>().notNull(),
  fileSizeKb: integer("file_size_kb"),
  designType: text("design_type").default("original"), // original, ai_generated, licensed
  tags: json("tags").$type<string[]>().default([]),
  colorProfile: text("color_profile").default("RGB"),
  width: integer("width"), // In pixels
  height: integer("height"), // In pixels
  transparencySupport: boolean("transparency_support").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});

export const insertPodDesignSchema = createInsertSchema(podDesigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertPodDesign = z.infer<typeof insertPodDesignSchema>;
export type PodDesign = typeof podDesigns.$inferSelect;

// Store Products (products with designs ready to sell)
export const podStoreProducts = pgTable("pod_store_products", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => podStores.id),
  productId: integer("product_id").notNull().references(() => podProducts.id),
  designId: integer("design_id").notNull().references(() => podDesigns.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  currency: text("currency").default("USD"),
  sku: text("sku").notNull(),
  mockupImageUrl: text("mockup_image_url").notNull(),
  availableColors: json("available_colors").$type<string[]>().default([]),
  availableSizes: json("available_sizes").$type<string[]>().default([]),
  printArea: text("print_area").$type<PrintArea>().notNull(),
  printPositionX: real("print_position_x").default(0), // % from left
  printPositionY: real("print_position_y").default(0), // % from top  
  printWidth: real("print_width").default(100), // % of available print area
  printHeight: real("print_height").default(100), // % of available print area
  isVisible: boolean("is_visible").default(true),
  isFeatured: boolean("is_featured").default(false),
  tags: json("tags").$type<string[]>().default([]),
  salesCount: integer("sales_count").default(0),
  inStockQuantity: integer("in_stock_quantity"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});

export const insertPodStoreProductSchema = createInsertSchema(podStoreProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertPodStoreProduct = z.infer<typeof insertPodStoreProductSchema>;
export type PodStoreProduct = typeof podStoreProducts.$inferSelect;

// POD Orders
export const podOrders = pgTable("pod_orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  storeId: integer("store_id").notNull().references(() => podStores.id),
  userId: integer("user_id").references(() => users.id), // Store owner
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  shippingAddress: json("shipping_address").notNull(),
  billingAddress: json("billing_address").notNull(),
  totalAmount: real("total_amount").notNull(),
  shippingCost: real("shipping_cost").notNull(),
  taxAmount: real("tax_amount").notNull(),
  currency: text("currency").default("USD"),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed, refunded
  transactionId: text("transaction_id"),
  orderStatus: text("order_status").$type<PodOrderStatus>().default(PodOrderStatus.PENDING),
  fulfillmentStatus: text("fulfillment_status").default("unfulfilled"), // unfulfilled, partially_fulfilled, fulfilled
  trackingNumber: text("tracking_number"),
  carrierName: text("carrier_name"),
  estimatedDeliveryDate: date("estimated_delivery_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});

export const insertPodOrderSchema = createInsertSchema(podOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertPodOrder = z.infer<typeof insertPodOrderSchema>;
export type PodOrder = typeof podOrders.$inferSelect;

// Order Items
export const podOrderItems = pgTable("pod_order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => podOrders.id),
  storeProductId: integer("store_product_id").notNull().references(() => podStoreProducts.id),
  quantity: integer("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  color: text("color"),
  size: text("size"),
  printInstructions: text("print_instructions"),
  customizationDetails: json("customization_details"),
  status: text("status").default("pending"), // pending, in_production, shipped, delivered, returned
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});

export const insertPodOrderItemSchema = createInsertSchema(podOrderItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertPodOrderItem = z.infer<typeof insertPodOrderItemSchema>;
export type PodOrderItem = typeof podOrderItems.$inferSelect;

// Enhanced activity tracking (with financial impact)
export const enhancedActivities = pgTable("enhanced_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  companyId: integer("company_id").references(() => companies.id),
  
  // Activity details
  type: text("type").notNull(), // e.g., "added_tool", "generated_sop", "customer_interaction"
  description: text("description").notNull(),
  category: text("category").notNull(), // e.g., "finance", "operations", "marketing"
  
  // Financial impact
  financialImpact: real("financial_impact"), // Positive or negative monetary value
  impactType: text("impact_type"), // cost_saving, revenue_increase, expense, etc.
  impactTimeframe: text("impact_timeframe"), // immediate, monthly, yearly
  
  // Associations
  toolId: integer("tool_id").references(() => tools.id),
  assetId: integer("asset_id").references(() => assets.id),
  
  // Advanced metadata
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEnhancedActivitySchema = createInsertSchema(enhancedActivities).omit({
  id: true, 
  createdAt: true,
});

export type InsertEnhancedActivity = z.infer<typeof insertEnhancedActivitySchema>;
export type EnhancedActivity = typeof enhancedActivities.$inferSelect;

// Meetings
export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  timezone: text("timezone").default("UTC").notNull(),
  location: text("location"), // Physical location or virtual link
  meetingType: text("meeting_type").default("virtual").notNull(), // 'virtual', 'in-person', 'hybrid'
  recurrence: text("recurrence"), // 'none', 'daily', 'weekly', 'monthly'
  createdBy: integer("created_by").notNull().references(() => users.id),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  notifyWhatsApp: boolean("notify_whatsapp").default(false),
  notifyEmail: boolean("notify_email").default(true),
  reminderMinutes: integer("reminder_minutes").default(15),
  agendaItems: jsonb("agenda_items").default([]),
  attendees: jsonb("attendees").default([]),
  notes: text("notes"),
  files: jsonb("files").default([]),
  status: text("status").default("scheduled").notNull(), // 'scheduled', 'in_progress', 'completed', 'cancelled'
});

export const insertMeetingSchema = createInsertSchema(meetings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type Meeting = typeof meetings.$inferSelect;

// WhatsApp Notification Settings
export const whatsAppSettings = pgTable("whatsapp_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  phoneNumber: text("phone_number").notNull(),
  countryCode: text("country_code").notNull(),
  isActive: boolean("is_active").default(true),
  notifyMeetings: boolean("notify_meetings").default(true),
  notifyDeadlines: boolean("notify_deadlines").default(true),
  notifyAssignments: boolean("notify_assignments").default(true),
  notifyRecommendations: boolean("notify_recommendations").default(false),
  notifyCostAlerts: boolean("notify_cost_alerts").default(false),
  quietHoursStart: text("quiet_hours_start"), // Time in 24h format 'HH:MM'
  quietHoursEnd: text("quiet_hours_end"),
  timezone: text("timezone").default("UTC"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});

export const insertWhatsAppSettingsSchema = createInsertSchema(whatsAppSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWhatsAppSettings = z.infer<typeof insertWhatsAppSettingsSchema>;
export type WhatsAppSettings = typeof whatsAppSettings.$inferSelect;

// WhatsApp Group Connections
export const whatsAppGroups = pgTable("whatsapp_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  groupId: text("group_id").notNull(), // WhatsApp group identifier
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  createdBy: integer("created_by").notNull().references(() => users.id),
  isActive: boolean("is_active").default(true),
  categoryId: integer("category_id").references(() => categories.id),
  notificationTypes: jsonb("notification_types").default(["meetings", "deadlines"]), // Types of notifications to send to this group
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastMessage: timestamp("last_message"),
});

export const insertWhatsAppGroupSchema = createInsertSchema(whatsAppGroups).omit({
  id: true,
  createdAt: true,
  lastMessage: true,
});

export type InsertWhatsAppGroup = z.infer<typeof insertWhatsAppGroupSchema>;
export type WhatsAppGroup = typeof whatsAppGroups.$inferSelect;

// Order Status Types
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  ON_HOLD = 'on_hold',
  BACKORDERED = 'backordered',
  COMPLETED = 'completed'
}

// Payment Status Types
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
}

// Sales Pipeline Stage Types
export enum SalesPipelineStage {
  LEAD = 'lead',
  CONTACTED = 'contacted',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
  ON_HOLD = 'on_hold'
}

// Sales Priority Types
export enum SalesPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Deal Type
export enum DealType {
  NEW_BUSINESS = 'new_business',
  RENEWAL = 'renewal',
  EXPANSION = 'expansion',
  UPSELL = 'upsell',
  CROSS_SELL = 'cross_sell',
  PARTNERSHIP = 'partnership'
}

// Deal Source
export enum DealSource {
  WEBSITE = 'website',
  COLD_CALL = 'cold_call',
  EMAIL = 'email',
  SOCIAL_MEDIA = 'social_media',
  REFERRAL = 'referral',
  EVENT = 'event',
  PARTNER = 'partner',
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
  ORGANIC = 'organic',
  PAID_ADVERTISING = 'paid_advertising'
}

// Sales Deals Table
export const salesDeals = pgTable("sales_deals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  dealNumber: text("deal_number").notNull().unique(),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  stage: text("stage", { enum: [SalesPipelineStage.LEAD, SalesPipelineStage.CONTACTED, SalesPipelineStage.PROPOSAL, SalesPipelineStage.NEGOTIATION, SalesPipelineStage.CLOSED_WON, SalesPipelineStage.CLOSED_LOST, SalesPipelineStage.ON_HOLD] }).notNull().default(SalesPipelineStage.LEAD),
  value: numeric("value").notNull(),
  probability: integer("probability").notNull().default(0),
  priority: text("priority", { enum: [SalesPriority.LOW, SalesPriority.MEDIUM, SalesPriority.HIGH, SalesPriority.URGENT] }).notNull().default(SalesPriority.MEDIUM),
  expectedCloseDate: timestamp("expected_close_date"),
  type: text("type", { enum: [DealType.NEW_BUSINESS, DealType.RENEWAL, DealType.EXPANSION, DealType.UPSELL, DealType.CROSS_SELL, DealType.PARTNERSHIP] }).notNull().default(DealType.NEW_BUSINESS),
  source: text("source", { enum: [DealSource.WEBSITE, DealSource.COLD_CALL, DealSource.EMAIL, DealSource.SOCIAL_MEDIA, DealSource.REFERRAL, DealSource.EVENT, DealSource.PARTNER, DealSource.INBOUND, DealSource.OUTBOUND, DealSource.ORGANIC, DealSource.PAID_ADVERTISING] }).notNull().default(DealSource.WEBSITE),
  tags: text("tags").array(),
  notes: text("notes"),
  assignedTo: integer("assigned_to").references(() => users.id),
  assigneeName: text("assignee_name"),
  lastActivity: text("last_activity"),
  lastActivityDate: timestamp("last_activity_date"),
  customerId: integer("customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  closedAt: timestamp("closed_at"),
});

export const insertSalesDealSchema = createInsertSchema(salesDeals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  closedAt: true,
});

export type InsertSalesDeal = z.infer<typeof insertSalesDealSchema>;
export type SalesDeal = typeof salesDeals.$inferSelect;

// Sales Activities Table
export const salesActivities = pgTable("sales_activities", {
  id: serial("id").primaryKey(),
  dealId: integer("deal_id").references(() => salesDeals.id).notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
  userName: text("user_name"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSalesActivitySchema = createInsertSchema(salesActivities).omit({
  id: true,
  createdAt: true,
});

export type InsertSalesActivity = z.infer<typeof insertSalesActivitySchema>;
export type SalesActivity = typeof salesActivities.$inferSelect;

// Sales Forecasts Table
export const salesForecasts = pgTable("sales_forecasts", {
  id: serial("id").primaryKey(),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  period: text("period").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  forecastAmount: numeric("forecast_amount").notNull(),
  actualAmount: numeric("actual_amount"),
  deals: integer("deals").notNull().default(0),
  closedDeals: integer("closed_deals").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSalesForecastSchema = createInsertSchema(salesForecasts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSalesForecast = z.infer<typeof insertSalesForecastSchema>;
export type SalesForecast = typeof salesForecasts.$inferSelect;

// Orders Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  customerId: integer("customer_id"),
  status: text("status").notNull().default(OrderStatus.PENDING),
  paymentStatus: text("payment_status").notNull().default(PaymentStatus.PENDING),
  total: numeric("total").notNull(),
  items: jsonb("items").notNull(),
  shippingAddress: jsonb("shipping_address"),
  billingAddress: jsonb("billing_address"),
  shippingMethod: text("shipping_method"),
  trackingNumber: text("tracking_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Customer Inquiry Status Types
export enum InquiryStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  WAITING_CUSTOMER = 'waiting_customer',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

// Customer Inquiry Priority Types
export enum InquiryPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Customer Inquiry Source Types
export enum InquirySource {
  EMAIL = 'email',
  PHONE = 'phone',
  WEBSITE = 'website',
  SOCIAL_MEDIA = 'social_media',
  IN_PERSON = 'in_person',
  WHATSAPP = 'whatsapp'
}

// Customer Inquiries Table
export const customerInquiries = pgTable("customer_inquiries", {
  id: serial("id").primaryKey(),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default(InquiryStatus.NEW),
  priority: text("priority").notNull().default(InquiryPriority.MEDIUM),
  source: text("source").notNull().default(InquirySource.EMAIL),
  assignedTo: integer("assigned_to").references(() => users.id),
  relatedOrderId: integer("related_order_id").references(() => orders.id),
  tags: text("tags").array(),
  responseHistory: jsonb("response_history").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const insertCustomerInquirySchema = createInsertSchema(customerInquiries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  resolvedAt: true,
});

export type InsertCustomerInquiry = z.infer<typeof insertCustomerInquirySchema>;
export type CustomerInquiry = typeof customerInquiries.$inferSelect;

// Competitor Size Types
export enum CompetitorSize {
  STARTUP = 'startup',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ENTERPRISE = 'enterprise'
}

// Competitor Threat Level
export enum ThreatLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Competitor Table
export const competitors = pgTable("competitors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  website: text("website"),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id).notNull(),
  description: text("description"),
  size: text("size"),
  foundedYear: integer("founded_year"),
  location: text("location"),
  employeeCount: integer("employee_count"),
  estimatedRevenue: numeric("estimated_revenue"),
  marketShare: numeric("market_share"),
  strengthsWeaknesses: jsonb("strengths_weaknesses").default({}),
  threatLevel: text("threat_level").default(ThreatLevel.MEDIUM),
  notes: text("notes"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCompetitorSchema = createInsertSchema(competitors).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;
export type Competitor = typeof competitors.$inferSelect;

// Competitor Tools Table
export const competitorTools = pgTable("competitor_tools", {
  id: serial("id").primaryKey(),
  competitorId: integer("competitor_id").references(() => competitors.id).notNull(),
  toolName: text("tool_name").notNull(),
  toolCategory: text("tool_category"),
  estimatedMonthlyCost: numeric("estimated_monthly_cost"),
  features: text("features").array(),
  advantages: text("advantages"),
  disadvantages: text("disadvantages"),
  dateIdentified: timestamp("date_identified").defaultNow().notNull(),
  verificationSource: text("verification_source"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCompetitorToolSchema = createInsertSchema(competitorTools).omit({
  id: true,
  createdAt: true,
});

export type InsertCompetitorTool = z.infer<typeof insertCompetitorToolSchema>;
export type CompetitorTool = typeof competitorTools.$inferSelect;

// Employment Types
export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERN = 'intern',
  CONSULTANT = 'consultant',
  TEMPORARY = 'temporary'
}

// Employee Status
export enum EmployeeStatus {
  ACTIVE = 'active',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated',
  SUSPENDED = 'suspended',
  PROBATION = 'probation'
}

// Payroll Frequency
export enum PayrollFrequency {
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi_weekly',
  SEMI_MONTHLY = 'semi_monthly',
  MONTHLY = 'monthly'
}

// Employee table
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  title: text("title").notNull(),
  department: text("department").notNull(),
  reportsTo: integer("reports_to").references(() => employees.id),
  employmentType: text("employment_type", { enum: [EmploymentType.FULL_TIME, EmploymentType.PART_TIME, EmploymentType.CONTRACT, EmploymentType.INTERN, EmploymentType.CONSULTANT, EmploymentType.TEMPORARY] }).notNull().default(EmploymentType.FULL_TIME),
  status: text("status", { enum: [EmployeeStatus.ACTIVE, EmployeeStatus.ON_LEAVE, EmployeeStatus.TERMINATED, EmployeeStatus.SUSPENDED, EmployeeStatus.PROBATION] }).notNull().default(EmployeeStatus.ACTIVE),
  hireDate: date("hire_date").notNull().defaultNow(),
  terminationDate: date("termination_date"),
  profileImage: text("profile_image"),
  bio: text("bio"),
  skills: text("skills").array(),
  isManager: boolean("is_manager").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

// Payroll table
export const payroll = pgTable("payroll", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  payDate: date("pay_date").notNull(),
  startPeriod: date("start_period").notNull(),
  endPeriod: date("end_period").notNull(),
  baseSalary: numeric("base_salary").notNull(),
  bonus: numeric("bonus").default("0"),
  commission: numeric("commission").default("0"),
  deductions: numeric("deductions").default("0"),
  taxWithholding: numeric("tax_withholding").default("0"),
  netPay: numeric("net_pay").notNull(),
  payrollFrequency: text("payroll_frequency", { enum: [PayrollFrequency.WEEKLY, PayrollFrequency.BI_WEEKLY, PayrollFrequency.SEMI_MONTHLY, PayrollFrequency.MONTHLY] }).notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("paid"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertPayrollSchema = createInsertSchema(payroll).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertPayroll = z.infer<typeof insertPayrollSchema>;
export type Payroll = typeof payroll.$inferSelect;

// Password Vault table
export const passwordVault = pgTable("password_vault", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  name: text("name").notNull(),
  type: text("type", { enum: [VaultItemType.PASSWORD, VaultItemType.SECURE_NOTE, VaultItemType.API_KEY, VaultItemType.OTP, VaultItemType.CREDIT_CARD] }).notNull().default(VaultItemType.PASSWORD),
  url: text("url"),
  username: text("username"),
  password: text("password"),
  notes: text("notes"),
  toolId: integer("tool_id").references(() => tools.id), // If related to a specific tool
  companyId: integer("company_id").references(() => companies.id), // If related to a specific company
  lastUsed: timestamp("last_used"),
  expiryDate: date("expiry_date"), // For credentials with an expiration date
  favorite: boolean("favorite").default(false),
  tags: json("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});

export const insertPasswordVaultSchema = createInsertSchema(passwordVault).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertPasswordVault = z.infer<typeof insertPasswordVaultSchema>;
export type PasswordVault = typeof passwordVault.$inferSelect;


export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id").notNull(),
  changes: json("changes"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow()
});


export const reportSchedules = pgTable("report_schedules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  frequency: text("frequency").notNull(),
  recipients: json("recipients").$type<string[]>(),
  parameters: json("parameters"),
  lastRun: timestamp("last_run"),
  nextRun: timestamp("next_run"),
  createdBy: integer("created_by").references(() => users.id),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  createdAt: timestamp("created_at").defaultNow()
});

export const reportArchives = pgTable("report_archives", {
  id: serial("id").primaryKey(),
  scheduleId: integer("schedule_id").references(() => reportSchedules.id),
  fileUrl: text("file_url").notNull(),
  parameters: json("parameters"),
  generatedAt: timestamp("generated_at").defaultNow()
});


export const dataRegions = pgTable("data_regions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  isActive: boolean("is_active").default(true),
  complianceLevel: text("compliance_level").notNull(),
  retentionPeriod: integer("retention_period"),
  createdAt: timestamp("created_at").defaultNow()
});

export const entityRegions = pgTable("entity_regions", {
  id: serial("id").primaryKey(),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  regionId: integer("region_id").references(() => dataRegions.id),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow()
});


export const complianceControls = pgTable("compliance_controls", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  framework: text("framework").notNull(),
  status: text("status").notNull(),
  lastAudit: timestamp("last_audit"),
  nextAudit: timestamp("next_audit"),
  responsibleParty: integer("responsible_party").references(() => users.id),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id),
  evidence: json("evidence"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});

// SEO Intelligence System Enums
export enum SEOScoreCategory {
  TECHNICAL = 'technical',
  ON_PAGE = 'on_page',
  CONTENT = 'content',
  OFF_PAGE = 'off_page',
  LOCAL = 'local',
  MOBILE = 'mobile',
  USER_EXPERIENCE = 'user_experience',
  PERFORMANCE = 'performance'
}

export enum SEOScoreSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

export enum SEOCompetitorRank {
  AHEAD = 'ahead',
  BEHIND = 'behind',
  EQUAL = 'equal'
}

// SEO Intelligence System Tables
export const seoProfiles = pgTable("seo_profiles", {
  id: serial("id").primaryKey(),
  businessEntityId: integer("business_entity_id").references(() => businessEntities.id).notNull(),
  domainName: text("domain_name").notNull(),
  overallScore: integer("overall_score"),
  lastScanDate: timestamp("last_scan_date"),
  scanFrequency: text("scan_frequency"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertSeoProfileSchema = createInsertSchema(seoProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertSeoProfile = z.infer<typeof insertSeoProfileSchema>;
export type SeoProfile = typeof seoProfiles.$inferSelect;

export const seoKeywords = pgTable("seo_keywords", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => seoProfiles.id).notNull(),
  keyword: text("keyword").notNull(),
  searchVolume: integer("search_volume"),
  difficulty: integer("difficulty"),
  currentPosition: integer("current_position"),
  previousPosition: integer("previous_position"),
  targetedUrl: text("targeted_url"),
  isTargeted: boolean("is_targeted").default(true),
  dateAdded: timestamp("date_added").defaultNow(),
  lastChecked: timestamp("last_checked")
});

export const insertSeoKeywordSchema = createInsertSchema(seoKeywords).omit({
  id: true,
  dateAdded: true
});

export type InsertSeoKeyword = z.infer<typeof insertSeoKeywordSchema>;
export type SeoKeyword = typeof seoKeywords.$inferSelect;

export const seoIssues = pgTable("seo_issues", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => seoProfiles.id).notNull(),
  category: text("category").notNull(),
  severity: text("severity").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  affectedPages: json("affected_pages").$type<string[]>(),
  impactScore: integer("impact_score"),
  recommendedActions: json("recommended_actions").$type<string[]>(),
  status: text("status").default("open"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at")
});

export const insertSeoIssueSchema = createInsertSchema(seoIssues).omit({
  id: true,
  createdAt: true,
  resolvedAt: true
});

export type InsertSeoIssue = z.infer<typeof insertSeoIssueSchema>;
export type SeoIssue = typeof seoIssues.$inferSelect;

export const seoRecommendations = pgTable("seo_recommendations", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => seoProfiles.id).notNull(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  impactPotential: integer("impact_potential"),
  estimatedTime: text("estimated_time"),
  steps: json("steps").$type<string[]>(),
  status: text("status").default("new"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at")
});

export const insertSeoRecommendationSchema = createInsertSchema(seoRecommendations).omit({
  id: true,
  createdAt: true,
  completedAt: true
});

export type InsertSeoRecommendation = z.infer<typeof insertSeoRecommendationSchema>;
export type SeoRecommendation = typeof seoRecommendations.$inferSelect;

export const seoCompetitors = pgTable("seo_competitors", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => seoProfiles.id).notNull(),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  overallScore: integer("overall_score"),
  strengthScore: integer("strength_score"),
  weaknessScore: integer("weakness_score"),
  keywordOverlap: integer("keyword_overlap"),
  backlinks: integer("backlinks"),
  domainAuthority: integer("domain_authority"),
  domainAge: integer("domain_age"),
  ranking: text("ranking"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertSeoCompetitorSchema = createInsertSchema(seoCompetitors).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertSeoCompetitor = z.infer<typeof insertSeoCompetitorSchema>;
export type SeoCompetitor = typeof seoCompetitors.$inferSelect;

export const seoBacklinks = pgTable("seo_backlinks", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => seoProfiles.id).notNull(),
  sourceUrl: text("source_url").notNull(),
  targetUrl: text("target_url").notNull(),
  anchorText: text("anchor_text"),
  linkAuthority: integer("link_authority"),
  isFollowed: boolean("is_followed").default(true),
  isActive: boolean("is_active").default(true),
  firstDiscovered: timestamp("first_discovered").defaultNow(),
  lastChecked: timestamp("last_checked")
});

export const insertSeoBacklinkSchema = createInsertSchema(seoBacklinks).omit({
  id: true,
  firstDiscovered: true
});

export type InsertSeoBacklink = z.infer<typeof insertSeoBacklinkSchema>;
export type SeoBacklink = typeof seoBacklinks.$inferSelect;

export const seoAudits = pgTable("seo_audits", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => seoProfiles.id).notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  status: text("status").default("pending"),
  results: json("results"),
  createdBy: integer("created_by").references(() => users.id)
});

export const insertSeoAuditSchema = createInsertSchema(seoAudits).omit({
  id: true,
  startedAt: true,
  completedAt: true
});

export type InsertSeoAudit = z.infer<typeof insertSeoAuditSchema>;
export type SeoAudit = typeof seoAudits.$inferSelect;

export const seoPageMetrics = pgTable("seo_page_metrics", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => seoProfiles.id).notNull(),
  pageUrl: text("page_url").notNull(),
  title: text("title"),
  metaDescription: text("meta_description"),
  headingStructure: json("heading_structure"),
  wordCount: integer("word_count"),
  loadTime: real("load_time"),
  mobileCompatible: boolean("mobile_compatible").default(false),
  pageScore: integer("page_score"),
  lastAnalyzed: timestamp("last_analyzed").defaultNow()
});

export const insertSeoPageMetricSchema = createInsertSchema(seoPageMetrics).omit({
  id: true,
  lastAnalyzed: true
});

export type InsertSeoPageMetric = z.infer<typeof insertSeoPageMetricSchema>;
export type SeoPageMetric = typeof seoPageMetrics.$inferSelect;
