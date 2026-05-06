const React = require('react')

const DOCSEARCH_VERSION = '2.6.3'
const DOCSEARCH_BASE = `https://cdn.jsdelivr.net/npm/docsearch.js@${DOCSEARCH_VERSION}/dist/cdn`

const CSS_SRI = 'sha384-m2ikRCzP5EF96BXBKTjWxBJqZRlS6qNhm7+rE2Rvl8fIkEANrThfw+EVyeePWhM4'
const JS_SRI = 'sha384-8uEk67aWSZHvjtAX9hf2AB+KzYcssy31vRRTi9oP81zHtyIj7PQGAykGbQpB1L2J'

exports.onRenderBody = ({ setHeadComponents }) => {
	setHeadComponents([
		React.createElement('link', {
			key: 'docsearch-css',
			rel: 'stylesheet',
			href: `${DOCSEARCH_BASE}/docsearch.min.css`,
			integrity: CSS_SRI,
			crossOrigin: 'anonymous',
		}),
		React.createElement('script', {
			key: 'docsearch-js',
			src: `${DOCSEARCH_BASE}/docsearch.min.js`,
			integrity: JS_SRI,
			crossOrigin: 'anonymous',
		}),
	])
}
