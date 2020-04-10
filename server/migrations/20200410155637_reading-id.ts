import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`
    ALTER TABLE faulty_readings ADD COLUMN reading_id int4;
    ALTER TABLE readings ADD COLUMN reading_id int4;
    
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
    
    CREATE UNIQUE INDEX unique_readings ON readings (device_id, moisture, temperature, light, battery_voltage, signal, reading_id);
  `);
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw(`
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
                    new.signal);
            RETURN NULL;
        ELSE
            RETURN new;
        END IF;
    END;
    $record_faulty_reading$ LANGUAGE plpgsql;
    
    DROP INDEX unique_readings;
    ALTER TABLE faulty_readings DROP COLUMN reading_id;
    ALTER TABLE readings DROP COLUMN reading_id;
  `);
}
