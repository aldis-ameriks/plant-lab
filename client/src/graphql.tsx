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
  readings: Readings;
};

export type QueryReadingsArgs = {
  date: Scalars['String'];
  nodeId: Scalars['String'];
};

export type Reading = {
  __typename?: 'Reading';
  time: Scalars['DateTime'];
  value: Scalars['Float'];
};

export type Readings = {
  __typename?: 'Readings';
  id: Scalars['ID'];
  moisture: Array<Reading>;
  temperature: Array<Reading>;
  batteryVoltage: Array<Reading>;
  watered?: Maybe<Scalars['DateTime']>;
};

export type ReadingsQueryVariables = {
  nodeId: Scalars['String'];
  date: Scalars['String'];
};

export type ReadingsQuery = { __typename?: 'Query' } & {
  readings: { __typename?: 'Readings' } & Pick<Readings, 'id' | 'watered'> & {
      moisture: Array<{ __typename?: 'Reading' } & Pick<Reading, 'time' | 'value'>>;
      temperature: Array<{ __typename?: 'Reading' } & Pick<Reading, 'time' | 'value'>>;
      batteryVoltage: Array<{ __typename?: 'Reading' } & Pick<Reading, 'time' | 'value'>>;
    };
};

export const ReadingsDocument = gql`
  query Readings($nodeId: String!, $date: String!) {
    readings(nodeId: $nodeId, date: $date) {
      id
      moisture {
        time
        value
      }
      temperature {
        time
        value
      }
      batteryVoltage {
        time
        value
      }
      watered
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
 *      nodeId: // value for 'nodeId'
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
