import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';

export type Maybe<T> = T | null;
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

export type Mutation = {
  __typename?: 'Mutation';
  saveReading: Scalars['String'];
};

export type MutationSaveReadingArgs = {
  input: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  readings: Array<Reading>;
  lastReading: Reading;
  lastWateredTime?: Maybe<Scalars['DateTime']>;
};

export type QueryReadingsArgs = {
  date?: Maybe<Scalars['String']>;
  sensorId: Scalars['String'];
};

export type QueryLastReadingArgs = {
  sensorId: Scalars['String'];
};

export type QueryLastWateredTimeArgs = {
  sensorId: Scalars['String'];
};

export type Reading = {
  __typename?: 'Reading';
  sensor_id: Scalars['ID'];
  time: Scalars['DateTime'];
  moisture: Scalars['Float'];
  temperature: Scalars['Float'];
  battery_voltage: Scalars['Float'];
  light?: Maybe<Scalars['Float']>;
};

export type ReadingsQueryVariables = {
  sensorId: Scalars['String'];
  date?: Maybe<Scalars['String']>;
};

export type ReadingsQuery = { __typename?: 'Query' } & {
  readings: Array<
    { __typename?: 'Reading' } & Pick<
      Reading,
      'sensor_id' | 'time' | 'moisture' | 'temperature' | 'light' | 'battery_voltage'
    >
  >;
};

export type LastReadingQueryVariables = {
  sensorId: Scalars['String'];
};

export type LastReadingQuery = { __typename?: 'Query' } & {
  lastReading: { __typename?: 'Reading' } & Pick<
    Reading,
    'sensor_id' | 'time' | 'moisture' | 'temperature' | 'light' | 'battery_voltage'
  >;
};

export type LastWateredTimeQueryVariables = {
  sensorId: Scalars['String'];
};

export type LastWateredTimeQuery = { __typename?: 'Query' } & Pick<Query, 'lastWateredTime'>;

export const ReadingsDocument = gql`
  query Readings($sensorId: String!, $date: String) {
    readings(sensorId: $sensorId, date: $date) {
      sensor_id
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
 *      sensorId: // value for 'sensorId'
 *      date: // value for 'date'
 *   },
 * });
 */
export function useReadingsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<ReadingsQuery, ReadingsQueryVariables>
) {
  return ApolloReactHooks.useQuery<ReadingsQuery, ReadingsQueryVariables>(ReadingsDocument, baseOptions);
}
export function useReadingsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ReadingsQuery, ReadingsQueryVariables>
) {
  return ApolloReactHooks.useLazyQuery<ReadingsQuery, ReadingsQueryVariables>(ReadingsDocument, baseOptions);
}
export type ReadingsQueryHookResult = ReturnType<typeof useReadingsQuery>;
export type ReadingsLazyQueryHookResult = ReturnType<typeof useReadingsLazyQuery>;
export type ReadingsQueryResult = ApolloReactCommon.QueryResult<ReadingsQuery, ReadingsQueryVariables>;
export const LastReadingDocument = gql`
  query LastReading($sensorId: String!) {
    lastReading(sensorId: $sensorId) {
      sensor_id
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
 *      sensorId: // value for 'sensorId'
 *   },
 * });
 */
export function useLastReadingQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<LastReadingQuery, LastReadingQueryVariables>
) {
  return ApolloReactHooks.useQuery<LastReadingQuery, LastReadingQueryVariables>(LastReadingDocument, baseOptions);
}
export function useLastReadingLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<LastReadingQuery, LastReadingQueryVariables>
) {
  return ApolloReactHooks.useLazyQuery<LastReadingQuery, LastReadingQueryVariables>(LastReadingDocument, baseOptions);
}
export type LastReadingQueryHookResult = ReturnType<typeof useLastReadingQuery>;
export type LastReadingLazyQueryHookResult = ReturnType<typeof useLastReadingLazyQuery>;
export type LastReadingQueryResult = ApolloReactCommon.QueryResult<LastReadingQuery, LastReadingQueryVariables>;
export const LastWateredTimeDocument = gql`
  query LastWateredTime($sensorId: String!) {
    lastWateredTime(sensorId: $sensorId)
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
 *      sensorId: // value for 'sensorId'
 *   },
 * });
 */
export function useLastWateredTimeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<LastWateredTimeQuery, LastWateredTimeQueryVariables>
) {
  return ApolloReactHooks.useQuery<LastWateredTimeQuery, LastWateredTimeQueryVariables>(
    LastWateredTimeDocument,
    baseOptions
  );
}
export function useLastWateredTimeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<LastWateredTimeQuery, LastWateredTimeQueryVariables>
) {
  return ApolloReactHooks.useLazyQuery<LastWateredTimeQuery, LastWateredTimeQueryVariables>(
    LastWateredTimeDocument,
    baseOptions
  );
}
export type LastWateredTimeQueryHookResult = ReturnType<typeof useLastWateredTimeQuery>;
export type LastWateredTimeLazyQueryHookResult = ReturnType<typeof useLastWateredTimeLazyQuery>;
export type LastWateredTimeQueryResult = ApolloReactCommon.QueryResult<
  LastWateredTimeQuery,
  LastWateredTimeQueryVariables
>;
