import { TreeItem } from "generated/apolloComponents";
import React from "react";

interface SelectedContext {
  selected: Map<string, TreeItem>;
  addSelected: (path: TreeItem) => void;
  removeSelected: (path: string) => void;
  isSelected: (path: string) => boolean;
}

export const Selected: SelectedContext = {
  selected: new Map(),
  addSelected: (item) => Selected.selected.set(item.path, item),
  removeSelected: (path) => Selected.selected.delete(path),
  isSelected: (path) => Selected.selected.has(path),
};
export const SelectedContext = React.createContext<SelectedContext | null>(
  null
);
