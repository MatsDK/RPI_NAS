import { TreeItem } from "generated/apolloComponents";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Icon from "src/ui/Icon";
import { useRouter } from "next/router";

interface Props {
  item: TreeItem & { idx?: number };
  dataStoreId: number | null;
  idx: number
  items: TreeItem[]
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

const Name = styled.div`
  p {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: -moz-none;
    -o-user-select: none;
    user-select: none;;
  }
`

const FolderItem: React.FC<Props> = ({ item, dataStoreId, idx, items }) => {
  const folderCtx: FolderContextType = useContext(FolderContext);

  const router = useRouter();

  const [selected, setSelected] = useState(false);

  item.idx = idx

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
      onClick={({ ctrlKey, shiftKey }) => {
        if (ctrlKey) {
          if (folderCtx?.selected.selectedItems.has(item.path))
            folderCtx?.selected.selectedItems.delete(item.path)
          else
            folderCtx?.selected.selectedItems.set(item.path, item)

          folderCtx && folderCtx.selected.setSelected?.(new Map(folderCtx.selected.selectedItems))
        } else if (shiftKey) {
          if (folderCtx?.selected.selectedItems.size == 0) {
            folderCtx?.selected.selectedItems.set(item.path, item)
            folderCtx.selected.setSelected?.(new Map(folderCtx.selected.selectedItems))
          } else {
            const lastItem = (Array.from(folderCtx?.selected.selectedItems || new Map()).pop())
            if (!lastItem) return

            if (lastItem[1].idx == idx) {
              folderCtx?.selected.selectedItems.delete(item.path)
              folderCtx?.selected.setSelected?.(new Map(folderCtx.selected.selectedItems))
            }

            for (let i = Math.min(lastItem[1].idx, idx) + 1; i < Math.max(lastItem[1].idx, idx); i++) {
              folderCtx?.selected.setSelected?.(new Map(folderCtx.selected.selectedItems.set(items[i].path, items[i])))
            }
            folderCtx?.selected.setSelected?.(new Map(folderCtx.selected.selectedItems.set(item.path, item)))
          }
        } else {
          if (folderCtx?.selected.selectedItems.has(item.path))
            folderCtx.selected.setSelected?.(new Map());
          else folderCtx?.selected.setSelected?.(new Map([[item.path, item]]));
        }
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
      <Name>
        {item.isDirectory ? (
          <div onClick={(e) => e.stopPropagation()}>
            <Link href={`/path/${item.relativePath}?d=${dataStoreId}`}>
              <FolderButtonItem >{item.name}</FolderButtonItem>
            </Link>
          </div>
        ) : (
          <p>{item.name}</p>
        )}
      </Name>
    </FolderItemWrapper>
  );
};

export default FolderItem;
