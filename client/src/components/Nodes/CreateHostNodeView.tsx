import React from 'react'
import Components from './CreateHostNodeView.styles';
import Link from "next/link"
import { CreateHostNodeForm } from "./CreateHostNodeForm";
import Icon from 'src/ui/Icon';

const { Wrapper, PagePath, Container } = Components

interface CreateHostNodeViewProps { }

export const CreateHostNodeView: React.FC<CreateHostNodeViewProps> = ({ }) => {
	return (
		<Wrapper>
			<Container>
				<PagePath>
					<Icon name='slashIcon' width={10} height={20} color={{ propName: "textColors", idx: 2 }} />
					<Link href="/nodes">
						<span>Nodes</span>
					</Link>
					<Icon name='slashIcon' width={10} height={20} color={{ propName: "textColors", idx: 2 }} />
					<span>Create host node</span>
				</PagePath>
				<CreateHostNodeForm />
			</Container>
		</Wrapper>
	);
}