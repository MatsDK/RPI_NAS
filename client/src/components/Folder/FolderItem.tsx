import { TreeItem } from "generated/apolloComponents";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

interface Props {
  item: TreeItem;
  dataStoreId: number | null;
}

const FolderItem: React.FC<Props> = ({ item, dataStoreId }) => {
  const folderCtx: FolderContextType = useContext(FolderContext);

  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(false);
  }, [item]);

  return (
    <div
      style={{ backgroundColor: selected ? "#ededed" : "#fff" }}
      onClick={() => {
        setSelected((selected) => !selected);
        if (folderCtx?.selected.isSelected(item.path))
          folderCtx?.selected.removeSelected(item.path);
        else folderCtx?.selected.addSelected(item);
      }}
    >
      <div style={{ minWidth: 200 }}>
        {item.isDirectory ? (
          <Link href={`/path/${item.relativePath}?d=${dataStoreId}`}>
            <p style={{ width: "fit-content", cursor: "pointer" }}>
              {item.name}
            </p>
          </Link>
        ) : (
          <p style={{ width: "fit-content" }}>{item.name}</p>
        )}
      </div>
    </div>
  );
};

export default FolderItem;
