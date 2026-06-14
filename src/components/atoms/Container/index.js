/** @jsxImportSource theme-ui */
import { jsx, Flex, Box } from 'theme-ui'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import { Heading, NiceLink } from 'components/atoms'

const Container = ({
	style,
	banner,
	children,
	background,
	padding,
	linkDestination,
	linkText,
	heading,
	...props
}) => {
	return (
		<Box
			className={styles.wrapper}
			sx={{ background: `${background}`, ...padding, ...style }}
		>
			<div className={styles.container}>
				<Flex sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
					{heading ? (
						<Heading
							sx={{
								color: 'white',
								py: 4,
							}}
							level={2}
							{...props}
						>
							{heading}
						</Heading>
					) : null}
					{linkText ? (
						<NiceLink to={linkDestination}>{linkText}</NiceLink>
					) : null}
				</Flex>
				{children}
			</div>
			{banner ? <Box sx={{ background: 'white', padding: 4 }} /> : null}
		</Box>
	)
}

Container.propTypes = {
	children: PropTypes.node,
	heading: PropTypes.string,
	padding: PropTypes.object,
	background: PropTypes.string,
	linkDestination: PropTypes.string,
	linkText: PropTypes.string,
}

export default Container
