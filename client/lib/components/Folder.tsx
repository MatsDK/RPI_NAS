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
          <div key={idx}>{item.name}</div>
        )
      )}
    </div>
  );
};

export default Folder;
