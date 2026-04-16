/** @jsx jsx */

import { jsx, Grid } from 'theme-ui'
import { Container, Heading, Link, Flex } from 'components/atoms'
import { CardDefault, SEO } from 'components/molecules'
import { MainLayout } from 'components/templates'
import { graphql } from 'gatsby'
import { headshotPath, makeAuthorSlug } from 'utils'

export default ({ data }) => {
	return (
		<MainLayout section="Team">
			<SEO
				description="Meet the Design.Liferay team — we're all over the world!"
				pageTitle="Design.Liferay | Team"
			/>
			<Container>
				<Flex direction="row" justify="space-between">
					<Heading level={1} sx={{ pb: '4rem', color: 'white' }}>
						The Squad
					</Heading>
					<div style={{ alignSelf: 'baseline', marginTop: '1.8rem' }}>
						<Link
							sx={{
								variant: 'links.tag',
								mx: 2,
							}}
							to={`/alumni`}
						>
							Alumni
						</Link>
					</div>
				</Flex>
				<Grid sx={{ variant: 'grids.threeCards' }}>
					{data.allMdx.edges
						.filter(({ node }) => node.frontmatter.author)
						.map(({ node }, index) => (
						<CardDefault
							delay={`${index}` * 0.1 + 's'}
							key={node.id}
							imageURL={headshotPath(node.frontmatter.author.id)}
							link={'/team/' + makeAuthorSlug(node.frontmatter.author.id)}
							title={node.frontmatter.author.id}
							subtitle={node.frontmatter.author.title}
							icon={node.frontmatter.author.icon}
						/>
					))}
				</Grid>
			</Container>
		</MainLayout>
	)
}

export const query = graphql`
	{
		allMdx(
			filter: {
				fileAbsolutePath: { regex: "/(/team/)/" }
				frontmatter: { author: { active: { eq: true } } }
			}
			sort: { order: ASC, fields: [fields___slug] }
		) {
			totalCount
			edges {
				node {
					id
					frontmatter {
						author {
							id
							title
							icon
						}
					}
					fields {
						slug
					}
					excerpt
				}
			}
		}
	}
`
