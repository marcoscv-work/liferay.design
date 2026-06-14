const path = require(`path`)
const fs = require(`fs`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const _ = require('lodash')

// Skip production source maps: trims build time and deploy payload
// (Netlify deploys were hitting the build time limit on cold caches)
exports.onCreateWebpackConfig = ({ stage, actions, plugins }) => {
	if (stage === 'build-javascript') {
		actions.setWebpackConfig({ devtool: false })
	}
	// Our components compile JSX to classic `React.createElement`, but several
	// don't `import React` (they relied on the old global). Provide it so SSR
	// doesn't hit "React is not defined".
	actions.setWebpackConfig({
		plugins: [plugins.provide({ React: 'react' })],
	})
}

exports.onCreateNode = ({ node, getNode, actions }) => {
	const { createNodeField } = actions

	if (node.internal.type === 'Mdx') {
		const slug = createFilePath({ node, getNode }).replace('/markdown/', '/')

		createNodeField({
			node,
			name: 'slug',
			value: slug,
		})
	}
}

exports.createPages = ({ actions, graphql }) => {
	const { createPage } = actions

	const markdown = graphql(`
		{
			development: allMdx {
				edges {
					node {
						id
						fields {
							slug
						}
						frontmatter {
							tags
						}
						internal {
							contentFilePath
						}
					}
				}
			}
			production: allMdx(filter: { frontmatter: { publish: { ne: false } } }) {
				edges {
					node {
						id
						fields {
							slug
						}
						frontmatter {
							tags
						}
						internal {
							contentFilePath
						}
					}
				}
			}
		}
	`).then(({ data, errors }) => {
		if (errors) {
			console.log('Error creating markdown pages in `createPages` call ==>', errors)
			throw errors
		}
		const environment = process.env.NODE_ENV

		const pages = data[environment].edges

		pages.forEach(({ node }) => {
			const template = node.fields.slug.split('/')[1]

			const templateFile = path.resolve(
				`./src/components/templates/${capFirstLetter(template)}/index.js`,
			)

			createPage({
				path: node.fields.slug,
				component: `${templateFile}?__contentFilePath=${node.internal.contentFilePath}`,
				context: {
					slug: node.fields.slug,
					id: node.id,
				},
			})
		})
		const tagTemplate = path.resolve('src/components/templates/Tags/index.js')
		// Tag pages:
		let tags = []
		// Iterate through each post, putting all found tags into `tags`
		_.each(pages, edge => {
			if (_.get(edge, 'node.frontmatter.tags')) {
				tags = tags.concat(edge.node.frontmatter.tags)
			}
		})
		// Eliminate duplicate tags
		tags = _.uniq(tags)
		// Make tag pages
		tags.forEach(tag => {
			createPage({
				path: `/tags/${_.kebabCase(tag)}/`,
				component: tagTemplate,
				context: {
					tag,
				},
			})
		})
	})

	return markdown
}

function capFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

exports.createSchemaCustomization = ({ actions }) => {
	const { createTypes } = actions

	// Gatsby 5 / MDX v2 dropped the built-in `timeToRead` field; re-add it so
	// the "X Min Read" badges keep working (computed in createResolvers).
	const typeDefs = [
		`type Mdx implements Node {
			timeToRead: Int
		}`,
	]

	createTypes(typeDefs)
}

exports.createResolvers = ({ createResolvers }) => {
	const resolvers = {
		Mdx: {
			// Re-implements Gatsby's removed timeToRead: read the source file,
			// drop frontmatter, count words at ~200 wpm.
			timeToRead: {
				type: 'Int',
				resolve(source) {
					try {
						const filePath =
							source.internal && source.internal.contentFilePath
						if (!filePath) return 1
						let text = fs.readFileSync(filePath, 'utf8')
						text = text.replace(/^---[\s\S]*?---/, '')
						const words = (text.match(/\S+/g) || []).length
						return Math.max(1, Math.ceil(words / 200))
					} catch (e) {
						return 1
					}
				},
			},
		},
	}

	createResolvers(resolvers)
}
