import { getDataStoresQuery } from 'graphql/DataStores/getDataStores';
import { InitializeUserMutation } from 'graphql/DataStores/InitializeUser';
import React, { useState } from 'react'
import { useApollo } from 'src/hooks/useApollo';
import { useInput } from 'src/hooks/useInput';
import { BgButton, ConditionButton, LoadingOverlay } from 'src/ui/Button';
import { Input, Label } from 'src/ui/Input';
import styled from 'styled-components';

interface InitializeUserFormProps {
	datastoreId: number
	datastoreName: string
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;

	> span {
		color: ${props => props.theme.textColors[1]};
	}

	> div {
		display: flex;
		align-items: center;

		button {
			margin-left: 10px;
		}
	}
`

const Title = styled.h1`
	color: ${props => props.theme.textColors[0]};
	font-size: 25px;
	font-weight: 600;
`

export const InitializeUserForm: React.FC<InitializeUserFormProps> = ({ datastoreName, datastoreId }) => {
	const { mutate } = useApollo()
	const [passwordInput, setPasswordInput] = useInput("")
	const [loading, setLoading] = useState(false)

	const submit = async () => {
		if (!passwordInput.trim()) return

		try {
			setLoading(true)
			const { data, errors } = await mutate(
				InitializeUserMutation,
				{ password: passwordInput.trim(), datastoreId },
				{ refetchQueries: [{ query: getDataStoresQuery, variables: {} }] }
			)
			setLoading(false)

			if (errors) {
				console.log(errors)
				return
			}

			console.log(data)
		} catch (e) {
			console.log(e)
			setLoading(false)
		}
	}

	return (
		<Wrapper>
			<Title>Initialize user</Title>
			<span>Input your password to use {datastoreName}</span>
			<Label>Password</Label>
			<div>
				<Input
					value={passwordInput}
					onChange={setPasswordInput}
					placeholder="Password"
					type="password"
				/>
				<ConditionButton condition={!!passwordInput.trim()}>
					<LoadingOverlay loading={loading}>
						<BgButton onClick={submit}>Initialize</BgButton>
					</LoadingOverlay>
				</ConditionButton>
			</div>
		</Wrapper>
	);
}