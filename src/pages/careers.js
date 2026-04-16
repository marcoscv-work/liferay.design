/** @jsx jsx */

import { jsx, Grid } from 'theme-ui'
import { Container, Heading } from 'components/atoms'
import { CardDefault, SEO } from 'components/molecules'
import { MainLayout } from 'components/templates'
import { graphql } from 'gatsby'

export default ({ data }) => {
	return (
		<MainLayout section="Careers">
			<SEO
				description="Liferay is looking for designers who are passionate about open source technology — apply today!"
				pageTitle="Design.Liferay | Careers"
			/>
			<Container>
				<Heading level={1} sx={{ pb: '4rem', color: 'white' }}>
					Join the Team!
				</Heading>
				<Grid sx={{ variant: 'grids.threeCards' }}>
					{data.allMdx.edges.map(({ node }, index) => {
						const office = node.frontmatter.office || {}

						return (
						<CardDefault
							delay={`${index}` * 0.1 + 's'}
							avatarImage
							pill
							tag={
								node.frontmatter.remote === true
									? 'Remote Available 😊'
									: null
							}
							key={node.id}
							imageURL={node.frontmatter.featuredImage}
							link={node.fields.slug}
							title={node.frontmatter.title}
							// subtitle={
							// 	node.frontmatter.remote === true
							// 		? node.frontmatter.office.region.countries.map(
							// 				(i, index) => (index ? ' / ' : '') + i,
							// 		  )
							// 		: node.frontmatter.office.city
							// }
							subtitle={
								node.frontmatter.remote === true
									? office.country
									: office.city
							}
							avatarImageURL={
								node.frontmatter.remote === true
									? office.countryIcon
									: office.countryIcon
							}
						/>
						)
					})}
				</Grid>
			</Container>
		</MainLayout>
	)
}

export const query = graphql`
	{
		allMdx(
			filter: {
				fileAbsolutePath: { regex: "/(careers)/" }
				frontmatter: { published: { eq: true } }
			}
			sort: { fields: frontmatter___date, order: ASC }
		) {
			totalCount
			edges {
				node {
					id
					frontmatter {
						title
						office {
							city
							region {
								countries
								countryIcon
							}
							country
							countryIcon
						}
						featuredImage
						remote
					}
					fields {
						slug
					}
				}
			}
		}
	}
`
