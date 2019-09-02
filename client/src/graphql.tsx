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
  moisture: Reading[];
  temperature: Reading[];
  batteryVoltage: Reading[];
  watered?: Maybe<Scalars['DateTime']>;
};
export type GetReadingsQueryVariables = {
  nodeId: Scalars['String'];
  date: Scalars['String'];
};

export type GetReadingsQuery = { __typename?: 'Query' } & {
  readings: { __typename?: 'Readings' } & Pick<Readings, 'watered'> & {
      moisture: ({ __typename?: 'Reading' } & Pick<Reading, 'time' | 'value'>)[];
      temperature: ({ __typename?: 'Reading' } & Pick<Reading, 'time' | 'value'>)[];
      batteryVoltage: ({ __typename?: 'Reading' } & Pick<Reading, 'time' | 'value'>)[];
    };
};

export const GetReadingsDocument = gql`
  query GetReadings($nodeId: String!, $date: String!) {
    readings(nodeId: $nodeId, date: $date) {
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

export function useGetReadingsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<GetReadingsQuery, GetReadingsQueryVariables>
) {
  return ApolloReactHooks.useQuery<GetReadingsQuery, GetReadingsQueryVariables>(GetReadingsDocument, baseOptions);
}
export function useGetReadingsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetReadingsQuery, GetReadingsQueryVariables>
) {
  return ApolloReactHooks.useLazyQuery<GetReadingsQuery, GetReadingsQueryVariables>(GetReadingsDocument, baseOptions);
}

export type GetReadingsQueryHookResult = ReturnType<typeof useGetReadingsQuery>;
export type GetReadingsQueryResult = ApolloReactCommon.QueryResult<GetReadingsQuery, GetReadingsQueryVariables>;
