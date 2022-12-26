import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  device: Device;
  devices: Array<Device>;
  newNotifications: Array<Notification>;
  readings: Array<Reading>;
  lastReading?: Maybe<Reading>;
  lastWateredTime?: Maybe<Scalars['DateTime']>;
  userSettings: Array<UserSetting>;
  userSetting?: Maybe<UserSetting>;
};

export type QueryDeviceArgs = {
  deviceId: Scalars['ID'];
};

export type QueryReadingsArgs = {
  date?: Maybe<Scalars['String']>;
  deviceId: Scalars['ID'];
};

export type QueryLastReadingArgs = {
  deviceId: Scalars['ID'];
};

export type QueryLastWateredTimeArgs = {
  deviceId: Scalars['ID'];
};

export type QueryUserSettingArgs = {
  name: Scalars['String'];
};

export type Device = {
  __typename?: 'Device';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  room?: Maybe<Scalars['String']>;
  firmware?: Maybe<Scalars['String']>;
  type: DeviceType;
  version: DeviceVersion;
};

/** Device type */
export enum DeviceType {
  Hub = 'hub',
  Sensor = 'sensor',
}

/** Device version */
export enum DeviceVersion {
  Hub_10 = 'hub_10',
  Sensor_10 = 'sensor_10',
}

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['ID'];
  title: Scalars['String'];
  body: Scalars['String'];
  type: NotificationType;
};

/** Notification type */
export enum NotificationType {
  LowBattery = 'low_battery',
  LowMoisture = 'low_moisture',
}

export type Reading = {
  __typename?: 'Reading';
  device_id: Scalars['ID'];
  time: Scalars['DateTime'];
  moisture: Scalars['Float'];
  temperature: Scalars['Float'];
  battery_voltage: Scalars['Float'];
  light?: Maybe<Scalars['Float']>;
};

export type UserSetting = {
  __typename?: 'UserSetting';
  name: Scalars['String'];
  value: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  updateDeviceName: Device;
  updateDeviceRoom: Device;
  removeDevice: Scalars['ID'];
  addDevice: Device;
  pairDevice: Scalars['Boolean'];
  saveReading: Scalars['String'];
  updateUserSetting: UserSetting;
};

export type MutationUpdateDeviceNameArgs = {
  name: Scalars['String'];
  deviceId: Scalars['ID'];
};

export type MutationUpdateDeviceRoomArgs = {
  room: Scalars['String'];
  deviceId: Scalars['ID'];
};

export type MutationRemoveDeviceArgs = {
  deviceId: Scalars['ID'];
};

export type MutationAddDeviceArgs = {
  input: NewDeviceInput;
};

export type MutationPairDeviceArgs = {
  input: PairDeviceInput;
};

export type MutationSaveReadingArgs = {
  input: Scalars['String'];
};

export type MutationUpdateUserSettingArgs = {
  input: UserSettingInput;
};

export type NewDeviceInput = {
  id: Scalars['Float'];
  name: Scalars['String'];
  room?: Maybe<Scalars['String']>;
  firmware: Scalars['String'];
};

export type PairDeviceInput = {
  version: Scalars['String'];
};

export type UserSettingInput = {
  name: Scalars['String'];
  value: Scalars['String'];
};

export type ReadingsQueryVariables = Exact<{
  deviceId: Scalars['ID'];
  date?: Maybe<Scalars['String']>;
}>;

export type ReadingsQuery = { __typename?: 'Query' } & {
  readings: Array<
    { __typename?: 'Reading' } & Pick<
      Reading,
      'device_id' | 'time' | 'moisture' | 'temperature' | 'light' | 'battery_voltage'
    >
  >;
};

export type LastReadingQueryVariables = Exact<{
  deviceId: Scalars['ID'];
}>;

export type LastReadingQuery = { __typename?: 'Query' } & {
  lastReading?: Maybe<
    { __typename?: 'Reading' } & Pick<
      Reading,
      'device_id' | 'time' | 'moisture' | 'temperature' | 'light' | 'battery_voltage'
    >
  >;
};

export type LastWateredTimeQueryVariables = Exact<{
  deviceId: Scalars['ID'];
}>;

export type LastWateredTimeQuery = { __typename?: 'Query' } & Pick<Query, 'lastWateredTime'>;

export const ReadingsDocument = gql`
  query Readings($deviceId: ID!, $date: String) {
    readings(deviceId: $deviceId, date: $date) {
      device_id
      time
      moisture
      temperature
      light
      battery_voltage
    }
  }
`;

/**
 * __useReadingsQuery__
 *
 * To run a query within a React component, call `useReadingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useReadingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReadingsQuery({
 *   variables: {
 *      deviceId: // value for 'deviceId'
 *      date: // value for 'date'
 *   },
 * });
 */
export function useReadingsQuery(baseOptions?: Apollo.QueryHookOptions<ReadingsQuery, ReadingsQueryVariables>) {
  return Apollo.useQuery<ReadingsQuery, ReadingsQueryVariables>(ReadingsDocument, baseOptions);
}
export function useReadingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReadingsQuery, ReadingsQueryVariables>) {
  return Apollo.useLazyQuery<ReadingsQuery, ReadingsQueryVariables>(ReadingsDocument, baseOptions);
}
export type ReadingsQueryHookResult = ReturnType<typeof useReadingsQuery>;
export type ReadingsLazyQueryHookResult = ReturnType<typeof useReadingsLazyQuery>;
export type ReadingsQueryResult = Apollo.QueryResult<ReadingsQuery, ReadingsQueryVariables>;
export const LastReadingDocument = gql`
  query LastReading($deviceId: ID!) {
    lastReading(deviceId: $deviceId) {
      device_id
      time
      moisture
      temperature
      light
      battery_voltage
    }
  }
`;

/**
 * __useLastReadingQuery__
 *
 * To run a query within a React component, call `useLastReadingQuery` and pass it any options that fit your needs.
 * When your component renders, `useLastReadingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLastReadingQuery({
 *   variables: {
 *      deviceId: // value for 'deviceId'
 *   },
 * });
 */
export function useLastReadingQuery(
  baseOptions?: Apollo.QueryHookOptions<LastReadingQuery, LastReadingQueryVariables>
) {
  return Apollo.useQuery<LastReadingQuery, LastReadingQueryVariables>(LastReadingDocument, baseOptions);
}
export function useLastReadingLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LastReadingQuery, LastReadingQueryVariables>
) {
  return Apollo.useLazyQuery<LastReadingQuery, LastReadingQueryVariables>(LastReadingDocument, baseOptions);
}
export type LastReadingQueryHookResult = ReturnType<typeof useLastReadingQuery>;
export type LastReadingLazyQueryHookResult = ReturnType<typeof useLastReadingLazyQuery>;
export type LastReadingQueryResult = Apollo.QueryResult<LastReadingQuery, LastReadingQueryVariables>;
export const LastWateredTimeDocument = gql`
  query LastWateredTime($deviceId: ID!) {
    lastWateredTime(deviceId: $deviceId)
  }
`;

/**
 * __useLastWateredTimeQuery__
 *
 * To run a query within a React component, call `useLastWateredTimeQuery` and pass it any options that fit your needs.
 * When your component renders, `useLastWateredTimeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLastWateredTimeQuery({
 *   variables: {
 *      deviceId: // value for 'deviceId'
 *   },
 * });
 */
export function useLastWateredTimeQuery(
  baseOptions?: Apollo.QueryHookOptions<LastWateredTimeQuery, LastWateredTimeQueryVariables>
) {
  return Apollo.useQuery<LastWateredTimeQuery, LastWateredTimeQueryVariables>(LastWateredTimeDocument, baseOptions);
}
export function useLastWateredTimeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LastWateredTimeQuery, LastWateredTimeQueryVariables>
) {
  return Apollo.useLazyQuery<LastWateredTimeQuery, LastWateredTimeQueryVariables>(LastWateredTimeDocument, baseOptions);
}
export type LastWateredTimeQueryHookResult = ReturnType<typeof useLastWateredTimeQuery>;
export type LastWateredTimeLazyQueryHookResult = ReturnType<typeof useLastWateredTimeLazyQuery>;
export type LastWateredTimeQueryResult = Apollo.QueryResult<LastWateredTimeQuery, LastWateredTimeQueryVariables>;
