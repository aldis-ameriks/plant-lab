DROP INDEX "readings_time_device_id_index";--> statement-breakpoint
DROP INDEX "readings_time_reading_id_index";--> statement-breakpoint
CREATE INDEX "readings_time_device_id_index" ON "readings" USING btree ("time","device_id");--> statement-breakpoint
CREATE INDEX "readings_time_reading_id_index" ON "readings" USING btree ("time","reading_id");