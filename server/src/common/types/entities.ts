export enum DeviceStatus {
  new = 'new',
  paired = 'paired',
  pairing = 'pairing',
  reset = 'reset',
}

export enum DeviceType {
  hub = 'hub',
  sensor = 'sensor',
}

export enum DeviceVersion {
  hub_10 = 'hub_10',
  sensor_10 = 'sensor_10',
}

export enum NotificationType {
  low_battery = 'low_battery',
  low_moisture = 'low_moisture',
}

export type DeviceEntity = {
  address: string | null;
  firmware: string | null;
  id: number;
  last_seen_at: Date | null;
  name: string | null;
  room: string | null;
  status: DeviceStatus;
  test: boolean | null;
  type: DeviceType;
  version: DeviceVersion;
};

export type FaultyReadingEntity = {
  battery_voltage: number | null;
  device_id: number;
  hub_id: number | null;
  light: number | null;
  moisture: number | null;
  moisture_max: number | null;
  moisture_min: number | null;
  moisture_raw: number | null;
  reading_id: number | null;
  signal: number | null;
  temperature: number | null;
  timestamp: Date;
};

export type NotificationEntity = {
  body: string;
  created_at: Date;
  device_id: number | null;
  id: string;
  sent_at: Date | null;
  title: string;
  type: NotificationType;
  user_id: number;
};

export type ReadingEntity = {
  battery_voltage: number | null;
  device_id: number;
  hub_id: number | null;
  light: number | null;
  moisture: number | null;
  moisture_max: number | null;
  moisture_min: number | null;
  moisture_raw: number | null;
  reading_id: number | null;
  signal: number | null;
  temperature: number | null;
  timestamp: Date;
};

export type UserSettingEntity = {
  name: string;
  user_id: number | null;
  value: string;
};

export type UserEntity = {
  id: number;
};

export type UsersAccessKeyEntity = {
  access_key: string | null;
  roles: Array<string> | null;
  user_id: number | null;
};

export type UsersDeviceEntity = {
  device_id: number | null;
  user_id: number | null;
};
