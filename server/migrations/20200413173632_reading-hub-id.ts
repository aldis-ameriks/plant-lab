import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`
    ALTER TABLE readings ADD COLUMN hub_id smallint REFERENCES devices (id) ON DELETE RESTRICT ON UPDATE CASCADE;
    ALTER TABLE faulty_readings ADD COLUMN hub_id smallint REFERENCES devices (id) ON DELETE RESTRICT ON UPDATE CASCADE;

    CREATE OR REPLACE FUNCTION record_faulty_reading() RETURNS trigger AS
    $record_faulty_reading$
    DECLARE
        device_ids smallint[];
    BEGIN
        device_ids := array_append(device_ids, new.device_id);
    
        IF new.hub_id IS NOT NULL THEN
            device_ids := array_append(device_ids, new.hub_id);
        END IF;
    
        UPDATE devices SET last_seen_at = CURRENT_TIMESTAMP WHERE id = ANY(device_ids);
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
    ALTER TABLE readings DROP COLUMN hub_id;
    ALTER TABLE faulty_readings DROP COLUMN hub_id;
    
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
