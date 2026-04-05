CREATE TYPE "public"."criterion" AS ENUM('awards', 'membership', 'press', 'judging', 'original_contributions', 'scholarly_articles', 'critical_role', 'high_salary', 'commercial_success');--> statement-breakpoint
CREATE TYPE "public"."evidence_strength" AS ENUM('weak', 'solid', 'compelling');--> statement-breakpoint
CREATE TYPE "public"."opportunity_type" AS ENUM('award', 'grant', 'speaking', 'publication', 'fellowship', 'competition', 'press', 'judging_panel', 'other');--> statement-breakpoint
CREATE TYPE "public"."resource_type" AS ENUM('document', 'link', 'blog', 'prompt', 'template', 'video', 'other');--> statement-breakpoint
CREATE TYPE "public"."user_field" AS ENUM('ai_ml', 'biotech', 'finance', 'law', 'medicine', 'arts', 'engineering', 'research', 'entrepreneurship', 'other');--> statement-breakpoint
CREATE TYPE "public"."visa_type" AS ENUM('o1a', 'o1b', 'eb1a', 'eb1b', 'eb2_niw', 'not_sure');--> statement-breakpoint
CREATE TABLE "auth_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"email" text NOT NULL,
	"action" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "badge_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"color" text NOT NULL,
	"requirement" text NOT NULL,
	"xp_reward" integer DEFAULT 100,
	CONSTRAINT "badge_definitions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "collaboration_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"headline" text,
	"looking_for" text[],
	"offering" text[],
	"skills" text[],
	"is_visible" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "collaboration_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "collaboration_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_user_id" uuid NOT NULL,
	"to_user_id" uuid NOT NULL,
	"message" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evidence_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"criterion" "criterion" NOT NULL,
	"strength" "evidence_strength" NOT NULL,
	"strength_score" integer,
	"ai_analysis" text,
	"ai_suggestions" text,
	"file_url" text,
	"file_key" text,
	"file_type" text,
	"file_size" integer,
	"external_url" text,
	"issuing_organization" text,
	"date_issued" timestamp,
	"is_verified" boolean DEFAULT false,
	"deleted_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"visa_type" "visa_type" NOT NULL,
	"field" "user_field" NOT NULL,
	"document_type" text NOT NULL,
	"preview_url" text,
	"file_key" text NOT NULL,
	"price_usd" numeric(10, 2) NOT NULL,
	"purchase_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"tags" text[],
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"buyer_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"amount_paid" numeric(10, 2) NOT NULL,
	"platform_fee" numeric(10, 2) NOT NULL,
	"seller_revenue" numeric(10, 2) NOT NULL,
	"stripe_payment_intent_id" text,
	"download_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submitted_by" uuid,
	"title" text NOT NULL,
	"organization" text NOT NULL,
	"type" "opportunity_type" NOT NULL,
	"description" text NOT NULL,
	"eligibility" text,
	"fields" "user_field"[],
	"deadline" timestamp,
	"application_url" text NOT NULL,
	"is_verified" boolean DEFAULT false,
	"is_community_submitted" boolean DEFAULT false,
	"upvote_count" integer DEFAULT 0,
	"criterion_match" "criterion"[],
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunity_upvotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"opportunity_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "resource_type" NOT NULL,
	"file_url" text,
	"file_key" text,
	"file_type" text,
	"file_size" integer,
	"external_url" text,
	"tags" text[],
	"is_public" boolean DEFAULT false,
	"view_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"badge_id" uuid NOT NULL,
	"earned_at" timestamp DEFAULT now() NOT NULL,
	"is_public" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"display_name" text,
	"avatar_url" text,
	"field" "user_field",
	"current_role" text,
	"current_organization" text,
	"target_visa" "visa_type",
	"nationality" text,
	"linkedin_url" text,
	"google_scholar_url" text,
	"github_url" text,
	"bio" text,
	"is_approved_holder" boolean DEFAULT false,
	"approval_proof_url" text,
	"approved_visa_type" "visa_type",
	"approved_year" integer,
	"is_public" boolean DEFAULT false,
	"onboarding_complete" boolean DEFAULT false,
	"email_verified" boolean DEFAULT false,
	"email_verify_token" text,
	"reset_password_token" text,
	"reset_password_expiry" timestamp,
	"failed_attempts" integer DEFAULT 0,
	"lockout_until" timestamp,
	"approval_score" integer DEFAULT 0,
	"xp" integer DEFAULT 0,
	"level" integer DEFAULT 1,
	"streak_days" integer DEFAULT 0,
	"last_active_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "auth_logs" ADD CONSTRAINT "auth_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_profiles" ADD CONSTRAINT "collaboration_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_requests" ADD CONSTRAINT "collaboration_requests_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_requests" ADD CONSTRAINT "collaboration_requests_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_items" ADD CONSTRAINT "evidence_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_purchases" ADD CONSTRAINT "marketplace_purchases_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_purchases" ADD CONSTRAINT "marketplace_purchases_listing_id_marketplace_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."marketplace_listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunity_upvotes" ADD CONSTRAINT "opportunity_upvotes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunity_upvotes" ADD CONSTRAINT "opportunity_upvotes_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_badge_definitions_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badge_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "evidence_user_criterion_idx" ON "evidence_items" USING btree ("user_id","criterion");--> statement-breakpoint
CREATE INDEX "marketplace_seller_active_idx" ON "marketplace_listings" USING btree ("seller_id","is_active");--> statement-breakpoint
CREATE INDEX "resources_user_type_idx" ON "resources" USING btree ("user_id","type");