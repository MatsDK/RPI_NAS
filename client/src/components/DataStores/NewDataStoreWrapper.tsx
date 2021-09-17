import React, { FormEvent } from "react";
import MenuOverlay from "../MenuOverlay";
import { Mutation } from "react-apollo";
import { CreateDataStoreMutation } from "graphql/DataStores/CreateDataStore";
import { useInput } from "src/hooks/useInput";

interface Props {
  hide: () => any;
}

const NewDataStoreWrapper: React.FC<Props> = ({ hide }) => {
  const [nameInput, setNameInput] = useInput("");
  const [nodeIdInput, setNodeIdInput] = useInput("");

  return (
    <MenuOverlay hide={hide}>
      <Mutation mutation={CreateDataStoreMutation}>
        {(mutate) => {
          const submit = async (e: FormEvent) => {
            e.preventDefault();

            if (!nameInput.trim().length || !nodeIdInput.trim().length) return;

            const res = await mutate({
              variables: { name: nameInput, localNodeId: Number(nodeIdInput) },
            });
            console.log(res);
          };

          return (
            <form onSubmit={submit}>
              <input
                type="text"
                placeholder={"name"}
                value={nameInput}
                onChange={setNameInput}
              />
              <input
                type="number"
                placeholder={"nodeId"}
                value={nodeIdInput}
                onChange={setNodeIdInput}
              />
              <button type="submit">create</button>
            </form>
          );
        }}
      </Mutation>
    </MenuOverlay>
  );
};

export default NewDataStoreWrapper;
