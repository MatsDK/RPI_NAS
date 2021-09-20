import { TreeItem } from "generated/apolloComponents";
import React from "react";

export type FolderContextType = FolderContext | null;

export type CurrentFolderType = {
  path: string | null;
  dataStoreId: number | null;
};

interface FolderContext {
  currentFolderPath?: {
    folderPath: CurrentFolderType;
    setFolderPath: React.Dispatch<React.SetStateAction<CurrentFolderType>>;
  };
  newFolderInput?: {
    showNewFolderInput: boolean;
    setShowNewFolderInput: React.Dispatch<React.SetStateAction<boolean>>;
  };
  selected: {
    selectedItems: Map<string, TreeItem>;
    addSelected: (path: TreeItem) => void;
    removeSelected: (path: string) => void;
    isSelected: (path: string) => boolean;
  };
}

export let FolderContextValue: FolderContext = {
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
