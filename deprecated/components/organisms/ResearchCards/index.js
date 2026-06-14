import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Flex, Text, Heading } from 'components/atoms'
import { slugToTitle } from 'utils'

// NOTE (Gatsby 5 / MDX v2): MDX v2 removed the GraphQL `body` field and the
// ability to render another node's MDX inline, so these cards now show the
// entry excerpt. Restoring the full inline content requires rendering each
// research entry as its own MDX page (children) — tracked as a follow-up.
export default ({}) => {
	const data = useStaticQuery(graphql`
		{
			allMdx(
				filter: {
					internal: { contentFilePath: { regex: "/(resources/research)/" } }
				}
			) {
				edges {
					node {
						excerpt(pruneLength: 320)
						fields {
							slug
						}
					}
				}
			}
		}
	`)

	const ResearchCards = data.allMdx.edges.map(({ node }) => (
		<Flex margin="2rem auto">
			<Heading level={2}>
				{slugToTitle('/resources/research/', node.fields.slug)}
			</Heading>
			<Text>{node.excerpt}</Text>
		</Flex>
	))

	return <div>{ResearchCards}</div>
}
