import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`   
    CREATE TABLE devices
    (
        id   SMALLINT NOT NULL PRIMARY KEY,
        name VARCHAR(255),
        room VARCHAR(255),
        test BOOLEAN DEFAULT FALSE
    );
    
    CREATE TABLE users
    (
        id         SMALLSERIAL  NOT NULL PRIMARY KEY,
        access_key VARCHAR(255) NOT NULL
    );
    
    CREATE TABLE users_devices
    (
        user_id   SMALLINT REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
        device_id SMALLINT REFERENCES devices (id) ON DELETE RESTRICT ON UPDATE CASCADE
    );
    
    CREATE TABLE readings
    (
        device_id       SMALLINT         NOT NULL REFERENCES devices (id) ON DELETE RESTRICT ON UPDATE CASCADE,
        timestamp       TIMESTAMPTZ      NOT NULL,
        moisture        DOUBLE PRECISION NULL,
        moisture_raw    DOUBLE PRECISION NULL,
        moisture_max    DOUBLE PRECISION NULL,
        moisture_min    DOUBLE PRECISION NULL,
        temperature     DOUBLE PRECISION NULL,
        light           DOUBLE PRECISION NULL,
        battery_voltage DOUBLE PRECISION NULL,
        signal          SMALLINT         NULL
    );
    
    CREATE TABLE faulty_readings
    (
        LIKE readings INCLUDING ALL
    );
    
    CREATE INDEX readings_timestamp_desc ON readings (device_id, timestamp DESC);
    CREATE INDEX readings_timestamp_asc ON readings (device_id, timestamp ASC);
    
    CREATE OR REPLACE FUNCTION record_faulty_reading()
        RETURNS trigger AS
    $record_faulty_reading$
    BEGIN
        IF NEW.temperature >= 100 OR NEW.moisture >= 200 OR NEW.moisture <= -50 THEN
            INSERT INTO faulty_readings
            VALUES (NEW.device_id,
                    NEW.timestamp,
                    NEW.moisture,
                    NEW.moisture_raw,
                    NEW.moisture_max,
                    NEW.moisture_min,
                    NEW.temperature,
                    NEW.light,
                    NEW.battery_voltage,
                    NEW.signal);
            RETURN NULL;
        ELSE
            RETURN NEW;
        END IF;
    END;
    $record_faulty_reading$ LANGUAGE plpgsql;
    
    CREATE TRIGGER record_error
        BEFORE INSERT
        ON readings
        FOR EACH ROW
    EXECUTE PROCEDURE record_faulty_reading();
  `);
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw(`
    DROP TRIGGER record_error on readings;
    DROP FUNCTION record_faulty_reading;
    
    DROP table users_devices;
    DROP TABLE users;
    DROP table readings;
    DROP table faulty_readings;
    DROP TABLE devices;
  `);
}
