import { TreeItem } from "generated/apolloComponents";
import { SelectedContext } from "lib/providers/selected";
import Link from "next/link";
import React, { useContext, useState } from "react";

interface Props {
  item: TreeItem;
}

const FolderItem: React.FC<Props> = ({ item }) => {
  const selectedCtx = useContext(SelectedContext);

  const [selected, setSelected] = useState(false);

  return (
    <div
      style={{ backgroundColor: selected ? "#ededed" : "#fff" }}
      onClick={() => {
        setSelected((selected) => !selected);
        if (selectedCtx?.isSelected(item.path))
          selectedCtx?.removeSelected(item.path);
        else selectedCtx?.addSelected(item);
      }}
    >
      <div style={{ minWidth: 200 }}>
        {item.isDirectory ? (
          <Link href={`/path/${item.relativePath}`}>
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
