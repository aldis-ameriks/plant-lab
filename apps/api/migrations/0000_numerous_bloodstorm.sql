DO $$ BEGIN
 CREATE TYPE "device_status" AS ENUM('reset', 'paired', 'pairing', 'new');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "device_type" AS ENUM('sensor', 'hub');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "device_version" AS ENUM('sensor_10', 'hub_10');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "abusers" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"ip" "inet" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"url" text NOT NULL,
	"method" text NOT NULL,
	"headers" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "crons" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"executed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"next_execution_at" timestamp with time zone NOT NULL,
	"enabled" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "devices" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"room" text,
	"firmware" text NOT NULL,
	"address" "inet",
	"last_seen_at" timestamp with time zone,
	"version" "device_version" NOT NULL,
	"status" "device_status" DEFAULT 'new' NOT NULL,
	"type" "device_type" NOT NULL,
	"test" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "errors" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"time" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone,
	"source" text,
	"content" jsonb NOT NULL,
	"headers" jsonb,
	"ip" "inet",
	"req_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "readings" (
	"time" timestamp with time zone NOT NULL,
	"reading_id" text,
	"device_id" bigint NOT NULL,
	"hub_id" bigint,
	"moisture" numeric,
	"moisture_raw" numeric,
	"moisture_max" numeric,
	"moisture_min" numeric,
	"temperature" numeric,
	"light" numeric,
	"battery_voltage" numeric,
	"signal" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_access_keys" (
	"user_id" bigint NOT NULL,
	"access_key" text NOT NULL,
	"roles" text[] NOT NULL,
	CONSTRAINT "user_access_keys_access_key_unique" UNIQUE("access_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" bigserial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_devices" (
	"user_id" bigint NOT NULL,
	"device_id" bigint NOT NULL,
	CONSTRAINT "users_devices_user_id_device_id_pk" PRIMARY KEY("user_id","device_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "readings_time_device_id_index" ON "readings" ("time","device_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "readings_time_reading_id_index" ON "readings" ("time","reading_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "readings" ADD CONSTRAINT "readings_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "readings" ADD CONSTRAINT "readings_hub_id_devices_id_fk" FOREIGN KEY ("hub_id") REFERENCES "devices"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_access_keys" ADD CONSTRAINT "user_access_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_devices" ADD CONSTRAINT "users_devices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_devices" ADD CONSTRAINT "users_devices_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
