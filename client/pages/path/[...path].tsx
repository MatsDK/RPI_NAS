import { useRouter } from "next/dist/client/router";
import React from "react";
import Tree from "lib/components/Tree";
import FolderItems from "lib/components/Folder";

const Folder = () => {
  const router = useRouter(),
    path = ((router.query.path || []) as string[]).join("/");

  return (
    <div style={{ display: "flex" }}>
      <Tree />
      <FolderItems path={path} />
    </div>
  );
};

export default Folder;
