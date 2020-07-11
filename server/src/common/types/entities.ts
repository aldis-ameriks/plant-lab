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
  address?: string;
  firmware?: string;
  id: number;
  last_seen_at?: Date;
  name?: string;
  room?: string;
  status: DeviceStatus;
  test?: boolean;
  type: DeviceType;
  version: DeviceVersion;
};

export type FaultyReadingEntity = {
  battery_voltage?: number;
  device_id: number;
  hub_id?: number;
  light?: number;
  moisture?: number;
  moisture_max?: number;
  moisture_min?: number;
  moisture_raw?: number;
  reading_id?: number;
  signal?: number;
  temperature?: number;
  timestamp: Date;
};

export type NotificationEntity = {
  body: string;
  created_at: Date;
  device_id?: number;
  id: string;
  sent_at?: Date;
  title: string;
  type: NotificationType;
  user_id: number;
};

export type ReadingEntity = {
  battery_voltage?: number;
  device_id: number;
  hub_id?: number;
  light?: number;
  moisture?: number;
  moisture_max?: number;
  moisture_min?: number;
  moisture_raw?: number;
  reading_id?: number;
  signal?: number;
  temperature?: number;
  timestamp: Date;
};

export type UserSettingEntity = {
  name: string;
  user_id?: number;
  value: string;
};

export type UserEntity = {
  id: number;
};

export type UsersAccessKeyEntity = {
  access_key?: string;
  roles?: Array<string>;
  user_id?: number;
};

export type UsersDeviceEntity = {
  device_id?: number;
  user_id?: number;
};
