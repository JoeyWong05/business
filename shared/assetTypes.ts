/**
 * Types for asset management (branding, documents, media)
 */

// Asset categories
export enum AssetCategory {
  BRAND = 'brand',
  DOCUMENT = 'document',
  MEDIA = 'media',
  TEMPLATE = 'template',
  CUSTOMER = 'customer',
  OTHER = 'other'
}

// Brand asset types
export enum BrandAssetType {
  LOGO = 'logo',
  LOGO_VARIANT = 'logo_variant',
  ICON = 'icon',
  COLOR_PALETTE = 'color_palette',
  TYPOGRAPHY = 'typography',
  BRAND_GUIDELINES = 'brand_guidelines',
  BUSINESS_CARD = 'business_card',
  LETTERHEAD = 'letterhead',
  EMAIL_SIGNATURE = 'email_signature', 
  SOCIAL_MEDIA_BANNER = 'social_media_banner'
}

// Document types
export enum DocumentType {
  CONTRACT = 'contract',
  INVOICE = 'invoice',
  PROPOSAL = 'proposal',
  REPORT = 'report',
  PRESENTATION = 'presentation',
  POLICY = 'policy',
  FORM = 'form',
  CERTIFICATE = 'certificate',
  LEGAL = 'legal'
}

// Media types
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  ANIMATION = 'animation',
  ILLUSTRATION = 'illustration',
  INFOGRAPHIC = 'infographic',
  PRODUCT_PHOTO = 'product_photo'
}

// Template types
export enum TemplateType {
  EMAIL = 'email',
  DOCUMENT = 'document',
  FORM = 'form',
  SOCIAL_MEDIA = 'social_media',
  PRESENTATION = 'presentation',
  REPORT = 'report'
}

// File formats
export enum FileFormat {
  // Images
  PNG = 'png',
  JPG = 'jpg',
  JPEG = 'jpeg',
  SVG = 'svg',
  GIF = 'gif',
  WEBP = 'webp',
  
  // Vector
  AI = 'ai',
  EPS = 'eps',
  PDF = 'pdf',
  
  // Documents
  DOCX = 'docx',
  DOC = 'doc',
  XLSX = 'xlsx',
  XLS = 'xls',
  PPTX = 'pptx',
  PPT = 'ppt',
  TXT = 'txt',
  
  // Media
  MP4 = 'mp4',
  MP3 = 'mp3',
  WAV = 'wav',
  MOV = 'mov',
  
  // Web
  HTML = 'html',
  CSS = 'css',
  JS = 'js',
  
  // Other
  ZIP = 'zip',
  OTHER = 'other'
}

// Asset status
export enum AssetStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  PENDING_APPROVAL = 'pending_approval',
  REJECTED = 'rejected'
}

// Asset visibility
export enum AssetVisibility {
  PUBLIC = 'public',        // Visible to anyone
  INTERNAL = 'internal',    // Visible only to team members
  RESTRICTED = 'restricted', // Visible to specific roles or entities
  PRIVATE = 'private'       // Visible only to the owner or explicit users
}

// Asset tag types (for organizing and filtering)
export type AssetTag = string;