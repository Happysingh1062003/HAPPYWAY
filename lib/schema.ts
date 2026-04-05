import { pgTable, text, uuid, timestamp, integer, boolean, decimal, jsonb, pgEnum, index } from 'drizzle-orm/pg-core';

// ENUMS
export const userFieldEnum = pgEnum('user_field', [
  'ai_ml', 'biotech', 'finance', 'law', 'medicine', 'arts',
  'engineering', 'research', 'entrepreneurship', 'other'
]);

export const visaTypeEnum = pgEnum('visa_type', ['o1a', 'o1b', 'eb1a', 'eb1b', 'eb2_niw', 'not_sure']);

export const criterionEnum = pgEnum('criterion', [
  'awards', 'membership', 'press', 'judging', 'original_contributions',
  'scholarly_articles', 'critical_role', 'high_salary', 'commercial_success'
]);

export const evidenceStrengthEnum = pgEnum('evidence_strength', ['weak', 'solid', 'compelling']);

export const resourceTypeEnum = pgEnum('resource_type', [
  'document', 'link', 'blog', 'prompt', 'template', 'video', 'other'
]);

export const opportunityTypeEnum = pgEnum('opportunity_type', [
  'award', 'grant', 'speaking', 'publication', 'fellowship',
  'competition', 'press', 'judging_panel', 'other'
]);

// USERS TABLE
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  field: userFieldEnum('field'),
  currentRole: text('current_role'),
  currentOrganization: text('current_organization'),
  targetVisa: visaTypeEnum('target_visa'),
  nationality: text('nationality'),
  linkedinUrl: text('linkedin_url'),
  googleScholarUrl: text('google_scholar_url'),
  githubUrl: text('github_url'),
  bio: text('bio'),
  isApprovedHolder: boolean('is_approved_holder').default(false),
  approvalProofUrl: text('approval_proof_url'),
  approvedVisaType: visaTypeEnum('approved_visa_type'),
  approvedYear: integer('approved_year'),
  isPublic: boolean('is_public').default(false),
  onboardingComplete: boolean('onboarding_complete').default(false),
  emailVerified: boolean('email_verified').default(false),
  emailVerifyToken: text('email_verify_token'),
  resetPasswordToken: text('reset_password_token'),
  resetPasswordExpiry: timestamp('reset_password_expiry'),
  failedAttempts: integer('failed_attempts').default(0),
  lockoutUntil: timestamp('lockout_until'),
  approvalScore: integer('approval_score').default(0),
  xp: integer('xp').default(0),
  level: integer('level').default(1),
  streakDays: integer('streak_days').default(0),
  lastActiveDate: timestamp('last_active_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// AUTH LOGS
export const authLogs = pgTable('auth_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  email: text('email').notNull(),
  action: text('action').notNull(), // 'login_success', 'login_failed', 'signup', 'logout'
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// EVIDENCE VAULT
export const evidenceItems = pgTable('evidence_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  criterion: criterionEnum('criterion').notNull(),
  strength: evidenceStrengthEnum('strength').notNull(),
  strengthScore: integer('strength_score'),
  aiAnalysis: text('ai_analysis'),
  aiSuggestions: text('ai_suggestions'),
  fileUrl: text('file_url'),
  fileKey: text('file_key'),
  fileType: text('file_type'),
  fileSize: integer('file_size'),
  externalUrl: text('external_url'),
  issuingOrganization: text('issuing_organization'),
  dateIssued: timestamp('date_issued'),
  isVerified: boolean('is_verified').default(false),
  deletedAt: timestamp('deleted_at'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  evidenceUserCriterionIdx: index('evidence_user_criterion_idx').on(table.userId, table.criterion),
}));

// RESOURCES
export const resources = pgTable('resources', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  type: resourceTypeEnum('type').notNull(),
  fileUrl: text('file_url'),
  fileKey: text('file_key'),
  fileType: text('file_type'),
  fileSize: integer('file_size'),
  externalUrl: text('external_url'),
  tags: text('tags').array(),
  isPublic: boolean('is_public').default(false),
  viewCount: integer('view_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  resourcesUserTypeIdx: index('resources_user_type_idx').on(table.userId, table.type),
}));

// MILESTONE BADGES
export const badgeDefinitions = pgTable('badge_definitions', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  color: text('color').notNull(),
  requirement: text('requirement').notNull(),
  xpReward: integer('xp_reward').default(100),
});

export const userBadges = pgTable('user_badges', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  badgeId: uuid('badge_id').references(() => badgeDefinitions.id).notNull(),
  earnedAt: timestamp('earned_at').defaultNow().notNull(),
  isPublic: boolean('is_public').default(true),
});

// COLLABORATION NETWORK
export const collaborationProfiles = pgTable('collaboration_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  headline: text('headline'),
  lookingFor: text('looking_for').array(),
  offering: text('offering').array(),
  skills: text('skills').array(),
  isVisible: boolean('is_visible').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const collaborationRequests = pgTable('collaboration_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  fromUserId: uuid('from_user_id').references(() => users.id).notNull(),
  toUserId: uuid('to_user_id').references(() => users.id).notNull(),
  message: text('message'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// MARKETPLACE
export const marketplaceListings = pgTable('marketplace_listings', {
  id: uuid('id').defaultRandom().primaryKey(),
  sellerId: uuid('seller_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  visaType: visaTypeEnum('visa_type').notNull(),
  field: userFieldEnum('field').notNull(),
  documentType: text('document_type').notNull(),
  previewUrl: text('preview_url'),
  fileKey: text('file_key').notNull(),
  priceUsd: decimal('price_usd', { precision: 10, scale: 2 }).notNull(),
  purchaseCount: integer('purchase_count').default(0),
  isActive: boolean('is_active').default(true),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  marketplaceSellerActiveIdx: index('marketplace_seller_active_idx').on(table.sellerId, table.isActive),
}));

export const marketplacePurchases = pgTable('marketplace_purchases', {
  id: uuid('id').defaultRandom().primaryKey(),
  buyerId: uuid('buyer_id').references(() => users.id).notNull(),
  listingId: uuid('listing_id').references(() => marketplaceListings.id).notNull(),
  amountPaid: decimal('amount_paid', { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal('platform_fee', { precision: 10, scale: 2 }).notNull(),
  sellerRevenue: decimal('seller_revenue', { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  downloadUrl: text('download_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// OPPORTUNITIES
export const opportunities = pgTable('opportunities', {
  id: uuid('id').defaultRandom().primaryKey(),
  submittedBy: uuid('submitted_by').references(() => users.id),
  title: text('title').notNull(),
  organization: text('organization').notNull(),
  type: opportunityTypeEnum('type').notNull(),
  description: text('description').notNull(),
  eligibility: text('eligibility'),
  fields: userFieldEnum('fields').array(),
  deadline: timestamp('deadline'),
  applicationUrl: text('application_url').notNull(),
  isVerified: boolean('is_verified').default(false),
  isCommunitySubmitted: boolean('is_community_submitted').default(false),
  upvoteCount: integer('upvote_count').default(0),
  criterionMatch: criterionEnum('criterion_match').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const opportunityUpvotes = pgTable('opportunity_upvotes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  opportunityId: uuid('opportunity_id').references(() => opportunities.id).notNull(),
});
