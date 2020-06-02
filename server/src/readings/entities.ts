import { ReadingEntity } from 'common/types/entities';

export type TimeBucketedReading = Pick<
  ReadingEntity,
  'device_id' | 'moisture' | 'temperature' | 'light' | 'battery_voltage'
> & {
  time: Date;
};
