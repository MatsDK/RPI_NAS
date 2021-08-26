import { useGetTreeQueryQuery } from "generated/apolloComponents";
import { useApolloClient } from "react-apollo";
import React from "react";
import Link from "next/link";

interface Props {
  path: string;
}

const Folder: React.FC<Props> = ({ path }) => {
  const client: any = useApolloClient();

  const { data, error, loading } = useGetTreeQueryQuery({
    variables: {
      depth: 1,
      path,
    },
    client,
  });

  if (loading) return <div>Loading</div>;

  if (error) return <div>error</div>;

  if (!data?.tree?.tree) return <div>folder not found</div>;

  return (
    <div>
      {data.tree.tree.map((item, idx) =>
        item.isDirectory ? (
          <div key={idx}>
            <Link href={`/path/${item.relativePath}`}>{item.name}</Link>
          </div>
        ) : (
          <div key={idx} style={{ display: "flex" }}>
            <p>{item.name}</p>
            <button
              onClick={() =>
                window
                  ?.open(
                    `http://localhost:4000/download?s=6c9106c0-996f-4905-ade7-3a84d83ca50e`,
                    "_blank"
                  )
                  ?.focus()
              }
            >
              download
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Folder;
