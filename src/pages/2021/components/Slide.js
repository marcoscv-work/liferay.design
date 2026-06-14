/** @jsxImportSource theme-ui */
import { jsx, Flex, Box } from 'theme-ui'
import { withPrefix } from 'gatsby'
import PropTypes from 'prop-types'
import { NiceLink, Icon } from 'components/atoms'

const Slide = ({ title, image, icon, url, linkText, description, type }) => {
	return (
		<Box
			sx={{
				height: '100%',
			}}
		>
			{type === 'card' ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						height: '100%',
						background: theme => `${theme.gradients.backgroundGradient}`,
						borderRadius: '1rem',
					}}
				>
					<Flex
						sx={{
							alignItems: ['center', 'center', 'flex-start'],
							flexDirection: ['column', 'column', 'row'],
							flexGrow: [0, 1],
							maxWidth: '1200px',
							overflow: 'hidden',
							p: ['2rem', '4rem'],
							pb: [0, '4rem'],
							width: ['90vw', '80vw'],
						}}
					>
						<Box
							sx={{
								variant: 'boxes.icon',
								flexShrink: ['0'],
							}}
						>
							<Icon name={icon} />
						</Box>
						<Box
							sx={{
								padding: ['2rem 0', '1rem 1.5rem'],
							}}
						>
							<Box
								as="h2"
								sx={{
									fontSize: 5,
									textAlign: ['center', 'center', 'left'],
								}}
							>
								{title}
							</Box>
							<Box
								as="p"
								sx={{
									// textAlign: 'justify', if I ever see justified text again, so help me
									fontSize: 3,
								}}
							>
								{description}
							</Box>
							{url ? <NiceLink to={url}>{linkText}</NiceLink> : null}
						</Box>
					</Flex>
					<Box
						sx={{
							height: '0',
							pb: '40%',
							position: 'relative',
							width: '100%',
						}}
					>
						<Box
							as="img"
							sx={{
								objectPosition: 'top',
								height: '100%',
								position: 'absolute',
								width: '100%',
								borderRadius: '0 0 1rem 1rem',
							}}
							src={`${withPrefix(`${image}`)}`}
						/>
					</Box>
				</Box>
			) : (
				<Flex
					sx={{
						height: ['70vh', '45vw'], // 3:2 ratio
						objectFit: 'contain',
						position: 'relative',
						width: ['90vw', '80vw'],
					}}
				>
					<Box
						as="img"
						sx={{
							borderRadius: '1rem',
							objectPosition: 'top',
							margin: '0',
							minHeight: '100%',
							minWidth: '100%',
						}}
						src={`${withPrefix(`${image}`)}`}
					/>
				</Flex>
			)}
		</Box>
	)
}

Slide.propTypes = {
	title: PropTypes.string,
	image: PropTypes.string,
	icon: PropTypes.string,
	url: PropTypes.string,
	linkText: PropTypes.string,
	description: PropTypes.string,
	type: PropTypes.string,
}

export default Slide
