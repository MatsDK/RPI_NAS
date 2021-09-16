import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateDataStoreInput = {
  localNodeId: Scalars["Float"];
  name: Scalars["String"];
};

export type Datastore = {
  __typename?: "Datastore";
  id: Scalars["ID"];
  name: Scalars["String"];
  userId: Scalars["Float"];
  localHostNodeId: Scalars["Float"];
  localNodeId: Scalars["Float"];
  basePath: Scalars["String"];
  sharedUsers: Array<User>;
  owner?: Maybe<User>;
};

export type DownloadPathsInput = {
  path: Scalars["String"];
  type: Scalars["String"];
};

export type DownloadSessionInput = {
  type: Scalars["String"];
  downloadPaths: Array<DownloadPathsInput>;
  dataStoreId: Scalars["Float"];
};

export type DownloadSessionObject = {
  __typename?: "DownloadSessionObject";
  path: Scalars["String"];
  type: Scalars["String"];
};

export type DownloadSessionReturn = {
  __typename?: "DownloadSessionReturn";
  id?: Maybe<Scalars["String"]>;
  data?: Maybe<Array<DownloadSessionObject>>;
  hostIp?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
  port?: Maybe<Scalars["Float"]>;
  password?: Maybe<Scalars["String"]>;
};

export type GetTreeInput = {
  path: Scalars["String"];
  dataStoreId?: Maybe<Scalars["Float"]>;
  depth?: Maybe<Scalars["Float"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  createDataStore?: Maybe<Datastore>;
  createUploadSession?: Maybe<UploadSessionReturn>;
  createDownloadSession?: Maybe<DownloadSessionReturn>;
  login?: Maybe<User>;
  logout?: Maybe<Scalars["Boolean"]>;
  register: User;
};

export type MutationCreateDataStoreArgs = {
  data: CreateDataStoreInput;
};

export type MutationCreateUploadSessionArgs = {
  data: UploadSessionInput;
};

export type MutationCreateDownloadSessionArgs = {
  data: DownloadSessionInput;
};

export type MutationLoginArgs = {
  password: Scalars["String"];
  email: Scalars["String"];
};

export type MutationRegisterArgs = {
  data: RegisterInput;
};

export type Node = {
  __typename?: "Node";
  id: Scalars["ID"];
  name: Scalars["String"];
  ip: Scalars["String"];
  loginName: Scalars["String"];
  password: Scalars["String"];
  port: Scalars["Float"];
  host: Scalars["String"];
  basePath: Scalars["String"];
  hostNode: Scalars["Boolean"];
};

export type Query = {
  __typename?: "Query";
  tree?: Maybe<Tree>;
  directoryTree?: Maybe<Tree>;
  getDataStores?: Maybe<Array<Datastore>>;
  me?: Maybe<User>;
};

export type QueryTreeArgs = {
  data: GetTreeInput;
};

export type QueryDirectoryTreeArgs = {
  data: GetTreeInput;
};

export type RegisterInput = {
  email: Scalars["String"];
  password: Scalars["String"];
  userName: Scalars["String"];
};

export type SharedDataStore = {
  __typename?: "SharedDataStore";
  id: Scalars["ID"];
  userId: Scalars["Float"];
  dataStoreId: Scalars["Float"];
};

export type Tree = {
  __typename?: "Tree";
  path: Scalars["String"];
  tree?: Maybe<Array<TreeItem>>;
};

export type TreeItem = {
  __typename?: "TreeItem";
  name: Scalars["String"];
  path: Scalars["String"];
  relativePath: Scalars["String"];
  isDirectory: Scalars["Boolean"];
  dataStoreId?: Maybe<Scalars["Float"]>;
  sharedDataStore?: Maybe<Scalars["Boolean"]>;
  size?: Maybe<Scalars["Float"]>;
  tree?: Maybe<Array<TreeItem>>;
};

export type UploadSessionInput = {
  uploadPath: Scalars["String"];
  dataStoreId: Scalars["Float"];
};

export type UploadSessionReturn = {
  __typename?: "UploadSessionReturn";
  uploadPath: Scalars["String"];
  hostIp: Scalars["String"];
  username: Scalars["String"];
  port: Scalars["Float"];
  password: Scalars["String"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  email: Scalars["String"];
  userName: Scalars["String"];
  isAdmin: Scalars["Boolean"];
};

export type GetDataStoresQueryVariables = Exact<{ [key: string]: never }>;

export type GetDataStoresQuery = {
  __typename?: "Query";
  getDataStores?: Maybe<
    Array<{
      __typename?: "Datastore";
      id: string;
      name: string;
      userId: number;
      localHostNodeId: number;
      localNodeId: number;
      basePath: string;
      owner?: Maybe<{
        __typename?: "User";
        id: string;
        userName: string;
        isAdmin: boolean;
      }>;
      sharedUsers: Array<{
        __typename?: "User";
        userName: string;
        isAdmin: boolean;
        id: string;
      }>;
    }>
  >;
};

export type CreateSessionMutationVariables = Exact<{
  data: Array<DownloadPathsInput> | DownloadPathsInput;
  type: Scalars["String"];
  dataStoreId: Scalars["Float"];
}>;

export type CreateSessionMutation = {
  __typename?: "Mutation";
  createDownloadSession?: Maybe<{
    __typename?: "DownloadSessionReturn";
    hostIp?: Maybe<string>;
    username?: Maybe<string>;
    password?: Maybe<string>;
    port?: Maybe<number>;
    id?: Maybe<string>;
    data?: Maybe<
      Array<{
        __typename?: "DownloadSessionObject";
        type: string;
        path: string;
      }>
    >;
  }>;
};

export type CreateUploadSessionMutationMutationVariables = Exact<{
  uploadPath: Scalars["String"];
  dataStoreId: Scalars["Float"];
}>;

export type CreateUploadSessionMutationMutation = {
  __typename?: "Mutation";
  createUploadSession?: Maybe<{
    __typename?: "UploadSessionReturn";
    uploadPath: string;
    hostIp: string;
    username: string;
    port: number;
    password: string;
  }>;
};

export type GetDirectoryTreeQueryQueryVariables = Exact<{
  path: Scalars["String"];
  depth: Scalars["Float"];
  dataStoreId?: Maybe<Scalars["Float"]>;
}>;

export type GetDirectoryTreeQueryQuery = {
  __typename?: "Query";
  directoryTree?: Maybe<{
    __typename: "Tree";
    path: string;
    tree?: Maybe<
      Array<{
        __typename: "TreeItem";
        isDirectory: boolean;
        dataStoreId?: Maybe<number>;
        sharedDataStore?: Maybe<boolean>;
        name: string;
        relativePath: string;
        path: string;
      }>
    >;
  }>;
};

export type GetTreeQueryQueryVariables = Exact<{
  path: Scalars["String"];
  depth: Scalars["Float"];
  dataStoreId?: Maybe<Scalars["Float"]>;
}>;

export type GetTreeQueryQuery = {
  __typename?: "Query";
  tree?: Maybe<{
    __typename: "Tree";
    path: string;
    tree?: Maybe<
      Array<{
        __typename: "TreeItem";
        relativePath: string;
        isDirectory: boolean;
        name: string;
        path: string;
      }>
    >;
  }>;
};

export type LoginMutationMutationVariables = Exact<{
  email: Scalars["String"];
  password: Scalars["String"];
}>;

export type LoginMutationMutation = {
  __typename?: "Mutation";
  login?: Maybe<{ __typename?: "User"; id: string }>;
};

export type LogoutMutationMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutationMutation = {
  __typename?: "Mutation";
  logout?: Maybe<boolean>;
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: "Query";
  me?: Maybe<{
    __typename?: "User";
    email: string;
    id: string;
    userName: string;
    isAdmin: boolean;
  }>;
};

export type RegisterMutationMutationVariables = Exact<{
  email: Scalars["String"];
  password: Scalars["String"];
  userName: Scalars["String"];
}>;

export type RegisterMutationMutation = {
  __typename?: "Mutation";
  register: { __typename?: "User"; id: string };
};

export const GetDataStoresDocument = gql`
  query GetDataStores {
    getDataStores {
      id
      name
      userId
      localHostNodeId
      localNodeId
      basePath
      owner {
        id
        userName
        isAdmin
      }
      sharedUsers {
        userName
        isAdmin
        id
      }
    }
  }
`;

/**
 * __useGetDataStoresQuery__
 *
 * To run a query within a React component, call `useGetDataStoresQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDataStoresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDataStoresQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDataStoresQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetDataStoresQuery,
    GetDataStoresQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetDataStoresQuery, GetDataStoresQueryVariables>(
    GetDataStoresDocument,
    options
  );
}
export function useGetDataStoresLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDataStoresQuery,
    GetDataStoresQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetDataStoresQuery, GetDataStoresQueryVariables>(
    GetDataStoresDocument,
    options
  );
}
export type GetDataStoresQueryHookResult = ReturnType<
  typeof useGetDataStoresQuery
>;
export type GetDataStoresLazyQueryHookResult = ReturnType<
  typeof useGetDataStoresLazyQuery
>;
export type GetDataStoresQueryResult = Apollo.QueryResult<
  GetDataStoresQuery,
  GetDataStoresQueryVariables
>;
export const CreateSessionDocument = gql`
  mutation createSession(
    $data: [DownloadPathsInput!]!
    $type: String!
    $dataStoreId: Float!
  ) {
    createDownloadSession(
      data: { type: $type, downloadPaths: $data, dataStoreId: $dataStoreId }
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
export type CreateSessionMutationFn = Apollo.MutationFunction<
  CreateSessionMutation,
  CreateSessionMutationVariables
>;

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
export function useCreateSessionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateSessionMutation,
    CreateSessionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateSessionMutation,
    CreateSessionMutationVariables
  >(CreateSessionDocument, options);
}
export type CreateSessionMutationHookResult = ReturnType<
  typeof useCreateSessionMutation
>;
export type CreateSessionMutationResult =
  Apollo.MutationResult<CreateSessionMutation>;
export type CreateSessionMutationOptions = Apollo.BaseMutationOptions<
  CreateSessionMutation,
  CreateSessionMutationVariables
>;
export const CreateUploadSessionMutationDocument = gql`
  mutation createUploadSessionMutation(
    $uploadPath: String!
    $dataStoreId: Float!
  ) {
    createUploadSession(
      data: { uploadPath: $uploadPath, dataStoreId: $dataStoreId }
    ) {
      uploadPath
      hostIp
      username
      port
      password
    }
  }
`;
export type CreateUploadSessionMutationMutationFn = Apollo.MutationFunction<
  CreateUploadSessionMutationMutation,
  CreateUploadSessionMutationMutationVariables
>;

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
export function useCreateUploadSessionMutationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateUploadSessionMutationMutation,
    CreateUploadSessionMutationMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateUploadSessionMutationMutation,
    CreateUploadSessionMutationMutationVariables
  >(CreateUploadSessionMutationDocument, options);
}
export type CreateUploadSessionMutationMutationHookResult = ReturnType<
  typeof useCreateUploadSessionMutationMutation
>;
export type CreateUploadSessionMutationMutationResult =
  Apollo.MutationResult<CreateUploadSessionMutationMutation>;
export type CreateUploadSessionMutationMutationOptions =
  Apollo.BaseMutationOptions<
    CreateUploadSessionMutationMutation,
    CreateUploadSessionMutationMutationVariables
  >;
export const GetDirectoryTreeQueryDocument = gql`
  query getDirectoryTreeQuery(
    $path: String!
    $depth: Float!
    $dataStoreId: Float
  ) {
    directoryTree(
      data: { path: $path, depth: $depth, dataStoreId: $dataStoreId }
    ) {
      path
      __typename
      tree {
        isDirectory
        dataStoreId
        sharedDataStore
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
export function useGetDirectoryTreeQueryQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetDirectoryTreeQueryQuery,
    GetDirectoryTreeQueryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetDirectoryTreeQueryQuery,
    GetDirectoryTreeQueryQueryVariables
  >(GetDirectoryTreeQueryDocument, options);
}
export function useGetDirectoryTreeQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDirectoryTreeQueryQuery,
    GetDirectoryTreeQueryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetDirectoryTreeQueryQuery,
    GetDirectoryTreeQueryQueryVariables
  >(GetDirectoryTreeQueryDocument, options);
}
export type GetDirectoryTreeQueryQueryHookResult = ReturnType<
  typeof useGetDirectoryTreeQueryQuery
>;
export type GetDirectoryTreeQueryLazyQueryHookResult = ReturnType<
  typeof useGetDirectoryTreeQueryLazyQuery
>;
export type GetDirectoryTreeQueryQueryResult = Apollo.QueryResult<
  GetDirectoryTreeQueryQuery,
  GetDirectoryTreeQueryQueryVariables
>;
export const GetTreeQueryDocument = gql`
  query getTreeQuery($path: String!, $depth: Float!, $dataStoreId: Float) {
    tree(data: { path: $path, dataStoreId: $dataStoreId, depth: $depth }) {
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
export function useGetTreeQueryQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetTreeQueryQuery,
    GetTreeQueryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTreeQueryQuery, GetTreeQueryQueryVariables>(
    GetTreeQueryDocument,
    options
  );
}
export function useGetTreeQueryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTreeQueryQuery,
    GetTreeQueryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTreeQueryQuery, GetTreeQueryQueryVariables>(
    GetTreeQueryDocument,
    options
  );
}
export type GetTreeQueryQueryHookResult = ReturnType<
  typeof useGetTreeQueryQuery
>;
export type GetTreeQueryLazyQueryHookResult = ReturnType<
  typeof useGetTreeQueryLazyQuery
>;
export type GetTreeQueryQueryResult = Apollo.QueryResult<
  GetTreeQueryQuery,
  GetTreeQueryQueryVariables
>;
export const LoginMutationDocument = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
    }
  }
`;
export type LoginMutationMutationFn = Apollo.MutationFunction<
  LoginMutationMutation,
  LoginMutationMutationVariables
>;

/**
 * __useLoginMutationMutation__
 *
 * To run a mutation, you first call `useLoginMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutationMutation, { data, loading, error }] = useLoginMutationMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginMutationMutation,
    LoginMutationMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    LoginMutationMutation,
    LoginMutationMutationVariables
  >(LoginMutationDocument, options);
}
export type LoginMutationMutationHookResult = ReturnType<
  typeof useLoginMutationMutation
>;
export type LoginMutationMutationResult =
  Apollo.MutationResult<LoginMutationMutation>;
export type LoginMutationMutationOptions = Apollo.BaseMutationOptions<
  LoginMutationMutation,
  LoginMutationMutationVariables
>;
export const LogoutMutationDocument = gql`
  mutation logoutMutation {
    logout
  }
`;
export type LogoutMutationMutationFn = Apollo.MutationFunction<
  LogoutMutationMutation,
  LogoutMutationMutationVariables
>;

/**
 * __useLogoutMutationMutation__
 *
 * To run a mutation, you first call `useLogoutMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutationMutation, { data, loading, error }] = useLogoutMutationMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LogoutMutationMutation,
    LogoutMutationMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    LogoutMutationMutation,
    LogoutMutationMutationVariables
  >(LogoutMutationDocument, options);
}
export type LogoutMutationMutationHookResult = ReturnType<
  typeof useLogoutMutationMutation
>;
export type LogoutMutationMutationResult =
  Apollo.MutationResult<LogoutMutationMutation>;
export type LogoutMutationMutationOptions = Apollo.BaseMutationOptions<
  LogoutMutationMutation,
  LogoutMutationMutationVariables
>;
export const MeDocument = gql`
  query me {
    me {
      email
      id
      userName
      isAdmin
    }
  }
`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const RegisterMutationDocument = gql`
  mutation registerMutation(
    $email: String!
    $password: String!
    $userName: String!
  ) {
    register(
      data: { email: $email, password: $password, userName: $userName }
    ) {
      id
    }
  }
`;
export type RegisterMutationMutationFn = Apollo.MutationFunction<
  RegisterMutationMutation,
  RegisterMutationMutationVariables
>;

/**
 * __useRegisterMutationMutation__
 *
 * To run a mutation, you first call `useRegisterMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutationMutation, { data, loading, error }] = useRegisterMutationMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      userName: // value for 'userName'
 *   },
 * });
 */
export function useRegisterMutationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterMutationMutation,
    RegisterMutationMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RegisterMutationMutation,
    RegisterMutationMutationVariables
  >(RegisterMutationDocument, options);
}
export type RegisterMutationMutationHookResult = ReturnType<
  typeof useRegisterMutationMutation
>;
export type RegisterMutationMutationResult =
  Apollo.MutationResult<RegisterMutationMutation>;
export type RegisterMutationMutationOptions = Apollo.BaseMutationOptions<
  RegisterMutationMutation,
  RegisterMutationMutationVariables
>;
