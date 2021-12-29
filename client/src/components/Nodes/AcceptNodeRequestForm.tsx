import { AcceptNodeRequestMutation } from "graphql/Node/acceptNodeRequest"
import { getNodesQuery } from "graphql/Node/getNodes"
import React from "react"
import { useApollo } from "src/hooks/useApollo"
import { useInput } from "src/hooks/useInput"
import { ConditionButton } from "../../ui/Button"

interface AcceptNodeRequest {
	id: number
	hostLoginName: string
}

export const AcceptNodeRequestForm: React.FC<AcceptNodeRequest> = ({ id, hostLoginName }) => {
	const { mutate } = useApollo()

	const [name, setName] = useInput("")
	const [loginName, setLoginName] = useInput(hostLoginName)
	const [password, setPassword] = useInput("")

	const acceptRequest = async () => {
		const res = await mutate(AcceptNodeRequestMutation, {
			id,
			name,
			loginName,
			password
		}, { refetchQueries: [{ query: getNodesQuery, variables: {} }] })

		if (!res.data.acceptNodeRequest) {
			console.log(res)
		}
	}

	return <form onSubmit={acceptRequest}>
		<input placeholder="Name" value={name} onChange={setName} />
		<input placeholder="loginName" value={loginName} onChange={setLoginName} />
		<input placeholder="pasword" value={password} onChange={setPassword} />
		<ConditionButton condition={!!(name.trim() && loginName.trim() && password.trim())}>
			<button type="submit">Accept</button>
		</ConditionButton>
	</form>
}

