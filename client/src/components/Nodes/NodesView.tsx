import { Node, useGetNodesQueryQuery } from "generated/apolloComponents";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useApolloClient } from "react-apollo";
import { Scrollbar } from "src/ui/Scrollbar";
import { Spinner } from "src/ui/Spinner";
import styled from "styled-components";
import { NodeRequestsList } from "./NodeRequestsList";

const Wrapper = styled.div`
    padding: 25px 0 0 30px;
    height: 100%;
    min-width: 620px;
`

const NodesList = styled.div`
    overflow: auto;
    height: calc(100% - 115px);

    ${Scrollbar}
    display: flex;
    flex-direction: column;
`

const NodesListItem = styled.div`
    padding: 15px;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid ${(props) => props.theme.textColors[3]};
`

const NameSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    > span {
        display: flex;
        align-items: baseline;
        color: ${props => props.theme.textColors[0]};
        font-size: 18px;

        :first-child {
            font-size: 22px;
            font-weight: 700;

            > p {
                font-size: 18px;
                font-weight: normal;
            }
        }

        > p {
            color: ${props => props.theme.textColors[1]};
            margin: 0 4px;
        }
    }
`

interface StatusProps {
    status: boolean
}

const Status = styled.span<StatusProps>`
    color: ${props => props.theme.statusColors[props.status ? 1 : 2]} !important;
    font-weight: 600;

    > p {
        font-weight: normal;
    }
`

const IpSection = styled.div`
    display: flex;
    align-items: center;
    padding: 5px;

    > span {
        color: ${props => props.theme.textColors[1]};
        font-size: 17px;
        display: flex;
        
        :first-child {
            margin-right: 30px;
        }

        > p {
            margin-left: 4px;
            color: ${props => props.theme.textColors[0]};
            font-weight: 600;
        }
    }
`

const Header = styled.div`
    border-bottom: 1px solid ${(props) => props.theme.textColors[3]};
    display: flex;
    justify-content: space-between;
    padding-bottom: 15px;
`

const Title = styled.h1`
    font-weight: 500;
    margin-right: 3px;
    color: ${props => props.theme.textColors[0]};
    font-size: 25px;
    display: flex;
    align-items: baseline;
    
    > span {
        margin-left: 5px;
        display: flex;
        font-size: 14px;
        color: ${(props) => props.theme.textColors[2]};
        font-weight: normal;

        > p {
            font-weight: 500;
            margin-right: 3px;
        }
    }
`

export const NodesView: React.FC = ({ }) => {
    const router = useRouter()
    const client: any = useApolloClient();
    const { data, loading, error } = useGetNodesQueryQuery({ client });

    if (error) {
        console.log(error);
        return null;
    }

    const host = data?.getNodes?.nodes.filter(({ hostNode }) => !!hostNode)[0] as Node

    useEffect(() => {
        if (!loading && !host) router.push("/nodes/createhost")

        return () => { }
    }, [host, loading])

    return (
        <Wrapper>
            {loading ? <Spinner loading={true} /> :
                <>
                    <Header>
                        <Title>Nodes <span><p>{data?.getNodes?.nodes.length}</p> Node{data?.getNodes?.nodes.length != 1 && "s"}</span></Title>
                    </Header>
                    <NodesList >
                        {data?.getNodes?.nodes.map(({ name, ip, port, hostNode, pingResult }, idx) => (
                            <NodesListItem key={idx}>
                                <NameSection>
                                    <span>
                                        {name}{hostNode && <p>(Host)</p>}
                                    </span>
                                    <Status status={pingResult}><p>Status: </p>{pingResult ? "Online" : "Offline"}</Status>
                                </NameSection>
                                <IpSection>
                                    <span>Ip: <p>{ip}</p></span>
                                    <span>Port: <p>{port}</p></span>
                                </IpSection>
                            </NodesListItem>
                        ))}
                    </NodesList>
                </>
            }
            {
                !host && (
                    <div>
                        <Link href={"/nodes/createhost"}>Create host node</Link>
                    </div>
                )
            }
            <NodeRequestsList host={host} nodeRequests={data?.getNodes?.nodeRequests || []} />
        </Wrapper >
    );
};
