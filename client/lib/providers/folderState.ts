import { TreeItem } from "generated/apolloComponents";
import React from "react";

export type FolderContextType = FolderContext | null;

interface FolderContext {
  currentFolderPath?: string;
  selected: {
    selectedItems: Map<string, TreeItem>;
    addSelected: (path: TreeItem) => void;
    removeSelected: (path: string) => void;
    isSelected: (path: string) => boolean;
  };
}

export const FolderContextValue: FolderContext = {
  selected: {
    selectedItems: new Map(),
    addSelected: (item) =>
      FolderContextValue.selected.selectedItems.set(item.path, item),
    removeSelected: (path) =>
      FolderContextValue.selected.selectedItems.delete(path),
    isSelected: (path) => FolderContextValue.selected.selectedItems.has(path),
  },
};
export const FolderContext = React.createContext<FolderContextType>(null);
