/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
import type { RequestContext } from '../helpers/context.ts'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> }
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

export type DeviceStatus = 'new' | 'paired' | 'pairing' | 'reset'

export type DeviceType = 'hub' | 'sensor'

export type DeviceVersion = 'hub_10' | 'sensor_10'

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

export type Role = 'ADMIN' | 'HUB' | 'USER'

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>
  Device: ResolverTypeWrapper<Device>
  DeviceStatus: DeviceStatus
  DeviceType: DeviceType
  DeviceVersion: DeviceVersion
  Float: ResolverTypeWrapper<Scalars['Float']['output']>
  ID: ResolverTypeWrapper<Scalars['ID']['output']>
  Mutation: ResolverTypeWrapper<{}>
  Query: ResolverTypeWrapper<{}>
  Reading: ResolverTypeWrapper<Reading>
  Role: Role
  String: ResolverTypeWrapper<Scalars['String']['output']>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output']
  DateTime: Scalars['DateTime']['output']
  Device: Device
  Float: Scalars['Float']['output']
  ID: Scalars['ID']['output']
  Mutation: {}
  Query: {}
  Reading: Reading
  String: Scalars['String']['output']
}

export type AuthDirectiveArgs = {
  requires?: Maybe<Role>
}

export type AuthDirectiveResolver<
  Result,
  Parent,
  ContextType = RequestContext,
  Args = AuthDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type DeviceResolvers<
  ContextType = RequestContext,
  ParentType extends ResolversParentTypes['Device'] = ResolversParentTypes['Device']
> = {
  firmware?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  lastReading?: Resolver<Maybe<ResolversTypes['Reading']>, ParentType, ContextType>
  lastWateredTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  readings?: Resolver<Array<ResolversTypes['Reading']>, ParentType, ContextType>
  room?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  type?: Resolver<ResolversTypes['DeviceType'], ParentType, ContextType>
  version?: Resolver<ResolversTypes['DeviceVersion'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MutationResolvers<
  ContextType = RequestContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  saveReading?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<MutationSaveReadingArgs, 'input'>
  >
}

export type QueryResolvers<
  ContextType = RequestContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  device?: Resolver<ResolversTypes['Device'], ParentType, ContextType, RequireFields<QueryDeviceArgs, 'id'>>
  devices?: Resolver<Array<ResolversTypes['Device']>, ParentType, ContextType>
}

export type ReadingResolvers<
  ContextType = RequestContext,
  ParentType extends ResolversParentTypes['Reading'] = ResolversParentTypes['Reading']
> = {
  batteryVoltage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  light?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  moisture?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  temperature?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  time?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = RequestContext> = {
  DateTime?: GraphQLScalarType
  Device?: DeviceResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Reading?: ReadingResolvers<ContextType>
}

export type DirectiveResolvers<ContextType = RequestContext> = {
  auth?: AuthDirectiveResolver<any, any, ContextType>
}
