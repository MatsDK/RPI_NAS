import React, { FormEvent, useEffect, useState } from "react";
import { ConditionButton, LightBgButton } from "src/ui/Button";
import { Select } from "src/ui/Select";
import { LabelInput } from "src/ui/Input";
import MenuOverlay from "../MenuOverlay";
import { Mutation, useApolloClient } from "react-apollo";
import { useInput } from "src/hooks/useInput";
import { CreateDataStoreMutation } from "graphql/DataStores/createDataStore";
import styled from "styled-components";
import {
  useGetFriendsQueryQuery,
  useGetNodesQuery,
} from "generated/apolloComponents";
import { getDataStoresQuery } from "graphql/DataStores/getDataStores";
import { useMeState } from "src/hooks/useMeState";

interface Props {
  hide: () => any;
}

const CreateDataStoreWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 25px;
`;

const Title = styled.h2`
  font-weight: bold;
  font-size: 36px;
  color: ${(props) => props.theme.textColors[3]};
  border-bottom: 1px solid ${(props) => props.theme.bgColors[1]};
  padding-bottom: 10px;
  margin-bottom: 5px;
`;

const FormItem = styled.div`
  padding: 10px 5px;
  align-items: baseline;

  > div {
    display: flex;
    align-items: baseline;

    > p {
      margin-left: 5px;
      color: ${(props) => props.theme.textColors[2]};
    }
  }
`;

const NewDataStoreWrapper: React.FC<Props> = ({ hide }) => {
  const { me } = useMeState();

  const [nameInput, setNameInput] = useInput("");
  const [sizeInput, setSizeInput] = useInput("");
  const [sizeInMb, setSizeInMB] = useState<null | number>(null);
  const [selectedOwner, setSelectedOwner] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const client: any = useApolloClient();

  const { data: friends, error: friendsError } = useGetFriendsQueryQuery({
    client,
  });

  const { data: nodes, error: NodesError } = useGetNodesQuery({
    client,
  });

  if (friendsError || NodesError) console.log(friendsError, NodesError);

  useEffect(() => {
    const lastChar = sizeInput
      .toLowerCase()
      .trim()
      .charAt(sizeInput.trim().length - 1);

    let m = 1;
    if (lastChar == "g") m = 1024;
    else if (lastChar != "m") return setSizeInMB(null);

    const lastIdx = sizeInput.toLowerCase().indexOf(lastChar);
    const num = Number(sizeInput.slice(0, lastIdx));

    if (num)
      num * m >= 1 && num * m <= 204800
        ? setSizeInMB(num * m)
        : setSizeInMB(null);
    else setSizeInMB(null);
  }, [sizeInput]);

  return (
    <MenuOverlay hide={hide} maxWidth="20vw">
      <Mutation mutation={CreateDataStoreMutation}>
        {(mutate) => {
          const submit = async (e: FormEvent) => {
            e.preventDefault();

            if (!nameInput.trim().length || !selectedNode) return;

            const res = await mutate({
              variables: {
                name: nameInput,
                ownerId: Number(selectedOwner.id),
                sizeInMb,
                localNodeId: Number(selectedNode.id),
              },
              refetchQueries: [{ query: getDataStoresQuery }],
            });

            console.log(res);
          };

          return (
            <CreateDataStoreWrapper>
              <Title>Create Datastore</Title>
              <form onSubmit={submit}>
                <FormItem>
                  <LabelInput
                    label={"name"}
                    value={nameInput}
                    setValue={setNameInput}
                  />
                </FormItem>
                <FormItem>
                  <div>
                    <Select
                      data={[me, ...(friends?.friends?.friends || [])]}
                      label="Owner"
                      setValue={setSelectedOwner}
                      propName={"userName"}
                      minWidth={160}
                    />
                    <div style={{ marginLeft: 15 }}>
                      <Select
                        data={nodes?.getNodes || []}
                        label="CloudNode"
                        setValue={setSelectedNode}
                        propName={"name"}
                        minWidth={160}
                      />
                    </div>
                  </div>
                </FormItem>
                <FormItem>
                  <div>
                    <LabelInput
                      value={sizeInput}
                      label={"Size"}
                      setValue={setSizeInput}
                    />
                    <p>(e.g. 100M, 10G)</p>
                  </div>
                  {sizeInMb != null ? `valid ${sizeInMb}Mb` : "invalid"}
                </FormItem>

                <FormItem></FormItem>
                <ConditionButton
                  condition={
                    sizeInMb != null &&
                    nameInput.trim().length &&
                    selectedOwner &&
                    selectedNode
                  }
                >
                  <LightBgButton type="submit">Create</LightBgButton>
                </ConditionButton>
              </form>
            </CreateDataStoreWrapper>
          );
        }}
      </Mutation>
    </MenuOverlay>
  );
};

export default NewDataStoreWrapper;
