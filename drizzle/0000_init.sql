CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_exposures" (
	"user_id" text NOT NULL,
	"question_id" text NOT NULL,
	"last_seen_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "question_exposures_user_id_question_id_pk" PRIMARY KEY("user_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "quiz_answers" (
	"session_id" uuid NOT NULL,
	"index" smallint NOT NULL,
	"question_id" text NOT NULL,
	"choice" smallint,
	"correct" boolean NOT NULL,
	"elapsed_ms" integer NOT NULL,
	"points" integer NOT NULL,
	CONSTRAINT "quiz_answers_session_id_index_pk" PRIMARY KEY("session_id","index")
);
--> statement-breakpoint
CREATE TABLE "quiz_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"mode" text NOT NULL,
	"title_id" text,
	"seed" integer NOT NULL,
	"question_ids" jsonb NOT NULL,
	"option_order" jsonb NOT NULL,
	"cursor" smallint DEFAULT 0 NOT NULL,
	"served_at" timestamp,
	"correct" smallint DEFAULT 0 NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"combo" smallint DEFAULT 1 NOT NULL,
	"best_combo" smallint DEFAULT 1 NOT NULL,
	"lifelines" jsonb DEFAULT '{"fifty":true,"hint":true}'::jsonb NOT NULL,
	"fifty_on" smallint,
	"hint_on" smallint,
	"status" text DEFAULT 'active' NOT NULL,
	"daily_key" text,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"finished_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"is_anonymous" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"user_id" text NOT NULL,
	"title_id" text NOT NULL,
	"watched_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_progress_user_id_title_id_pk" PRIMARY KEY("user_id","title_id")
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"user_id" text PRIMARY KEY NOT NULL,
	"total_xp" integer DEFAULT 0 NOT NULL,
	"ready_at" timestamp,
	"best_exam_pct" smallint,
	"titles_watched" smallint DEFAULT 0 NOT NULL,
	"active_track" text,
	"country" text
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "xp_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"reason" text NOT NULL,
	"ref_key" text NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_session_id_quiz_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."quiz_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "qs_user_mode" ON "quiz_sessions" USING btree ("user_id","mode");--> statement-breakpoint
CREATE UNIQUE INDEX "qs_daily_once" ON "quiz_sessions" USING btree ("user_id","daily_key");--> statement-breakpoint
CREATE INDEX "stats_xp" ON "user_stats" USING btree ("total_xp" desc);--> statement-breakpoint
CREATE UNIQUE INDEX "xp_once" ON "xp_events" USING btree ("user_id","reason","ref_key");--> statement-breakpoint
CREATE INDEX "xp_created" ON "xp_events" USING btree ("created_at");