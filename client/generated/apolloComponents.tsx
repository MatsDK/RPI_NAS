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
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type AcceptNodeRequestInput = {
  id: Scalars['Float'];
  loginName: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type AllowedSmbUser = {
  allowed: Scalars['Boolean'];
  userId: Scalars['Float'];
};

export type CopyMoveDataObject = {
  path: Scalars['String'];
  type: Scalars['String'];
};

export type CopyMoveDestinationObject = {
  dataStoreId: Scalars['Float'];
  path: Scalars['String'];
};

export type CopyMoveInput = {
  data: Array<CopyMoveDataObject>;
  dataStoreId: Scalars['Float'];
  destination: CopyMoveDestinationObject;
};

export type CreateDataStoreInput = {
  localNodeId: Scalars['Float'];
  name: Scalars['String'];
  ownerId: Scalars['Float'];
  ownerPassword?: Maybe<Scalars['String']>;
  sizeInMB: Scalars['Float'];
};

export type CreateNodeInput = {
  loginName: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type CreateSharedDataStoreInput = {
  ids: Array<SharedDataStoresIdsInput>;
};

export type Datastore = {
  __typename?: 'Datastore';
  allowedSMBUsers: Array<Scalars['Float']>;
  basePath: Scalars['String'];
  id: Scalars['ID'];
  localHostNodeId: Scalars['Float'];
  localNodeId: Scalars['Float'];
  name: Scalars['String'];
  owner?: Maybe<User>;
  sharedUsers: Array<User>;
  size?: Maybe<SizeObject>;
  sizeInMB?: Maybe<Scalars['Float']>;
  status: Scalars['String'];
  userId: Scalars['Float'];
};

export type DatastoreService = {
  __typename?: 'DatastoreService';
  datastoreId: Scalars['Float'];
  serviceName: Scalars['String'];
  userId: Scalars['Float'];
};

export type DeletePathsInput = {
  path: Scalars['String'];
  type: Scalars['String'];
};

export type DownloadPathsInput = {
  path: Scalars['String'];
  type: Scalars['String'];
};

export type DownloadSessionInput = {
  dataStoreId: Scalars['Float'];
  downloadPaths: Array<DownloadPathsInput>;
  type: Scalars['String'];
};

export type DownloadSessionObject = {
  __typename?: 'DownloadSessionObject';
  path: Scalars['String'];
  type: Scalars['String'];
};

export type DownloadSessionReturn = {
  __typename?: 'DownloadSessionReturn';
  data?: Maybe<Array<DownloadSessionObject>>;
  hostIp?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  port?: Maybe<Scalars['Float']>;
  username?: Maybe<Scalars['String']>;
};

export type FriendRequest = {
  __typename?: 'FriendRequest';
  id: Scalars['ID'];
  userId1: Scalars['Float'];
  userId2: Scalars['Float'];
};

export type FriendsQueryReturn = {
  __typename?: 'FriendsQueryReturn';
  friends: Array<User>;
  friendsRequest: Array<User>;
};

export type GetNodesReturn = {
  __typename?: 'GetNodesReturn';
  nodeRequests: Array<NodeRequest>;
  nodes: Array<Node>;
};

export type GetTreeInput = {
  dataStoreId?: Maybe<Scalars['Float']>;
  depth?: Maybe<Scalars['Float']>;
  path: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  UploadProfilePicture?: Maybe<Scalars['Boolean']>;
  acceptFriendRequest?: Maybe<Scalars['Boolean']>;
  acceptNodeRequest?: Maybe<Node>;
  copy?: Maybe<Scalars['Boolean']>;
  createConnection?: Maybe<Scalars['Boolean']>;
  createDataStore?: Maybe<Datastore>;
  createDownloadSession?: Maybe<DownloadSessionReturn>;
  createFolder?: Maybe<Scalars['String']>;
  createNode?: Maybe<Node>;
  createNodeRequest: Scalars['Boolean'];
  createSharedDataStore?: Maybe<Scalars['Boolean']>;
  createUploadSession?: Maybe<UploadSessionReturn>;
  delete?: Maybe<Scalars['Boolean']>;
  deleteNodeRequest: Scalars['Boolean'];
  login?: Maybe<User>;
  logout?: Maybe<Scalars['Boolean']>;
  move?: Maybe<Scalars['Boolean']>;
  register?: Maybe<User>;
  sendFriendRequest?: Maybe<Scalars['Boolean']>;
  setDefaultDownloadPath?: Maybe<Scalars['Boolean']>;
  toggleDatastoreService?: Maybe<Scalars['Boolean']>;
  updateDatastore?: Maybe<Scalars['Boolean']>;
};


export type MutationUploadProfilePictureArgs = {
  file: Scalars['Upload'];
};


export type MutationAcceptFriendRequestArgs = {
  userId: Scalars['Float'];
};


export type MutationAcceptNodeRequestArgs = {
  data: AcceptNodeRequestInput;
};


export type MutationCopyArgs = {
  data: CopyMoveInput;
};


export type MutationCreateConnectionArgs = {
  uri: Scalars['String'];
};


export type MutationCreateDataStoreArgs = {
  data: CreateDataStoreInput;
};


export type MutationCreateDownloadSessionArgs = {
  data: DownloadSessionInput;
};


export type MutationCreateFolderArgs = {
  dataStoreId: Scalars['Float'];
  path: Scalars['String'];
};


export type MutationCreateNodeArgs = {
  data: CreateNodeInput;
};


export type MutationCreateNodeRequestArgs = {
  ip: Scalars['String'];
  port: Scalars['Float'];
};


export type MutationCreateSharedDataStoreArgs = {
  data: CreateSharedDataStoreInput;
};


export type MutationCreateUploadSessionArgs = {
  data: UploadSessionInput;
};


export type MutationDeleteArgs = {
  dataStoreId: Scalars['Float'];
  paths: Array<DeletePathsInput>;
};


export type MutationDeleteNodeRequestArgs = {
  id: Scalars['Float'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationMoveArgs = {
  data: CopyMoveInput;
};


export type MutationRegisterArgs = {
  data: RegisterInput;
};


export type MutationSendFriendRequestArgs = {
  userId: Scalars['Float'];
};


export type MutationSetDefaultDownloadPathArgs = {
  path: Scalars['String'];
};


export type MutationToggleDatastoreServiceArgs = {
  dataStoreId: Scalars['Float'];
  serviceName: Scalars['String'];
};


export type MutationUpdateDatastoreArgs = {
  dataStoreId: Scalars['Float'];
  updateProps: UpdateDatastoreInput;
};

export type Node = {
  __typename?: 'Node';
  basePath: Scalars['String'];
  hostNode: Scalars['Boolean'];
  id: Scalars['ID'];
  initializedUsers: Array<Scalars['Float']>;
  ip: Scalars['String'];
  loginName: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  port: Scalars['Float'];
  sshPort: Scalars['Float'];
  token?: Maybe<Scalars['String']>;
};

export type NodeRequest = {
  __typename?: 'NodeRequest';
  id: Scalars['Float'];
  ip: Scalars['String'];
  port: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  directoryTree?: Maybe<Tree>;
  friends?: Maybe<FriendsQueryReturn>;
  getDataStores?: Maybe<Array<Datastore>>;
  getDatastore?: Maybe<Datastore>;
  getFriends?: Maybe<Array<User>>;
  getMyDataStores?: Maybe<Array<Datastore>>;
  getNodes?: Maybe<GetNodesReturn>;
  getUsersByName?: Maybe<Array<User>>;
  me?: Maybe<User>;
  ping: Scalars['Boolean'];
  tree?: Maybe<Tree>;
};


export type QueryDirectoryTreeArgs = {
  data: GetTreeInput;
};


export type QueryGetDatastoreArgs = {
  datastoreId: Scalars['Float'];
};


export type QueryGetUsersByNameArgs = {
  name: Scalars['String'];
};


export type QueryTreeArgs = {
  data: GetTreeInput;
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  userName: Scalars['String'];
};

export type SharedDataStore = {
  __typename?: 'SharedDataStore';
  dataStoreId: Scalars['Float'];
  id: Scalars['ID'];
  userId: Scalars['Float'];
};

export type SharedDataStoresIdsInput = {
  dataStoreId: Scalars['Float'];
  userId: Scalars['Float'];
};

export type SizeObject = {
  __typename?: 'SizeObject';
  usedPercent: Scalars['Float'];
  usedSize: Scalars['Float'];
};

export type Tree = {
  __typename?: 'Tree';
  path: Scalars['String'];
  tree?: Maybe<Array<TreeItem>>;
};

export type TreeItem = {
  __typename?: 'TreeItem';
  dataStoreId?: Maybe<Scalars['Float']>;
  isDirectory: Scalars['Boolean'];
  name: Scalars['String'];
  path: Scalars['String'];
  relativePath: Scalars['String'];
  sharedDataStore?: Maybe<Scalars['Boolean']>;
  size?: Maybe<Scalars['Float']>;
  tree?: Maybe<Array<TreeItem>>;
};

export type UpdateDatastoreInput = {
  allowedSMBUsers?: Maybe<Array<AllowedSmbUser>>;
  name?: Maybe<Scalars['String']>;
  ownerSMBEnabled?: Maybe<Scalars['Boolean']>;
  sharedUsers?: Maybe<Array<Scalars['Float']>>;
};

export type UploadSessionInput = {
  dataStoreId: Scalars['Float'];
  uploadPath: Scalars['String'];
};

export type UploadSessionReturn = {
  __typename?: 'UploadSessionReturn';
  hostIp: Scalars['String'];
  password: Scalars['String'];
  port: Scalars['Float'];
  uploadPath: Scalars['String'];
  username: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  defaultDownloadPath?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  friends: Array<User>;
  id: Scalars['ID'];
  isAdmin: Scalars['Boolean'];
  osUserName: Scalars['String'];
  smbEnabled?: Maybe<Scalars['Boolean']>;
  userName: Scalars['String'];
};

export type CreateDataStoreMutionMutationVariables = Exact<{
  localNodeId: Scalars['Float'];
  name: Scalars['String'];
  sizeInMb: Scalars['Float'];
  ownerId: Scalars['Float'];
  ownerPassword?: Maybe<Scalars['String']>;
}>;


export type CreateDataStoreMutionMutation = { __typename?: 'Mutation', createDataStore?: { __typename?: 'Datastore', id: string } | null | undefined };

export type CreateSharedDataStoresMutaionMutationVariables = Exact<{
  ids: Array<SharedDataStoresIdsInput> | SharedDataStoresIdsInput;
}>;


export type CreateSharedDataStoresMutaionMutation = { __typename?: 'Mutation', createSharedDataStore?: boolean | null | undefined };

export type GetDataStoresQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDataStoresQuery = { __typename?: 'Query', getDataStores?: Array<{ __typename?: 'Datastore', id: string, name: string, userId: number, localHostNodeId: number, localNodeId: number, basePath: string, sizeInMB?: number | null | undefined, status: string, size?: { __typename?: 'SizeObject', usedSize: number, usedPercent: number } | null | undefined, owner?: { __typename?: 'User', id: string, userName: string, isAdmin: boolean } | null | undefined, sharedUsers: Array<{ __typename?: 'User', userName: string, isAdmin: boolean, id: string }> }> | null | undefined };

export type GetDatastoreQueryVariables = Exact<{
  datastoreId: Scalars['Float'];
}>;


export type GetDatastoreQuery = { __typename?: 'Query', getDatastore?: { __typename?: 'Datastore', id: string, name: string, userId: number, localHostNodeId: number, localNodeId: number, basePath: string, sizeInMB?: number | null | undefined, allowedSMBUsers: Array<number>, status: string, size?: { __typename?: 'SizeObject', usedSize: number, usedPercent: number } | null | undefined, owner?: { __typename?: 'User', id: string, userName: string, smbEnabled?: boolean | null | undefined, isAdmin: boolean } | null | undefined, sharedUsers: Array<{ __typename?: 'User', id: string, userName: string, smbEnabled?: boolean | null | undefined, isAdmin: boolean }> } | null | undefined };

export type ToggleDatastoreServiceMutationMutationVariables = Exact<{
  serviceName: Scalars['String'];
  datastoreId: Scalars['Float'];
}>;


export type ToggleDatastoreServiceMutationMutation = { __typename?: 'Mutation', toggleDatastoreService?: boolean | null | undefined };

export type UpdateDatastoreMutationMutationVariables = Exact<{
  datastoreId: Scalars['Float'];
  sharedUsers?: Maybe<Array<Scalars['Float']> | Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  ownerSMBEnabled?: Maybe<Scalars['Boolean']>;
  allowedSMBUsers?: Maybe<Array<AllowedSmbUser> | AllowedSmbUser>;
}>;


export type UpdateDatastoreMutationMutation = { __typename?: 'Mutation', updateDatastore?: boolean | null | undefined };

export type CopyDataMutationMutationVariables = Exact<{
  dataStoreId: Scalars['Float'];
  destination: CopyMoveDestinationObject;
  data: Array<CopyMoveDataObject> | CopyMoveDataObject;
}>;


export type CopyDataMutationMutation = { __typename?: 'Mutation', copy?: boolean | null | undefined };

export type CreateFolderMutationMutationVariables = Exact<{
  path: Scalars['String'];
  dataStoreId: Scalars['Float'];
}>;


export type CreateFolderMutationMutation = { __typename?: 'Mutation', createFolder?: string | null | undefined };

export type DeleteDataMutationMutationVariables = Exact<{
  paths: Array<DeletePathsInput> | DeletePathsInput;
  dataStoreId: Scalars['Float'];
}>;


export type DeleteDataMutationMutation = { __typename?: 'Mutation', delete?: boolean | null | undefined };

export type MoveDataMutationMutationVariables = Exact<{
  dataStoreId: Scalars['Float'];
  destination: CopyMoveDestinationObject;
  data: Array<CopyMoveDataObject> | CopyMoveDataObject;
}>;


export type MoveDataMutationMutation = { __typename?: 'Mutation', move?: boolean | null | undefined };

export type AcceptFriendRequestMutationVariables = Exact<{
  userId: Scalars['Float'];
}>;


export type AcceptFriendRequestMutation = { __typename?: 'Mutation', acceptFriendRequest?: boolean | null | undefined };

export type GetFriendsAndFriendRequestsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFriendsAndFriendRequestsQueryQuery = { __typename?: 'Query', friends?: { __typename?: 'FriendsQueryReturn', friends: Array<{ __typename?: 'User', id: string, userName: string }>, friendsRequest: Array<{ __typename?: 'User', id: string, userName: string }> } | null | undefined };

export type GetFriendsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFriendsQueryQuery = { __typename?: 'Query', getFriends?: Array<{ __typename?: 'User', id: string, userName: string }> | null | undefined };

export type SendFriendRequestMutationVariables = Exact<{
  userId: Scalars['Float'];
}>;


export type SendFriendRequestMutation = { __typename?: 'Mutation', sendFriendRequest?: boolean | null | undefined };

export type AcceptNodeRequestMutationVariables = Exact<{
  id: Scalars['Float'];
  name: Scalars['String'];
  loginName: Scalars['String'];
  password: Scalars['String'];
}>;


export type AcceptNodeRequestMutation = { __typename?: 'Mutation', acceptNodeRequest?: { __typename?: 'Node', id: string } | null | undefined };

export type CreateHostNodeMutationMutationVariables = Exact<{
  name: Scalars['String'];
  loginName: Scalars['String'];
  password: Scalars['String'];
}>;


export type CreateHostNodeMutationMutation = { __typename?: 'Mutation', createNode?: { __typename?: 'Node', id: string } | null | undefined };

export type DeleteNodeRequestMutationMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteNodeRequestMutationMutation = { __typename?: 'Mutation', deleteNodeRequest: boolean };

export type GetNodesQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNodesQueryQuery = { __typename?: 'Query', getNodes?: { __typename?: 'GetNodesReturn', nodes: Array<{ __typename?: 'Node', id: string, ip: string, name: string, loginName: string, basePath: string, hostNode: boolean }>, nodeRequests: Array<{ __typename?: 'NodeRequest', id: number, ip: string, port: number }> } | null | undefined };

export type CreateSessionMutationVariables = Exact<{
  data: Array<DownloadPathsInput> | DownloadPathsInput;
  type: Scalars['String'];
  dataStoreId: Scalars['Float'];
}>;


export type CreateSessionMutation = { __typename?: 'Mutation', createDownloadSession?: { __typename?: 'DownloadSessionReturn', hostIp?: string | null | undefined, username?: string | null | undefined, password?: string | null | undefined, port?: number | null | undefined, id?: string | null | undefined, data?: Array<{ __typename?: 'DownloadSessionObject', type: string, path: string }> | null | undefined } | null | undefined };

export type CreateUploadSessionMutationMutationVariables = Exact<{
  uploadPath: Scalars['String'];
  dataStoreId: Scalars['Float'];
}>;


export type CreateUploadSessionMutationMutation = { __typename?: 'Mutation', createUploadSession?: { __typename?: 'UploadSessionReturn', uploadPath: string, hostIp: string, username: string, port: number, password: string } | null | undefined };

export type GetDirectoryTreeQueryQueryVariables = Exact<{
  path: Scalars['String'];
  depth: Scalars['Float'];
  dataStoreId?: Maybe<Scalars['Float']>;
}>;


export type GetDirectoryTreeQueryQuery = { __typename?: 'Query', directoryTree?: { __typename: 'Tree', path: string, tree?: Array<{ __typename: 'TreeItem', isDirectory: boolean, dataStoreId?: number | null | undefined, sharedDataStore?: boolean | null | undefined, name: string, relativePath: string, path: string }> | null | undefined } | null | undefined };

export type GetTreeQueryQueryVariables = Exact<{
  path: Scalars['String'];
  depth: Scalars['Float'];
  dataStoreId?: Maybe<Scalars['Float']>;
}>;


export type GetTreeQueryQuery = { __typename?: 'Query', tree?: { __typename: 'Tree', path: string, tree?: Array<{ __typename: 'TreeItem', relativePath: string, isDirectory: boolean, name: string, path: string }> | null | undefined } | null | undefined };

export type UploadMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadMutation = { __typename?: 'Mutation', UploadProfilePicture?: boolean | null | undefined };

export type GetUserNameByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetUserNameByNameQuery = { __typename?: 'Query', getUsersByName?: Array<{ __typename?: 'User', userName: string, id: string }> | null | undefined };

export type GetMyDataStoresQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyDataStoresQuery = { __typename?: 'Query', getMyDataStores?: Array<{ __typename?: 'Datastore', id: string, name: string }> | null | undefined };

export type LoginMutationMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutationMutation = { __typename?: 'Mutation', login?: { __typename?: 'User', id: string } | null | undefined };

export type LogoutMutationMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutationMutation = { __typename?: 'Mutation', logout?: boolean | null | undefined };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', email: string, id: string, userName: string, isAdmin: boolean, defaultDownloadPath?: string | null | undefined } | null | undefined };

export type RegisterMutationMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  userName: Scalars['String'];
}>;


export type RegisterMutationMutation = { __typename?: 'Mutation', register?: { __typename?: 'User', id: string } | null | undefined };

export type SetDefaultDownloadPathMutationVariables = Exact<{
  path: Scalars['String'];
}>;


export type SetDefaultDownloadPathMutation = { __typename?: 'Mutation', setDefaultDownloadPath?: boolean | null | undefined };


export const CreateDataStoreMutionDocument = gql`
    mutation CreateDataStoreMution($localNodeId: Float!, $name: String!, $sizeInMb: Float!, $ownerId: Float!, $ownerPassword: String) {
  createDataStore(
    data: {localNodeId: $localNodeId, name: $name, sizeInMB: $sizeInMb, ownerId: $ownerId, ownerPassword: $ownerPassword}
  ) {
    id
  }
}
    `;
export type CreateDataStoreMutionMutationFn = Apollo.MutationFunction<CreateDataStoreMutionMutation, CreateDataStoreMutionMutationVariables>;

/**
 * __useCreateDataStoreMutionMutation__
 *
 * To run a mutation, you first call `useCreateDataStoreMutionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDataStoreMutionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDataStoreMutionMutation, { data, loading, error }] = useCreateDataStoreMutionMutation({
 *   variables: {
 *      localNodeId: // value for 'localNodeId'
 *      name: // value for 'name'
 *      sizeInMb: // value for 'sizeInMb'
 *      ownerId: // value for 'ownerId'
 *      ownerPassword: // value for 'ownerPassword'
 *   },
 * });
 */
export function useCreateDataStoreMutionMutation(baseOptions?: Apollo.MutationHookOptions<CreateDataStoreMutionMutation, CreateDataStoreMutionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDataStoreMutionMutation, CreateDataStoreMutionMutationVariables>(CreateDataStoreMutionDocument, options);
      }
export type CreateDataStoreMutionMutationHookResult = ReturnType<typeof useCreateDataStoreMutionMutation>;
export type CreateDataStoreMutionMutationResult = Apollo.MutationResult<CreateDataStoreMutionMutation>;
export type CreateDataStoreMutionMutationOptions = Apollo.BaseMutationOptions<CreateDataStoreMutionMutation, CreateDataStoreMutionMutationVariables>;
export const CreateSharedDataStoresMutaionDocument = gql`
    mutation CreateSharedDataStoresMutaion($ids: [SharedDataStoresIdsInput!]!) {
  createSharedDataStore(data: {ids: $ids})
}
    `;
export type CreateSharedDataStoresMutaionMutationFn = Apollo.MutationFunction<CreateSharedDataStoresMutaionMutation, CreateSharedDataStoresMutaionMutationVariables>;

/**
 * __useCreateSharedDataStoresMutaionMutation__
 *
 * To run a mutation, you first call `useCreateSharedDataStoresMutaionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSharedDataStoresMutaionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSharedDataStoresMutaionMutation, { data, loading, error }] = useCreateSharedDataStoresMutaionMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useCreateSharedDataStoresMutaionMutation(baseOptions?: Apollo.MutationHookOptions<CreateSharedDataStoresMutaionMutation, CreateSharedDataStoresMutaionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSharedDataStoresMutaionMutation, CreateSharedDataStoresMutaionMutationVariables>(CreateSharedDataStoresMutaionDocument, options);
      }
export type CreateSharedDataStoresMutaionMutationHookResult = ReturnType<typeof useCreateSharedDataStoresMutaionMutation>;
export type CreateSharedDataStoresMutaionMutationResult = Apollo.MutationResult<CreateSharedDataStoresMutaionMutation>;
export type CreateSharedDataStoresMutaionMutationOptions = Apollo.BaseMutationOptions<CreateSharedDataStoresMutaionMutation, CreateSharedDataStoresMutaionMutationVariables>;
export const GetDataStoresDocument = gql`
    query GetDataStores {
  getDataStores {
    id
    name
    userId
    localHostNodeId
    localNodeId
    basePath
    sizeInMB
    size {
      usedSize
      usedPercent
    }
    status
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
export function useGetDataStoresQuery(baseOptions?: Apollo.QueryHookOptions<GetDataStoresQuery, GetDataStoresQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDataStoresQuery, GetDataStoresQueryVariables>(GetDataStoresDocument, options);
      }
export function useGetDataStoresLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDataStoresQuery, GetDataStoresQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDataStoresQuery, GetDataStoresQueryVariables>(GetDataStoresDocument, options);
        }
export type GetDataStoresQueryHookResult = ReturnType<typeof useGetDataStoresQuery>;
export type GetDataStoresLazyQueryHookResult = ReturnType<typeof useGetDataStoresLazyQuery>;
export type GetDataStoresQueryResult = Apollo.QueryResult<GetDataStoresQuery, GetDataStoresQueryVariables>;
export const GetDatastoreDocument = gql`
    query getDatastore($datastoreId: Float!) {
  getDatastore(datastoreId: $datastoreId) {
    id
    name
    userId
    localHostNodeId
    localNodeId
    basePath
    sizeInMB
    allowedSMBUsers
    size {
      usedSize
      usedPercent
    }
    status
    owner {
      id
      userName
      smbEnabled
      isAdmin
    }
    sharedUsers {
      id
      userName
      smbEnabled
      isAdmin
    }
  }
}
    `;

/**
 * __useGetDatastoreQuery__
 *
 * To run a query within a React component, call `useGetDatastoreQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDatastoreQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDatastoreQuery({
 *   variables: {
 *      datastoreId: // value for 'datastoreId'
 *   },
 * });
 */
export function useGetDatastoreQuery(baseOptions: Apollo.QueryHookOptions<GetDatastoreQuery, GetDatastoreQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDatastoreQuery, GetDatastoreQueryVariables>(GetDatastoreDocument, options);
      }
export function useGetDatastoreLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDatastoreQuery, GetDatastoreQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDatastoreQuery, GetDatastoreQueryVariables>(GetDatastoreDocument, options);
        }
export type GetDatastoreQueryHookResult = ReturnType<typeof useGetDatastoreQuery>;
export type GetDatastoreLazyQueryHookResult = ReturnType<typeof useGetDatastoreLazyQuery>;
export type GetDatastoreQueryResult = Apollo.QueryResult<GetDatastoreQuery, GetDatastoreQueryVariables>;
export const ToggleDatastoreServiceMutationDocument = gql`
    mutation ToggleDatastoreServiceMutation($serviceName: String!, $datastoreId: Float!) {
  toggleDatastoreService(serviceName: $serviceName, dataStoreId: $datastoreId)
}
    `;
export type ToggleDatastoreServiceMutationMutationFn = Apollo.MutationFunction<ToggleDatastoreServiceMutationMutation, ToggleDatastoreServiceMutationMutationVariables>;

/**
 * __useToggleDatastoreServiceMutationMutation__
 *
 * To run a mutation, you first call `useToggleDatastoreServiceMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleDatastoreServiceMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleDatastoreServiceMutationMutation, { data, loading, error }] = useToggleDatastoreServiceMutationMutation({
 *   variables: {
 *      serviceName: // value for 'serviceName'
 *      datastoreId: // value for 'datastoreId'
 *   },
 * });
 */
export function useToggleDatastoreServiceMutationMutation(baseOptions?: Apollo.MutationHookOptions<ToggleDatastoreServiceMutationMutation, ToggleDatastoreServiceMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleDatastoreServiceMutationMutation, ToggleDatastoreServiceMutationMutationVariables>(ToggleDatastoreServiceMutationDocument, options);
      }
export type ToggleDatastoreServiceMutationMutationHookResult = ReturnType<typeof useToggleDatastoreServiceMutationMutation>;
export type ToggleDatastoreServiceMutationMutationResult = Apollo.MutationResult<ToggleDatastoreServiceMutationMutation>;
export type ToggleDatastoreServiceMutationMutationOptions = Apollo.BaseMutationOptions<ToggleDatastoreServiceMutationMutation, ToggleDatastoreServiceMutationMutationVariables>;
export const UpdateDatastoreMutationDocument = gql`
    mutation UpdateDatastoreMutation($datastoreId: Float!, $sharedUsers: [Float!], $name: String, $ownerSMBEnabled: Boolean, $allowedSMBUsers: [AllowedSMBUser!]) {
  updateDatastore(
    dataStoreId: $datastoreId
    updateProps: {sharedUsers: $sharedUsers, allowedSMBUsers: $allowedSMBUsers, name: $name, ownerSMBEnabled: $ownerSMBEnabled}
  )
}
    `;
export type UpdateDatastoreMutationMutationFn = Apollo.MutationFunction<UpdateDatastoreMutationMutation, UpdateDatastoreMutationMutationVariables>;

/**
 * __useUpdateDatastoreMutationMutation__
 *
 * To run a mutation, you first call `useUpdateDatastoreMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDatastoreMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDatastoreMutationMutation, { data, loading, error }] = useUpdateDatastoreMutationMutation({
 *   variables: {
 *      datastoreId: // value for 'datastoreId'
 *      sharedUsers: // value for 'sharedUsers'
 *      name: // value for 'name'
 *      ownerSMBEnabled: // value for 'ownerSMBEnabled'
 *      allowedSMBUsers: // value for 'allowedSMBUsers'
 *   },
 * });
 */
export function useUpdateDatastoreMutationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDatastoreMutationMutation, UpdateDatastoreMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDatastoreMutationMutation, UpdateDatastoreMutationMutationVariables>(UpdateDatastoreMutationDocument, options);
      }
export type UpdateDatastoreMutationMutationHookResult = ReturnType<typeof useUpdateDatastoreMutationMutation>;
export type UpdateDatastoreMutationMutationResult = Apollo.MutationResult<UpdateDatastoreMutationMutation>;
export type UpdateDatastoreMutationMutationOptions = Apollo.BaseMutationOptions<UpdateDatastoreMutationMutation, UpdateDatastoreMutationMutationVariables>;
export const CopyDataMutationDocument = gql`
    mutation CopyDataMutation($dataStoreId: Float!, $destination: CopyMoveDestinationObject!, $data: [CopyMoveDataObject!]!) {
  copy(data: {dataStoreId: $dataStoreId, destination: $destination, data: $data})
}
    `;
export type CopyDataMutationMutationFn = Apollo.MutationFunction<CopyDataMutationMutation, CopyDataMutationMutationVariables>;

/**
 * __useCopyDataMutationMutation__
 *
 * To run a mutation, you first call `useCopyDataMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCopyDataMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [copyDataMutationMutation, { data, loading, error }] = useCopyDataMutationMutation({
 *   variables: {
 *      dataStoreId: // value for 'dataStoreId'
 *      destination: // value for 'destination'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCopyDataMutationMutation(baseOptions?: Apollo.MutationHookOptions<CopyDataMutationMutation, CopyDataMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CopyDataMutationMutation, CopyDataMutationMutationVariables>(CopyDataMutationDocument, options);
      }
export type CopyDataMutationMutationHookResult = ReturnType<typeof useCopyDataMutationMutation>;
export type CopyDataMutationMutationResult = Apollo.MutationResult<CopyDataMutationMutation>;
export type CopyDataMutationMutationOptions = Apollo.BaseMutationOptions<CopyDataMutationMutation, CopyDataMutationMutationVariables>;
export const CreateFolderMutationDocument = gql`
    mutation CreateFolderMutation($path: String!, $dataStoreId: Float!) {
  createFolder(path: $path, dataStoreId: $dataStoreId)
}
    `;
export type CreateFolderMutationMutationFn = Apollo.MutationFunction<CreateFolderMutationMutation, CreateFolderMutationMutationVariables>;

/**
 * __useCreateFolderMutationMutation__
 *
 * To run a mutation, you first call `useCreateFolderMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFolderMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFolderMutationMutation, { data, loading, error }] = useCreateFolderMutationMutation({
 *   variables: {
 *      path: // value for 'path'
 *      dataStoreId: // value for 'dataStoreId'
 *   },
 * });
 */
export function useCreateFolderMutationMutation(baseOptions?: Apollo.MutationHookOptions<CreateFolderMutationMutation, CreateFolderMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFolderMutationMutation, CreateFolderMutationMutationVariables>(CreateFolderMutationDocument, options);
      }
export type CreateFolderMutationMutationHookResult = ReturnType<typeof useCreateFolderMutationMutation>;
export type CreateFolderMutationMutationResult = Apollo.MutationResult<CreateFolderMutationMutation>;
export type CreateFolderMutationMutationOptions = Apollo.BaseMutationOptions<CreateFolderMutationMutation, CreateFolderMutationMutationVariables>;
export const DeleteDataMutationDocument = gql`
    mutation DeleteDataMutation($paths: [DeletePathsInput!]!, $dataStoreId: Float!) {
  delete(paths: $paths, dataStoreId: $dataStoreId)
}
    `;
export type DeleteDataMutationMutationFn = Apollo.MutationFunction<DeleteDataMutationMutation, DeleteDataMutationMutationVariables>;

/**
 * __useDeleteDataMutationMutation__
 *
 * To run a mutation, you first call `useDeleteDataMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDataMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDataMutationMutation, { data, loading, error }] = useDeleteDataMutationMutation({
 *   variables: {
 *      paths: // value for 'paths'
 *      dataStoreId: // value for 'dataStoreId'
 *   },
 * });
 */
export function useDeleteDataMutationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDataMutationMutation, DeleteDataMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDataMutationMutation, DeleteDataMutationMutationVariables>(DeleteDataMutationDocument, options);
      }
export type DeleteDataMutationMutationHookResult = ReturnType<typeof useDeleteDataMutationMutation>;
export type DeleteDataMutationMutationResult = Apollo.MutationResult<DeleteDataMutationMutation>;
export type DeleteDataMutationMutationOptions = Apollo.BaseMutationOptions<DeleteDataMutationMutation, DeleteDataMutationMutationVariables>;
export const MoveDataMutationDocument = gql`
    mutation MoveDataMutation($dataStoreId: Float!, $destination: CopyMoveDestinationObject!, $data: [CopyMoveDataObject!]!) {
  move(data: {dataStoreId: $dataStoreId, destination: $destination, data: $data})
}
    `;
export type MoveDataMutationMutationFn = Apollo.MutationFunction<MoveDataMutationMutation, MoveDataMutationMutationVariables>;

/**
 * __useMoveDataMutationMutation__
 *
 * To run a mutation, you first call `useMoveDataMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoveDataMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moveDataMutationMutation, { data, loading, error }] = useMoveDataMutationMutation({
 *   variables: {
 *      dataStoreId: // value for 'dataStoreId'
 *      destination: // value for 'destination'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useMoveDataMutationMutation(baseOptions?: Apollo.MutationHookOptions<MoveDataMutationMutation, MoveDataMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MoveDataMutationMutation, MoveDataMutationMutationVariables>(MoveDataMutationDocument, options);
      }
export type MoveDataMutationMutationHookResult = ReturnType<typeof useMoveDataMutationMutation>;
export type MoveDataMutationMutationResult = Apollo.MutationResult<MoveDataMutationMutation>;
export type MoveDataMutationMutationOptions = Apollo.BaseMutationOptions<MoveDataMutationMutation, MoveDataMutationMutationVariables>;
export const AcceptFriendRequestDocument = gql`
    mutation AcceptFriendRequest($userId: Float!) {
  acceptFriendRequest(userId: $userId)
}
    `;
export type AcceptFriendRequestMutationFn = Apollo.MutationFunction<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>;

/**
 * __useAcceptFriendRequestMutation__
 *
 * To run a mutation, you first call `useAcceptFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptFriendRequestMutation, { data, loading, error }] = useAcceptFriendRequestMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useAcceptFriendRequestMutation(baseOptions?: Apollo.MutationHookOptions<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>(AcceptFriendRequestDocument, options);
      }
export type AcceptFriendRequestMutationHookResult = ReturnType<typeof useAcceptFriendRequestMutation>;
export type AcceptFriendRequestMutationResult = Apollo.MutationResult<AcceptFriendRequestMutation>;
export type AcceptFriendRequestMutationOptions = Apollo.BaseMutationOptions<AcceptFriendRequestMutation, AcceptFriendRequestMutationVariables>;
export const GetFriendsAndFriendRequestsQueryDocument = gql`
    query GetFriendsAndFriendRequestsQuery {
  friends {
    friends {
      id
      userName
    }
    friendsRequest {
      id
      userName
    }
  }
}
    `;

/**
 * __useGetFriendsAndFriendRequestsQueryQuery__
 *
 * To run a query within a React component, call `useGetFriendsAndFriendRequestsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFriendsAndFriendRequestsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFriendsAndFriendRequestsQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFriendsAndFriendRequestsQueryQuery(baseOptions?: Apollo.QueryHookOptions<GetFriendsAndFriendRequestsQueryQuery, GetFriendsAndFriendRequestsQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFriendsAndFriendRequestsQueryQuery, GetFriendsAndFriendRequestsQueryQueryVariables>(GetFriendsAndFriendRequestsQueryDocument, options);
      }
export function useGetFriendsAndFriendRequestsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFriendsAndFriendRequestsQueryQuery, GetFriendsAndFriendRequestsQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFriendsAndFriendRequestsQueryQuery, GetFriendsAndFriendRequestsQueryQueryVariables>(GetFriendsAndFriendRequestsQueryDocument, options);
        }
export type GetFriendsAndFriendRequestsQueryQueryHookResult = ReturnType<typeof useGetFriendsAndFriendRequestsQueryQuery>;
export type GetFriendsAndFriendRequestsQueryLazyQueryHookResult = ReturnType<typeof useGetFriendsAndFriendRequestsQueryLazyQuery>;
export type GetFriendsAndFriendRequestsQueryQueryResult = Apollo.QueryResult<GetFriendsAndFriendRequestsQueryQuery, GetFriendsAndFriendRequestsQueryQueryVariables>;
export const GetFriendsQueryDocument = gql`
    query getFriendsQuery {
  getFriends {
    id
    userName
  }
}
    `;

/**
 * __useGetFriendsQueryQuery__
 *
 * To run a query within a React component, call `useGetFriendsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFriendsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFriendsQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFriendsQueryQuery(baseOptions?: Apollo.QueryHookOptions<GetFriendsQueryQuery, GetFriendsQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFriendsQueryQuery, GetFriendsQueryQueryVariables>(GetFriendsQueryDocument, options);
      }
export function useGetFriendsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFriendsQueryQuery, GetFriendsQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFriendsQueryQuery, GetFriendsQueryQueryVariables>(GetFriendsQueryDocument, options);
        }
export type GetFriendsQueryQueryHookResult = ReturnType<typeof useGetFriendsQueryQuery>;
export type GetFriendsQueryLazyQueryHookResult = ReturnType<typeof useGetFriendsQueryLazyQuery>;
export type GetFriendsQueryQueryResult = Apollo.QueryResult<GetFriendsQueryQuery, GetFriendsQueryQueryVariables>;
export const SendFriendRequestDocument = gql`
    mutation SendFriendRequest($userId: Float!) {
  sendFriendRequest(userId: $userId)
}
    `;
export type SendFriendRequestMutationFn = Apollo.MutationFunction<SendFriendRequestMutation, SendFriendRequestMutationVariables>;

/**
 * __useSendFriendRequestMutation__
 *
 * To run a mutation, you first call `useSendFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendFriendRequestMutation, { data, loading, error }] = useSendFriendRequestMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useSendFriendRequestMutation(baseOptions?: Apollo.MutationHookOptions<SendFriendRequestMutation, SendFriendRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendFriendRequestMutation, SendFriendRequestMutationVariables>(SendFriendRequestDocument, options);
      }
export type SendFriendRequestMutationHookResult = ReturnType<typeof useSendFriendRequestMutation>;
export type SendFriendRequestMutationResult = Apollo.MutationResult<SendFriendRequestMutation>;
export type SendFriendRequestMutationOptions = Apollo.BaseMutationOptions<SendFriendRequestMutation, SendFriendRequestMutationVariables>;
export const AcceptNodeRequestDocument = gql`
    mutation AcceptNodeRequest($id: Float!, $name: String!, $loginName: String!, $password: String!) {
  acceptNodeRequest(
    data: {id: $id, name: $name, loginName: $loginName, password: $password}
  ) {
    id
  }
}
    `;
export type AcceptNodeRequestMutationFn = Apollo.MutationFunction<AcceptNodeRequestMutation, AcceptNodeRequestMutationVariables>;

/**
 * __useAcceptNodeRequestMutation__
 *
 * To run a mutation, you first call `useAcceptNodeRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptNodeRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptNodeRequestMutation, { data, loading, error }] = useAcceptNodeRequestMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      loginName: // value for 'loginName'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useAcceptNodeRequestMutation(baseOptions?: Apollo.MutationHookOptions<AcceptNodeRequestMutation, AcceptNodeRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptNodeRequestMutation, AcceptNodeRequestMutationVariables>(AcceptNodeRequestDocument, options);
      }
export type AcceptNodeRequestMutationHookResult = ReturnType<typeof useAcceptNodeRequestMutation>;
export type AcceptNodeRequestMutationResult = Apollo.MutationResult<AcceptNodeRequestMutation>;
export type AcceptNodeRequestMutationOptions = Apollo.BaseMutationOptions<AcceptNodeRequestMutation, AcceptNodeRequestMutationVariables>;
export const CreateHostNodeMutationDocument = gql`
    mutation CreateHostNodeMutation($name: String!, $loginName: String!, $password: String!) {
  createNode(data: {name: $name, loginName: $loginName, password: $password}) {
    id
  }
}
    `;
export type CreateHostNodeMutationMutationFn = Apollo.MutationFunction<CreateHostNodeMutationMutation, CreateHostNodeMutationMutationVariables>;

/**
 * __useCreateHostNodeMutationMutation__
 *
 * To run a mutation, you first call `useCreateHostNodeMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateHostNodeMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createHostNodeMutationMutation, { data, loading, error }] = useCreateHostNodeMutationMutation({
 *   variables: {
 *      name: // value for 'name'
 *      loginName: // value for 'loginName'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useCreateHostNodeMutationMutation(baseOptions?: Apollo.MutationHookOptions<CreateHostNodeMutationMutation, CreateHostNodeMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateHostNodeMutationMutation, CreateHostNodeMutationMutationVariables>(CreateHostNodeMutationDocument, options);
      }
export type CreateHostNodeMutationMutationHookResult = ReturnType<typeof useCreateHostNodeMutationMutation>;
export type CreateHostNodeMutationMutationResult = Apollo.MutationResult<CreateHostNodeMutationMutation>;
export type CreateHostNodeMutationMutationOptions = Apollo.BaseMutationOptions<CreateHostNodeMutationMutation, CreateHostNodeMutationMutationVariables>;
export const DeleteNodeRequestMutationDocument = gql`
    mutation DeleteNodeRequestMutation($id: Float!) {
  deleteNodeRequest(id: $id)
}
    `;
export type DeleteNodeRequestMutationMutationFn = Apollo.MutationFunction<DeleteNodeRequestMutationMutation, DeleteNodeRequestMutationMutationVariables>;

/**
 * __useDeleteNodeRequestMutationMutation__
 *
 * To run a mutation, you first call `useDeleteNodeRequestMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNodeRequestMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNodeRequestMutationMutation, { data, loading, error }] = useDeleteNodeRequestMutationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteNodeRequestMutationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNodeRequestMutationMutation, DeleteNodeRequestMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNodeRequestMutationMutation, DeleteNodeRequestMutationMutationVariables>(DeleteNodeRequestMutationDocument, options);
      }
export type DeleteNodeRequestMutationMutationHookResult = ReturnType<typeof useDeleteNodeRequestMutationMutation>;
export type DeleteNodeRequestMutationMutationResult = Apollo.MutationResult<DeleteNodeRequestMutationMutation>;
export type DeleteNodeRequestMutationMutationOptions = Apollo.BaseMutationOptions<DeleteNodeRequestMutationMutation, DeleteNodeRequestMutationMutationVariables>;
export const GetNodesQueryDocument = gql`
    query GetNodesQuery {
  getNodes {
    nodes {
      id
      ip
      name
      loginName
      basePath
      hostNode
    }
    nodeRequests {
      id
      ip
      port
    }
  }
}
    `;

/**
 * __useGetNodesQueryQuery__
 *
 * To run a query within a React component, call `useGetNodesQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNodesQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNodesQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetNodesQueryQuery(baseOptions?: Apollo.QueryHookOptions<GetNodesQueryQuery, GetNodesQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNodesQueryQuery, GetNodesQueryQueryVariables>(GetNodesQueryDocument, options);
      }
export function useGetNodesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNodesQueryQuery, GetNodesQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNodesQueryQuery, GetNodesQueryQueryVariables>(GetNodesQueryDocument, options);
        }
export type GetNodesQueryQueryHookResult = ReturnType<typeof useGetNodesQueryQuery>;
export type GetNodesQueryLazyQueryHookResult = ReturnType<typeof useGetNodesQueryLazyQuery>;
export type GetNodesQueryQueryResult = Apollo.QueryResult<GetNodesQueryQuery, GetNodesQueryQueryVariables>;
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
export const UploadDocument = gql`
    mutation Upload($file: Upload!) {
  UploadProfilePicture(file: $file)
}
    `;
export type UploadMutationFn = Apollo.MutationFunction<UploadMutation, UploadMutationVariables>;

/**
 * __useUploadMutation__
 *
 * To run a mutation, you first call `useUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadMutation, { data, loading, error }] = useUploadMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadMutation(baseOptions?: Apollo.MutationHookOptions<UploadMutation, UploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadMutation, UploadMutationVariables>(UploadDocument, options);
      }
export type UploadMutationHookResult = ReturnType<typeof useUploadMutation>;
export type UploadMutationResult = Apollo.MutationResult<UploadMutation>;
export type UploadMutationOptions = Apollo.BaseMutationOptions<UploadMutation, UploadMutationVariables>;
export const GetUserNameByNameDocument = gql`
    query getUserNameByName($name: String!) {
  getUsersByName(name: $name) {
    userName
    id
  }
}
    `;

/**
 * __useGetUserNameByNameQuery__
 *
 * To run a query within a React component, call `useGetUserNameByNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserNameByNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserNameByNameQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useGetUserNameByNameQuery(baseOptions: Apollo.QueryHookOptions<GetUserNameByNameQuery, GetUserNameByNameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserNameByNameQuery, GetUserNameByNameQueryVariables>(GetUserNameByNameDocument, options);
      }
export function useGetUserNameByNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserNameByNameQuery, GetUserNameByNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserNameByNameQuery, GetUserNameByNameQueryVariables>(GetUserNameByNameDocument, options);
        }
export type GetUserNameByNameQueryHookResult = ReturnType<typeof useGetUserNameByNameQuery>;
export type GetUserNameByNameLazyQueryHookResult = ReturnType<typeof useGetUserNameByNameLazyQuery>;
export type GetUserNameByNameQueryResult = Apollo.QueryResult<GetUserNameByNameQuery, GetUserNameByNameQueryVariables>;
export const GetMyDataStoresDocument = gql`
    query getMyDataStores {
  getMyDataStores {
    id
    name
  }
}
    `;

/**
 * __useGetMyDataStoresQuery__
 *
 * To run a query within a React component, call `useGetMyDataStoresQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyDataStoresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyDataStoresQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyDataStoresQuery(baseOptions?: Apollo.QueryHookOptions<GetMyDataStoresQuery, GetMyDataStoresQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyDataStoresQuery, GetMyDataStoresQueryVariables>(GetMyDataStoresDocument, options);
      }
export function useGetMyDataStoresLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyDataStoresQuery, GetMyDataStoresQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyDataStoresQuery, GetMyDataStoresQueryVariables>(GetMyDataStoresDocument, options);
        }
export type GetMyDataStoresQueryHookResult = ReturnType<typeof useGetMyDataStoresQuery>;
export type GetMyDataStoresLazyQueryHookResult = ReturnType<typeof useGetMyDataStoresLazyQuery>;
export type GetMyDataStoresQueryResult = Apollo.QueryResult<GetMyDataStoresQuery, GetMyDataStoresQueryVariables>;
export const LoginMutationDocument = gql`
    mutation loginMutation($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    id
  }
}
    `;
export type LoginMutationMutationFn = Apollo.MutationFunction<LoginMutationMutation, LoginMutationMutationVariables>;

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
export function useLoginMutationMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutationMutation, LoginMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutationMutation, LoginMutationMutationVariables>(LoginMutationDocument, options);
      }
export type LoginMutationMutationHookResult = ReturnType<typeof useLoginMutationMutation>;
export type LoginMutationMutationResult = Apollo.MutationResult<LoginMutationMutation>;
export type LoginMutationMutationOptions = Apollo.BaseMutationOptions<LoginMutationMutation, LoginMutationMutationVariables>;
export const LogoutMutationDocument = gql`
    mutation logoutMutation {
  logout
}
    `;
export type LogoutMutationMutationFn = Apollo.MutationFunction<LogoutMutationMutation, LogoutMutationMutationVariables>;

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
export function useLogoutMutationMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutationMutation, LogoutMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutationMutation, LogoutMutationMutationVariables>(LogoutMutationDocument, options);
      }
export type LogoutMutationMutationHookResult = ReturnType<typeof useLogoutMutationMutation>;
export type LogoutMutationMutationResult = Apollo.MutationResult<LogoutMutationMutation>;
export type LogoutMutationMutationOptions = Apollo.BaseMutationOptions<LogoutMutationMutation, LogoutMutationMutationVariables>;
export const MeDocument = gql`
    query me {
  me {
    email
    id
    userName
    isAdmin
    defaultDownloadPath
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
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const RegisterMutationDocument = gql`
    mutation registerMutation($email: String!, $password: String!, $userName: String!) {
  register(data: {email: $email, password: $password, userName: $userName}) {
    id
  }
}
    `;
export type RegisterMutationMutationFn = Apollo.MutationFunction<RegisterMutationMutation, RegisterMutationMutationVariables>;

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
export function useRegisterMutationMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutationMutation, RegisterMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutationMutation, RegisterMutationMutationVariables>(RegisterMutationDocument, options);
      }
export type RegisterMutationMutationHookResult = ReturnType<typeof useRegisterMutationMutation>;
export type RegisterMutationMutationResult = Apollo.MutationResult<RegisterMutationMutation>;
export type RegisterMutationMutationOptions = Apollo.BaseMutationOptions<RegisterMutationMutation, RegisterMutationMutationVariables>;
export const SetDefaultDownloadPathDocument = gql`
    mutation SetDefaultDownloadPath($path: String!) {
  setDefaultDownloadPath(path: $path)
}
    `;
export type SetDefaultDownloadPathMutationFn = Apollo.MutationFunction<SetDefaultDownloadPathMutation, SetDefaultDownloadPathMutationVariables>;

/**
 * __useSetDefaultDownloadPathMutation__
 *
 * To run a mutation, you first call `useSetDefaultDownloadPathMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetDefaultDownloadPathMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setDefaultDownloadPathMutation, { data, loading, error }] = useSetDefaultDownloadPathMutation({
 *   variables: {
 *      path: // value for 'path'
 *   },
 * });
 */
export function useSetDefaultDownloadPathMutation(baseOptions?: Apollo.MutationHookOptions<SetDefaultDownloadPathMutation, SetDefaultDownloadPathMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetDefaultDownloadPathMutation, SetDefaultDownloadPathMutationVariables>(SetDefaultDownloadPathDocument, options);
      }
export type SetDefaultDownloadPathMutationHookResult = ReturnType<typeof useSetDefaultDownloadPathMutation>;
export type SetDefaultDownloadPathMutationResult = Apollo.MutationResult<SetDefaultDownloadPathMutation>;
export type SetDefaultDownloadPathMutationOptions = Apollo.BaseMutationOptions<SetDefaultDownloadPathMutation, SetDefaultDownloadPathMutationVariables>;