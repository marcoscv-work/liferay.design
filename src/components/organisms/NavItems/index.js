/** @jsx jsx */

import { jsx, NavLink, Flex, Box } from 'theme-ui'
import { AuthContainer } from 'components/molecules'

const PAGES = ['Lexicon', 'Articles', 'Events', 'Team', 'Handbook']

const NavItems = () => {
	return (
		<Flex align="center">
			<Flex
				as="ul"
				sx={{
					alignItems: 'center',
					listStyle: 'none',
					margin: 0,
					padding: 0,
					'@media screen and (max-width: 800px)': {
						overflow: 'scroll',
						position: 'fixed',
						bg: 'black',
						bottom: 0,
						left: 0,
						right: 0,
						px: 2,
						py: 2,
						'&::after': {
							display: ['block', null, 'none'],
							content: '""',
							height: '4.2rem',
							width: 3,
							background:
								'linear-gradient(to right, rgba(19, 20, 31, 0), rgba(19, 20, 31, 0.9))',
							position: 'fixed',
							right: 0,
							bottom: 0,
						},
					},
				}}
			>
				{PAGES.map(item => (
					<Box as="li" key={item} sx={{ listStyle: 'none' }}>
						<NavLink
							activeStyle={{
								color: 'white',
							}}
							href={'/' + item.toLowerCase()}
						>
							{item}
						</NavLink>
					</Box>
				))}
			</Flex>

			{/* <AuthContainer /> */}
		</Flex>
	)
}

export default NavItems
