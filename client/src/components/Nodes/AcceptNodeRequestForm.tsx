import { AcceptNodeRequestMutation } from "graphql/Node/acceptNodeRequest"
import { getNodesQuery } from "graphql/Node/getNodes"
import React, { useState } from "react"
import { useApollo } from "src/hooks/useApollo"
import { useInput } from "src/hooks/useInput"
import { Input, Label } from "src/ui/Input"
import styled from "styled-components"
import { BgButton, ConditionButton, LoadingOverlay } from "../../ui/Button"

interface AcceptNodeRequest {
	id: number
	hostLoginName: string
}

const Form = styled.form`
	display: flex;
	flex-direction: column;

	> div {
		display: flex;


		> div {
			display: flex;

			flex-direction: column;
			
			:first-child {
				margin-right: 45px;
			}
		}
	}
`

const SubmitButton = styled.div`
	margin-top: 15px;
`

export const AcceptNodeRequestForm: React.FC<AcceptNodeRequest> = ({ id, hostLoginName }) => {
	const { mutate } = useApollo()

	const [name, setName] = useInput("")
	const [loginName, setLoginName] = useInput(hostLoginName)
	const [password, setPassword] = useInput("")

	const [loading, setLoading] = useState(false)

	const acceptRequest = async () => {
		try {
			setLoading(true)
			const res = await mutate(AcceptNodeRequestMutation, {
				id,
				name,
				loginName,
				password
			}, { refetchQueries: [{ query: getNodesQuery, variables: {} }] })
			setLoading(false)
			console.log(res)

			if (!res.data.acceptNodeRequest) {
				console.log(res)
			}
		} catch (e) {
			console.log(e)
			setLoading(false)

		}
	}

	return <Form onSubmit={acceptRequest}>
		<Label>Datastore name</Label>
		<Input placeholder="Name" value={name} onChange={setName} />
		<div>
			<div>
				<Label>Login name</Label>
				<Input placeholder="loginName" value={loginName} onChange={setLoginName} />
			</div>
			<div>
				<Label>Password</Label>
				<Input type="password" placeholder="pasword" value={password} onChange={setPassword} />
			</div>
		</div>
		<SubmitButton>
			<LoadingOverlay loading={loading}>
				<ConditionButton condition={!!(name.trim() && loginName.trim() && password.trim())}>
					<BgButton type="submit">Accept</BgButton>
				</ConditionButton>
			</LoadingOverlay>
		</SubmitButton>
	</Form>
}

