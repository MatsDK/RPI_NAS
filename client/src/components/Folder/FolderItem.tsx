import { TreeItem } from "generated/apolloComponents";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Icon from "src/ui/Icon";
import { useRouter } from "next/router";

interface Props {
  item: TreeItem;
  dataStoreId: number | null;
}

export const FolderItemWrapper = styled.div`
  margin: 0 5px;
  display: flex;
  padding: 2px 3px;
  align-items: center;

  :hover input[type="checkbox"] {
    opacity: 1;
  }
`;

export const IconWrapper = styled.div`
  width: 28px;
  margin-right: 10px;

  svg {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
`;

const SelectButtonWrapper = styled.div`
  padding-right: 15px;
  padding-left: 10px;

  input:not(:checked) {
    opacity: 0;
  }
`;

const FolderButtonItem = styled.p`
  cursor: pointer;
  width: fit-content;

  :hover {
    text-decoration: underline;
  }
`;

const FolderItem: React.FC<Props> = ({ item, dataStoreId }) => {
  const folderCtx: FolderContextType = useContext(FolderContext);

  const router = useRouter();

  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(!!folderCtx?.selected.selectedItems.has(item.path));
  }, [item, folderCtx]);

  return (
    <FolderItemWrapper
      style={{ backgroundColor: selected ? "#ededed" : "#fff" }}
      onDoubleClick={() =>
        item.isDirectory &&
        router.push(`/path/${item.relativePath}?d=${dataStoreId}`)
      }
      onClick={() => {
        setSelected((s) => !s);

        if (folderCtx?.selected.selectedItems.has(item.path))
          folderCtx.selected.setSelected?.(new Map());
        else folderCtx?.selected.setSelected?.(new Map([[item.path, item]]));
      }}
    >
      <SelectButtonWrapper
        onClick={(e) => {
          e.stopPropagation();

          if (!folderCtx?.selected.selectedItems.has(item.path))
            folderCtx?.selected.setSelected?.(
              (m) => new Map(m.set(item.path, item))
            );
          else
            folderCtx?.selected.setSelected?.((m) => {
              m.delete(item.path);
              return new Map(m);
            });

          setSelected((s) => !s);
        }}
      >
        <input
          type="checkbox"
          checked={selected || false}
          onChange={() => { }}
        />
      </SelectButtonWrapper>
      <IconWrapper>
        {item.isDirectory ? (
          <Icon
            color={{ idx: 2, propName: "bgColors" }}
            width={24}
            height={22}
            viewPort={30}
            name="folderIcon"
          />
        ) : (
          <div style={{ marginLeft: 2 }}>
            <Icon
              name={"fileIcon"}
              color={{ idx: 2, propName: "bgColors" }}
              height={26}
              width={26}
              viewPort={26}
            />
          </div>
        )}
      </IconWrapper>
      <div>
        {item.isDirectory ? (
          <div onClick={(e) => e.stopPropagation()}>
            <Link href={`/path/${item.relativePath}?d=${dataStoreId}`}>
              <FolderButtonItem>{item.name}</FolderButtonItem>
            </Link>
          </div>
        ) : (
          <p>{item.name}</p>
        )}
      </div>
    </FolderItemWrapper>
  );
};

export default FolderItem;
