require('dotenv').config({
	path: `.env.${process.env.NODE_ENV}`,
})

const dynamicPlugins = []

if (process.env.MAILCHIMP_KEY) {
	dynamicPlugins.push({
		resolve: 'gatsby-source-mailchimp',
		options: {
			campaignFields: [
				'campaigns.archive_url',
				'campaigns.settings.title',
				'campaigns.settings.subject_line',
				'campaigns.settings.preview_text',
				'campaigns.send_time',
				'campaigns.emails_sent',
			],
			contentFields: ['archive_html'],
			nodeType: 'Newsletters',
			key: process.env.MAILCHIMP_KEY,
			rootURL: 'https://us7.api.mailchimp.com/3.0',
		},
	})
}

module.exports = {
	// Gatsby 5 changed the default to 'always'; use 'ignore' (the legacy-equivalent) so existing
	// URLs (and redirects) stay byte-for-byte identical
	trailingSlash: 'ignore',
	siteMetadata: {
		title: 'Design.Liferay',
		author: 'Paul Hanaoka',
		description:
			'Blogs, careers, guidelines, and other resources from the Design Teams at Liferay!',
	},
	plugins: [
		{
			resolve: `gatsby-plugin-algolia-docsearch`,
			options: {
				apiKey: 'e743f8519124b276f2f3325e8e126246',
				indexName: 'liferay_design',
				inputSelector: '#lexicon_search',
				debug: false,
			},
		},
		'gatsby-plugin-catch-links',
		`gatsby-plugin-netlify-cms`,
		'gatsby-plugin-react-helmet',
		'gatsby-plugin-resolve-src',
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `Liferay Design`,
				short_name: `Design.Liferay`,
				background_color: `#FFF`,
				theme_color: `#0b5fff`,
				icon: `src/images/favicon.svg`,
			},
		},
		'gatsby-plugin-offline',
		{
			resolve: 'gatsby-plugin-sass',
			options: {
				// Keep Gatsby 2 behavior: default-export CSS module class maps
				// (79 components import styles via `import styles from '*.module.scss'`)
				cssLoaderOptions: {
					esModule: false,
					modules: {
						namedExport: false,
					},
				},
			},
		},
		'gatsby-plugin-sharp',
		`gatsby-plugin-theme-ui`,
		`gatsby-transformer-json`,
		'gatsby-transformer-sharp',
		{
			resolve: `gatsby-plugin-typography`,
			options: {
				pathToConfigModule: `src/utils/typography`,
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'src',
				path: './src',
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				path: `${__dirname}/src/images`,
				name: 'images',
			},
		},
		`gatsby-transformer-yaml`,
		{
			resolve: 'gatsby-plugin-mdx',
			options: {
				extensions: ['.mdx', '.md'],
				gatsbyRemarkPlugins: [
					{
						resolve: 'gatsby-remark-images',
						options: {
							maxWidth: 768,
							withWebp: true,
							quality: 96,
							backgroundColor: 'transparent',
							disableBgImageOnAlpha: true,
							wrapperStyle: 'margin-bottom: 2em; margin-top: 1em;',
						},
					},
					{
						resolve: `gatsby-remark-image-attributes`,
						options: {
							dataAttributes: true,
						},
					},
					{
						resolve: 'gatsby-remark-static-images',
					},
					{
						resolve: 'gatsby-remark-autolink-headers',
						options: {
							offsetY: `200`,
							className: `nice-anchor`,
						},
					},
					{
						resolve: 'gatsby-remark-external-links',
					},
					{
						resolve: `gatsby-plugin-catch-links`,
					},
				],
			},
		},
		{
			resolve: `gatsby-plugin-typescript`,
			// options: { // commenting these out until I figure out what's best
			// 	isTSX: true, // defaults to false
			// 	jsxPragma: `jsx`, // defaults to "React"
			// 	allExtensions: true, // defaults to false
			// },
		},
	].concat(dynamicPlugins),

	// Gatsby 4: gatsby-transformer-yaml exposes the YAML `id` field as
	// `yamlId` (the `id` field is now Gatsby's internal UUID), so every
	// foreign-key mapping must target `.yamlId`
	mapping: {
		'MarkdownRemark.frontmatter.author': `AuthorsYaml.yamlId`,
		'Mdx.frontmatter.author': `AuthorsYaml.yamlId`,
		'AuthorsYaml.office': `OfficesYaml.yamlId`,
		'CountriesYaml.hq': `OfficesYaml.yamlId`,
		'OfficesYaml.region': `CountriesYaml.yamlId`,
		'MarkdownRemark.frontmatter.office': `OfficesYaml.yamlId`,
		'Mdx.frontmatter.office': `OfficesYaml.yamlId`,
		'ChangelogYaml.author': `AuthorsYaml.yamlId`,
		'AnnualReportsYaml.promotionsPage.designers.name': `AuthorsYaml.yamlId`,
		'ChangelogYaml.contributors': `AuthorsYaml.yamlId`,
		'Mdx.frontmatter.contributors': `AuthorsYaml.yamlId`,
	},
}
