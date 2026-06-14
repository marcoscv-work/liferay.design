/** @jsxImportSource theme-ui */
import { jsx, Flex, Text, Box } from 'theme-ui'
import { Component } from 'react'

import data from 'markdown/annual-reports/TwentyTwenty.yaml'

export default class FancyFooter extends Component {
	componentDidMount() {
		document.body.style.marginBottom = '100vh'
	}

	componentWillUnmount() {
		document.body.style.marginBottom = '0'
	}

	render() {
		const quote = data.promotionsPage.quote

		return (
			<Box
				sx={{
					width: '100%',
					height: '72vh',
					bottom: 0,
					position: 'fixed',
					zIndex: -1,
				}}
			>
				<Flex
					sx={{
						margin: '16vh auto',
						flexDirection: 'column',
						textAlign: 'center',
						fontSize: [5, 7, null],
						fontWeight: 'heading',
					}}
				>
					<Text sx={{ color: 'primaryl2', mb: 4 }}>{quote.content}</Text>
					<Text
						sx={{
							fontSize: '.3em',
							variant: 'text.caps',
							letterSpacing: '.5ch',
						}}
					>
						{quote.author}
					</Text>
				</Flex>
			</Box>
		)
	}
}
