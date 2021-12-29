import styled from "styled-components";

export default {
	Wrapper: styled.div`
		width: 100%;
		height: 100%;
	`,
	Container: styled.div`
		max-width: 1400px;
		margin: 0 auto;
	`,
	PagePath: styled.div`
		padding: 50px 50px 20px 50px;
		display: flex;
		align-items: center;

		> svg {
			margin: 3px 2px 0  10px;

			:first-child {
				margin-left: 0;
			}
		}

		> span {
			color: ${props => props.theme.textColors[1]};
			font-size: 20px;

			:nth-child(2) {
				cursor: pointer;

				:hover {
					text-decoration: underline;
				}
			}

			:last-child {
				color: ${props => props.theme.textColors[0]};
				font-weight: 600;
			}

		}
	`
}