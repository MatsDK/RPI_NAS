import { Node, useGetNodesQueryQuery } from "generated/apolloComponents";
import { Spinner } from "src/ui/Spinner";
import Link from "next/link";
import React from "react";
import { useApolloClient } from "react-apollo";
import styled from "styled-components";
import { NodeRequestsList } from "./NodeRequestsList";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
`

const NodesListWrapper = styled.div`
    max-width: 1440px;
    margin: 0 auto;
`

const NodesList = styled.div`
    padding: 0 50px 20px 50px;
    display: flex;
    flex-direction: column;
`

const NodesListItem = styled.div`
    width: 100%;
    border-bottom: 1px solid ${props => props.theme.lightBgColors[1]};
    padding: 5px 20px;
    min-height: 45px;

    display: flex;
    justify-content: space-evenly;
    align-items: center;

    > span {
        flex: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: ${props => props.theme.textColors[0]};
        display: flex;
        
        > p {
            color: ${props => props.theme.textColors[1]};
        }
    }
`

const Headers = styled.div`
    margin: 50px 50px 0 50px;
    padding: 10px 20px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: 1px solid ${props => props.theme.lightBgColors[2]};

    > span {
        flex: 1;
        font-size: 18px;
        font-weight: 600;
        color: ${props => props.theme.textColors[0]};
    }

`

export const NodesView: React.FC = ({ }) => {
    const client: any = useApolloClient();
    const { data, loading, error } = useGetNodesQueryQuery({ client });

    if (error) {
        console.log(error);
        return null;
    }

    const host = data?.getNodes?.nodes.filter(({ hostNode }) => !!hostNode)[0] as Node

    return (
        <Wrapper>
            {loading ? <Spinner loading={true} /> :
                <NodesListWrapper>
                    <Headers>
                        <span>Name</span>
                        <span>Ip address</span>
                        <span>Token</span>
                    </Headers>
                    <NodesList >
                        {data?.getNodes?.nodes.map(({ name, ip, hostNode }, idx) => (
                            <NodesListItem key={idx}>
                                <span>
                                    {name}{hostNode && <p>(Host)</p>}
                                </span>
                                <span>
                                    {ip}
                                </span>
                                <span>
                                </span>
                            </NodesListItem>
                        ))}
                    </NodesList>
                </NodesListWrapper>
            }
            {!host && (
                <div>
                    <Link href={"/nodes/createhost"}>Create host node</Link>
                </div>
            )}
            <NodeRequestsList host={host} nodeRequests={data?.getNodes?.nodeRequests || []} />
        </Wrapper>
    );
};
