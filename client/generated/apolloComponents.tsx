import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Datastore = {
  __typename?: 'Datastore';
  id: Scalars['ID'];
  name: Scalars['String'];
  userId: Scalars['Float'];
  localHostNodeId: Scalars['Float'];
  localNodeId: Scalars['Float'];
  basePath: Scalars['String'];
};

export type DownloadPathsInput = {
  path: Scalars['String'];
  type: Scalars['String'];
};

export type DownloadSessionInput = {
  type: Scalars['String'];
  downloadPaths: Array<DownloadPathsInput>;
  dataStoreId: Scalars['Float'];
};

export type DownloadSessionObject = {
  __typename?: 'DownloadSessionObject';
  path: Scalars['String'];
  type: Scalars['String'];
};

export type DownloadSessionReturn = {
  __typename?: 'DownloadSessionReturn';
  id?: Maybe<Scalars['String']>;
  data?: Maybe<Array<DownloadSessionObject>>;
  hostIp?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  port?: Maybe<Scalars['Float']>;
  password?: Maybe<Scalars['String']>;
};

export type GetTreeInput = {
  path: Scalars['String'];
  dataStoreId?: Maybe<Scalars['Float']>;
  depth?: Maybe<Scalars['Float']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUploadSession?: Maybe<UploadSessionReturn>;
  createDownloadSession: DownloadSessionReturn;
  login?: Maybe<User>;
  logout?: Maybe<Scalars['Boolean']>;
  register: User;
};


export type MutationCreateUploadSessionArgs = {
  data: UploadSessionInput;
};


export type MutationCreateDownloadSessionArgs = {
  data: DownloadSessionInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  data: RegisterInput;
};

export type Node = {
  __typename?: 'Node';
  id: Scalars['ID'];
  name: Scalars['String'];
  ip: Scalars['String'];
  host?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  tree: Tree;
  directoryTree: Tree;
};


export type QueryTreeArgs = {
  data: GetTreeInput;
};


export type QueryDirectoryTreeArgs = {
  data: GetTreeInput;
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  userName: Scalars['String'];
};

export type Tree = {
  __typename?: 'Tree';
  path: Scalars['String'];
  tree?: Maybe<Array<TreeItem>>;
};

export type TreeItem = {
  __typename?: 'TreeItem';
  name: Scalars['String'];
  path: Scalars['String'];
  relativePath: Scalars['String'];
  isDirectory: Scalars['Boolean'];
  dataStoreId?: Maybe<Scalars['Float']>;
  size?: Maybe<Scalars['Float']>;
  tree?: Maybe<Array<TreeItem>>;
};

export type UploadSessionInput = {
  uploadPath: Scalars['String'];
  dataStoreId: Scalars['Float'];
};

export type UploadSessionReturn = {
  __typename?: 'UploadSessionReturn';
  uploadPath: Scalars['String'];
  hostIp: Scalars['String'];
  username: Scalars['String'];
  port: Scalars['Float'];
  password: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  userName: Scalars['String'];
};

export type CreateSessionMutationVariables = Exact<{
  data: Array<DownloadPathsInput> | DownloadPathsInput;
  type: Scalars['String'];
  dataStoreId: Scalars['Float'];
}>;


export type CreateSessionMutation = { __typename?: 'Mutation', createDownloadSession: { __typename?: 'DownloadSessionReturn', hostIp?: Maybe<string>, username?: Maybe<string>, password?: Maybe<string>, port?: Maybe<number>, id?: Maybe<string>, data?: Maybe<Array<{ __typename?: 'DownloadSessionObject', type: string, path: string }>> } };

export type CreateUploadSessionMutationMutationVariables = Exact<{
  uploadPath: Scalars['String'];
  dataStoreId: Scalars['Float'];
}>;


export type CreateUploadSessionMutationMutation = { __typename?: 'Mutation', createUploadSession?: Maybe<{ __typename?: 'UploadSessionReturn', uploadPath: string, hostIp: string, username: string, port: number, password: string }> };

export type GetDirectoryTreeQueryQueryVariables = Exact<{
  path: Scalars['String'];
  depth: Scalars['Float'];
  dataStoreId?: Maybe<Scalars['Float']>;
}>;


export type GetDirectoryTreeQueryQuery = { __typename?: 'Query', directoryTree: { __typename: 'Tree', path: string, tree?: Maybe<Array<{ __typename: 'TreeItem', isDirectory: boolean, dataStoreId?: Maybe<number>, name: string, relativePath: string, path: string }>> } };

export type GetTreeQueryQueryVariables = Exact<{
  path: Scalars['String'];
  depth: Scalars['Float'];
  dataStoreId?: Maybe<Scalars['Float']>;
}>;


export type GetTreeQueryQuery = { __typename?: 'Query', tree: { __typename: 'Tree', path: string, tree?: Maybe<Array<{ __typename: 'TreeItem', relativePath: string, isDirectory: boolean, name: string, path: string }>> } };


export const CreateSessionDocument = gql`
    mutation createSession($data: [DownloadPathsInput!]!, $type: String!, $dataStoreId: Float!) {
  createDownloadSession(
    data: {type: $type, downloadPaths: $data, dataStoreId: $dataStoreId}
  ) {
    data {
      type
      path
    }
    hostIp
    username
    password
    port
    id
  }
}
    `;
export type CreateSessionMutationFn = Apollo.MutationFunction<CreateSessionMutation, CreateSessionMutationVariables>;

/**
 * __useCreateSessionMutation__
 *
 * To run a mutation, you first call `useCreateSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSessionMutation, { data, loading, error }] = useCreateSessionMutation({
 *   variables: {
 *      data: // value for 'data'
 *      type: // value for 'type'
 *      dataStoreId: // value for 'dataStoreId'
 *   },
 * });
 */
export function useCreateSessionMutation(baseOptions?: Apollo.MutationHookOptions<CreateSessionMutation, CreateSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSessionMutation, CreateSessionMutationVariables>(CreateSessionDocument, options);
      }
export type CreateSessionMutationHookResult = ReturnType<typeof useCreateSessionMutation>;
export type CreateSessionMutationResult = Apollo.MutationResult<CreateSessionMutation>;
export type CreateSessionMutationOptions = Apollo.BaseMutationOptions<CreateSessionMutation, CreateSessionMutationVariables>;
export const CreateUploadSessionMutationDocument = gql`
    mutation createUploadSessionMutation($uploadPath: String!, $dataStoreId: Float!) {
  createUploadSession(data: {uploadPath: $uploadPath, dataStoreId: $dataStoreId}) {
    uploadPath
    hostIp
    username
    port
    password
  }
}
    `;
export type CreateUploadSessionMutationMutationFn = Apollo.MutationFunction<CreateUploadSessionMutationMutation, CreateUploadSessionMutationMutationVariables>;

/**
 * __useCreateUploadSessionMutationMutation__
 *
 * To run a mutation, you first call `useCreateUploadSessionMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUploadSessionMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUploadSessionMutationMutation, { data, loading, error }] = useCreateUploadSessionMutationMutation({
 *   variables: {
 *      uploadPath: // value for 'uploadPath'
 *      dataStoreId: // value for 'dataStoreId'
 *   },
 * });
 */
export function useCreateUploadSessionMutationMutation(baseOptions?: Apollo.MutationHookOptions<CreateUploadSessionMutationMutation, CreateUploadSessionMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUploadSessionMutationMutation, CreateUploadSessionMutationMutationVariables>(CreateUploadSessionMutationDocument, options);
      }
export type CreateUploadSessionMutationMutationHookResult = ReturnType<typeof useCreateUploadSessionMutationMutation>;
export type CreateUploadSessionMutationMutationResult = Apollo.MutationResult<CreateUploadSessionMutationMutation>;
export type CreateUploadSessionMutationMutationOptions = Apollo.BaseMutationOptions<CreateUploadSessionMutationMutation, CreateUploadSessionMutationMutationVariables>;
export const GetDirectoryTreeQueryDocument = gql`
    query getDirectoryTreeQuery($path: String!, $depth: Float!, $dataStoreId: Float) {
  directoryTree(data: {path: $path, depth: $depth, dataStoreId: $dataStoreId}) {
    path
    __typename
    tree {
      isDirectory
      dataStoreId
      name
      relativePath
      path
      __typename
    }
  }
}
    `;

/**
 * __useGetDirectoryTreeQueryQuery__
 *
 * To run a query within a React component, call `useGetDirectoryTreeQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDirectoryTreeQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDirectoryTreeQueryQuery({
 *   variables: {
 *      path: // value for 'path'
 *      depth: // value for 'depth'
 *      dataStoreId: // value for 'dataStoreId'
 *   },
 * });
 */
export function useGetDirectoryTreeQueryQuery(baseOptions: Apollo.QueryHookOptions<GetDirectoryTreeQueryQuery, GetDirectoryTreeQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDirectoryTreeQueryQuery, GetDirectoryTreeQueryQueryVariables>(GetDirectoryTreeQueryDocument, options);
      }
export function useGetDirectoryTreeQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDirectoryTreeQueryQuery, GetDirectoryTreeQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDirectoryTreeQueryQuery, GetDirectoryTreeQueryQueryVariables>(GetDirectoryTreeQueryDocument, options);
        }
export type GetDirectoryTreeQueryQueryHookResult = ReturnType<typeof useGetDirectoryTreeQueryQuery>;
export type GetDirectoryTreeQueryLazyQueryHookResult = ReturnType<typeof useGetDirectoryTreeQueryLazyQuery>;
export type GetDirectoryTreeQueryQueryResult = Apollo.QueryResult<GetDirectoryTreeQueryQuery, GetDirectoryTreeQueryQueryVariables>;
export const GetTreeQueryDocument = gql`
    query getTreeQuery($path: String!, $depth: Float!, $dataStoreId: Float) {
  tree(data: {path: $path, dataStoreId: $dataStoreId, depth: $depth}) {
    path
    __typename
    tree {
      relativePath
      isDirectory
      name
      path
      __typename
    }
  }
}
    `;

/**
 * __useGetTreeQueryQuery__
 *
 * To run a query within a React component, call `useGetTreeQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTreeQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTreeQueryQuery({
 *   variables: {
 *      path: // value for 'path'
 *      depth: // value for 'depth'
 *      dataStoreId: // value for 'dataStoreId'
 *   },
 * });
 */
export function useGetTreeQueryQuery(baseOptions: Apollo.QueryHookOptions<GetTreeQueryQuery, GetTreeQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTreeQueryQuery, GetTreeQueryQueryVariables>(GetTreeQueryDocument, options);
      }
export function useGetTreeQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTreeQueryQuery, GetTreeQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTreeQueryQuery, GetTreeQueryQueryVariables>(GetTreeQueryDocument, options);
        }
export type GetTreeQueryQueryHookResult = ReturnType<typeof useGetTreeQueryQuery>;
export type GetTreeQueryLazyQueryHookResult = ReturnType<typeof useGetTreeQueryLazyQuery>;
export type GetTreeQueryQueryResult = Apollo.QueryResult<GetTreeQueryQuery, GetTreeQueryQueryVariables>;