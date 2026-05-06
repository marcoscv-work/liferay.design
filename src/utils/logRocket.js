import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

export class LogRocket extends Component {
	componentDidMount() {
		window.LogRocket && window.LogRocket.init('vvepjf/liferaydesign')
	}

	render() {
		return (
			<Helmet>
				<script
					src="https://cdn.lr-ingest.io/LogRocket.min.js"
					integrity="sha384-b0XbgzE6J/qtc+4HLtAb/hJlDBpi4wFgJu6KmnqBMSxJQG0VrkHjKb+DDaxpAjdN"
					crossorigin="anonymous"
				/>
			</Helmet>
		)
	}
}

export default LogRocket
