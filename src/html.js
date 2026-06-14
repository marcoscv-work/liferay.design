import PropTypes from 'prop-types'
import React, { StrictMode } from 'react'
import { GoogleFont } from 'react-typography'
import typography from 'utils/typography'

export default class HTML extends React.Component {
	render() {
		const seoDescription =
			'Liferay Design | Articles, Events, and Resources for the Open Source Design Community'
		return (
			<html lang="en" prefix="og: http://ogp.me/ns#" {...this.props.htmlAttributes}>
				<head>
					<meta name="Description" content={seoDescription}></meta>
					<meta charSet="utf-8" />
					<meta httpEquiv="x-ua-compatible" content="ie=edge" />
					<GoogleFont typography={typography} />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1, shrink-to-fit=no"
					/>
					<title>{seoDescription}</title>

					{this.props.headComponents}
          <script src="https://cdn.usefathom.com/script.js" integrity="sha384-K7To5/+kH06F3upkX8HG8oY/qc2dtF2zk/kWhbKI4FgKlHYIogq0oftSeWXTX4xn" crossOrigin="anonymous" data-spa="auto" data-site="LYRINPGJ" defer></script>
				</head>
				<body {...this.props.bodyAttributes}>
					<a className="skip-link" href="#main-content">
						Skip to content
					</a>
					<StrictMode>
						{this.props.preBodyComponents}

						<div
							key={`body`}
							id="___gatsby"
							dangerouslySetInnerHTML={{ __html: this.props.body }}
						/>

						{this.props.postBodyComponents}
					</StrictMode>
				</body>
			</html>
		)
	}
}

HTML.propTypes = {
	htmlAttributes: PropTypes.object,
	headComponents: PropTypes.array,
	bodyAttributes: PropTypes.object,
	preBodyComponents: PropTypes.array,
	body: PropTypes.string,
	postBodyComponents: PropTypes.array,
}
