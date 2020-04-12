import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`
    ALTER TABLE devices ADD COLUMN address inet;
    ALTER TABLE devices ADD COLUMN last_seen_at timestamptz;
    CREATE TYPE device_type AS enum ('hub_10', 'sensor_10');
    ALTER TABLE devices ADD COLUMN type device_type NOT NULL DEFAULT 'sensor_10';
    
    CREATE OR REPLACE FUNCTION record_faulty_reading() RETURNS trigger AS
    $record_faulty_reading$
    BEGIN
        UPDATE devices SET last_seen_at = CURRENT_TIMESTAMP WHERE id = new.device_id;
        IF new.temperature >= 100 OR new.moisture >= 200 OR new.moisture <= -50 THEN
            INSERT INTO faulty_readings
            VALUES (new.device_id,
                    new.timestamp,
                    new.moisture,
                    new.moisture_raw,
                    new.moisture_max,
                    new.moisture_min,
                    new.temperature,
                    new.light,
                    new.battery_voltage,
                    new.signal,
                    new.reading_id);
            RETURN NULL;
        ELSE
            RETURN new;
        END IF;
    END;
    $record_faulty_reading$ LANGUAGE plpgsql;
  `);
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw(`
    ALTER TABLE devices DROP COLUMN address;
    ALTER TABLE devices DROP COLUMN last_seen_at;
    ALTER TABLE devices DROP COLUMN type;
    DROP TYPE device_type;

    CREATE OR REPLACE FUNCTION record_faulty_reading() RETURNS trigger AS
    $record_faulty_reading$
    BEGIN
        IF new.temperature >= 100 OR new.moisture >= 200 OR new.moisture <= -50 THEN
            INSERT INTO faulty_readings
            VALUES (new.device_id,
                    new.timestamp,
                    new.moisture,
                    new.moisture_raw,
                    new.moisture_max,
                    new.moisture_min,
                    new.temperature,
                    new.light,
                    new.battery_voltage,
                    new.signal,
                    new.reading_id);
            RETURN NULL;
        ELSE
            RETURN new;
        END IF;
    END;
    $record_faulty_reading$ LANGUAGE plpgsql;
  `);
}
