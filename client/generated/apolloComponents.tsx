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
  name: Scalars['String'];
  loginName: Scalars['String'];
  password: Scalars['String'];
};

export type AllowedSmbUser = {
  userId: Scalars['Float'];
  allowed: Scalars['Boolean'];
};

export type CopyMoveDataObject = {
  type: Scalars['String'];
  path: Scalars['String'];
};

export type CopyMoveDestinationObject = {
  datastoreId: Scalars['Float'];
  path: Scalars['String'];
};

export type CopyMoveInput = {
  datastoreId: Scalars['Float'];
  destination: CopyMoveDestinationObject;
  data: Array<CopyMoveDataObject>;
};

export type CreateDataStoreInput = {
  localNodeId: Scalars['Float'];
  name: Scalars['String'];
  sizeInMB: Scalars['Float'];
  ownerId: Scalars['Float'];
  ownerPassword?: Maybe<Scalars['String']>;
};

export type CreateNodeInput = {
  name: Scalars['String'];
  loginName: Scalars['String'];
  password: Scalars['String'];
};

export type CreateSharedDataStoreInput = {
  ids: Array<SharedDataStoresIdsInput>;
};

export type Datastore = {
  __typename?: 'Datastore';
  id: Scalars['ID'];
  name: Scalars['String'];
  userId: Scalars['Float'];
  localHostNodeId: Scalars['Float'];
  localNodeId: Scalars['Float'];
  basePath: Scalars['String'];
  sizeInMB?: Maybe<Scalars['Float']>;
  size?: Maybe<SizeObject>;
  status: Scalars['String'];
  allowedSMBUsers: Array<Scalars['Float']>;
  sharedUsers: Array<User>;
  owner?: Maybe<User>;
  userInitialized?: Maybe<Scalars['Boolean']>;
};

export type DatastoreService = {
  __typename?: 'DatastoreService';
  serviceName: Scalars['String'];
  userId: Scalars['Float'];
  datastoreId: Scalars['Float'];
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
  nodes: Array<Node>;
  nodeRequests: Array<NodeRequest>;
};

export type GetTreeInput = {
  path: Scalars['String'];
  datastoreId?: Maybe<Scalars['Float']>;
  depth?: Maybe<Scalars['Float']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createDataStore?: Maybe<Datastore>;
  createSharedDataStore?: Maybe<Scalars['Boolean']>;
  toggleDatastoreService?: Maybe<Scalars['Boolean']>;
  updateDatastore?: Maybe<Scalars['Boolean']>;
  createFolder?: Maybe<Scalars['String']>;
  delete?: Maybe<Scalars['Boolean']>;
  copy?: Maybe<Scalars['Boolean']>;
  move?: Maybe<Scalars['Boolean']>;
  updateOwnership?: Maybe<Scalars['Boolean']>;
  createNode?: Maybe<Node>;
  createNodeRequest: Scalars['Boolean'];
  deleteNodeRequest: Scalars['Boolean'];
  acceptNodeRequest?: Maybe<Node>;
  createConnection?: Maybe<Scalars['Boolean']>;
  initUser?: Maybe<Scalars['Boolean']>;
  createUploadSession?: Maybe<UploadSessionReturn>;
  createDownloadSession?: Maybe<DownloadSessionReturn>;
  login?: Maybe<User>;
  logout?: Maybe<Scalars['Boolean']>;
  register?: Maybe<User>;
  setDefaultDownloadPath?: Maybe<Scalars['Boolean']>;
  sendFriendRequest?: Maybe<Scalars['Boolean']>;
  acceptFriendRequest?: Maybe<Scalars['Boolean']>;
  UploadProfilePicture?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateDataStoreArgs = {
  data: CreateDataStoreInput;
};


export type MutationCreateSharedDataStoreArgs = {
  data: CreateSharedDataStoreInput;
};


export type MutationToggleDatastoreServiceArgs = {
  serviceName: Scalars['String'];
  dataStoreId: Scalars['Float'];
};


export type MutationUpdateDatastoreArgs = {
  updateProps: UpdateDatastoreInput;
  dataStoreId: Scalars['Float'];
};


export type MutationCreateFolderArgs = {
  path: Scalars['String'];
  datastoreId: Scalars['Float'];
};


export type MutationDeleteArgs = {
  paths: Array<DeletePathsInput>;
  datastoreId: Scalars['Float'];
};


export type MutationCopyArgs = {
  data: CopyMoveInput;
};


export type MutationMoveArgs = {
  data: CopyMoveInput;
};


export type MutationUpdateOwnershipArgs = {
  datastoreId: Scalars['Float'];
};


export type MutationCreateNodeArgs = {
  data: CreateNodeInput;
};


export type MutationCreateNodeRequestArgs = {
  port: Scalars['Float'];
  ip: Scalars['String'];
};


export type MutationDeleteNodeRequestArgs = {
  id: Scalars['Float'];
};


export type MutationAcceptNodeRequestArgs = {
  data: AcceptNodeRequestInput;
};


export type MutationCreateConnectionArgs = {
  uri: Scalars['String'];
};


export type MutationInitUserArgs = {
  password: Scalars['String'];
  datastoreId: Scalars['Float'];
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


export type MutationSetDefaultDownloadPathArgs = {
  path: Scalars['String'];
};


export type MutationSendFriendRequestArgs = {
  userId: Scalars['Float'];
};


export type MutationAcceptFriendRequestArgs = {
  userId: Scalars['Float'];
};


export type MutationUploadProfilePictureArgs = {
  file: Scalars['Upload'];
};

export type Node = {
  __typename?: 'Node';
  id: Scalars['ID'];
  name: Scalars['String'];
  ip: Scalars['String'];
  loginName: Scalars['String'];
  password: Scalars['String'];
  port: Scalars['Float'];
  sshPort: Scalars['Float'];
  basePath: Scalars['String'];
  hostNode: Scalars['Boolean'];
  token?: Maybe<Scalars['String']>;
  initializedUsers: Array<Scalars['Float']>;
  pingResult: Scalars['Boolean'];
};

export type NodeRequest = {
  __typename?: 'NodeRequest';
  id: Scalars['Float'];
  ip: Scalars['String'];
  port: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  getDataStores?: Maybe<Array<Datastore>>;
  getDatastore?: Maybe<Datastore>;
  getNodes?: Maybe<GetNodesReturn>;
  ping: Scalars['Boolean'];
  tree?: Maybe<Tree>;
  directoryTree?: Maybe<Tree>;
  me?: Maybe<User>;
  friends?: Maybe<FriendsQueryReturn>;
  getFriends?: Maybe<Array<User>>;
  getMyDataStores?: Maybe<Array<Datastore>>;
  getUsersByName?: Maybe<Array<User>>;
};


export type QueryGetDatastoreArgs = {
  datastoreId: Scalars['Float'];
};


export type QueryTreeArgs = {
  data: GetTreeInput;
};


export type QueryDirectoryTreeArgs = {
  data: GetTreeInput;
};


export type QueryGetUsersByNameArgs = {
  name: Scalars['String'];
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  userName: Scalars['String'];
};

export type SharedDataStore = {
  __typename?: 'SharedDataStore';
  id: Scalars['ID'];
  userId: Scalars['Float'];
  dataStoreId: Scalars['Float'];
  initialized: Scalars['Boolean'];
};

export type SharedDataStoresIdsInput = {
  userId: Scalars['Float'];
  dataStoreId: Scalars['Float'];
};

export type SizeObject = {
  __typename?: 'SizeObject';
  usedSize: Scalars['Float'];
  usedPercent: Scalars['Float'];
};

export type Tree = {
  __typename?: 'Tree';
  path: Scalars['String'];
  tree?: Maybe<Array<TreeItem>>;
  userInitialized: Scalars['Boolean'];
};

export type TreeItem = {
  __typename?: 'TreeItem';
  name: Scalars['String'];
  path: Scalars['String'];
  relativePath: Scalars['String'];
  isDirectory: Scalars['Boolean'];
  dataStoreId?: Maybe<Scalars['Float']>;
  sharedDataStore?: Maybe<Scalars['Boolean']>;
  size?: Maybe<Scalars['Float']>;
  tree?: Maybe<Array<TreeItem>>;
};

export type UpdateDatastoreInput = {
  name?: Maybe<Scalars['String']>;
  ownerSMBEnabled?: Maybe<Scalars['Boolean']>;
  sharedUsers?: Maybe<Array<Scalars['Float']>>;
  allowedSMBUsers?: Maybe<Array<AllowedSmbUser>>;
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
  osUserName: Scalars['String'];
  isAdmin: Scalars['Boolean'];
  defaultDownloadPath?: Maybe<Scalars['String']>;
  smbEnabled?: Maybe<Scalars['Boolean']>;
  friends: Array<User>;
};

export type CreateDataStoreMutionMutationVariables = Exact<{
  localNodeId: Scalars['Float'];
  name: Scalars['String'];
  sizeInMb: Scalars['Float'];
  ownerId: Scalars['Float'];
  ownerPassword?: Maybe<Scalars['String']>;
}>;


export type CreateDataStoreMutionMutation = { __typename?: 'Mutation', createDataStore?: Maybe<{ __typename?: 'Datastore', id: string }> };

export type InitializeUserMutationVariables = Exact<{
  datastoreId: Scalars['Float'];
  password: Scalars['String'];
}>;


export type InitializeUserMutation = { __typename?: 'Mutation', initUser?: Maybe<boolean> };

export type CreateSharedDataStoresMutaionMutationVariables = Exact<{
  ids: Array<SharedDataStoresIdsInput> | SharedDataStoresIdsInput;
}>;


export type CreateSharedDataStoresMutaionMutation = { __typename?: 'Mutation', createSharedDataStore?: Maybe<boolean> };

export type GetDataStoresQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDataStoresQuery = { __typename?: 'Query', getDataStores?: Maybe<Array<{ __typename?: 'Datastore', id: string, name: string, userId: number, localHostNodeId: number, localNodeId: number, basePath: string, sizeInMB?: Maybe<number>, userInitialized?: Maybe<boolean>, status: string, size?: Maybe<{ __typename?: 'SizeObject', usedSize: number, usedPercent: number }>, owner?: Maybe<{ __typename?: 'User', id: string, userName: string, isAdmin: boolean }>, sharedUsers: Array<{ __typename?: 'User', userName: string, isAdmin: boolean, id: string }> }>> };

export type GetDatastoreQueryVariables = Exact<{
  datastoreId: Scalars['Float'];
}>;


export type GetDatastoreQuery = { __typename?: 'Query', getDatastore?: Maybe<{ __typename?: 'Datastore', id: string, name: string, userId: number, localHostNodeId: number, localNodeId: number, basePath: string, sizeInMB?: Maybe<number>, allowedSMBUsers: Array<number>, userInitialized?: Maybe<boolean>, status: string, size?: Maybe<{ __typename?: 'SizeObject', usedSize: number, usedPercent: number }>, owner?: Maybe<{ __typename?: 'User', id: string, userName: string, smbEnabled?: Maybe<boolean>, isAdmin: boolean }>, sharedUsers: Array<{ __typename?: 'User', id: string, userName: string, smbEnabled?: Maybe<boolean>, isAdmin: boolean }> }> };

export type ToggleDatastoreServiceMutationMutationVariables = Exact<{
  serviceName: Scalars['String'];
  datastoreId: Scalars['Float'];
}>;


export type ToggleDatastoreServiceMutationMutation = { __typename?: 'Mutation', toggleDatastoreService?: Maybe<boolean> };

export type UpdateDatastoreMutationMutationVariables = Exact<{
  datastoreId: Scalars['Float'];
  sharedUsers?: Maybe<Array<Scalars['Float']> | Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  ownerSMBEnabled?: Maybe<Scalars['Boolean']>;
  allowedSMBUsers?: Maybe<Array<AllowedSmbUser> | AllowedSmbUser>;
}>;


export type UpdateDatastoreMutationMutation = { __typename?: 'Mutation', updateDatastore?: Maybe<boolean> };

export type CopyDataMutationMutationVariables = Exact<{
  datastoreId: Scalars['Float'];
  destination: CopyMoveDestinationObject;
  data: Array<CopyMoveDataObject> | CopyMoveDataObject;
}>;


export type CopyDataMutationMutation = { __typename?: 'Mutation', copy?: Maybe<boolean> };

export type CreateFolderMutationMutationVariables = Exact<{
  path: Scalars['String'];
  datastoreId: Scalars['Float'];
}>;


export type CreateFolderMutationMutation = { __typename?: 'Mutation', createFolder?: Maybe<string> };

export type DeleteDataMutationMutationVariables = Exact<{
  paths: Array<DeletePathsInput> | DeletePathsInput;
  datastoreId: Scalars['Float'];
}>;


export type DeleteDataMutationMutation = { __typename?: 'Mutation', delete?: Maybe<boolean> };

export type MoveDataMutationMutationVariables = Exact<{
  datastoreId: Scalars['Float'];
  destination: CopyMoveDestinationObject;
  data: Array<CopyMoveDataObject> | CopyMoveDataObject;
}>;


export type MoveDataMutationMutation = { __typename?: 'Mutation', move?: Maybe<boolean> };

export type UpdateOwnershipMutationVariables = Exact<{
  datastoreId: Scalars['Float'];
}>;


export type UpdateOwnershipMutation = { __typename?: 'Mutation', updateOwnership?: Maybe<boolean> };

export type AcceptFriendRequestMutationVariables = Exact<{
  userId: Scalars['Float'];
}>;


export type AcceptFriendRequestMutation = { __typename?: 'Mutation', acceptFriendRequest?: Maybe<boolean> };

export type GetFriendsAndFriendRequestsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFriendsAndFriendRequestsQueryQuery = { __typename?: 'Query', friends?: Maybe<{ __typename?: 'FriendsQueryReturn', friends: Array<{ __typename?: 'User', id: string, userName: string }>, friendsRequest: Array<{ __typename?: 'User', id: string, userName: string }> }> };

export type GetFriendsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFriendsQueryQuery = { __typename?: 'Query', getFriends?: Maybe<Array<{ __typename?: 'User', id: string, userName: string }>> };

export type SendFriendRequestMutationVariables = Exact<{
  userId: Scalars['Float'];
}>;


export type SendFriendRequestMutation = { __typename?: 'Mutation', sendFriendRequest?: Maybe<boolean> };

export type AcceptNodeRequestMutationVariables = Exact<{
  id: Scalars['Float'];
  name: Scalars['String'];
  loginName: Scalars['String'];
  password: Scalars['String'];
}>;


export type AcceptNodeRequestMutation = { __typename?: 'Mutation', acceptNodeRequest?: Maybe<{ __typename?: 'Node', id: string }> };

export type CreateHostNodeMutationMutationVariables = Exact<{
  name: Scalars['String'];
  loginName: Scalars['String'];
  password: Scalars['String'];
}>;


export type CreateHostNodeMutationMutation = { __typename?: 'Mutation', createNode?: Maybe<{ __typename?: 'Node', id: string }> };

export type DeleteNodeRequestMutationMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteNodeRequestMutationMutation = { __typename?: 'Mutation', deleteNodeRequest: boolean };

export type GetNodesQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNodesQueryQuery = { __typename?: 'Query', getNodes?: Maybe<{ __typename?: 'GetNodesReturn', nodes: Array<{ __typename?: 'Node', id: string, ip: string, port: number, name: string, loginName: string, basePath: string, hostNode: boolean, pingResult: boolean, token?: Maybe<string>, initializedUsers: Array<number> }>, nodeRequests: Array<{ __typename?: 'NodeRequest', id: number, ip: string, port: number }> }> };

export type CreateSessionMutationVariables = Exact<{
  data: Array<DownloadPathsInput> | DownloadPathsInput;
  type: Scalars['String'];
  dataStoreId: Scalars['Float'];
}>;


export type CreateSessionMutation = { __typename?: 'Mutation', createDownloadSession?: Maybe<{ __typename?: 'DownloadSessionReturn', hostIp?: Maybe<string>, username?: Maybe<string>, password?: Maybe<string>, port?: Maybe<number>, id?: Maybe<string>, data?: Maybe<Array<{ __typename?: 'DownloadSessionObject', type: string, path: string }>> }> };

export type CreateUploadSessionMutationMutationVariables = Exact<{
  uploadPath: Scalars['String'];
  dataStoreId: Scalars['Float'];
}>;


export type CreateUploadSessionMutationMutation = { __typename?: 'Mutation', createUploadSession?: Maybe<{ __typename?: 'UploadSessionReturn', uploadPath: string, hostIp: string, username: string, port: number, password: string }> };

export type GetDirectoryTreeQueryQueryVariables = Exact<{
  path: Scalars['String'];
  depth: Scalars['Float'];
  datastoreId?: Maybe<Scalars['Float']>;
}>;


export type GetDirectoryTreeQueryQuery = { __typename?: 'Query', directoryTree?: Maybe<{ __typename: 'Tree', path: string, tree?: Maybe<Array<{ __typename: 'TreeItem', isDirectory: boolean, dataStoreId?: Maybe<number>, sharedDataStore?: Maybe<boolean>, name: string, relativePath: string, path: string }>> }> };

export type GetTreeQueryQueryVariables = Exact<{
  path: Scalars['String'];
  depth: Scalars['Float'];
  datastoreId?: Maybe<Scalars['Float']>;
}>;


export type GetTreeQueryQuery = { __typename?: 'Query', tree?: Maybe<{ __typename?: 'Tree', path: string, userInitialized: boolean, tree?: Maybe<Array<{ __typename?: 'TreeItem', relativePath: string, isDirectory: boolean, name: string, path: string, size?: Maybe<number> }>> }> };

export type UploadMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadMutation = { __typename?: 'Mutation', UploadProfilePicture?: Maybe<boolean> };

export type GetUserNameByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetUserNameByNameQuery = { __typename?: 'Query', getUsersByName?: Maybe<Array<{ __typename?: 'User', userName: string, id: string }>> };

export type GetMyDataStoresQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyDataStoresQuery = { __typename?: 'Query', getMyDataStores?: Maybe<Array<{ __typename?: 'Datastore', id: string, name: string }>> };

export type LoginMutationMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutationMutation = { __typename?: 'Mutation', login?: Maybe<{ __typename?: 'User', id: string }> };

export type LogoutMutationMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutationMutation = { __typename?: 'Mutation', logout?: Maybe<boolean> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: Maybe<{ __typename?: 'User', email: string, id: string, userName: string, isAdmin: boolean, defaultDownloadPath?: Maybe<string> }> };

export type RegisterMutationMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  userName: Scalars['String'];
}>;


export type RegisterMutationMutation = { __typename?: 'Mutation', register?: Maybe<{ __typename?: 'User', id: string }> };

export type SetDefaultDownloadPathMutationVariables = Exact<{
  path: Scalars['String'];
}>;


export type SetDefaultDownloadPathMutation = { __typename?: 'Mutation', setDefaultDownloadPath?: Maybe<boolean> };


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
export const InitializeUserDocument = gql`
    mutation InitializeUser($datastoreId: Float!, $password: String!) {
  initUser(password: $password, datastoreId: $datastoreId)
}
    `;
export type InitializeUserMutationFn = Apollo.MutationFunction<InitializeUserMutation, InitializeUserMutationVariables>;

/**
 * __useInitializeUserMutation__
 *
 * To run a mutation, you first call `useInitializeUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInitializeUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [initializeUserMutation, { data, loading, error }] = useInitializeUserMutation({
 *   variables: {
 *      datastoreId: // value for 'datastoreId'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useInitializeUserMutation(baseOptions?: Apollo.MutationHookOptions<InitializeUserMutation, InitializeUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InitializeUserMutation, InitializeUserMutationVariables>(InitializeUserDocument, options);
      }
export type InitializeUserMutationHookResult = ReturnType<typeof useInitializeUserMutation>;
export type InitializeUserMutationResult = Apollo.MutationResult<InitializeUserMutation>;
export type InitializeUserMutationOptions = Apollo.BaseMutationOptions<InitializeUserMutation, InitializeUserMutationVariables>;
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
    userInitialized
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
    userInitialized
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
    mutation CopyDataMutation($datastoreId: Float!, $destination: CopyMoveDestinationObject!, $data: [CopyMoveDataObject!]!) {
  copy(data: {datastoreId: $datastoreId, destination: $destination, data: $data})
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
 *      datastoreId: // value for 'datastoreId'
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
    mutation CreateFolderMutation($path: String!, $datastoreId: Float!) {
  createFolder(path: $path, datastoreId: $datastoreId)
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
 *      datastoreId: // value for 'datastoreId'
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
    mutation DeleteDataMutation($paths: [DeletePathsInput!]!, $datastoreId: Float!) {
  delete(paths: $paths, datastoreId: $datastoreId)
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
 *      datastoreId: // value for 'datastoreId'
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
    mutation MoveDataMutation($datastoreId: Float!, $destination: CopyMoveDestinationObject!, $data: [CopyMoveDataObject!]!) {
  move(data: {datastoreId: $datastoreId, destination: $destination, data: $data})
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
 *      datastoreId: // value for 'datastoreId'
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
export const UpdateOwnershipDocument = gql`
    mutation UpdateOwnership($datastoreId: Float!) {
  updateOwnership(datastoreId: $datastoreId)
}
    `;
export type UpdateOwnershipMutationFn = Apollo.MutationFunction<UpdateOwnershipMutation, UpdateOwnershipMutationVariables>;

/**
 * __useUpdateOwnershipMutation__
 *
 * To run a mutation, you first call `useUpdateOwnershipMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOwnershipMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOwnershipMutation, { data, loading, error }] = useUpdateOwnershipMutation({
 *   variables: {
 *      datastoreId: // value for 'datastoreId'
 *   },
 * });
 */
export function useUpdateOwnershipMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOwnershipMutation, UpdateOwnershipMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOwnershipMutation, UpdateOwnershipMutationVariables>(UpdateOwnershipDocument, options);
      }
export type UpdateOwnershipMutationHookResult = ReturnType<typeof useUpdateOwnershipMutation>;
export type UpdateOwnershipMutationResult = Apollo.MutationResult<UpdateOwnershipMutation>;
export type UpdateOwnershipMutationOptions = Apollo.BaseMutationOptions<UpdateOwnershipMutation, UpdateOwnershipMutationVariables>;
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
      port
      name
      loginName
      basePath
      hostNode
      pingResult
      token
      initializedUsers
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
    query getDirectoryTreeQuery($path: String!, $depth: Float!, $datastoreId: Float) {
  directoryTree(data: {path: $path, depth: $depth, datastoreId: $datastoreId}) {
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
 *      datastoreId: // value for 'datastoreId'
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
    query getTreeQuery($path: String!, $depth: Float!, $datastoreId: Float) {
  tree(data: {path: $path, datastoreId: $datastoreId, depth: $depth}) {
    path
    userInitialized
    tree {
      relativePath
      isDirectory
      name
      path
      size
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
 *      datastoreId: // value for 'datastoreId'
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