const path = require(`path`)
const fs = require(`fs`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const _ = require('lodash')
const moment = require(`moment`)

// Skip production source maps: trims build time and deploy payload
// (Netlify deploys were hitting the build time limit on cold caches)
exports.onCreateWebpackConfig = ({ stage, actions, plugins }) => {
	if (stage === 'build-javascript') {
		actions.setWebpackConfig({ devtool: false })
	}
	// react-anchor-link-smooth-scroll ships a UMD bundle that expects a
	// global `React`, which doesn't exist during Gatsby 5 SSR — provide it.
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

	const newsletters = graphql(`
		{
			mailchimp: allNewsletters(
				filter: {
					settings: { title: { regex: "/Newsletter/" } }
					emails_sent: { gt: 20 }
				}
			) {
				edges {
					node {
						archive_url
						archive_html
						settings {
							title
							subject_line
							preview_text
						}
						emails_sent
						send_time
					}
				}
			}
		}
	`).then(({ data, errors }) => {
		if (errors) {
			console.log(
				'Error creating newsletter pages in `createPages` call ==>',
				errors,
			)

			return Promise.reject(errors)
		}

		const newsletters = data.mailchimp.edges
		newsletters.forEach(({ node }) => {
			const templateFile = path.resolve(
				`./src/components/templates/Newsletters/index.js`,
			)

			const slug = `${moment(node.send_time).format('YYYY-MM')}`

			createPage({
				path: '/newsletter/' + slug,
				component: templateFile,
				context: {
					slug: slug,
					send_time: node.send_time,
				},
			})
		})
	})

	return Promise.all([markdown, newsletters])
}

function capFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

// Called after every page is created.
// This section is used for client only gated routes like blueprints pages
exports.onCreatePage = async ({ page, actions }) => {
	const { createPage } = actions

	var pageMap = {
		['blueprints']: ['blueprints'],
		['handbook']: ['handbook'],
	}

	for (key in pageMap)
		if (page.path.match(/^\/pageMap[key]/)) {
			page.matchPath = '/key/*'

			// Update the page.
			createPage(page)
		}
}

exports.createSchemaCustomization = ({ actions, schema }) => {
	const { createTypes } = actions

	// Gatsby 5 / MDX v2 dropped the built-in `timeToRead` field; re-add it so
	// the "X Min Read" badges keep working (computed in createResolvers).
	const typeDefs = [
		`type Mdx implements Node {
			timeToRead: Int
		}`,
	]

	if (!process.env.MAILCHIMP_KEY) {
		typeDefs.push(
			`
				enum NewslettersSortOrder {
						ASC
						DESC
					}
					input NewslettersSortArgs {
						send_time: NewslettersSortOrder
					}
			`,
			schema.buildObjectType({
				fields: {
					edges: '[EdgesNewsletter]',
				},
				interfaces: ['Node'],
				name: 'Newsletter',
			}),
			schema.buildObjectType({
				fields: {
					next: 'NodeNewsletter',
					node: 'NodeNewsletter',
					previous: 'NodeNewsletter',
				},
				name: 'EdgesNewsletter',
			}),
			schema.buildObjectType({
				fields: {
					archive_html: 'String',
					archive_url: 'String',
					emails_sent: 'String',
					send_time: {
						args: { formatString: 'String' },
						type: 'Date',
					},
					settings: 'NodeSettings',
				},
				name: 'NodeNewsletter',
			}),
			schema.buildObjectType({
				fields: {
					preview_text: 'String',
					subject_line: 'String',
					title: 'String',
				},
				name: 'NodeSettings',
			}),
			schema.buildInputObjectType({
				fields: {
					emails_sent: 'JSON',
					send_time: 'JSON',
					settings: 'JSON',
				},
				name: 'InputFilter',
			}),
		)
	}

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

	if (!process.env.MAILCHIMP_KEY) {
		resolvers.Query = {
			allNewsletters: {
				type: 'Newsletter',
				args: {
					filter: 'InputFilter',
					sort: 'NewslettersSortArgs',
				},
				resolve() {
					return { edges: [] }
				},
			},
		}
	}

	createResolvers(resolvers)
}
