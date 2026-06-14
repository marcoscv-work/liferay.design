/** @jsxImportSource theme-ui */
import { jsx, Flex, Box } from 'theme-ui'
import { Link } from 'components/atoms'
const { kebabCase } = require(`lodash`)

const Tags = ({ tags }) => {
	if (!tags) return null
	const tagLinks = tags.map((tag, i) => {
		const divider = i < tags.length - 1 && <Box as="span" sx={{ mx: 1 }} />
		return (
			<span key={tag}>
				<Link
					sx={{
						variant: 'links.tag',
					}}
					to={`/tags/${kebabCase(tag.toLowerCase())}`}
				>
					{tag}
				</Link>
				{divider}
			</span>
		)
	})
	return <Flex sx={{ my: 2 }}>{tagLinks}</Flex>
}

export default Tags
