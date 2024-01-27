/* eslint-disable @typescript-eslint/no-explicit-any, no-use-before-define, @typescript-eslint/explicit-module-boundary-types */
import gql from 'graphql-tag'
import * as Urql from 'urql'
export type Maybe<T> = T | null | undefined
export type InputMaybe<T> = T | null | undefined
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  DateTime: { input: any; output: any }
}

export type Device = {
  __typename?: 'Device'
  firmware: Scalars['String']['output']
  id: Scalars['ID']['output']
  lastReading?: Maybe<Reading>
  lastWateredTime?: Maybe<Scalars['DateTime']['output']>
  name: Scalars['String']['output']
  readings: Array<Reading>
  room?: Maybe<Scalars['String']['output']>
  type: DeviceType
  version: DeviceVersion
}

export enum DeviceStatus {
  New = 'new',
  Paired = 'paired',
  Pairing = 'pairing',
  Reset = 'reset'
}

export enum DeviceType {
  Hub = 'hub',
  Sensor = 'sensor'
}

export enum DeviceVersion {
  Hub_10 = 'hub_10',
  Sensor_10 = 'sensor_10'
}

export type Mutation = {
  __typename?: 'Mutation'
  _?: Maybe<Scalars['Boolean']['output']>
  saveReading: Scalars['String']['output']
}

export type MutationSaveReadingArgs = {
  input: Scalars['String']['input']
}

export type Query = {
  __typename?: 'Query'
  _?: Maybe<Scalars['Boolean']['output']>
  device: Device
  devices: Array<Device>
}

export type QueryDeviceArgs = {
  id: Scalars['ID']['input']
}

export type Reading = {
  __typename?: 'Reading'
  batteryVoltage: Scalars['Float']['output']
  light?: Maybe<Scalars['Float']['output']>
  moisture: Scalars['Float']['output']
  temperature: Scalars['Float']['output']
  time: Scalars['DateTime']['output']
}

export enum Role {
  Admin = 'ADMIN',
  Hub = 'HUB',
  User = 'USER'
}

export type DeviceFieldsFragment = {
  __typename?: 'Device'
  id: string
  room?: string | null | undefined
  name: string
  type: DeviceType
  version: DeviceVersion
  firmware: string
  lastWateredTime?: any | null | undefined
  lastReading?:
    | {
        __typename?: 'Reading'
        time: any
        batteryVoltage: number
        light?: number | null | undefined
        moisture: number
        temperature: number
      }
    | null
    | undefined
}

export type DeviceQueryVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type DeviceQuery = {
  __typename?: 'Query'
  device: {
    __typename?: 'Device'
    id: string
    room?: string | null | undefined
    name: string
    type: DeviceType
    version: DeviceVersion
    firmware: string
    lastWateredTime?: any | null | undefined
    readings: Array<{
      __typename?: 'Reading'
      time: any
      batteryVoltage: number
      light?: number | null | undefined
      moisture: number
      temperature: number
    }>
    lastReading?:
      | {
          __typename?: 'Reading'
          time: any
          batteryVoltage: number
          light?: number | null | undefined
          moisture: number
          temperature: number
        }
      | null
      | undefined
  }
}

export type DevicesQueryVariables = Exact<{ [key: string]: never }>

export type DevicesQuery = {
  __typename?: 'Query'
  devices: Array<{
    __typename?: 'Device'
    id: string
    room?: string | null | undefined
    name: string
    type: DeviceType
    version: DeviceVersion
    firmware: string
    lastWateredTime?: any | null | undefined
    lastReading?:
      | {
          __typename?: 'Reading'
          time: any
          batteryVoltage: number
          light?: number | null | undefined
          moisture: number
          temperature: number
        }
      | null
      | undefined
  }>
}

export const DeviceFieldsFragmentDoc = gql`
  fragment DeviceFields on Device {
    id
    room
    name
    type
    version
    firmware
    lastWateredTime
    lastReading {
      time
      batteryVoltage
      light
      moisture
      temperature
    }
  }
`
export const DeviceDocument = gql`
  query Device($id: ID!) {
    device(id: $id) {
      ...DeviceFields
      readings {
        time
        batteryVoltage
        light
        moisture
        temperature
      }
    }
  }
  ${DeviceFieldsFragmentDoc}
`

export function useDeviceQuery(options: Omit<Urql.UseQueryArgs<DeviceQueryVariables>, 'query'>) {
  return Urql.useQuery<DeviceQuery, DeviceQueryVariables>({ query: DeviceDocument, ...options })
}
export const DevicesDocument = gql`
  query Devices {
    devices {
      ...DeviceFields
    }
  }
  ${DeviceFieldsFragmentDoc}
`

export function useDevicesQuery(options?: Omit<Urql.UseQueryArgs<DevicesQueryVariables>, 'query'>) {
  return Urql.useQuery<DevicesQuery, DevicesQueryVariables>({ query: DevicesDocument, ...options })
}
